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

export async function analyzeEquipmentHealth(input: {
  equipmentData: string;
  context?: {
    equipmentName?: string;
    monitoringParams?: string;
    alertThreshold?: string;
    frequency?: string;
  };
}): Promise<{
  healthScore: number;
  status: 'normal' | 'warning' | 'critical';
  metrics: {
    name: string;
    value: number;
    status: 'normal' | 'warning' | 'critical';
    description: string;
  }[];
  alerts: {
    level: 'info' | 'warning' | 'critical';
    message: string;
    suggestion: string;
  }[];
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}> {
  console.log('analyzeEquipmentHealth input:', JSON.stringify(input, null, 2));
  const systemPrompt = `你是一个设备健康监测专家。你的任务是根据设备数据，分析设备状态，计算健康评分，并提供维护建议。

分析框架：
1. 数据层：设备运行参数和历史数据
2. 分析层：计算各项指标，评估异常程度
3. 告警层：识别潜在故障，评估风险等级
4. 建议层：提供维护和优化方案

评分标准：
- 健康评分 80-100：设备运行正常，无需特别处理
- 健康评分 60-79：存在轻微异常，建议关注
- 健康评分 40-59：存在明显异常，需要维护
- 健康评分 <40：严重故障风险，需要立即处理

请分析以下设备数据，返回JSON格式的分析结果。`;

  const userPrompt = `请分析以下设备数据：
设备数据：${input.equipmentData}
${input.context ? `
设备信息：
- 设备名称：${input.context.equipmentName || '未填写'}
- 监控参数：${input.context.monitoringParams || '未填写'}
- 告警阈值：${input.context.alertThreshold || '未填写'}
- 监控频率：${input.context.frequency || '未填写'}
` : ''}

请返回JSON格式的分析结果，结构如下：
{
  "healthScore": 85,
  "status": "normal",
  "metrics": [
    {
      "name": "温度",
      "value": 65,
      "status": "normal",
      "description": "当前温度在正常范围内"
    }
  ],
  "alerts": [
    {
      "level": "warning",
      "message": "主轴温度偏高",
      "suggestion": "建议检查润滑系统"
    }
  ],
  "recommendations": {
    "immediate": ["立即检查润滑系统"],
    "shortTerm": ["安排下周维护检查"],
    "longTerm": ["考虑设备升级换代"]
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
      healthScore: 0,
      status: 'critical',
      metrics: [],
      alerts: [],
      recommendations: { immediate: [], shortTerm: [], longTerm: [] },
      _raw: resultText,
    } as any;
  }
}

export function mockAnalyzeEquipment(input: {
  equipmentData: string;
  context?: {
    equipmentName?: string;
    monitoringParams?: string;
    alertThreshold?: string;
    frequency?: string;
  };
}) {
  return {
    healthScore: 78,
    status: 'warning',
    metrics: [
      {
        name: '温度',
        value: 72,
        status: 'warning',
        description: '温度偏高，但仍在安全范围内',
      },
      {
        name: '振动',
        value: 3.2,
        status: 'normal',
        description: '振动值正常',
      },
      {
        name: '压力',
        value: 8.5,
        status: 'normal',
        description: '压力稳定',
      },
      {
        name: '功率',
        value: 85,
        status: 'warning',
        description: '功率偏高，可能存在负载异常',
      },
    ],
    alerts: [
      {
        level: 'warning',
        message: '温度超过警戒线',
        suggestion: '检查设备散热系统，确保通风良好',
      },
      {
        level: 'info',
        message: '功率波动检测到',
        suggestion: '建议观察是否有异常负载变化',
      },
    ],
    recommendations: {
      immediate: ['加强温度监控，每小时记录一次'],
      shortTerm: ['本周内安排预防性维护检查'],
      longTerm: ['考虑增加散热设备或升级现有冷却系统'],
    },
  };
}
