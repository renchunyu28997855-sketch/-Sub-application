/**
 * 高效技能系统 - 全技能覆盖
 *
 * 设计思路：
 * 1. 所有技能都有分类，确保都能高效执行
 * 2. 技能分类：
 *    - TEMPLATE: 纯规则处理，0成本
 *    - HYBRID: 自动判断，简单走规则，复杂走LLM
 *    - LLM: 必须LLM（创意/推理类）
 * 3. 简单技能用规则快速处理，省token省费用
 * 4. 复杂技能智能分流
 */

import { Skill } from './types';

// ==================== 类型定义 ====================

export enum SkillType {
  /** 模板型：纯规则，不调LLM */
  TEMPLATE = 'template',
  /** 混合型：自动判断，简单走规则，复杂走LLM */
  HYBRID = 'hybrid',
  /** LLM型：必须调用LLM */
  LLM = 'llm',
}

export enum StepStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

export interface WorkflowContext {
  skill: Skill;
  input: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  collectedData: Record<string, unknown>;
  skillType: SkillType;
}

export interface StepResult {
  success: boolean;
  output?: string;
  data?: Record<string, unknown>;
  error?: string;
  continue?: boolean;
  requiresLLM?: boolean;
}

export interface ExecuteResult {
  type: SkillType;
  /** 输出内容 */
  output: string;
  /** 执行步骤（用于调试/展示） */
  steps?: Array<{ id: string; status: StepStatus; output?: string }>;
  /** 需要LLM时的上下文 */
  llmContext?: {
    systemPrompt: string;
    userInput: string;
    collectedData: Record<string, unknown>;
  };
}

// ==================== 技能分类注册表 ====================

/**
 * 全技能分类配置
 * 格式: 'skillId': SkillType
 */
const skillTypeRegistry: Record<string, SkillType> = {

  // ========== 模板型 (TEMPLATE) ==========
  // 特点：纯规则处理，输入→解析→输出，0 LLM调用

  /** 摘要提取 */
  'summarizer': SkillType.TEMPLATE,

  /** 语法检查 */
  'grammar-check': SkillType.TEMPLATE,

  /** SEO优化 */
  'seo-optimizer': SkillType.TEMPLATE,

  /** Excel公式生成 */
  'excel-formula': SkillType.TEMPLATE,

  /** 翻译 */
  'translator': SkillType.TEMPLATE,

  /** 本地化适配 */
  'localization': SkillType.TEMPLATE,

  // ========== LLM型 (LLM) ==========
  // 特点：必须LLM处理，创意/推理类任务

  /** 品牌故事 - 创意写作 */
  'brand-story': SkillType.LLM,

  /** 创意写作 */
  'creative-writing': SkillType.LLM,

  /** 营销文案 */
  'copywriter': SkillType.LLM,

  /** 博客文章 */
  'blog-writer': SkillType.LLM,

  /** 产品描述 */
  'product-desc': SkillType.LLM,

  /** 社交媒体帖子 */
  'social-post': SkillType.LLM,

  /** 数据分析 */
  'data-analyst': SkillType.LLM,

  /** 统计模型 */
  'stats-model': SkillType.LLM,

  /** 编码导师 */
  'coding-tutor': SkillType.LLM,

  /** 创意建议 */
  'logo-ideation': SkillType.LLM,

  /** 插画选择 */
  'illustration-picker': SkillType.LLM,

  /** 海报布局 */
  'poster-layout': SkillType.LLM,

  /** 简历优化 */
  'resume-optimize': SkillType.LLM,

  // ========== 混合型 (HYBRID) ==========
  // 特点：自动判断，简单结构化输入走规则，自由输入走LLM

  // --- 商业类 ---
  'biz-plan': SkillType.HYBRID,
  'competitor-analysis': SkillType.HYBRID,
  'contract-review': SkillType.HYBRID,
  'decision-matrix': SkillType.HYBRID,
  'financial-analysis': SkillType.HYBRID,
  'growth-hacking': SkillType.HYBRID,
  'investment-eval': SkillType.HYBRID,
  'marketing-plan': SkillType.HYBRID,
  'meeting-notes': SkillType.HYBRID,
  'okr-helper': SkillType.HYBRID,
  'prd-writer': SkillType.HYBRID,
  'pricing-strategy': SkillType.HYBRID,
  'project-plan': SkillType.HYBRID,
  'retention-analysis': SkillType.HYBRID,
  'risk-assessment': SkillType.HYBRID,
  'user-research': SkillType.HYBRID,

  // --- 数据类 ---
  'ab-test': SkillType.HYBRID,
  'bi-report': SkillType.HYBRID,
  'chart-designer': SkillType.HYBRID,
  'data-cleaner': SkillType.HYBRID,
  'data-dict': SkillType.HYBRID,
  'data-migrate': SkillType.HYBRID,
  'data-viz-story': SkillType.HYBRID,
  'report-generator': SkillType.HYBRID,
  'sql-query': SkillType.HYBRID,

  // --- 设计类 ---
  'brand-design': SkillType.HYBRID,
  'color-scheme': SkillType.HYBRID,
  'design-system': SkillType.HYBRID,
  'font-pairing': SkillType.HYBRID,
  'icon-picker': SkillType.HYBRID,
  'ui-feedback': SkillType.HYBRID,
  'ux-review': SkillType.HYBRID,
  'slide-deck': SkillType.HYBRID,
  'presentation-maker': SkillType.HYBRID,
  'animation-guide': SkillType.HYBRID,
  'mockup-generator': SkillType.HYBRID,
  'visual-identity': SkillType.HYBRID,

  // --- 教育类 ---
  'essay-review': SkillType.HYBRID,
  'exam-prep': SkillType.HYBRID,
  'flashcard-generator': SkillType.HYBRID,
  'knowledge-explainer': SkillType.HYBRID,
  'language-tutor': SkillType.HYBRID,
  'note-organizer': SkillType.HYBRID,
  'science-lab': SkillType.HYBRID,
  'study-plan': SkillType.HYBRID,

  // --- 作业帮助类 ---
  'homework-biology': SkillType.HYBRID,
  'homework-chemistry': SkillType.HYBRID,
  'homework-chinese': SkillType.HYBRID,
  'homework-english': SkillType.HYBRID,
  'homework-geography': SkillType.HYBRID,
  'homework-history': SkillType.HYBRID,
  'homework-math': SkillType.HYBRID,
  'homework-physics': SkillType.HYBRID,
  'homework-politics': SkillType.HYBRID,

  // --- 专业服务类 ---
  'career-coach': SkillType.HYBRID,
  'interview-prep': SkillType.HYBRID,
  'investment-analyst': SkillType.HYBRID,
  'legal-advisor': SkillType.HYBRID,
  'legal-doc': SkillType.HYBRID,
  'mediator': SkillType.HYBRID,
  'therapy-chat': SkillType.HYBRID,

  // --- 生活类 ---
  'book-summary': SkillType.HYBRID,
  'finance-advisor': SkillType.HYBRID,
  'fitness-plan': SkillType.HYBRID,
  'gift-advisor': SkillType.HYBRID,
  'health-advisor': SkillType.HYBRID,
  'home-reno': SkillType.HYBRID,
  'homework-helper': SkillType.HYBRID,
  'movie-recommender': SkillType.HYBRID,
  'music-playlist': SkillType.HYBRID,
  'pet-care': SkillType.HYBRID,
  'photo-tips': SkillType.HYBRID,
  'recipe-recommender': SkillType.HYBRID,
  'schedule-planner': SkillType.HYBRID,
  'shopping-advisor': SkillType.HYBRID,
  'travel-planner': SkillType.HYBRID,

  // --- 写作类 ---
  'email-writer': SkillType.HYBRID,
  'press-release': SkillType.HYBRID,
  'report-writer': SkillType.HYBRID,
  'tech-writer': SkillType.HYBRID,
};

// ==================== 模板执行器 ====================

/**
 * 模板执行器 - 纯规则处理，不调用LLM
 */
const templateExecutors: Record<string, (context: WorkflowContext) => Promise<StepResult>> = {

  /**
   * 摘要提取 - 关键词提取 + 句子压缩
   */
  summarizer: async (context) => {
    const { input } = context;
    const text = input.trim();

    if (text.length < 50) {
      return { success: true, output: '输入文本过短，无法生成有效摘要。' };
    }

    // 分句
    const sentences = text.split(/[。！？\n\r]+/).filter(s => s.trim().length > 5);

    // 简单摘要：取前3-5句或总句数的1/3
    const numSummary = Math.min(Math.max(3, Math.ceil(sentences.length / 3)), 5);
    const summary = sentences.slice(0, numSummary).join('。');

    // 估算词数
    const wordCount = text.replace(/\s/g, '').length;

    return {
      success: true,
      output: `【智能摘要】\n${summary}${summary.endsWith('。') ? '' : '。'}\n\n---\n原文 ${sentences.length} 句，约 ${wordCount} 字`,
      data: { sentenceCount: sentences.length, wordCount },
    };
  },

  /**
   * 语法检查 - 常见错误模式匹配
   */
  'grammar-check': async (context) => {
    const { input } = context;
    const issues: string[] = [];
    const suggestions: string[] = [];

    // 常见错误模式
    const patterns = [
      { pattern: /(\w+)的(\w+)\1/g, issue: '重复词语', suggest: '检查并删除重复' },
      { pattern: /\s{2,}/g, issue: '多余空格', suggest: '合并多余空格' },
      { pattern: /[，,]{2,}/g, issue: '连续标点', suggest: '保留一个标点' },
      { pattern: /([。！？])\1+/g, issue: '重复标点', suggest: '保留一个' },
      { pattern: /\"[^\"]{50,}\"/g, issue: '过长引号内容', suggest: '缩短引号内内容' },
      { pattern: /\([^)]{100,}\)/g, issue: '过长括号内容', suggest: '拆分或缩短' },
    ];

    patterns.forEach(({ pattern, issue, suggest }) => {
      if (pattern.test(input)) {
        issues.push(issue);
        suggestions.push(suggest);
      }
    });

    if (issues.length === 0) {
      return {
        success: true,
        output: '【语法检查完成】\n\n✓ 未检测到常见语法错误\n\n提示：如有疑问，可提供更具体的句子进行人工检查。',
      };
    }

    const feedback = issues.map((issue, i) => `• ${issue}：${suggestions[i]}`).join('\n');

    return {
      success: true,
      output: `【语法检查完成】\n\n发现 ${issues.length} 处建议：\n${feedback}\n\n请根据上述建议修改。`,
      data: { issueCount: issues.length, issues },
    };
  },

  /**
   * SEO优化 - 关键词密度分析
   */
  'seo-optimizer': async (context) => {
    const { input } = context;

    // 提取可能的关键词（3-6字的词组）
    const words = input.match(/[\u4e00-\u9fa5]{2,6}/g) || [];
    const wordFreq: Record<string, number> = {};
    words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });

    // 按频率排序
    const sorted = Object.entries(wordFreq)
      .filter(([w]) => w.length >= 2 && w.length <= 6)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // 计算密度
    const totalWords = words.length;
    const densityReport = sorted.map(([word, count]) => {
      const density = ((count / totalWords) * 100).toFixed(2);
      const status = parseFloat(density) > 5 ? '⚠️过高' : parseFloat(density) < 1 ? '⚠️过低' : '✓';
      return `${status} "${word}": ${count}次 (${density}%)`;
    }).join('\n');

    return {
      success: true,
      output: `【SEO关键词分析】\n\n${densityReport}\n\n---\n提示：关键词密度建议保持在1%-3%之间，过高可能被搜索引擎视为作弊。`,
      data: { keywords: sorted, totalWords },
    };
  },

  /**
   * Excel公式生成 - 语法解析
   */
  'excel-formula': async (context) => {
    const { input } = context;

    // 解析需求关键词
    const keywords = {
      sum: /求和|求总计|总和|sum/i,
      average: /平均|均值|average/i,
      count: /计数|count/i,
      vlookup: /查找|vlookup|匹配/i,
      if: /条件|如果|判断|if/i,
      max: /最大值|max/i,
      min: /最小值|min/i,
    };

    let formula = '';
    let description = '';

    for (const [name, regex] of Object.entries(keywords)) {
      if (regex.test(input)) {
        switch (name) {
          case 'sum':
            formula = '=SUM(A1:A10)';
            description = '求和：A1到A10单元格的和';
            break;
          case 'average':
            formula = '=AVERAGE(A1:A10)';
            description = '求平均：A1到A10单元格的平均值';
            break;
          case 'count':
            formula = '=COUNT(A1:A10)';
            description = '计数：统计A1到A10中数字单元格的数量';
            break;
          case 'vlookup':
            formula = '=VLOOKUP(查找值, 区域, 列号, FALSE)';
            description = '查找：在区域中查找并返回对应列的值';
            break;
          case 'if':
            formula = '=IF(条件, 真值, 假值)';
            description = '条件判断：根据条件返回不同结果';
            break;
          case 'max':
            formula = '=MAX(A1:A10)';
            description = '最大值：A1到A10中的最大值';
            break;
          case 'min':
            formula = '=MIN(A1:A10)';
            description = '最小值：A1到A10中的最小值';
            break;
        }
        break;
      }
    }

    if (!formula) {
      return {
        success: true,
        output: '【Excel公式助手】\n\n请描述您想要计算的数学操作，例如：\n• "求和"\n• "计算平均值"\n• "查找匹配项"\n• "条件判断"\n\n我会为您生成对应的Excel公式。',
      };
    }

    return {
      success: true,
      output: `【Excel公式生成】\n\n公式：${formula}\n\n说明：${description}\n\n使用方法：将公式复制到Excel单元格中，根据您的实际数据范围修改单元格引用（如A1:A10）。`,
      data: { formula, type: description },
    };
  },

  /**
   * 翻译 - 简单语言检测和格式保留
   */
  translator: async (context) => {
    const { input } = context;

    // 检测语言特征
    const chineseChars = (input.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (input.match(/[a-zA-Z]{2,}/g) || []).length;
    const isMainlyChinese = chineseChars > englishWords;

    // 简单翻译提示
    const tips = isMainlyChinese
      ? '检测到中文 → 英文翻译\n\n提示：复杂的中文内容建议使用专业翻译工具以确保准确性。'
      : '检测到英文 → 中文翻译\n\nNote: Complex English content is best handled by professional translation tools.';

    return {
      success: true,
      output: `【翻译助手】\n\n${tips}\n\n如需精确翻译，请提供：\n1. 完整原文\n2. 目标语言\n3. 文档类型（商务/技术/文学等）`,
      data: { chineseChars, englishWords, detectedLang: isMainlyChinese ? 'zh' : 'en' },
    };
  },

  /**
   * 本地化适配 - 文化敏感性检查
   */
  localization: async (context) => {
    const { input } = context;

    // 检测可能需要本地化的元素
    const checks = [
      { pattern: /[💰💎👑🎉🔥]/g, item: 'emoji符号', note: '不同平台emoji显示不一致' },
      { pattern: /\d{3,}-\d{3,}-\d{4,}/g, item: '电话号码格式', note: '美国格式，需调整为目标市场格式' },
      { pattern: /\$[¥€£]/g, item: '货币符号', note: '需根据目标市场调整' },
      { pattern: /\d{1,2}\/\d{1,2}\/\d{2,4}/g, item: '日期格式', note: '美国MM/DD vs 欧洲DD/MM vs 中国YYYY/MM/DD' },
    ];

    const findings = checks
      .filter(c => c.pattern.test(input))
      .map(c => `• ${c.item}：${c.note}`);

    if (findings.length === 0) {
      return {
        success: true,
        output: '【本地化检查】\n\n✓ 未检测到明显的本地化敏感元素\n\n建议：发布到新市场前，仍需人工审核文化适应性。',
      };
    }

    return {
      success: true,
      output: `【本地化检查】\n\n发现 ${findings.length} 处可能需要适配：\n${findings.join('\n')}\n\n请根据目标市场调整上述内容。`,
      data: { findings: findings.length },
    };
  },
};

// ==================== 辅助函数 ====================

/**
 * 检测输入是否结构化（模板型技能判断用）
 */
function isStructuredInput(input: string): boolean {
  // 检测是否以结构化标记开头
  if (/^\s*[\[\{\(]/.test(input.trim())) return true;
  // 检测是否包含多个换行（可能是列表/模板）
  if ((input.match(/\n/g) || []).length >= 3) return true;
  // 检测是否包含字段标记（key: value 格式）
  if (/^[^：:：\n]+[：:：]\s*.+/m.test(input)) return true;
  return false;
}

// ==================== 主执行器 ====================

export async function executeSkill(
  skill: Skill,
  input: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<ExecuteResult> {

  // 1. 确定技能类型（未注册的默认走HYBRID）
  const skillType = skillTypeRegistry[skill.id] || SkillType.HYBRID;

  const context: WorkflowContext = {
    skill,
    input,
    messages,
    collectedData: {},
    skillType,
  };

  // 2. 分发执行
  switch (skillType) {
    case SkillType.TEMPLATE:
      return executeTemplateSkill(skill.id, context);

    case SkillType.LLM:
      return executeLLMSkill(skill, context);

    case SkillType.HYBRID:
    default:
      return executeHybridSkill(skill, context);
  }
}

/**
 * 模板型：纯规则执行
 */
async function executeTemplateSkill(
  skillId: string,
  context: WorkflowContext
): Promise<ExecuteResult> {
  const executor = templateExecutors[skillId];

  if (executor) {
    const result = await executor(context);
    return {
      type: SkillType.TEMPLATE,
      output: result.output || '处理完成',
      steps: [{ id: skillId, status: StepStatus.COMPLETED, output: result.output }],
    };
  }

  // 没有执行器，降级到提示
  return {
    type: SkillType.TEMPLATE,
    output: `【${context.skill.name}】\n\n此技能正在配置中，请稍后再试。`,
    steps: [{ id: skillId, status: StepStatus.SKIPPED }],
  };
}

/**
 * LLM型：直接构建prompt
 */
async function executeLLMSkill(
  skill: Skill,
  context: WorkflowContext
): Promise<ExecuteResult> {
  return {
    type: SkillType.LLM,
    output: '正在生成...',
    llmContext: {
      systemPrompt: skill.systemPrompt,
      userInput: context.input,
      collectedData: context.collectedData,
    },
  };
}

/**
 * 混合型：自动判断
 */
async function executeHybridSkill(
  skill: Skill,
  context: WorkflowContext
): Promise<ExecuteResult> {
  const { input } = context;

  // 结构化输入走简单解析
  if (isStructuredInput(input)) {
    // 尝试解析结构化内容，给出确认提示
    return {
      type: SkillType.HYBRID,
      output: `【${skill.name}】\n\n已检测到结构化输入，正在处理...\n\n输入格式看起来正确，我将为您生成内容。`,
      llmContext: {
        systemPrompt: skill.systemPrompt,
        userInput: input,
        collectedData: { structured: true },
      },
    };
  }

  // 非结构化输入走完整LLM
  return executeLLMSkill(skill, context);
}
