# Equipment Health Monitor - 设备健康监测器

## 描述

综合设备健康监测技能，整合振动分析、温度监测、电机电流分析和轴承健康评估，为旋转设备提供全面的健康状态评估。

**版本**: 1.0.0
**合并来源**: bearing-health-monitoring, motor-current-analysis, vibration-analysis, thermal-monitoring

## 功能特性

### 核心能力

| 功能 | 说明 |
|------|------|
| 振动分析 | ISO 10816标准振动评估，RMS/峰值计算 |
| 温度监测 | 多点温度监测与偏差分析 |
| 电机电流分析 | 三相电流不平衡、负载率、功率因数 |
| 轴承健康评估 | 轴承类型支持、健康评分、剩余寿命 |
| 故障诊断 | 自动识别缺相、过载、堵转等异常 |
| 综合评分 | 0-100健康评分和风险等级 |

## 支持的设备类型

| 设备类型 | 温度阈值配置 | 应用场景 |
|----------|-------------|----------|
| induction_motor | 电机标准温度 | 通用异步电机 |
| dc_motor | 直流电机温度 | 直流电机 |
| compressor | 压缩机温度 | 离心/螺杆空压机 |
| pump | 泵温度 | 离心泵 |
| gearbox | 齿轮箱温度 | 齿轮箱 |

## 输入参数

```javascript
equipmentHealthMonitor({
  equipmentId: string,           // 必填：设备ID
  equipmentType: string,         // 设备类型: induction_motor, dc_motor, compressor, pump, gearbox
  bearingType: string,           // 轴承类型: deep-groove, angular-contact, cylindrical-roller等
  operatingHours: number,        // 运行小时数
  ratedCurrent: number,          // 额定电流 (A)
  ratedVoltage: number,          // 额定电压 (V)
  measurements: {
    vibration: {                 // 振动数据
      amplitude: number,        // 振幅 (mm/s)
      frequency: number,        // 频率 (Hz)
      rms: number,               // RMS值 (mm/s)
      peak: number               // 峰值 (mm/s)
    },
    temperature: {               // 温度数据
      winding?: number,         // 绕组温度 (°C)
      bearing?: number,          // 轴承温度 (°C)
      surface?: number          // 表面温度 (°C)
    },
    current: {                  // 电流数据
      phaseA: number,            // A相电流 (A)
      phaseB: number,            // B相电流 (A)
      phaseC: number             // C相电流 (A)
    },
    voltage: {                  // 电压数据
      phaseA: number,            // A相电压 (V)
      phaseB: number,            // B相电压 (V)
      phaseC: number             // C相电压 (V)
    }
  }
})
```

## 输出格式

```javascript
{
  success: true,
  equipmentId: "PUMP-001",
  equipmentType: "pump",
  timestamp: "2026-04-15T10:30:00.000Z",

  // 健康评分
  healthScore: 85,              // 0-100
  healthStatus: "good",          // excellent|good|fair|poor|critical
  failureRisk: "low",            // very-low|low|medium|high|very-high

  // 振动分析
  vibrationAnalysis: {
    rms: 1.8,
    peak: 4.2,
    zone: "B",
    condition: "good",
    severity: "normal",
    recommendation: "继续监测"
  },

  // 温度分析
  temperatureAnalysis: {
    overallStatus: "normal",
    points: {
      bearing: { current: 68, baseline: 65, deviation: 3, status: "normal" },
      surface: { current: 42, baseline: 50, deviation: -8, status: "normal" }
    }
  },

  // 电机分析 (当提供电流数据时)
  motorAnalysis: {
    current: { average: 45.0, unbalance: 0.5, unbalanceStatus: "normal" },
    voltage: { average: 380, unbalance: 0.3, unbalanceStatus: "normal" },
    load: { percentage: 75.0, status: "normal" },
    anomalies: [],
    penalties: { current: 0, voltage: 0, load: 0 }
  },

  // 轴承分析 (当提供轴承类型时)
  bearingAnalysis: {
    score: 88,
    healthStatus: "good",
    bearingType: "deep-groove",
    remainingLife: { hours: 4000, confidence: "high" },
    anomalies: [],
    vibrationPenalty: 0,
    tempPenalty: 0
  },

  // 异常列表
  anomalies: [
    { type: "current-unbalance", severity: "attention", description: "电流不平衡度0.5%" }
  ],

  // 建议
  recommendations: [
    "设备状态良好，继续当前维护计划",
    "建议2000小时后进行例行检查"
  ],

  confidence: 0.92
}
```

## 健康评分标准

| 评分范围 | 健康状态 | 说明 |
|----------|----------|------|
| 90-100 | excellent | 设备状态优良 |
| 75-89 | good | 设备状态良好 |
| 60-74 | fair | 设备状态一般，需关注 |
| 40-59 | poor | 设备状态较差，需维护 |
| 0-39 | critical | 设备状态危险，需立即检修 |

## 振动等级 (ISO 10816)

| 区域 | RMS范围 | 状态 | 建议 |
|------|---------|------|------|
| A | ≤2.8mm/s | 新机器 | 无需处理 |
| B | 2.8-7.1mm/s | 良好 | 继续监测 |
| C | 7.1-18mm/s | 告警 | 1-2周内维护 |
| D | >18mm/s | 危险 | 立即停机 |

## 支持的轴承类型

- deep-groove (深沟球轴承)
- angular-contact (角接触轴承)
- cylindrical-roller (圆柱滚子轴承)
- tapered-roller (圆锥滚子轴承)
- thrust-ball (推力球轴承)
- plain-bearing (滑动轴承)

## 使用示例

### 示例1: 泵设备综合监测

```javascript
const { equipmentHealthMonitor } = require('./equipment-health-monitor');

const result = equipmentHealthMonitor({
  equipmentId: 'PUMP-001',
  equipmentType: 'pump',
  measurements: {
    vibration: { amplitude: 2.5, frequency: 60, rms: 1.8, peak: 4.2 },
    temperature: { bearing: 72, surface: 45 }
  }
});

console.log(result.healthScore); // 85
console.log(result.healthStatus); // "good"
```

### 示例2: 电机完整分析

```javascript
const result = equipmentHealthMonitor({
  equipmentId: 'MOTOR-001',
  equipmentType: 'induction_motor',
  bearingType: 'deep-groove',
  operatingHours: 15000,
  ratedCurrent: 50,
  ratedVoltage: 380,
  measurements: {
    vibration: { amplitude: 1.2, frequency: 50, rms: 0.9, peak: 2.1 },
    temperature: { winding: 85, bearing: 68, surface: 48 },
    current: { phaseA: 42.5, phaseB: 42.3, phaseC: 42.8 },
    voltage: { phaseA: 380, phaseB: 381, phaseC: 379 }
  }
});
```

### 示例3: 仅振动监测

```javascript
const result = equipmentHealthMonitor({
  equipmentId: 'FAN-001',
  equipmentType: 'general',
  measurements: {
    vibration: { rms: 8.5, peak: 15.2 }
  }
});

if (result.vibrationAnalysis.zone === 'D') {
  console.log('危险: 立即停机');
}
```

## 错误处理

所有错误返回统一格式:

```javascript
{
  success: false,
  error: {
    code: 'INVALID_INPUT',           // 错误码
    message: 'equipmentId is required' // 错误消息
  }
}
```

常见错误码:
- INVALID_INPUT: 输入参数验证失败
- PROCESSING_ERROR: 处理过程发生错误
