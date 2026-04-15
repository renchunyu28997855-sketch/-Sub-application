---
name: report-generator
description: 数据报告自动生成技能。帮助自动生成数据报表，包括Dashboard、周报、月报等。
whenToUse: "数据报告、自动报表、Dashboard、周报月报"
---

# report-generator

## 功能说明
帮助自动生成各类数据报告，提升数据汇报效率。

---

## 假设声明（Assumptions）

1. **数据已准备好**：报告所需数据已清洗完毕
2. **指标定义清晰**：每个指标的计算方式已确认
3. **模板已确定**：报告格式模板已建立
4. **受众明确**：报告的读者角色已确定
5. **时效性要求已知**：实时/每日/每周/每月
6. **工具可用**：Python/Excel/BI工具等

---

## 输入输出（I/O Format）

### 标准输入格式

```
【报告类型】Dashboard/日报/周报/月报/专题报告
【报告周期】时间范围
【数据来源】数据表/接口/文件
【指标清单】需要展示的指标
【模板要求】格式/样式要求
【受众】管理层/业务方/技术团队
```

### 标准输出格式

```
【报告文件】
- 报告内容（HTML/Excel/Word/PDF）
- 数据文件（如有）

【报告结构】
- 摘要
- 核心指标
- 明细分析
- 趋势图表
- 结论建议
```

---

## 详细工作流程（Detailed Workflow）

### 第一阶段：需求确认
1. **明确报告类型**
   - Dashboard：实时监控
   - 日报：每日运营状态
   - 周报：周期性总结
   - 月报：深度分析
   - 专题报告：特定主题

2. **确认指标清单**
   - 核心指标（必须有）
   - 辅助指标（可选）
   - 异常标记指标

3. **确认时间范围**
   - 报表周期
   - 对比期间（同比/环比）
   - 历史数据范围

4. **确认受众和目的**
   - 管理层看重点
   - 业务方关注点
   - 技术团队需求

**检查点**：需求文档确认

### 第二阶段：数据准备
5. **数据提取**
   - SQL/接口获取数据
   - 数据校验
   - 异常数据标记

6. **数据计算**
   - 指标计算
   - 同期/环比计算
   - 排名计算

7. **数据整合**
   - 多数据源合并
   - 格式统一
   - 补充元数据

### 第三阶段：报告生成
8. **选择生成方式**
   - 自动化脚本生成
   - BI工具配置
   - Excel模板填充

9. **内容填充**
   - 核心指标计算
   - 图表生成
   - 文字说明撰写

10. **格式调整**
    - 排版美化
    - 颜色样式统一
    - 导出格式设置

### 第四阶段：质量检查
11. **数据校验**
    - 指标口径核对
    - 数值合理性检查
    - 异常值确认

12. **内容审核**
    - 结论是否准确
    - 建议是否可行
    - 风险是否已说明

13. **发布分发**
    - 报告存档
    - 定时发送设置
    - 分发名单确认

---

## 报告模板

### 日报模板

```
【日期】XXXX年XX月XX日 星期X
【报告人】XXX
【审核人】XXX

━━━━━━━━━━━━━━━━━━━━━━━
【核心数据】
| 指标 | 本日 | 环比 | 同比 |
|------|------|------|------|
| DAU | XX万 | +X% | +X% |
| 新增用户 | X万 | +X% | +X% |
| 付费人数 | X | +X% | +X% |
| GMV | XX万 | +X% | +X% |

【运营情况】
- 正面：
  1. xxx
  2. xxx
- 负面：
  1. xxx

【异常监控】
- [正常] 无异常
- [预警] XX指标异常，原因：xxx

【明日计划】
1. xxx
2. xxx
━━━━━━━━━━━━━━━━━━━━━━━
```

### 周报模板

```
【周期】XXXX年XX月XX日 ~ XX月XX日（第X周）
【报告人】XXX

━━━━━━━━━━━━━━━━━━━━━━━
【业务概览】
本周核心指标表现及主要变化

【核心数据】
| 指标 | 本周 | 上周 | 环比 | 完成率 |
|------|------|------|------|--------|
| DAU均值 | XX万 | XX万 | +X% | XX% |
| 新增用户 | X万 | X万 | +X% | XX% |
| 留存率 | XX% | XX% | +Xpp | - |
| GMV | XX万 | XX万 | +X% | XX% |

【本周亮点】
1. xxx
2. xxx

【问题分析】
1. xxx（原因+影响+建议）

【下周计划】
| 事项 | 负责人 | 截止日期 |
|------|--------|----------|
| xxx | xxx | X月X日 |

【数据附录】
- 详细数据表链接
- 异常说明
━━━━━━━━━━━━━━━━━━━━━━━
```

### 月报模板

```
【周期】XXXX年XX月
【报告人】XXX
【发布日期】XXXX年XX月XX日

━━━━━━━━━━━━━━━━━━━━━━━
【执行摘要】
一页总结：目标达成情况、核心结论、关键行动

【业绩概览】
- 收入/用户/运营核心指标
- 同比/环比/完成率
- 趋势图表

【目标达成分析】
- 各项目标达成情况
- 差异原因分析

【深度专题】
（如：本月重点分析主题）

【运营分析】
- 用户分析
- 渠道分析
- 产品分析

【竞品动态】
- 主要竞品动向
- 市场趋势

【风险与机会】
- 当前风险
- 潜在机会

【下月计划】
- 目标
- 重点项目
- 资源需求
━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 边界情况（Edge Cases）

### 数据问题
- **数据缺失**：标注"暂无数据"，不阻塞报告生成
- **数据异常**：标注并联系数据负责人核实
- **数据延迟**：标注数据截止时间

### 报告问题
- **指标定义变更**：及时更新并说明
- **对比基数变化**：重新计算历史数据
- **节假日影响**：与业务确认是否需要调整对比

### 发布问题
- **报告超时未发布**：立即启动人工流程
- **报告内容被质疑**：保留数据溯源记录

---

## 错误处理（Error Handling）

| 问题类型 | 可能原因 | 处理方式 |
|---------|---------|---------|
| 数据提取失败 | SQL超时/接口报错 | 启动备选数据源或人工处理 |
| 指标计算错误 | 数据问题/公式bug | 人工复核核心指标 |
| 图表生成失败 | 库问题/数据不支持 | 降级为简单表格 |
| 报告未生成 | 脚本异常 | 保留日志，通知负责人 |

---

## 质量验证清单（Quality Checklist）

- [ ] 报告周期和时间准确
- [ ] 核心指标数据已核实
- [ ] 对比数据（环比/同比）计算正确
- [ ] 图表与数据一致
- [ ] 结论有数据支撑
- [ ] 异常情况已标注说明
- [ ] 排版格式统一
- [ ] 无敏感信息泄露
- [ ] 按时发布/发送
- [ ] 存档备份完成

---

## 多个示例（Multiple Examples）

### 典型案例

**场景**：自动生成运营日报

```python
import pandas as pd
from datetime import datetime, timedelta
import numpy as np

def generate_daily_report(date, data_source):
    """生成每日运营报告"""

    # 1. 获取数据
    df = get_data(date)

    # 2. 计算核心指标
    metrics = {
        '日期': date.strftime('%Y-%m-%d'),
        'DAU': df['user_id'].nunique(),
        '新增用户': df[df['is_new'] == 1]['user_id'].nunique(),
        '活跃会话数': len(df),
        '页面浏览量': df['pageviews'].sum(),
        '付费用户数': df[df['is_paid'] == 1]['user_id'].nunique(),
        'GMV': df['amount'].sum()
    }

    # 3. 获取昨日数据计算环比
    yesterday = (date - timedelta(days=1)).strftime('%Y-%m-%d')
    df_yesterday = get_data(yesterday)

    # 4. 计算环比
    yesterday_metrics = calculate_metrics(df_yesterday)

    # 5. 生成报告
    report = {
        '报告周期': f"{date.strftime('%Y-%m-%d')}",
        '核心指标': []
    }

    for key, value in metrics.items():
        if key == '日期':
            continue
        mom = (value - yesterday_metrics.get(key, 0)) / yesterday_metrics.get(key, 1) * 100
        report['核心指标'].append({
            '指标': key,
            '本期': value,
            '环比': f"{mom:+.1f}%"
        })

    return report

# 发送报告
report = generate_daily_report(datetime.now(), data_source)
send_email(report, recipients=['manager@company.com'])
```

---

### 边界/异常案例

**场景**：报告数据存在明显异常波动

**问题发现**：
```
DAU环比：+45%（异常高）
```

**处理流程**：
```python
def validate_report(report, date):
    """验证报告异常"""

    anomalies = []

    # 检测异常波动
    for metric in report['核心指标']:
        if abs(metric['环比']) > 30:  # 超过30%波动
            anomalies.append({
                '指标': metric['指标'],
                '波动': metric['环比'],
                '严重程度': '高' if abs(metric['环比']) > 50 else '中'
            })

    if anomalies:
        # 暂停自动发送
        pause_auto_send()

        # 通知负责人确认
        send_alert(anomalies)

        # 等待确认或修正
        return {'status': 'pending_review', 'anomalies': anomalies}

    return {'status': 'approved'}
```

---

### 失败案例及修正

**场景**：周报发送后被发现数据错误

**问题**：周GMV数据与业务系统不一致

**原因**：SQL口径与业务系统不一致

**修正方案**：
```python
# 修正后：建立统一的数据口径
DAILY_METRIC_DEFINITION = {
    'GMV': {
        'sql': "SUM(amount) WHERE status IN ('paid', 'completed')",
        'business_def': "所有已支付和已完成订单金额之和",
        '备注': '不含退款订单'
    },
    '用户数': {
        'sql': "COUNT(DISTINCT user_id)",
        'business_def': "去重用户数",
        '备注': '按user_id去重'
    }
}

# 周报脚本增加口径说明
report['数据口径说明'] = DAILY_METRIC_DEFINITION
```

---

## 自动化配置

### 定时任务设置
```bash
# crontab 示例
# 每天早上9点生成前一天的日报
0 9 * * * python /scripts/generate_daily_report.py >> /logs/report.log 2>&1

# 每周一早上9点生成周报
0 9 * * 1 python /scripts/generate_weekly_report.py >> /logs/report.log 2>&1
```

### 邮件发送配置
```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email_report(report, recipients, subject):
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = 'data-report@company.com'
    msg['To'] = ', '.join(recipients)

    # HTML格式报告内容
    html_content = render_report_html(report)
    msg.attach(MIMEText(html_content, 'html'))

    with smtplib.SMTP('smtp.company.com', 587) as server:
        server.starttls()
        server.login('sender@company.com', 'password')
        server.send_message(msg)
```

---

## FAQ（常见问题）

**Q1：如何保证报告数据的一致性？**
A：建立统一的指标定义文档，使用公共的数据计算函数，所有报告使用同一数据源。定期核对不同系统间的数据一致性。

**Q2：报告自动化失败了怎么办？**
A：建立监控告警，失败时自动通知负责人。同时保留手动生成报告的流程作为备份。

**Q3：报告数据量太大加载慢怎么处理？**
A：使用数据预处理和缓存；对历史数据归档；限制查询时间范围；使用增量计算。

**Q4：如何让报告更易于阅读？**
A：控制信息密度，核心数据放前面；使用图表而非表格；关键结论突出显示；保持格式一致性。

**Q5：报告需要存档吗？**
A：是的，所有报告应存档备查。建议按日期命名，结构化存储，保留至少2年的历史报告。

---

## 与其他技能的关联（Cross-skill References）

- **sql-query**：报告数据通过SQL提取
- **data-analyst**：报告是分析成果的输出形式
- **chart-designer**：报告中的图表遵循可视化原则
- **data-viz-story**：报告中的叙事遵循故事化原则
- **bi-report**：BI报表是实时报告的形式
- **data-dict**：报告指标需要有明确定义
