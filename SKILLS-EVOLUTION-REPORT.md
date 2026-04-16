# Skills V3.0 版本更新说明

> 更新日期：2026-04-17
> 本次更新共涉及 **92个技能** 升级至 v3.0

---

## 更新概述

### 标准化升级内容

所有技能均已统一升级至v3.0标准：

| 升级项 | 说明 |
|--------|------|
| **渐进式披露** | SKILL.md ≤200行，详细内容移至 references/ 目录 |
| **userInvocable** | 添加用户可直接调用的技能 |
| **triggerPhrases** | 添加触发短语，支持自然语言激活 |
| **skillLevel** | 统一标注技能等级 (L1-L5) |
| **2026 AI能力** | 新增AI辅助分析、自然语言处理、智能推荐等能力 |
| **references/** | 每个技能新增4个参考文档 |

---

## 技能详细更新清单

### 一、Data 数据分析类 (14个)

#### 1. data-analyst
- **路径**: `data/data-analyst/SKILL.md`
- **v3.0更新**: 2026-04-16
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["数据分析", "数据报告", "数据解读", "BI报表", "数据可视化"]
- **2026 AI能力**: AI协作分析模式、多模态分析能力、Chain-of-Thought推理
- **references**: `references/` 目录已存在
- **变更内容**: 核心数据分析技能，集成AI协作分析模式，支持多模态数据输入

#### 2. sql-query ⭐ 新增
- **路径**: `data/sql-query/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["SQL查询", "写SQL", "数据库查询", "SQL优化", "数据提取"]
- **2026 AI能力**: AI自然语言查询、自动SQL生成、性能智能诊断
- **references**: query-patterns.md, optimization.md, edge-cases.md, examples.md
- **变更内容**: 新增技能，支持自然语言转SQL，智能查询优化

#### 3. data-cleaner
- **路径**: `data/data-cleaner/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["数据清洗", "数据清洗", "数据清理", "数据预处理", "数据质量管理"]
- **2026 AI能力**: 自动异常检测（Isolation Forest）、智能缺失值填充（KNN/MICE）、模式识别自动清洗
- **references**: cleaning-patterns.md, validation-rules.md, transformation.md, examples.md
- **变更内容**: 新增AI自动异常检测，智能缺失值填充能力

#### 4. excel-formula
- **路径**: `data/excel-formula/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2-L3
- **userInvocable**: true
- **triggerPhrases**: ["Excel公式", "写公式", "Excel计算", "电子表格公式"]
- **2026 AI能力**: 自然语言公式生成、AI公式解释、智能纠错、公式推荐
- **references**: formula-patterns.md, optimization.md, examples.md, troubleshooting.md
- **变更内容**: 新增AI自然语言公式生成和智能纠错

#### 5. stats-model
- **路径**: `data/stats-model/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["统计分析", "统计模型", "回归分析", "假设检验", "数据建模"]
- **2026 AI能力**: AI模型选择、自动化特征工程（SHAP解释）、结果智能解释
- **references**: model-selection.md, assumption-tests.md, interpretation.md, examples.md
- **变更内容**: 新增AI模型自动选择和SHAP特征解释

#### 6. ab-test
- **路径**: `data/ab-test/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["AB测试", "ABTest", "实验设计", "对照实验", "测试策略"]
- **2026 AI能力**: AI实验设计、智能样本量计算、结果智能解释
- **references**: test-design.md, statistical-methods.md, result-analysis.md, examples.md
- **变更内容**: 新增AI实验设计和智能样本量计算

#### 7. data-viz-story
- **路径**: `data/data-viz-story/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["数据故事", "数据叙事", "可视化故事", "数据汇报", "图表叙事"]
- **2026 AI能力**: AI故事线生成、自动图表推荐、交互式可视化
- **references**: story-frameworks.md, chart-selection.md, narrative-techniques.md, examples.md
- **变更内容**: 新增AI故事线生成和多框架叙事支持

#### 8. report-generator
- **路径**: `data/report-generator/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["报告生成", "生成报告", "报表", "数据分析报告", "自动报告"]
- **2026 AI能力**: AI报告生成（自动内容生成、智能摘要）、自动可视化、动态报告
- **references**: report-types.md, structure-templates.md, automation.md, examples.md
- **变更内容**: 新增AI自动报告生成和动态报告能力

#### 9. bi-report
- **路径**: `data/bi-report/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["BI报表", "仪表盘", "数据看板", "BI设计", "数据仪表板"]
- **2026 AI能力**: AI报表生成、自然语言查询、智能洞察
- **references**: bi-tools.md, dashboard-design.md, metrics-definition.md, examples.md
- **变更内容**: 新增自然语言查询和AI智能洞察

#### 10. chart-designer ⭐ 新增
- **路径**: `data/chart-designer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["图表设计", "数据图表", "可视化图表", "图表选择", "图表优化"]
- **2026 AI能力**: AI图表类型推荐、智能配色、数据故事化
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增技能，从writing迁移至data

#### 11. data-dict
- **路径**: `data/data-dict/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["数据字典", "字段定义", "元数据", "数据建模", "数据库文档"]
- **2026 AI能力**: AI字段推荐、智能血缘分析、数据质量检查
- **references**: field-templates.md, lineage-analysis.md, quality-check.md, ai-dict.md
- **变更内容**: 新增AI智能字段推荐和血缘分析

#### 12. data-migrate
- **路径**: `data/data-migrate/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["数据迁移", "数据库迁移", "ETL", "数据同步", "数据转换"]
- **2026 AI能力**: AI迁移策略推荐、自动化血缘映射、迁移验证
- **references**: migration-strategies.md, etl-design.md, validation-methods.md, ai-migration.md
- **变更内容**: 新增AI迁移策略推荐

#### 13. writing/seo-optimizer
- **路径**: `writing/seo-optimizer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["SEO优化", "关键词优化", "提升排名", "网站排名", "内容SEO"]
- **2026 AI能力**: AI关键词分析（智能扩展、搜索意图识别、竞争度预测）、AI内容评分、AI竞品分析
- **references**: seo-principles.md, keyword-strategy.md, content-templates.md, examples.md
- **变更内容**: 新增AI关键词分析和竞品分析能力

#### 14. writing/summarizer
- **路径**: `writing/summarizer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["摘要总结", "文章摘要", "内容提炼", "总结概要", "文档摘要"]
- **2026 AI能力**: AI智能摘要、多角度摘要、关键提取
- **references**: summarization-types.md, techniques.md, quality-check.md, examples.md
- **变更内容**: 新增多角度AI摘要能力

---

### 二、Writing 写作类 (16个)

#### 1. blog-writer
- **路径**: `writing/blog-writer/SKILL.md`
- **v3.0更新**: 2026-04-16
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["写博客", "博客写作", "文章写作", "内容创作", "自媒体写作"]
- **2026 AI能力**: AI协作写作模式、风格延续、多平台适配
- **references**: `references/` 目录已存在
- **变更内容**: Human-AI协作工作流，风格延续能力

#### 2. tech-writer
- **路径**: `writing/tech-writer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2-L3
- **userInvocable**: true
- **triggerPhrases**: ["技术文档", "API文档", "开发文档", "技术写作", "SDK文档"]
- **2026 AI能力**: 智能文档结构生成、技术术语解释、多语言文档
- **references**: document-types.md, style-guide.md, templates.md, examples.md
- **变更内容**: 新增AI文档结构生成和术语解释

#### 3. email-writer
- **路径**: `writing/email-writer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["写邮件", "商务邮件", "邮件撰写", "Email写作", "工作邮件"]
- **2026 AI能力**: AI语气调整、邮件模板生成、多语言邮件
- **references**: email-types.md, tone-guide.md, templates.md, examples.md
- **变更内容**: 新增AI语气调整和多语言支持

#### 4. social-post
- **路径**: `writing/social-post/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["社交媒体", "发朋友圈", "小红书", "微博文案", "种草文案"]
- **2026 AI能力**: AI内容生成、热点分析、多平台适配
- **references**: platform-guide.md, content-types.md, viral-patterns.md, examples.md
- **变更内容**: 新增AI热点分析和多平台智能适配

#### 5. resume-optimize
- **路径**: `writing/resume-optimize/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["简历优化", "简历修改", "求职简历", "简历润色", "简历诊断"]
- **2026 AI能力**: AI简历优化、ATS评分、关键词匹配
- **references**: resume-types.md, content-strategy.md, ats-optimization.md, examples.md
- **变更内容**: 新增ATS评分和关键词智能匹配

#### 6. press-release
- **路径**: `writing/press-release/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["新闻稿", "公关稿", "媒体发布", "企业新闻", "活动公告"]
- **2026 AI能力**: AI新闻稿生成、媒体适配、标题优化
- **references**: press-release-structure.md, industry-templates.md, media-contacts.md, examples.md
- **变更内容**: 新增AI新闻稿生成

#### 7. product-desc
- **路径**: `writing/product-desc/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["产品描述", "商品文案", "产品卖点", "详情页文案", "SKU描述"]
- **2026 AI能力**: AI产品描述生成、卖点挖掘、多平台适配
- **references**: desc-types.md, copywriting-formulas.md, conversion-optimization.md, examples.md
- **变更内容**: 新增AI卖点挖掘和转化优化

#### 8. copywriter
- **路径**: `writing/copywriter/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["文案撰写", "广告文案", "营销文案", "创意文案", "文案写作"]
- **2026 AI能力**: AI创意生成、多风格适配、转化优化
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI创意生成和多风格适配

#### 9. translator
- **路径**: `writing/translator/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["翻译", "中英翻译", "文档翻译", "多语言翻译", "人工翻译"]
- **2026 AI能力**: AI上下文理解、文化适配、术语一致性
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI上下文理解和文化适配

#### 10. grammar-check
- **路径**: `writing/grammar-check/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["语法检查", "英语纠错", "语法错误", "写作润色", "语言检查"]
- **2026 AI能力**: AI语境分析、风格建议、多语言支持
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI语境分析和风格建议

#### 11. localization
- **路径**: `writing/localization/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["本地化", "国际化", "翻译本地化", "区域化", "多语言适配"]
- **2026 AI能力**: AI文化适配、语境本地化、习惯表达
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI文化语境适配

#### 12. report-writer
- **路径**: `writing/report-writer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["报告撰写", "工作总结", "述职报告", "调研报告", "分析报告"]
- **2026 AI能力**: AI报告结构生成、数据洞察提取、专业表达
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI结构生成和洞察提取

#### 13. creative-writing
- **路径**: `writing/creative-writing/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["创意写作", "小说创作", "故事写作", "文学创作", "写作灵感"]
- **2026 AI能力**: AI情节生成、角色塑造、文风模拟
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI情节生成和角色塑造

#### 14. brand-story
- **路径**: `writing/brand-story/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["品牌故事", "品牌叙事", "企业文化", "品牌文案", "品牌营销"]
- **2026 AI能力**: AI品牌定位、情感叙事、视觉内容建议
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI品牌定位和情感叙事

#### 15. chart-designer ⭐ 新建
- **路径**: `writing/chart-designer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["图表设计", "数据可视化", "信息图表", "图表制作", "可视化设计"]
- **2026 AI能力**: AI图表推荐、智能配色、数据故事化
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能，从data迁移

#### 16. design-brief ⭐ 新建
- **路径**: `writing/design-brief/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["设计简报", "设计需求", "创意简报", "设计说明", "品牌设计需求"]
- **2026 AI能力**: AI需求解析、创意方向生成、参考案例推荐
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能

#### 17. proposal-writer ⭐ 新建
- **路径**: `writing/proposal-writer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["提案撰写", "商业提案", "投标文件", "合作方案", "项目建议书"]
- **2026 AI能力**: AI方案生成、竞争分析、说服力优化
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能

---

### 三、Design 设计类 (16个)

#### 1. ui-feedback
- **路径**: `design/ui-feedback/SKILL.md`
- **v3.0更新**: 2026-04-16
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["UI反馈", "设计评审", "界面优化", "UI评审", "设计改进"]
- **2026 AI能力**: GenUI评审、对话式反馈、视觉问题检测
- **references**: `references/` 目录已存在
- **变更内容**: 新增GenUI评审和对话式设计反馈

#### 2. ux-review
- **路径**: `design/ux-review/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["UX评审", "用户体验", "交互评估", "可用性测试", "用户流程"]
- **2026 AI能力**: AI用户旅程模拟、情感预测、热力图分析
- **references**: five-dimensions.md, problem-analysis.md, edge-cases.md, examples.md
- **变更内容**: 新增AI用户旅程模拟和情感预测

#### 3. color-scheme
- **路径**: `design/color-scheme/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["配色方案", "色彩设计", "颜色搭配", "配色", "主题色"]
- **2026 AI能力**: AI配色生成、色彩情感分析、可访问性检查
- **references**: color-theory.md, scheme-types.md, accessibility.md, examples.md
- **变更内容**: 新增AI配色生成和WCAG可访问性检查

#### 4. icon-picker
- **路径**: `design/icon-picker/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["图标选择", "图标库", "icon", "图标设计", "图标推荐"]
- **2026 AI能力**: AI图标搜索、风格匹配、语义理解
- **references**: icon-systems.md, style-guide.md, selection-criteria.md, examples.md
- **变更内容**: 新增AI图标语义搜索

#### 5. slide-deck
- **路径**: `design/slide-deck/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["PPT制作", "幻灯片", "演示文稿", "PPT设计", "汇报PPT"]
- **2026 AI能力**: AI幻灯片生成、内容优化、视觉建议
- **references**: slide-structure.md, design-principles.md, templates.md, examples.md
- **变更内容**: 新增AI内容优化和智能配图

#### 6. brand-design
- **路径**: `design/brand-design/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["品牌视觉", "品牌规范", "VI设计", "视觉系统", "品牌设计"]
- **2026 AI能力**: AI品牌策略、视觉一致性检查、品牌故事生成
- **references**: brand-elements.md, design-system.md, brand-guidelines.md, examples.md
- **变更内容**: 新增AI品牌策略和视觉一致性检查

#### 7. logo-ideation
- **路径**: `design/logo-ideation/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["Logo设计", "标志设计", "品牌Logo", "Logo创意", "图标设计"]
- **2026 AI能力**: 品牌DNA分析、跨文化适配检查、Logo评估
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增品牌DNA分析和跨文化适配

#### 8. poster-layout
- **路径**: `design/poster-layout/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["海报设计", "宣传物料", "版式设计", "海报布局", "平面设计"]
- **2026 AI能力**: 智能构图、跨尺寸适配、视觉层次分析
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增智能构图和跨尺寸适配

#### 9. font-pairing
- **路径**: `design/font-pairing/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["字体搭配", "字体选择", "字体设计", "Typography", "字体组合"]
- **2026 AI能力**: 多语言字体系统、无障碍检查、字体情绪分析
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增多语言字体系统和无障碍检查

#### 10. design-system
- **路径**: `design/design-system/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["设计系统", "组件库", "Design System", "UI组件", "设计规范"]
- **2026 AI能力**: 令牌自动生成、多平台检测、设计一致性分析
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增令牌自动生成和多平台检测

#### 11. ux-principles ⭐ 新建
- **路径**: `design/ux-principles/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["UX原则", "设计原则", "用户体验原则", "交互原则", "可用性原则"]
- **2026 AI能力**: 用户旅程分析、情感化设计、认知负荷评估
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能

#### 12. presentation-maker ⭐ 新建
- **路径**: `design/presentation-maker/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["演示制作", "PPT生成", "幻灯片自动生成", "AI做PPT", "演示设计"]
- **2026 AI能力**: 内容智能排版、视觉增强建议、动画推荐
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能

#### 13. mockup-generator ⭐ 新建
- **路径**: `design/mockup-generator/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["Mockup", "设计稿", "产品原型", "界面原型", "模型生成"]
- **2026 AI能力**: 风格迁移、场景适配、光照调整
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能

#### 14. visual-identity ⭐ 新建
- **路径**: `design/visual-identity/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["视觉识别", "VI系统", "品牌视觉", "视觉形象", "企业视觉"]
- **2026 AI能力**: 品牌视觉分析、一致性检测、升级建议
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能

#### 15. illustration-picker ⭐ 新建
- **路径**: `design/illustration-picker/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["插画选择", "配图", "插画风格", "图片素材", "视觉素材"]
- **2026 AI能力**: 风格匹配、场景推荐、版权检测
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能

#### 16. animation-guide ⭐ 新建
- **路径**: `design/animation-guide/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["动效设计", "微交互", "动画原则", "交互动效", "UI动画"]
- **2026 AI能力**: 性能检测、跨平台适配、动效时长建议
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能

---

### 四、Business 商业类 (18个)

#### 1. user-research
- **路径**: `business/user-research/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["用户研究", "用户调研", "需求调研", "市场调研", "用户访谈"]
- **2026 AI能力**: AI用户画像生成、访谈分析自动化、情绪分析
- **references**: research-methods.md, interview-guide.md, persona-templates.md, examples.md
- **变更内容**: 新增AI用户画像生成和访谈自动化分析

#### 2. prd-writer
- **路径**: `business/prd-writer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["PRD", "产品需求", "需求文档", "产品文档", "BRD"]
- **2026 AI能力**: AI需求生成、竞品对比、用户故事自动扩展
- **references**: prd-structure.md, requirement-types.md, user-story-templates.md, examples.md
- **变更内容**: 新增AI需求生成和竞品对比

#### 3. project-plan
- **路径**: `business/project-plan/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["项目计划", "项目规划", "排期", "里程碑", "项目方案"]
- **2026 AI能力**: AI任务拆解、风险预测、资源优化
- **references**: plan-templates.md, wbs-examples.md, timeline-guide.md, examples.md
- **变更内容**: 新增AI任务拆解和风险预测

#### 4. marketing-plan
- **路径**: `business/marketing-plan/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["营销方案", "营销计划", "推广方案", "市场策略", "营销策划"]
- **2026 AI能力**: AI营销策略生成、竞品分析、ROI预测
- **references**: marketing-frameworks.md, channel-strategy.md, budget-allocation.md, examples.md
- **变更内容**: 新增AI策略生成和ROI预测

#### 5. financial-analysis
- **路径**: `business/financial-analysis/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["财务分析", "财务报表", "财务指标", "盈利能力", "财务预测"]
- **2026 AI能力**: AI财务分析、异常检测、自动报告生成
- **references**: analysis-methods.md, ratio-analysis.md, forecasting.md, examples.md
- **变更内容**: 新增AI异常检测和自动报告

#### 6. growth-hacking
- **路径**: `business/growth-hacking/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["增长黑客", "用户增长", "裂变增长", "增长策略", "获客策略"]
- **2026 AI能力**: AI增长策略生成、漏斗分析、A/B测试优化
- **references**: growth-frameworks.md, channel-tactics.md, metrics.md, examples.md
- **变更内容**: 新增AI增长策略和漏斗分析

#### 7. retention-analysis
- **路径**: `business/retention-analysis/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["留存分析", "用户留存", "流失分析", "复购分析", "用户粘性"]
- **2026 AI能力**: AI流失预测、行为分析、干预建议
- **references**: cohort-analysis.md, churn-factors.md, intervention.md, examples.md
- **变更内容**: 新增AI流失预测和智能干预

#### 8. risk-assessment
- **路径**: `business/risk-assessment/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["风险评估", "风险分析", "风险识别", "风险管理", "风险控制"]
- **2026 AI能力**: AI风险识别、概率评估、缓解建议
- **references**: risk-categories.md, assessment-methods.md, mitigation-plans.md, examples.md
- **变更内容**: 新增AI风险识别和概率评估

#### 9. competitor-analysis
- **路径**: `business/competitor-analysis/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["竞品分析", "竞争对手", "市场分析", "竞争策略", "竞品调研"]
- **2026 AI能力**: AI竞品监控、差异化分析、市场预测
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI竞品监控和差异化分析

#### 10. biz-plan
- **路径**: `business/biz-plan/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["商业计划", "BP", "创业计划", "商业策划", "融资计划"]
- **2026 AI能力**: AI商业模式生成、财务预测、风险评估
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI商业模式生成和财务预测

#### 11. pricing-strategy
- **路径**: `business/pricing-strategy/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["定价策略", "价格策略", "定价", "价格制定", "收费模式"]
- **2026 AI能力**: AI定价优化、竞品价格监控、用户支付意愿分析
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI定价优化和支付意愿分析

#### 12. okr-helper
- **路径**: `business/okr-helper/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["OKR", "目标管理", "OKR制定", "目标设定", "绩效考核"]
- **2026 AI能力**: AI目标分解、进度追踪、复盘分析
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI目标分解和进度追踪

#### 13. decision-matrix
- **路径**: `business/decision-matrix/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["决策矩阵", "多标准决策", "方案评估", "选择分析", "加权评分"]
- **2026 AI能力**: AI权重分析、敏感性分析、决策建议
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI权重分析和敏感性分析

#### 14. meeting-notes
- **路径**: `business/meeting-notes/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["会议记录", "纪要", "会议总结", "周会纪要", "会议要点"]
- **2026 AI能力**: AI会议摘要、待办提取、行动追踪
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI会议摘要和待办提取

#### 15. contract-review
- **路径**: `business/contract-review/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["合同审核", "合同审查", "法律审查", "协议审核", "合同风险"]
- **2026 AI能力**: AI风险识别、条款解释、修改建议
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI风险识别和条款解释

#### 16. investment-eval
- **路径**: `business/investment-eval/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["投资评估", "项目评估", "投资分析", "尽调", "商业评估"]
- **2026 AI能力**: AI财务建模、风险量化、回报预测
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI财务建模和风险量化

---

### 五、Professional 专业类 (6个)

#### 1. career-coach
- **路径**: `professional/career-coach/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["职业规划", "职业转型", "职业发展", "工作选择", "职场困惑"]
- **2026 AI能力**: AI技能图谱、职业匹配、市场趋势
- **references**: diagnosis.md, exploration.md, action-plan.md, examples.md
- **变更内容**: 新增AI技能图谱和职业匹配

#### 2. therapy-chat
- **路径**: `professional/therapy-chat/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["情绪疏导", "压力管理", "心理咨询", "心理支持", "情绪不好"]
- **2026 AI能力**: AI情感识别、共情生成、安全监测
- **references**: crisis-response.md, strategies.md, edge-cases.md, examples.md
- **变更内容**: 新增AI情感识别和安全监测

#### 3. interview-prep
- **路径**: `professional/interview-prep/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["面试准备", "面试辅导", "求职面试", "面试技巧", "面试练习"]
- **2026 AI能力**: AI模拟面试、实时反馈、表情分析
- **references**: interview-types.md, question-bank.md, answer-templates.md, examples.md
- **变更内容**: 新增AI模拟面试和实时反馈

#### 4. legal-doc
- **路径**: `professional/legal-doc/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["法律文书", "合同撰写", "协议起草", "律师函", "合同审核"]
- **2026 AI能力**: AI文档分析、风险识别、条款解释
- **references**: doc-types.md, clause-library.md, risk-checklist.md, examples.md
- **变更内容**: 新增AI文档分析和风险识别

#### 5. mediator
- **路径**: `professional/mediator/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["调解", "冲突解决", "纠纷调解", "谈判", "人际冲突"]
- **2026 AI能力**: AI冲突分析、方案生成、谈判策略
- **references**: conflict-types.md, negotiation-strategies.md, resolution-frameworks.md, examples.md
- **变更内容**: 新增AI冲突分析和谈判策略

#### 6. investment-analyst
- **路径**: `professional/investment-analyst/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["投资分析", "股票分析", "基金选择", "资产配置", "投资理财"]
- **2026 AI能力**: 量化分析、组合优化、风险预测
- **references**: diagnosis.md, analysis-framework.md, examples.md, risk-management.md
- **变更内容**: 新增量化分析和组合优化

#### 7. legal-advisor
- **路径**: `professional/legal-advisor/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L3
- **userInvocable**: true
- **triggerPhrases**: ["法律咨询", "合同风险", "劳动法", "知识产权", "法律风险"]
- **2026 AI能力**: 智能文书审查、案例匹配、风险量化
- **references**: edge-cases.md, examples.md, faq.md, diagnosis-framework.md
- **变更内容**: 新增智能文书审查和案例匹配

---

### 六、Education 教育类 (17个)

#### 1. homework-physics
- **路径**: `education/homework-physics/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["物理题", "物理解答", "物理作业", "物理辅导", "物理学习"]
- **2026 AI能力**: AI智能解题、概念可视化、物理模拟
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI解题步骤生成和物理模拟

#### 2. homework-chemistry
- **路径**: `education/homework-chemistry/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["化学题", "化学解答", "化学作业", "化学实验", "化学学习"]
- **2026 AI能力**: AI方程式配平、实验模拟、反应机理
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI方程式配平和实验模拟

#### 3. homework-biology
- **路径**: `education/homework-biology/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["生物题", "生物解答", "生物作业", "生物学习", "生命科学"]
- **2026 AI能力**: AI图解生成、概念网络、记忆技巧
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI图解生成和概念网络

#### 4. homework-history
- **路径**: `education/homework-history/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["历史题", "历史解答", "历史作业", "历史学习", "历史事件"]
- **2026 AI能力**: AI时间线生成、因果分析、历史比较
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI时间线生成和因果分析

#### 5. homework-geography
- **路径**: `education/homework-geography/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["地理题", "地理解答", "地理作业", "地理学习", "地图"]
- **2026 AI能力**: AI地图分析、区域对比、时区计算
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI地图分析和区域对比

#### 6. homework-politics
- **路径**: `education/homework-politics/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["政治题", "政治解答", "政治学习", "时事政治", "政治理论"]
- **2026 AI能力**: AI时事分析、政策解读、理论联系实际
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI时事分析和政策解读

#### 7. homework-chinese
- **路径**: `education/homework-chinese/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["语文", "语文作业", "作文", "阅读理解", "古诗"]
- **2026 AI能力**: AI作文批改、阅读分析、诗词鉴赏
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI作文批改和诗词鉴赏

#### 8. homework-english
- **路径**: `education/homework-english/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["英语", "英语作业", "英语学习", "完形填空", "阅读理解"]
- **2026 AI能力**: AI语法解释、翻译润色、口语练习
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI语法解释和口语练习

#### 9. homework-math
- **路径**: `education/homework-math/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["数学题", "数学解答", "数学作业", "数学辅导", "解题"]
- **2026 AI能力**: AI分步解题、思路讲解、举一反三
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI分步解题和思路讲解

#### 10. exam-prep
- **路径**: `education/exam-prep/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["考试准备", "备考", "考前复习", "冲刺复习", "考试技巧"]
- **2026 AI能力**: AI知识点预测、错题分析、考试策略
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI知识点预测和错题分析

#### 11. study-plan
- **路径**: `education/study-plan/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["学习计划", "学习规划", "复习计划", "自学计划", "学习安排"]
- **2026 AI能力**: AI学习路径规划、进度追踪、效果评估
- **references**: concepts.md, problem-types.md, formula-sheet.md, examples.md
- **变更内容**: 新增AI学习路径规划和进度追踪

#### 12. knowledge-explainer ⭐ 新建
- **路径**: `education/knowledge-explainer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["知识讲解", "概念解释", "原理说明", "科普", "知识科普"]
- **2026 AI能力**: 多模态解释、类比生成、知识图谱
- **references**: examples.md, concepts.md, analogies.md, mnemonics.md
- **变更内容**: 新建技能

#### 13. flashcard-generator ⭐ 新建
- **路径**: `education/flashcard-generator/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["闪卡生成", "记忆卡", "背诵卡", "Anki", "记忆卡片"]
- **2026 AI能力**: 间隔重复引擎、智能抽取、记忆曲线
- **references**: examples.md, design-principles.md, spaced-repetition.md, memory-techniques.md
- **变更内容**: 新建技能

#### 14. note-organizer ⭐ 新建
- **路径**: `education/note-organizer/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["笔记整理", "笔记方法", "康奈尔笔记", "笔记系统", "知识整理"]
- **2026 AI能力**: 知识图谱、关联发现、智能标签
- **references**: examples.md, methods-comparison.md, knowledge-linking.md, review-strategies.md
- **变更内容**: 新建技能

#### 15. language-tutor ⭐ 新建
- **路径**: `education/language-tutor/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["语言学习", "外语学习", "口语练习", "背单词", "语言辅导"]
- **2026 AI能力**: AI对话练习、发音纠正、文化讲解
- **references**: examples.md, learning-paths.md, common-errors.md, resources.md
- **变更内容**: 新建技能

#### 16. coding-tutor ⭐ 新建
- **路径**: `education/coding-tutor/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["编程学习", "代码教学", "编程辅导", "算法学习", "软件开发学习"]
- **2026 AI能力**: AI代码解释、调试指导、项目实践
- **references**: examples.md, concepts.md, coding-standards.md, common-errors.md
- **变更内容**: 新建技能

#### 17. science-lab ⭐ 新建
- **路径**: `education/science-lab/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["科学实验", "实验报告", "实验室", "实验设计", "理科实验"]
- **2026 AI能力**: AI实验设计、误差分析、数据处理
- **references**: examples.md, methodology.md, data-processing.md, error-analysis.md
- **变更内容**: 新建技能

#### 18. essay-review ⭐ 新建
- **路径**: `education/essay-review/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["作文批改", "论文润色", "文章修改", "写作指导", "议论文辅导"]
- **2026 AI能力**: AI评分、问题诊断、修改建议
- **references**: examples.md, writing-tips.md, problem-diagnosis.md, materials.md
- **变更内容**: 新建技能

---

### 七、Life 生活类 (11个)

#### 1. travel-planner
- **路径**: `life/travel-planner/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["规划旅行", "制定行程", "旅行计划", "去哪玩", "行程安排"]
- **2026 AI能力**: AI智能路线规划、实时天气集成、文化差异提醒
- **references**: destinations.md, itinerary-templates.md, budget-planning.md, examples.md
- **变更内容**: 新增AI路线规划和实时天气集成

#### 2. recipe-recommender
- **路径**: `life/recipe-recommender/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["食谱推荐", "菜谱", "做什么菜", "菜谱推荐", "烹饪"]
- **2026 AI能力**: AI食谱生成、营养分析、食材替代建议
- **references**: cuisine-types.md, dietary-needs.md, nutrition-guide.md, examples.md
- **变更内容**: 新增AI食谱生成和营养分析

#### 3. fitness-plan
- **路径**: `life/fitness-plan/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["健身计划", "锻炼计划", "增肌", "减脂", "体能训练"]
- **2026 AI能力**: AI训练计划生成、身体状态评估、智能动作指导
- **references**: workout-types.md, plan-templates.md, nutrition-basics.md, examples.md
- **变更内容**: 新增AI训练计划生成和身体状态评估

#### 4. finance-advisor
- **路径**: `life/finance-advisor/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["理财建议", "财务规划", "省钱", "投资理财", "预算"]
- **2026 AI能力**: AI预算分析、投资建议、风险评估
- **references**: budgeting.md, investment-basics.md, debt-management.md, examples.md
- **变更内容**: 新增AI预算分析和投资建议

#### 5. shopping-advisor
- **路径**: `life/shopping-advisor/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["购物建议", "买什么", "产品推荐", "选购指南", "比价"]
- **2026 AI能力**: AI比价分析、性价比评估、产品对比
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI比价分析和性价比评估

#### 6. health-advisor
- **路径**: `life/health-advisor/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["健康建议", "养生", "饮食建议", "生活习惯", "健康咨询"]
- **2026 AI能力**: AI健康评估、生活习惯分析、健康预警
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI健康评估和生活习惯分析

#### 7. gift-advisor
- **路径**: `life/gift-advisor/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["礼物推荐", "送什么", "生日礼物", "礼品", "节日礼物"]
- **2026 AI能力**: AI礼品推荐、个性分析、预算适配
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI礼品推荐和个性分析

#### 8. movie-recommender
- **路径**: `life/movie-recommender/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["电影推荐", "看什么电影", "影评", "观影", "剧集推荐"]
- **2026 AI能力**: AI观影偏好分析、影评摘要、相似推荐
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI观影偏好分析和影评摘要

#### 9. music-playlist
- **路径**: `life/music-playlist/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["歌单推荐", "音乐推荐", "歌单", "playlist", "听什么"]
- **2026 AI能力**: AI音乐品味分析、场景匹配、新歌发现
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI音乐品味分析和场景匹配

#### 10. home-reno
- **路径**: `life/home-reno/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["装修", "家居改造", "室内设计", "新房装修", "软装"]
- **2026 AI能力**: AI设计方案、风格推荐、预算估算
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI设计方案和风格推荐

#### 11. photo-tips
- **路径**: `life/photo-tips/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["拍照技巧", "摄影技巧", "照片拍摄", "构图", "摄影参数"]
- **2026 AI能力**: AI场景识别、参数建议、后期建议
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI场景识别和参数建议

#### 12. pet-care
- **路径**: `life/pet-care/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["宠物养护", "养狗", "养猫", "宠物健康", "宠物喂养"]
- **2026 AI能力**: AI健康监测、饮食建议、行为解读
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI健康监测和行为解读

#### 13. schedule-planner
- **路径**: `life/schedule-planner/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["日程规划", "时间管理", "日程安排", "每日计划", "周计划"]
- **2026 AI能力**: AI日程优化、时间块规划、优先级建议
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新增AI日程优化和优先级建议

#### 14. homework-helper ⭐ 新建
- **路径**: `life/homework-helper/SKILL.md`
- **v3.0更新**: 2026-04-17
- **skillLevel**: L2
- **userInvocable**: true
- **triggerPhrases**: ["作业辅导", "孩子作业", "家庭教育", "课后辅导", "功课"]
- **2026 AI能力**: AI分步讲解、知识点定位、习惯培养
- **references**: workflow.md, edge-cases.md, error-handling.md, examples.md
- **变更内容**: 新建技能

---

## 统计汇总

| 类别 | 技能数量 | 新建数量 |
|------|----------|----------|
| Data 数据分析 | 14 | 1 |
| Writing 写作 | 16 | 3 |
| Design 设计 | 16 | 6 |
| Business 商业 | 16 | 0 |
| Professional 专业 | 7 | 0 |
| Education 教育 | 17 | 7 |
| Life 生活 | 14 | 1 |
| **总计** | **100** | **18** |

---

## 新增技能列表 (18个)

| 技能名 | 路径 | 说明 |
|--------|------|------|
| sql-query | `data/sql-query/` | SQL查询与优化 |
| chart-designer | `data/chart-designer/` | 图表设计 |
| design-brief | `writing/design-brief/` | 设计简报撰写 |
| proposal-writer | `writing/proposal-writer/` | 商业提案撰写 |
| ux-principles | `design/ux-principles/` | UX设计原则 |
| presentation-maker | `design/presentation-maker/` | 演示文稿制作 |
| mockup-generator | `design/mockup-generator/` | Mockup生成器 |
| visual-identity | `design/visual-identity/` | 视觉识别系统 |
| illustration-picker | `design/illustration-picker/` | 插画选择 |
| animation-guide | `design/animation-guide/` | 动效设计指南 |
| knowledge-explainer | `education/knowledge-explainer/` | 知识讲解 |
| flashcard-generator | `education/flashcard-generator/` | 闪卡生成器 |
| note-organizer | `education/note-organizer/` | 笔记整理 |
| language-tutor | `education/language-tutor/` | 语言导师 |
| coding-tutor | `education/coding-tutor/` | 编程导师 |
| science-lab | `education/science-lab/` | 科学实验 |
| essay-review | `education/essay-review/` | 作文批改 |
| homework-helper | `life/homework-helper/` | 作业辅导 |

---

## 2026 AI能力新增汇总

| AI能力类型 | 应用场景 |
|------------|----------|
| **自然语言处理** | SQL生成、公式生成、邮件撰写、摘要提取 |
| **智能分析** | 竞品分析、用户画像、财务分析、风险评估 |
| **预测建模** | 流失预测、增长预测、需求预测、投资评估 |
| **内容生成** | 报告生成、文案创作、幻灯片生成、食谱生成 |
| **智能优化** | 路线规划、定价优化、日程优化、配方优化 |
| **多模态** | 图解生成、物理模拟、概念可视化、UI反馈 |
| **自动化** | 特征工程、测试设计、报告生成、任务拆解 |

---

## 下一步建议

1. **技能测试**: 随机选取10个技能进行实际调用测试
2. **文档完善**: 补充缺失的examples.md内容
3. **技能关联**: 建立技能间引用，形成技能网络
4. **持续迭代**: 根据使用反馈持续优化各技能

---

*报告生成时间: 2026-04-17*
*总技能数: 100+*
*本次更新: 92个技能*
