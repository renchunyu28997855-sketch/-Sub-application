---
name: stats-model
description: 统计模型选择与应用技能。帮助选择合适的统计模型进行分析，包括回归、分类、聚类、时间序列等。
whenToUse: "统计分析、统计建模、模型选择、数据建模"
---

# stats-model

## 功能说明
帮助选择和应用合适的统计模型，解决实际问题。

---

## 假设声明（Assumptions）

1. **数据已准备好**：数据经过清洗，缺失值和异常值已处理
2. **问题类型明确**：已知是预测、分类、聚类还是其他问题
3. **样本量足够**：数据量能满足模型训练需求（通常>100）
4. **特征质量**：特征有预测能力，非完全随机
5. **目标变量清晰**：有明确的待预测目标
6. **工具环境**：Python (sklearn/scipy) 或 R 可用

---

## 输入输出（I/O Format）

### 标准输入格式

```
【问题类型】分类/回归/聚类/时间序列/降维
【数据概况】样本数、特征数
【目标变量】Y（预测目标）
【特征变量】X（自变量列表）
【模型要求】可解释性/性能/实时性
```

### 标准输出格式

```
【模型选择】
- 首选模型及理由
- 备选模型

【模型训练】
- 训练集/测试集划分
- 交叉验证策略
- 超参数选择

【模型评估】
- 主要评估指标
- 模型性能
- 特征重要性

【模型应用】
- 预测示例
- 业务解读
```

---

## 详细工作流程（Detailed Workflow）

### 第一阶段：问题定义
1. **明确问题类型**
   - 预测连续值 → 回归
   - 预测类别 → 分类
   - 发现分组 → 聚类
   - 发现结构 → 降维
   - 预测时间序列 → 时间序列模型

2. **确定目标变量**
   - 定义清晰的Y
   - 检查Y的分布
   - 处理类别不平衡（如有）

3. **分析特征**
   - 识别特征类型（连续/类别）
   - 检查特征相关性
   - 评估特征预测能力

**检查点**：问题定义清晰，可选择建模方案

### 第二阶段：数据准备
4. **特征工程**
   - 类别变量编码
   - 连续变量标准化
   - 特征选择

5. **数据划分**
   - 训练集/测试集划分（通常7:3）
   - 时序数据需保持时间顺序
   - 类别不平衡时使用分层采样

6. **交叉验证设置**
   - K折交叉验证
   - 时序数据使用滑动窗口验证

### 第三阶段：模型选择与训练
7. **基线模型**
   - 先建立简单基线
   - 如：线性回归、决策树
   - 用于后续对比基准

8. **多模型尝试**
   - 回归：线性回归、岭回归、Lasso、决策树、随机森林、XGBoost
   - 分类：逻辑回归、随机森林、SVM、神经网络
   - 聚类：K-means、层次聚类、DBSCAN
   - 时序：ARIMA、Prophet、LSTM

9. **模型调优**
   - 网格搜索或随机搜索
   - 调整超参数
   - 避免过拟合

### 第四阶段：模型评估
10. **评估指标选择**
    - 回归：MAE、RMSE、R²
    - 分类：准确率、精确率、召回率、F1、AUC
    - 聚类：轮廓系数、Calinski-Harabasz指数

11. **模型解释**
    - 特征重要性
    - 系数解释
    - 部分依赖图

12. **结果验证**
    - 测试集验证
    - 稳定性检验
    - 业务合理性检查

---

## 模型选择指南

| 问题类型 | 适用模型 | 优缺点 |
|---------|---------|--------|
| **回归-可解释** | 线性回归、逻辑回归 | 可解释性强，性能一般 |
| **回归-高性能** | 随机森林、XGBoost、神经网络 | 性能强，可解释性弱 |
| **分类-可解释** | 逻辑回归、决策树 | 可解释性强 |
| **分类-高性能** | 随机森林、SVM、神经网络 | 性能强 |
| **聚类-常规** | K-means | 简单快速，需预设K |
| **聚类-任意形状** | DBSCAN | 可发现任意形状，无需预设K |
| **时序-常规** | ARIMA | 经典方法，需平稳序列 |
| **时序-复杂** | Prophet、LSTM | 处理复杂季节性和趋势 |

---

## 边界情况（Edge Cases）

### 数据问题
- **样本量不足**（<30）：使用简单模型，增加正则化
- **类别严重不平衡**：使用SMOTE过采样或class_weight
- **特征维度灾难**：使用PCA或特征选择
- **多重共线性**：使用岭回归或删除相关特征

### 模型问题
- **过拟合**：增加数据、减少特征、增加正则化
- **欠拟合**：增加特征、使用更复杂模型
- **不收敛**：调整学习率、检查数据标准化

### 结果问题
- **预测结果不合理**：检查数据质量和模型假设
- **特征重要性异常**：可能是特征泄漏

---

## 错误处理（Error Handling）

| 问题类型 | 可能原因 | 处理方式 |
|---------|---------|---------|
| 模型不收敛 | 学习率过大、数据未标准化 | 调整学习率，标准化数据 |
| 过拟合 | 模型太复杂、数据太少 | 减少模型复杂度、增加数据 |
| 欠拟合 | 模型太简单 | 增加模型复杂度 |
| 类别不平衡 | 数据分布问题 | 使用SMOTE、调整权重 |
| 内存不足 | 数据量过大 | 减少特征、使用采样 |

---

## 质量验证清单（Quality Checklist）

- [ ] 问题类型定义正确
- [ ] 数据划分合理
- [ ] 特征工程适当
- [ ] 多个模型对比选择
- [ ] 交叉验证通过
- [ ] 测试集评估通过
- [ ] 模型不过于复杂
- [ ] 特征重要性合理
- [ ] 业务解释合理
- [ ] 模型可复现

---

## 多个示例（Multiple Examples）

### 典型案例

**场景**：用户购买预测（分类问题）

**数据探索**：
- 目标变量：is_purchase (0/1)
- 特征：浏览次数、加购行为、VIP状态、收入、访问时长

**模型对比**：
```python
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score

# 数据准备
X = df[['browse_count', 'add_cart', 'is_vip', 'income', 'visit_duration']]
y = df['is_purchase']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 标准化
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 模型训练与对比
models = {
    '逻辑回归': LogisticRegression(),
    '随机森林': RandomForestClassifier(n_estimators=100),
    'XGBoost': XGBClassifier(n_estimators=100)
}

for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    y_prob = model.predict_proba(X_test_scaled)[:, 1]
    print(f"{name}: AUC={roc_auc_score(y_test, y_prob):.3f}")
```

**评估结果**：
| 模型 | 准确率 | AUC | 召回率 |
|------|--------|-----|--------|
| 逻辑回归 | 82% | 0.85 | 0.78 |
| 随机森林 | 88% | 0.92 | 0.85 |
| XGBoost | 90% | 0.95 | 0.88 |

**特征重要性（随机森林）**：
1. add_cart (0.35) - 加购行为是最强预测因子
2. browse_count (0.22)
3. income (0.18)
4. visit_duration (0.15)
5. is_vip (0.10)

**业务建议**：
- 重点优化加购流程
- 对高浏览用户推送优惠券
- 针对高收入用户定制营销

---

### 边界/异常案例

**场景**：客户细分（聚类问题）

**问题**：客户数量大，需要自动发现分群数量

**解决方案**：
```python
from sklearn.cluster import KMeans, DBSCAN
from sklearn.metrics import silhouette_score
import numpy as np

# 1. 使用肘部法则确定K
inertias = []
silhouettes = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouettes.append(silhouette_score(X_scaled, kmeans.labels_))

# 2. 选择最佳K（轮廓系数最高）
best_k = K_range[np.argmax(silhouettes)]
print(f"最佳分群数: {best_k}")

# 3. 使用DBSCAN处理不规则形状
dbscan = DBSCAN(eps=0.5, min_samples=5)
dbscan_labels = dbscan.fit_predict(X_scaled)
```

---

### 失败案例及修正

**场景**：时序预测模型效果差

**问题**：ARIMA模型预测误差大

**诊断**：
1. 数据不平稳（存在趋势和季节性）
2. 未处理节假日效应
3. 突发事件影响

**修正方案**：
```python
# 使用Prophet处理复杂时序
from prophet import Prophet

model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    holidays=holidays_df,  # 添加节假日
    changepoint_prior_scale=0.05  # 调整趋势灵活度
)

model.fit(df_train)
forecast = model.predict(df_test)
```

---

## FAQ（常见问题）

**Q1：如何选择模型的可解释性和性能？**
A：业务场景需要解释时（如金融风控），优先选择逻辑回归、决策树；性能要求高时可先建模再解释特征重要性。两者需要权衡时，可使用SHAP值解释复杂模型。

**Q2：如何处理类别不平衡问题？**
A：常用方法：(1)SMOTE过采样 (2)调整class_weight (3)使用对不平衡友好的算法（如XGBoost） (4)阈值调整。

**Q3：交叉验证的目的是什么？**
A：评估模型泛化能力，避免过拟合在训练集上表现好但测试集上差。常用方法：K折交叉验证、留一法、滑动窗口验证（时序数据）。

**Q4：特征工程为什么重要？**
A：好特征能让简单模型也达到好效果；特征工程往往比模型调优更能提升性能。常见方法：编码、标准化、组合特征、特征选择。

**Q5：如何判断模型是否足够好？**
A：与基线模型对比、与业务需求对比、与其他研究对比。同时考虑模型稳定性和可解释性，不盲目追求单一指标。

---

## 与其他技能的关联（Cross-skill References）

- **data-cleaner**：建模前必须清洗数据
- **data-analyst**：模型输出需要业务解读
- **ab-test**：模型效果需要实验验证
- **sql-query**：模型特征数据需要SQL提取
- **chart-designer**：模型结果需要可视化
- **data-viz-story**：模型洞察需要转化为业务故事
