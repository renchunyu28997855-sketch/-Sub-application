import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.chat/v1',
});

export async function chatCompletion(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  console.log('chatCompletion messages:', JSON.stringify(messages, null, 2));
  const response = await client.chat.completions.create({
    model: 'MiniMax-M2.7',
    messages,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content || '';
}

export async function analyzeSupplyChain(input: {
  jobDescription: string;
  context?: {
    inputData?: string;
    outputResult?: string;
    collaborator?: string;
    frequency?: string;
    timeRatio?: string;
  };
}): Promise<{
  tasks: {
    name: string;
    skills: string[];
    digitalScore: number;
    ruleScore: number;
    faultTolerance: number;
  }[];
  classification: ('skill' | 'agent' | 'human' | 'system')[];
  recommendations: {
    skillDocuments?: { name: string; input: string; output: string; apiExample: string }[];
    agentDesign?: { role: string; capabilities: string[]; workflow: string[] }[];
    humanSuggestions?: string[];
    systemSuggestions?: string[];
  };
}> {
  console.log('analyzeSupplyChain input:', JSON.stringify(input, null, 2));
  const systemPrompt = `你是一个供应链规划专家。你的任务是根据用户输入的供应链需求，分析并提供优化建议，包括供应策略规划、采购计划、需求预测等方面的智能体和技能设计方案。

供应链分析框架：
1. 输入层：需求描述和上下文信息
2. 分析层：拆解为原子任务，标注属性
3. 决策层：分类为Skill化/Agent化/保留人力/保留系统
4. 输出层：生成方案

分类标准：
- Skill化：数字化评分≥7，规则评分≥6，容错评分≥5，且可复用
- Agent化：数字化评分≥8，规则评分≥7，容错评分≥6，需多步骤协同
- 保留人力：规则评分≤4，或容错评分≤3，或涉及复杂决策
- 保留系统：任务已由现有系统完全覆盖

请分析以下供应链需求，返回JSON格式的分析结果。`;

  const userPrompt = `请分析以下供应链需求：
需求描述：${input.jobDescription}
${input.context ? `
上下文信息：
- 输入数据：${input.context.inputData || '未填写'}
- 输出结果：${input.context.outputResult || '未填写'}
- 协作对象：${input.context.collaborator || '未填写'}
- 执行频率：${input.context.frequency || '未填写'}
- 耗时占比：${input.context.timeRatio || '未填写'}
` : ''}

请返回JSON格式的分析结果，结构如下：
{
  "tasks": [
    {
      "name": "任务名称",
      "skills": ["所需技能1", "所需技能2"],
      "digitalScore": 1-10,
      "ruleScore": 1-10,
      "faultTolerance": 1-10
    }
  ],
  "classification": ["skill", "agent", "human", "system"],
  "recommendations": {
    "skillDocuments": [
      {
        "name": "技能名称",
        "input": "输入参数描述",
        "output": "输出结果描述",
        "apiExample": "API调用示例"
      }
    ],
    "agentDesign": [
      {
        "role": "Agent角色定位",
        "capabilities": ["能力1", "能力2"],
        "workflow": ["步骤1", "步骤2"]
      }
    ],
    "humanSuggestions": ["人力优化建议1", "人力优化建议2"],
    "systemSuggestions": ["系统优化建议1", "系统优化建议2"]
  }
}`;

  const resultText = await chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  console.log('LLM raw result:', resultText);
  try {
    let jsonStr = resultText;
    const jsonMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1];
    }
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (e) {
    console.error('JSON parse error:', e, 'Result:', resultText);
    return {
      tasks: [],
      classification: [],
      recommendations: {},
      _raw: resultText,
    } as any;
  }
}

export function mockAnalyze(input: {
  jobDescription: string;
  context?: {
    inputData?: string;
    outputResult?: string;
    collaborator?: string;
    frequency?: string;
    timeRatio?: string;
  };
}) {
  return {
    tasks: [
      {
        name: '任务1：历史数据分析',
        skills: ['数据分析', 'Excel操作', '数据可视化'],
        digitalScore: 9,
        ruleScore: 7,
        faultTolerance: 8,
      },
      {
        name: '任务2：需求预测模型计算',
        skills: ['预测算法', '统计模型', '系统计算'],
        digitalScore: 8,
        ruleScore: 8,
        faultTolerance: 7,
      },
      {
        name: '任务3：采购策略生成',
        skills: ['策略分析', '成本核算', '报告生成'],
        digitalScore: 7,
        ruleScore: 7,
        faultTolerance: 6,
      },
      {
        name: '任务4：人工审核与调整',
        skills: ['经验判断', '业务理解', '决策能力'],
        digitalScore: 5,
        ruleScore: 4,
        faultTolerance: 3,
      },
    ],
    classification: ['skill', 'skill', 'agent', 'human'] as const,
    recommendations: {
      skillDocuments: [
        {
          name: '历史数据分析技能',
          input: '时间范围、历史销售/采购数据',
          output: '数据分析报告、趋势图表',
          apiExample: 'POST /api/skill/data_analysis {"date_range": "2023-2025", "data_type": "sales"}',
        },
        {
          name: '需求预测技能',
          input: '历史数据、预测周期、季节性因子',
          output: '需求预测结果、置信区间',
          apiExample: 'POST /api/skill/demand_forecast {"history_data": [...], "forecast_period": 30}',
        },
      ],
      agentDesign: [
        {
          role: '供应链规划Agent',
          capabilities: ['历史数据分析技能', '需求预测技能', '采购策略生成技能'],
          workflow: ['收集历史数据', '进行需求预测', '分析供应策略', '生成采购计划', '人工审核调整'],
        },
      ],
      humanSuggestions: [
        '建议设置人工审核环节，对AI生成的采购计划进行最终确认',
        '复杂市场情况（如突发需求、供应商危机）需要人工介入决策',
        '建议定期更新预测模型参数以提高准确性',
      ],
      systemSuggestions: [
        '建议对接ERP系统实现自动数据同步',
        '建议建立供应商绩效监控仪表板',
        '建议部署实时需求预警系统',
      ],
    },
  };
}
