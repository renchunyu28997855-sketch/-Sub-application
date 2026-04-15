export interface Template {
  id: string;
  name: string;
  category: string;
  equipmentData: string;
  context: {
    equipmentName: string;
    monitoringParams: string;
    alertThreshold: string;
    frequency: string;
  };
}

export const templates: Template[] = [
  {
    id: 'production-line-status',
    name: '产线设备状态',
    category: '生产设备',
    equipmentData: '设备运行参数、产量数据、停机记录、故障代码',
    context: {
      equipmentName: 'SMT贴片机、回流焊、波峰焊',
      monitoringParams: '温度、压力、速度、良品率',
      alertThreshold: '温度>260°C、良品率<95%',
      frequency: '实时监控',
    },
  },
  {
    id: 'cnc-machining',
    name: 'CNC加工中心',
    category: '加工设备',
    equipmentData: '主轴转速、进给速度、切削力、刀具磨损',
    context: {
      equipmentName: 'CNC数控机床',
      monitoringParams: '主轴转速、振动、温度、功率',
      alertThreshold: '振动>5mm/s、温度>80°C',
      frequency: '每5分钟采集',
    },
  },
  {
    id: 'robot-arm',
    name: '工业机器人',
    category: '自动化设备',
    equipmentData: '关节角度、速度、加速度、负载',
    context: {
      equipmentName: '六轴工业机械臂',
      monitoringParams: '关节温度、电机电流、位置精度',
      alertThreshold: '电机温度>70°C、位置偏差>0.5mm',
      frequency: '实时监控',
    },
  },
  {
    id: 'conveyor-system',
    name: '输送系统',
    category: '物流设备',
    equipmentData: '电机电流、速度、负载、皮带张力',
    context: {
      equipmentName: '自动化输送线',
      monitoringParams: '电机功率、皮带速度、物料流量',
      alertThreshold: '电机过载、皮带跑偏',
      frequency: '持续监控',
    },
  },
  {
    id: 'power-equipment',
    name: '电力设备',
    category: '能源设备',
    equipmentData: '电压、电流、功率因数、谐波',
    context: {
      equipmentName: '变压器、配电柜',
      monitoringParams: '三相电压、电流、功率、温度',
      alertThreshold: '电压波动>10%、温度>90°C',
      frequency: '实时监测',
    },
  },
  {
    id: 'compressed-air',
    name: '空压机系统',
    category: '动力设备',
    equipmentData: '排气压力、流量、温度、能耗',
    context: {
      equipmentName: '螺杆式空压机',
      monitoringParams: '排气压力、露点温度、运行时间',
      alertThreshold: '压力波动>0.5bar、温度>100°C',
      frequency: '每小时记录',
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];
