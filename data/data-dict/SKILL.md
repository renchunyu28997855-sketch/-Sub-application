---
name: data-dict
description: 数据字典生成技能。帮助生成数据字典文档，包括字段说明、数据血缘和元数据管理。
whenToUse: "数据字典、元数据、数据治理、数据血缘"
---

# data-dict

## 功能说明
帮助生成和维护数据字典，确保数据定义清晰、可追溯。

---

## 假设声明（Assumptions）

1. **数据库可访问**：能够连接到源数据库
2. **元数据可获取**：INFORMATION_SCHEMA 或类似元数据库可用
3. **业务含义已知**：字段的业务含义有文档或可咨询
4. **更新机制存在**：数据字典有定期更新机制
5. **权限充足**：有读取表结构和注释的权限
6. **命名规范可查**：公司有数据命名规范可参考

---

## 输入输出（I/O Format）

### 标准输入格式

```
【目标范围】单表/多表/整个数据库
【表列表】具体表名（可指定）
【详细程度】概要/详细/完整血缘
【输出格式】Markdown/Excel/HTML/数据库表
【包含内容】字段定义/血缘关系/统计信息
```

### 标准输出格式

```
【数据字典文档】
- 概览信息
- 表结构定义
- 字段详细说明
- 数据血缘图
- 统计信息

【文件格式】
- .md（Markdown格式）
- .xlsx（Excel表格）
- .html（网页版）
- 数据库表（元数据存储）
```

---

## 详细工作流程（Detailed Workflow）

### 第一阶段：信息收集
1. **确定范围**
   - 识别需要生成字典的表
   - 与业务方确认优先级
   - 确定表的所属系统/主题

2. **获取元数据**
   - 从 INFORMATION_SCHEMA 获取字段信息
   - 获取表注释
   - 获取索引信息

3. **收集业务定义**
   - 与业务方沟通字段含义
   - 收集历史文档
   - 确认数据口径

4. **追溯数据血缘**
   - 识别上游数据源
   - 识别下游使用方
   - 标记关键ETL转换逻辑

**检查点**：所需信息收集完整

### 第二阶段：字典编制
5. **基础结构设计**
   - 确定字段收录内容
   - 设计字典模板
   - 确定枚举值格式

6. **逐表编写**
   - 表基本信息（名称、用途、负责人）
   - 字段逐一说明
   - 补充业务规则

7. **血缘标注**
   - 绘制表级血缘
   - 标注字段级血缘
   - 说明数据流向

8. **统计信息补充**
   - 数据量
   - 空值率
   - 唯一值数量

### 第三阶段：审核发布
9. **内容审核**
   - 业务方确认字段定义
   - 技术负责人确认表结构
   - 数据团队确认血缘

10. **格式优化**
    - 排版美化
    - 搜索功能添加（如为在线版）
    - 版本标注

11. **发布分发**
    - 上传到知识库
    - 通知相关方
    - 建立查询入口

### 第四阶段：维护更新
12. **变更追踪**
    - 新增字段需审批
    - 修改字段需通知
    - 删除字段需确认

13. **定期审查**
    - 季度审查不活跃字段
    - 清理废弃字段
    - 更新统计信息

---

## 数据字典模板

### 基础字段模板

| 字段名 | 中文名 | 类型 | 长度 | 允许空 | 默认值 | 说明 | 取值范围/枚举值 | 来源 | 备注 |
|--------|--------|------|------|--------|--------|------|-----------------|------|------|
| user_id | 用户ID | varchar | 32 | N | - | 主键 | - | 用户系统 | - |
| name | 用户姓名 | varchar | 64 | N | - | 用户真实姓名 | - | 用户系统 | 脱敏存储 |
| age | 年龄 | int | - | Y | null | 用户年龄 | 0-150 | 用户注册 | - |
| status | 状态 | tinyint | - | N | 1 | 账户状态 | 1正常 2禁用 3注销 | 用户系统 | - |

### 扩展字段模板（完整版）

| 字段名 | 中文名 | 类型 | 长度 | 允许空 | 默认值 | 说明 | 取值范围 | 来源 | 更新频率 | 数据量级 | 空值率 | 主键 | 索引 | 敏感等级 |
|--------|--------|------|------|--------|--------|------|----------|------|----------|----------|--------|------|------|----------|
| order_id | 订单ID | varchar | 32 | N | - | 订单唯一标识 | - | 订单系统 | 实时 | 1亿+ | 0% | Y | Y | L2 |
| amount | 订单金额 | decimal | 10,2 | N | 0.00 | 订单支付金额 | >=0 | 订单系统 | 实时 | 1亿+ | 0% | N | Y | L1 |

---

## 边界情况（Edge Cases）

### 字段问题
- **无注释的字段**：标记为"待补充"，尽快补充业务定义
- **枚举值不完整**：标注"其他"类，定期维护
- **字段停用**：保留但标记为"已废弃"，避免影响历史数据

### 表问题
- **表无注释**：联系负责人补充，或使用默认描述
- **表已废弃**：保留字典记录但标记为"已归档"
- **表拆分/合并**：记录历史版本，更新血缘

### 血缘问题
- **循环依赖**：标记警告，需重构ETL
- **外部数据源**：标注外部系统来源
- **手工数据**：标注"手工维护"，警惕数据质量

---

## 错误处理（Error Handling）

| 问题类型 | 可能原因 | 处理方式 |
|---------|---------|---------|
| 无法获取注释 | 权限不足/字段无注释 | 联系DBA或标注"待补充" |
| 字段类型不一致 | 多系统数据汇聚 | 统一数据类型 |
| 枚举值缺失 | 新增枚举未更新 | 及时更新字典 |
| 血缘断裂 | 系统重构未同步 | 更新血缘记录 |

---

## 质量验证清单（Quality Checklist）

- [ ] 所有表都有中文注释
- [ ] 所有字段都有中文说明
- [ ] 字段类型和长度准确
- [ ] 枚举值完整且准确
- [ ] 数据血缘清晰可追溯
- [ ] 敏感字段已标注
- [ ] 统计信息已更新
- [ ] 与实际表结构一致
- [ ] 业务方已审核确认
- [ ] 有版本管理和更新记录

---

## 多个示例（Multiple Examples）

### 典型案例

**场景**：为订单中心生成完整数据字典

**步骤1：获取表结构**
```sql
-- 查询MySQL表结构
SELECT
    COLUMN_NAME,
    COLUMN_COMMENT,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_KEY,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'orders'
    AND TABLE_SCHEMA = 'order_center'
ORDER BY ORDINAL_POSITION;
```

**步骤2：获取表统计信息**
```sql
SELECT
    COUNT(*) AS total_rows,
    COUNT(DISTINCT order_id) AS unique_orders,
    COUNT(DISTINCT user_id) AS unique_users,
    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) AS rows_last_7d
FROM orders;
```

**步骤3：生成数据字典**

**orders 订单主表**

| 字段名 | 中文名 | 类型 | 说明 |
|--------|--------|------|------|
| order_id | 订单ID | varchar(32) | 订单唯一标识，主键 |
| user_id | 用户ID | varchar(32) | 下单用户ID |
| merchant_id | 商家ID | varchar(32) | 商家唯一标识 |
| order_no | 订单号 | varchar(64) | 业务订单号，用于外部查询 |
| amount | 订单金额 | decimal(10,2) | 订单总金额，含税 |
| discount_amount | 优惠金额 | decimal(10,2) | 优惠券等优惠金额 |
| pay_amount | 实付金额 | decimal(10,2) | 用户实际支付金额 |
| status | 订单状态 | tinyint | 1待支付2已支付3已取消4已退款5已完成 |
| created_at | 创建时间 | datetime | 订单创建时间 |
| pay_at | 支付时间 | datetime | 订单支付时间 |
| cancel_at | 取消时间 | datetime | 订单取消时间 |

---

### 边界/异常案例

**场景**：遗留系统字段无注释且业务含义不明

**问题**：旧表有50+字段，80%无注释

**处理方案**：
```python
def generate_dict_for_legacy_system(table_name):
    """为遗留系统生成字典"""

    # 1. 基础信息获取
    fields = get_table_structure(table_name)

    # 2. 标注待补充字段
    for field in fields:
        if not field['comment']:
            field['status'] = '待补充'
            field['suggestion'] = '联系原开发者或业务方补充'

    # 3. 尝试通过数据推断含义
    for field in fields:
        if field['status'] == '待补充':
            sample_values = get_sample_values(field['name'])
            if field['name'].endswith('_id'):
                field['推断'] = '可能是外键ID'
            elif field['data_type'] == 'tinyint' and field['max_value'] <= 10:
                field['推断'] = f'可能是状态/类型字段，样例值: {sample_values[:5]}'

    # 4. 生成待审核版本
    return generate_pending_dict(fields)
```

---

### 失败案例及修正

**场景**：数据字典与实际表结构不一致

**问题**：线上表新增字段未同步到字典

**修正方案**：
```python
def validate_dict_consistency():
    """验证字典与实际表结构一致性"""

    # 获取字典中定义的字段
    dict_fields = get_fields_from_dict('orders')

    # 获取实际表结构
    actual_fields = get_actual_table_structure('orders')

    # 对比
    dict_field_names = set([f['field_name'] for f in dict_fields])
    actual_field_names = set([f['COLUMN_NAME'] for f in actual_fields])

    # 发现差异
    missing_in_dict = actual_field_names - dict_field_names
    missing_in_table = dict_field_names - actual_field_names

    if missing_in_dict:
        alert(f"线上表有新字段未录入字典: {missing_in_dict}")
    if missing_in_table:
        alert(f"字典中有字段在线上表不存在: {missing_in_table}")

    return {
        'missing_in_dict': missing_in_dict,
        'missing_in_table': missing_in_table
    }
```

---

## 数据血缘模板

### 表级血缘
```
ods.orders 订单原始表
    ↓
dwd.order_detail 订单明细事实表
    ↓
dws.order_stats 订单统计宽表
    ↓
┌─────────────────────────────────────┐
│  应用层                              │
├─────────────────────────────────────┤
│ app.order_recommend 订单推荐         │
│ rpt.order_analysis 订单分析报表      │
│ bi.user_order_view 用户订单视图      │
└─────────────────────────────────────┘
```

### 字段级血缘
```
ods.orders.user_id (来源: 交易系统->MQ->同步)
    ↓
dwd.order_detail.user_id (转换: 统一用户ID格式)
    ↓
dws.order_stats.user_id (聚合: 按用户汇总)
    ↓
bi.user_order_view.user_id (展示: 用户订单查询)
```

---

## 数据血缘查询SQL

### MySQL
```sql
-- 查询表的血缘关系（通过外键）
SELECT
    t1.TABLE_NAME AS from_table,
    kcu.COLUMN_NAME AS from_column,
    kcu2.TABLE_NAME AS to_table,
    kcu2.COLUMN_NAME AS to_column
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS t
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
    ON t.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
    ON t.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu2
    ON rc.UNIQUE_CONSTRAINT_SCHEMA = kcu2.TABLE_SCHEMA
    AND rc.UNIQUE_CONSTRAINT_NAME = kcu2.CONSTRAINT_NAME
WHERE t.CONSTRAINT_TYPE = 'FOREIGN KEY'
    AND t.TABLE_SCHEMA = 'your_database';
```

---

## FAQ（常见问题）

**Q1：数据字典应该谁来维护？**
A：通常由数据团队或DBA统一维护，业务团队负责提供业务定义。使用方有查询权限，变更时需通知相关方。

**Q2：枚举值太多怎么管理？**
A：将枚举值单独管理，建立枚举值映射表。字典中引用枚举表，避免重复维护。

**Q3：如何处理敏感字段？**
A：在字典中标注敏感等级（L1-L4），不同等级有不同访问和使用要求。L1最高敏感需脱敏。

**Q4：微服务架构下血缘如何维护？**
A：使用数据血缘工具（如DataHub、Amundsen）自动采集；或通过API网关记录数据流向。

**Q5：历史表不再使用怎么处理？**
A：标记为"已归档"，保留字典记录但不推荐新业务使用，定期清理物理表。

---

## 与其他技能的关联（Cross-skill References）

- **sql-query**：数据字典信息通过SQL获取
- **data-migrate**：迁移前需了解数据字典
- **data-cleaner**：了解字段定义才能正确清洗
- **data-analyst**：分析前需了解数据含义
- **report-generator**：报告指标定义参考数据字典
- **bi-report**：BI报表字段定义来自数据字典
