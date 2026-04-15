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

export async function analyzeProductionSchedule(input: {
  jobDescription: string;
  context?: {
    machines?: string;
    workers?: string;
    materials?: string;
    deadline?: string;
    priority?: string;
  };
}): Promise<{
  tasks: {
    name: string;
    duration: string;
    resources: string[];
    priority: 'high' | 'medium' | 'low';
  }[];
  schedule: {
    time: string;
    task: string;
    machine?: string;
    worker?: string;
  }[];
  recommendations: {
    optimizeSuggestions?: string[];
    riskWarnings?: string[];
    resourceSuggestions?: string[];
  };
}> {
  console.log('analyzeProductionSchedule input:', JSON.stringify(input, null, 2));
  const systemPrompt = `你是一个生产调度专家。你的任务是根据用户输入的生产任务信息，生成优化的生产排程方案。

分析框架：
1. 任务分解：将生产任务拆解为可执行的子任务
2. 资源分配：合理分配机器、人工、物料资源
3. 时间排程：考虑交期、优先级、准备时间
4. 风险评估：识别潜在风险并提供预警

排程原则：
- 优先处理高优先级订单
- 合理安排机器准备时间
- 避免资源冲突
- 最大化设备利用率
- 确保交期达成

请分析以下生产任务，返回JSON格式的排程结果。`;

  const userPrompt = `请分析以下生产任务并生成排程方案：
生产任务描述：${input.jobDescription}
${input.context ? `
上下文信息：
- 设备/机器：${input.context.machines || '未填写'}
- 人员配置：${input.context.workers || '未填写'}
- 物料情况：${input.context.materials || '未填写'}
- 交期要求：${input.context.deadline || '未填写'}
- 优先级：${input.context.priority || '未填写'}
` : ''}

请返回JSON格式的分析结果，结构如下：
{
  "tasks": [
    {
      "name": "任务名称",
      "duration": "预计工期",
      "resources": ["所需资源1", "所需资源2"],
      "priority": "high/medium/low"
    }
  ],
  "schedule": [
    {
      "time": "时间",
      "task": "任务名称",
      "machine": "机器",
      "worker": "人员"
    }
  ],
  "recommendations": {
    "optimizeSuggestions": ["优化建议1", "优化建议2"],
    "riskWarnings": ["风险预警1", "风险预警2"],
    "resourceSuggestions": ["资源建议1", "资源建议2"]
  }
}`;

  const resultText = await chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  console.log('LLM raw result:', resultText);
  try {
    // LLM返回的content可能包含markdown代码块包裹的JSON，需要提取
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
      schedule: [],
      recommendations: {},
      _raw: resultText,
    } as any;
  }
}

export function mockAnalyze(input: {
  jobDescription: string;
  context?: {
    machines?: string;
    workers?: string;
    materials?: string;
    deadline?: string;
    priority?: string;
  };
}) {
  return {
    tasks: [
      {
        name: '任务1：原材料准备',
        duration: '2小时',
        resources: ['物料A', '物料B'],
        priority: 'high' as const,
      },
      {
        name: '任务2：加工作业',
        duration: '4小时',
        resources: ['CNC机床1号', '操作工张三'],
        priority: 'high' as const,
      },
      {
        name: '任务3：质量检测',
        duration: '1小时',
        resources: ['质检设备', '质检员李四'],
        priority: 'medium' as const,
      },
      {
        name: '任务4：包装入库',
        duration: '1小时',
        resources: ['包装线', '包装工王五'],
        priority: 'low' as const,
      },
    ],
    schedule: [
      { time: '08:00-10:00', task: '原材料准备', machine: '备料区', worker: '物料员' },
      { time: '10:00-14:00', task: '加工作业', machine: 'CNC机床1号', worker: '张三' },
      { time: '14:00-15:00', task: '质量检测', machine: '质检设备', worker: '李四' },
      { time: '15:00-16:00', task: '包装入库', machine: '包装线', worker: '王五' },
    ],
    recommendations: {
      optimizeSuggestions: [
        '建议将加工作业安排在上午时段，设备效率更高',
        '可以在加工等待期间并行进行质量检测准备',
        '建议采用批量生产模式减少换模时间',
      ],
      riskWarnings: [
        '物料A库存仅够当日使用，需提前补货',
        'CNC机床1号上周刚保养，本周无维护计划',
      ],
      resourceSuggestions: [
        '建议培养多能工以应对临时人员调配',
        '考虑增加一台检测设备以提升质检效率',
      ],
    },
  };
}
