export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  context: {
    productType: string;
    productionVolume: string;
    leadTime: string;
    resources: string;
  };
}

export const templates: Template[] = [
  // 生产计划类
  {
    id: 'monthly-production-plan',
    name: '月度生产计划制定',
    category: '生产计划',
    description: '根据销售预测和库存情况，制定下月生产计划，包括产品种类、数量、生产周期安排。',
    context: {
      productType: '多品种产品',
      productionVolume: '10,000件/月',
      leadTime: '15天',
      resources: '两条生产线，50名工人',
    },
  },
  {
    id: 'weekly-production-scheduling',
    name: '周生产排程',
    category: '生产计划',
    description: '将月度计划分解到周/日级别，细化到每个工位和工序，确保订单按时交付。',
    context: {
      productType: '标准产品',
      productionVolume: '周产2,500件',
      leadTime: '3天',
      resources: '一条柔性生产线',
    },
  },
  {
    id: 'order-based-production',
    name: '订单导向生产计划',
    category: '生产计划',
    description: '根据客户订单制定生产计划，优先处理紧急订单，均衡分配生产资源。',
    context: {
      productType: '定制化产品',
      productionVolume: '按订单量',
      leadTime: '7-30天不等',
      resources: '多品种柔性产线',
    },
  },

  // 产能分析类
  {
    id: 'capacity-assessment',
    name: '产能评估与规划',
    category: '产能分析',
    description: '评估当前产能利用率，识别瓶颈工序，预测产能缺口并提出扩展建议。',
    context: {
      productType: '各类产品',
      productionVolume: '当前利用率75%',
      leadTime: '需评估',
      resources: '3条生产线，满负荷可产20,000件/月',
    },
  },
  {
    id: 'bottleneck-analysis',
    name: '瓶颈工序分析',
    category: '产能分析',
    description: '分析生产流程中的瓶颈工序，提出改善措施，提升整体产能。',
    context: {
      productType: '多工序产品',
      productionVolume: '日产能1,000件',
      leadTime: '5天',
      resources: '10道工序，关键设备2台',
    },
  },
  {
    id: 'capacity-expansion',
    name: '产能扩张评估',
    category: '产能分析',
    description: '评估产能扩张的可行性，包括设备投资、人力需求、投资回报分析。',
    context: {
      productType: '主打产品',
      productionVolume: '目标扩产50%',
      leadTime: '6个月',
      resources: '现有厂房产能，评估新增设备',
    },
  },

  // 物料需求类
  {
    id: 'mrp-calculation',
    name: '物料需求计划(MRP)',
    category: '物料需求',
    description: '根据生产计划计算物料需求，确定采购数量和到货时间，避免物料短缺或积压。',
    context: {
      productType: '组装类产品',
      productionVolume: '月产5,000套',
      leadTime: '原材料采购周期7-30天',
      resources: 'BOM包含20种原材料',
    },
  },
  {
    id: 'safety-stock',
    name: '安全库存设定',
    category: '物料需求',
    description: '根据物料使用量和供应风险，制定合理的安全库存策略。',
    context: {
      productType: '各类物料',
      productionVolume: '多品种小批量',
      leadTime: '供应不稳定物料5种',
      resources: '仓库容量有限',
    },
  },
  {
    id: 'supplier-coordination',
    name: '供应商协同计划',
    category: '物料需求',
    description: '与关键供应商共享生产计划，实现准时化供货，降低库存成本。',
    context: {
      productType: '核心零部件',
      productionVolume: '月供货10,000件',
      leadTime: '供应商交期14天',
      resources: '3家关键供应商',
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];
