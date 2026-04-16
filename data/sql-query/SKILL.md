---
name: sql-query
description: SQL查询编写与优化技能。帮助编写复杂的SQL查询，进行数据提取和分析优化。
whenToUse: "SQL查询、数据提取、数据库查询、SQL优化"
userInvocable: true
triggerPhrases: ["SQL查询", "写SQL", "数据库查询", "SQL优化", "数据提取"]
version: "3.0"
lastUpdated: 2026-04-17
skillLevel: L3
---

# sql-query v3.0

SQL查询编写与优化技能。2026年集成AI自动SQL生成、自然语言查询、性能智能诊断能力。

## 功能说明

帮助编写复杂的SQL查询，支持数据分析、报表生成等需求。

---

## 假设声明（Assumptions）

1. **数据库环境已知**：MySQL/PostgreSQL/SQL Server/BigQuery等
2. **表结构可获取**：可通过 DESCRIBE 了解表结构
3. **查询权限充足**：有读取所需表/视图的权限
4. **数据量可控**：查询结果在可接受范围内

---

## 输入输出（I/O Format）

### 标准输入格式
```
【查询目标】需要获取什么数据
【数据源】表名/视图名/数据库名
【筛选条件】WHERE子句条件
【分组维度】GROUP BY维度
【排序要求】ORDER BY及顺序
【输出限制】LIMIT/TOP
```

### 标准输出格式
```sql
【SQL查询】
-- 注释：解释查询逻辑
SELECT 字段列表
FROM 表名
WHERE 条件
GROUP BY 字段
ORDER BY 字段
LIMIT 数量;

【查询说明】
- 时间复杂度：O(n)
- 适用场景：xxx
- 注意事项：xxx
```

---

## 2026年新功能

### AI智能SQL
| 功能 | 说明 |
|------|------|
| **自然语言查询** | "最近30天销售额" → 自动生成SQL |
| **AI SQL优化** | 自动诊断性能问题并给出优化建议 |
| **智能补全** | 根据上下文智能补全SQL |
| **多数据库适配** | 自动适配不同数据库语法 |

---

## 工作流程（Workflow）

### 第一阶段：需求理解
1. **明确查询目标** - 需要哪些字段、时间范围、筛选条件
2. **识别数据源** - 确定主表、关联表、JION类型

### 第二阶段：查询编写
3. **构建基础查询** - SELECT字段、FROM主表、逐步添加JOIN
4. **添加筛选条件** - WHERE子句、日期范围、空值处理
5. **聚合与分组** - GROUP BY维度、聚合函数选择
6. **排序与限制** - ORDER BY规则、LIMIT限制

### 第三阶段：优化与验证
7. **性能优化** - 检查索引使用、避免全表扫描
8. **结果验证** - 数据抽样核对、边界条件测试

---

## 质量验证清单（Quality Checklist）

- [ ] SELECT 字段明确，无 SELECT *
- [ ] JOIN 条件完整，无笛卡尔积风险
- [ ] WHERE 条件充分，减少扫描范围
- [ ] 使用 LIMIT 限制结果量
- [ ] 考虑到空值情况
- [ ] 性能可接受（有索引支持）

---

## 与其他技能的关联（Cross-skill References）

| 关联技能 | 关联说明 |
|---------|---------|
| data-analyst | SQL是数据提取的主要手段 |
| data-cleaner | 清洗后的数据需要重新查询验证 |
| bi-report | BI工具底层依赖SQL查询 |

---

## 详细内容

- [完整查询模式](references/query-patterns.md)
- [性能优化指南](references/optimization.md)
- [边界情况处理](references/edge-cases.md)
- [典型案例](references/examples.md)

## 更新日志

- v3.0 (2026-04-17)：添加AI自动SQL生成、自然语言查询、性能诊断，实现渐进式披露
- v2.0：添加详细工作流程
- v1.0：初始版本
