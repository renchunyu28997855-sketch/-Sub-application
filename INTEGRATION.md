# AI 技能平台 - 独立应用对接文档

本文档说明如何在 `F:\develop\app` 目录下开发独立应用，并将其接入 AI Portal 主系统。

---

## 项目结构总览

```
D:\develop\autoWrite\ai-portal/          # AI Portal 主系统
├── server/                             # 后端服务 (端口 3002)
├── frontend/                           # 前端页面 (端口 80)
├── nginx.conf                          # Nginx 配置
└── ...

F:\develop\app/                         # 独立应用目录（与 ai-portal 解耦）
├── .git/                               # 独立 Git 仓库
├── unified-skills-platform/             # 统一技能平台
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # 技能选择页面
│   │   │   └── api/analyze/route.ts  # 分析 API
│   │   └── lib/
│   │       ├── skills.ts             # 技能配置加载
│   │       ├── skills-config.json    # 技能配置
│   │       └── llm.ts                # LLM 调用
│   └── next.config.js                # basePath: /unified-skills
├── manufacturing-ai-skills/           # 制造业技能
│   └── unified-manufacturing-platform/  # 制造业平台
│       └── ...
├── meme-analyzer/                     # AI 工作诊断
│   └── ...
└── INTEGRATION.md                      # 本文档
```

---

## 架构说明

### 子应用与主系统的关系

```
┌─────────────────────────────────────────────────────────────┐
│                     AI Portal 主站                          │
│                    http://47.112.29.121/                    │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │ ComfyUI     │  │ 技能应用      │  │ 制造业应用    │   │
│  │ 工作流      │  │ unified-skills│  │ manufacturing │   │
│  └─────────────┘  └──────┬───────┘  └───────┬───────┘   │
└─────────────────────────┼───────────────────┼─────────────┘
                          │                   │
              ┌───────────┴───┐       ┌───────┴───────────┐
              │ Port 3021     │       │ Port 3020          │
              │ /unified-    │       │ /manufacturing-    │
              │ skills       │       │ skills             │
              └───────────────┘       └───────────────────┘
```

### 端口分配

| 子应用 | 端口 | URL Path | 说明 |
|--------|------|----------|------|
| ai-portal-server | 3002 | /api | 主系统 API |
| unified-skills | 3021 | /unified-skills | 统一技能平台 |
| manufacturing-skills | 3020 | /manufacturing-skills | 制造业技能平台 |
| meme-analyzer | 3003 | /meme-analyzer | AI 工作诊断 |

---

## 核心机制

### 1. 认证机制

子应用通过 URL 参数 `?token=xxx` 获取用户 token，验证流程：

```typescript
// 1. 从 URL 获取 token
const token = new URLSearchParams(window.location.search).get('token')

// 2. 验证 token 有效性
const res = await fetch('http://47.112.29.121/api/auth/me', {
  headers: { Authorization: `Bearer ${token}` },
})
if (!res.ok) {
  // token 无效，重定向到登录页
  window.location.href = 'http://47.112.29.121/'
}
```

### 2. 积分机制

**积分检查（调用前）：**
```typescript
const creditResponse = await fetch('http://47.112.29.121/api/credit/check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ appId: `${categoryKey}-${skillId}` }),
})

if (!creditResponse.json().sufficient) {
  return { error: '积分不足' }
}
```

**积分扣除（调用后）：**
```typescript
await fetch('http://47.112.29.121/api/credit/consume', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ appId: `${categoryKey}-${skillId}`, description: `使用技能: ${skill.name}` }),
})
```

### 3. LLM 调用（通过代理）

子应用通过主站的 `/api/llm/proxy` 接口代理调用 LLM，避免在前端暴露 API key：

```typescript
// 调用 LLM 代理接口
const llmResponse = await fetch('http://47.112.29.121/api/llm/proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    appId: `${categoryKey}-${skillId}`,  // 如 business-biz-plan, writing-blog-writer
    messages: [
      { role: 'system', content: '你是一个助手...' },
      { role: 'user', content: '用户输入...' }
    ],
  }),
});

const result = await llmResponse.json();
// 返回格式: { choices: [{ message: { content: '...' } }] }
```

---

## 添加新子应用

### 步骤一：创建应用结构

```
F:\develop\app\
└── my-new-app/
    └── src/
        ├── app/
        │   ├── page.tsx           # 主页面
        │   └── api/
        │       └── analyze/
        │           └── route.ts  # 分析 API
        └── lib/
            └── llm.ts            # LLM 调用
```

### 步骤二：配置 basePath

在 `next.config.js` 中设置：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/my-new-app',  // 与 Nginx 配置中的 path 一致
  output: 'standalone',
}

module.exports = nextConfig
```

### 步骤三：实现认证

在主页面组件中添加 token 验证：

```typescript
'use client'

import { useEffect } from 'react'

export default function MyApp() {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')

    if (!token) {
      window.location.href = 'http://47.112.29.121/'
      return
    }

    // 验证 token
    fetch('http://47.112.29.121/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) {
          window.location.href = 'http://47.112.29.121/'
        }
      })
      .catch(() => {
        window.location.href = 'http://47.112.29.121/'
      })
  }, [])

  // ... 页面内容
}
```

### 步骤四：实现积分检查和扣除

在 `/api/analyze/route.ts` 中：

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { skillId, input, token } = await req.json()

  // 1. 积分检查
  if (token) {
    const creditResponse = await fetch('http://47.112.29.121/api/credit/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ appId: `skill-${skillId}` }),
    })

    const creditData = await creditResponse.json()
    if (!creditData.sufficient) {
      return NextResponse.json(
        { error: '积分不足', code: 'INSUFFICIENT_CREDIT' },
        { status: 402 }
      )
    }
  }

  // 2. 调用 LLM
  const result = await analyzeSkill(skillId, input)

  // 3. 积分扣除
  if (token) {
    await fetch('http://47.112.29.121/api/credit/consume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ appId: `skill-${skillId}`, description: '使用技能' }),
    })
  }

  return NextResponse.json(result)
}
```

---

## 部署指南

### 服务器目录结构

```
/root/autoWrite/
├── ai-portal/                      # AI Portal 主系统
├── unified-skills-platform/        # 统一技能平台 (子应用)
├── manufacturing-ai-skills/        # 制造业技能
│   └── unified-manufacturing-platform/
├── meme-analyzer/                  # AI 工作诊断
└── ...
```

### Nginx 配置

在 `/root/autoWrite/ai-portal/nginx.conf` 中添加路由：

```nginx
# my-new-app - 新应用
location ^~ /my-new-app {
    proxy_pass http://127.0.0.1:端口号;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 部署步骤

1. **构建应用**
```bash
cd /root/autoWrite/my-new-app
npm install
npm run build
```

2. **启动 PM2**
```bash
PORT=端口号 pm2 start 'npm start' --name my-new-app
```

3. **重载 Nginx**
```bash
nginx -s reload
```

4. **验证**
```bash
curl http://localhost:端口号/
curl http://47.112.29.121/my-new-app/
```

---

## 数据库注册

将应用注册到 AI Portal 数据库，使其在主站显示：

```sql
INSERT INTO "App" (
  id, name, description, icon, url,
  "groupId", "categoryId", isActive, creditCost,
  isDefault, price, config, "createdAt"
) VALUES (
  'my-app-id',
  '我的应用',
  '应用描述',
  '🚀',
  'http://47.112.29.121/my-new-app/?skill=xxx',
  '7802c491-29b8-472b-b1c0-c200e5c76276',  -- groupId
  '0f2915c3-84fa-4539-aa79-4f0e72f2aab8',  -- categoryId
  true, 100, false, 0, '{}', NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;
```

**URL 格式说明：**
- `http://47.112.29.121/my-new-app/` - 应用首页
- `?skill=xxx` - 技能标识参数
- `&token=xxx` - 用户 token（由主站自动添加）

---

## 主站点击流程

当用户在 AI Portal 首页点击应用时：

1. 主站跳转到 `http://47.112.29.121/my-new-app/?skill=xxx&token=用户token`
2. 子应用通过 URL 获取 token
3. 验证 token 有效性
4. 显示应用界面
5. 用户操作 → API 调用 → 积分检查/扣除

---

## 现有子应用参考

### unified-skills
- 路径：`F:\develop\app\unified-skills-platform`
- 端口：3021
- URL Path：`/unified-skills`
- 特性：完整的 token 验证、积分检查、积分扣除、LLM 代理调用
- appId 格式：`{categoryKey}-{skillId}`（如 `business-biz-plan`、`writing-creative-writing`）

### manufacturing-skills
- 路径：`F:\develop\app\manufacturing-ai-skills\unified-manufacturing-platform`
- 端口：3020
- URL Path：`/manufacturing-skills`
- 特性：token 验证、积分检查（无积分扣除）

### meme-analyzer
- 路径：`F:\develop\app\meme-analyzer`
- 端口：3003
- URL Path：`/meme-analyzer`
- 特性：无 token 验证、无积分机制（需完善）

---

## 常见问题

**Q: 子应用无法访问，报 502？**
A: 检查：1) PM2 服务是否运行 `pm2 list`；2) 端口是否正确；3) Nginx 配置是否添加

**Q: token 验证失败？**
A: 检查：1) URL 是否包含 `token` 参数；2) token 是否过期；3) 主站 API 是否正常

**Q: 积分已扣除但 LLM 调用失败？**
A: 应先检查积分，积分不足时不调用 LLM。调用失败时积分不扣除。

**Q: 如何添加新的技能到现有平台？**
A: 以 unified-skills 为例：
1. 在 `src/lib/skills-config.json` 添加技能配置
2. 确保技能目录有对应的 SKILL.md（如需要）
3. 重新构建部署

---

## 注意事项

1. **basePath 必须与 Nginx 配置一致**
   - next.config.js 中的 `basePath: '/my-new-app'`
   - Nginx 中的 `location /my-new-app`
   - URL 中的路径三者一致

2. **token 安全**
   - token 通过 URL 参数传递，前端可访问
   - API 请求时需在 Header 中传递 `Authorization: Bearer xxx`
   - 不要将 token 暴露给第三方

3. **积分原子性**
   - 先检查积分，再调用 LLM，最后扣除
   - LLM 调用失败时不扣除积分
   - 使用 try-catch 确保异常情况处理

4. **API 地址硬编码**
   - 当前使用 `http://47.112.29.121` 硬编码
   - 建议通过环境变量配置
