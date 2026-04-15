# 生产排程调度系统

智能生产排程与调度优化系统，基于 MiniMax API 提供生产任务分析和排程优化建议。

## 功能特性

- 模板选择：预置多种生产场景模板
- 自定义输入：向导式问答收集生产需求
- 智能排程：基于 AI 生成优化生产计划
- 风险预警：识别潜在生产风险
- 资源优化：提供设备与人员配置建议

## 技术栈

- Next.js 16
- React 19
- TypeScript
- MiniMax API

## 环境配置

复制 `.env.local.example` 为 `.env.local` 并配置：

```
MINIMAX_API_KEY=your_api_key
MINIMAX_GROUP_ID=your_group_id
```

## 开发

```bash
npm install
npm run dev
```

## 访问

开发环境：http://localhost:3000/production-scheduler
