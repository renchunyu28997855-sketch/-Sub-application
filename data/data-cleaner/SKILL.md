---
name: data-cleaner
description: 数据清洗与预处理技能。帮助处理数据中的缺失值、异常值、重复值，进行数据质量提升。
whenToUse: "数据清洗、数据预处理、数据质量、ETL"
---

# data-cleaner

## 功能说明
帮助清洗和预处理原始数据，处理缺失值、异常值、重复值等问题。

---

## 假设声明（Assumptions）

1. **数据已获取**：原始数据已从数据源提取
2. **数据格式已知**：CSV/Excel/数据库/JSON等格式已知
3. **分析目标明确**：知道数据用于什么分析，决定清洗策略
4. **字段含义已知**：每个字段的业务含义已确认
5. **工具可用**：Python (pandas) / SQL / Excel 等工具可用
6. **处理可追溯**：清洗过程需要记录，保持可复现性

---

## 输入输出（I/O Format）

### 标准输入格式

```
【原始数据】数据来源和格式
【数据量】行数、列数
【清洗目标】要去除什么问题
【字段说明】关键字段的业务含义
【质量标准】清洗后的质量要求
```

### 标准输出格式

```
【清洗报告】
- 原始数据概况
- 发现的问题列表
- 处理方法说明
- 清洗后数据概况
- 数据质量验证结果

【输出文件】
- 清洗后数据文件
- 清洗日志/处理记录
```

---

## 详细工作流程（Detailed Workflow）

### 第一阶段：数据概况
1. **加载数据**
   - 读取数据文件（CSV/Excel/SQL）
   - 确认编码格式
   - 设置显示选项查看全部列

2. **基础统计**
   - 查看数据形状（行数、列数）
   - 查看数据类型
   - 查看前几行样本

3. **初步质量扫描**
   - 缺失值概览
   - 重复值概览
   - 异常值初步识别

**检查点**：对数据有整体认识

### 第二阶段：问题识别
4. **缺失值分析**
   - 统计每个字段的缺失率
   - 分析缺失原因（随机/系统/人为）
   - 判断字段重要性

5. **重复值分析**
   - 完全重复记录
   - 主键重复
   - 部分字段重复

6. **异常值分析**
   - 统计方法：IQR、Z-score
   - 业务方法：超出合理范围
   - 识别是错误还是真实的极端值

7. **格式问题识别**
   - 日期格式不统一
   - 数值格式混乱
   - 文本编码问题
   - 前后空格

### 第三阶段：清洗处理
8. **缺失值处理**
   | 缺失比例 | 推荐策略 |
   |---------|---------|
   | <5% | 删除或统计值填充 |
   | 5-30% | 模型预测填充 |
   | >30% | 考虑字段是否可用 |

9. **重复值处理**
   - 完全重复：删除
   - 主键重复：按业务规则保留
   - 部分重复：合并或去重

10. **异常值处理**
    - 明显错误：修正或删除
    - 极端值：单独分析或 Winsorize
    - 保持原样：明确标注

11. **格式标准化**
    - 日期统一格式
    - 数值类型统一
    - 文本去空格/统一编码
    - 分类字段标准化

### 第四阶段：验证输出
12. **清洗后验证**
    - 缺失率检查
    - 重复率检查
    - 分布检查（清洗前后对比）
    - 业务规则验证

13. **生成报告**
    - 记录所有处理操作
    - 保留原始数据备份
    - 输出清洗后数据集

---

## 边界情况（Edge Cases）

### 输入为空的情况
- **完全空白文件**：返回错误，提示检查数据源
- **仅表头无数据**：提示空数据集，无法清洗
- **部分字段全空**：评估字段是否需要保留

### 输入格式错误的情况
- **编码错误**：尝试多种编码（UTF-8/GBK）
- **日期格式混乱**：用正则提取或尝试解析多种格式
- **混合类型列**：拆分或转换失败时保留原样

### 特殊情况处理
- **时间序列数据**：清洗时注意保持时间连续性
- **ID字段**：不能修改，仅展示
- **敏感字段**：脱敏处理
- **多层嵌套JSON**：展开或提取关键字段

---

## 错误处理（Error Handling）

| 问题类型 | 可能原因 | 处理方式 |
|---------|---------|---------|
| 读取失败 | 文件损坏/格式不支持 | 检查文件完整性，转换格式 |
| 内存不足 | 数据量过大 | 分块处理，降低数据类型精度 |
| 解析错误 | 格式不规范 | 使用 error_bad_lines=False，跳过问题行 |
| 类型转换失败 | 包含非法字符 | 先清洗非数字字符 |
| 覆盖原始数据 | 未保存备份 | 先备份原文件 |

---

## 质量验证清单（Quality Checklist）

- [ ] 数据已备份
- [ ] 关键字段缺失率在可接受范围内
- [ ] 无完全重复记录
- [ ] 异常值已处理或标注
- [ ] 日期格式统一
- [ ] 数值类型一致
- [ ] 文本字段无多余空格
- [ ] 主键唯一性验证通过
- [ ] 业务规则验证通过
- [ ] 清洗日志已记录

---

## 多个示例（Multiple Examples）

### 典型案例

**场景**：用户注册数据清洗

**原始数据问题**：
- 手机号格式不统一（有空格、86前缀、+86）
- 邮箱有重复
- 年龄有负值和超常值
- 注册时间格式不一致

```python
import pandas as pd
import numpy as np

def clean_user_data(df):
    df_clean = df.copy()

    # 1. 手机号清洗
    df_clean['phone'] = df_clean['phone'].astype(str)
    df_clean['phone'] = df_clean['phone'].str.replace(r'[\s\-\+86]', '', regex=True)
    df_clean['phone'] = df_clean['phone'].str.extract(r'(\d{11})')
    # 标记无效手机号
    df_clean.loc[df_clean['phone'].str.len() != 11, 'phone'] = np.nan

    # 2. 邮箱去重
    df_clean.drop_duplicates(subset=['email'], keep='last', inplace=True)

    # 3. 年龄异常处理
    df_clean.loc[df_clean['age'] < 0, 'age'] = abs(df_clean['age'])  # 取绝对值
    df_clean.loc[df_clean['age'] > 120, 'age'] = np.nan  # 设为缺失

    # 4. 日期格式统一
    df_clean['register_time'] = pd.to_datetime(df_clean['register_time'], errors='coerce')

    # 5. 文本字段去空格
    for col in ['name', 'city']:
        df_clean[col] = df_clean[col].str.strip()

    return df_clean

# 使用示例
df = pd.read_csv('users_raw.csv')
df_cleaned = clean_user_data(df)
df_cleaned.to_csv('users_cleaned.csv', index=False)
```

---

### 边界/异常案例

**场景**：交易数据清洗，存在大量缺失和异常

**原始数据**：
```
order_id, user_id, amount, discount, status, created_at
1001, U001, 100, 10, paid, 2024-01-01
1002, U002, , 5, paid, 2024-01-02  -- amount缺失
1003, , 200, 20, paid, 2024-01-03  -- user_id缺失
1004, U004, -50, 0, paid, 2024-01-04  -- 负金额异常
```

**清洗策略**：
```python
def clean_transaction_data(df):
    df_clean = df.copy()

    # 缺失值分析报告
    missing_report = df_clean.isnull().sum() / len(df_clean) * 100
    print("缺失率报告：", missing_report)

    # amount缺失处理：根据用户历史平均值填充
    user_avg = df_clean.groupby('user_id')['amount'].transform('mean')
    df_clean['amount'] = df_clean['amount'].fillna(user_avg)

    # user_id缺失：无法填充，标记为匿名用户
    df_clean['user_id'] = df_clean['user_id'].fillna('ANONYMOUS')

    # 负金额处理：转为正数并记录为退款（假设负数是退款）
    df_clean['is_refund'] = df_clean['amount'] < 0
    df_clean['amount'] = df_clean['amount'].abs()

    # status标准化
    valid_status = ['pending', 'paid', 'cancelled', 'refunded']
    df_clean['status'] = df_clean['status'].apply(
        lambda x: x if x in valid_status else 'unknown'
    )

    return df_clean
```

---

### 失败案例及修正

**场景**：删除重复记录时误删有效数据

**问题**：
```python
# 错误做法：直接删除所有重复
df.drop_duplicates()  # 可能删除重要记录
```

**修正方案**：
```python
# 正确做法：保留最新记录或最重要记录
df_cleaned = df.sort_values('updated_at', ascending=False)  # 按更新时间排序
df_cleaned = df_cleaned.drop_duplicates(subset=['user_id', 'order_id'], keep='first')
```

---

## 清洗策略速查

### 缺失值策略
```python
# 删除
df.dropna(subset=['关键字段'])

# 固定值填充
df['字段'].fillna('未知')

# 统计值填充
df['字段'].fillna(df['字段'].mean())  # 均值
df['字段'].fillna(df['字段'].median())  # 中位数

# 向前/向后填充
df['字段'].fillna(method='ffill')  # 用前面的值
df['字段'].fillna(method='bfill')  # 用后面的值

# 模型预测填充
from sklearn.impute import KNNImputer
imputer = KNNImputer(n_neighbors=5)
df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)
```

### 异常值策略
```python
# IQR方法
Q1 = df['字段'].quantile(0.25)
Q3 = df['字段'].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
df = df[(df['字段'] >= lower) & (df['字段'] <= upper)]

# Z-score方法
from scipy import stats
z_scores = np.abs(stats.zscore(df['字段']))
df = df[z_scores < 3]

# Winsorize（缩尾）处理
from scipy.stats import mstats
df['字段'] = mstats.winsorize(df['字段'], limits=[0.01, 0.01])
```

### 格式标准化
```python
# 日期
df['日期'] = pd.to_datetime(df['日期'], format='%Y-%m-%d')

# 数字文本转数值
df['数字'] = pd.to_numeric(df['数字'], errors='coerce')

# 去除空格
df['文本'] = df['文本'].str.strip().str.replace(r'\s+', ' ', regex=True)

# 统一大小写
df['文本'] = df['文本'].str.upper()  # 或 .str.lower()
```

---

## FAQ（常见问题）

**Q1：删除缺失值和填充缺失值怎么选？**
A：取决于缺失率和字段重要性。关键字段缺失>30%考虑删除该字段；非关键字段少量缺失可用统计值填充；高隐私字段缺失可保持未知状态。

**Q2：如何判断是异常值还是真实数据？**
A：结合业务理解判断。如"年收入1000万"在普通用户中是异常，但在企业账户中可能是正常的。建议与业务方确认后再决定处理方式。

**Q3：数据清洗后需要重新验证吗？**
A：必须验证。检查清洗后的分布是否合理，确保没有引入新的问题。建议与原始数据做对比统计。

**Q4：能否自动化数据清洗流程？**
A：可以建立清洗模板和规则引擎。但建议保留人工审核环节，因为不同数据集可能需要不同策略。

**Q5：清洗后的数据应该保存为什么格式？**
A：优先使用 Parquet（压缩率高、支持复杂类型）或 CSV（通用性强）。避免使用 Excel（丢失类型信息、大小受限）。

---

## 与其他技能的关联（Cross-skill References）

- **sql-query**：数据常通过 SQL 提取，清洗后的数据也常写回数据库
- **data-analyst**：数据清洗是分析的前提和基础
- **data-dict**：了解字段定义才能正确清洗
- **data-migrate**：数据迁移前需要清洗
- **stats-model**：建模前必须确保数据质量
- **excel-formula**：Excel中进行简单数据清洗
