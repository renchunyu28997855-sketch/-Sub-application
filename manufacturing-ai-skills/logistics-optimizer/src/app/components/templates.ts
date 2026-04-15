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
  // 运输路线优化
  {
    id: 'route-optimization',
    name: '运输路线优化',
    category: '运输路线优化',
    jobDescription: '根据发货点和目的地的位置信息，综合考虑距离、时效、成本等因素，规划最优运输路线。需要实时获取路网状态，避开拥堵路段，平衡配送效率和燃油成本。',
    context: {
      inputData: '发货点坐标、多个目的地坐标、车辆载重限制、时效要求',
      outputResult: '最优路线规划、配送顺序、时间窗口安排',
      collaborator: '司机、调度中心、客户',
      frequency: '每日',
      timeRatio: '40%',
    },
  },
  {
    id: 'delivery-scheduling',
    name: '配送排程优化',
    category: '运输路线优化',
    jobDescription: '将多个配送任务分配给不同车辆和司机，考虑车辆容量、配送时间窗口、司机工作时长限制等约束条件，生成最优配送排程方案。',
    context: {
      inputData: '订单清单、车辆信息、司机排班、配送时间窗口',
      outputResult: '配送排程表、车辆任务分配、运输成本预算',
      collaborator: '调度员、司机、仓库',
      frequency: '每日',
      timeRatio: '35%',
    },
  },
  {
    id: 'multi-stop-route',
    name: '多站点路径规划',
    category: '运输路线优化',
    jobDescription: '为冷链车或快递配送车辆规划经过多个取货点和送货点的最优顺序，减少空驶里程，提高车辆利用率。',
    context: {
      inputData: '多点位置列表、每点装卸货时间、车辆类型、载重限制',
      outputResult: '最优路径顺序、预计行驶里程、总耗时',
      collaborator: '配送司机、调度中心',
      frequency: '每日',
      timeRatio: '30%',
    },
  },

  // 物流成本分析
  {
    id: 'cost-analysis',
    name: '物流成本分析',
    category: '物流成本分析',
    jobDescription: '分析运输数据，包括燃油费、过路费、司机工资、车辆折旧等各项成本构成，计算单票成本和单位里程成本，识别成本优化空间。',
    context: {
      inputData: '运输明细数据、燃油消耗记录、过路费票据、工资表',
      outputResult: '成本分析报表、单票成本明细、成本优化建议',
      collaborator: '财务部门、运输车队、运营分析',
      frequency: '每月',
      timeRatio: '25%',
    },
  },
  {
    id: 'freight-quotation',
    name: '运费报价分析',
    category: '物流成本分析',
    jobDescription: '根据货物重量体积、运输距离、目的地区域等因素，结合历史报价数据和市场行情，生成合理的运费报价方案。',
    context: {
      inputData: '货物信息（重量/体积/品类）、起止地点、市场运价参考',
      outputResult: '运费报价单、利润空间分析、报价有效期',
      collaborator: '销售团队、客户、竞品分析',
      frequency: '按需',
      timeRatio: '20%',
    },
  },
  {
    id: 'fuel-consumption-analysis',
    name: '油耗分析',
    category: '物流成本分析',
    jobDescription: '分析车队油耗数据，对比不同车型、不同路线、不同时段的油耗差异，识别异常耗油情况，制定节油驾驶规范。',
    context: {
      inputData: '车辆GPS轨迹、加油记录、载重数据、行驶里程',
      outputResult: '油耗分析报告、节油空间评估、驾驶行为建议',
      collaborator: '司机、运输管理部门',
      frequency: '每周',
      timeRatio: '15%',
    },
  },

  // 仓储调度优化
  {
    id: 'warehouse-scheduling',
    name: '仓储调度优化',
    category: '仓储调度优化',
    jobDescription: '根据订单优先级、库存分布、出库时间窗口等因素，优化仓库拣货任务分配和人员排班，提高拣货效率，减少订单处理时间。',
    context: {
      inputData: '订单列表、库存位置、拣货员排班、时效要求',
      outputResult: '拣货任务分配、路径规划、人员排班表',
      collaborator: '仓库管理员、拣货员、订单处理员',
      frequency: '每日',
      timeRatio: '45%',
    },
  },
  {
    id: 'inventory-replenishment',
    name: '库存补货优化',
    category: '仓储调度优化',
    jobDescription: '根据销售预测、安全库存、供应链周期等因素，计算最优补货数量和时间点，避免断货或积压。',
    context: {
      inputData: '销售历史数据、当前库存水平、供应商交期、安全库存设置',
      outputResult: '补货计划建议、采购订单草稿、库存预警',
      collaborator: '采购部门、仓库、销售预测',
      frequency: '每周',
      timeRatio: '30%',
    },
  },
  {
    id: 'order-allocation',
    name: '订单分配优化',
    category: '仓储调度优化',
    jobDescription: '根据客户位置、仓库库存、配送能力等因素，将订单分配到最合适的仓库或配送中心，降低配送成本和时效。',
    context: {
      inputData: '客户订单、各仓库库存、各仓库配送范围和能力',
      outputResult: '订单分配方案、物流成本估算、预计时效',
      collaborator: '仓储部门、配送中心、销售',
      frequency: '每日',
      timeRatio: '35%',
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];
