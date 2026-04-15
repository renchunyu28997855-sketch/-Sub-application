export interface Template {
  id: string;
  name: string;
  category: string;
  jobDescription: string;
  context: {
    machines: string;
    workers: string;
    materials: string;
    deadline: string;
    priority: string;
  };
}

export const templates: Template[] = [
  // 电子产品类
  {
    id: 'pcb-assembly',
    name: 'PCB板组装',
    category: '电子产品',
    jobDescription: '根据生产订单进行PCB板组装生产，包括锡膏印刷、元件贴装、回流焊接、AOI检测等工序。每日产能目标1000片，需确保良品率在99%以上。',
    context: {
      machines: '锡膏印刷机、贴片机、回流焊炉、AOI检测仪',
      workers: '操作工4人、质检员2人',
      materials: 'PCB板、元器件、锡膏',
      deadline: '当日完成',
      priority: '高',
    },
  },
  {
    id: 'product-testing',
    name: '产品功能测试',
    category: '电子产品',
    jobDescription: '对组装完成的电子产品进行功能测试，包括通电测试、软件烧录、性能验证等。记录测试数据，对不良品进行定位和返修。',
    context: {
      machines: '测试治具、电脑、烧录器',
      workers: '测试员3人',
      materials: '待测产品、测试配件',
      deadline: '按批次交付',
      priority: '中',
    },
  },

  // 机械加工类
  {
    id: 'cnc-machining',
    name: 'CNC数控加工',
    category: '机械加工',
    jobDescription: '根据图纸要求进行金属零件的CNC数控加工，包括编程、装夹、加工、检测等。需按照工艺路线选择合适的刀具和切削参数。',
    context: {
      machines: 'CNC加工中心、数控车床',
      workers: '编程员1人、操作工2人',
      materials: '铝材、钢材坯料、刀具',
      deadline: '按工单交期',
      priority: '高',
    },
  },
  {
    id: 'welding-assembly',
    name: '焊接组装',
    category: '机械加工',
    jobDescription: '对金属零部件进行焊接组装，包括氩弧焊、二氧化碳保护焊等。按照工艺要求进行定位、夹紧、焊接，焊后进行外观检查和必要的后处理。',
    context: {
      machines: '氩弧焊机、二保焊机、焊接工装',
      workers: '焊工3人',
      materials: '母材、焊材、气体',
      deadline: '按工单交期',
      priority: '中',
    },
  },

  // 注塑成型类
  {
    id: 'injection-molding',
    name: '注塑成型生产',
    category: '注塑成型',
    jobDescription: '使用注塑机进行塑料零件生产，包括原料干燥、模具安装、参数调试、批量生产、品质检验。需控制成型温度、压力、时间等关键参数。',
    context: {
      machines: '注塑机、干燥机、模具、冷却系统',
      workers: '操作工2人、调机员1人',
      materials: '塑料粒子、色母',
      deadline: '批量交付',
      priority: '高',
    },
  },
  {
    id: 'mold-change',
    name: '模具更换作业',
    category: '注塑成型',
    jobDescription: '进行注塑模具的拆卸、清洁、安装和调试工作。确保模具定位准确，完成首件检验合格后方可批量生产。',
    context: {
      machines: '注塑机、模具、吊装设备',
      workers: '模具工2人、操作工1人',
      materials: '新模具、模具润滑油',
      deadline: '2小时内完成',
      priority: '高',
    },
  },

  // 涂装表面处理类
  {
    id: 'spray-painting',
    name: '喷涂作业',
    category: '表面处理',
    jobDescription: '对金属或塑料制品进行喷涂作业，包括前处理、底漆喷涂、面漆喷涂、烘烤固化。需控制涂层厚度和均匀性，确保外观质量。',
    context: {
      machines: '喷涂设备、烤箱、除尘设备',
      workers: '喷涂工3人',
      materials: '涂料、溶剂、固化剂',
      deadline: '按批次交付',
      priority: '中',
    },
  },
  {
    id: 'electroplating',
    name: '电镀加工',
    category: '表面处理',
    jobDescription: '进行金属制品的电镀加工，包括镀锌、镀镍、镀铬等工艺。需控制电流密度、温度、时间等参数，确保镀层质量。',
    context: {
      machines: '电镀槽、整流器、吊挂设备',
      workers: '电镀工2人',
      materials: '电镀液、金属阳极',
      deadline: '按工单交期',
      priority: '中',
    },
  },

  // 装配类
  {
    id: 'final-assembly',
    name: '成品组装',
    category: '装配作业',
    jobDescription: '将各种零部件按照装配工艺进行组装，包括预装配、总装配、调试、检验等工序。确保装配精度和功能达标。',
    context: {
      machines: '组装工装、电动工具、检测设备',
      workers: '装配工5人',
      materials: '零部件、紧固件、润滑脂',
      deadline: '当日完成',
      priority: '高',
    },
  },
  {
    id: 'large-equipment',
    name: '大型设备装配',
    category: '装配作业',
    jobDescription: '进行大型设备的现场装配，包括设备就位、组件安装、管路连接、电气接线、系统调试等。需严格按照安装规范施工。',
    context: {
      machines: '行车、叉车、吊装设备、焊接设备',
      workers: '装配钳工4人、电工2人',
      materials: '设备组件、紧固件、管件、电缆',
      deadline: '按项目进度',
      priority: '高',
    },
  },

  // 包装物流类
  {
    id: 'product-packaging',
    name: '产品包装',
    category: '包装物流',
    jobDescription: '对检验合格的产品进行包装作业，包括内包装、外包装、贴标、装箱等。按照包装规范操作，确保产品安全运输。',
    context: {
      machines: '包装设备、贴标机、封箱机',
      workers: '包装工3人',
      materials: '包装盒、泡沫、标签、纸箱',
      deadline: '当日完成',
      priority: '低',
    },
  },
  {
    id: 'warehouse-picking',
    name: '仓库拣货',
    category: '包装物流',
    jobDescription: '根据订单需求进行仓库拣货作业，包括RF扫描、货物复核、包装发货。确保拣货准确率，避免发错货。',
    context: {
      machines: 'RF终端、叉车、输送线',
      workers: '拣货员3人、复核员1人',
      materials: '订单清单、包装材料',
      deadline: '当日发货',
      priority: '中',
    },
  },

  // 食品医药类
  {
    id: 'food-processing',
    name: '食品加工',
    category: '食品医药',
    jobDescription: '进行食品原料的加工处理，包括清洗、切割、烹饪、杀菌、包装等工序。严格遵守食品安全规范，确保产品质量。',
    context: {
      machines: '食品加工设备、杀菌设备、包装机',
      workers: '食品加工工5人',
      materials: '食品原料、添加剂、包装材料',
      deadline: '按生产计划',
      priority: '高',
    },
  },
  {
    id: 'pharmaceutical-packaging',
    name: '药品包装',
    category: '食品医药',
    jobDescription: '对药品进行内包装和外包装作业，包括泡罩包装、瓶装、盒装、装箱等。需严格遵守GMP规范，确保药品安全性。',
    context: {
      machines: '泡罩包装机、瓶装机、贴标机',
      workers: '包装工4人、QA 1人',
      materials: '药品、包装材料、说明书',
      deadline: '按批次完成',
      priority: '高',
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];
