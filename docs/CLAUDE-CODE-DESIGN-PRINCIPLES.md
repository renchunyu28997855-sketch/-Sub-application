# Claude Code 架构设计原理总结

> 基于 F:/develop/app/claude-code 源码分析

---

## 目录

1. [整体架构](#1-整体架构)
2. [Agent 系统](#2-agent-系统)
3. [工具系统](#3-工具系统)
4. [状态管理](#4-状态管理)
5. [消息传递](#5-消息传递)
6. [技能/命令系统](#6-技能命令系统)
7. [TUI 交互系统](#7-tui-交互系统)
8. [通信协议](#8-通信协议)
9. [成本追踪](#9-成本追踪)
10. [关键设计模式](#10-关键设计模式)

---

## 1. 整体架构

### 1.1 核心分层

```
┌─────────────────────────────────────────────┐
│            React Components (UI层)           │
├─────────────────────────────────────────────┤
│         AppState + Context (状态层)          │
├─────────────────────────────────────────────┤
│     QueryEngine + Tool Executor (逻辑层)      │
├─────────────────────────────────────────────┤
│   Services (API/MCP/Bridge) (通信层)         │
├─────────────────────────────────────────────┤
│     Ink Reconciler + Yoga Layout (渲染层)     │
└─────────────────────────────────────────────┘
```

### 1.2 双模式运行

| 模式 | 技术栈 | 用途 |
|------|--------|------|
| **终端 TUI** | React + Ink + Yoga | 完整命令行交互界面 |
| **桌面端** | Electron + Vue 3 | 图形化聊天界面 |

### 1.3 核心技术选型

| 组件 | 技术 | 作用 |
|------|------|------|
| UI框架 | React 18+ | 声明式组件 |
| TUI引擎 | Ink | 类React终端渲染 |
| 布局引擎 | Yoga (Facebook) | Flexbox布局 |
| 状态管理 | 自实现Store | 轻量Redux-like |
| 通信 | HTTP REST + WebSocket + SSE | API调用 |
| 协议 | MCP + LSP | 扩展协议 |

---

## 2. Agent 系统

### 2.1 Agent 架构模式

**采用 ReAct (Reasoning + Acting) 模式**

```
while (true):
  1. Assistant 生成 (Reasoning) → 包含 tool_use blocks
  2. 工具执行 (Acting) → runTools() 执行工具
  3. 工具结果收集 (Observation) → tool_result blocks
  4. 重复直到 stop_reason != 'tool_use'
```

### 2.2 Agent 类型

| Agent类型 | 用途 | 特点 |
|-----------|------|------|
| `Explore` | 快速代码库探索 | 只读、haiku模型、快速返回 |
| `Plan` | 软件架构规划 | 只读、详细实现计划 |
| `Verification` | 验证实现正确性 | 只读、adversarial probing |
| `GeneralPurpose` | 通用任务执行 | 完整工具集 |
| `worker` | 协调器模式下的工作代理 | 受限工具集 |

### 2.3 多Agent协作机制

**两种并行化模式：**

1. **Fork 子代理** - 轻量级fork，继承父代理完整上下文，通过prompt cache共享
2. **Coordinator 协调器** - 任务分解 + 并行worker + 结果综合

**四阶段工作流：**

| Phase | 执行者 | 目的 |
|-------|--------|------|
| Research | Workers (并行) | 调查代码库、理解问题 |
| Synthesis | Coordinator | 阅读发现、制定实现规范 |
| Implementation | Workers | 根据规范进行修改 |
| Verification | Workers | 测试验证变更 |

### 2.4 上下文管理策略

1. **Auto-Compact** - 自动压缩消息历史
2. **Micro-Compact** - 工具结果裁剪（保留hash）
3. **Context Collapse** - 折叠相似消息
4. **Snip** - 激进的历史截断

---

## 3. 工具系统

### 3.1 核心抽象

**工具接口 (Tool.ts)**

```typescript
type Tool<Input, Output, P> = {
  name: string
  aliases?: string[]                    // 向后兼容
  inputSchema: Input                   // 输入Schema
  outputSchema?: z.ZodType             // 输出Schema

  // 核心方法
  call(args, context, canUseTool, parentMessage, onProgress): Promise<ToolResult>
  description(input, options): Promise<string>
  prompt(options): Promise<string>

  // 能力标志
  isConcurrencySafe(input): boolean
  isReadOnly(input): boolean
  isDestructive?(input): boolean

  // 权限验证
  checkPermissions(input, context): Promise<PermissionResult>
  validateInput?(input, context): Promise<ValidationResult>

  // UI渲染
  renderToolResultMessage(content, progress, options): React.ReactNode
  renderToolUseMessage(input, options): React.ReactNode
}
```

### 3.2 工厂函数模式

```typescript
const TOOL_DEFAULTS = {
  isEnabled: () => true,
  isConcurrencySafe: () => false,
  isReadOnly: () => false,
  isDestructive: () => false,
  checkPermissions: (input) => ({ behavior: 'allow', updatedInput: input }),
}

export function buildTool<D>(def: D): BuiltTool<D> {
  return { ...TOOL_DEFAULTS, ...def }
}
```

### 3.3 工具池组装

```typescript
function assembleToolPool(permissionContext, mcpTools): Tools {
  // 1. 获取内置工具 → 过滤拒绝规则
  // 2. 获取MCP工具 → 过滤拒绝规则
  // 3. 按名称排序（保持prompt cache稳定性）
  // 4. 去重（内置优先）
  return uniqBy([...builtInTools, ...allowedMcpTools], 'name')
}
```

### 3.4 权限安全模型

**分层权限检查：**

```
工具级过滤 → 内容匹配 → 分类器 → Hook拦截 → 用户提示
```

**权限决策类型：**

```typescript
type PermissionDecision =
  | { behavior: 'allow', updatedInput? }
  | { behavior: 'ask', message, suggestions? }
  | { behavior: 'deny', message }
  | { behavior: 'passthrough' }  // 传递到下一层
```

### 3.5 核心工具集

| 工具 | 用途 |
|------|------|
| `AgentTool` | 创建子代理 |
| `BashTool` | Shell命令执行 |
| `FileEditTool` | 代码编辑 |
| `FileReadTool` | 文件读取 |
| `GlobTool` | 文件搜索 |
| `GrepTool` | 内容搜索 |
| `SkillTool` | 技能执行 |
| `WebFetchTool` | 网页获取 |
| `WebSearchTool` | 网络搜索 |
| `Task*Tool` | 任务管理 |

---

## 4. 状态管理

### 4.1 Store 模式

**自实现轻量Store（非Redux）**

```typescript
type Store<T> = {
  getState: () => T
  setState: (updater: (prev: T) => T) => void
  subscribe: (listener: Listener) => () => void
}
```

### 4.2 核心设计

| 特性 | 实现 |
|------|------|
| **不可变性** | 函数式更新 `(prev: T) => T` |
| **优化** | `Object.is(next, prev)` 短路无效更新 |
| **订阅** | `Set<Listener>` 支持多监听器 |
| **React集成** | `useSyncExternalStore` |

### 4.3 状态持久化

**onChangeAppState 作为唯一side-effect出口：**

```typescript
onChangeAppState(oldState, newState) {
  // 权限模式同步
  notifyPermissionModeChanged()
  // 设置持久化
  saveSettings(newState)
  // 全局配置更新
  updateGlobalConfig()
  // 通知SDK
  notifySessionMetadataChanged()
}
```

### 4.4 历史记录持久化

| 策略 | 说明 |
|------|------|
| **格式** | JSONL (每行一个JSON) |
| **路径** | `~/.claude/history.jsonl` |
| **缓冲** | 内存缓冲 + 延迟刷写 |
| **锁** | 文件锁防止并发冲突 |
| **回滚** | `removeLastFromHistory()` 支持撤销 |

---

## 5. 消息传递

### 5.1 两层消息系统

**Signal（轻量级事件）：**

```typescript
function createSignal<Args>() = {
  subscribe(listener): () => void  // 返回取消订阅
  emit(...args): void
  clear(): void
}
```

**Mailbox（消息队列）：**

```typescript
class Mailbox {
  queue: Message[]      // 消息缓冲
  waiters: Waiter[]     // 等待的Promise

  send(msg: Message): void      // 立即匹配或入队
  receive(fn): Promise<Message> // 阻塞等待
  poll(fn): Message | undefined // 非阻塞获取
}
```

### 5.2 消息源类型

```typescript
type MessageSource = 'user' | 'teammate' | 'system' | 'tick' | 'task'
```

### 5.3 匹配策略

- `findIndex` 谓词匹配
- First-match 策略
- 两种消费模式：`receive()` 阻塞、`poll()` 非阻塞

---

## 6. 技能/命令系统

### 6.1 技能注册优先级

```
bundledSkills → builtinPluginSkills → skillDirCommands
→ workflowCommands → pluginCommands → pluginSkills → builtInCommands
```

### 6.2 技能类型

| 类型 | 来源 | `loadedFrom` |
|------|------|--------------|
| 内置技能 | `src/skills/bundled/` | `'bundled'` |
| 用户技能 | `.claude/skills/` | `'skills'` |
| 插件技能 | 插件目录 | `'plugin'` |
| MCP技能 | MCP服务器 | `'mcp'` |

### 6.3 SKILL.md Frontmatter

```yaml
---
name: skill-name
description: 技能描述
allowed-tools: [BashTool, ReadTool]  # 可选，限制工具
model: haiku  # 可选，指定模型
context: fork  # inline | fork - 执行模式
agent: Bash   # fork模式下的代理类型
effort: medium
user-invocable: true  # 用户可直接调用
disable-model-invocation: false
when_to_use: 何时使用
argument-hint: <arg>
---
```

### 6.4 执行模式

| 模式 | 说明 |
|------|------|
| **Inline** | 技能内容展开到当前对话上下文 |
| **Fork** | 在独立子代理中执行，有独立token预算 |

### 6.5 插件系统

**非沙箱隔离** - 插件运行在主进程上下文

```
my-plugin/
├── plugin.json           # 清单
├── commands/             # 命令(.md)
├── skills/               # 技能(SKILL.md)
├── agents/               # 代理定义
├── hooks/                # Hook配置
└── output-styles/        # 输出样式
```

---

## 7. TUI 交互系统

### 7.1 渲染架构

```
React Component Tree
    ↓
Ink DOM (类DOM结构)
    ↓
Yoga Layout Engine (Flexbox)
    ↓
Screen Buffer (差异计算)
    ↓
ANSI Terminal Output
```

### 7.2 组件层次

| 层次 | 位置 | 组件 |
|------|------|------|
| 基础组件 | `ink/components/` | Box, Text, Link, Button, Spacer, ScrollBox |
| 业务组件 | `components/` | agents/, App.tsx |
| 屏幕组件 | `screens/` | REPL.tsx, ResumeConversation.tsx, Doctor.tsx |

### 7.3 输入处理流水线

```
Terminal Keypress → stdin → InputEvent → Dispatcher → Event Handlers
    ↓
React State Update → Re-render
```

### 7.4 键绑定系统

**配置驱动的声明式绑定：**

```typescript
{
  context: 'Chat',
  bindings: {
    'escape': 'chat:cancel',
    'enter': 'chat:submit',
    'up': 'history:previous',
    'ctrl+r': 'history:search',
  }
}
```

**解析器** - `resolveKey()` 支持：
- Context优先级
- Chord (多键序列)
- 修饰符 (ctrl, shift, meta)

### 7.5 渲染优化

| 优化 | 说明 |
|------|------|
| **Diff计算** | Patch差异列表 |
| **Yoga缓存** | 测量结果缓存 |
| **脏值检测** | `markDirty()` 标记节点及祖先 |
| **滚动优化** | 每帧最大滚动行数限制 |

---

## 8. 通信协议

### 8.1 多Provider支持

| Provider | 环境变量 | 特点 |
|----------|----------|------|
| Direct API | `ANTHROPIC_API_KEY` | 官方API |
| AWS Bedrock | `CLAUDE_CODE_USE_BEDROCK` | AWS区域部署 |
| Azure Foundry | `CLAUDE_CODE_USE_FOUNDRY` | Azure云 |
| Google Vertex | `CLAUDE_CODE_USE_VERTEX` | GCP云 |
| MiniMax | `CLAUDE_CODE_USE_MINIMAX` | 国内兼容 |
| llama.cpp | `CLAUDE_CODE_USE_LLAMACPP` | 本地模型 |

### 8.2 MCP协议实现

**传输类型：**

```typescript
Transport = 'stdio' | 'sse' | 'sse-ide' | 'http' | 'ws' | 'sdk'
```

**核心特性：**
- OAuth认证支持
- 会话缓存 + 15分钟TTL
- 批量重连 (`pMap` 并发)
- 自动重试

### 8.3 错误处理

**指数退避 + 抖动：**

```typescript
BASE_DELAY_MS = 500
delay = min(BASE_DELAY_MS * 2^(attempt-1) + jitter, 32000)
```

**区分处理：**

| 错误 | 处理 |
|------|------|
| 529 Overloaded | 前台重试，3次后切模型 |
| 429 Rate Limit | 非订阅用户重试 |
| 401/403 | 清除凭证缓存并重试 |
| SSL错误 | 提供修复提示 |

### 8.4 Bridge系统

**双模式架构：**
- Env-based模式 - 完整环境生命周期
- Env-less模式 - 直接session连接

**轮询配置：**

```typescript
// 非满负荷：2秒
POLL_INTERVAL_MS_NOT_AT_CAPACITY = 2000
// 满负荷：10分钟
POLL_INTERVAL_MS_AT_CAPACITY = 600000
// 心跳：120秒
session_keepalive_interval_v2_ms = 120000
```

---

## 9. 成本追踪

### 9.1 分层定价

| Tier | 模型 | 输入 | 输出 |
|------|------|------|------|
| 3_15 | Sonnet | $3/M | $15/M |
| 15_75 | Opus 4/4.1 | $15/M | $75/M |
| 5_25 | Opus 4.5 | $5/M | $25/M |
| 30_150 | Fast Opus 4.6 | $30/M | $150/M |

### 9.2 成本计算

```typescript
总成本 = input_tokens * 单价
       + output_tokens * 单价
       + cache_read_input_tokens * 缓存读取单价
       + cache_creation_input_tokens * 缓存创建单价
       + web_search_requests * 搜索单价
```

### 9.3 预算控制

- **会话级持久化** - 写入 `.claude/settings.json`
- **会话恢复** - 跨会话累计成本
- **模型级追踪** - 每个模型独立计量
- **Fast模式** - 独立定价层

---

## 10. 关键设计模式

### 10.1 设计模式汇总

| 模式 | 应用场景 |
|------|----------|
| **ReAct** | Agent主循环 |
| **Factory** | `buildTool()` 工具构建 |
| **Observer** | Store订阅机制 |
| **Pipeline** | 工具执行链 |
| **Strategy** | 权限检查策略 |
| **Decorator** | 工具能力扩展 |
| **Façade** | Bridge系统封装 |

### 10.2 核心设计原则

| 原则 | 实现 |
|------|------|
| **失败安全** | 工具默认关闭权限 |
| **零成本抽象** | TypeScript条件类型 + 工厂函数 |
| **条件编译** | `feature()` 标志实现DCE |
| **可组合性** | 工具可嵌套调用 |
| **权限分层** | 多层检查 + Hook拦截 |
| **UI解耦** | 渲染与逻辑分离 |
| **Cache友好** | 工具排序确保prompt cache稳定 |
| **事件驱动** | Signal + Mailbox双层事件 |

### 10.3 性能优化策略

1. **短路更新** - `Object.is` 相等检测
2. **增量读取** - `outputOffset` 任务输出
3. **懒加载** - `require()` 延迟导入
4. **特征门控** - `feature('FLAG')` 条件加载
5. **批处理** - `pMap` 并发连接
6. **缓存** - memoize + 缓存失效

### 10.4 扩展性设计

| 扩展点 | 方式 |
|--------|------|
| **新工具** | 实现Tool接口 + 注册 |
| **新Provider** | 实现ApiProvider接口 |
| **新技能** | SKILL.md + frontmatter |
| **新MCP Server** | MCP SDK标准协议 |
| **新UI组件** | Ink组件 + React |

---

## 附录：文件结构

```
src/
├── Tool.ts              # 工具接口定义
├── tools.ts             # 工具注册组装
├── tools/               # 工具实现
│   ├── AgentTool/
│   ├── BashTool/
│   ├── MCPTool/
│   ├── SkillTool/
│   └── ...
├── query.ts             # ReAct主循环
├── QueryEngine.ts       # 查询引擎
├── coordinator/         # 协调器模式
├── assistant/           # 助手系统
├── state/               # 状态管理
├── context.ts           # 上下文
├── history.ts           # 历史记录
├── skills/              # 技能系统
├── commands.ts           # 命令系统
├── setup.ts             # 初始化
├── cost-tracker.ts      # 成本追踪
├── services/            # API通信
│   ├── api/
│   ├── mcp/
│   └── compact/
├── ink/                  # Ink渲染引擎
├── components/           # React组件
├── screens/              # 屏幕组件
└── keybindings/          # 键绑定
```
