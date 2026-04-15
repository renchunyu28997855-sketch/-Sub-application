---
name: translator
description: 中英文互译润色技能。提供高质量的中译英、英译中翻译，以及现有译文的润色优化。
whenToUse: "翻译、英文润色、中英互译、语言优化"
---

# translator

## 功能说明
提供专业的中英文互译服务，以及现有译文的润色优化，确保语言地道流畅。

---

## 假设声明（Assumptions）

1. **原文内容合法**：用户提供的翻译内容不涉及违法、色情、暴力等
2. **版权清晰**：用户有权使用该内容进行翻译
3. **专业领域已知**：用户了解内容所属的专业领域
4. **适用场景**：商务合同、技术文档、营销内容、日常沟通
5. **不支持**：完全机器翻译的批量润色、专业学术论文（需专家审校）

---

## 输入输出（I/O Format）

### 输入格式
```
【翻译类型】中译英/英译中/润色校对
【原文语言】中文/英文
【风格要求】正式/商务/技术/文学/日常
【专业领域】（可选）通用/金融/法律/医学/IT/营销
【语境说明】（可选）使用场景、目标读者
【保密要求】（可选）是否需要保密处理
```

### 输出格式
```
【翻译类型】XXX
【风格要求】XXX
【原文】
...
【译文】
...
【译注】（如有难点说明）
...
【术语表】（如有专有名词）
...
```

---

## 详细工作流程（Detailed Workflow）

### 阶段一：需求分析
1. **确认翻译需求**
   - 翻译方向（中→英 / 英→中）
   - 风格要求
   - 专业领域

2. **理解原文内容**
   - 理解字面意思
   - 理解深层含义
   - 把握语用风格

### 阶段二：翻译执行
3. **初次翻译**
   - 准确传达原意
   - 保持风格一致
   - 符合目标语言习惯

4. **润色优化**
   - 调整句式结构
   - 优化用词选择
   - 提升流畅度

### 阶段三：审核校对
5. **质量检查**
   - 核对原文与译文
   - 检查语法正确性
   - 确认术语一致性

6. **难点标注**
   - 标注有争议的翻译
   - 说明翻译理由
   - 提供备选方案

### 检查点
- [ ] 意思准确，无漏译错译
- [ ] 风格匹配，语气得当
- [ ] 术语统一，表述专业
- [ ] 语言地道，无chinglish

---

## 边界情况（Edge Cases）

### 情况1：专业术语翻译
**问题**：某个专业术语有多种译法
**处理方式**：
- 提供多个译法并说明差异
- 建议在目标语境中最常用的
- 尊重用户或行业的偏好

### 情况2：文化差异处理
**问题**：源语言中涉及文化特有的表达
**处理方式**：
- 直译保留文化元素 + 脚注解释
- 或用意译，传达核心含义
- 或用目标文化中相似表达替代

### 情况3：机器翻译润色
**问题**：用户提供机器翻译结果需要优化
**处理方式**：
- 在润色校对模式下处理
- 纠正机器翻译的典型错误
- 提升语言自然度

### 情况4：长文档翻译
**问题**：文档较长，超出单次处理能力
**处理方式**：
- 分段处理
- 提供整体翻译框架
- 保持术语和风格一致

---

## 错误处理（Error Handling）

| 错误类型 | 识别方式 | 处理方式 |
|----------|----------|----------|
| 文化冲突 | 目标语言中有冒犯意味 | 避免直译，改用中性表达 |
| 专业错误 | 理解有误导致翻译偏差 | 标注并提供修正方案 |
| 语境不当 | 直译在目标语境不通顺 | 调整至语境合适的表达 |
| 敏感内容 | 涉及政治/宗教等敏感话题 | 谨慎处理，标注风险 |

---

## 质量验证清单（Quality Checklist）

### 准确性检查
- [ ] 意思准确，无误译
- [ ] 完整传达原文信息
- [ ] 语气和风格匹配
- [ ] 无文化冲突

### 语言质量检查
- [ ] 语法正确
- [ ] 选词恰当
- [ ] 句式流畅
- [ ] 无Chinglish

### 术语检查
- [ ] 专业术语一致
- [ ] 重复词汇统一
- [ ] 缩略语首次出现有全称

---

## 多个示例（Multiple Examples）

### 典型案例：商务邮件中译英

**输入**：
```
【翻译类型】中译英
【风格要求】商务正式
【专业领域】通用
【原文】
"非常感谢贵司在本次合作中展现的专业态度。我们期待未来能够与贵司建立长期稳定的战略合作伙伴关系，实现互利共赢。"
```

**输出**：（见下方完整示例）

---

### 边界案例1：文化差异处理

**输入**：
```
【翻译类型】中译英
【原文】
"中秋节到了，我们公司给每位员工发了一盒月饼，感谢大家这段时间的辛苦付出。"
```

**处理输出**：
```
【译文备选】

方案A（保留文化元素）：
"Mid-Autumn Festival is here! To express our gratitude for your hard work, the company is giving each employee a box of mooncakes - a traditional treat for this holiday."

方案B（本土化处理）：
"The autumn season is here! To show our appreciation for your hard work, the company is giving each employee a special holiday gift box."

【译注】
- 月饼是中秋节的传统食物，具有文化内涵。方案A保留并解释，方案B用"holiday gift"泛化处理。
- 如目标受众为海外华人，建议用方案A；如为完全不熟悉中国文化的西方受众，方案B更易理解。
```

---

### 边界案例2：技术文档英译中

**输入**：
```
【翻译类型】英译中
【风格要求】技术文档
【专业领域】IT/软件
【原文】
"The API returns a JSON object containing a status field and a data payload. If the request is successful, the status field will be 'success' and the data payload will contain the requested information."
```

**处理输出**：
```
【译文】
"API返回一个JSON对象，包含status字段和data数据载荷。如果请求成功，status字段值为'success'，data数据载荷将包含请求的信息。"

【译注】
1. "status field" → "status字段"（field在IT语境中指字段）
2. "data payload" → "data数据载荷"（payload是技术术语，可保留或翻译为"数据载荷"）
3. "requested information" → "请求的信息"（简洁表达）

【术语表】
| 英文 | 中文 | 备注 |
|------|------|------|
| API | 应用程序接口 | 常用缩写API |
| JSON | JSON格式 | 数据格式名称，一般不翻译 |
| status | 状态 | 通用技术术语 |
| payload | 数据载荷 | 或译"数据负载"，后者更常见 |
```

---

### 失败案例及修正

**原始翻译问题**：
```
原文：The meeting was very productive.
机翻：会议是非常富有成效的。

问题：语言不自然，"非常富有成效"过于翻译腔
```

**修正后**：
```
【润色版本】
"会议成果丰硕。"

【说明】
- "very productive" 口语化表达为"成果丰硕"
- 去掉"是非常"，中文更简洁有力
```

---

## FAQ（常见问题）

**Q1：翻译费用怎么算？**
A：本技能免费提供翻译服务，但仅供参考。如需正式出版或商业使用，建议找专业翻译公司审校。

**Q2：可以翻译其他语言吗？**
A：目前主要支持中英文互译。其他语言对暂不支持。

**Q3：翻译的准确率如何？**
A：对于通用商务、技术文档类内容，准确率较高。对于专业性极强的内容（如法律合同、医学论文），建议找对应领域的专业人士审校。

**Q4：可以提供带批注的翻译吗？**
A：可以。如需要，我会标注：
- [译注] 解释翻译选择
- [备选] 提供其他可能译法
- [疑问] 标注不确定之处

**Q5：翻译需要多久？**
A：一般即时响应。超过1000字的文档可能需要更长时间分段处理。

---

## 与其他技能的关联（Cross-skill References）

| 关联技能 | 关联方式 | 协作场景 |
|----------|----------|----------|
| **grammar-check** | 英文校对 | 英文翻译后的语法检查 |
| **localization** | 文化适配 | 翻译后的本地化调整 |
| **copywriter** | 营销内容翻译 | 中英文营销文案互译 |
| **tech-writer** | 技术文档翻译 | API文档等技术文档翻译 |
| **email-writer** | 英文邮件撰写 | 商务邮件的英文版本 |

---

## 服务类型

- **中译英**：商务、技术、文学
- **英译中**：论文、合同、小说
- **润色校对**：语法、用词、表达地道性
- **翻译审校**：对比原文与译文，确保准确

## 工作流程
1. 了解翻译用途和风格要求
2. 理解原文内容
3. 初次翻译
4. 润色优化
5. 最终校对

## 输出格式
```
【翻译类型】中译英/英译中
【风格要求】正式/商务/技术/文学/日常
【原文】
...
【译文】
...
【译注】（如有难点说明）
...
【术语表】（如有专有名词）
...
```

## 示例
**输入**: 帮我翻译这段话成英文，要商务风格
**output**:
【翻译类型】中译英
【风格要求】商务正式
【原文】
"非常感谢贵司在本次合作中展现的专业态度。我们期待未来能够与贵司建立长期稳定的战略合作伙伴关系，实现互利共赢。"

【译文】
"We greatly appreciate the professional approach demonstrated by your company throughout this collaboration. We look forward to establishing a long-term strategic partnership with you, achieving mutual benefit and shared success."

【译注】
1. "专业态度" → "professional approach"（比professional attitude更自然）
2. "互利共赢" → "mutual benefit and shared success"（避免直译win-win）
3. 添加"throughout this collaboration"明确合作时间范围

---

**另一个示例（润色）：**

【翻译类型】英文润色
【原文】
"In our company, we always pay attention to customer's need and try our best to meet their requirement."

【润色后】
"At our company, we consistently prioritize customer needs and strive to exceed their expectations."

【润色说明】
1. "pay attention to" → "prioritize"（更专业）
2. "customer's" → "customer needs"（更地道）
3. "try our best to meet" → "strive to exceed...expectations"（更有野心）
4. "requirement" → "expectations"（更符合商业用语习惯）
