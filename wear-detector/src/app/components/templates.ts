export interface Template {
  id: string;
  name: string;
  category: string;
  jobDescription: string;
  context: {
    equipmentType: string;
    wearDescription: string;
    operatingHours: string;
    maintenanceHistory: string;
  };
}

export const templates: Template[] = [
  {
    id: 'bearing-wear',
    name: '轴承磨损分析',
    category: '旋转设备',
    jobDescription: '设备运行中出现异常振动和噪音，轴承温度升高。振动频谱显示高频成分增加，声发射检测到冲击信号。磨损产物分析显示金属颗粒含量超标。',
    context: {
      equipmentType: '滚动轴承',
      wearDescription: '外圈表面出现疲劳剥落，内圈存在粘着磨损迹象，保持架磨损严重',
      operatingHours: '约12000小时',
      maintenanceHistory: '上次更换轴承8000小时，未进行定期振动监测',
    },
  },
  {
    id: 'cutting-tool-wear',
    name: '刀具磨损检测',
    category: '加工设备',
    jobDescription: '数控机床加工零件表面粗糙度增加，切削力增大，刀片后面磨损带宽度超过标准值。后刀面磨损严重，月牙洼磨损深度达到0.3mm。',
    context: {
      equipmentType: '硬质合金铣刀片',
      wearDescription: '后刀面磨损VB值0.35mm，崩刃宽度0.2mm，涂层部分剥落',
      operatingHours: '连续切削约48小时',
      maintenanceHistory: '首次使用，日常加工中未进行在线监测',
    },
  },
  {
    id: 'gear-wear',
    name: '齿轮磨损评估',
    category: '传动系统',
    jobDescription: '减速机运行噪音增大，润滑油温度升高，油样光谱分析显示铁含量显著上升。齿面检查发现轻微点蚀，齿根存在疲劳裂纹扩展迹象。',
    context: {
      equipmentType: '斜齿轮减速机',
      wearDescription: '齿面出现中度点蚀，齿根有细小裂纹，齿轮啮合间隙增大',
      operatingHours: '约20000小时',
      maintenanceHistory: '每5000小时换油，最近一次油样分析铁含量异常',
    },
  },
];

export const categories = [...new Set(templates.map(t => t.category))];
