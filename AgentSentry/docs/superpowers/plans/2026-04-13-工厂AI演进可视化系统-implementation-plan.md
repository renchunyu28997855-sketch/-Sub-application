# 工厂 AI 演进可视化系统 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有 index.html 基础上，新增工厂 AI 演进可视化 Tab，展示人→Agent→Skill/MCP→人机协作的演进过程

**Architecture:** 纯前端单文件，Canvas 2D 渲染，60FPS 动画循环，粒子系统实现进化流和装备装配效果

**Tech Stack:** HTML5 + CSS3 + Vanilla JS, Canvas API

---

## 文件清单

| 文件 | 职责 |
|------|------|
| `index.html` | 主入口（改造，新增 AI 演进 Tab 及相关 JS/CSS） |

---

## 实施任务

### Task 1: 项目结构改造 — 新增 AI 演进 Tab

**Files:**
- Modify: `index.html` — 新增 Tab 按钮和视图容器

- [ ] **Step 1: 添加 AI 演进 Tab 按钮**

在 `.tab-switch` 中新增按钮：
```html
<button class="tab-btn" data-tab="evolution">AI 演进</button>
```

- [ ] **Step 2: 添加 AI 演进视图容器**

在 `#report-view` 后添加：
```html
<section id="evolution-view" class="view">
    <div class="evolution-container">
        <div class="canvas-wrapper" id="evolutionCanvas">
            <canvas id="mainCanvas2"></canvas>
        </div>
        <aside class="control-panel">
            <div class="panel-header">全局控制</div>
            <div class="speed-control">
                <label>演进速度</label>
                <input type="range" id="speedSlider" min="1" max="3" value="2">
                <span id="speedLabel">中速</span>
            </div>
            <div class="control-buttons">
                <button id="btn-pause" class="btn-secondary">暂停</button>
                <button id="btn-reset" class="btn-secondary">重置</button>
            </div>
            <div class="panel-header mt">事件日志</div>
            <div id="evolution-log" class="event-log"></div>
        </aside>
    </div>
</section>
```

- [ ] **Step 3: 添加控制面板样式**

```css
.evolution-container { display: flex; height: 100%; padding: 16px; gap: 16px; }
.control-panel { width: 300px; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color); padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.speed-control { display: flex; flex-direction: column; gap: 8px; }
.speed-control label { font-size: 12px; color: var(--text-secondary); }
.speed-control input[type="range"] { width: 100%; accent-color: var(--accent-cyan); }
.speed-control span { font-size: 12px; color: var(--accent-cyan); text-align: center; }
.control-buttons { display: flex; gap: 8px; }
.control-buttons button { flex: 1; }
.event-log { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
.log-item { font-size: 11px; padding: 6px 8px; background: var(--bg-card); border-radius: 4px; border-left: 3px solid var(--accent-cyan); }
.log-item.alert { border-left-color: var(--warning); }
.log-item.success { border-left-color: var(--success); }
```

---

### Task 2: 部门数据与状态定义

**Files:**
- Modify: `index.html` — 在 `<script>` 中新增演进相关数据结构和类

- [ ] **Step 1: 新增部门状态数据结构**

```javascript
// ============ EVOLUTION STATE ============
const DEPT_EVOLUTION = [
    { id: 'order', name: '订单管理', x: 0.15, y: 0.2, aiRate: 20, maturityLevel: 0, inMaturity: false, nodeType: 'hybrid', skills: [], mcps: [], collaborators: [] },
    { id: 'design', name: '设计部', x: 0.35, y: 0.2, aiRate: 15, maturityLevel: 0, inMaturity: false, nodeType: 'human', skills: [], mcps: [], collaborators: [] },
    { id: 'production', name: '生产车间', x: 0.55, y: 0.2, aiRate: 10, maturityLevel: 0, inMaturity: false, nodeType: 'human', skills: [], mcps: [], collaborators: [] },
    { id: 'quality', name: '质检部门', x: 0.75, y: 0.2, aiRate: 25, maturityLevel: 0, inMaturity: false, nodeType: 'hybrid', skills: ['vision'], mcps: [], collaborators: [] },
    { id: 'equipment', name: '设备维护', x: 0.85, y: 0.4, aiRate: 30, maturityLevel: 0, inMaturity: false, nodeType: 'hybrid', skills: [], mcps: ['sensor'], collaborators: [] },
    { id: 'energy', name: '能源管理', x: 0.85, y: 0.6, aiRate: 35, maturityLevel: 0, inMaturity: false, nodeType: 'hybrid', skills: [], mcps: [], collaborators: [] },
    { id: 'warehouse', name: '仓储管理', x: 0.75, y: 0.75, aiRate: 40, maturityLevel: 0, inMaturity: false, nodeType: 'hybrid', skills: ['logistics'], mcps: [], collaborators: [] },
    { id: 'purchase', name: '采购部', x: 0.55, y: 0.75, aiRate: 45, maturityLevel: 0, inMaturity: false, nodeType: 'hybrid', skills: [], mcps: ['erp'], collaborators: [] },
    { id: 'finance', name: '财务部', x: 0.35, y: 0.75, aiRate: 50, maturityLevel: 0, inMaturity: false, nodeType: 'hybrid', skills: ['accounting'], mcps: [], collaborators: [] },
    { id: 'afterSales', name: '售后跟踪', x: 0.15, y: 0.75, aiRate: 30, maturityLevel: 0, inMaturity: false, nodeType: 'human', skills: [], mcps: [], collaborators: [] },
    { id: 'hr', name: '人力资源', x: 0.15, y: 0.55, aiRate: 25, maturityLevel: 0, inMaturity: false, nodeType: 'human', skills: [], mcps: [], collaborators: [] },
    { id: 'datahub', name: '数据中枢', x: 0.55, y: 0.45, aiRate: 60, maturityLevel: 0, inMaturity: false, nodeType: 'agent', skills: ['analytics'], mcps: ['ai'], collaborators: [] }
];

// 演进 Agent（进化版数据中枢）
const EVOLUTION_AGENT = {
    x: 0.5, y: 0.08, // 顶部中央
    status: 'active',
    pulsePhase: 0
};
```

- [ ] **Step 2: 新增颜色辅助函数**

```javascript
// 磨合期颜色：生疏 → 熟练 → 融合
function getMaturityColor(level) {
    if (level < 20) return '#ff6b35'; // 橙色
    if (level < 50) return '#ffcc00'; // 黄色
    if (level < 80) return '#00d4ff'; // 青色
    return '#00ff88'; // 绿色
}

// 节点类型基础色
function getNodeBaseColor(type) {
    if (type === 'human') return '#8b9cb3'; // 灰蓝
    if (type === 'agent') return '#00d4ff'; // 青
    return '#00d4ff'; // hybrid
}
```

- [ ] **Step 3: 新增部门连接关系**

```javascript
const DEPT_CONNECTIONS_EVOLUTION = [
    { from: 'order', to: 'design' },
    { from: 'design', to: 'production' },
    { from: 'production', to: 'quality' },
    { from: 'production', to: 'equipment' },
    { from: 'quality', to: 'warehouse' },
    { from: 'equipment', to: 'energy' },
    { from: 'energy', to: 'production' },
    { from: 'warehouse', to: 'purchase' },
    { from: 'purchase', to: 'finance' },
    { from: 'finance', to: 'afterSales' },
    { from: 'afterSales', to: 'order' },
    { from: 'hr', to: 'production' },
    { from: 'datahub', to: 'order' },
    { from: 'datahub', to: 'design' },
    { from: 'datahub', to: 'production' },
    { from: 'datahub', to: 'quality' },
    { from: 'datahub', to: 'finance' }
];
```

---

### Task 3: 绘图函数 — 火柴人、机器人、进化 Agent

**Files:**
- Modify: `index.html` — 在 `<script>` 中新增绘图函数

- [ ] **Step 1: 绘制火柴人函数**

```javascript
function drawStickFigure(ctx, x, y, size, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // 头
    ctx.beginPath();
    ctx.arc(x, y - size * 0.3, size * 0.15, 0, Math.PI * 2);
    ctx.stroke();
    
    // 身体
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.15);
    ctx.lineTo(x, y + size * 0.2);
    ctx.stroke();
    
    // 手臂
    ctx.beginPath();
    ctx.moveTo(x - size * 0.2, y);
    ctx.lineTo(x + size * 0.2, y);
    ctx.stroke();
    
    // 腿
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.2);
    ctx.lineTo(x - size * 0.15, y + size * 0.4);
    ctx.moveTo(x, y + size * 0.2);
    ctx.lineTo(x + size * 0.15, y + size * 0.4);
    ctx.stroke();
    
    ctx.restore();
}
```

- [ ] **Step 2: 绘制机器人函数**

```javascript
function drawRobot(ctx, x, y, size, color, hasPulse = false) {
    ctx.save();
    
    // 发光效果
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    
    // 六边形身体
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - Math.PI / 6;
        const px = x + Math.cos(angle) * size * 0.35;
        const py = y + Math.sin(angle) * size * 0.35;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(26, 35, 50, 0.9)';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 眼睛
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x - size * 0.1, y - size * 0.05, 4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.1, y - size * 0.05, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 天线
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.35);
    ctx.lineTo(x, y - size * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y - size * 0.55, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}
```

- [ ] **Step 3: 绘制演进 Agent 函数**

```javascript
function drawEvolutionAgent(ctx, x, y, size, phase) {
    ctx.save();
    
    // 外圈脉冲
    const pulseSize = size + Math.sin(phase) * 10;
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 + Math.sin(phase) * 0.2})`;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 能量环
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 核心机器人（更大）
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 25;
    
    // 菱形核心
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.4);
    ctx.lineTo(x + size * 0.3, y);
    ctx.lineTo(x, y + size * 0.4);
    ctx.lineTo(x - size * 0.3, y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // 中心点
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff88';
    ctx.fill();
    
    // 标签
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 12px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText('进化 Agent', x, y + size + 20);
    
    ctx.restore();
}
```

- [ ] **Step 4: 绘制装备图标函数**

```javascript
function drawEquipments(ctx, x, y, size, dept) {
    const equipX = x + size * 0.3;
    let offsetY = -size * 0.2;
    
    // Skill 装备（闪电图标）
    dept.skills.forEach((skill, i) => {
        ctx.save();
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 8;
        ctx.font = '14px Arial';
        ctx.fillText('⚡', equipX + i * 18, y + offsetY);
        ctx.restore();
        offsetY += 15;
    });
    
    // MCP 装备（扳手图标）
    dept.mcps.forEach((mcp, i) => {
        ctx.save();
        ctx.fillStyle = '#ff6b35';
        ctx.shadowColor = '#ff6b35';
        ctx.shadowBlur = 8;
        ctx.font = '14px Arial';
        ctx.fillText('🔧', equipX + i * 18, y + offsetY);
        ctx.restore();
        offsetY += 15;
    });
}
```

---

### Task 4: 粒子系统 — 进化流、协作流、装配动画

**Files:**
- Modify: `index.html` — 在 `<script>` 中新增粒子类和相关函数

- [ ] **Step 1: 进化粒子类**

```javascript
class EvolutionParticle {
    constructor(startX, startY, targetX, targetY) {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.size = 3 + Math.random() * 3;
        this.speed = 100 + Math.random() * 100;
        this.alive = true;
        this.progress = 0;
        
        // 颜色渐变：青 → 绿
        this.color = Math.random() > 0.5 ? '#00d4ff' : '#00ff88';
    }
    
    update(dt) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 10) {
            this.alive = false;
            return;
        }
        
        const move = this.speed * dt;
        this.x += (dx / dist) * move;
        this.y += (dy / dist) * move;
    }
    
    draw(ctx) {
        if (!this.alive) return;
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
```

- [ ] **Step 2: 协作虚线流动类**

```javascript
class CollaborationFlow {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1; this.y1 = y1;
        this.x2 = x2; this.y2 = y2;
        this.particles = [];
        this.maxParticles = 5;
    }
    
    update(dt) {
        // 随机生成粒子
        if (this.particles.length < this.maxParticles && Math.random() < 0.1) {
            const t = Math.random();
            this.particles.push({
                t: t,
                speed: 30 + Math.random() * 20,
                alive: true
            });
        }
        
        // 更新粒子
        this.particles = this.particles.filter(p => p.alive);
        this.particles.forEach(p => {
            p.t += p.speed * dt / Math.sqrt((this.x2-this.x1)**2 + (this.y2-this.y1)**2);
            if (p.t > 1) {
                // 反弹，往回走
                p.speed = -(30 + Math.random() * 20);
                p.t = 1;
            }
            if (p.t < 0) p.alive = false;
        });
    }
    
    draw(ctx) {
        // 绘制虚线
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 绘制流动粒子
        this.particles.forEach(p => {
            const x = this.x1 + (this.x2 - this.x1) * p.t;
            const y = this.y1 + (this.y2 - this.y1) * p.t;
            ctx.fillStyle = '#00d4ff';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}
```

- [ ] **Step 3: 装配动画粒子类**

```javascript
class EquipParticle {
    constructor(startX, startY, targetX, targetY, type = 'skill') {
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.type = type;
        this.progress = 0;
        this.speed = 2; // 0-1 进度/秒
        this.alive = true;
        this.color = type === 'skill' ? '#00ff88' : '#ff6b35';
        this.symbol = type === 'skill' ? '⚡' : '🔧';
    }
    
    update(dt) {
        this.progress += this.speed * dt;
        if (this.progress >= 1) {
            this.progress = 1;
            this.alive = false;
        }
        
        // 缓动
        const t = this.easeOutBack(this.progress);
        this.x = this.startX + (this.targetX - this.startX) * t;
        this.y = this.startY + (this.targetY - this.startY) * t;
    }
    
    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
    
    draw(ctx) {
        if (!this.alive) return;
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.font = '16px Arial';
        ctx.fillText(this.symbol, this.x - 8, this.y + 5);
        ctx.restore();
    }
}
```

---

### Task 5: 演进逻辑 — 进化 Agent、磨合期、事件触发

**Files:**
- Modify: `index.html` — 在 `<script>` 中新增演进引擎类

- [ ] **Step 1: 演进引擎类**

```javascript
class EvolutionEngine {
    constructor() {
        this.departments = JSON.parse(JSON.stringify(DEPT_EVOLUTION));
        this.evolutionAgent = { ...EVOLUTION_AGENT };
        this.evolutionParticles = [];
        this.collaborationFlows = [];
        this.equipParticles = [];
        this.evolutionSpeed = 2; // 1=慢, 2=中, 3=快
        this.paused = false;
        this.logs = [];
        
        // 初始化协作关系
        this.initCollaborations();
    }
    
    initCollaborations() {
        // 人机协作：AI率在 30%-70% 之间的部门与相邻人力协作
        this.departments.forEach(dept => {
            if (dept.aiRate > 30 && dept.aiRate < 70 && dept.nodeType === 'hybrid') {
                const conn = DEPT_CONNECTIONS_EVOLUTION.find(c => c.from === dept.id || c.to === dept.id);
                if (conn) {
                    const neighborId = conn.from === dept.id ? conn.to : conn.from;
                    const neighbor = this.departments.find(d => d.id === neighborId);
                    if (neighbor && neighbor.nodeType === 'human') {
                        dept.collaborators.push(neighborId);
                    }
                }
            }
        });
    }
    
    update(dt) {
        if (this.paused) return;
        
        // 更新进化 Agent 脉冲
        this.evolutionAgent.pulsePhase += dt * 3;
        
        // 检查各部门的成熟度
        this.departments.forEach(dept => {
            if (dept.inMaturity) {
                // 磨合期成熟度增长
                dept.maturityLevel += dt * 10 * this.evolutionSpeed;
                if (dept.maturityLevel >= 100) {
                    dept.maturityLevel = 100;
                    dept.inMaturity = false;
                    this.addLog(`${dept.name} 磨合期完成！`, 'success');
                    // 触发下一波
                    this.triggerEvolution(dept);
                }
            }
        });
        
        // 进化粒子更新
        this.evolutionParticles = this.evolutionParticles.filter(p => p.alive);
        this.evolutionParticles.forEach(p => p.update(dt));
        
        // 协作流更新
        this.collaborationFlows.forEach(f => f.update(dt));
        
        // 装备粒子更新
        this.equipParticles = this.equipParticles.filter(p => p.alive);
        this.equipParticles.forEach(p => p.update(dt));
    }
    
    triggerEvolution(dept) {
        // 找到可以演进的人力邻居
        const conn = DEPT_CONNECTIONS_EVOLUTION.find(c => c.from === dept.id || c.to === dept.id);
        if (!conn) return;
        
        const neighborId = conn.from === dept.id ? conn.to : conn.from;
        const neighbor = this.departments.find(d => d.id === neighborId);
        
        if (neighbor && neighbor.nodeType === 'human' && neighbor.aiRate < 100) {
            // 发射进化粒子
            const canvas = document.getElementById('mainCanvas2');
            if (canvas) {
                const fromX = this.evolutionAgent.x * canvas.width;
                const fromY = this.evolutionAgent.y * canvas.height;
                const toX = neighbor.x * canvas.width;
                const toY = neighbor.y * canvas.height;
                
                for (let i = 0; i < 20; i++) {
                    this.evolutionParticles.push(new EvolutionParticle(fromX, fromY, toX, toY));
                }
            }
            
            // 演进邻居
            setTimeout(() => {
                neighbor.aiRate = Math.min(100, neighbor.aiRate + 15);
                neighbor.maturityLevel = 0;
                neighbor.inMaturity = true;
                neighbor.nodeType = neighbor.aiRate >= 50 ? 'agent' : 'hybrid';
                this.addLog(`${neighbor.name} AI替代率提升至 ${neighbor.aiRate}%`, 'info');
            }, 1000);
        }
    }
    
    addLog(message, type = 'info') {
        const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        this.logs.unshift({ time, message, type });
        if (this.logs.length > 50) this.logs.pop();
    }
    
    startEvolution() {
        // 初始触发一轮演进
        setTimeout(() => {
            const firstDept = this.departments.find(d => d.nodeType === 'human');
            if (firstDept) {
                firstDept.aiRate = 20;
                firstDept.maturityLevel = 0;
                firstDept.inMaturity = true;
                firstDept.nodeType = 'hybrid';
                this.addLog(`${firstDept.name} 开始 AI 替代`, 'info');
            }
        }, 2000);
    }
}
```

---

### Task 6: 渲染引擎 — 整合所有绘制函数

**Files:**
- Modify: `index.html` — 在 `<script>` 中新增渲染函数

- [ ] **Step 1: 演进渲染函数**

```javascript
function renderEvolution(ctx, canvas, engine) {
    const w = canvas.width, h = canvas.height;
    
    // 清空
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, w, h);
    
    // 绘制网格
    drawEvolutionGrid(ctx, w, h);
    
    // 绘制连接线
    engine.collaborationFlows.forEach(f => f.draw(ctx));
    
    // 绘制进化粒子
    engine.evolutionParticles.forEach(p => p.draw(ctx));
    
    // 绘制装备粒子
    engine.equipParticles.forEach(p => p.draw(ctx));
    
    // 绘制进化 Agent
    drawEvolutionAgent(ctx, engine.evolutionAgent.x * w, engine.evolutionAgent.y * h, 60, engine.evolutionAgent.pulsePhase);
    
    // 绘制各部门节点
    engine.departments.forEach(dept => {
        const x = dept.x * w;
        const y = dept.y * h;
        const size = 50;
        
        // 协作流
        dept.collaborators.forEach(collabId => {
            const collab = engine.departments.find(d => d.id === collabId);
            if (collab) {
                engine.collaborationFlows.push(new CollaborationFlow(x, y, collab.x * w, collab.y * h));
            }
        });
        
        // 磨合期脉冲效果
        if (dept.inMaturity) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 500);
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getMaturityColor(dept.maturityLevel);
            ctx.lineWidth = 3;
            ctx.globalAlpha = pulse;
            ctx.stroke();
            ctx.restore();
        }
        
        // 绘制节点
        if (dept.nodeType === 'human') {
            // 人力：火柴人
            const humanRatio = 1 - dept.aiRate / 100;
            drawStickFigure(ctx, x, y, size, '#8b9cb3', humanRatio);
            // 半透明叠加上 Agent
            if (dept.aiRate > 0) {
                drawRobot(ctx, x, y, size * 0.9, getMaturityColor(dept.maturityLevel), 0.5);
            }
        } else if (dept.nodeType === 'agent') {
            // 纯 Agent
            drawRobot(ctx, x, y, size, getMaturityColor(dept.maturityLevel));
        } else {
            // 混合：火柴人 + Agent
            const humanRatio = 1 - dept.aiRate / 100;
            drawStickFigure(ctx, x - 10, y, size * 0.7, '#8b9cb3', humanRatio);
            drawRobot(ctx, x + 10, y, size * 0.7, getMaturityColor(dept.maturityLevel), 0.8);
        }
        
        // 绘制装备
        drawEquipments(ctx, x, y, size, dept);
        
        // 绘制标签
        ctx.fillStyle = '#e0e6ed';
        ctx.font = '11px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.fillText(dept.name, x, y + size * 0.7 + 15);
        ctx.fillStyle = getMaturityColor(dept.maturityLevel);
        ctx.font = '10px Microsoft YaHei';
        ctx.fillText(`AI ${dept.aiRate}%`, x, y + size * 0.7 + 28);
    });
}

function drawEvolutionGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(42, 58, 80, 0.3)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
}
```

---

### Task 7: 应用集成 — Tab 切换、事件绑定、主循环

**Files:**
- Modify: `index.html` — 修改 `<script>` 中的 App 类

- [ ] **Step 1: 修改 App 类，新增演进视图初始化**

```javascript
class App {
    constructor() {
        // ... 现有属性 ...
        this.evolutionEngine = null;
        this.evolutionRenderer = null;
        this.evolutionCanvas = null;
        this.evolutionCtx = null;
        this.lastEvolutionTime = 0;
    }
    
    init() {
        // ... 现有代码 ...
        this.initEvolution();
    }
    
    initEvolution() {
        this.evolutionCanvas = document.getElementById('mainCanvas2');
        if (this.evolutionCanvas) {
            this.evolutionCtx = this.evolutionCanvas.getContext('2d');
            this.evolutionEngine = new EvolutionEngine();
            
            // 绑定控制事件
            document.getElementById('speedSlider')?.addEventListener('input', (e) => {
                const speeds = { 1: '慢速', 2: '中速', 3: '快速' };
                document.getElementById('speedLabel').textContent = speeds[e.target.value];
                this.evolutionEngine.evolutionSpeed = parseInt(e.target.value);
            });
            
            document.getElementById('btn-pause')?.addEventListener('click', () => {
                this.evolutionEngine.paused = !this.evolutionEngine.paused;
                document.getElementById('btn-pause').textContent = this.evolutionEngine.paused ? '继续' : '暂停';
            });
            
            document.getElementById('btn-reset')?.addEventListener('click', () => {
                this.evolutionEngine = new EvolutionEngine();
                this.evolutionEngine.startEvolution();
            });
            
            // 启动演进
            this.evolutionEngine.startEvolution();
            
            // 开始动画循环
            this.lastEvolutionTime = performance.now();
            this.evolutionLoop();
        }
    }
    
    evolutionLoop() {
        if (this.currentTab !== 'evolution') {
            requestAnimationFrame(() => this.evolutionLoop());
            return;
        }
        
        const now = performance.now();
        const dt = (now - this.lastEvolutionTime) / 1000;
        this.lastEvolutionTime = now;
        
        // 更新
        this.evolutionEngine.update(dt);
        
        // 渲染
        if (this.evolutionCtx && this.evolutionCanvas) {
            this.evolutionCanvas.width = this.evolutionCanvas.parentElement.clientWidth;
            this.evolutionCanvas.height = this.evolutionCanvas.parentElement.clientHeight;
            renderEvolution(this.evolutionCtx, this.evolutionCanvas, this.evolutionEngine);
        }
        
        // 更新日志
        this.updateEvolutionLog();
        
        requestAnimationFrame(() => this.evolutionLoop());
    }
    
    updateEvolutionLog() {
        const logEl = document.getElementById('evolution-log');
        if (logEl && this.evolutionEngine) {
            logEl.innerHTML = this.evolutionEngine.logs.slice(0, 20).map(log => 
                `<div class="log-item ${log.type}">${log.time} ${log.message}</div>`
            ).join('');
        }
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
        
        if (tab === 'evolution') {
            this.lastEvolutionTime = performance.now();
        }
    }
}
```

- [ ] **Step 2: 添加演进 Tab 按钮到 HTML**

```html
<button class="tab-btn active" data-tab="dashboard">工厂大脑</button>
<button class="tab-btn" data-tab="report">AI 方案生成</button>
<button class="tab-btn" data-tab="evolution">AI 演进</button>
```

---

## 自检清单

**Spec 覆盖检查：**
- [x] 12 部门节点（业务流排列）- Task 2 DEPT_EVOLUTION
- [x] 人力=火柴人，Agent=机器人 - Task 3 drawStickFigure, drawRobot
- [x] 演进 Agent 悬浮顶部俯视 - Task 3 drawEvolutionAgent
- [x] 进化光芒/粒子 - Task 4 EvolutionParticle
- [x] 磨合期颜色渐变 - Task 2 getMaturityColor
- [x] 成熟触发下一波 - Task 5 triggerEvolution
- [x] Skill/MCP 装备系统 - Task 3 drawEquipments, Task 4 EquipParticle
- [x] 装配动画 - Task 4 EquipParticle
- [x] 人机协作虚线 - Task 4 CollaborationFlow
- [x] 控制面板（速度/暂停/重置） - Task 1 + Task 7
- [x] 事件日志 - Task 7 updateEvolutionLog

**占位符扫描：**
- 无 TBD/TODO
- 无不完整的步骤

**类型一致性：**
- `EvolutionEngine.update(dt)` ✓
- `EvolutionParticle.update(dt)` ✓
- `CollaborationFlow.update(dt)` ✓
- `renderEvolution(ctx, canvas, engine)` ✓

---

## 实施顺序

1. **Task 1** → HTML 结构 + CSS 样式
2. **Task 2** → 数据结构 + 颜色函数
3. **Task 3** → 绘图函数（火柴人/机器人/演进Agent）
4. **Task 4** → 粒子系统（进化流/协作流/装备）
5. **Task 5** → 演进引擎（磨合期/触发逻辑）
6. **Task 6** → 渲染整合
7. **Task 7** → 应用集成（Tab切换/事件绑定/主循环）

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-13-工厂AI演进可视化系统-implementation-plan.md`**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
