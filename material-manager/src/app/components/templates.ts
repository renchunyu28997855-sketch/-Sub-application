export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  inputData: string;
  context: {
    production?: string;
    inventory?: string;
    demand?: string;
    leadTime?: string;
    supplier?: string;
  };
}

export const templates: Template[] = [
  {
    id: 'production-material',
    name: '生产物料需求计算',
    category: '物料需求',
    description: '根据生产计划计算所需物料数量',
    inputData: '产品BOM表、生产计划数量、当前库存',
    context: {
      production: 'A产品1000件，B产品500件',
      inventory: '原材料X库存2000个，Y库存1500个',
    },
  },
  {
    id: 'inventory-optimization',
    name: '库存优化分析',
    category: '库存管理',
    description: '分析库存状况并提供优化建议',
    inputData: '当前库存数据、历史消耗数据、安全库存设置',
    context: {
      inventory: '原材料X当前库存5000个，Y库存3000个',
      leadTime: 'X供应商交期7天，Y供应商交期14天',
    },
  },
  {
    id: 'procurement-plan',
    name: '采购计划制定',
    category: '采购管理',
    description: '根据需求预测制定采购计划',
    inputData: '需求预测数据、供应商信息、库存策略',
    context: {
      demand: '下月预测需求：A产品2000件，B产品1500件',
      supplier: '首选供应商：甲公司（交期5天），乙公司（交期10天）',
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];
