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

export async function analyzeProductionPlan(input: {
  description: string;
  context?: {
    productType?: string;
    productionVolume?: string;
    leadTime?: string;
    resources?: string;
  };
}): Promise<{
  productionPlan: {
    phase: string;
    tasks: string[];
    timeline: string;
    output: string;
  }[];
  capacityAnalysis: {
    currentUtilization: number;
    bottleneck: string;
    suggestions: string[];
  };
  materialRequirements: {
    material: string;
    quantity: string;
    deliveryTime: string;
    priority: string;
  }[];
  recommendations: string[];
}> {
  console.log('analyzeProductionPlan input:', JSON.stringify(input, null, 2));
  const systemPrompt = `你是一个生产计划专家。你的任务是根据用户输入的生产需求，分析并生成合理的生产计划、产能分析和物料需求计划。

分析框架：
1. 生产计划制定：分解任务、安排工序、确定时间节点
2. 产能分析：评估当前产能利用率、识别瓶颈、提出改善建议
3. 物料需求计划：根据BOM和库存情况，计算物料需求

输出要求：
- 生产计划要具体、可执行
- 产能分析要基于数据
- 物料需求要考虑采购周期和安全库存`;

  const userPrompt = `请分析以下生产需求：
需求描述：${input.description}
${input.context ? `
上下文信息：
- 产品类型：${input.context.productType || '未填写'}
- 产量规模：${input.context.productionVolume || '未填写'}
- 交期要求：${input.context.leadTime || '未填写'}
- 可用资源：${input.context.resources || '未填写'}
` : ''}

请返回JSON格式的分析结果，结构如下：
{
  "productionPlan": [
    {
      "phase": "阶段名称",
      "tasks": ["任务1", "任务2"],
      "timeline": "时间安排",
      "output": "阶段产出"
    }
  ],
  "capacityAnalysis": {
    "currentUtilization": 0-100,
    "bottleneck": "瓶颈描述",
    "suggestions": ["改善建议1", "改善建议2"]
  },
  "materialRequirements": [
    {
      "material": "物料名称",
      "quantity": "需求量",
      "deliveryTime": "到货时间",
      "priority": "优先级"
    }
  ],
  "recommendations": ["建议1", "建议2", "建议3"]
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
      productionPlan: [],
      capacityAnalysis: { currentUtilization: 0, bottleneck: '', suggestions: [] },
      materialRequirements: [],
      recommendations: [],
      _raw: resultText,
    } as any;
  }
}

export function mockAnalyze(input: {
  description: string;
  context?: {
    productType?: string;
    productionVolume?: string;
    leadTime?: string;
    resources?: string;
  };
}) {
  return {
    productionPlan: [
      {
        phase: '第一阶段：准备期',
        tasks: ['物料采购与入库检查', '设备调试与首件确认', '生产人员排班安排'],
        timeline: '第1-3天',
        output: '物料就位，设备就绪',
      },
      {
        phase: '第二阶段：生产执行',
        tasks: ['原材料切割与加工', '部件组装与检验', '半成品流转至下道工序'],
        timeline: '第4-10天',
        output: '完成80%产量',
      },
      {
        phase: '第三阶段：完成与入库',
        tasks: ['产品终检与包装', '成品入库与登记', '出货准备'],
        timeline: '第11-15天',
        output: '全部成品入库待发货',
      },
    ],
    capacityAnalysis: {
      currentUtilization: 78,
      bottleneck: '组装工序产能不足，现有设备日产能1,000件，需求1,200件/天',
      suggestions: [
        '建议增加1台自动化组装设备，可提升产能30%',
        '优化组装工序布局，减少搬运时间',
        '考虑外包部分非核心组装工序',
      ],
    },
    materialRequirements: [
      {
        material: 'A类原材料（主材）',
        quantity: '5,000套',
        deliveryTime: '第1天前到位',
        priority: '高',
      },
      {
        material: 'B类原材料（辅材）',
        quantity: '10,000件',
        deliveryTime: '第2天前到位',
        priority: '中',
      },
      {
        material: '包装材料',
        quantity: '5,200套',
        deliveryTime: '第8天前到位',
        priority: '中',
      },
    ],
    recommendations: [
      '生产计划已按15天周期排定，建议严格按计划执行',
      '组装工序为瓶颈工序，需重点关注进度',
      '建议提前与供应商确认交期，避免物料延迟影响生产',
      '产能利用率78%处于合理水平，可通过改善提升至85%以上',
    ],
  };
}
