---
name: bi-report
description: BI报表设计与配置技能。帮助设计BI报表和Dashboard，包括Tableau、PowerBI、Superset等工具。
whenToUse: "BI报表、Dashboard、数据看板、BI配置"
---

# bi-report

## 功能说明
帮助设计和配置BI报表和Dashboard，实现数据可视化。

---

## 假设声明（Assumptions）

1. **数据源可用**：BI工具能连接到目标数据源
2. **数据已准备好**：数据经过清洗和预处理
3. **指标定义清晰**：每个指标的计算逻辑已确认
4. **用户需求明确**：报表受众和使用场景已确定
5. **工具可用**：有Tableau/PowerBI/Superset等工具许可
6. **发布环境就绪**：有服务器部署报表或共享链接

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
【报表设计】
- 页面结构
- 图表配置
- 筛选器设置
- 交互设计

【技术实现】
- 数据源连接
- 数据模型
- 计算字段
- 性能优化

【部署方案】
- 发布设置
- 权限配置
- 订阅计划
```

---

## 详细工作流程（Detailed Workflow）

### 第一阶段：需求分析
1. **明确报表目标**
   - 解决什么问题
   - 服务于哪些决策
   - 关键用户是谁

2. **收集指标需求**
   - 核心指标（必须有）
   - 辅助指标（可选）
   - 异常监控指标

3. **确定数据源**
   - 识别数据来源
   - 评估数据质量
   - 确认刷新方式

4. **选择BI工具**
   - 企业级BI：Tableau/PowerBI
   - 开源方案：Superset/Metabase
   - 嵌入式：Grafana/ECharts

**检查点**：需求文档确认

### 第二阶段：报表设计
5. **页面结构设计**
   - 分层展示（总览→详情）
   - 布局规划（仪表盘风格/报告风格）
   - 信息密度控制

6. **图表选择**
   - KPI卡片：数字+趋势
   - 对比分析：柱状图/条形图
   - 趋势展示：折线图
   - 构成分析：饼图/树图/环形图
   - 分布分析：直方图/箱线图
   - 关系分析：散点图/热力图

7. **交互设计**
   - 筛选器设置
   - 点击下钻
   - 页面联动
   - 参数传递

### 第三阶段：配置实现
8. **数据连接**
   - 配置数据源连接
   - 设置认证方式
   - 测试连接

9. **数据模型**
   - 创建关联（JOIN）
   - 定义度量值
   - 创建计算字段

10. **可视化配置**
    - 选择图表类型
    - 拖拽字段配置
    - 设置格式和样式

11. **筛选器配置**
    - 时间筛选
    - 维度筛选
    - 筛选器联动

### 第四阶段：测试优化
12. **功能测试**
    - 数据正确性验证
    - 交互功能验证
    - 跨浏览器测试

13. **性能优化**
    - 优化数据提取
    - 使用数据提取/缓存
    - 减少实时查询

14. **发布部署**
    - 配置发布设置
    - 设置访问权限
    - 配置订阅计划

---

## Dashboard框架示例

```
┌─────────────────────────────────────────────────────────────┐
│  【总览】业务数据 Dashboard           刷新时间: 10:30 │ 最后更新 │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│  DAU        │  新增用户   │  付费率     │  ARPU           │
│  22万 ↑5%   │  1.5万 ↑12% │  4.5% ↑0.3% │  28元 ↑8%       │
├─────────────┴─────────────┴─────────────┴─────────────────┤
│                    【趋势图】                               │
│  折线图：DAU 7日/30日趋势                                   │
├───────────────────────────────┬───────────────────────────┤
│   【用户来源】                 │   【留存情况】             │
│   饼图：渠道占比               │   漏斗图：留存率            │
├───────────────────────────────┴───────────────────────────┤
│   【Top功能使用】              │   【实时监控】             │
│   柱状图：功能使用次数排行       │   列表：最新活跃用户       │
└───────────────────────────────┴───────────────────────────┘
```

---

## 常用指标计算SQL

### DAU（D日活跃用户）
```sql
SELECT COUNT(DISTINCT user_id)
FROM user_logs
WHERE DATE(created_at) = CURDATE();
```

### DAU 7日均值
```sql
SELECT AVG(dau) FROM (
    SELECT DATE(created_at) as dt,
           COUNT(DISTINCT user_id) as dau
    FROM user_logs
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(created_at)
) t;
```

### 新增用户
```sql
SELECT COUNT(DISTINCT user_id)
FROM users
WHERE DATE(created_at) = CURDATE();
```

### 次n日留存
```sql
WITH first_login AS (
    SELECT user_id,
           DATE(MIN(created_at)) as first_date
    FROM user_logs
    GROUP BY user_id
)
SELECT
    DATEDIFF(t.date, f.first_date) as day_diff,
    COUNT(DISTINCT t.user_id) as retained_users,
    COUNT(DISTINCT t.user_id) * 100.0 /
        (SELECT COUNT(*) FROM first_login) as retention_rate
FROM user_logs t
JOIN first_login f ON t.user_id = f.user_id
WHERE DATEDIFF(t.date, f.first_date) IN (1, 7, 30)
GROUP BY DATEDIFF(t.date, f.first_date);
```

### 转化率漏斗
```sql
WITH funnel AS (
    SELECT
        '浏览' as stage, COUNT(DISTINCT user_id) as users
        FROM events WHERE action = 'page_view'
    UNION ALL
    SELECT
        '点击' as stage, COUNT(DISTINCT user_id) as users
        FROM events WHERE action = 'click'
    UNION ALL
    SELECT
        '加购' as stage, COUNT(DISTINCT user_id) as users
        FROM events WHERE action = 'add_cart'
    UNION ALL
    SELECT
        '下单' as stage, COUNT(DISTINCT user_id) as users
        FROM events WHERE action = 'order'
    UNION ALL
    SELECT
        '支付' as stage, COUNT(DISTINCT user_id) as users
        FROM events WHERE action = 'payment'
)
SELECT
    stage,
    users,
    LAG(users) OVER (ORDER BY
        CASE stage
            WHEN '浏览' THEN 1 WHEN '点击' THEN 2
            WHEN '加购' THEN 3 WHEN '下单' THEN 4 WHEN '支付' THEN 5
        END) as last_stage,
    ROUND(users * 100.0 /
        LAG(users) OVER (ORDER BY
            CASE stage
                WHEN '浏览' THEN 1 WHEN '点击' THEN 2
                WHEN '加购' THEN 3 WHEN '下单' THEN 4 WHEN '支付' THEN 5
            END), 2) as conversion_rate
FROM funnel;
```

---

## 边界情况（Edge Cases）

### 数据问题
- **数据延迟**：标注刷新时间和数据截止时间
- **数据缺失**：显示"暂无数据"或灰度处理
- **异常值**：使用参考线标注或过滤

### 性能问题
- **加载慢**：使用数据提取/缓存，减少实时查询
- **大数据量**：预聚合数据，使用抽样
- **超时**：优化SQL，增加超时配置

### 交互问题
- **筛选无效**：检查筛选器关联配置
- **下钻错误**：检查钻取层级配置
- **联动失败**：检查图表关联设置

---

## 错误处理（Error Handling）

| 问题类型 | 可能原因 | 处理方式 |
|---------|---------|---------|
| 数据加载失败 | 数据源断开/查询超时 | 配置告警，检查连接 |
| 图表显示异常 | 字段配置错误/数据类型不匹配 | 修正字段映射 |
| 性能卡顿 | 查询太慢/数据量大 | 优化查询，使用缓存 |
| 发布失败 | 权限不足/名称冲突 | 检查权限，重命名 |

---

## 质量验证清单（Quality Checklist）

- [ ] 数据源连接正常
- [ ] 指标计算逻辑正确
- [ ] 图表类型选择合适
- [ ] 数据与图表一致
- [ ] 筛选器功能正常
- [ ] 下钻联动正常
- [ ] 布局美观整齐
- [ ] 加载性能可接受
- [ ] 权限配置正确
- [ ] 发布后监控正常

---

## 多个示例（Multiple Examples）

### 典型案例

**场景**：搭建用户分析Dashboard

**设计思路**：
```
【页面结构】
1. 总览页 - 核心KPI卡片 + 趋势图
2. 用户画像 - 分布分析
3. 用户行为 - 漏斗分析
4. 用户价值 - RFM分层

【核心指标】
- DAU/WAU/MAU
- 新增用户数
- 次日/7日/30日留存率
- 用户生命周期价值
```

**Tableau配置示例**：
```
// 创建DAU计算字段
IF [Date] = TODAY() THEN [User ID] END

// 创建留存率计算
SUM([Retained Users]) / SUM([Total New Users])

// 创建RFM分层
IF [Recency] <= 7 AND [Frequency] >= 5 AND [Monetary] >= 1000 THEN "高价值"
ELSEIF [Recency] <= 30 AND [Frequency] >= 2 THEN "潜力用户"
ELSE "普通用户" END
```

---

### 边界/异常案例

**场景**：报表数据与业务系统数据不一致

**问题发现**：Dashboard显示的DAU比业务系统少10%

**排查过程**：
```python
def debug_data_discrepancy():
    """排查数据差异"""

    # 1. 时间戳差异
    # Dashboard用UTC时间，业务系统用本地时间
    # 解决方案：统一时区

    # 2. 用户定义差异
    # Dashboard按user_id去重，业务系统按设备ID去重
    # 解决方案：明确用户定义

    # 3. 数据同步延迟
    # 数据仓库T+1更新，当天数据不完整
    # 解决方案：标注数据截止时间

    # 4. 数据源差异
    # 两个系统从不同表取数
    # 解决方案：统一数据源

    return {
        'root_cause': '时区不一致',
        'impact': '约10%数据差异',
        'fix': '统一使用北京时间'
    }
```

**处理**：
```sql
-- 修改SQL，统一时区
SELECT
    COUNT(DISTINCT user_id)
FROM user_logs
WHERE DATE(created_at AT TIME ZONE 'Asia/Shanghai') = CURRENT_DATE;
```

---

### 失败案例及修正

**场景**：Dashboard上线后没人用

**问题**：
1. 指标太专业，业务看不懂
2. 缺少筛选器，无法查看明细
3. 数据更新太慢（T+2）

**修正方案**：
```python
# 修正1：增加业务友好指标
- 把"DAU"改名为"今日活跃用户"
- 把"次留"改名为"明天还来的用户占比"

# 修正2：增加交互功能
- 添加时间筛选器（可选择任意时间段）
- 添加地区/渠道筛选
- 添加导出Excel功能

# 修正3：提高数据时效性
- 迁移到实时数据源
- 设置每小时自动刷新
- 标注"数据更新于XX:XX"
```

---

## BI工具选择建议

| 场景 | 推荐工具 | 理由 |
|------|---------|------|
| 企业级BI | PowerBI/Tableau | 功能强大，企业支持 |
| 开源方案 | Superset/Metabase | 免费，可自部署 |
| 简单报表 | Excel/Google Sheets | 门槛低，快速上手 |
| 嵌入应用 | Grafana/ECharts | 轻量，易集成 |
| 大数据BI | Looker/TABLEAU CRM | 支持大规模数据 |

---

## 性能优化指南

### 数据层优化
```sql
-- 创建汇总表加速查询
CREATE TABLE agg_daily_stats AS
SELECT
    DATE(created_at) as stat_date,
    COUNT(DISTINCT user_id) as dau,
    COUNT(DISTINCT CASE WHEN is_new = 1 THEN user_id END) as new_users
FROM user_logs
GROUP BY DATE(created_at);
```

### BI工具优化
```
1. 使用数据提取（Data Extract）
   - 对大表启用抽取模式
   - 设置增量刷新

2. 优化查询
   - 减少实时连接的数据量
   - 使用筛选器减少数据范围

3. 图表优化
   - 避免过度渲染
   - 限制返回数据点数量
```

---

## FAQ（常见问题）

**Q1：如何让业务团队自行查看报表而不用IT支持？**
A：选择自助式BI工具（如PowerBI/Tableau）；预先做好数据模型；提供简单培训；建立报表使用指南。

**Q2：Dashboard数据量大加载慢怎么办？**
A：使用数据抽取/缓存；预计算汇总表；对历史数据归档；优化SQL查询；限制同时打开的图表数量。

**Q3：如何保证数据一致性？**
A：建立统一的指标定义；在BI工具中建立公共数据源；所有报表使用同一数据模型；定期校验数据。

**Q4：报表需要多少刷新频率？**
A：根据业务需求定：实时监控用实时；运营日报用每小时；管理报表用每天。避免过度刷新浪费资源。

**Q5：如何控制报表访问权限？**
A：根据角色设置行级权限；敏感数据脱敏；定期审计权限；离职人员及时收回权限。

---

## 与其他技能的关联（Cross-skill References）

- **sql-query**：BI报表依赖SQL查询获取数据
- **data-analyst**：BI报表是分析成果的展示
- **chart-designer**：图表设计遵循可视化原则
- **data-viz-story**：BI汇报可遵循故事框架
- **report-generator**：BI报表是报告的一种形式
- **data-dict**：报表指标定义参考数据字典
- **data-cleaner**：BI数据需要清洗
