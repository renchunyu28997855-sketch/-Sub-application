# Lubrication Advisory - 润滑指导

## 概述

润滑指导技能根据设备运行状态，推荐最佳润滑方案，帮助企业优化设备维护策略，降低磨损和故障率。

## 功能说明

根据设备类型、运行环境、运行小时数等参数，智能推荐：
- 最佳润滑油类型
- 润滑周期
- 润滑量建议

## 适用设备类型

- 轴承类设备
- 齿轮箱
- 液压系统
- 压缩机
- 电机轴承
- 输送链

## 输入参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| equipmentType | string | 是 | 设备类型 |
| operatingEnvironment | string | 是 | 运行环境（高温/常温/潮湿/腐蚀性） |
| operatingHours | number | 是 | 累计运行小时数 |

## 输出结果

```json
{
  "recommendedOilType": "VG68",
  "oilGrade": "ISO VG 68",
  "lubricationInterval": "2000",
  "intervalUnit": "hours",
  "oilAmount": {
    "value": 50,
    "unit": "ml"
  },
  "recommendations": [
    "建议使用合成润滑油以延长润滑周期",
    "环境温度超过40°C时，应缩短30%的润滑周期"
  ],
  "nextLubricationDate": "2026-05-15"
}
```

## 使用场景

1. 定期维护计划制定
2. 新设备润滑方案配置
3. 设备升级改造后润滑优化
4. 环境变化后的方案调整
