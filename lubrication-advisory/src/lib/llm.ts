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

export async function analyzeLubrication(input: {
  description: string;
  context?: {
    equipment?: string;
    operatingConditions?: string;
    oilType?: string;
    maintenanceHistory?: string;
  };
}): Promise<{
  lubricationPlan: {
    recommendedOil: string;
    oilGrade: string;
    viscosityGrade: string;
    changeInterval: string;
    lubricationMethod: string;
  };
  maintenanceSchedule: {
    daily: string[];
    weekly: string[];
    monthly: string[];
    quarterly: string[];
    yearly: string[];
  };
  recommendations: {
    precautions: string[];
    commonIssues: { issue: string; solution: string }[];
    optimization: string[];
  };
}> {
  console.log('analyzeLubrication input:', JSON.stringify(input, null, 2));
  const systemPrompt = `你是一个润滑工程专家。你的任务是根据用户描述的设备和工况条件，提供专业的润滑方案建议。

分析框架：
1. 了解设备类型和工况
2. 推荐合适的油品类型和粘度等级
3. 制定维护周期
4. 提供注意事项和优化建议

请始终返回JSON格式的分析结果。`;

  const userPrompt = `请分析以下润滑需求：
问题描述：${input.description}
${input.context ? `
设备信息：${input.context.equipment || '未填写'}
工况条件：${input.context.operatingConditions || '未填写'}
当前油品：${input.context.oilType || '未填写'}
维护历史：${input.context.maintenanceHistory || '未填写'}
` : ''}

请返回JSON格式的分析结果，结构如下：
{
  "lubricationPlan": {
    "recommendedOil": "推荐油品名称",
    "oilGrade": "油品级别（如ISO VG、SAE等）",
    "viscosityGrade": "粘度等级",
    "changeInterval": "换油周期建议",
    "lubricationMethod": "润滑方式建议"
  },
  "maintenanceSchedule": {
    "daily": ["每日维护项1", "每日维护项2"],
    "weekly": ["每周维护项1"],
    "monthly": ["每月维护项1"],
    "quarterly": ["每季度维护项1"],
    "yearly": ["每年维护项1"]
  },
  "recommendations": {
    "precautions": ["注意事项1", "注意事项2"],
    "commonIssues": [
      {"issue": "常见问题1", "solution": "解决方案1"}
    ],
    "optimization": ["优化建议1", "优化建议2"]
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
      lubricationPlan: {
        recommendedOil: '分析失败，请稍后重试',
        oilGrade: '-',
        viscosityGrade: '-',
        changeInterval: '-',
        lubricationMethod: '-',
      },
      maintenanceSchedule: {
        daily: [],
        weekly: [],
        monthly: [],
        quarterly: [],
        yearly: [],
      },
      recommendations: {
        precautions: ['分析失败，请稍后重试'],
        commonIssues: [],
        optimization: [],
      },
      _raw: resultText,
    } as any;
  }
}

export function mockAnalyze(input: {
  description: string;
  context?: {
    equipment?: string;
    operatingConditions?: string;
    oilType?: string;
    maintenanceHistory?: string;
  };
}) {
  return {
    lubricationPlan: {
      recommendedOil: '长城通用工业润滑油 L-HM 68',
      oilGrade: 'ISO VG 68',
      viscosityGrade: 'VG 68（40℃运动粘度60-75mm²/s）',
      changeInterval: '正常运行12个月或2000工作小时，以先到为准',
      lubricationMethod: '循环油浴润滑 + 油雾润滑辅助',
    },
    maintenanceSchedule: {
      daily: [
        '检查油位是否在规定范围内',
        '观察油品颜色和透明度',
        '检查有无异常噪音或振动',
        '记录运行温度',
      ],
      weekly: [
        '清洁设备表面油污',
        '检查油冷却器工作状态',
        '检查过滤器压差',
        '记录油品消耗量',
      ],
      monthly: [
        '取样检测油品品质',
        '清洁或更换空气过滤器',
        '检查密封件有无泄漏',
        '检查油路阀门状态',
      ],
      quarterly: [
        '全量更换润滑油',
        '清洁油箱内部',
        '检查并清洁冷却器',
        '检查油泵运行状态',
      ],
      yearly: [
        '全面检查润滑系统',
        '更换所有密封件',
        '校验仪表准确性',
        '建立设备润滑档案',
      ],
    },
    recommendations: {
      precautions: [
        '不同品牌油品禁止混合使用',
        '加油前确保容器和工具清洁',
        '避免在运行中打开油箱盖',
        '换油时必须同时更换过滤器',
        '定期检测水分含量，超过0.1%需立即换油',
      ],
      commonIssues: [
        { issue: '油温过高', solution: '检查冷却器是否堵塞或失效，增加油循环量' },
        { issue: '油品变黑变稠', solution: '可能污染或氧化，及时取样检测，必要时立即换油' },
        { issue: '过滤器频繁堵塞', solution: '检查油品质量和污染来源，增加预过滤' },
        { issue: '噪音和振动', solution: '可能是油量不足或泵磨损，检查油位和泵状态' },
      ],
      optimization: [
        '建议安装在线油品监测系统，实时监控油品状态',
        '可考虑采用合成润滑油，延长换油周期50%以上',
        '建议建立油品库存管理，避免油品过期',
        '优化换油流程，采用快速接头减少停机时间',
      ],
    },
  };
}
