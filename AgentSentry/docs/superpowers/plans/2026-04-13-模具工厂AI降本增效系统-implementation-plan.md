# 模具工厂 AI 降本增效系统 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建完整的模具工厂 AI 降本增效系统，包含 12 部门 Agent 协作可视化 Dashboard + AI 方案生成器 + PDF 导出

**Architecture:** 纯前端多文件架构，Canvas 粒子可视化 + 事件驱动 Agent 模拟 + 模板引擎报告生成。科技工业风 UI，深蓝背景 + 霓虹青绿粒子。

**Tech Stack:** HTML5 + CSS3 + Vanilla JS, Canvas API, ECharts, jsPDF + html2canvas, LocalStorage

---

## 文件清单

| 文件 | 职责 |
|------|------|
| `index.html` | 主入口，HTML 结构 + 内嵌样式 |
| `css/dashboard.css` | 科技工业风样式（颜色、布局、动效） |
| `js/app.js` | 主应用逻辑，Tab 切换，数据管理 |
| `js/canvas/renderer.js` | Canvas 渲染引擎，动画循环 |
| `js/canvas/particles.js` | 粒子系统（粒子生成、移动、连线） |
| `js/canvas/nodes.js` | 12 部门节点渲染（环形状态指示器） |
| `js/engine/eventBus.js` | 事件总线（订阅/发布） |
| `js/engine/agents.js` | 12 部门 Agent 状态机 + 消息处理 |
| `js/engine/businessFlow.js` | 业务流程模拟（订单流、事件触发） |
| `js/report/generator.js` | AI 报告生成器（基于模板填充） |
| `js/report/templates.js` | 方案模板（Markdown 格式） |
| `js/utils/pdf.js` | PDF 导出（html2canvas + jsPDF） |

---

## 开发任务

### Task 1: 项目框架与样式基础

**Files:**
- Create: `index.html`
- Create: `css/dashboard.css`
- Create: `js/app.js`

- [ ] **Step 1: 创建 index.html 基础结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模具工厂 AI 大脑</title>
    <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
    <div id="app">
        <!-- 顶部导航 -->
        <header class="header">
            <div class="logo">
                <span class="logo-icon">⚙</span>
                <span class="logo-text">模具工厂 AI 大脑</span>
            </div>
            <div class="header-controls">
                <span id="clock" class="clock"></span>
                <div class="tab-switch">
                    <button class="tab-btn active" data-tab="dashboard">工厂大脑</button>
                    <button class="tab-btn" data-tab="report">AI 方案生成</button>
                </div>
            </div>
        </header>

        <!-- Dashboard 视图 -->
        <section id="dashboard-view" class="view active">
            <div class="dashboard-container">
                <!-- Canvas 可视化区域 -->
                <div class="canvas-wrapper">
                    <canvas id="mainCanvas"></canvas>
                </div>
                <!-- 右侧数据面板 -->
                <aside class="data-panel">
                    <div class="panel-header">实时数据</div>
                    <div id="stats-grid" class="stats-grid"></div>
                    <div class="panel-header mt">事件流</div>
                    <div id="event-feed" class="event-feed"></div>
                </aside>
            </div>
            <!-- 底部状态栏 -->
            <footer class="status-bar">
                <div class="status-item">
                    <span class="status-dot online"></span>
                    <span>系统正常</span>
                </div>
                <div class="status-item">
                    <span id="agent-count">12 Agent 在线</span>
                </div>
                <div class="status-item">
                    <span id="fps-counter">60 FPS</span>
                </div>
            </footer>
        </section>

        <!-- AI 方案生成视图 -->
        <section id="report-view" class="view">
            <div class="report-container">
                <div class="report-form">
                    <h2>工厂基本信息</h2>
                    <form id="factory-form">
                        <div class="form-group">
                            <label>工厂名称</label>
                            <input type="text" name="factoryName" placeholder="XX模具工厂">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>员工人数</label>
                                <input type="number" name="employeeCount" required>
                            </div>
                            <div class="form-group">
                                <label>厂房面积 (㎡)</label>
                                <input type="text" name="factoryArea" placeholder="5000">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>年产值 (万元)</label>
                                <input type="number" name="annualOutput" required>
                            </div>
                            <div class="form-group">
                                <label>净利润率 (%)</label>
                                <input type="number" name="profitRate" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>主要产品类型</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" name="products" value="injection"> 注塑模具</label>
                                <label><input type="checkbox" name="products" value="stamping"> 冲压模具</label>
                                <label><input type="checkbox" name="products" value="diecasting"> 压铸模具</label>
                                <label><input type="checkbox" name="products" value="other"> 其他</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>核心痛点（最多选2个）</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" name="painPoints" value="production"> 生产效率低/交期不准</label>
                                <label><input type="checkbox" name="painPoints" value="quality"> 产品质检问题</label>
                                <label><input type="checkbox" name="painPoints" value="equipment"> 设备突发故障</label>
                                <label><input type="checkbox" name="painPoints" value="inventory"> 原材料/库存混乱</label>
                                <label><input type="checkbox" name="painPoints" value="decision"> 报表/决策缺数据</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>预算范围</label>
                            <div class="radio-group">
                                <label><input type="radio" name="budget" value="low"> 低（<5万）</label>
                                <label><input type="radio" name="budget" value="medium"> 中（5-30万）</label>
                                <label><input type="radio" name="budget" value="high"> 高（>30万）</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>期望周期</label>
                            <div class="radio-group">
                                <label><input type="radio" name="timeline" value="fast"> 1个月内</label>
                                <label><input type="radio" name="timeline" value="medium"> 3-6个月</label>
                                <label><input type="radio" name="timeline" value="long"> 半年以上</label>
                            </div>
                        </div>
                        <button type="submit" class="btn-primary">生成 AI 方案</button>
                    </form>
                </div>
                <div class="report-preview">
                    <div class="preview-header">
                        <h2>方案预览</h2>
                        <div class="preview-actions">
                            <button id="btn-save" class="btn-secondary">保存</button>
                            <button id="btn-export-pdf" class="btn-primary">导出 PDF</button>
                        </div>
                    </div>
                    <div id="report-content" class="report-content">
                        <p class="placeholder">填写左侧表单，点击"生成 AI 方案"开始</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <script src="js/app.js" type="module"></script>
</body>
</html>
```

- [ ] **Step 2: 创建 css/dashboard.css 科技工业风样式**

```css
/* ===== CSS Variables ===== */
:root {
    --bg-primary: #0a0e17;
    --bg-secondary: #111827;
    --bg-card: #1a2332;
    --color-primary: #00d4ff;
    --color-accent: #00ff88;
    --color-warning: #ff6b35;
    --color-danger: #ff3366;
    --text-primary: #e0e6ed;
    --text-secondary: #8b9cb3;
    --border-color: #2a3a50;
    --glow-primary: 0 0 20px rgba(0, 212, 255, 0.5);
    --glow-accent: 0 0 20px rgba(0, 255, 136, 0.5);
}

/* ===== Reset & Base ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
}

/* ===== Header ===== */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo-icon {
    font-size: 1.75rem;
    color: var(--color-primary);
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
}

.logo-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 0.05em;
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.clock {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-family: 'Consolas', monospace;
}

.tab-switch {
    display: flex;
    background: var(--bg-card);
    border-radius: 8px;
    padding: 4px;
}

.tab-btn {
    padding: 0.5rem 1.25rem;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.9rem;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.tab-btn.active {
    background: var(--color-primary);
    color: var(--bg-primary);
    font-weight: 600;
}

/* ===== Dashboard View ===== */
.view { display: none; }
.view.active { display: block; }

.dashboard-container {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1rem;
    padding: 1rem;
    height: calc(100vh - 140px);
}

.canvas-wrapper {
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    overflow: hidden;
    position: relative;
}

#mainCanvas {
    width: 100%;
    height: 100%;
    display: block;
}

/* ===== Data Panel ===== */
.data-panel {
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.panel-header {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.75rem;
}

.panel-header.mt { margin-top: 1.5rem; }

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.stat-card {
    background: var(--bg-card);
    border-radius: 8px;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
}

.stat-label {
    font-size: 0.7rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
}

.stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
}

.stat-trend {
    font-size: 0.7rem;
    margin-top: 0.25rem;
}

.stat-trend.up { color: var(--color-accent); }
.stat-trend.down { color: var(--color-danger); }

/* ===== Event Feed ===== */
.event-feed {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.event-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--bg-card);
    border-radius: 6px;
    font-size: 0.75rem;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
}

.event-time {
    color: var(--text-secondary);
    font-family: monospace;
}

.event-icon { flex-shrink: 0; }
.event-icon.alert { color: var(--color-warning); }
.event-icon.success { color: var(--color-accent); }
.event-icon.info { color: var(--color-primary); }

/* ===== Status Bar ===== */
.status-bar {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 0.75rem 2rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    font-size: 0.8rem;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.5rem;
}

.status-dot.online { background: var(--color-accent); box-shadow: var(--glow-accent); }
.status-dot.offline { background: var(--color-danger); }

/* ===== Report View ===== */
.report-container {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 1rem;
    padding: 1rem;
    height: calc(100vh - 80px);
}

.report-form {
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    padding: 1.5rem;
    overflow-y: auto;
}

.report-form h2 {
    font-size: 1rem;
    color: var(--color-primary);
    margin-bottom: 1rem;
}

.form-group { margin-bottom: 1rem; }

.form-group label {
    display: block;
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.form-group input[type="text"],
.form-group input[type="number"] {
    width: 100%;
    padding: 0.75rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    font-size: 0.9rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.checkbox-group,
.radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.checkbox-group label,
.radio-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    cursor: pointer;
}

.checkbox-group input,
.radio-group input {
    accent-color: var(--color-primary);
}

.btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: var(--color-primary);
    color: var(--bg-primary);
    font-weight: 600;
}

.btn-primary:hover {
    box-shadow: var(--glow-primary);
}

.btn-secondary {
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

/* ===== Report Preview ===== */
.report-preview {
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.preview-header h2 {
    font-size: 1rem;
    color: var(--color-primary);
}

.preview-actions {
    display: flex;
    gap: 0.75rem;
}

.report-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    background: var(--bg-primary);
}

.report-content .placeholder {
    color: var(--text-secondary);
    text-align: center;
    margin-top: 3rem;
}

.report-content h1 {
    font-size: 1.75rem;
    color: var(--color-primary);
    margin-bottom: 1.5rem;
    text-align: center;
}

.report-content h2 {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin: 1.5rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
}

.report-content h3 {
    font-size: 1rem;
    color: var(--color-accent);
    margin: 1rem 0 0.5rem;
}

.report-content p, .report-content li {
    font-size: 0.9rem;
    line-height: 1.8;
    color: var(--text-secondary);
}

.report-content ul {
    padding-left: 1.5rem;
}

.report-content li { margin-bottom: 0.5rem; }

.report-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

.report-content th,
.report-content td {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    text-align: left;
}

.report-content th {
    background: var(--bg-card);
    color: var(--color-primary);
}
```

- [ ] **Step 3: 创建 js/app.js 主应用逻辑**

```javascript
// js/app.js
import { Renderer } from './canvas/renderer.js';
import { EventBus } from './engine/eventBus.js';
import { AgentSystem } from './engine/agents.js';
import { BusinessFlow } from './engine/businessFlow.js';
import { ReportGenerator } from './report/generator.js';

class App {
    constructor() {
        this.currentTab = 'dashboard';
        this.renderer = null;
        this.eventBus = null;
        this.agentSystem = null;
        this.businessFlow = null;
        this.reportGenerator = null;
        this.isRunning = false;
    }

    init() {
        this.bindEvents();
        this.initDashboard();
        this.initReport();
        this.startClock();
        this.loadSavedData();
    }

    bindEvents() {
        // Tab 切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // 表单提交
        document.getElementById('factory-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateReport();
        });

        // 导出 PDF
        document.getElementById('btn-export-pdf').addEventListener('click', () => this.exportPDF());
        document.getElementById('btn-save').addEventListener('click', () => this.saveReport());
    }

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        document.querySelectorAll('.view').forEach(view => {
            view.classList.toggle('active', view.id === `${tab}-view`);
        });

        if (tab === 'dashboard' && !this.isRunning) {
            this.startSimulation();
        }
    }

    initDashboard() {
        const canvas = document.getElementById('mainCanvas');
        this.renderer = new Renderer(canvas);
        this.eventBus = new EventBus();
        this.agentSystem = new AgentSystem(this.eventBus);
        this.businessFlow = new BusinessFlow(this.agentSystem, this.eventBus);

        // 绑定事件到 UI
        this.eventBus.on('statsUpdate', (stats) => this.updateStats(stats));
        this.eventBus.on('event', (event) => this.addEventItem(event));
    }

    initReport() {
        this.reportGenerator = new ReportGenerator();
    }

    startSimulation() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.agentSystem.init();
        this.businessFlow.start();
        this.renderer.start();
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            document.getElementById('clock').textContent =
                now.toLocaleTimeString('zh-CN', { hour12: false });
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    updateStats(stats) {
        const grid = document.getElementById('stats-grid');
        grid.innerHTML = stats.map(s => `
            <div class="stat-card">
                <div class="stat-label">${s.label}</div>
                <div class="stat-value">${s.value}</div>
                <div class="stat-trend ${s.trend > 0 ? 'up' : 'down'}">
                    ${s.trend > 0 ? '↑' : '↓'} ${Math.abs(s.trend).toFixed(1)}%
                </div>
            </div>
        `).join('');
    }

    addEventItem(event) {
        const feed = document.getElementById('event-feed');
        const item = document.createElement('div');
        item.className = 'event-item';
        const iconClass = event.type === 'alert' ? 'alert' : event.type === 'success' ? 'success' : 'info';
        const icons = { alert: '⚠', success: '✓', info: 'ℹ' };
        item.innerHTML = `
            <span class="event-time">${event.time}</span>
            <span class="event-icon ${iconClass}">${icons[event.type]}</span>
            <span>${event.message}</span>
        `;
        feed.insertBefore(item, feed.firstChild);
        // 保留最近 20 条
        while (feed.children.length > 20) {
            feed.removeChild(feed.lastChild);
        }
    }

    async generateReport() {
        const form = document.getElementById('factory-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.products = [...form.querySelectorAll('input[name="products"]:checked')].map(i => i.value);
        data.painPoints = [...form.querySelectorAll('input[name="painPoints"]:checked')].map(i => i.value);

        const content = this.reportGenerator.generate(data);
        document.getElementById('report-content').innerHTML = content;

        // 保存到 LocalStorage
        localStorage.setItem('factoryData', JSON.stringify(data));
        localStorage.setItem('lastReport', content);
    }

    async exportPDF() {
        const { exportToPDF } = await import('./utils/pdf.js');
        const content = document.getElementById('report-content');
        await exportToPDF(content);
    }

    saveReport() {
        const content = document.getElementById('report-content').innerHTML;
        localStorage.setItem('lastReport', content);
        alert('报告已保存');
    }

    loadSavedData() {
        const saved = localStorage.getItem('lastReport');
        if (saved) {
            document.getElementById('report-content').innerHTML = saved;
        }
    }
}

// 启动应用
window.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    app.startSimulation();
});
```

---

### Task 2: Canvas 渲染引擎

**Files:**
- Create: `js/canvas/renderer.js`
- Create: `js/canvas/particles.js`
- Create: `js/canvas/nodes.js`

- [ ] **Step 1: 创建部门节点定义 js/canvas/nodes.js**

```javascript
// js/canvas/nodes.js

export const DEPARTMENTS = [
    {
        id: 'order',
        name: '订单管理',
        x: 0.12,
        y: 0.25,
        status: 'idle', // idle, busy, warning, error
        tasks: 0,
        color: '#00d4ff'
    },
    {
        id: 'design',
        name: '设计部',
        x: 0.28,
        y: 0.25,
        status: 'idle',
        tasks: 0,
        color: '#00d4ff'
    },
    {
        id: 'production',
        name: '生产车间',
        x: 0.44,
        y: 0.25,
        status: 'idle',
        tasks: 0,
        color: '#00ff88'
    },
    {
        id: 'quality',
        name: '质检部门',
        x: 0.60,
        y: 0.25,
        status: 'idle',
        tasks: 0,
        color: '#00ff88'
    },
    {
        id: 'equipment',
        name: '设备维护',
        x: 0.76,
        y: 0.40,
        status: 'idle',
        tasks: 0,
        color: '#ff6b35'
    },
    {
        id: 'energy',
        name: '能源管理',
        x: 0.76,
        y: 0.55,
        status: 'idle',
        tasks: 0,
        color: '#00ff88'
    },
    {
        id: 'warehouse',
        name: '仓储管理',
        x: 0.60,
        y: 0.70,
        status: 'idle',
        tasks: 0,
        color: '#00d4ff'
    },
    {
        id: 'purchase',
        name: '采购部',
        x: 0.44,
        y: 0.70,
        status: 'idle',
        tasks: 0,
        color: '#00d4ff'
    },
    {
        id: 'finance',
        name: '财务部',
        x: 0.28,
        y: 0.70,
        status: 'idle',
        tasks: 0,
        color: '#00d4ff'
    },
    {
        id: 'afterSales',
        name: '售后跟踪',
        x: 0.12,
        y: 0.70,
        status: 'idle',
        tasks: 0,
        color: '#00d4ff'
    },
    {
        id: 'hr',
        name: '人力资源',
        x: 0.12,
        y: 0.55,
        status: 'idle',
        tasks: 0,
        color: '#00d4ff'
    },
    {
        id: 'datahub',
        name: '数据中枢',
        x: 0.44,
        y: 0.45,
        status: 'busy',
        tasks: 12,
        color: '#ff6b35',
        isCentral: true
    }
];

export const CONNECTIONS = [
    { from: 'order', to: 'design', label: '工单' },
    { from: 'design', to: 'production', label: '图纸' },
    { from: 'production', to: 'quality', label: '在制品' },
    { from: 'production', to: 'equipment', label: '设备状态' },
    { from: 'quality', to: 'warehouse', label: '成品' },
    { from: 'quality', to: 'production', label: '返工' },
    { from: 'equipment', to: 'production', label: '维护' },
    { from: 'energy', to: 'production', label: '能耗' },
    { from: 'warehouse', to: 'purchase', label: '库存预警' },
    { from: 'purchase', to: 'warehouse', label: '原料' },
    { from: 'warehouse', to: 'finance', label: '入库单' },
    { from: 'finance', to: 'afterSales', label: '结算' },
    { from: 'afterSales', to: 'order', label: '反馈' },
    { from: 'hr', to: 'production', label: '排班' },
    { from: 'datahub', to: 'order', label: '分析' },
    { from: 'datahub', to: 'design', label: '分析' },
    { from: 'datahub', to: 'production', label: '分析' },
    { from: 'datahub', to: 'quality', label: '分析' },
    { from: 'datahub', to: 'equipment', label: '分析' },
    { from: 'datahub', to: 'warehouse', label: '分析' },
    { from: 'datahub', to: 'finance', label: '分析' }
];

export function drawNode(ctx, node, canvasWidth, canvasHeight) {
    const x = node.x * canvasWidth;
    const y = node.y * canvasHeight;
    const radius = node.isCentral ? 70 : 50;

    // 状态颜色
    const statusColors = {
        idle: '#00ff88',
        busy: '#00d4ff',
        warning: '#ff6b35',
        error: '#ff3366'
    };
    const statusColor = statusColors[node.status] || statusColors.idle;

    // 外发光
    ctx.shadowColor = statusColor;
    ctx.shadowBlur = 20;

    // 环形背景
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 状态环
    const taskRatio = Math.min(node.tasks / 10, 1);
    ctx.beginPath();
    ctx.arc(x, y, radius - 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * taskRatio);
    ctx.strokeStyle = statusColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // 填充
    ctx.beginPath();
    ctx.arc(x, y, radius - 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(26, 35, 50, 0.9)';
    ctx.fill();

    // 部门名称
    ctx.fillStyle = node.color;
    ctx.font = 'bold 14px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.name, x, y);

    // 任务数
    if (node.tasks > 0) {
        ctx.fillStyle = '#e0e6ed';
        ctx.font = '11px Microsoft YaHei';
        ctx.fillText(`${node.tasks} 任务`, x, y + 18);
    }

    // 中心节点特殊效果
    if (node.isCentral) {
        // 脉冲环
        const pulse = (Date.now() % 2000) / 2000;
        ctx.beginPath();
        ctx.arc(x, y, radius + 10 + pulse * 20, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 107, 53, ${1 - pulse})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

export function drawConnection(ctx, from, to, canvasWidth, canvasHeight, intensity = 1) {
    const x1 = from.x * canvasWidth;
    const y1 = from.y * canvasHeight;
    const x2 = to.x * canvasWidth;
    const y2 = to.y * canvasHeight;

    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, `rgba(0, 212, 255, ${0.3 * intensity})`);
    gradient.addColorStop(1, `rgba(0, 255, 136, ${0.3 * intensity})`);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.stroke();
}
```

- [ ] **Step 2: 创建粒子系统 js/canvas/particles.js**

```javascript
// js/canvas/particles.js

export class Particle {
    constructor(x, y, targetX, targetY, type = 'task') {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.type = type;
        this.size = 2 + Math.random() * 4;
        this.speed = 50 + Math.random() * 100;
        this.progress = 0;
        this.alive = true;

        const colors = {
            task: '#00d4ff',
            alert: '#ff6b35',
            success: '#00ff88',
            suggestion: '#00ff88'
        };
        this.color = colors[type] || colors.task;
    }

    update(deltaTime) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
            this.alive = false;
            return;
        }

        const move = this.speed * deltaTime;
        this.x += (dx / dist) * move;
        this.y += (dy / dist) * move;
        this.progress = 1 - (dist / Math.sqrt(
            Math.pow(this.targetX - this.startX, 2) +
            Math.pow(this.targetY - this.startY, 2)
        ));
    }

    draw(ctx) {
        if (!this.alive) return;

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, targetX, targetY, type = 'task', count = 3) {
        for (let i = 0; i < count; i++) {
            const p = new Particle(x, y, targetX, targetY, type);
            p.startX = x;
            p.startY = y;
            // 添加一点随机偏移
            p.x += (Math.random() - 0.5) * 20;
            p.y += (Math.random() - 0.5) * 20;
            this.particles.push(p);
        }
    }

    update(deltaTime) {
        this.particles = this.particles.filter(p => p.alive);
        this.particles.forEach(p => p.update(deltaTime));
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}
```

- [ ] **Step 3: 创建渲染引擎 js/canvas/renderer.js**

```javascript
// js/canvas/renderer.js
import { DEPARTMENTS, CONNECTIONS, drawNode, drawConnection } from './nodes.js';
import { ParticleSystem } from './particles.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = new ParticleSystem();
        this.lastTime = 0;
        this.animationId = null;
        this.nodes = JSON.parse(JSON.stringify(DEPARTMENTS));
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    start() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate(0);
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    updateNode(nodeId, updates) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            Object.assign(node, updates);
        }
    }

    emitParticles(fromId, toId, type = 'task') {
        const from = this.nodes.find(n => n.id === fromId);
        const to = this.nodes.find(n => n.id === toId);
        if (from && to) {
            const x = from.x * this.canvas.width;
            const y = from.y * this.canvas.height;
            const tx = to.x * this.canvas.width;
            const ty = to.y * this.canvas.height;
            this.particles.emit(x, y, tx, ty, type, 3 + Math.floor(Math.random() * 3));
        }
    }

    animate(timestamp) {
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.render(deltaTime);
        this.animationId = requestAnimationFrame((t) => this.animate(t));
    }

    render(deltaTime) {
        const { ctx, canvas } = this;

        // 清空画布
        ctx.fillStyle = '#0a0e17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制网格背景
        this.drawGrid();

        // 绘制连接线
        this.drawConnections();

        // 绘制粒子
        this.particles.update(deltaTime);
        this.particles.draw(ctx);

        // 绘制节点
        this.nodes.forEach(node => {
            drawNode(ctx, node, canvas.width, canvas.height);
        });

        // FPS
        document.getElementById('fps-counter').textContent =
            `${Math.round(1 / deltaTime)} FPS`;
    }

    drawGrid() {
        const { ctx, canvas } = this;
        ctx.strokeStyle = 'rgba(42, 58, 80, 0.3)';
        ctx.lineWidth = 1;

        const gridSize = 40;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    drawConnections() {
        const { ctx, canvas } = this;
        CONNECTIONS.forEach(conn => {
            const from = this.nodes.find(n => n.id === conn.from);
            const to = this.nodes.find(n => n.id === conn.to);
            if (from && to) {
                drawConnection(ctx, from, to, canvas.width, canvas.height, 0.5);
            }
        });
    }
}
```

---

### Task 3: 事件驱动引擎

**Files:**
- Create: `js/engine/eventBus.js`
- Create: `js/engine/agents.js`
- Create: `js/engine/businessFlow.js`

- [ ] **Step 1: 创建事件总线 js/engine/eventBus.js**

```javascript
// js/engine/eventBus.js

export class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (!this.listeners.has(event)) return;
        this.listeners.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                console.error(`Error in event handler for ${event}:`, e);
            }
        });
    }

    createEvent(type, message, data = {}) {
        return {
            type,
            message,
            data,
            time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
            timestamp: Date.now()
        };
    }
}
```

- [ ] **Step 2: 创建 Agent 系统 js/engine/agents.js**

```javascript
// js/engine/agents.js
import { DEPARTMENTS } from '../canvas/nodes.js';

const AGENT_STATES = {
    IDLE: 'idle',
    BUSY: 'busy',
    WARNING: 'warning',
    ERROR: 'error'
};

export class Agent {
    constructor(id, name, eventBus) {
        this.id = id;
        this.name = name;
        this.eventBus = eventBus;
        this.state = AGENT_STATES.IDLE;
        this.tasks = 0;
        this.stats = {
            processed: 0,
            failed: 0
        };
    }

    setState(state) {
        this.state = state;
        this.eventBus.emit('agentStateChange', { id: this.id, state });
    }

    addTask() {
        this.tasks++;
        this.stats.processed++;
        if (this.tasks > 5) {
            this.setState(AGENT_STATES.BUSY);
        }
        this.eventBus.emit('agentUpdate', { id: this.id, tasks: this.tasks, state: this.state });
    }

    completeTask() {
        if (this.tasks > 0) {
            this.tasks--;
        }
        if (this.tasks === 0) {
            this.setState(AGENT_STATES.IDLE);
        }
        this.eventBus.emit('agentUpdate', { id: this.id, tasks: this.tasks, state: this.state });
    }

    warn(message) {
        this.setState(AGENT_STATES.WARNING);
        const event = this.eventBus.createEvent('alert', message, { agentId: this.id });
        this.eventBus.emit('event', event);
    }

    error(message) {
        this.setState(AGENT_STATES.ERROR);
        const event = this.eventBus.createEvent('alert', message, { agentId: this.id });
        this.eventBus.emit('event', event);
    }

    success(message) {
        const event = this.eventBus.createEvent('success', message, { agentId: this.id });
        this.eventBus.emit('event', event);
    }

    getStats() {
        return {
            id: this.id,
            name: this.name,
            state: this.state,
            tasks: this.tasks,
            processed: this.stats.processed
        };
    }
}

export class AgentSystem {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.agents = new Map();
        this.stats = {
            totalOrders: 0,
            productionEfficiency: 0,
            qualityRate: 0,
            equipmentOEE: 0
        };
    }

    init() {
        DEPARTMENTS.forEach(dept => {
            const agent = new Agent(dept.id, dept.name, this.eventBus);
            this.agents.set(dept.id, agent);
        });

        // 监听 Agent 更新
        this.eventBus.on('agentUpdate', (data) => {
            this.updateStats();
        });

        this.updateStats();
    }

    getAgent(id) {
        return this.agents.get(id);
    }

    updateStats() {
        let totalTasks = 0;
        let totalProcessed = 0;

        this.agents.forEach(agent => {
            totalTasks += agent.tasks;
            totalProcessed += agent.stats.processed;
        });

        // 模拟统计数据
        this.stats = {
            totalOrders: 1234 + Math.floor(Math.random() * 50),
            productionEfficiency: 85 + Math.random() * 10,
            qualityRate: 97 + Math.random() * 3,
            equipmentOEE: 82 + Math.random() * 8,
            inventoryTurnover: 4 + Math.random() * 2,
            energyConsumption: 2800 + Math.random() * 200
        };

        this.eventBus.emit('statsUpdate', [
            { label: '订单总量', value: this.stats.totalOrders, trend: 12.3 },
            { label: '生产效率', value: this.stats.productionEfficiency.toFixed(1) + '%', trend: 5.2 },
            { label: '质检良品率', value: this.stats.qualityRate.toFixed(1) + '%', trend: 1.8 },
            { label: '设备 OEE', value: this.stats.equipmentOEE.toFixed(1) + '%', trend: 3.1 },
            { label: '库存周转', value: this.stats.inventoryTurnover.toFixed(1) + '次', trend: -2.1 },
            { label: '能耗 kWh', value: Math.round(this.stats.energyConsumption), trend: -4.5 }
        ]);
    }
}
```

- [ ] **Step 3: 创建业务流程模拟 js/engine/businessFlow.js**

```javascript
// js/engine/businessFlow.js

export class BusinessFlow {
    constructor(agentSystem, eventBus) {
        this.agentSystem = agentSystem;
        this.eventBus = eventBus;
        this.renderer = null;
        this.intervals = [];
        this.isRunning = false;
    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    start() {
        this.isRunning = true;

        // 定时生成新订单
        this.intervals.push(setInterval(() => {
            this.generateOrder();
        }, 5000 + Math.random() * 5000));

        // 定时触发设备告警
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.3) {
                this.triggerEquipmentAlert();
            }
        }, 8000));

        // 定时能源监测
        this.intervals.push(setInterval(() => {
            this.monitorEnergy();
        }, 3000));

        // 定时库存检查
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.2) {
                this.checkInventory();
            }
        }, 10000));

        // 定时 AI 建议
        this.intervals.push(setInterval(() => {
            this.generateAISuggestion();
        }, 15000));

        // 数据中枢持续工作
        this.intervals.push(setInterval(() => {
            this.datahubAnalysis();
        }, 2000));

        this.eventBus.emit('event', this.eventBus.createEvent('info', '工厂大脑启动，开始监控'));
    }

    stop() {
        this.isRunning = false;
        this.intervals.forEach(id => clearInterval(id));
        this.intervals = [];
    }

    generateOrder() {
        const orderAgent = this.agentSystem.getAgent('order');
        orderAgent.addTask();

        if (this.renderer) {
            this.renderer.emitParticles('order', 'design', 'task');
        }

        this.eventBus.emit('event', this.eventBus.createEvent('info', `新订单进入 #${Date.now() % 10000}`));

        // 2秒后传递给设计部
        setTimeout(() => {
            const designAgent = this.agentSystem.getAgent('design');
            designAgent.addTask();
            if (this.renderer) {
                this.renderer.emitParticles('design', 'production', 'task');
            }
        }, 2000);

        // 4秒后进入生产
        setTimeout(() => {
            const productionAgent = this.agentSystem.getAgent('production');
            productionAgent.addTask();
            if (this.renderer) {
                this.renderer.emitParticles('production', 'quality', 'task');
            }
        }, 4000);

        // 6秒后质检
        setTimeout(() => {
            const qualityAgent = this.agentSystem.getAgent('quality');
            qualityAgent.addTask();

            // 模拟质检结果
            const isPass = Math.random() > 0.05;
            if (isPass) {
                if (this.renderer) {
                    this.renderer.emitParticles('quality', 'warehouse', 'success');
                }
                this.eventBus.emit('event', this.eventBus.createEvent('success', `订单通过质检`));

                // 入库
                setTimeout(() => {
                    const warehouseAgent = this.agentSystem.getAgent('warehouse');
                    warehouseAgent.addTask();
                    qualityAgent.completeTask();

                    // 出库 -> 财务 -> 售后
                    setTimeout(() => {
                        const financeAgent = this.agentSystem.getAgent('finance');
                        const afterSalesAgent = this.agentSystem.getAgent('afterSales');
                        financeAgent.addTask();
                        afterSalesAgent.addTask();

                        if (this.renderer) {
                            this.renderer.emitParticles('warehouse', 'finance', 'task');
                            this.renderer.emitParticles('finance', 'afterSales', 'task');
                        }

                        setTimeout(() => {
                            financeAgent.completeTask();
                            afterSalesAgent.completeTask();
                            orderAgent.completeTask();
                            const designAgent = this.agentSystem.getAgent('design');
                            designAgent.completeTask();
                            const prodAgent = this.agentSystem.getAgent('production');
                            prodAgent.completeTask();
                            const warehouseAgent = this.agentSystem.getAgent('warehouse');
                            warehouseAgent.completeTask();

                            this.eventBus.emit('event', this.eventBus.createEvent('success', `订单完成交付`));
                        }, 3000);
                    }, 2000);
                }, 2000);
            } else {
                // 不良品
                qualityAgent.warn('检测到不良品');
                if (this.renderer) {
                    this.renderer.emitParticles('quality', 'production', 'alert');
                }
                this.eventBus.emit('event', this.eventBus.createEvent('alert', `质检告警：发现缺陷`));

                setTimeout(() => {
                    qualityAgent.completeTask();
                }, 1000);
            }
        }, 2000);
    }

    triggerEquipmentAlert() {
        const equipmentAgent = this.agentSystem.getAgent('equipment');
        equipmentAgent.warn(`设备#${Math.floor(Math.random() * 10) + 1} 温度异常`);

        if (this.renderer) {
            this.renderer.updateNode('equipment', { status: 'warning' });
            this.renderer.emitParticles('equipment', 'production', 'alert');
        }

        setTimeout(() => {
            if (this.renderer) {
                this.renderer.updateNode('equipment', { status: 'idle' });
            }
        }, 3000);
    }

    monitorEnergy() {
        const energyAgent = this.agentSystem.getAgent('energy');
        const consumption = 2800 + Math.random() * 400;

        if (consumption > 3000) {
            energyAgent.warn(`能耗偏高: ${Math.round(consumption)} kWh`);
            if (this.renderer) {
                this.renderer.emitParticles('energy', 'datahub', 'alert');
            }
        }
    }

    checkInventory() {
        const warehouseAgent = this.agentSystem.getAgent('warehouse');
        const purchaseAgent = this.agentSystem.getAgent('purchase');

        if (Math.random() < 0.5) {
            warehouseAgent.warn('原料库存不足');
            purchaseAgent.addTask();

            if (this.renderer) {
                this.renderer.emitParticles('warehouse', 'purchase', 'alert');
            }

            this.eventBus.emit('event', this.eventBus.createEvent('alert', `库存预警：原料不足`));

            setTimeout(() => {
                purchaseAgent.completeTask();
                if (this.renderer) {
                    this.renderer.emitParticles('purchase', 'warehouse', 'success');
                }
            }, 2000);
        }
    }

    generateAISuggestion() {
        const datahub = this.agentSystem.getAgent('datahub');
        const suggestions = [
            '建议优化排产策略，减少换模时间',
            '质检发现裂纹缺陷集中，建议检查设备精度',
            '能源消耗峰值在14-16点，建议错峰生产',
            '库存周转率下降，建议调整采购策略'
        ];
        const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

        this.eventBus.emit('event', this.eventBus.createEvent('success', `AI建议: ${suggestion}`));

        if (this.renderer) {
            this.renderer.emitParticles('datahub', 'order', 'suggestion');
            this.renderer.emitParticles('datahub', 'production', 'suggestion');
        }
    }

    datahubAnalysis() {
        const datahub = this.agentSystem.getAgent('datahub');
        datahub.setState('busy');

        setTimeout(() => {
            datahub.setState('idle');
        }, 500);
    }
}
```

---

### Task 4: 报告生成与导出

**Files:**
- Create: `js/report/templates.js`
- Create: `js/report/generator.js`
- Create: `js/utils/pdf.js`

- [ ] **Step 1: 创建报告模板 js/report/templates.js**

```javascript
// js/report/templates.js

export const REPORT_TEMPLATES = {
    generateReport(data) {
        const painPointLabels = {
            production: '生产效率低/交期不准',
            quality: '产品质检问题',
            equipment: '设备突发故障',
            inventory: '原材料/库存混乱',
            decision: '报表/决策缺数据'
        };

        const budgetLabels = { low: '低（<5万）', medium: '中（5-30万）', high: '高（>30万）' };
        const timelineLabels = { fast: '1个月内', medium: '3-6个月', long: '半年以上' };
        const productLabels = {
            injection: '注塑模具',
            stamping: '冲压模具',
            diecasting: '压铸模具',
            other: '其他'
        };

        return `
<h1>${data.factoryName || 'XX模具工厂'} AI 降本增效方案</h1>

<h2>一、工厂概况分析</h2>
<table>
<tr><th>指标</th><th>数值</th></tr>
<tr><td>员工人数</td><td>${data.employeeCount || '-'} 人</td></tr>
<tr><td>厂房面积</td><td>${data.factoryArea || '-'} ㎡</td></tr>
<tr><td>年产值</td><td>${data.annualOutput || '-'} 万元</td></tr>
<tr><td>净利润率</td><td>${data.profitRate || '-'}%</td></tr>
<tr><td>主要产品</td><td>${(data.products || []).map(p => productLabels[p]).join('、') || '-'}</td></tr>
<tr><td>核心痛点</td><td>${(data.painPoints || []).map(p => painPointLabels[p]).join('、') || '-'}</td></tr>
<tr><td>预算范围</td><td>${budgetLabels[data.budget] || '-'}</td></tr>
<tr><td>期望周期</td><td>${timelineLabels[data.timeline] || '-'}</td></tr>
</table>

<h2>二、解决方案（6大维度）</h2>

<h3>2.1 生产流程优化</h3>
<p><strong>现状问题：</strong>排产不合理导致交期延误，换模时间过长</p>
<p><strong>AI 方案：</strong>引入 AI 智能排产系统，基于订单优先级、设备负载、人员技能进行动态调度</p>
<p><strong>预期效果：</strong>生产周期缩短 15-25%，设备利用率提升 10-20%</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>部署 AI 智能排产引擎，接入现有 MES 系统</li>
<li>建立订单优先级模型（紧急度+利润+交期）</li>
<li>瓶颈工序识别与预警机制</li>
<li>工序节拍平衡分析，动态调整人员配置</li>
</ul>

<h3>2.2 质量检测智能化</h3>
<p><strong>现状问题：</strong>目检依赖人工，漏检率高，质量数据分散</p>
<p><strong>AI 方案：</strong>视觉 AI 检测系统 + 缺陷模式分析</p>
<p><strong>预期效果：</strong>良品率提升至 99%+，漏检率降低 80%</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>部署工业相机 + 视觉 AI 检测（裂纹/毛刺/尺寸偏差）</li>
<li>建立历史缺陷模式数据库</li>
<li>检测报告自动生成与实时上传</li>
<li>SPC 过程控制，异常实时预警</li>
</ul>

<h3>2.3 设备预测性维护</h3>
<p><strong>现状问题：</strong>突发停机频繁，维修成本高，被动维护为主</p>
<p><strong>AI 方案：</strong>IoT 传感器 + 预测性维护 AI 模型</p>
<p><strong>预期效果：</strong>非计划停机减少 50%，维修成本降低 20-30%</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>机床振动、温度、电流传感器部署</li>
<li>刀具寿命预测模型</li>
<li>维修工单智能分配与抢单机制</li>
<li>备件库存优化</li>
</ul>

<h3>2.4 供应链与库存优化</h3>
<p><strong>现状问题：</strong>原料浪费，库存积压，供应商交期不准</p>
<p><strong>AI 方案：</strong>智能库存管理系统 + 采购预测</p>
<p><strong>预期效果：</strong>库存周转提升 20-30%，减少资金占用</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>原料消耗实时监控与自动补货</li>
<li>安全库存智能计算</li>
<li>供应商绩效分析</li>
<li>呆滞物料预警与处理建议</li>
</ul>

<h3>2.5 能源管理</h3>
<p><strong>现状问题：</strong>电耗过高，空载运行，峰谷用电不均</p>
<p><strong>AI 方案：</strong>能源管理系统 + 用电优化</p>
<p><strong>预期效果：</strong>能耗降低 10-15%</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>主要设备能耗实时监测</li>
<li>峰谷用电优化策略</li>
<li>空载自动休眠机制</li>
<li>能耗 Dashboard 大屏展示</li>
</ul>

<h3>2.6 智能报表与决策</h3>
<p><strong>现状问题：</strong>数据分散，报表滞后，决策凭经验</p>
<p><strong>AI 方案：</strong>数据中台 + BI + AI 决策建议</p>
<p><strong>预期效果：</strong>报表效率提升 80%，决策有据可依</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>打通 MES/ERP/设备数据孤岛</li>
<li>建立工厂数据中台</li>
<li>关键指标实时 Dashboard</li>
<li>AI 辅助决策建议系统</li>
</ul>

<h2>三、AI 接入架构</h2>

<h3>推荐方案：P1 深度改造（3-6个月）</h3>
<table>
<tr><th>层面</th><th>技术选型</th></tr>
<tr><td>应用层</td><td>Web Dashboard + 小程序</td></tr>
<tr><td>AI 服务层</td><td>DeepSeek API + 模具行业知识库</td></tr>
<tr><td>数据层</td><td>MES/ERP + IoT 传感器 + Excel</td></tr>
<tr><td>部署方式</td><td>SaaS + 本地混合</td></tr>
</table>

<h3>实施周期</h3>
<table>
<tr><th>阶段</th><th>周期</th><th>内容</th></tr>
<tr><td>第一阶段</td><td>1-2月</td><td>数据采集 + Dashboard + AI 客服</td></tr>
<tr><td>第二阶段</td><td>3-4月</td><td>智能排产 + 质检 AI</td></tr>
<tr><td>第三阶段</td><td>5-6月</td><td>预测维护 + 能源优化 + 全面集成</td></tr>
</table>

<h2>四、效果预估</h2>
<table>
<tr><th>指标</th><th>当前</th><th>目标</th><th>提升</th></tr>
<tr><td>生产效率</td><td>基线</td><td>+15-25%</td><td>显著</td></tr>
<tr><td>良品率</td><td>${data.profitRate || '95'}%</td><td>>99%</td><td>+4%+</td></tr>
<tr><td>设备 OEE</td><td>基线</td><td>+10-15%</td><td>显著</td></tr>
<tr><td>能源成本</td><td>基线</td><td>-10-15%</td><td>节约</td></tr>
<tr><td>库存周转</td><td>基线</td><td>+20-30%</td><td>优化</td></tr>
</table>

<h3>ROI 测算</h3>
<p>按年产值 ${data.annualOutput || '5000'} 万元测算：</p>
<ul>
<li>预计年度节约成本：200-400 万元</li>
<li>项目投入（中等预算）：50-100 万元</li>
<li>投资回收期：6-12 个月</li>
</ul>

<h2>五、下一步行动</h2>
<ol>
<li>确认工厂详细数据（设备清单、工艺流程）</li>
<li>现有系统调研（MES/ERP 品牌、版本）</li>
<li>试点工序选择（建议从质检或排产切入）</li>
<li>供应商评估与 POC</li>
<li>签订合同，启动第一阶段</li>
</ol>

<p style="text-align:center; margin-top: 3rem; color: #8b9cb3;">
本报告由 AI 生成，具体方案需根据工厂实际情况调整
</p>
        `;
    }
};
```

- [ ] **Step 2: 创建报告生成器 js/report/generator.js**

```javascript
// js/report/generator.js
import { REPORT_TEMPLATES } from './templates.js';

export class ReportGenerator {
    constructor() {
        this.templates = REPORT_TEMPLATES;
    }

    generate(data) {
        return this.templates.generateReport(data);
    }

    exportToHTML(content) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AI 降本增效方案</title>
    <style>
        body { font-family: 'Microsoft YaHei', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
${content}
</body>
</html>
        `;
    }
}
```

- [ ] **Step 3: 创建 PDF 导出 js/utils/pdf.js**

```javascript
// js/utils/pdf.js

export async function exportToPDF(element) {
    // 动态加载依赖
    if (typeof jspdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
    }

    if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
    }

    const { jsPDF } = window.jspdf;

    // 创建 Canvas
    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0e17'
    });

    // 创建 PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    // 下载
    pdf.save('模具工厂AI降本增效方案.pdf');
}
```

---

## 自检清单

**Spec 覆盖检查：**
- [x] 12 部门节点渲染 - Task 2 nodes.js
- [x] 粒子系统 - Task 2 particles.js
- [x] Canvas 动画循环 - Task 2 renderer.js
- [x] 事件驱动引擎 - Task 3 eventBus.js
- [x] Agent 状态机 - Task 3 agents.js
- [x] 业务流程模拟 - Task 3 businessFlow.js
- [x] 报告模板 - Task 4 templates.js
- [x] PDF 导出 - Task 4 pdf.js
- [x] Tab 切换 + 表单 - Task 1 app.js

**占位符扫描：**
- 无 TBD/TODO
- 无不完整的步骤

**类型一致性：**
- `Renderer.updateNode(nodeId, updates)` ✓
- `AgentSystem.getAgent(id)` ✓
- `EventBus.emit(event, data)` ✓
- `ReportGenerator.generate(data)` ✓

---

## 实施顺序

1. **Task 1** → 项目框架 + 样式 + 主应用
2. **Task 2** → Canvas 可视化（节点 + 粒子）
3. **Task 3** → 事件引擎 + Agent + 业务流
4. **Task 4** → 报告生成 + PDF 导出

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-13-模具工厂AI降本增效系统-implementation-plan.md`**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
