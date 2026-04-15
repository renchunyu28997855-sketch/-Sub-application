import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.chat/v1',
});

export async function chatCompletion(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  console.log('chatCompletion called with messages:', JSON.stringify(messages, null, 2));
  const response = await client.chat.completions.create({
    model: 'MiniMax-M2.7',
    messages,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content || '';
}

export async function analyzeManufacturingSkill(skillId: string, input: Record<string, unknown>): Promise<Record<string, unknown>> {
  const systemPrompt = `你是一个专业的制造业AI助手。你的任务是分析用户输入的制造相关数据，提供专业的分析建议和方案。

分析维度包括：
1. 碳排放计算与审计
2. 能源优化与管理
3. 设备健康监控
4. 物流运输优化
5. 设备润滑咨询
6. 物料管理与库存优化
7. 预测性维护
8. 生产计划制定
9. 生产调度优化
10. 质量检测分析
11. 供应链管理
12. 供应链规划
13. 磨损检测分析

请根据输入数据，进行全面分析并返回JSON格式的建议。`;

  const userPrompt = `技能类型：${skillId}
输入数据：${JSON.stringify(input, null, 2)}

请分析上述数据，返回JSON格式的分析结果和建议。`;

  const result = await chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    // Try to parse the result as JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { analysis: result };
  } catch {
    return { analysis: result };
  }
}

export function mockAnalyze(skillId: string, input: Record<string, unknown>): Record<string, unknown> {
  console.log('mockAnalyze called for skill:', skillId, 'with input:', JSON.stringify(input, null, 2));

  const mockResponses: Record<string, Record<string, unknown>> = {
    'carbon-emission-calculation': {
      totalEmissions: 125000,
      unit: 'kg CO2e',
      scopeBreakdown: { scope1: 35000, scope2: 60000, scope3: 30000 },
      emissionBySource: [
        { source: '电力', emissions: 45000 },
        { source: '天然气', emissions: 25000 },
        { source: '物流运输', emissions: 30000 },
        { source: '原材料', emissions: 25000 },
      ],
      recommendations: [
        '建议增加光伏发电装机容量，预计可减少碳排放15%',
        '优化物流路线，采用铁海联运可降低运输碳排放20%',
        '余热回收利用可减少天然气消耗10%',
      ],
      comparison: { lastMonth: 130000, trend: '下降3.8%' },
    },
    'energy-optimizer': {
      totalConsumption: 580000,
      unit: 'kWh',
      costAnalysis: { current: 420000, potential: 357000, saving: 63000 },
      breakdown: { electricity: 350000, gas: 100000, other: 130000 },
      recommendations: [
        '建议安装智能能源管理系统，实时监控各车间能耗',
        '对老旧电机进行变频改造，预计节能10-15%',
        '利用峰谷电价差，优化生产排程可节省电费8%',
        '增加光伏发电装机容量，自发自用',
      ],
      peakShavingPotential: { current: 1.8, target: 1.3 },
    },
    'equipment-health-monitor': {
      healthScore: 85,
      status: '良好',
      overallStatus: '正常',
      issues: [],
      maintenanceSchedule: {
        daily: ['检查温度', '检查振动'],
        weekly: ['润滑检查', '紧固件检查'],
        monthly: ['全面检查', '参数校准'],
      },
      nextMaintenance: '2026-04-20',
      equipmentDetails: {
        temperature: '62°C (正常)',
        vibration: '3.2mm/s (正常)',
        pressure: '8.5bar (正常)',
        power: '85% (正常)',
      },
    },
    'logistics-optimizer': {
      currentRoute: '上海 → 北京直达',
      currentCost: 15000,
      optimalRoute: '上海 → 济南中转 → 北京',
      optimalCost: 12500,
      saving: 2500,
      estimatedTime: '18小时',
      recommendations: [
        '建议采用济南中转方案，可节省运输成本16%',
        '考虑铁路运输作为替代方案，成本可再降10%',
        '集中发货可提高装载率至90%',
      ],
    },
    'lubrication-advisory': {
      recommendedOil: 'ISO VG 68 抗磨液压油',
      viscosityGrade: 'ISO 68',
      changeInterval: '2000小时或6个月',
      lubricationMethod: '循环润滑',
      dailyChecks: ['油位检查', '温度检查'],
      precautions: [
        '定期检查油品质量，及时更换变质油品',
        '保持润滑系统清洁，避免污染物进入',
        '注意油温变化，过高温度表明可能存在故障',
      ],
    },
    'material-manager': {
      currentStock: { steel: 500, plastic: 200, electronics: 150 },
      reorderRecommendations: [
        { material: '钢材', currentStock: 500, safetyStock: 300, reorderQty: 1000, urgency: '高' },
        { material: '塑料', currentStock: 200, safetyStock: 150, reorderQty: 500, urgency: '中' },
      ],
      inventoryTurnover: 8.5,
      daysOfSupply: { steel: 15, plastic: 20, electronics: 25 },
      recommendations: [
        '钢材库存偏低，建议本周内补货',
        '考虑与供应商签订长期协议，获得更好价格',
        '建立VMI系统，由供应商管理库存',
      ],
    },
    'predictive-maintenance': {
      failureProbability: '12%',
      predictedFailureDate: '约45天后',
      maintenanceWindow: '未来2周内',
      riskLevel: '中等',
      recommendedActions: [
        '建议在下周例行维护时检查轴承状态',
        '准备备用电机，以备紧急更换',
        '增加振动监测频率至每2小时一次',
      ],
      estimatedDowntime: '4-8小时',
      costEstimate: 15000,
    },
    'production-planner': {
      weeklySchedule: [
        { day: '周一', products: ['A产品', 'B产品'], utilization: 92 },
        { day: '周二', products: ['A产品', 'C产品'], utilization: 88 },
        { day: '周三', products: ['B产品'], utilization: 75 },
        { day: '周四', products: ['A产品', 'B产品'], utilization: 95 },
        { day: '周五', products: ['C产品'], utilization: 70 },
      ],
      bottlenecks: ['热处理工序产能不足', '关键设备利用率已达95%'],
      recommendations: [
        '考虑增加热处理设备或外包部分订单',
        '优化生产排程，减少换模时间',
        '建立紧急订单快速响应机制',
      ],
      estimatedOutput: { thisWeek: 4500, lastWeek: 4200 },
    },
    'production-scheduler': {
      optimalSchedule: [
        { order: 'WO-2026-001', product: 'A产品', startTime: '08:00', endTime: '14:00', machine: 'M1' },
        { order: 'WO-2026-002', product: 'B产品', startTime: '14:00', endTime: '20:00', machine: 'M1' },
        { order: 'WO-2026-003', product: 'C产品', startTime: '08:00', endTime: '16:00', machine: 'M2' },
      ],
      makespan: '32小时',
      overallUtilization: 87,
      recommendations: [
        'M3设备维修期间，优先处理紧急订单',
        '建议将部分订单调整至夜班，提高设备利用率',
        '优化换模流程，预计可减少换模时间20%',
      ],
    },
    'quality-inspector': {
      passRate: 97.5,
      totalInspected: 1000,
      passed: 975,
      failed: 25,
      defectAnalysis: [
        { type: '外观缺陷', count: 12, percentage: 48, rootCause: '原材料表面问题' },
        { type: '尺寸偏差', count: 8, percentage: 32, rootCause: '设备精度下降' },
        { type: '功能异常', count: 5, percentage: 20, rootCause: '组装工艺问题' },
      ],
      recommendations: [
        '加强原材料入库检验，特别是表面质量',
        '建议对M2设备进行精度校准',
        '增加组装工序的抽检频次',
      ],
    },
    'supply-chain-manager': {
      riskLevel: '中等',
      overallHealth: '良好',
      keyIssues: [
        '单一供应商依赖度过高',
        '部分原材料库存周转天数偏长',
      ],
      supplierPerformance: [
        { name: '供应商A', onTimeRate: 98, qualityRate: 99.5 },
        { name: '供应商B', onTimeRate: 92, qualityRate: 97.8 },
      ],
      recommendations: [
        '开发备选供应商，降低单一供应商依赖',
        '优化库存结构，减少资金占用',
        '建立供应商绩效激励机制',
      ],
    },
    'supply-chain-planner': {
      strategy: '稳健扩展策略',
      demandForecast: { Q2: 12000, Q3: 14000, Q4: 16000 },
      supplyPlan: [
        { period: 'Q2', source: '国内供应商A', quantity: 8000 },
        { period: 'Q2', source: '国内供应商B', quantity: 4000 },
        { period: 'Q3', source: '国内供应商A', quantity: 10000 },
        { period: 'Q3', source: '海外供应商', quantity: 4000 },
      ],
      costForecast: { material: 2800000, logistics: 450000, total: 3250000 },
      recommendations: [
        'Q3开始引入海外供应商，分散供应风险',
        '与核心供应商签订长期协议，锁定价格',
        '建立安全库存，应对需求波动',
      ],
    },
    'wear-detector': {
      wearLevel: '中等',
      remainingLife: '约60天或运行1800小时',
      replacementUrgency: '中',
      currentWear: { bearing: 65, seal: 40, shaft: 20 },
      measurements: { temperature: '正常', vibration: '略有增加', noise: '轻微异常' },
      recommendations: [
        '建议在下次计划停机时更换轴承',
        '加强日常监测，必要时提前更换',
        '检查润滑系统，确保润滑充分',
      ],
      estimatedCost: { parts: 8000, downtime: 4 },
    },
  };

  return mockResponses[skillId] || {
    message: `这是${skillId}的模拟分析结果`,
    input: input,
    recommendations: ['建议仅供参考', '如有疑问请咨询专业人士'],
  };
}
