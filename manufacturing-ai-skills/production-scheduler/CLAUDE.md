# 生产排程调度系统 (Production Scheduler)

## 项目概述

这是一个基于 Next.js 的生产排程调度系统，为制造业提供智能生产计划优化服务。

## 目录结构

```
production-scheduler/
├── src/
│   ├── app/
│   │   ├── api/analyze/    # POST /production-scheduler/api/analyze
│   │   ├── components/     # InputForm 组件
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── lib/
│       └── llm.ts          # MiniMax API 调用
├── public/
├── package.json
├── next.config.ts          # basePath: /production-scheduler
└── tsconfig.json
```

## API

### POST /production-scheduler/api/analyze

请求体：
```json
{
  "jobDescription": "生产任务描述",
  "context": {
    "machines": "设备列表",
    "workers": "人员配置",
    "materials": "物料情况",
    "deadline": "交期要求",
    "priority": "优先级"
  }
}
```

响应：
```json
{
  "tasks": [...],
  "schedule": [...],
  "recommendations": {...}
}
```
