# Wear Detector - 磨损检测器

## 描述

综合磨损检测技能，整合皮带磨损检测和刀具磨损检测，支持多种皮带类型和刀具类型的磨损分析、寿命预测和更换建议。

**版本**: 1.0.0
**合并来源**: belt-wear-detection, tool-wear-detection

## 功能特性

### 支持的组件类型

| 类型 | 子类型 |
|------|--------|
| 皮带 (belt) | V Belt, Timing Belt, Flat Belt, Serpentine Belt |
| 刀具 (tool) | cuttingTool, drill, endMill, insert |

## 输入参数

```javascript
wearDetector({
  componentId: string,              // 必填：组件ID
  componentType: string,           // 'belt' | 'tool' | 'general'
  componentSubType: string,         // 具体类型
  parameters: {
    // 皮带参数
    age: number,                    // 运行时间 (月)
    currentThickness: number,        // 当前厚度 (mm)
    initialThickness: number,        // 初始厚度 (mm)
    crackDepth: number,             // 裂纹深度 (mm)
    tension: number,                // 张力 (N)
    temperature: number,            // 运行温度 (°C)

    // 刀具参数
    age: number,                    // 运行时间 (小时)
    currentDiameter: number,        // 当前直径 (mm)
    initialDiameter: number,        // 初始直径 (mm)
    flankWear: number,              // 刃口磨损量 (mm)
    craterWear: { depth: number },  // 崩刃深度 (mm)
    vibration: number,              // 当前振动值
    initialVibration: number,       // 初始振动值
    surfaceRoughness: number,       // 当前表面粗糙度
    initialSurfaceRoughness: number, // 初始表面粗糙度
    chipForm: string,               // 切屑形态
    cuttingForce: { increase: number }, // 切削力增加百分比

    // 通用磨损参数
    vibration: number,
    temperature: number,
    noise: { type: string },
    debris: { level: string, type: string }
  }
})
```

## 输出格式

```javascript
{
  success: true,
  componentId: "BELT-001",
  componentType: "belt",
  beltType: "V Belt",
  timestamp: "2026-04-15T10:30:00.000Z",

  healthScore: 75,
  healthStatus: "fair",

  defects: [
    {
      type: "significant_wear",
      severity: "warning",
      description: "皮带磨损明显，厚度6.2mm"
    }
  ],

  remainingLife: {
    months: 4,
    confidence: "medium"
  },

  recommendations: [
    "准备更换皮带，建议本月内更换"
  ],

  wearPatterns: [
    { pattern: "normal", confidence: 0.9 }
  ]
}
```

## 健康评分标准

| 评分范围 | 健康状态 | 说明 |
|----------|----------|------|
| 80-100 | good | 状态正常，可继续使用 |
| 60-79 | fair | 有轻微磨损，关注监测 |
| 40-59 | poor | 磨损明显，需要准备更换 |
| 0-39 | critical | 磨损严重，立即更换 |

## 皮带标准

### V Belt (三角带)

| 参数 | 标准值 |
|------|--------|
| 新厚度 | ≥8mm |
| 正常磨损率 | 0.5mm/年 |
| 最大磨损率 | 1.0mm/年 |
| 更换阈值 | 原厚度70% |
| 正常张力 | 400-600N |

### Timing Belt (同步带)

| 参数 | 标准值 |
|------|--------|
| 新厚度 | ≥4mm |
| 齿高 | ≥2.5mm |
| 更换阈值 | 原厚度60% |

## 刀具标准

### cuttingTool (切削刀具)

| 参数 | 阈值 |
|------|------|
| 变钝阈值 | 0.15mm |
| 崩刃阈值 | 0.5mm |
| 振动增加限值 | 15% |
| 表面粗糙度增加限值 | 20% |

## 使用示例

### 示例1: 皮带磨损检测

```javascript
const { wearDetector } = require('./wear-detector');

const result = wearDetector({
  componentId: 'CONVEYOR-BELT-001',
  componentType: 'belt',
  componentSubType: 'V Belt',
  parameters: {
    age: 24,                  // 运行24个月
    currentThickness: 6.2,    // 当前厚度
    initialThickness: 9.0,    // 初始厚度
    tension: 450,            // 张力正常
    temperature: 65           // 运行温度
  }
});

console.log(`皮带健康评分: ${result.healthScore}`);
console.log(`剩余寿命: ${result.remainingLife.months}个月`);
console.log(`建议: ${result.recommendations[0]}`);
```

### 示例2: 刀具磨损检测

```javascript
const result = wearDetector({
  componentId: 'MILL-TOOL-001',
  componentType: 'tool',
  componentSubType: 'endMill',
  parameters: {
    age: 150,                    // 运行150小时
    flankWear: 0.12,            // 刃口磨损0.12mm
    vibration: 0.85,            // 当前振动
    initialVibration: 0.65,      // 初始振动
    surfaceRoughness: 1.8,      // 当前粗糙度
    initialSurfaceRoughness: 1.2 // 初始粗糙度
  }
});

console.log(`刀具健康评分: ${result.healthScore}`);
console.log(`剩余寿命: ${result.remainingLife.hours}小时`);
```

### 示例3: 批量检测

```javascript
const { wearDetectorBatch } = require('./wear-detector');

const results = wearDetectorBatch([
  { componentId: 'BELT-001', componentType: 'belt', componentSubType: 'V Belt', parameters: { age: 24, currentThickness: 6.2 } },
  { componentId: 'BELT-002', componentType: 'belt', componentSubType: 'V Belt', parameters: { age: 12, currentThickness: 7.5 } },
  { componentId: 'TOOL-001', componentType: 'tool', componentSubType: 'cuttingTool', parameters: { age: 100, flankWear: 0.08 } }
]);

console.log(`总组件数: ${results.summary.total}`);
console.log(`正常: ${results.summary.healthy}, 需关注: ${results.summary.fair}, 需更换: ${results.summary.poor}`);
```

### 示例4: 监测皮带磨损趋势

```javascript
// 连续监测
const readings = [
  { age: 12, currentThickness: 7.8 },
  { age: 18, currentThickness: 7.2 },
  { age: 24, currentThickness: 6.2 }
];

for (const reading of readings) {
  const result = wearDetector({
    componentId: 'BELT-MONITOR',
    componentType: 'belt',
    componentSubType: 'V Belt',
    parameters: reading
  });
  console.log(`月份${reading.age}: 健康评分=${result.healthScore}`);
}
```

## 错误处理

```javascript
{
  success: false,
  error: {
    code: 'INVALID_INPUT',           // 缺少必填参数
    message: 'componentId is required'
  }
}

// 错误码
// INVALID_INPUT: 缺少必填参数
// INVALID_TYPE: 不支持的组件类型
// PROCESSING_ERROR: 处理过程错误
```
