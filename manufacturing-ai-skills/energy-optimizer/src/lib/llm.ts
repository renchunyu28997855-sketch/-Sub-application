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

export async function analyzeEnergy(input: {
  facilityId?: string;
  analysisType: string;
  consumptionData?: {
    electricity?: { consumption: number; cost: number };
    gas?: { consumption: number; cost: number };
  };
  equipmentData?: {
    motor?: { power: number; current: number; voltage: number; powerFactor: number; efficiency: number };
    hvac?: { power: number; cop: number };
  };
  renewableData?: {
    solar?: { capacity: number; sunHours: number };
    wind?: { capacity: number; capacityFactor: number };
  };
  utilityData?: {
    peakRate: number;
    offPeakRate: number;
    demandCharge: number;
    gridPrice: number;
  };
}): Promise<{
  consumption?: {
    totalKwh: number;
    breakdown: Record<string, number>;
    totalCost: number;
    energyIntensity: number;
    carbonEmissions: number;
  };
  motor?: {
    ratedPower: number;
    efficiencyClass: string;
    potentialSavings: number;
  };
  hvac?: {
    totalPotentialAnnualSaving: number;
    components: Record<string, number>;
  };
  lighting?: {
    currentEfficiency: string;
    totalPotentialAnnualSaving: number;
  };
  peakShaving?: {
    current: { peakRatio: number };
    potential: { annualSaving: number };
  };
  summary: {
    totalCurrentCost: number;
    totalPotentialAnnualSaving: number;
    recommendations: string[];
  };
}> {
  console.log('analyzeEnergy input:', JSON.stringify(input, null, 2));

  const systemPrompt = `你是一个工业能源优化专家。你的任务是根据用户输入的能源数据，进行全面的能源分析，并提供节能建议和优化方案。

分析框架：
1. 输入层：设施信息、分析类型、能源消耗数据、设备参数
2. 分析层：根据分析类型进行针对性分析
3. 输出层：生成分析结果和优化建议

分析类型包括：
- comprehensive: 综合能源分析
- consumption: 能源消耗分析
- motor: 电机能效评估
- hvac: 暖通空调分析
- lighting: 照明系统分析
- compressor: 压缩机分析
- peak-shaving: 峰谷调节分析
- renewable: 可再生能源分析
- carbon: 碳排放分析

请分析以下能源数据，返回JSON格式的分析结果。`;

  const userPrompt = `请分析以下能源数据：

设施ID: ${input.facilityId || '未指定'}
分析类型: ${input.analysisType}

能源消耗数据:
${input.consumptionData ? JSON.stringify(input.consumptionData, null, 2) : '未提供'}

设备参数:
${input.equipmentData ? JSON.stringify(input.equipmentData, null, 2) : '未提供'}

可再生能源:
${input.renewableData ? JSON.stringify(input.renewableData, null, 2) : '未提供'}

电价信息:
${input.utilityData ? JSON.stringify(input.utilityData, null, 2) : '未提供'}

请返回JSON格式的分析结果，结构如下：
{
  "consumption": {
    "totalKwh": 总消耗kWh,
    "breakdown": {类型: kWh},
    "totalCost": 总费用,
    "energyIntensity": 单位面积能耗,
    "carbonEmissions": 碳排放量tCO2
  },
  "motor": {
    "ratedPower": 额定功率kW,
    "efficiencyClass": "能效等级如IE3/IE4",
    "potentialSavings": 节能潜力元/年
  },
  "hvac": {
    "totalPotentialAnnualSaving": 年节省元,
    "components": {组件: 节省元}
  },
  "lighting": {
    "currentEfficiency": "当前效率",
    "totalPotentialAnnualSaving": 年节省元
  },
  "peakShaving": {
    "current": { "peakRatio": 峰谷比 },
    "potential": { "annualSaving": 年节省元 }
  },
  "summary": {
    "totalCurrentCost": 当前总成本元,
    "totalPotentialAnnualSaving": 预计年节省元,
    "recommendations": ["建议1", "建议2", ...]
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
      consumption: {
        totalKwh: 0,
        breakdown: {},
        totalCost: 0,
        energyIntensity: 0,
        carbonEmissions: 0,
      },
      summary: {
        totalCurrentCost: 0,
        totalPotentialAnnualSaving: 0,
        recommendations: [],
      },
      _raw: resultText,
    } as any;
  }
}

export function mockAnalyze(input: {
  facilityId?: string;
  analysisType: string;
  consumptionData?: {
    electricity?: { consumption: number; cost: number };
    gas?: { consumption: number; cost: number };
  };
  equipmentData?: {
    motor?: { power: number; current: number; voltage: number; powerFactor: number; efficiency: number };
    hvac?: { power: number; cop: number };
  };
  renewableData?: {
    solar?: { capacity: number; sunHours: number };
    wind?: { capacity: number; capacityFactor: number };
  };
  utilityData?: {
    peakRate: number;
    offPeakRate: number;
    demandCharge: number;
    gridPrice: number;
  };
}) {
  const electricityConsumption = input.consumptionData?.electricity?.consumption || 0;
  const electricityCost = input.consumptionData?.electricity?.cost || 0;
  const gasConsumption = input.consumptionData?.gas?.consumption || 0;
  const gasCost = input.consumptionData?.gas?.cost || 0;
  const totalCurrentCost = electricityCost + gasCost;

  const result: ReturnType<typeof analyzeEnergy> = {
    summary: {
      totalCurrentCost,
      totalPotentialAnnualSaving: Math.round(totalCurrentCost * 0.15),
      recommendations: [
        '建议安装智能能源管理系统，实时监控各车间能耗',
        '对老旧电机进行变频改造，预计节能10-15%',
        '利用峰谷电价差，优化生产排程',
        '增加光伏发电装机容量，自发自用',
      ],
    },
  };

  if (input.analysisType === 'comprehensive' || input.analysisType === 'consumption') {
    result.consumption = {
      totalKwh: electricityConsumption + gasConsumption * 10,
      breakdown: {
        '电力': electricityConsumption,
        '燃气': gasConsumption * 10,
      },
      totalCost: totalCurrentCost,
      energyIntensity: electricityConsumption / 1000,
      carbonEmissions: electricityConsumption * 0.0007 + gasConsumption * 0.0021,
    };
  }

  if (input.analysisType === 'motor' || input.analysisType === 'comprehensive') {
    const motorPower = input.equipmentData?.motor?.power || 100;
    result.motor = {
      ratedPower: motorPower,
      efficiencyClass: 'IE3',
      potentialSavings: Math.round(motorPower * 800),
    };
  }

  if (input.analysisType === 'peak-shaving' || input.analysisType === 'comprehensive') {
    const peakRate = input.utilityData?.peakRate || 1.2;
    const offPeakRate = input.utilityData?.offPeakRate || 0.6;
    const potentialSaving = Math.round(electricityConsumption * (peakRate - offPeakRate) * 0.3);
    result.peakShaving = {
      current: { peakRatio: 1.8 },
      potential: { annualSaving: potentialSaving },
    };
  }

  return result;
}
