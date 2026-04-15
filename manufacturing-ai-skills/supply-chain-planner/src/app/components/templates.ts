export interface Template {
  id: string;
  name: string;
  category: string;
  jobDescription: string;
  context: {
    inputData: string;
    outputResult: string;
    collaborator: string;
    frequency: string;
    timeRatio?: string;
  };
}

export const templates: Template[] = [
  // 采购策略规划
  {
    id: 'procurement-strategy',
    name: '采购策略规划',
    category: '采购策略',
    jobDescription: '根据年度销售预测和库存策略，制定主要原材料的采购策略。分析过去3年采购数据，评估供应商绩效，结合市场价格波动趋势，制定安全库存水平和采购批次策略。协调采购部、生产部、财务部优化采购成本。',
    context: {
      inputData: '年度销售预测、历史采购数据、供应商绩效报告、市场价格走势',
      outputResult: '年度采购策略报告、安全库存设置、采购批次计划、供应商优化建议',
      collaborator: '采购部、生产部、财务部、供应商',
      frequency: '每季度',
      timeRatio: '40%',
    },
  },
  // 需求预测分析
  {
    id: 'demand-forecast',
    name: '需求预测分析',
    category: '需求预测',
    jobDescription: '基于历史销售数据、市场趋势、季节性因素和促销活动计划，进行产品需求预测。分析各渠道销售数据，识别需求波动规律，为生产计划提供准确的需求预测。支持周度、月度滚动预测更新。',
    context: {
      inputData: '历史销售数据、市场活动计划、渠道库存数据、季节性因素',
      outputResult: '产品需求预测报告、渠道需求分解、安全库存建议、生产计划建议',
      collaborator: '销售部、市场部、生产计划部',
      frequency: '每月',
      timeRatio: '35%',
    },
  },
  // 供应商网络规划
  {
    id: 'supplier-network',
    name: '供应商网络规划',
    category: '供应商管理',
    jobDescription: '评估和优化供应商网络布局，分析供应商地理位置、产能弹性、交付可靠性。识别供应链风险点，制定供应商开发和淘汰计划。管理关键物料的供应商关系，确保供应链韧性和成本竞争力。',
    context: {
      inputData: '供应商基础信息、产能数据、交付绩效、质量数据、地理位置',
      outputResult: '供应商网络优化方案、风险评估报告、供应商开发计划、备选供应商清单',
      collaborator: '采购部、质量部、物流部、供应商',
      frequency: '每半年',
      timeRatio: '30%',
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];
