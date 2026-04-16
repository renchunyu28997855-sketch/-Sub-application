---
name: bi-report
description: BI报表设计与配置技能。帮助设计BI报表和Dashboard，支持AI智能生成、自然语言查询、智能洞察发现。
whenToUse: "BI报表、Dashboard、数据看板、BI配置、AI报表生成"
userInvocable: true
triggerPhrases: ["BI报表", "Dashboard", "数据看板", "配置BI", "生成报表", "自然语言查询", "智能洞察"]
version: "3.0"
lastUpdated: 2026-04-17
skillLevel: L3
---

# bi-report v3.0

BI报表设计与配置技能。2026年集成AI协作模式，支持自然语言查询、智能洞察发现。

## 功能说明

帮助设计和配置BI报表和Dashboard，实现数据可视化。

---

## 假设声明（Assumptions）

1. **数据源可用**：BI工具能连接到目标数据源
2. **数据已准备好**：数据经过清洗和预处理
3. **指标定义清晰**：每个指标的计算逻辑已确认
4. **用户需求明确**：报表受众和使用场景已确定

---

## 输入输出（I/O Format）

### 标准输入格式

```
【报表类型】管理看板/业务报表/分析报表
【核心指标】需要展示的指标列表
【数据源】数据库/数据仓库/数据文件
【刷新频率】实时/每小时/每天
【受众】管理层/业务运营/技术人员
【工具偏好】Tableau/PowerBI/Superset/其他
```

### 标准输出格式

```
【报表设计】页面结构、图表配置、筛选器设置
【技术实现】数据源连接、数据模型、计算字段
【部署方案】发布设置、权限配置、订阅计划
```

---

## 2026年新功能

### AI协作模式
| 功能 | 说明 |
|------|------|
| AI报表生成 | 输入业务需求，自动生成报表设计方案 |
| 自然语言查询 | 用自然语言提问，AI转换为SQL/图表 |
| 智能洞察 | AI自动分析数据，发现异常和趋势 |

### 工具对比

| 工具 | 适用场景 | AI能力 |
|------|---------|--------|
| PowerBI | 企业级BI | Copilot集成 |
| Tableau | 高端分析 | Einstein Discovery |
| Superset | 开源方案 | 支持NLP接口 |
| Looker | 数据平台 | Looker AI |

---

## 质量验证清单（Quality Checklist）

- [ ] 数据源连接正常
- [ ] 指标计算逻辑正确
- [ ] 图表类型选择合适
- [ ] 筛选器功能正常
- [ ] 加载性能可接受

---

## 详细内容

- [BI工具对比](references/bi-tools.md)
- [仪表盘设计](references/dashboard-design.md)
- [指标定义](references/metrics-definition.md)
- [典型案例](references/examples.md)

---

## 更新日志

- v3.0 (2026-04-17)：AI协作模式、自然语言查询、智能洞察，渐进式披露
- v2.0：完整工作流程、边界情况、错误处理
- v1.0：初始版本