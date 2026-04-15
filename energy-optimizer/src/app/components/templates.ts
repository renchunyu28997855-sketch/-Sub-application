export interface EnergyTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  inputData: {
    facilityId?: string;
    analysisType: string;
    consumptionData?: {
      electricity?: { consumption: number; cost: number };
      gas?: { consumption: number; cost: number };
    };
    equipmentData?: {
      motor?: { power: number; current: number; voltage: number; powerFactor: number; efficiency: number };
      hvac?: Record<string, unknown>;
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
  };
  context: {
    useCase: string;
    expectedOutput: string;
  };
}

export const templates: EnergyTemplate[] = [
  {
    id: 'comprehensive',
    name: '综合能源分析',
    category: '综合分析',
    description: '输入工厂整体能源数据，进行全面综合能源分析',
    inputData: {
      facilityId: 'FACILITY_001',
      analysisType: 'comprehensive',
      consumptionData: {
        electricity: { consumption: 500000, cost: 350000 },
        gas: { consumption: 100000, cost: 80000 },
      },
      utilityData: {
        peakRate: 1.2,
        offPeakRate: 0.6,
        demandCharge: 50,
        gridPrice: 0.8,
      },
    },
    context: {
      useCase: '对整个工厂进行综合能源分析，评估整体能效水平',
      expectedOutput: '综合能效报告、节能潜力分析、优化建议',
    },
  },
  {
    id: 'motor-efficiency',
    name: '电机能效评估',
    category: '设备分析',
    description: '输入电机参数数据，评估电机能效等级和节能空间',
    inputData: {
      facilityId: 'FACILITY_001',
      analysisType: 'motor',
      equipmentData: {
        motor: { power: 150, current: 280, voltage: 380, powerFactor: 0.85, efficiency: 0.92 },
      },
      utilityData: {
        peakRate: 1.2,
        offPeakRate: 0.6,
        demandCharge: 50,
        gridPrice: 0.8,
      },
    },
    context: {
      useCase: '评估单台或整个车间电机的能效水平和节能潜力',
      expectedOutput: '电机能效等级评估、节能空间分析、替换建议',
    },
  },
  {
    id: 'peak-shaving',
    name: '峰谷调节分析',
    category: '电网优化',
    description: '输入负荷曲线数据，分析峰谷调节潜力',
    inputData: {
      facilityId: 'FACILITY_001',
      analysisType: 'peak-shaving',
      consumptionData: {
        electricity: { consumption: 200000, cost: 160000 },
      },
      utilityData: {
        peakRate: 1.5,
        offPeakRate: 0.5,
        demandCharge: 80,
        gridPrice: 0.7,
      },
    },
    context: {
      useCase: '分析负荷曲线特征，制定峰谷调节策略降低电费',
      expectedOutput: '峰谷调节方案、储能配置建议、预期节省金额',
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];

export const analysisTypes = [
  { value: 'comprehensive', label: '综合能源分析' },
  { value: 'consumption', label: '能源消耗分析' },
  { value: 'motor', label: '电机能效评估' },
  { value: 'hvac', label: '暖通空调分析' },
  { value: 'lighting', label: '照明系统分析' },
  { value: 'compressor', label: '压缩机分析' },
  { value: 'peak-shaving', label: '峰谷调节分析' },
  { value: 'renewable', label: '可再生能源分析' },
  { value: 'carbon', label: '碳排放分析' },
];
