# Energy Optimizer - 能源优化器

## 描述

综合能源优化技能，整合能源消耗分析、电机能效评估、HVAC优化、照明优化、空压机优化、峰谷调节、新能源集成和碳排放计算等功能。

**版本**: 1.0.0
**合并来源**: energy-saving-optimization, equipment-energy-efficiency, hvac-optimization, lighting-optimization, air-compressor-optimization, peak-shaving, renewable-energy-integration, energy-cost-allocation

## 功能特性

### 支持的分析类型

| 分析类型 | 说明 |
|----------|------|
| comprehensive | 综合能源分析 |
| consumption | 能源消耗分析 |
| motor | 电机能效评估 |
| hvac | HVAC系统优化 |
| lighting | 照明系统优化 |
| compressor | 空压机优化 |
| peak-shaving | 峰谷调节分析 |
| renewable | 新能源集成分析 |
| carbon | 碳排放计算 |

## 输入参数

```javascript
energyOptimizer({
  facilityId: string,              // 必填：设施ID
  analysisType: string,            // 分析类型
  consumptionData: {               // 能源消耗数据
    electricity: { consumption: kWh, cost: 元 },
    gas: { consumption: m³, cost: 元 },
    diesel: { consumption: L, cost: 元 },
    coal: { consumption: kg, cost: 元 }
  },
  equipmentData: {                // 设备数据
    motor: {                      // 电机数据
      power: kW,                  // 额定功率
      current: A,                 // 电流
      voltage: V,                  // 电压
      powerFactor: 0.85,          // 功率因数
      efficiency: 0.92            // 效率
    },
    hvac: {                      // HVAC数据
      chiller: { cop: 5.5, tonnage: 100 },
      airHandler: { power: kW, cfm: airflow },
      temperature: { supply: 6, return: 12 }
    },
    lighting: {                   // 照明数据
      totalPower: kW,
      lumens: total,
      fixtures: [{ type: 'LED', watts: 50 }]
    },
    compressor: {                // 空压机数据
      type: 'variableSpeed',
      power: kW,
      flow: m³/min,
      pressure: bar,
      loadProfile: [{ hour: 0, load: 0.8, demand: 200 }]
    },
    loadProfile: [{              // 负荷曲线
      isPeak: boolean,
      kwh: number,
      demand: kW
    }]
  },
  renewableData: {               // 新能源数据
    solar: { capacity: kW, sunHours: 4.5 },
    wind: { capacity: kW, capacityFactor: 0.3 }
  },
  utilityData: {                 // 公用事业数据
    peakRate: 1.5,
    offPeakRate: 0.5,
    demandCharge: 30,
    gridPrice: 0.5
  },
  optimizationGoals: ['cost-reduction', 'carbon-reduction']
})
```

## 输出格式

```javascript
{
  success: true,
  facilityId: "FACTORY-001",
  analysisType: "comprehensive",
  timestamp: "2026-04-15T10:30:00.000Z",

  analysis: {
    // 能源消耗概览
    consumption: {
      totalKwh: 150000,
      breakdown: {
        electricity: { kwh: 120000, cost: 96000, percentage: "80.0" },
        gas: { kwh: 30000, cost: 15000, percentage: "20.0" }
      },
      totalCost: 111000,
      energyIntensity: 0.45,
      carbonEmissions: 85000
    },

    // 电机分析
    motor: {
      ratedPower: 100,
      inputPower: 105,
      loadFactor: 0.85,
      efficiencyClass: "IE3",
      potentialSavings: 12000,
      recommendations: ["考虑升级到IE4电机"]
    },

    // HVAC分析
    hvac: {
      totalPotentialAnnualSaving: 25000,
      components: [
        { component: "chiller", rating: "good", recommendation: "效率正常" }
      ]
    },

    // 照明分析
    lighting: {
      currentEfficiency: 80,
      totalPotentialAnnualSaving: 8000,
      suggestions: [
        { action: "upgrade_to_led", rating: "high" }
      ]
    },

    // 空压机分析
    compressor: {
      specificPower: 5.8,
      rating: "good",
      potentialAnnualSaving: 5000
    },

    // 峰谷分析
    peakShaving: {
      current: { peakRatio: 45, estimatedDemandCharge: 4500 },
      potential: { annualSaving: 12000 },
      suggestions: ["安装储能系统进行削峰"]
    },

    // 新能源分析
    renewable: {
      total: {
        installationCost: 800000,
        annualSaving: 96000,
        paybackYears: 8.3
      }
    },

    // 碳排放
    carbon: {
      totalEmissions: 85000,
      avoidedEmissions: 15000,
      netEmissions: 70000
    },

    // 综合汇总
    summary: {
      totalCurrentCost: 111000,
      totalPotentialAnnualSaving: 62000,
      recommendations: [
        { area: "motor", potential: 12000 },
        { area: "hvac", potential: 25000 },
        { area: "lighting", potential: 8000 }
      ]
    }
  }
}
```

## 能效等级标准

### 电机效率 (IE标准)

| 等级 | 效率 | 说明 |
|------|------|------|
| IE1 | ≥75% | 标准效率 |
| IE2 | ≥85% | 高效率 |
| IE3 | ≥90% | 优质高效 |
| IE4 | ≥95% | 超优效率 |

### 照明能效 (lm/W)

| 类型 | 最低效率 | 推荐效率 |
|------|----------|----------|
| LED | 100 | 140 |
| 荧光灯 | 70 | 90 |
| HID | 50 | 80 |

### 空压机能效 (kW/(m³/min))

| 类型 | 标准 | 最优 |
|------|------|------|
| 定速 | 6.5 | 6.0 |
| 变频 | 5.5 | 5.0 |
| 离心 | 5.0 | 4.5 |

### HVAC能效

| 设备 | 指标 | 标准 | 优秀 |
|------|------|------|------|
| 冷水机组 | COP | 5.0 | 6.0 |
| 空气处理 | kW/ton | 3.5 | 4.5 |
| VAV | W/cfm | 0.4 | 0.35 |

## 使用示例

### 示例1: 综合能源分析

```javascript
const { energyOptimizer } = require('./energy-optimizer');

const result = await energyOptimizer({
  facilityId: 'FACTORY-001',
  analysisType: 'comprehensive',
  consumptionData: {
    electricity: { consumption: 150000, cost: 120000 },
    gas: { consumption: 30000, cost: 15000 }
  },
  equipmentData: {
    motor: { power: 100, current: 180, voltage: 380, efficiency: 0.92 }
  },
  utilityData: { gridPrice: 0.8 }
});

console.log(`年度节能潜力: ${result.analysis.summary.totalPotentialAnnualSaving}元`);
```

### 示例2: 电机能效评估

```javascript
const result = await energyOptimizer({
  facilityId: 'PLANT-001',
  analysisType: 'motor',
  equipmentData: {
    motor: {
      power: 75,          // 75kW电机
      current: 135,       // 实际电流
      voltage: 380,
      powerFactor: 0.88,
      efficiency: 0.91    // 当前效率
    }
  }
});

console.log(`能效等级: ${result.analysis.efficiencyClass}`);
console.log(`年节能潜力: ${result.analysis.potentialSavings}元`);
```

### 示例3: 峰谷调节分析

```javascript
const result = await energyOptimizer({
  facilityId: 'FACTORY-001',
  analysisType: 'peak-shaving',
  equipmentData: {
    loadProfile: [
      { hour: 0, isPeak: false, kwh: 500, demand: 800 },
      { hour: 12, isPeak: true, kwh: 800, demand: 1200 },
      { hour: 20, isPeak: false, kwh: 400, demand: 700 }
    ]
  },
  utilityData: {
    peakRate: 1.5,
    offPeakRate: 0.5,
    demandCharge: 35
  }
});

console.log(`峰时用电比例: ${result.analysis.current.peakRatio}%`);
console.log(`年节省潜力: ${result.analysis.potential.annualSaving}元`);
```

### 示例4: 新能源集成分析

```javascript
const result = await energyOptimizer({
  facilityId: 'FACTORY-001',
  analysisType: 'renewable',
  renewableData: {
    solar: { capacity: 200 },  // 200kW屋顶光伏
    wind: { capacity: 50 }      // 50kW风机
  },
  utilityData: { gridPrice: 0.8 }
});

console.log(`投资总额: ${result.analysis.total.installationCost}元`);
console.log(`投资回收期: ${result.analysis.total.paybackYears}年`);
```

### 示例5: 碳排放计算

```javascript
const result = await energyOptimizer({
  facilityId: 'FACTORY-001',
  analysisType: 'carbon',
  consumptionData: {
    electricity: { consumption: 200000 },
    gas: { consumption: 50000 }
  },
  renewableData: {
    solar: { capacity: 100 }
  }
});

console.log(`总排放: ${result.analysis.totalEmissions} kg CO2`);
console.log(`净排放: ${result.analysis.netEmissions} kg CO2`);
```

## 错误处理

```javascript
{
  success: false,
  error: {
    code: 'INVALID_INPUT',
    message: 'facilityId is required'
  }
}

// 错误码
// INVALID_INPUT: 缺少必填参数
// INVALID_TYPE: 不支持的分析类型
// PROCESSING_ERROR: 分析过程错误
```
