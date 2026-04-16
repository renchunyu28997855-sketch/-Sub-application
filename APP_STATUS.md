# 子应用现状与待完善事项

本文档记录 `F:\develop\app` 目录下各子应用的功能现状和待完善问题。

---

## 应用功能对比

| 功能 | unified-skills | manufacturing-skills | meme-analyzer |
|------|----------------|---------------------|---------------|
| Token 验证 | ✅ | ✅ | ❌ |
| 积分检查 | ✅ | ✅ | ❌ |
| 积分扣除 | ✅ | ❌ | ❌ |
| basePath | /unified-skills | /manufacturing-skills | /meme-analyzer |
| 端口 | 3021 | 3020 | 3003 |

---

## 待完善问题

### 1. meme-analyzer - 缺少认证和积分

**问题：**
- 无 token 验证，任何人可直接访问
- 无积分检查和扣除

**修复方案：**

1. 在 `InputForm.tsx` 中添加 token 验证：
```typescript
// 在组件开头添加
const [token, setToken] = useState<string | null>(null)

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const tokenParam = params.get('token')

  if (!tokenParam) {
    window.location.href = 'http://47.112.29.121/'
    return
  }

  setToken(tokenParam)

  fetch('http://47.112.29.121/api/auth/me', {
    headers: { Authorization: `Bearer ${tokenParam}` },
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
```

2. 在 `api/analyze/route.ts` 中添加积分检查和扣除：
```typescript
// 检查积分
if (token) {
  const creditResponse = await fetch('http://47.112.29.121/api/credit/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ appId: 'meme-analyzer' }),
  })
  // ... 积分不足处理
}

// 调用 LLM 后扣除积分
if (token) {
  await fetch('http://47.112.29.121/api/credit/consume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ appId: 'meme-analyzer', description: '使用 AI 工作诊断' }),
  })
}
```

3. 修改前端提交时传递 token：
```typescript
// 在 InputForm.tsx 的 handleSubmit 中
const res = await fetch('/meme-analyzer/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,  // 添加这行
  },
  body: JSON.stringify({ ...inputData, token }),
})
```

---

### 2. manufacturing-skills - 缺少积分扣除

**问题：**
- 有积分检查，但调用 LLM 成功后没有扣除积分

**修复方案：**

在 `src/app/api/analyze/route.ts` 的成功分支添加积分扣除：

```typescript
// 分析成功后扣除积分
if (token) {
  try {
    const appId = skillId.startsWith('skill-') ? skillId : `skill-${skillId}`
    await fetch('http://47.112.29.121/api/credit/consume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ appId, description: `使用技能: ${skillId}` }),
    })
  } catch (consumeErr) {
    console.error('Credit consume error:', consumeErr)
  }
}
```

---

## 数据库 App 记录参考

现有子应用的数据库注册信息：

```sql
-- unified-skills (部分示例)
INSERT INTO "App" (id, name, description, icon, url, "groupId", "categoryId", "isActive", "creditCost", "isDefault", price, config, "createdAt") VALUES
('writing-blog-writer', 'Blog Writer', '写作Writing - Blog Writer', '✍️', 'http://47.112.29.121/unified-skills/?skill=blog-writer', '7802c491-29b8-472b-b1c0-c200e5c76276', '0f2915c3-84fa-4539-aa79-4f0e72f2aab8', true, 100, false, 0, '{}', NOW())

-- manufacturing-skills (部分示例)
INSERT INTO "App" (id, name, description, icon, url, "groupId", "categoryId", "isActive", "creditCost", "isDefault", price, config, "createdAt") VALUES
('carbon-emission-calculation', '碳排放计算', '制造业 - 碳排放计算', '🏭', 'http://47.112.29.121/manufacturing-skills/?skill=carbon-emission-calculation', '7802c491-29b8-472b-b1c0-c200e5c76276', '0f2915c3-84fa-4539-aa79-4f0e72f2aab8', true, 100, false, 0, '{}', NOW())

-- meme-analyzer
INSERT INTO "App" (id, name, description, icon, url, "groupId", "categoryId", "isActive", "creditCost", "isDefault", price, config, "createdAt") VALUES
('meme-analyzer', 'AI 工作诊断', 'AI 工作诊断系统', '🔍', 'http://47.112.29.121/meme-analyzer/', '7802c491-29b8-472b-b1c0-c200e5c76276', '0f2915c3-84fa-4539-aa79-4f0e72f2aab8', true, 100, false, 0, '{}', NOW())
```

---

## 固定 ID 说明

- **groupId**: `7802c491-29b8-472b-b1c0-c200e5c76276` - 应用分组
- **categoryId**: `0f2915c3-84fa-4539-aa79-4f0e72f2aab8` - 技能分类

这两个 ID 是固定的，用于在 AI Portal 中分类显示。
