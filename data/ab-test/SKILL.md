---
name: ab-test
description: A/B测试实验设计技能。帮助设计A/B测试方案，计算样本量，确定统计显著性。
whenToUse: "A/B测试、实验设计、转化率优化、数据实验"
---

# ab-test

## 功能说明
帮助设计和分析A/B测试实验，优化产品决策。

---

## 假设声明（Assumptions）

1. **实验可执行**：有足够流量进行实验
2. **用户随机分配**：实验组和对照组用户随机划分
3. **隔离性保证**：同一用户始终看到相同版本
4. **无外部干扰**：实验期间无重大外部事件影响结果
5. **指标可测量**：核心指标可被准确追踪
6. **实验周期足够**：样本量收集完整后再分析

---

## 输入输出（I/O Format）

### 标准输入格式

```
【实验背景】产品/功能背景
【实验假设】要验证的假设
【核心指标】主要评估指标（Primary Metric）
【护栏指标】需监控的辅助指标（Guardrail Metric）
【实验组/对照组】方案描述
【预期效果】最小可检测效应（MDE）
```

### 标准输出格式

```
【实验设计】
- 实验分组方案
- 样本量计算结果
- 实验周期

【数据分析】
- 各组核心指标表现
- 统计显著性检验结果
- 置信区间

【实验结论】
- 实验是否显著
- 建议（全量/调整/终止）
- 风险提示
```

---

## 详细工作流程（Detailed Workflow）

### 第一阶段：实验设计
1. **明确实验假设**
   - 清晰定义问题
   - 设定预期改进方向
   - 确定成功标准

2. **选择核心指标**
   - 北极星指标（主要评估）
   - 护栏指标（不能变差的指标）
   - 辅助指标（参考信息）

3. **定义实验方案**
   - 对照组A：当前方案
   - 实验组B：新方案
   - 实验组C...（如有多方案）

4. **计算样本量**
   - 设定 alpha (通常0.05)
   - 设定 power (通常0.8)
   - 估算baseline转化率
   - 计算MDE（最小可检测效应）

5. **预估实验周期**
   - 日均流量估算
   - 计算达到样本量所需天数
   - 考虑周日均匀性

**检查点**：实验设计通过评审

### 第二阶段：实验执行
6. **流量分配**
   - 确定分流比例（通常50:50）
   - 确保用户ID哈希分流
   - 验证分流均匀性

7. **实验上线**
   - 灰度发布
   - 监控核心指标
   - 记录实验配置

8. **过程监控**
   - 每日检查实验组/对照组流量
   - 监控护栏指标波动
   - 警惕异常波动

### 第三阶段：数据分析
9. **样本量验证**
   - 确认达到最小样本量
   - 检查数据完整性
   - 排除异常数据（如机器人流量）

10. **统计检验**
    - 计算各组指标均值/转化率
    - 进行假设检验（t检验/卡方检验）
    - 计算置信区间
    - 计算p值

11. **效果评估**
    - 核心指标是否显著提升
    - 护栏指标是否稳定
    - 效果量大小

### 第四阶段：结论输出
12. **结论判定**
    - 显著正向：建议全量
    - 显著负向：建议终止
    - 不显著：考虑延长时间或调整方案

13. **后续建议**
    - 下一轮实验方向
    - 工程优化建议
    - 长期监控计划

---

## 边界情况（Edge Cases）

### 实验设计阶段
- **流量不足**：延长实验周期或降低MDE
- **多指标冲突**：设置指标优先级，明确决策规则
- **新奇效应**：设置足够长的冷启动期

### 实验执行阶段
- **实验组效果异常**：检查是否有bug或配置错误
- **外部事件干扰**：记录并分析影响，必要时延长实验
- **样本比例失衡**：检查分流逻辑，修复后重新实验

### 数据分析阶段
- **样本量不足**：延长实验周期或承认统计功效不足
- **结果不显著**：检查假设是否合理，考虑调整方案
- **出现意外结果**：深入分析原因，可能是新的业务发现

---

## 错误处理（Error Handling）

| 问题类型 | 可能原因 | 处理方式 |
|---------|---------|---------|
| 分流不均 | 哈希算法问题 | 修复后重新实验 |
| 效果异常 | 页面bug、监控bug | 排查问题，排除数据 |
| 多重比较 | 同时测试多个指标 | 使用Bonferroni校正 |
| 新奇效应 | 用户初期不适应 | 延长冷启动期 |
| 季节性影响 | 节假日/活动干扰 | 记录并考虑时间窗口 |

---

## 质量验证清单（Quality Checklist）

- [ ] 实验假设清晰且可验证
- [ ] 核心指标定义明确
- [ ] 样本量计算正确
- [ ] 分流机制随机且均匀
- [ ] 实验组/对照组特征一致
- [ ] 数据监控已建立
- [ ] 实验周期足够
- [ ] 统计方法选择正确
- [ ] 结论有数据支撑
- [ ] 风险和局限已说明

---

## 多个示例（Multiple Examples）

### 典型案例

**场景**：注册按钮颜色优化

**实验设计**：
```
【实验假设】红色按钮比蓝色按钮更能吸引点击，提升注册转化率
【核心指标】注册转化率（点击注册按钮->注册成功）
【护栏指标】页面加载时间、按钮点击率（点击但未注册）
【对照组A】蓝色按钮（当前方案）
【实验组B】红色按钮
【预期提升】相对提升10%（8% -> 8.8%）
```

**样本量计算**：
```python
import numpy as np
from scipy import stats

# 参数设置
baseline_rate = 0.08  # 当前转化率8%
mde = 0.10  # 最小可检测效应10%（相对提升）
alpha = 0.05  # 显著性水平
power = 0.80  # 统计功效

p1 = baseline_rate
p2 = baseline_rate * (1 + mde)  # 8.8%

effect = abs(p2 - p1)

# 计算每组所需样本量
n = 2 * (stats.norm.ppf(1 - alpha/2) + stats.norm.ppf(power))**2 * \
    (p1 * (1 - p1) + p2 * (1 - p2)) / effect**2

print(f"每组需要样本量: {int(np.ceil(n))}")
# 每组需要样本量: 19685

# 假设日均UV 2000，实验组/对照组各50%
# 每天每组获得: 1000 UV
# 实验周期: 19685 / 1000 = 约20天
```

**数据分析**：
```python
from scipy.stats import chi2_contingency
import numpy as np

# 实际数据
control_visitors = 20000
control_conversions = 1600
treatment_visitors = 20000
treatment_conversions = 1760

# 构建列联表
obs = np.array([
    [control_conversions, control_visitors - control_conversions],
    [treatment_conversions, treatment_visitors - treatment_conversions]
])

# 卡方检验
chi2, p_value, dof, expected = chi2_contingency(obs)

# 计算转化率和置信区间
control_rate = control_conversions / control_visitors
treatment_rate = treatment_conversions / treatment_visitors
lift = (treatment_rate - control_rate) / control_rate

# 95%置信区间
se = np.sqrt(control_rate * (1 - control_rate) / control_visitors +
              treatment_rate * (1 - treatment_rate) / treatment_visitors)
ci_lower = (treatment_rate - control_rate) - 1.96 * se
ci_upper = (treatment_rate - control_rate) + 1.96 * se

print(f"对照组转化率: {control_rate:.2%}")
print(f"实验组转化率: {treatment_rate:.2%}")
print(f"相对提升: {lift:.2%}")
print(f"p值: {p_value:.4f}")
print(f"95%CI: [{ci_lower:.4f}, {ci_upper:.4f}]")
```

**分析结果**：
| 指标 | 对照组A | 实验组B |
|------|---------|---------|
| 样本量 | 20,000 | 20,000 |
| 转化数 | 1,600 | 1,760 |
| 转化率 | 8.00% | 8.80% |
| 相对提升 | - | +10% |
| p值 | - | 0.0023 (<0.05) |
| 95%CI | - | [+0.3%, +1.3%] |

**结论**：实验组显著优于对照组，p<0.05，建议全量上线红色按钮

---

### 边界/异常案例

**场景**：实验结果不显著，但趋势明显

**数据**：
```
对照组转化率: 8.0%
实验组转化率: 8.3%
p值: 0.15 (不显著)
```

**分析**：
```
【情况说明】
虽然实验组有正向提升（+3.75%），但p>0.05，统计不显著。

【可能原因】
1. 样本量不足（需要更多流量或更长时间）
2. 真实效果太小（可能只有3-4%的提升）
3. 数据波动较大

【建议】
1. 延长实验周期2周，积累更多样本
2. 如果延长期后仍不显著，接受现状
3. 可以考虑增大样本量或调整方案
```

---

### 失败案例及修正

**场景**：忽略新奇效应导致错误结论

**问题**：
```
新功能上线后第一周数据非常好（转化率提升30%）
直接全量上线，第二周数据回落至原水平
```

**原因**：新奇效应 - 老用户对新功能好奇而点击，并非真实价值

**修正方案**：
```python
# 正确做法：设置冷启动期，排除新奇效应
COLD_START_DAYS = 7  # 前7天为冷启动期

# 冷启动期后的数据分析
df_valid = df[df['days_since_exp_start'] > COLD_START_DAYS]

# 分时间段分析
for period in ['week1', 'week2', 'week3', 'week4']:
    result = analyze_period(df_valid, period)
    print(f"{period}: 提升={result['lift']:.2%}, p={result['p_value']:.4f}")

# 如果各周效果稳定，才可下结论
```

---

## 统计检验速查

### 两组比例比较（转化率）
```python
from scipy.stats import chi2_contingency, norm

def test_proportions(n1, c1, n2, c2, alpha=0.05):
    """两组比例检验"""
    # 合并比例
    p_pool = (c1 + c2) / (n1 + n2)

    # 标准误差
    se = np.sqrt(p_pool * (1 - p_pool) * (1/n1 + 1/n2))

    # Z统计量
    z = (c1/n1 - c2/n2) / se

    # p值（双侧）
    p_value = 2 * (1 - norm.cdf(abs(z)))

    return {'z': z, 'p_value': p_value}
```

### 多组比较（方差分析）
```python
from scipy.stats import f_oneway

# 各组数据
group_a = [80, 85, 78, 92]
group_b = [88, 91, 76, 89]
group_c = [95, 88, 92, 85]

f_stat, p_value = f_oneway(group_a, group_b, group_c)
```

---

## FAQ（常见问题）

**Q1：样本量计算中 alpha 和 power 一般设多少？**
A：alpha（显著性水平）通常0.05，表示5%的假阳性概率；power（统计功效）通常0.8，表示80%的概率发现真实效应。关键实验可降低alpha到0.01。

**Q2：p值<0.05就一定可以全量吗？**
A：不完全是。还需要考虑：(1)效果量是否实际有意义 (2)护栏指标是否稳定 (3)是否存在新奇效应 (4)长期效果是否可持续。

**Q3：多个指标同时测试怎么办？**
A：使用Bonferroni校正或控制FDR（假发现率）。或者设定主指标，其他为护栏指标。

**Q4：实验期间发现bug怎么办？**
A：立即终止实验，排除受影响数据，与开发确认修复方案后重新实验。

**Q5：对照组和实验组用户特征差异大怎么办？**
A：检查分流逻辑是否随机；使用AA测试验证分流均匀性；使用CUPED等方法校正。

---

## 与其他技能的关联（Cross-skill References）

- **data-analyst**：A/B测试是数据分析的一种方法
- **stats-model**：统计分析是A/B测试的理论基础
- **sql-query**：A/B测试数据需要SQL提取
- **chart-designer**：实验结果需要可视化展示
- **report-generator**：实验结论需要写入报告
- **data-viz-story**：实验结果需要转化为业务故事
