# 子应用开发指南

本文档说明子应用如何对接 AI 应用中心的 LLM 大模型配置。

---

## 一、获取 AppId 和 LLM 配置

### 1. 获取应用列表（包含 AppId）

```
GET /api/apps
```

返回示例：

```json
{
  "success": true,
  "data": [
    {
      "id": "clxabc123456",
      "name": "文章重写",
      "description": "使用 LLM 重写文章内容",
      "icon": "article",
      "url": "http://localhost:3000",
      "groupId": "grp1",
      "categoryId": "cat1",
      "llmConfigId": "llm1"
    }
  ]
}
```

### 2. 获取指定应用的 LLM 配置

```
GET /api/llm/config?appId=你的AppId
```

返回示例：

```json
{
  "success": true,
  "data": {
    "id": "llm1",
    "name": "OpenAI GPT-4",
    "provider": "openai",
    "baseUrl": "https://api.openai.com/v1",
    "apiKey": "sk-xxxxx",
    "model": "gpt-4",
    "temperature": 1.0,
    "maxTokens": 2000
  }
}
```

**逻辑说明**：
- 如果应用关联了特定的 `llmConfigId`，返回该配置
- 如果没有关联，返回全局默认配置（`isDefault=true` 且 `isActive=true`）

---

## 二、调用 LLM

获取配置后，使用 OpenAI 兼容格式调用：

```typescript
async function callLLM(config: LLMConfig, messages: Message[]) {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4',
      messages,
      temperature: config.temperature ?? 1.0,
      max_tokens: config.maxTokens ?? 2000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// 使用示例
const config = await getAppLlmConfig('你的AppId');
const result = await callLLM(config, [
  { role: 'system', content: '你是一个文章重写助手' },
  { role: 'user', content: '请重写这篇文章：...' }
]);
```

### 方式二：通过 LLM 代理接口（推荐）

子应用可以通过代理接口调用 LLM，避免在前端暴露 API key：

```typescript
// 1. 登录获取 token
const loginRes = await fetch('http://47.112.29.121/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});
const { token } = await loginRes.json();

// 2. 调用 LLM 代理接口
const llmRes = await fetch('http://47.112.29.121/api/llm/proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    appId: '你的AppId',
    messages: [
      { role: 'system', content: '你是一个文章重写助手' },
      { role: 'user', content: '请将下文改写得更简洁：今天天气非常好' }
    ]
  })
});
const result = await llmRes.json();
const content = result.choices?.[0]?.message?.content;
```

---

## 三、完整接入示例

### Node.js / TypeScript

```typescript
const axios = require('axios');

const PORTAL_URL = 'http://localhost:3002'; // AI 应用中心地址

/**
 * 获取应用的 LLM 配置
 */
async function getAppLlmConfig(appId: string) {
  const response = await axios.get(`${PORTAL_URL}/api/llm/config`, {
    params: { appId }
  });
  if (!response.data.success) {
    throw new Error('获取 LLM 配置失败');
  }
  return response.data.data;
}

/**
 * 调用 LLM
 */
async function callLLM(config: any, prompt: string, userMessage: string) {
  const response = await axios.post(
    `${config.baseUrl}/chat/completions`,
    {
      model: config.model || 'gpt-4',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userMessage }
      ],
      temperature: config.temperature ?? 1.0,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      timeout: 120000
    }
  );
  return response.data.choices[0].message.content;
}

// 使用
async function main() {
  const APP_ID = '你的AppId';

  // 1. 获取 LLM 配置
  const llmConfig = await getAppLlmConfig(APP_ID);
  console.log('使用模型:', llmConfig.model);

  // 2. 调用 LLM
  const result = await callLLM(
    llmConfig,
    '你是一个专业的文章重写助手',
    '请将下文改写得更简洁：今天天气非常好，阳光明媚'
  );
  console.log('结果:', result);
}

main();
```

### 前端 JavaScript

```javascript
const PORTAL_URL = 'http://localhost:3002';

/ async function getAppLlmConfig(appId) {
  const response = await fetch(`${PORTAL_URL}/api/llm/config?appId=${appId}`);
  const data = await response.json();
  return data.data;
}

async function rewriteArticle(appId, article) {
  const config = await getAppLlmConfig(appId);

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: '你是一个文章重写助手' },
        { role: 'user', content: `请重写这篇文章：${article}` }
      ],
      temperature: config.temperature ?? 1.0
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// 使用
rewriteArticle('你的AppId', '原始文章内容...')
  .then(result => console.log(result));
```

---

## 四、应用注册表

| 应用名称 | AppId | 功能说明 |
|----------|-------|----------|
| （待补充） | | |

> 管理员可在「应用管理」中查看和添加应用

---

## 五、相关接口汇总

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/apps | 获取所有应用列表 |
| GET | /api/apps/:id | 获取应用详情 |
| GET | /api/llm/config?appId=xxx | 获取应用的 LLM 配置（公开） |
| POST | /api/llm/proxy | LLM 代理调用接口（需登录） |

---

## 六、注意事项

1. **API Key 安全**：返回的 `apiKey` 已经是解密后的，调用时请勿在客户端直接暴露
2. **超时处理**：建议设置 120s 超时，避免长文本处理时超时
3. **Fallback 逻辑**：如果应用未关联特定 LLM 配置，系统会自动返回全局默认配置
4. **模型兼容性**：仅支持 OpenAI 兼容格式的 LLM API
5. **代理调用**（推荐）：子应用应使用 `/api/llm/proxy` 接口代理 LLM 调用，避免暴露敏感信息

---

## 七、问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 获取配置返回 null | AppId 不存在 | 检查 /api/apps 返回的 id |
| API 调用失败 | apiKey 无效或过期 | 联系管理员检查 LLM 配置 |
| 模型不支持 | 使用了不支持的参数 | 确保使用 OpenAI 兼容格式 |
