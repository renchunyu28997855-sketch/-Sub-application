# 制造业AI技能 - 中文说明

## 概述

本文档提供制造业AI技能的中文说明，帮助快速理解每个技能的功能和使用方法。

---

## 技能列表

### 1. equipment-health-monitor (设备健康监测器)

**功能**: 综合监测旋转设备的健康状态，包括振动、温度、电流等参数。

**核心能力**:
- 振动分析 (ISO 10816标准)
- 轴承健康评估
- 电机电流特征分析
- 温度监测与异常诊断
- 故障频率计算
- 剩余寿命估算

**适用设备**: 离心泵、电机、压缩机、齿轮箱、涡轮机

**使用示例**:
```javascript
const { equipmentHealthMonitor } = require('./equipment-health-monitor');

const result = equipmentHealthMonitor({
  equipmentId: 'PUMP-001',
  equipmentType: 'centrifugal_pump',
  measurements: {
    vibration: { amplitude: 2.5, frequency: 60, rms: 1.8, peak: 4.2 },
    temperature: { bearing: 72, surface: 45 },
    current: { phaseA: 45.2, phaseB: 44.8, phaseC: 45.0 }
  }
});
```

**输出示例**:
```javascript
{
  success: true,
  data: {
    healthScore: 85,
    healthStatus: 'good',
    failureRisk: 'low',
    anomalyTypes: ['slight-imbalance'],
    recommendations: ['继续当前维护计划', '建议2000小时后进行例行检查']
  }
}
```

---

### 2. wear-detector (磨损检测器)

**功能**: 检测皮带、刀具等易损件的磨损状态，预测更换时间。

**核心能力**:
- 皮带张力分析
- 皮带磨损检测
- 刀具寿命监测
- 磨损模式识别
- 更换时间预测

**使用示例**:
```javascript
const { wearDetector } = require('./wear-detector');

const result = wearDetector({
  equipmentId: 'CONVEYOR-001',
  componentType: 'belt',
  measurements: {
    tension: 320,
    thickness: 8.2,
    crackDepth: 0
  }
});
```

---

### 3. predictive-maintenance (预测性维护)

**功能**: 基于设备历史数据和当前状态，预测设备故障时间和最佳维护时机。

**核心能力**:
- 剩余寿命预测 (RUL)
- 故障概率分析
- 健康指数计算
- 最佳维护时机
- 维护成本优化

**使用示例**:
```javascript
const { predictiveMaintenance } = require('./predictive-maintenance');

const result = await predictiveMaintenance({
  equipmentId: 'MOTOR-001',
  equipmentType: 'induction_motor',
  operatingHours: 45000,
  degradationData: {
    bearingCondition: 0.15,
    windingTemp: 0.1,
    vibration: 0.2
  },
  historicalData: [
    { timestamp: '2026-03-01', healthIndex: 0.85 },
    { timestamp: '2026-03-15', healthIndex: 0.80 },
    { timestamp: '2026-04-01', healthIndex: 0.75 }
  ]
});
```

**输出示例**:
```javascript
{
  status: 'success',
  results: {
    healthIndex: 0.72,
    healthStatus: 'fair',
    rul: { hours: 8760, days: 365, isExpired: false },
    confidenceInterval: { lower: 7000, upper: 10500, confidence: 0.8 },
    recommendations: ['计划在6-12个月内更换', '增加监测频率']
  }
}
```

---

### 4. production-scheduler (生产调度器)

**功能**: 优化生产计划排程，包括生产、维护、轮班和急单处理。

**核心能力**:
- 生产计划排程
- 维护计划集成
- 轮班调度优化
- 急单处理
- 产能平衡
- 资源优化配置

**使用示例**:
```javascript
const { productionScheduler } = require('./production-scheduler');

const result = await productionScheduler({
  orders: [
    { id: 'ORD-001', quantity: 1000, deadline: '2026-04-20', priority: 'normal' },
    { id: 'ORD-002', quantity: 500, deadline: '2026-04-16', priority: 'rush' }
  ],
  resources: {
    lines: 3,
    workers: 50,
    shifts: ['day', 'night']
  },
  maintenanceWindows: [
    { start: '2026-04-18', end: '2026-04-19', line: 1 }
  ]
});
```

---

### 5. energy-optimizer (能源优化器)

**功能**: 综合优化工厂能源消耗，包括电力、燃气、压缩空气等。

**核心能力**:
- 能源消耗监测
- 设备能效分析
- HVAC系统优化
- 照明系统优化
- 空压机优化
- 峰谷调节策略
- 新能源集成
- 碳排放计算

**使用示例**:
```javascript
const { energyOptimizer } = require('./energy-optimizer');

const result = await energyOptimizer({
  facilityId: 'FACTORY-001',
  period: 'monthly',
  data: {
    electricity: { consumption: 150000, cost: 120000 },
    gas: { consumption: 50000, cost: 25000 },
    compressedAir: { consumption: 20000, cost: 8000 }
  },
  optimizationGoals: ['cost-reduction', 'carbon-reduction']
});
```

**输出示例**:
```javascript
{
  status: 'success',
  currentMetrics: {
    totalEnergyCost: 153000,
    carbonEmissions: 850,
    energyIntensity: 0.45
  },
  recommendations: [
    { area: 'hvac', potential: 15000, payback: '8 months' },
    { area: 'lighting', potential: 8000, payback: '4 months' },
    { area: 'peak-shaving', potential: 12000, payback: '6 months' }
  ],
  projectedSavings: { annual: 35000, carbon: 120 }
}
```

---

### 6. logistics-optimizer (物流优化器)

**功能**: 优化仓库运营，包括拣货路径、仓库布局和资源分配。

**核心能力**:
- 拣货路径优化 (最短路径算法)
- 仓库布局优化
- 资源分配优化
- 订单分批优化

**使用示例**:
```javascript
const { logisticsOptimizer } = require('./logistics-optimizer');

const result = await logisticsOptimizer({
  warehouseId: 'WH-001',
  orders: [
    { id: 'ORD-001', items: ['A1', 'B2', 'C3'] },
    { id: 'ORD-002', items: ['A1', 'D4'] }
  ],
  layout: {
    width: 100,
    height: 50,
    aisles: 8,
    shelvesPerAisle: 20
  }
});
```

---

### 7. quality-inspector (质量检测器)

**功能**: 综合质量检测，支持视觉检测、尺寸测量、表面质量等多种检测模式。

**核心能力**:
- 视觉缺陷检测 (基于深度学习)
- 尺寸测量
- 表面粗糙度检测
- 涂层厚度检测
- 颜色差异检测
- 污染检测
- 焊接质量检测
- 包装质量检测
- 来料检验

**使用示例**:
```javascript
const { qualityInspector } = require('./quality-inspector');

// 视觉缺陷检测
const defectResult = await qualityInspector({
  inspectionType: 'visual-defect',
  image: imageBuffer,
  productType: 'metal-part',
  defectTypes: ['scratch', 'dent', 'crack']
});

// 尺寸测量
const dimensionResult = await qualityInspector({
  inspectionType: 'dimension',
  measurements: {
    length: 100.5,
    width: 50.2,
    height: 25.0
  },
  tolerances: {
    length: { min: 99.5, max: 100.5 },
    width: { min: 49.8, max: 50.5 },
    height: { min: 24.8, max: 25.3 }
  }
});
```

**输出示例**:
```javascript
{
  success: true,
  inspectionType: 'visual-defect',
  result: {
    passed: false,
    defectCount: 2,
    defects: [
      { type: 'scratch', location: [150, 200], severity: 'medium' },
      { type: 'dent', location: [320, 180], severity: 'low' }
    ],
    confidence: 0.92
  }
}
```

---

### 8. material-manager (物料管理器)

**功能**: 管理物料补货、替代和追溯。

**核心能力**:
- 物料补货计划
- 物料替代建议
- 物料批次追溯
- 库存优化

**使用示例**:
```javascript
const { materialManager } = require('./material-manager');

const result = await materialManager({
  action: 'replenishment',
  materialId: 'STEEL-PLATE-001',
  currentStock: 500,
  reorderPoint: 1000,
  leadTime: 7,
  dailyUsage: 100
});
```

---

### 9. supply-chain-manager (供应链管理器)

**功能**: 管理供应商绩效、订单优先级和多工厂协调。

**核心能力**:
- 供应商绩效评估
- 订单优先级排序
- 多工厂协调
- 交付准时率追踪

**使用示例**:
```javascript
const { supplyChainManager } = require('./supply-chain-manager');

const result = await supplyChainManager({
  action: 'supplier-evaluation',
  supplierId: 'SUP-001',
  metrics: {
    onTimeDelivery: 0.95,
    qualityRate: 0.98,
    costCompetitiveness: 0.85
  }
});
```

---

### 10. production-planner (生产规划器)

**功能**: 长期生产规划，包括产能规划和瓶颈识别。

**核心能力**:
- 产能规划模拟
- 瓶颈识别与分析
- 采购优化
- 投资回报分析

**使用示例**:
```javascript
const { productionPlanner } = require('./production-planner');

const result = await productionPlanner({
  planningHorizon: 'quarterly',
  demandForecast: [
    { month: '2026-05', demand: 50000 },
    { month: '2026-06', demand: 55000 },
    { month: '2026-07', demand: 60000 }
  ],
  currentCapacity: { lines: 5, shifts: 2, overtime: 'allowed' }
});
```

**输出示例**:
```javascript
{
  status: 'success',
  analysis: {
    bottleneck: 'Assembly Line 3',
    bottleneckUtilization: 0.95,
    capacityUtilization: 0.78,
    demandCoverage: 0.92
  },
  recommendations: [
    { action: 'add-line', impact: '+20% capacity', timeline: '6 months' },
    { action: 'overtime', impact: '+10% short-term', timeline: 'immediate' }
  ],
  projectedROI: 1.35
}
```

---

### 11. supply-chain-planner (供应链规划器)

**功能**: 供应链预测和规划，包括库存预测和需求预测。

**核心能力**:
- 库存预测
- 需求预测
- 补货优化
- 安全库存计算

**使用示例**:
```javascript
const { supplyChainPlanner } = require('./supply-chain-planner');

const result = await supplyChainPlanner({
  productId: 'PROD-001',
  forecastPeriod: 30,
  historicalData: [
    { date: '2026-03-01', demand: 100, inventory: 500 },
    { date: '2026-03-15', demand: 120, inventory: 480 }
  ],
  serviceLevel: 0.95
});
```

---

### 12. lubrication-advisory (润滑咨询)

**功能**: 提供设备润滑建议和维护指导。

**使用示例**:
```javascript
const { lubricationAdvisory } = require('./lubrication-advisory');

const result = lubricationAdvisory({
  equipmentType: 'gearbox',
  operatingConditions: {
    temperature: 85,
    load: 'heavy',
    speed: 'medium'
  }
});
```

---

### 13. carbon-emission-calculator (碳排放计算器)

**功能**: 计算工厂或设备的碳排放量。

**使用示例**:
```javascript
const { carbonEmissionCalculator } = require('./carbon-emission-calculator');

const result = carbonEmissionCalculator({
  scope: 'facility',
  period: 'monthly',
  data: {
    electricity: { consumption: 150000, emissionFactor: 0.5 },
    gas: { consumption: 50000, emissionFactor: 2.0 },
    transport: { distance: 10000, fuelType: 'diesel' }
  }
});
```

---

## 技能分类索引

### 设备管理类
| 技能 | 功能 |
|------|------|
| equipment-health-monitor | 设备健康综合监测 |
| wear-detector | 磨损检测 |
| predictive-maintenance | 预测性维护 |

### 生产运营类
| 技能 | 功能 |
|------|------|
| production-scheduler | 生产调度 |
| production-planner | 生产规划 |

### 能源物流类
| 技能 | 功能 |
|------|------|
| energy-optimizer | 能源优化 |
| logistics-optimizer | 物流优化 |

### 质量检测类
| 技能 | 功能 |
|------|------|
| quality-inspector | 综合质量检测 |

### 供应链类
| 技能 | 功能 |
|------|------|
| supply-chain-manager | 供应链管理 |
| supply-chain-planner | 供应链规划 |
| material-manager | 物料管理 |

### 专项类
| 技能 | 功能 |
|------|------|
| lubrication-advisory | 润滑咨询 |
| carbon-emission-calculator | 碳排放计算 |

---

## 常见问题

**Q: 如何选择合适的技能?**
A: 根据要解决的问题类型，对照上方的技能分类索引选择对应的技能。

**Q: 技能之间有什么依赖关系?**
A: production-planner 的输出可以作为 production-scheduler 的输入；predictive-maintenance 的结果可以触发 maintenance-schedule-optimization。

**Q: 如何处理技能返回的错误?**
A: 所有技能都返回标准格式的错误信息，包含 code 和 message 字段，便于程序化处理。
