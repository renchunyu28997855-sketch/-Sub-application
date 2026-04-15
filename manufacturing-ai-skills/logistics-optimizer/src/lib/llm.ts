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

export async function analyzeLogistics(input: {
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
  console.log('analyzeLogistics input:', JSON.stringify(input, null, 2));
  const systemPrompt = `你是一个物流优化专家。你的任务是根据用户输入的物流场景，分析并判断哪些环节可以转化为Skill（技能）或Agent（智能体），哪些需要保留人力或系统。

物流优化分析框架：
1. 输入层：物流场景描述和上下文信息
2. 分析层：拆解为原子任务，标注属性
3. 决策层：分类为Skill化/Agent化/保留人力/保留系统
4. 输出层：生成优化方案

分类标准：
- Skill化：数字化评分≥7，规则评分≥6，容错评分≥5，且可复用
- Agent化：数字化评分≥8，规则评分≥7，容错评分≥6，需多步骤协同
- 保留人力：规则评分≤4，或容错评分≤3，或涉及复杂情感交互
- 保留系统：任务已由现有系统完全覆盖

请分析以下物流场景，返回JSON格式的分析结果。`;

  const userPrompt = `请分析以下物流场景：
物流描述：${input.jobDescription}
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
        name: '任务1：路径规划与优化',
        skills: ['地图API调用', '路径算法', '距离计算'],
        digitalScore: 9,
        ruleScore: 8,
        faultTolerance: 7,
      },
      {
        name: '任务2：成本核算与报价',
        skills: ['成本计算', '报价生成', '数据分析'],
        digitalScore: 8,
        ruleScore: 8,
        faultTolerance: 7,
      },
      {
        name: '任务3：配送调度分配',
        skills: ['调度算法', '资源分配', '时间窗口管理'],
        digitalScore: 8,
        ruleScore: 7,
        faultTolerance: 6,
      },
      {
        name: '任务4：异常处理与客户沟通',
        skills: ['问题分析', '客户沟通', '应急处理'],
        digitalScore: 5,
        ruleScore: 4,
        faultTolerance: 3,
      },
    ],
    classification: ['skill', 'skill', 'agent', 'human'] as const,
    recommendations: {
      skillDocuments: [
        {
          name: '路径规划技能',
          input: '起止坐标列表、途经点、运输约束条件',
          output: '最优路径顺序、距离、时间估算',
          apiExample: 'POST /api/skill/route_optimize {"origins": ["地址1"], "destinations": ["地址2"], "waypoints": ["途经点"]}',
        },
        {
          name: '成本核算技能',
          input: '运输距离、货物重量体积、车型',
          output: '各项成本明细、总运费报价',
          apiExample: 'POST /api/skill/cost_calculate {"distance": 500, "weight": 1000, "volume": 10, "vehicle_type": "truck"}',
        },
        {
          name: '配送调度技能',
          input: '订单列表、可用车辆、司机排班',
          output: '配送排程表、任务分配方案',
          apiExample: 'POST /api/skill/dispatch_optimize {"orders": [...], "vehicles": [...], "drivers": [...]}',
        },
      ],
      agentDesign: [
        {
          role: '物流调度Agent',
          capabilities: ['路径规划技能', '成本核算技能', '配送调度技能', '实时监控能力'],
          workflow: ['接收配送任务', '调用路径规划', '计算运输成本', '生成调度方案', '分配司机执行', '实时跟踪反馈'],
        },
      ],
      humanSuggestions: [
        '调度员需加强异常情况处理能力培训',
        '可将路径规划、成本核算、调度分配交由系统执行，人员仅负责异常处理和客户沟通',
        '预计可将调度效率提升40%，降低运输成本15%',
      ],
      systemSuggestions: [
        '建议对接GPS系统实现车辆实时跟踪',
        '建议对接地图API实现自动化路径规划',
        '建议建立历史成本数据库用于报价参考',
      ],
    },
  };
}
