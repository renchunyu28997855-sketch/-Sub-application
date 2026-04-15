---
name: data-migrate
description: 数据迁移方案技能。帮助设计数据迁移方案，包括ETL、实时同步、回滚方案等。
whenToUse: "数据迁移、ETL、数据同步、数据库迁移"
---

# data-migrate

## 功能说明
帮助设计和执行数据迁移方案，确保数据安全、完整。

---

## 假设声明（Assumptions）

1. **源端数据可访问**：源数据库/文件可读取
2. **目标端环境就绪**：目标系统已安装配置
3. **迁移范围明确**：待迁移的表/文件范围已确定
4. **业务窗口确定**：有明确的迁移停机时间窗口
5. **回滚方案已准备**：有完整的回滚预案
6. **权限已申请**：源端、目标端、工具权限均已获取

---

## 输入输出（I/O Format）

### 标准输入格式

```
【迁移类型】全量迁移/增量迁移/实时同步
【源端信息】数据库类型、连接信息、表清单
【目标端信息】数据库类型、连接信息
【迁移范围】表清单、数据量
【迁移窗口】预计开始时间、结束时间
【业务影响】是否停服、影响范围
```

### 标准输出格式

```
【迁移方案】
- 迁移策略
- 实施步骤
- 校验方法
- 回滚方案

【迁移报告】
- 执行记录
- 数据量统计
- 校验结果
- 问题记录
```

---

## 详细工作流程（Detailed Workflow）

### 第一阶段：迁移准备
1. **需求分析**
   - 明确迁移目的
   - 确定迁移范围
   - 评估数据量

2. **环境检查**
   - 源端环境检查
   - 目标端环境检查
   - 网络连通性测试
   - 权限验证

3. **方案设计**
   - 选择迁移方式（全量/增量/实时）
   - 设计ETL逻辑
   - 制定校验方案
   - 准备回滚方案

4. **资源准备**
   - 申请服务器资源
   - 准备数据同步工具
   - 搭建测试环境

**检查点**：方案评审通过

### 第二阶段：全量迁移
5. **数据抽取**
   - 全量数据导出
   - 数据格式转换
   - 数据压缩传输

6. **数据导入**
   - 创建目标表结构
   - 数据批量导入
   - 索引重建
   - 约束验证

7. **初步校验**
   - 数据量对比
   - 抽样数据核对
   - 唯一键校验

### 第三阶段：增量同步
8. **CDC配置**（如需要）
   - 配置变更数据捕获
   - 设置增量日志读取
   - Kafka队列配置

9. **实时同步**
   - 启动增量同步任务
   - 监控同步延迟
   - 处理同步异常

10. **切流准备**
    - 灰度切流验证
    - 数据对比验证
    - 性能基准对比

### 第四阶段：正式切换
11. **业务切换**
    - 停止源端写入
    - 等待增量追平
    - 切换连接地址
    - 验证业务功能

12. **最终校验**
    - 全量数据校验
    - 业务功能验证
    - 性能监控

### 第五阶段：收尾工作
13. **原系统处理**
    - 数据归档
    - 源系统保留观察期
    - 安全下线

14. **文档归档**
    - 迁移记录归档
    - 问题总结
    - 经验沉淀

---

## 迁移方案模板

```
【迁移目标】
将 MySQL 数据迁移到 ClickHouse

【迁移范围】
- orders 表（主订单）: 5000万数据
- order_items 表（订单明细）: 2亿数据
- payments 表（支付记录）: 3000万数据

【迁移方式】
- 全量迁移：先迁移历史数据
- 增量同步：Canal + Kafka 实时同步
- 切割时间：2024-02-01 00:00:00

【实施计划】
1. 准备阶段（1-2天）
   - 环境检查
   - 工具部署
   - 全量导出测试

2. 全量迁移（3-5天）
   - 历史数据导出
   - 数据传输
   - 数据导入
   - 初步校验

3. 增量同步（7天）
   - Canal 配置
   - Kafka 消费
   - ClickHouse 写入
   - 延迟监控

4. 切割切换（1天）
   - 灰度切流 10%
   - 全量切流
   - 功能验证

5. 观察期（7天）
   - 监控告警
   - 问题处理
   - 原系统保留
```

---

## 边界情况（Edge Cases）

### 数据问题
- **数据格式不兼容**：如源端UTF-8，目标端GBK → 统一目标端编码
- **字段类型差异**：如MySQL datetime vs ClickHouse DateTime → 转换映射
- **超长文本**：MySQL text vs ClickHouse String → 评估是否截断

### 性能问题
- **大表迁移慢**：分批迁移，设置合理batch size
- **网络带宽不足**：压缩传输，错峰迁移
- **目标端写入慢**：调整ClickHouse批量写入参数

### 业务问题
- **迁移期间业务写入**：必须停服或使用增量同步
- **迁移失败**：启动回滚，恢复原系统
- **切割点数据不一致**：以源端为准，追平后再切

---

## 错误处理（Error Handling）

| 问题类型 | 可能原因 | 处理方式 |
|---------|---------|---------|
| 导出失败 | 权限不足/磁盘满 | 检查权限，清理磁盘 |
| 数据丢失 | 网络中断/转换丢失 | 重新导出，增加校验 |
| 增量延迟大 | Kafka消费慢/写入慢 | 增加消费者，优化写入 |
| 切流失败 | 配置错误/网络问题 | 回滚原系统，排查问题 |
| 数据不一致 | 增量未追平/转换bug | 暂停切流，修复后重试 |

---

## 质量验证清单（Quality Checklist）

- [ ] 源端和目标端环境检查通过
- [ ] 迁移工具部署完成并测试通过
- [ ] 全量数据迁移完成
- [ ] 全量数据校验通过
- [ ] 增量同步延迟在可接受范围
- [ ] 灰度切流验证通过
- [ ] 全量切流成功
- [ ] 业务功能验证通过
- [ ] 性能指标正常
- [ ] 回滚方案已验证
- [ ] 监控告警已配置
- [ ] 文档已归档

---

## 多个示例（Multiple Examples）

### 典型案例

**场景**：MySQL到ClickHouse全量+增量迁移

**全量导出**：
```bash
# MySQL 全量导出
mysqldump -h localhost -u root -p \
    --single-transaction \
    --quick \
    --lock-tables=false \
    --master-data=2 \
    db_name orders orders_items payments > full_backup.sql

# 数据量大的表单独导出
mysqldump -h localhost -u root -p \
    --single-transaction \
    --quick \
    db_name orders > orders.sql
```

**增量同步（Canal + Kafka）**：
```yaml
# Canal 配置
canal:
  server:
    port: 11111
  instance:
    master.adress: mysqlhost:3306
    binlog.dbs: db_name
    binlog.tables: orders,orders_items,payments
    binlog.position.type: FILE
```

```python
# Kafka 消费写入 ClickHouse
from kafka import KafkaConsumer
from clickhouse_driver import Client

consumer = KafkaConsumer(
    'canal-db-history',
    bootstrap_servers=['kafka:9092'],
    group_id='clickhouse-sink',
    auto_offset_reset='latest'
)

client = Client('clickhouse-host:9000', database='ods')

for message in consumer:
    # 解析 binlog 消息
    data = parse_binlog(message.value)

    if data['type'] == 'INSERT':
        client.execute(
            f"INSERT INTO ods.{data['table']} VALUES",
            [data['values']]
        )
    elif data['type'] == 'UPDATE':
        # 处理更新
        pass
```

**数据校验**：
```sql
-- 数据量对比
SELECT
    'orders' as table_name,
    (SELECT COUNT(*) FROM mysql.orders) as source_count,
    (SELECT COUNT(*) FROM clickhouse.orders) as target_count,
    (SELECT COUNT(*) FROM mysql.orders) -
    (SELECT COUNT(*) FROM clickhouse.orders) as diff

UNION ALL

SELECT
    'order_items',
    (SELECT COUNT(*) FROM mysql.order_items),
    (SELECT COUNT(*) FROM clickhouse.order_items),
    (SELECT COUNT(*) FROM mysql.order_items) -
    (SELECT COUNT(*) FROM clickhouse.order_items);
```

---

### 边界/异常案例

**场景**：迁移过程中发现数据质量问题

**问题**：目标端数据比源端少100条

**排查过程**：
```python
def troubleshoot_data_gap(source_count, target_count, table_name):
    """排查数据差异"""

    if target_count < source_count:
        # 1. 检查是否有唯一键冲突导致写入失败
        failed_keys = query_rejected_records()
        print(f"唯一键冲突: {len(failed_keys)} 条")

        # 2. 检查是否有过期数据被过滤
        # （ClickHouse某些引擎会过滤过期数据）

        # 3. 检查是否数据转换失败
        conversion_errors = query_conversion_errors()
        print(f"转换错误: {len(conversion_errors)} 条")

        # 4. 对比差异数据
        diff_records = find_diff_records(source_table, target_table)
        analyze_diff(diff_records)

    return fix_recommendations
```

**处理方案**：
```python
# 对于唯一键冲突的数据，进行更新而非插入
for record in failed_keys:
    client.execute(
        f"ALTER TABLE {table_name} DELETE WHERE id = {record['id']}"
    )
    client.execute(
        f"INSERT INTO {table_name} VALUES",
        [record['data']]
    )
```

---

### 失败案例及修正

**场景**：切流后发现查询性能严重下降

**问题**：ClickHouse查询比MySQL慢5倍

**原因分析**：
1. 缺少关键索引
2. 分区键选择不当
3. ClickHouse配置未优化

**修正方案**：
```sql
-- 优化1：添加物化视图加速常见查询
CREATE MATERIALIZED VIEW order_stats_mv
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (user_id, created_at)
AS SELECT
    user_id,
    toDate(created_at) as created_date,
    COUNT(*) as order_count,
    SUM(amount) as total_amount
FROM orders
GROUP BY user_id, toDate(created_at);

-- 优化2：调整表引擎参数
ALTER TABLE orders MODIFY SETTING
    index_granularity = 8192,
    merge_with_ttl_timeout = 86400;
```

---

## 迁移工具选择

| 工具 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| mysqldump | 小数据量全量迁移 | 简单，官方自带 | 慢，无增量 |
| Canal + Kafka | MySQL到Kafka实时同步 | 实时性好 | 配置复杂 |
| Debezium | 变更数据捕获 | 支持多数据库 | 学习成本高 |
| DataX | 阿里开源离线同步工具 | 支持多种数据源 | 无实时能力 |
| Flink CDC | 实时同步+计算 | 功能强大 | 资源消耗大 |
| Airbyte | 开源数据集成平台 | 易用性好 | 成熟度一般 |

---

## 回滚方案模板

```
【回滚触发条件】
- 切流后业务错误率上升 > 1%
- 核心指标（如订单量）下跌 > 10%
- 系统P99响应时间 > 5s

【回滚步骤】
1. 停止目标端写入
2. 恢复源端连接
3. 验证源端数据完整性
4. 通知相关团队
5. 持续监控48小时

【回滚时间预估】
- 停止写入：5分钟
- DNS切换：10分钟
- 验证完成：30分钟
- 总计约45分钟

【数据补偿】
- 切流点到回滚点之间的数据
- 从目标端导出增量数据
- 回源后补充写入
```

---

## FAQ（常见问题）

**Q1：全量迁移期间业务如何处理？**
A：通常采用"双写"策略或"停服维护"策略。全量迁移期间禁止写入，迁移完成后增量追平再切流。

**Q2：如何保证迁移后数据一致性？**
A：使用全量校验 + 增量校验双重保障。迁移前后数据量、关键字段值、抽样数据必须完全一致。

**Q3：迁移失败了怎么办？**
A：立即启动回滚方案，恢复原系统。分析失败原因，修复问题后重新迁移。

**Q4：如何减少迁移对业务的影响？**
A：采用"双跑"策略（新旧系统同时运行一段时间）；灰度切流；选择业务低峰期执行。

**Q5：迁移后需要观察多久再下线原系统？**
A：建议观察7-30天，确认无问题后再下线。下线前保留备份。

---

## 与其他技能的关联（Cross-skill References）

- **sql-query**：迁移涉及大量SQL操作
- **data-cleaner**：数据迁移前可能需要清洗
- **data-dict**：迁移需了解表结构定义
- **data-analyst**：迁移后数据质量需要分析验证
- **report-generator**：迁移报告遵循报告规范
