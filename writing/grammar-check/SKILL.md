---
name: grammar-check
description: 英文语法纠错技能。帮助检查和纠正英文写作中的语法错误，提供错误分析和正确表达。
whenToUse: "英文纠错、语法检查、写作修改、语言学习"
---

# grammar-check

## 功能说明
帮助检查英文文本的语法、拼写、用词等错误，并提供错误分析和正确表达。

---

## 假设声明（Assumptions）

1. **文本可分享**：用户提供的文本不涉及敏感/隐私信息
2. **语言明确**：用户知道原文的大致语法难度和使用场景
3. **纠错目的**：用户希望提升英文写作质量
4. **适用场景**：英文作业、商务邮件、申请文书、日常英文
5. **不支持**：专业学术论文（建议找专业编辑）

---

## 输入输出（I/O Format）

### 输入格式
```
【文本类型】邮件/文书/作业/聊天/其他
【语法难度】基础/中级/高级
【纠错重点】（可选）全部纠错/仅标点/仅用词
【原文】
...
```

### 输出格式
```
【原文】
...
【纠错后】
...
【错误分析】
| 错误位置 | 错误类型 | 错误内容 | 正确表达 |
|----------|----------|----------|----------|
| ... | ... | ... | ... |
【语法知识点】
...
```

---

## 详细工作流程（Detailed Workflow）

### 阶段一：接收文本
1. **确认纠错需求**
   - 文本类型和使用场景
   - 语法难度评估
   - 是否需要重点纠错

2. **初步阅读**
   - 理解文本原意
   - 识别明显错误

### 阶段二：逐句分析
3. **语法错误检查**
   - 时态问题
   - 主谓一致
   - 从句结构
   - 介词搭配

4. **用词错误检查**
   - 词语选择
   - 介词使用
   - 固定搭配
   - Chinglish纠正

### 阶段三：整理输出
5. **输出纠错结果**
   - 完整纠错后文本
   - 逐条错误分析
   - 语法知识点说明

6. **提供学习建议**
   - 相关语法点解释
   - 延伸学习资源

### 检查点
- [ ] 所有错误已标注
- [ ] 纠错后文本流畅
- [ ] 错误解释清晰
- [ ] 语法说明有帮助

---

## 边界情况（Edge Cases）

### 情况1： Chinglish表达
**问题**：中文思维导致的英文错误
**处理方式**：
- 纠正为地道英文表达
- 解释中英文思维差异
- 提供多个替代表达

### 情况2：动词短语/介词搭配
**问题**：如 "look forward to + 名词/动名词" 的搭配错误
**处理方式**：
- 指出正确搭配
- 解释搭配规则
- 提供例句

### 情况3：学术写作风格
**问题**：学术文本需要正式风格
**处理方式**：
- 保持正式语气
- 避免口语化表达
- 注意引用格式

---

## 错误处理（Error Handling）

| 错误类型 | 识别方式 | 处理方式 |
|----------|----------|----------|
| 拼写错误 | 明显拼写不正确 | 直接修正 |
| 语法错误 | 主谓不一致/时态错误 | 修正并解释 |
| 用词错误 | 中式英语/词不达意 | 提供地道表达 |
| 标点错误 | 中英文标点混用 | 标注并修正 |

---

## 质量验证清单（Quality Checklist）

### 准确性检查
- [ ] 所有错误已识别
- [ ] 纠错后意思不变
- [ ] 无过度修改

### 完整性检查
- [ ] 错误类型标注清楚
- [ ] 正确表达提供到位
- [ ] 语法说明有帮助

### 可读性检查
- [ ] 纠错后文本流畅自然
- [ ] 错误分析结构清晰
- [ ] 便于学习理解

---

## 多个示例（Multiple Examples）

### 典型案例：求职邮件纠错

**输入**：
```
【文本类型】求职邮件
【原文】
"I am very interesting about this position because my friend who work in your company told me that the job is very suitable for my skill and I thinks I can contribute a lot for your team."
```

**输出**：（见下方完整示例）

---

### 边界案例1： Chinglish纠正

**输入**：
```
【原文】
"I very like this product and I think your company should give me a discount because I am your old customer."
```

**处理输出**：
```
【纠错后】
"I really like this product and I was wondering if you could offer a discount for loyal customers like myself."

【错误分析】
| 错误位置 | 错误类型 | 错误内容 | 正确表达 |
|----------|----------|----------|----------|
| I very like | 用词错误 | "very like" 不自然 | really like / quite like |
| should give me | 语气不当 | 命令式，过于生硬 | could offer / would consider |
| because I am your old customer | 表达累赘 | 中文思维直译 | for loyal customers like myself |

【语法知识点】
1. **"very" vs "really"**
   - "very"通常修饰形容词/副词，如 "very good"
   - 修饰动词用 "really"，如 "I really appreciate..."
   - "like" 是动词，不能用 "very" 修饰

2. **请求表达的礼貌程度**
   - 命令式：Give me a discount（不礼貌）
   - 礼貌请求：Could you give me a discount?（较礼貌）
   - 委婉表达：I was wondering if you could...（最礼貌）
```

---

### 边界案例2：介词搭配错误

**输入**：
```
【原文】
"I am looking forward to hear from you soon."
```

**处理输出**：
```
【纠错后】
"I am looking forward to hearing from you soon."

【错误分析】
| 错误位置 | 错误类型 | 错误内容 | 正确表达 |
|----------|----------|----------|----------|
| to hear | 介词搭配错误 | look forward to + doing | look forward to + hearing |

【语法知识点】
**look forward to 的用法**
- look forward to 是一个固定搭配，to 是介词，后面必须接名词或动名词（-ing形式）
- 正确：I look forward to hearing from you.
- 正确：I look forward to your reply.
- 错误：I look forward to hear from you.
```

---

### 失败案例及修正

**原始问题**：
```
原文：Today I very happy because I received your email.
```

**问题分析**：
1. "very happy" 需要 be 动词连接主语和表语
2. "very" 修饰形容词不需要 be 动词
3. 整个句子缺谓语

**修正后**：
```
【纠错后】
"Today I am very happy because I received your email."

【错误分析】
| 错误位置 | 错误类型 | 错误内容 | 正确表达 |
|----------|----------|----------|----------|
| I very happy | 缺少be动词 | 形容词作表语需要be动词 | I am very happy |

【语法知识点】
**系动词 be 的使用**
- 英文中，形容词作表语时必须与be动词连用
- 主语 + be + 形容词：He is happy. / They are busy.
- 副词 very 修饰形容词：He is very happy. / It is very important.
```

---

## FAQ（常见问题）

**Q1：可以检查长文章吗？**
A：可以，但超过1000字的内容可能需要分段处理。

**Q2：可以只检查某一类错误吗？**
A：可以。请在输入时说明纠错重点，如"只检查介词错误"或"只检查标点"。

**Q3：纠错后会保留原文风格吗？**
A：会的。纠错只在必要处修改，保持原文的语气和意图。

**Q4：可以帮助学习语法吗？**
A：可以。我会提供错误分析和相关语法知识点，帮助您理解和学习。

**Q5：可以提供口语化/正式版本吗？**
A：可以。请在输入时说明风格要求，如"更口语化"或"更正式"。

---

## 与其他技能的关联（Cross-skill References）

| 关联技能 | 关联方式 | 协作场景 |
|----------|----------|----------|
| **translator** | 翻译润色 | 英文翻译后的语法检查 |
| **email-writer** | 英文邮件 | 英文商务邮件撰写 |
| **resume-optimize** | 英文简历 | 英文简历的语法检查 |
| **grammar-check** | 自查学习 | 日常英文写作的自查 |

---

## 检查类型

- **语法错误**：时态、主谓一致、从句等
- **拼写错误**：单词拼写、大小写
- **用词错误**：词语搭配、介词使用
- **表达地道性**： Chinglish纠正
- **标点符号**：中英文标点混用

## 工作流程
1. 接收英文文本
2. 逐句分析语法
3. 标记错误
4. 给出正确版本
5. 解释错误原因

## 输出格式
```
【原文】
...
【纠错后】
...
【错误分析】
| 错误位置 | 错误类型 | 错误内容 | 正确表达 |
|----------|----------|----------|----------|
| ... | ... | ... | ... |
【语法知识点】
...
```

## 示例
**输入**: 帮我检查这段英文的语法
**output**:
【原文】
"I am very interesting about this position because my friend who work in your company told me that the job is very suitable for my skill and I thinks I can contribute a lot for your team."

【纠错后】
"I am very interested in this position because my friend who works at your company told me that the role is very suitable for my skills, and I think I can contribute a lot to your team."

【错误分析】
| 错误位置 | 错误类型 | 错误内容 | 正确表达 |
|----------|----------|----------|----------|
| interesting → interested | 形容词误用 | interesting（令人感兴趣的） | interested（感兴趣的） |
| in → in | 介词正确 | - | - |
| work → works | 主谓不一致 | who work（复数） | who works（单数） |
| your company → your company | 介词选择 | in your company | at your company（在公司工作） |
| job → role | 用词优化 | job（偏口语） | role（更正式） |
| my skill → my skills | 名词单复数 | my skill（单数） | my skills（复数） |
| I thinks → I think | 主谓不一致 | I thinks | I think |
| contribute a lot for → contribute a lot to | 介词误用 | contribute...for | contribute...to |

【语法知识点】
1. **-ed vs -ing形容词**
   - interested：感到有兴趣的（主语是人）
   - interesting：令人感兴趣的（主语是物）
   记忆：人"感兴趣"用interested，事"有趣"用interesting。

2. **主谓一致**
   定语从句中，从句动词与从句主语一致，不与主句主语一致。
   "my friend who works" → friend是单数，所以用works

3. **contribute to**
   contribute表示"贡献"时，通常与to搭配：contribute to something
