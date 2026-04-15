# Lubrication Advisory - 技能设计文档

## 技能定义

**技能名称**: lubrication-advisory
**技能类型**: 制造业设备维护咨询技能
**核心功能**: 根据设备运行状态推荐最佳润滑方案

## 输入schema

```typescript
interface LubricationInput {
  equipmentType: string;        // 设备类型: bearing, gearbox, hydraulic, compressor, motor, chain
  operatingEnvironment: string;  // 运行环境: high-temp, normal, humid, corrosive
  operatingHours: number;       // 累计运行小时数
  loadCondition?: string;       // 负载条件: light, medium, heavy, shock (默认medium)
  temperature?: number;         // 工作温度(°C), 默认基于环境估算
}
```

## 输出schema

```typescript
interface LubricationOutput {
  recommendedOilType: string;    // 推荐润滑油类型代码
  oilGrade: string;            // ISO粘度等级
  baseInterval: number;        // 基础润滑周期(小时)
  adjustedInterval: number;    // 调整后润滑周期(小时)
  intervalUnit: string;        // 周期单位
  oilAmount: {
    value: number;              // 润滑量
    unit: string;              // 单位
  };
  viscosityRecommendation: string;  // 粘度建议
  recommendations: string[];   // 额外建议列表
  nextLubricationDate: string; // 下次润滑日期 (ISO格式)
  confidence: number;          // 置信度 0-1
}
```

## 核心算法逻辑

### 1. 油品选择算法

根据设备类型和运行环境确定基础油品和粘度等级：

| 设备类型 | 基础油品 | 基础粘度 |
|----------|----------|----------|
| bearing | mineral | VG32-VG100 |
| gearbox | synthetic | VG68-VG320 |
| hydraulic | hydraulic-oil | VG32-VG68 |
| compressor | compressor-oil | VG68-VG100 |
| motor | bearing-grease | NLGI 2 |
| chain | chain-oil | VG22-VG68 |

### 2. 环境调整系数

| 运行环境 | 温度范围 | 粘度调整 | 周期调整 |
|----------|----------|----------|----------|
| high-temp | >40°C | +1 grade | ×0.7 |
| normal | 0-40°C | 0 | ×1.0 |
| humid | any | +0 grade | ×0.85 |
| corrosive | any | synthetic | ×0.6 |

### 3. 负载调整系数

| 负载条件 | 系数 |
|----------|------|
| light | ×1.2 |
| medium | ×1.0 |
| heavy | ×0.8 |
| shock | ×0.6 |

### 4. 运行时间调整

根据累计运行小时数计算油品老化程度：
- 0-5000h: 新油状态，周期正常
- 5000-10000h: 轻微老化，周期×0.9
- 10000-20000h: 中度老化，周期×0.8
- >20000h: 严重老化，建议更换油品

## 误差处理

1. **输入验证错误**: 返回错误码 `INVALID_INPUT` 和具体错误信息
2. **未知设备类型**: 使用通用轴承润滑方案作为默认
3. **未知环境类型**: 使用 normal 环境参数

## 依赖项

无外部依赖，纯JavaScript实现

## 扩展性设计

- 油品数据库支持配置文件扩展
- 环境参数可配置化
- 支持自定义润滑周期计算公式
