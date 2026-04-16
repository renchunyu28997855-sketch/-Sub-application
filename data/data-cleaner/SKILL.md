---
name: data-cleaner
description: 数据清洗与预处理技能。处理缺失值、异常值、重复值，进行数据质量提升，集成2026 AI智能清洗能力。
whenToUse: "数据清洗、数据预处理、数据质量、ETL、脏数据处理"
userInvocable: true
triggerPhrases: ["清洗数据", "数据清洗", "处理缺失值", "去除重复", "数据预处理", "脏数据", "数据质量"]
version: "3.0"
lastUpdated: 2026-04-17
skillLevel: L3
---

# data-cleaner v3.0

数据清洗与预处理技能。集成2026 AI能力：自动异常检测、智能数据补全、模式识别。

---

## 核心能力

1. **缺失值处理** - 统计填充、模型预测、KNN插补
2. **异常值检测** - IQR、Z-score、Isolation Forest
3. **重复值去除** - 完全重复、主键重复、部分重复
4. **格式标准化** - 日期、数值、文本编码
5. **2026 AI能力** - 自动异常检测、智能补全、模式识别

---

## 假设声明

1. 数据已获取（CSV/Excel/SQL/JSON格式已知）
2. 分析目标明确（决定清洗策略）
3. 字段含义已确认
4. Python (pandas) / SQL / Excel 工具可用
5. 清洗过程需记录保持可复现性

---

## 标准输入

```
【原始数据】数据来源和格式
【数据量】行数、列数
【清洗目标】要去除什么问题
【字段说明】关键字段业务含义
【质量标准】清洗后的质量要求
```

## 标准输出

```
【清洗报告】
- 原始数据概况
- 发现问题列表
- 处理方法说明
- 清洗后数据概况
- 数据质量验证结果

【输出文件】
- 清洗后数据文件
- 清洗日志/处理记录
```

---

## 快速工作流

### 第一阶段：数据扫描
1. 加载数据，检查行列、数据类型
2. 缺失值概览（`df.isnull().sum()`）
3. 重复值概览（`df.duplicated().sum()`）
4. 异常值初步识别（统计方法）

### 第二阶段：智能处理
5. 缺失值处理（按缺失率选择策略）
6. 重复值处理（按类型选择策略）
7. 异常值处理（修正/删除/标注）
8. 格式标准化（日期/数值/文本）

### 第三阶段：验证输出
9. 清洗后验证（缺失率、重复率、分布）
10. 生成报告，保留原始数据备份

---

## 2026 AI新功能

### 自动异常检测
```python
from sklearn.ensemble import IsolationForest

model = IsolationForest(contamination=0.05, random_state=42)
predictions = model.fit_predict(df[numeric_features])
df['is_anomaly'] = predictions == -1
```

### 智能缺失值填充
```python
from sklearn.impute import KNNImputer
imputer = KNNImputer(n_neighbors=5)
df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)
```

### 模式识别自动清洗
```python
# 自动识别手机号/邮箱/日期格式并标准化
df[col] = df[col].str.replace(r'[\s\-\+86]', '', regex=True)  # 手机号
df[col] = pd.to_datetime(df[col], errors='coerce')  # 日期
```

---

## 清洗策略速查

| 缺失率 | 推荐策略 |
|-------|---------|
| <5% | 删除或统计值填充 |
| 5-30% | 模型预测填充 |
| >30% | 评估字段是否可用 |

| 异常类型 | 处理方式 |
|---------|---------|
| 明显错误 | 修正或删除 |
| 极端值 | Winsorize或单独分析 |
| 真实异常 | 保持原样，明确标注 |

---

## 质量验证清单

- [ ] 原始数据已备份
- [ ] 关键字段缺失率在可接受范围
- [ ] 无完全重复记录
- [ ] 异常值已处理或标注
- [ ] 日期格式统一
- [ ] 数值类型一致
- [ ] 文本字段无多余空格
- [ ] 主键唯一性验证通过
- [ ] 业务规则验证通过
- [ ] 清洗日志已记录

---

## 详细内容

- [清洗模式](references/cleaning-patterns.md)
- [验证规则](references/validation-rules.md)
- [数据转换](references/transformation.md)
- [典型案例](references/examples.md)

---

## 技能关联

- **sql-query** - 数据提取和写回
- **data-analyst** - 清洗是分析的前提
- **data-dict** - 字段定义是清洗依据
- **stats-model** - 建模前必须确保数据质量

---

## 更新日志

- v3.0 (2026-04-17)：添加AI智能清洗、模式识别、渐进式披露
- v2.0：添加I/O格式、工作流程、边界情况
- v1.0：初始版本
