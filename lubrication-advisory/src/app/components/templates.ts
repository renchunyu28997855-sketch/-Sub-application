export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  context: {
    equipment?: string;
    operatingConditions?: string;
    oilType?: string;
    maintenanceHistory?: string;
  };
}

export const templates: Template[] = [
  // 轴承润滑
  {
    id: 'bearing-lubrication',
    name: '轴承润滑方案',
    category: '轴承润滑',
    description: '输入设备参数和工况，获取轴承润滑方案推荐',
    context: {
      equipment: '轴承型号、尺寸、类型（滚动轴承/滑动轴承）',
      operatingConditions: '转速、载荷、工作温度、运行环境',
      oilType: '',
      maintenanceHistory: '',
    },
  },
  // 液压系统
  {
    id: 'hydraulic-system',
    name: '液压系统油品选择',
    category: '液压系统',
    description: '根据液压系统参数推荐合适的液压油品',
    context: {
      equipment: '液压泵类型、系统压力、工作温度范围',
      operatingConditions: '工作环境（室内/室外、温度范围）、运行工况',
      oilType: '',
      maintenanceHistory: '',
    },
  },
  // 齿轮箱
  {
    id: 'gearbox-maintenance',
    name: '齿轮箱润滑维护',
    category: '齿轮箱润滑',
    description: '齿轮箱润滑维护周期建议和油品推荐',
    context: {
      equipment: '齿轮箱类型、减速比、输入输出转速',
      operatingConditions: '载荷类型、工作周期、环境温度',
      oilType: '',
      maintenanceHistory: '',
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];
