# Predictive Maintenance - 预测性维护

## 描述

基于设备历史数据和当前状态，预测设备故障时间和最佳维护时机，整合设备寿命预测、故障概率分析和报废预测功能。

**版本**: 1.0.0
**合并来源**: equipment-failure-prediction, remaining-life-prediction, spoilage-prediction

## 功能特性

### 核心能力

| 功能 | 说明 |
|------|------|
| 健康指数计算 | 基于多参数综合评估设备健康状态 |
| 剩余寿命预测 (RUL) | 预测设备剩余运行时间 |
| 故障概率分析 | 评估各类故障模式的发生概率 |
| 故障模式识别 | 识别可能的故障原因 |
| 最佳维护窗口 | 计算最优维护时机和成本效益 |
| 报废预测 | 预测产品报废率趋势 |

## 支持的设备类型

| 设备类型 | 典型寿命 | 关键部件 |
|----------|----------|----------|
| centrifugal_pump | 50,000小时 | 轴承、密封、叶轮 |
| induction_motor | 75,000小时 | 绕组、轴承、轴 |
| compressor | 60,000小时 | 阀、活塞、气缸 |
| gearbox | 80,000小时 | 齿轮、轴承、密封 |
| turbine | 100,000小时 | 叶片、密封、轴承 |

## 输入参数

```javascript
predictiveMaintenance({
  equipmentId: string,              // 必填：设备ID
  equipmentType: string,             // 设备类型
  operatingHours: number,           // 已运行小时数
  degradationData: {                // 退化数据 (0=新, 1=失效)
    bearingCondition: number,       // 轴承状态 (0-1)
    windingTemp: number,             // 绕组温度退化
    vibration: number,              // 振动退化
    seal: number,                    // 密封状态
    efficiency: number,              // 效率退化
    equipmentAge: number            // 设备月龄
  },
  historicalData: [                // 历史健康数据
    {
      timestamp: string,            // 时间戳
      healthIndex: number,           // 健康指数 (可选)
      degradationData: object       // 或退化数据
    }
  ],
  anomalies: [                     // 当前异常
    {
      type: string,                 // 异常类型
      severity: string,              // 严重程度
      description: string           // 描述
    }
  ],
  costData: {                      // 成本数据 (用于维护优化)
    plannedReplacementCost: number,
    emergencyReplacementCost: number,
    downtimeCostPerDay: number,
    maintenanceCostPerDay: number
  },
  includeSpoilagePrediction: boolean  // 是否包含报废预测
})
```

## 输出格式

```javascript
{
  success: true,
  status: 'success',
  timestamp: "2026-04-15T10:30:00.000Z",
  equipmentId: "MOTOR-001",
  equipmentType: "induction_motor",

  // 健康评估
  healthIndex: 0.72,              // 0-1, 越高越好
  healthStatus: "fair",           // good|fair|warning|poor|critical
  healthDescription: "设备有轻微退化",

  // 剩余寿命 (RUL)
  rul: {
    hours: 8760,                  // 剩余小时
    days: 365,                    // 剩余天
    cycles: 365,                   // 剩余周期
    isExpired: false
  },

  // 故障概率
  failureProbability: 0.35,        // 0-1
  failureRisk: "medium",           // critical|high|medium|low

  // 置信区间
  confidenceInterval: {
    lower: 7000,                  // RUL下限
    upper: 10500,                 // RUL上限
    confidence: 0.8              // 置信度
  },

  // 可能的故障模式
  possibleFailureModes: [
    {
      mode: "bearing_wear",
      confidence: 0.65,
      severity: "high",
      description: "轴承磨损"
    },
    {
      mode: "insulation_degradation",
      confidence: 0.45,
      severity: "high",
      description: "绝缘老化"
    }
  ],

  // 最佳维护窗口
  maintenanceWindow: {
    plannedReplacementNow: 10000,  // 立即更换成本
    expectedFailureCost: 18000,   // 故障后成本
    potentialSavings: 8000,        // 潜在节省
    recommendedAction: "wait",     // wait|replace_now
    optimalWindow: "未来292天内"   // 建议维护窗口
  },

  // 设备信息
  equipment: {
    typicalLifeHours: 75000,
    lifeUsedPercent: 60,           // 已用寿命百分比
    criticalComponents: ["winding", "bearing", "shaft"],
    failureModes: ["insulation_degradation", "bearing_wear", "thermal"]
  },

  // 建议
  recommendations: [
    "纳入中期维护计划",
    "增加监测频率",
    "关注轴承磨损风险"
  ],

  // 报废预测 (如果启用)
  spoilagePrediction: {
    spoilageRisk: "low",
    predictedRate: 0.05,
    historicalAverage: 0.06,
    confidence: 0.85,
    recommendations: ["继续当前生产工艺"]
  }
}
```

## 健康指数标准

| 指数范围 | 健康状态 | 说明 | 建议 |
|----------|----------|------|------|
| 0.8-1.0 | good | 设备状态良好 | 正常维护 |
| 0.6-0.8 | fair | 有轻微退化 | 增加监测 |
| 0.4-0.6 | warning | 需要关注 | 计划维护 |
| 0.2-0.4 | poor | 接近寿命末期 | 尽快维护 |
| 0.0-0.2 | critical | 需要立即维护 | 紧急更换 |

## 故障风险等级

| 风险等级 | 概率范围 | 说明 |
|----------|----------|------|
| critical | >70% | 极高风险 |
| high | 50-70% | 高风险 |
| medium | 30-50% | 中等风险 |
| low | <30% | 低风险 |

## 故障模式说明

| 故障模式 | 典型症状 | 严重程度 | 典型失效时间 |
|----------|----------|----------|--------------|
| bearing_wear | 振动增加、温度上升、噪音 | 高 | 3-6个月 |
| insulation_degradation | 绕组温升、局部放电、效率下降 | 严重 | 6-12个月 |
| lubrication_failure | 温度上升、金属颗粒、噪音 | 高 | 1-3个月 |
| misalignment | 振动增加、轴承磨损、联轴器磨损 | 中 | 6-12个月 |
| unbalance | 径向振动、振幅增大 | 中 | 3-6个月 |
| overloading | 电流增加、温度上升、效率下降 | 高 | 1-6个月 |

## 使用示例

### 示例1: 电机预测性维护

```javascript
const { predictiveMaintenance } = require('./predictive-maintenance');

const result = await predictiveMaintenance({
  equipmentId: 'MOTOR-001',
  equipmentType: 'induction_motor',
  operatingHours: 45000,
  degradationData: {
    bearingCondition: 0.15,        // 轴承有15%退化
    windingTemp: 0.1,               // 绕组温升10%退化
    vibration: 0.2,                // 振动有20%退化
    equipmentAge: 36                // 36个月
  },
  historicalData: [
    { timestamp: '2026-03-01', healthIndex: 0.85 },
    { timestamp: '2026-03-15', healthIndex: 0.80 },
    { timestamp: '2026-04-01', healthIndex: 0.75 }
  ],
  anomalies: [
    { type: 'bearing-warning', severity: 'warning', description: '轴承振动偏高' }
  ],
  costData: {
    plannedReplacementCost: 50000,
    emergencyReplacementCost: 80000,
    downtimeCostPerDay: 20000,
    maintenanceCostPerDay: 5000
  }
});

console.log(`健康指数: ${result.healthIndex}`);
console.log(`剩余寿命: ${result.rul.days} 天`);
console.log(`故障风险: ${result.failureRisk}`);
```

### 示例2: 批量分析

```javascript
const { predictiveMaintenanceBatch } = require('./predictive-maintenance');

const results = await predictiveMaintenanceBatch([
  { equipmentId: 'PUMP-001', equipmentType: 'centrifugal_pump', operatingHours: 30000 },
  { equipmentId: 'MOTOR-001', equipmentType: 'induction_motor', operatingHours: 45000 },
  { equipmentId: 'GEAR-001', equipmentType: 'gearbox', operatingHours: 50000 }
]);

console.log(`总设备数: ${results.totalEquipment}`);
console.log(`高风险设备数: ${results.criticalCount}`);
```

### 示例3: 带报废预测

```javascript
const result = await predictiveMaintenance({
  equipmentId: 'PROD-LINE-001',
  equipmentType: 'general',
  degradationData: {
    qualityIndex: 0.1,
    spoilageHistory: [
      { timestamp: '2026-03-01', spoilageRate: 0.05 },
      { timestamp: '2026-03-15', spoilageRate: 0.06 },
      { timestamp: '2026-04-01', spoilageRate: 0.07 }
    ]
  },
  includeSpoilagePrediction: true
});

console.log(`报废风险: ${result.spoilagePrediction.spoilageRisk}`);
```
