---
name: sql-query
description: SQL查询编写与优化技能。帮助编写复杂的SQL查询，进行数据提取和分析优化。
whenToUse: "SQL查询、数据提取、数据库查询、SQL优化"
---

# sql-query

## 功能说明
帮助编写复杂的SQL查询，支持数据分析、报表生成等需求。

---

## 假设声明（Assumptions）

1. **数据库环境已知**：MySQL/PostgreSQL/SQL Server/BigQuery等
2. **表结构可获取**：可通过 DESCRIBE 或 INFORMATION_SCHEMA 了解表结构
3. **查询权限充足**：有读取所需表/视图的权限
4. **数据量可控**：查询结果在可接受范围内（不会OOM）
5. **性能基准合理**：复杂查询在可接受时间内完成（<30秒）
6. **数据质量已知**：对源数据质量有基本了解

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
【性能要求】查询时间限制（如有）
```

### 标准输出格式

```sql
【SQL查询】
-- 注释：解释查询逻辑

SELECT
    字段列表
FROM 表名
WHERE 条件
GROUP BY 字段
HAVING 分组后条件
ORDER BY 字段
LIMIT 数量;

【查询说明】
- 时间复杂度：O(n)
- 适用场景：xxx
- 注意事项：xxx
【性能建议】（如适用）
```

---

## 详细工作流程（Detailed Workflow）

### 第一阶段：需求理解
1. **明确查询目标**
   - 需要哪些字段
   - 数据的时间范围
   - 筛选和过滤条件
   - 是否需要去重

2. **识别数据源**
   - 确定主表
   - 识别关联表
   - 确认需要的JOIN类型

3. **分析数据关系**
   - 一对一 / 一对多 / 多对多
   - 关联键选择
   - 处理多表关联的顺序

**检查点**：能画出ER关系草图

### 第二阶段：查询编写
4. **构建基础查询**
   - SELECT 字段列表
   - FROM 主表
   - 逐步添加 JOIN

5. **添加筛选条件**
   - WHERE 子句
   - 日期范围筛选
   - 空值处理

6. **聚合与分组**
   - GROUP BY 维度
   - 聚合函数选择
   - HAVING 条件

7. **排序与限制**
   - ORDER BY 规则
   - LIMIT/TOP 限制

### 第三阶段：优化与验证
8. **性能优化**
   - 检查索引使用情况
   - 避免全表扫描
   - 优化 JOIN 顺序
   - 减少子查询嵌套

9. **结果验证**
   - 数据抽样核对
   - 边界条件测试
   - 空值处理验证

10. **SQL兼容性检查**
    - 确认数据库类型
    - 调整语法差异
    - 测试函数兼容性

---

## 边界情况（Edge Cases）

### 输入为空的情况
- **表无数据**：返回空结果集，而非报错
- **关联键全空**：使用 LEFT JOIN 确保主表数据保留
- **筛选条件无匹配**：明确返回0条记录

### 输入格式错误的情况
- **字段名拼写错误**：使用反引号或双引号包裹
- **日期格式不统一**：统一使用 DATE 或 TIMESTAMP 转换
- **数值类型不匹配**：使用 CAST 或 CONVERT 转换

### 特殊情况处理
- **大数据量查询**：使用分页或采样
- **多次 UNION**：统一字段顺序和类型
- **复杂嵌套**：使用 CTE (WITH) 提高可读性
- **动态条件**：使用 COALESCE 或 IFNULL 处理

---

## 错误处理（Error Handling）

| 错误类型 | 可能原因 | 处理方式 |
|---------|---------|---------|
| 语法错误 | 关键字拼写、缺少括号 | 逐行检查语法 |
| 表不存在 | 库名/表名错误 | 确认完整表名字 |
| 字段不存在 | 别名冲突或拼写错误 | 用表前缀限定 |
| 类型不匹配 | JOIN 条件类型不一致 | CAST 转换 |
| 内存溢出 | 结果集过大 | 添加 LIMIT |
| 超时 | 查询过于复杂 | 优化执行计划 |

---

## 质量验证清单（Quality Checklist）

- [ ] SELECT 字段明确，无 SELECT *
- [ ] JOIN 条件完整，无笛卡尔积风险
- [ ] WHERE 条件充分，减少扫描范围
- [ ] 聚合函数使用正确
- [ ] GROUP BY 包含所有非聚合字段
- [ ] 使用 LIMIT 限制结果量
- [ ] 考虑到空值情况
- [ ] 性能可接受（有索引支持）
- [ ] 结果可解释，符合业务逻辑
- [ ] 跨数据库兼容（如需要）

---

## 多个示例（Multiple Examples）

### 典型案例

**场景**：统计每个用户最近30天购买金额

```sql
SELECT
    u.user_id,
    u.name,
    u.user_type,
    SUM(o.amount) AS total_amount,
    COUNT(o.order_id) AS order_count,
    AVG(o.amount) AS avg_order_amount
FROM users u
LEFT JOIN orders o
    ON u.user_id = o.user_id
    AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    AND o.status = 'completed'  -- 只统计已支付订单
GROUP BY u.user_id, u.name, u.user_type
ORDER BY total_amount DESC
LIMIT 100;
```

---

### 边界/异常案例

**场景**：处理用户首次购买和从未购买的情况

```sql
-- 使用 CASE 和聚合函数处理边界
SELECT
    u.user_id,
    u.name,
    COUNT(o.order_id) AS order_count,
    CASE
        WHEN COUNT(o.order_id) = 0 THEN '从未购买'
        WHEN COUNT(o.order_id) = 1 THEN '新用户'
        ELSE '回头客'
    END AS user_category,
    MIN(o.created_at) AS first_purchase_date,
    MAX(o.created_at) AS last_purchase_date
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE u.status = 'active'
GROUP BY u.user_id, u.name
HAVING COUNT(o.order_id) > 0  -- 排除从未购买用户
ORDER BY last_purchase_date DESC;
```

---

### 失败案例及修正

**场景**：用户留存分析，原SQL运行超时

**原问题查询**：
```sql
-- 问题：子查询在主表每行都执行一次，大数据量极慢
SELECT
    u.user_id,
    (SELECT COUNT(*) FROM orders WHERE user_id = u.user_id) AS order_count
FROM users u;
```

**修正方案**：
```sql
-- 使用 JOIN 和 GROUP BY 一次完成
SELECT
    u.user_id,
    COUNT(o.order_id) AS order_count
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id;
```

---

## 常用模式速查

### 用户留存分析
```sql
WITH first_order AS (
    SELECT
        user_id,
        MIN(DATE(created_at)) AS first_date
    FROM orders
    GROUP BY user_id
),
user_activity AS (
    SELECT
        f.user_id,
        f.first_date,
        DATEDIFF(o.created_at, f.first_date) AS days_diff
    FROM orders o
    JOIN first_order f ON o.user_id = f.user_id
)
SELECT
    days_diff,
    COUNT(DISTINCT user_id) AS users,
    COUNT(DISTINCT user_id) * 100.0 /
        (SELECT COUNT(DISTINCT user_id) FROM first_order) AS retention_rate
FROM user_activity
WHERE days_diff IN (0, 7, 14, 30)
GROUP BY days_diff;
```

### 同比环比分析
```sql
SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    SUM(amount) AS monthly_amount,
    LAG(SUM(amount)) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) AS last_month,
    SUM(amount) - LAG(SUM(amount)) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) AS mom_diff,
    ROUND((SUM(amount) - LAG(SUM(amount)) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m'))) /
        LAG(SUM(amount)) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) * 100, 2) AS mom_rate
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY month;
```

### 漏斗分析
```sql
WITH funnel AS (
    SELECT
        '浏览' AS stage,
        COUNT(DISTINCT user_id) AS users
        FROM user_actions WHERE action = 'page_view'
    UNION ALL
    SELECT
        '加购' AS stage,
        COUNT(DISTINCT user_id) AS users
        FROM user_actions WHERE action = 'add_cart'
    UNION ALL
    SELECT
        '下单' AS stage,
        COUNT(DISTINCT user_id) AS users
        FROM user_actions WHERE action = 'order'
    UNION ALL
    SELECT
        '支付' AS stage,
        COUNT(DISTINCT user_id) AS users
        FROM user_actions WHERE action = 'payment'
)
SELECT
    stage,
    users,
    LAG(users) OVER (ORDER BY
        CASE stage
            WHEN '浏览' THEN 1
            WHEN '加购' THEN 2
            WHEN '下单' THEN 3
            WHEN '支付' THEN 4
        END) AS last_stage_users,
    ROUND(users * 100.0 / LAG(users) OVER (ORDER BY
        CASE stage
            WHEN '浏览' THEN 1
            WHEN '加购' THEN 2
            WHEN '下单' THEN 3
            WHEN '支付' THEN 4
        END), 2) AS conversion_rate
FROM funnel;
```

### 分位数统计
```sql
SELECT
    product_category,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount) AS median_amount,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY amount) AS q1_amount,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY amount) AS q3_amount
FROM orders
GROUP BY product_category;
```

---

## 优化建议

### 索引优化
- 确保 JOIN 和 WHERE 条件字段有索引
- 避免在索引列上使用函数
- 组合索引注意字段顺序

### 查询优化
```sql
-- 避免 SELECT *
SELECT order_id, user_id, amount FROM orders;

-- 使用 LIMIT 限制结果
LIMIT 1000;

-- 分页查询优化
-- 低效：
SELECT * FROM orders LIMIT 10000, 20;
-- 高效（使用游标）：
SELECT * FROM orders WHERE order_id > 10000 LIMIT 20;
```

### 数据库特定优化
```sql
-- MySQL: 添加提示优化
SELECT * FROM orders FORCE INDEX (idx_user_date) WHERE ...

-- PostgreSQL: 使用 EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT ...

-- BigQuery: 限制扫描范围
SELECT * FROM table WHERE _PARTITIONDATE = '2024-01-01';
```

---

## FAQ（常见问题）

**Q1：JOIN 和 LEFT JOIN 有什么区别？**
A：JOIN (INNER JOIN) 只返回两表都匹配的行；LEFT JOIN 返回左表所有记录，右表无匹配时返回 NULL。选择依据是是否需要保留左表全部数据。

**Q2：如何处理大数据量的查询？**
A：添加分页、使用分区表、避免 SELECT *、在 WHERE 中限定范围、考虑采样或在ETL层预处理。

**Q3：子查询和 CTE 哪个更好？**
A：CTE (WITH) 可读性更好，适合复杂逻辑；子查询适合简单场景；两者性能相近，数据库通常会优化为相同执行计划。

**Q4：如何判断查询性能问题？**
A：使用 EXPLAIN/EXPLAIN ANALYZE 查看执行计划，关注全表扫描(Scan)、嵌套循环(Nested Loop)、排序(Sort)等关键操作。

**Q5：UNION 和 UNION ALL 怎么选？**
A：UNION 会去重，性能较慢；UNION ALL 不去重，性能更快。只有确实需要去重时才用 UNION。

---

## 与其他技能的关联（Cross-skill References）

- **data-analyst**：SQL是数据提取的主要手段
- **data-cleaner**：清洗后的数据需要重新查询验证
- **data-dict**：了解表结构是写SQL的前提
- **bi-report**：BI工具底层依赖SQL查询
- **report-generator**：报告数据通过SQL获取
- **data-migrate**：数据迁移涉及SQL转换
