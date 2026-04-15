import { Skill } from '@/lib/types';

export const carbonEmissionSkill: Skill = {
  id: 'carbon-emission-calculation',
  name: '碳排放计算',
  description: 'Scope 1/2/3碳排放分析',
  icon: '🌱',
  category: '环保',
  inputPrompt: `你是一个碳排放核算专家。请分析以下碳排放数据：

能源消耗数据：{energySources}
原材料数据：{rawMaterials}
物流数据：{logistics}
生产数据：{productionData}

请按照{reportingStandards}标准进行核算，输出详细的碳排放报告。`,
  outputFormat: `{
  totalEmissions: 数值(kg CO2e),
  scopeBreakdown: { scope1: '', scope2: '', scope3: '' },
  emissionBySource: [{ source: '', emissions: 0 }],
  recommendations: [建议1, 建议2, 建议3]
}`,
  templates: [
    {
      id: 'factory-monthly',
      name: '工厂月度碳核查',
      description: '对工厂月度能源消耗进行碳排放核算',
      inputData: {
        energySources: [
          { sourceType: 'electricity', consumption: 500000, unit: 'kWh', emissionFactor: 0.853, gridRegion: 'China-East' },
          { sourceType: 'natural_gas', consumption: 20000, unit: 'm³', emissionFactor: 0.202 },
        ],
        rawMaterials: [],
        logistics: [],
        productionData: { outputQuantity: 10000, outputUnit: '吨' },
        reportingStandards: ['GHG_Protocol', 'ISO_14064'],
      },
      context: {
        useCase: '工厂月度碳核查',
        expectedOutput: '碳排放报告、减排建议',
      },
    },
    {
      id: 'product-carbon-footprint',
      name: '产品碳足迹',
      description: '分析产品全生命周期碳排放',
      inputData: {
        energySources: [{ sourceType: 'electricity', consumption: 10000, unit: 'kWh', emissionFactor: 0.853 }],
        rawMaterials: [
          { materialType: '钢材', quantity: 500, unit: 'kg', origin: '河北', emissionFactor: 2.5 },
          { materialType: '塑料', quantity: 200, unit: 'kg', origin: '江苏', emissionFactor: 3.2 },
        ],
        logistics: [{ mode: 'road', distancekm: 500, weightkg: 750, emissionFactor: 0.107 }],
        productionData: { outputQuantity: 1000, outputUnit: '件' },
        reportingStandards: ['GHG_Protocol', 'IPCC'],
      },
      context: {
        useCase: '产品碳足迹分析',
        expectedOutput: '产品碳足迹报告、全生命周期分析',
      },
    },
  ],
  apiFields: [
    { key: 'energySources', label: '能源消耗', type: 'textarea', placeholder: '描述能源消耗情况...' },
    { key: 'rawMaterials', label: '原材料', type: 'textarea', placeholder: '描述原材料使用...' },
    { key: 'logistics', label: '物流运输', type: 'textarea', placeholder: '描述物流情况...' },
    { key: 'reportingStandards', label: '报告标准', type: 'select', options: [
      { value: 'GHG_Protocol', label: 'GHG Protocol' },
      { value: 'ISO_14064', label: 'ISO 14064' },
      { value: 'IPCC', label: 'IPCC' },
    ]},
  ],
};

export const energyOptimizerSkill: Skill = {
  id: 'energy-optimizer',
  name: '能源优化',
  description: '综合能源优化分析',
  icon: '⚡',
  category: '能效',
  inputPrompt: `你是一个工业能源优化专家。请分析以下能源数据：

设施ID：{facilityId}
分析类型：{analysisType}
能源消耗：{consumptionData}
设备参数：{equipmentData}

请进行全面分析并提供优化建议。`,
  outputFormat: `{
  totalConsumption: 数值,
  costAnalysis: { current: 0, potential: 0 },
  recommendations: [建议1, 建议2, 建议3]
}`,
  templates: [
    {
      id: 'comprehensive',
      name: '综合能源分析',
      description: '对工厂整体能源进行综合分析',
      inputData: {
        facilityId: 'FACILITY_001',
        analysisType: 'comprehensive',
        consumptionData: {
          electricity: { consumption: 500000, cost: 350000 },
          gas: { consumption: 100000, cost: 80000 },
        },
        utilityData: { peakRate: 1.2, offPeakRate: 0.6, demandCharge: 50, gridPrice: 0.8 },
      },
      context: {
        useCase: '综合能源分析',
        expectedOutput: '能效报告、优化建议',
      },
    },
    {
      id: 'motor-efficiency',
      name: '电机能效评估',
      description: '评估电机能效等级',
      inputData: {
        facilityId: 'FACILITY_001',
        analysisType: 'motor',
        equipmentData: { motor: { power: 150, current: 280, voltage: 380, powerFactor: 0.85, efficiency: 0.92 } },
      },
      context: {
        useCase: '电机能效评估',
        expectedOutput: '能效等级、节能空间',
      },
    },
  ],
  apiFields: [
    { key: 'facilityId', label: '设施ID', type: 'text', placeholder: '输入设施标识' },
    { key: 'analysisType', label: '分析类型', type: 'select', options: [
      { value: 'comprehensive', label: '综合分析' },
      { value: 'consumption', label: '能源消耗' },
      { value: 'motor', label: '电机能效' },
      { value: 'peak-shaving', label: '峰谷调节' },
    ]},
    { key: 'consumptionData', label: '能源消耗数据', type: 'textarea', placeholder: '描述能源消耗情况...' },
  ],
};

export const equipmentHealthSkill: Skill = {
  id: 'equipment-health-monitor',
  name: '设备健康监控',
  description: '设备状态监测与异常告警',
  icon: '🔧',
  category: '运维',
  inputPrompt: `你是一个设备维护专家。请分析以下设备数据：

设备名称：{equipmentName}
监控参数：{monitoringParams}
运行数据：{operationData}
告警阈值：{alertThresholds}

请评估设备健康状况并提供维护建议。`,
  outputFormat: `{
  healthScore: 0-100,
  status: '正常' | '注意' | '异常',
  issues: [{ type: '', severity: '', recommendation: '' }],
  maintenanceSchedule: { daily: [], weekly: [], monthly: [] }
}`,
  templates: [
    {
      id: 'cnc-monitor',
      name: 'CNC机床监控',
      description: '监控CNC机床运行状态',
      inputData: {
        equipmentName: 'CNC加工中心',
        monitoringParams: '温度、振动、主轴转速',
        operationData: '主轴温度65°C、振动3.2mm/s、负载85%',
        alertThresholds: '温度>80°C、振动>5mm/s',
      },
      context: {
        useCase: 'CNC设备监控',
        expectedOutput: '健康评分、异常告警、维护建议',
      },
    },
  ],
  apiFields: [
    { key: 'equipmentName', label: '设备名称', type: 'text', placeholder: '输入设备名称' },
    { key: 'monitoringParams', label: '监控参数', type: 'text', placeholder: '如：温度、压力、振动' },
    { key: 'operationData', label: '运行数据', type: 'textarea', placeholder: '描述设备运行数据...' },
    { key: 'alertThresholds', label: '告警阈值', type: 'text', placeholder: '如：温度>80°C' },
  ],
};

export const logisticsOptimizerSkill: Skill = {
  id: 'logistics-optimizer',
  name: '物流优化',
  description: '物流路径与成本优化',
  icon: '🚚',
  category: '供应链',
  inputPrompt: `你是一个物流优化专家。请分析以下物流数据：

起点：{origin}
目的地：{destination}
货物信息：{cargoInfo}
当前路线：{currentRoute}

请提供最优物流方案。`,
  outputFormat: `{
  optimalRoute: '',
  estimatedCost: 0,
  estimatedTime: '',
  recommendations: [建议1, 建议2]
}`,
  templates: [
    {
      id: 'route-optimization',
      name: '路线优化',
      description: '优化配送路线',
      inputData: {
        origin: '上海仓库',
        destination: '北京分拣中心',
        cargoInfo: '500件重货，单件50kg',
        currentRoute: '公路直达',
      },
      context: {
        useCase: '物流路线优化',
        expectedOutput: '最优路线、成本估算',
      },
    },
  ],
  apiFields: [
    { key: 'origin', label: '起点', type: 'text', placeholder: '输入发货地' },
    { key: 'destination', label: '目的地', type: 'text', placeholder: '输入收货地' },
    { key: 'cargoInfo', label: '货物信息', type: 'textarea', placeholder: '描述货物信息...' },
    { key: 'currentRoute', label: '当前路线', type: 'text', placeholder: '描述当前运输路线' },
  ],
};

export const lubricationAdvisorySkill: Skill = {
  id: 'lubrication-advisory',
  name: '润滑咨询',
  description: '设备润滑方案建议',
  icon: '🛢️',
  category: '维护',
  inputPrompt: `你是一个设备润滑专家。请根据以下信息提供润滑方案：

设备类型：{equipmentType}
运行工况：{operatingConditions}
当前润滑状态：{currentStatus}

请推荐合适的润滑油和润滑周期。`,
  outputFormat: `{
  recommendedOil: '',
  viscosityGrade: '',
  changeInterval: '',
  lubricationMethod: '',
  precautions: [注意事项1, 注意事项2]
}`,
  templates: [
    {
      id: 'bearing-lubrication',
      name: '轴承润滑',
      description: '轴承润滑方案',
      inputData: {
        equipmentType: '滚动轴承',
        operatingConditions: '转速3000rpm，温度65°C，载荷正常',
        currentStatus: '使用中，无异常',
      },
      context: {
        useCase: '轴承润滑咨询',
        expectedOutput: '润滑方案、换油周期',
      },
    },
  ],
  apiFields: [
    { key: 'equipmentType', label: '设备类型', type: 'text', placeholder: '如：轴承、液压系统' },
    { key: 'operatingConditions', label: '运行工况', type: 'textarea', placeholder: '描述转速、温度、载荷等...' },
    { key: 'currentStatus', label: '当前状态', type: 'text', placeholder: '描述当前润滑状态' },
  ],
};

export const materialManagerSkill: Skill = {
  id: 'material-manager',
  name: '物料管理',
  description: '物料需求与库存管理',
  icon: '📦',
  category: '生产',
  inputPrompt: `你是一个物料管理专家。请分析以下数据：

当前库存：{currentStock}
生产计划：{productionPlan}
供应商信息：{supplierInfo}
消耗预测：{consumptionForecast}

请提供物料采购和库存优化建议。`,
  outputFormat: `{
  reorderPoints: [{ material: '', reorderQty: 0, priority: '' }],
  inventoryTurnover: 0,
  recommendations: [建议1, 建议2]
}`,
  templates: [
    {
      id: 'inventory-optimization',
      name: '库存优化',
      description: '优化物料库存',
      inputData: {
        currentStock: '钢材500kg，塑料200kg',
        productionPlan: '本月计划生产1000件',
        supplierInfo: '主力供应商3家',
        consumptionForecast: '日均消耗钢材50kg',
      },
      context: {
        useCase: '物料库存管理',
        expectedOutput: '采购建议、库存优化',
      },
    },
  ],
  apiFields: [
    { key: 'currentStock', label: '当前库存', type: 'textarea', placeholder: '描述当前库存情况...' },
    { key: 'productionPlan', label: '生产计划', type: 'textarea', placeholder: '描述生产计划...' },
    { key: 'supplierInfo', label: '供应商信息', type: 'textarea', placeholder: '描述供应商情况...' },
  ],
};

export const predictiveMaintenanceSkill: Skill = {
  id: 'predictive-maintenance',
  name: '预测性维护',
  description: '设备寿命与故障预测',
  icon: '🔮',
  category: '运维',
  inputPrompt: `你是一个预测性维护专家。请分析以下数据：

设备历史：{equipmentHistory}
运行参数：{operationParams}
故障记录：{failureHistory}
传感器数据：{sensorData}

请预测设备故障风险并提供维护计划。`,
  outputFormat: `{
  failureProbability: 0-100%,
  predictedFailureDate: '',
  maintenanceWindow: '',
  recommendedActions: [建议1, 建议2]
}`,
  templates: [
    {
      id: 'motor-prediction',
      name: '电机故障预测',
      description: '预测电机故障',
      inputData: {
        equipmentHistory: '已运行3年，无重大故障',
        operationParams: '负载85%，温度稳定',
        failureHistory: '曾有轻微振动异常',
        sensorData: '振动值正常范围内',
      },
      context: {
        useCase: '设备故障预测',
        expectedOutput: '故障概率、维护计划',
      },
    },
  ],
  apiFields: [
    { key: 'equipmentHistory', label: '设备历史', type: 'textarea', placeholder: '描述设备使用历史...' },
    { key: 'operationParams', label: '运行参数', type: 'textarea', placeholder: '描述当前运行参数...' },
    { key: 'failureHistory', label: '故障记录', type: 'textarea', placeholder: '描述历史故障...' },
    { key: 'sensorData', label: '传感器数据', type: 'textarea', placeholder: '描述传感器读数...' },
  ],
};

export const productionPlannerSkill: Skill = {
  id: 'production-planner',
  name: '生产规划',
  description: '生产计划制定',
  icon: '📋',
  category: '生产',
  inputPrompt: `你是一个生产规划专家。请分析以下需求：

订单需求：{orderRequirements}
产能情况：{productionCapacity}
物料供应：{materialSupply}
人员配置：{staffing}

请制定最优生产计划。`,
  outputFormat: `{
  productionSchedule: [{ period: '', output: 0, utilization: 0 }],
  bottlenecks: [瓶颈1, 瓶颈2],
  recommendations: [建议1, 建议2]
}`,
  templates: [
    {
      id: 'weekly-planning',
      name: '周生产计划',
      description: '制定周生产计划',
      inputData: {
        orderRequirements: 'A产品500件，B产品300件',
        productionCapacity: '日产能1000件',
        materialSupply: '物料充足',
        staffing: '白班10人，夜班8人',
      },
      context: {
        useCase: '生产计划制定',
        expectedOutput: '生产排程、资源配置',
      },
    },
  ],
  apiFields: [
    { key: 'orderRequirements', label: '订单需求', type: 'textarea', placeholder: '描述订单需求...' },
    { key: 'productionCapacity', label: '产能情况', type: 'textarea', placeholder: '描述产能情况...' },
    { key: 'materialSupply', label: '物料供应', type: 'textarea', placeholder: '描述物料供应情况...' },
    { key: 'staffing', label: '人员配置', type: 'text', placeholder: '描述人员配置' },
  ],
};

export const productionSchedulerSkill: Skill = {
  id: 'production-scheduler',
  name: '生产调度',
  description: '生产排程优化',
  icon: '📅',
  category: '生产',
  inputPrompt: `你是一个生产调度专家。请优化以下排程：

订单队列：{orderQueue}
设备状态：{machineStatus}
工序工艺：{processRouting}
交货期限：{deliveryDeadlines}

请提供最优排程方案。`,
  outputFormat: `{
  optimalSchedule: [{ order: '', startTime: '', endTime: '', machine: '' }],
  makespan: 0,
  utilization: 0,
  recommendations: [建议1, 建议2]
}`,
  templates: [
    {
      id: 'job-shop-scheduling',
      name: '车间排程',
      description: '优化车间生产排程',
      inputData: {
        orderQueue: '工单101、102、103',
        machineStatus: 'M1、M2可用，M3维修中',
        processRouting: '标准工艺路线',
        deliveryDeadlines: '工单101优先',
      },
      context: {
        useCase: '生产排程优化',
        expectedOutput: '排程方案、利用率',
      },
    },
  ],
  apiFields: [
    { key: 'orderQueue', label: '订单队列', type: 'textarea', placeholder: '描述待排产订单...' },
    { key: 'machineStatus', label: '设备状态', type: 'textarea', placeholder: '描述设备可用情况...' },
    { key: 'processRouting', label: '工序工艺', type: 'textarea', placeholder: '描述工艺路线...' },
    { key: 'deliveryDeadlines', label: '交货期限', type: 'text', placeholder: '描述交货要求' },
  ],
};

export const qualityInspectorSkill: Skill = {
  id: 'quality-inspector',
  name: '质量检测',
  description: '视觉与尺寸检测',
  icon: '🔍',
  category: '质量',
  inputPrompt: `你是一个质量检测专家。请分析以下检测数据：

检测类型：{inspectionType}
检测数据：{inspectionData}
质量标准：{qualityStandards}
历史缺陷：{defectHistory}

请评估质量状况并提供改进建议。`,
  outputFormat: `{
  passRate: 0-100%,
  defectAnalysis: [{ type: '', count: 0, rootCause: '' }],
  recommendations: [建议1, 建议2]
}`,
  templates: [
    {
      id: 'visual-inspection',
      name: '视觉检测',
      description: '产品外观视觉检测',
      inputData: {
        inspectionType: '外观检测',
        inspectionData: '检测数量1000件，发现缺陷20件',
        qualityStandards: '外观无划痕、无色差',
        defectHistory: '上周缺陷率2%',
      },
      context: {
        useCase: '产品质量检测',
        expectedOutput: '合格率、缺陷分析',
      },
    },
  ],
  apiFields: [
    { key: 'inspectionType', label: '检测类型', type: 'select', options: [
      { value: 'visual', label: '视觉检测' },
      { value: 'dimension', label: '尺寸检测' },
      { value: 'function', label: '功能检测' },
    ]},
    { key: 'inspectionData', label: '检测数据', type: 'textarea', placeholder: '描述检测数据和结果...' },
    { key: 'qualityStandards', label: '质量标准', type: 'textarea', placeholder: '描述质量标准...' },
  ],
};

export const supplyChainManagerSkill: Skill = {
  id: 'supply-chain-manager',
  name: '供应链管理',
  description: '供应链协调',
  icon: '🔗',
  category: '供应链',
  inputPrompt: `你是一个供应链管理专家。请分析以下情况：

供应链现状：{currentStatus}
风险因素：{riskFactors}
合作伙伴：{partners}
成本结构：{costStructure}

请提供供应链优化建议。`,
  outputFormat: `{
  riskLevel: '低' | '中' | '高',
  keyIssues: [问题1, 问题2],
  recommendations: [建议1, 建议2]
}`,
  templates: [
    {
      id: 'supply-risk-assessment',
      name: '供应链风险评估',
      description: '评估供应链风险',
      inputData: {
        currentStatus: '供应商稳定，物流正常',
        riskFactors: '单一供应商依赖',
        partners: '主力供应商3家',
        costStructure: '物流成本占比15%',
      },
      context: {
        useCase: '供应链协调管理',
        expectedOutput: '风险评估、优化建议',
      },
    },
  ],
  apiFields: [
    { key: 'currentStatus', label: '供应链现状', type: 'textarea', placeholder: '描述当前供应链状态...' },
    { key: 'riskFactors', label: '风险因素', type: 'textarea', placeholder: '描述潜在风险...' },
    { key: 'partners', label: '合作伙伴', type: 'textarea', placeholder: '描述合作伙伴情况...' },
    { key: 'costStructure', label: '成本结构', type: 'text', placeholder: '描述成本结构' },
  ],
};

export const supplyChainPlannerSkill: Skill = {
  id: 'supply-chain-planner',
  name: '供应链规划',
  description: '供应策略规划',
  icon: '📊',
  category: '供应链',
  inputPrompt: `你是一个供应链规划专家。请根据以下信息制定策略：

市场需求：{marketDemand}
供应能力：{supplyCapacity}
竞争分析：{competitionAnalysis}
成本目标：{costTargets}

请制定供应策略规划。`,
  outputFormat: `{
  strategy: '',
  supplyPlan: [{ period: '', source: '', quantity: 0 }],
  costForecast: 0,
  recommendations: [建议1, 建议2]
}`,
  templates: [
    {
      id: 'strategic-planning',
      name: '战略规划',
      description: '制定供应链战略',
      inputData: {
        marketDemand: '季度需求增长20%',
        supplyCapacity: '当前产能可满足80%',
        competitionAnalysis: '竞争对手扩张中',
        costTarget: '成本降低10%',
      },
      context: {
        useCase: '供应链策略规划',
        expectedOutput: '供应策略、成本预测',
      },
    },
  ],
  apiFields: [
    { key: 'marketDemand', label: '市场需求', type: 'textarea', placeholder: '描述市场需求情况...' },
    { key: 'supplyCapacity', label: '供应能力', type: 'textarea', placeholder: '描述供应能力...' },
    { key: 'competitionAnalysis', label: '竞争分析', type: 'textarea', placeholder: '描述竞争情况...' },
    { key: 'costTargets', label: '成本目标', type: 'text', placeholder: '描述成本目标' },
  ],
};

export const wearDetectorSkill: Skill = {
  id: 'wear-detector',
  name: '磨损检测',
  description: '设备磨损分析',
  icon: '⚙️',
  category: '维护',
  inputPrompt: `你是一个磨损分析专家。请分析以下磨损数据：

设备信息：{equipmentInfo}
磨损测量：{wearMeasurements}
工况条件：{operatingConditions}
历史更换：{replacementHistory}

请评估磨损程度并提供更换建议。`,
  outputFormat: `{
  wearLevel: '轻微' | '中等' | '严重',
  remainingLife: '预计剩余寿命',
  replacementUrgency: '低' | '中' | '高',
  recommendations: [建议1, 建议2]
}`,
  templates: [
    {
      id: 'bearing-wear',
      name: '轴承磨损检测',
      description: '分析轴承磨损状况',
      inputData: {
        equipmentInfo: '主轴轴承，已运行20000小时',
        wearMeasurements: '振动值增加15%，温度升高5°C',
        operatingConditions: '负载85%，转速3000rpm',
        replacementHistory: '上次更换于18个月前',
      },
      context: {
        useCase: '设备磨损分析',
        expectedOutput: '磨损评估、更换建议',
      },
    },
  ],
  apiFields: [
    { key: 'equipmentInfo', label: '设备信息', type: 'text', placeholder: '描述设备信息' },
    { key: 'wearMeasurements', label: '磨损测量', type: 'textarea', placeholder: '描述磨损测量数据...' },
    { key: 'operatingConditions', label: '工况条件', type: 'textarea', placeholder: '描述运行工况...' },
    { key: 'replacementHistory', label: '历史更换', type: 'text', placeholder: '描述更换历史' },
  ],
};

export const allSkills: Skill[] = [
  carbonEmissionSkill,
  energyOptimizerSkill,
  equipmentHealthSkill,
  logisticsOptimizerSkill,
  lubricationAdvisorySkill,
  materialManagerSkill,
  predictiveMaintenanceSkill,
  productionPlannerSkill,
  productionSchedulerSkill,
  qualityInspectorSkill,
  supplyChainManagerSkill,
  supplyChainPlannerSkill,
  wearDetectorSkill,
];

export const skillCategories = [...new Set(allSkills.map(s => s.category))];
