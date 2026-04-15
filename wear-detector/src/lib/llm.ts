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

export async function analyzeWear(input: {
  wearDescription: string;
  context?: {
    equipmentType?: string;
    wearDescription?: string;
    operatingHours?: string;
    maintenanceHistory?: string;
  };
}): Promise<{
  wearAnalysis: {
    type: string;
    severity: 'critical' | 'warning' | 'normal';
    description: string;
    metrics: {
      wearRate: string;
      temperatureRise: string;
      vibrationLevel: string;
    };
  }[];
  lifeEstimation: {
    remainingLife: number;
    totalLife: number;
    condition: 'high' | 'medium' | 'low';
    estimatedHours: number;
  };
  maintenanceSuggestions: {
    priority: 'urgent' | 'recommended' | 'precautionary';
    title: string;
    description: string;
  }[];
}> {
  console.log('analyzeWear input:', JSON.stringify(input, null, 2));
  const systemPrompt = `你是一个工业设备磨损分析专家。你的任务是根据用户描述的设备磨损情况，分析磨损类型、评估严重程度、估算剩余寿命，并提供维护建议。

分析框架：
1. 磨损分析：识别磨损类型（如疲劳磨损、磨粒磨损、粘着磨损等），评估严重程度
2. 寿命评估：基于磨损状况和运行数据，估算剩余使用寿命
3. 维护建议：根据磨损分析结果，给出优先级维护建议

严重程度判断标准：
- critical（严重）：磨损速率高，温升显著，振动异常，需立即停机检查
- warning（警告）：存在明显磨损迹象，需计划性维护
- normal（正常）：磨损在可控范围内

优先级定义：
- urgent（紧急）：影响生产安全，需立即处理
- recommended（建议）：建议在下次停机时处理
- precautionary（预防）：预防性维护建议

请分析以下磨损情况，返回JSON格式的分析结果。`;

  const userPrompt = `请分析以下设备磨损情况：
磨损描述：${input.wearDescription}
${input.context ? `
设备信息：
- 设备类型：${input.context.equipmentType || '未填写'}
- 磨损详情：${input.context.wearDescription || '未填写'}
- 运行时间：${input.context.operatingHours || '未填写'}
- 维护历史：${input.context.maintenanceHistory || '未填写'}
` : ''}

请返回JSON格式的分析结果，结构如下：
{
  "wearAnalysis": [
    {
      "type": "磨损类型（如疲劳磨损、磨粒磨损等）",
      "severity": "critical/warning/normal",
      "description": "磨损情况详细描述",
      "metrics": {
        "wearRate": "磨损速率（如0.35mm/kh）",
        "temperatureRise": "温升（如25℃）",
        "vibrationLevel": "high/medium/low"
      }
    }
  ],
  "lifeEstimation": {
    "remainingLife": 剩余使用寿命（小时数）,
    "totalLife": 预期总使用寿命（小时数）,
    "condition": "high/medium/low（condition表示剩余寿命占比，高表示剩余多，低表示剩余少）",
    "estimatedHours": 估算的剩余运行小时数
  },
  "maintenanceSuggestions": [
    {
      "priority": "urgent/recommended/precautionary",
      "title": "建议标题",
      "description": "建议详细说明"
    }
  ]
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
      wearAnalysis: [],
      lifeEstimation: { remainingLife: 0, totalLife: 100, condition: 'low', estimatedHours: 0 },
      maintenanceSuggestions: [],
      _raw: resultText,
    } as any;
  }
}

export function mockAnalyze(input: {
  wearDescription: string;
  context?: {
    equipmentType?: string;
    wearDescription?: string;
    operatingHours?: string;
    maintenanceHistory?: string;
  };
}) {
  return {
    wearAnalysis: [
      {
        type: '疲劳磨损',
        severity: 'warning' as const,
        description: '轴承外圈表面出现疲劳剥落，内圈存在粘着磨损迹象，保持架磨损严重。这表明轴承已进入磨损后期阶段。',
        metrics: {
          wearRate: '0.35mm/kh',
          temperatureRise: '25℃',
          vibrationLevel: 'medium' as const,
        },
      },
      {
        type: '润滑不良',
        severity: 'critical' as const,
        description: '轴承润滑脂存在老化迹象，润滑效果下降，加剧了磨损进程。',
        metrics: {
          wearRate: '0.42mm/kh',
          temperatureRise: '35℃',
          vibrationLevel: 'high' as const,
        },
      },
    ],
    lifeEstimation: {
      remainingLife: 1500,
      totalLife: 20000,
      condition: 'medium' as const,
      estimatedHours: 1500,
    },
    maintenanceSuggestions: [
      {
        priority: 'urgent' as const,
        title: '立即更换轴承',
        description: '当前轴承已严重磨损，继续运行可能导致设备损坏。建议在72小时内安排更换。',
      },
      {
        priority: 'recommended' as const,
        title: '检查润滑系统',
        description: '更换轴承的同时，建议对润滑系统进行全面检查，更换润滑脂。',
      },
      {
        priority: 'precautionary' as const,
        title: '建立在线监测',
        description: '建议在更换后安装振动和温度传感器，实现磨损的在线监测和预警。',
      },
    ],
  };
}
