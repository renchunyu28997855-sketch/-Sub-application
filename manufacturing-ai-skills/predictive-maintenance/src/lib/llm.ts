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

interface DegradationData {
  bearingCondition: number;
  windingTemp: number;
  vibration: number;
  seal: number;
  efficiency: number;
  equipmentAge: number;
}

interface HistoricalEntry {
  timestamp: string;
  healthIndex: number;
  degradationData: DegradationData;
}

interface Anomaly {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface CostData {
  plannedReplacementCost: number;
  emergencyReplacementCost: number;
  downtimeCostPerDay: number;
  maintenanceCostPerDay: number;
}

interface MaintenanceInput {
  equipmentId: string;
  equipmentType: 'centrifugal_pump' | 'induction_motor' | 'compressor' | 'gearbox' | 'turbine';
  operatingHours: number;
  degradationData: DegradationData;
  historicalData: HistoricalEntry[];
  anomalies: Anomaly[];
  costData: CostData;
}

interface RUL {
  hours: number;
  days: number;
  cycles: number;
  isExpired: boolean;
}

interface PossibleFailureMode {
  mode: string;
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

interface MaintenanceWindow {
  plannedReplacementNow: boolean;
  expectedFailureCost: number;
  potentialSavings: number;
  recommendedAction: string;
}

interface AnalysisResult {
  healthIndex: number;
  healthStatus: 'good' | 'fair' | 'warning' | 'poor' | 'critical';
  rul: RUL;
  failureProbability: number;
  failureRisk: 'critical' | 'high' | 'medium' | 'low';
  possibleFailureModes: PossibleFailureMode[];
  maintenanceWindow: MaintenanceWindow;
}

export async function analyzeMaintenance(input: MaintenanceInput): Promise<AnalysisResult> {
  console.log('analyzeMaintenance input:', JSON.stringify(input, null, 2));

  const equipmentTypeNames: Record<string, string> = {
    centrifugal_pump: '离心泵',
    induction_motor: '感应电机',
    compressor: '压缩机',
    gearbox: '齿轮箱',
    turbine: '涡轮机',
  };

  const systemPrompt = `你是一个工业设备预测性维护专家。你的任务是根据设备运行数据，分析设备健康状态，预测故障风险，并给出维护建议。

分析框架：
1. 健康评估：根据退化参数（轴承状态、温度、振动、密封、效率）和历史数据计算健康指数
2. RUL预测：基于健康退化趋势预测剩余使用寿命
3. 故障模式分析：识别可能的故障模式及其概率和严重程度
4. 维护窗口决策：计算计划更换vs紧急更换的成本差异，给出最佳维护时机建议

请返回JSON格式的分析结果。`;

  const userPrompt = `请分析以下设备数据：

设备ID：${input.equipmentId}
设备类型：${equipmentTypeNames[input.equipmentType] || input.equipmentType}
已运行小时数：${input.operatingHours}

当前退化参数：
- 轴承状态：${input.degradationData.bearingCondition}%
- 绕组温度：${input.degradationData.windingTemp}°C
- 振动值：${input.degradationData.vibration}mm/s
- 密封性：${input.degradationData.seal}%
- 效率：${input.degradationData.efficiency}%
- 设备年龄：${input.degradationData.equipmentAge}年

${input.anomalies.length > 0 ? `异常记录：
${input.anomalies.map(a => `- ${a.type} (${a.severity}): ${a.description}`).join('\n')}` : ''}

${input.historicalData.length > 0 ? `历史数据：
${input.historicalData.map(h => `- ${h.timestamp}: 健康指数=${h.healthIndex}, 轴承=${h.degradationData.bearingCondition}%, 振动=${h.degradationData.vibration}mm/s`).join('\n')}` : ''}

成本数据：
- 计划更换成本：¥${input.costData.plannedReplacementCost.toLocaleString()}
- 紧急更换成本：¥${input.costData.emergencyReplacementCost.toLocaleString()}
- 停机成本/天：¥${input.costData.downtimeCostPerDay.toLocaleString()}
- 维护成本/天：¥${input.costData.maintenanceCostPerDay.toLocaleString()}

请返回JSON格式的分析结果，结构如下：
{
  "healthIndex": 0-1之间的数值,
  "healthStatus": "good|fair|warning|poor|critical"之一,
  "rul": {
    "hours": 剩余小时数,
    "days": 剩余天数,
    "cycles": 剩余周期数,
    "isExpired": 布尔值
  },
  "failureProbability": 0-1之间的数值,
  "failureRisk": "critical|high|medium|low"之一,
  "possibleFailureModes": [
    {
      "mode": "故障模式名称",
      "confidence": 0-1之间的置信度,
      "severity": "critical|high|medium|low",
      "description": "故障模式描述"
    }
  ],
  "maintenanceWindow": {
    "plannedReplacementNow": 布尔值,
    "expectedFailureCost": 预计故障总成本数字,
    "potentialSavings": 潜在节省金额数字,
    "recommendedAction": "建议行动描述"
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
      healthIndex: 0.5,
      healthStatus: 'warning',
      rul: { hours: 0, days: 0, cycles: 0, isExpired: true },
      failureProbability: 0.5,
      failureRisk: 'medium',
      possibleFailureModes: [],
      maintenanceWindow: {
        plannedReplacementNow: false,
        expectedFailureCost: 0,
        potentialSavings: 0,
        recommendedAction: '数据解析失败，请重试',
      },
    } as AnalysisResult;
  }
}

export function mockAnalyze(input: MaintenanceInput): AnalysisResult {
  const bearingScore = input.degradationData.bearingCondition / 100;
  const efficiencyScore = input.degradationData.efficiency / 100;
  const sealScore = input.degradationData.seal / 100;
  const vibrationScore = Math.max(0, 1 - (input.degradationData.vibration / 10));

  const healthIndex = (bearingScore * 0.3 + efficiencyScore * 0.2 + sealScore * 0.2 + vibrationScore * 0.3);

  let healthStatus: AnalysisResult['healthStatus'];
  if (healthIndex >= 0.85) healthStatus = 'good';
  else if (healthIndex >= 0.7) healthStatus = 'fair';
  else if (healthIndex >= 0.5) healthStatus = 'warning';
  else if (healthIndex >= 0.3) healthStatus = 'poor';
  else healthStatus = 'critical';

  const baseRUL = Math.max(0, (1 - healthIndex) * 20000);
  const rul: RUL = {
    hours: Math.round(baseRUL),
    days: Math.round(baseRUL / 24),
    cycles: Math.round(baseRUL / 720),
    isExpired: healthIndex < 0.2,
  };

  const failureProbability = Math.min(1, Math.max(0, 1 - healthIndex + (input.operatingHours > 15000 ? 0.1 : 0)));

  let failureRisk: AnalysisResult['failureRisk'];
  if (failureProbability >= 0.8) failureRisk = 'critical';
  else if (failureProbability >= 0.6) failureRisk = 'high';
  else if (failureProbability >= 0.4) failureRisk = 'medium';
  else failureRisk = 'low';

  const possibleFailureModes: PossibleFailureMode[] = [];
  if (input.degradationData.bearingCondition < 70) {
    possibleFailureModes.push({
      mode: '轴承磨损',
      confidence: 0.85,
      severity: input.degradationData.bearingCondition < 50 ? 'critical' : 'high',
      description: '轴承磨损严重，需要密切关注振动数据和温度变化',
    });
  }
  if (input.degradationData.vibration > 4) {
    possibleFailureModes.push({
      mode: '异常振动',
      confidence: 0.9,
      severity: input.degradationData.vibration > 7 ? 'critical' : 'high',
      description: '振动值超过安全阈值，可能存在不平衡或轴承损坏',
    });
  }
  if (input.degradationData.seal < 70) {
    possibleFailureModes.push({
      mode: '密封泄漏',
      confidence: 0.75,
      severity: input.degradationData.seal < 50 ? 'high' : 'medium',
      description: '密封性能下降，存在泄漏风险',
    });
  }
  if (input.anomalies.length > 0) {
    const criticalAnomalies = input.anomalies.filter(a => a.severity === 'critical' || a.severity === 'high');
    if (criticalAnomalies.length > 0) {
      possibleFailureModes.push({
        mode: '多重异常',
        confidence: 0.95,
        severity: 'critical',
        description: `检测到${criticalAnomalies.length}个高严重程度异常，故障风险显著增加`,
      });
    }
  }

  const expectedFailureCost = input.costData.emergencyReplacementCost + input.costData.downtimeCostPerDay * 5;
  const plannedCost = input.costData.plannedReplacementCost + input.costData.maintenanceCostPerDay * 3;
  const potentialSavings = Math.max(0, expectedFailureCost - plannedCost);
  const plannedReplacementNow = healthIndex < 0.5 || failureProbability > 0.6;

  const maintenanceWindow: MaintenanceWindow = {
    plannedReplacementNow,
    expectedFailureCost,
    potentialSavings,
    recommendedAction: plannedReplacementNow
      ? `建议立即制定更换计划。当前健康指数${(healthIndex * 100).toFixed(0)}%，预计剩余寿命${rul.days}天。立即更换可节省约¥${potentialSavings.toLocaleString()}。`
      : `建议持续监控。当前健康指数${(healthIndex * 100).toFixed(0)}%，可在下次计划停机时安排维护。`,
  };

  return {
    healthIndex,
    healthStatus,
    rul,
    failureProbability,
    failureRisk,
    possibleFailureModes,
    maintenanceWindow,
  };
}
