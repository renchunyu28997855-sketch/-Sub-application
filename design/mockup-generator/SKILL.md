---
name: mockup-generator
description: 设计稿转Mockup技能。将设计稿转换为可展示的Mockup效果，支持多种场景。
whenToUse: "Mockup制作、产品展示、设计呈现、场景化展示"
userInvocable: true
triggerPhrases: ["Mockup制作", "设计稿展示", "产品Mockup", "场景化展示", "设计呈现"]
version: "3.0"
lastUpdated: 2026-04-17
skillLevel: L2
---

# mockup-generator v3.0

设计稿转Mockup技能。2026年集成AI智能场景匹配、3D Mockup生成、动态Mockup能力。

## 功能说明

将设计稿转换为真实场景下的Mockup效果，提升设计展示的专业度和说服力。

---

## 假设声明（Assumptions）

- 设计稿已完成（图片/Figma/Sketch）
- 使用场景已明确
- 输出格式已确定

---

## 输入输出（I/O Format）

### 标准输入格式

```
【Mockup制作请求】
## 设计稿
- 类型：[App/Web/H5]
- 文件：[设计稿]
## 展示场景
- 场景类型：[手机/电脑/包装/户外]
- 输出格式：[PNG/PDF/视频]
## 特殊要求
- [如：需要透明背景]
```

### 标准输出格式

```
【Mockup制作建议】
## 场景推荐
[最佳匹配场景]
## 制作方案
### 设备框架
[推荐设备模板]
### 光影调整
[光影效果建议]
### 输出规格
[尺寸/分辨率]
```

---

## 2026年新功能

### AI辅助Mockup制作
| 功能 | 说明 |
|------|------|
| **智能匹配** | AI推荐最佳展示场景 |
| **3D生成** | 自动生成3D Mockup |
| **动态Mockup** | 创建微动效Mockup |
| **批量生成** | 一键生成多场景Mockup |

### Mockup类型增强
- 增加AR场景Mockup
- 增加视频Animated Mockup
- 增加交互式Mockup建议

---

## Mockup制作流程（Workflow）

### 阶段1：素材准备
1. 收集设计稿
2. 确定输出需求
3. 选择展示场景

### 阶段2：场景匹配
1. 选择Mockup模板
2. 调整设计稿位置
3. 优化光影效果

### 阶段3：输出优化
1. 调整输出尺寸
2. 优化图像质量
3. 批量处理（如需要）

---

## 质量验证清单（Quality Checklist）

- [ ] 设计稿与场景融合自然
- [ ] 光影效果合理
- [ ] 输出尺寸满足需求
- [ ] 视觉呈现专业

---

## 详细内容

- [完整Mockup制作流程](references/workflow.md)
- [边界情况处理](references/edge-cases.md)
- [错误处理](references/error-handling.md)
- [典型案例](references/examples.md)

---

## 与其他技能的关联（Cross-skill References）

| 关联技能 | 关联说明 |
|---------|---------|
| **ui-feedback** | 设计稿评审 |
| **visual-identity** | 品牌Mockup |
| **poster-layout** | 海报Mockup |

---

## 更新日志

- v3.0 (2026-04-17)：添加AI智能场景匹配、3D Mockup生成、动态Mockup，技能等级调整为L2
- v2.0 (2026-04-15)：全面扩充，添加Mockup制作方法论
- v1.0：初始版本
