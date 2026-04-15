# 工厂 AI 演进可视化系统 v3 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现光波向全场扩散机制，部门演进时人变少光点变多，人形在上机器人在下左右分开

**Architecture:** 基于 Canvas 2D 重构，新增 ExpansionWave 类处理光波扩散，部门节点重构为上下排列（人上、机下）

**Tech Stack:** 纯 HTML/CSS/JS，Canvas 2D API，requestAnimationFrame

---

## 文件结构

```
F:/develop/AgentSentry/
└── index.html                    # 单文件应用，修改以下区域:
    ├── 第568行: DEPT_EVOLUTION 数据
    ├── 第584行: REVIEW_AGENT/EVOLUTION_AGENT
    ├── 第750行: WorkflowWave 类 (替换为 ExpansionWave)
    ├── 第850行: EvolutionEngine 类 (重构)
    ├── 第950行: drawDeptHumans 函数 (新增)
    ├── 第1000行: renderEvolution 函数 (重构)
    └── 第1200行: evolutionLoop 函数
```

---

## Task 1: 新增 ExpansionWave 类（光波扩散）

**Files:**
- Modify: `index.html:750-800` (替换现有 WorkflowWave 类)

- [ ] **Step 1: 替换 WorkflowWave 为 ExpansionWave**

找到约750行的 `class WorkflowWave {`，替换为:

```javascript
// ============ EXPANSION WAVE (光波扩散) ============
class ExpansionWave {
    constructor(centerX, centerY, maxRadius, color, duration = 3000) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = 0;
        this.maxRadius = maxRadius;
        this.color = color;
        this.duration = duration;
        this.elapsed = 0;
        this.alive = true;
        this.width = 4;
    }
    update(dt) {
        this.elapsed += dt * 1000;
        this.radius = (this.elapsed / this.duration) * this.maxRadius;
        if (this.elapsed >= this.duration) {
            this.alive = false;
        }
    }
    draw(ctx) {
        if (!this.alive) return;
        const alpha = Math.max(0, 1 - (this.radius / this.maxRadius));
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = alpha * 0.8;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        // 内圈光晕
        ctx.globalAlpha = alpha * 0.3;
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.restore();
    }
    // 检查部门是否在光波范围内
    isInWave(deptX, deptY) {
        const dx = deptX - this.centerX;
        const dy = deptY - this.centerY;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }
}
```

- [ ] **Step 2: 验证语法**

```bash
sed -n '265,1468p' index.html > /tmp/test.js && node --check /tmp/test.js
```

---

## Task 2: 更新部门数据（简化字段）

**Files:**
- Modify: `index.html:568-590` (DEPT_EVOLUTION)

- [ ] **Step 1: 简化部门数据结构**

找到 `DEPT_EVOLUTION` 数组，替换为:

```javascript
const DEPT_EVOLUTION = [
    { id: 'order', name: '订单管理', x: 0.15, y: 0.25, humanCount: 5, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '交付准时率', value: 85, initial: 85, unit: '%', better: 'higher' }, skills: [], mcps: [] },
    { id: 'design', name: '设计部', x: 0.35, y: 0.25, humanCount: 5, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '设计周期', value: 15, initial: 15, unit: '天', better: 'lower' }, skills: [], mcps: [] },
    { id: 'production', name: '生产车间', x: 0.55, y: 0.25, humanCount: 5, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '产能利用率', value: 70, initial: 70, unit: '%', better: 'higher' }, skills: [], mcps: [] },
    { id: 'quality', name: '质检部门', x: 0.75, y: 0.25, humanCount: 5, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '良率', value: 92, initial: 92, unit: '%', better: 'higher' }, skills: ['vision'], mcps: [] },
    { id: 'equipment', name: '设备维护', x: 0.85, y: 0.45, humanCount: 5, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '设备故障率', value: 15, initial: 15, unit: '%', better: 'lower' }, skills: [], mcps: ['sensor'] },
    { id: 'energy', name: '能源管理', x: 0.85, y: 0.65, humanCount: 4, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '能耗效率', value: 75, initial: 75, unit: '%', better: 'higher' }, skills: [], mcps: [] },
    { id: 'warehouse', name: '仓储管理', x: 0.75, y: 0.8, humanCount: 5, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '库存周转率', value: 8, initial: 8, unit: '次/年', better: 'higher' }, skills: ['logistics'], mcps: [] },
    { id: 'purchase', name: '采购部', x: 0.55, y: 0.8, humanCount: 5, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '采购成本率', value: 95, initial: 95, unit: '%', better: 'lower' }, skills: [], mcps: ['erp'] },
    { id: 'finance', name: '财务部', x: 0.35, y: 0.8, humanCount: 5, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '账务准确率', value: 98, initial: 98, unit: '%', better: 'higher' }, skills: ['accounting'], mcps: [] },
    { id: 'afterSales', name: '售后跟踪', x: 0.15, y: 0.8, humanCount: 5, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '客户满意度', value: 80, initial: 80, unit: '%', better: 'higher' }, skills: [], mcps: [] },
    { id: 'hr', name: '人力资源', x: 0.15, y: 0.55, humanCount: 4, aiRate: 10, evolutionProgress: 0, inEvolution: false, underReview: false, kpi: { name: '排班效率', value: 70, initial: 70, unit: '%', better: 'higher' }, skills: [], mcps: [] },
    { id: 'datahub', name: '数据中枢', x: 0.55, y: 0.5, humanCount: 4, aiRate: 60, evolutionProgress: 60, inEvolution: false, underReview: false, kpi: { name: '数据处理及时率', value: 85, initial: 85, unit: '%', better: 'higher' }, skills: ['analytics'], mcps: ['ai'] }
];

// 审查 Agent 居中
const REVIEW_AGENT = { x: 0.5, y: 0.5, status: 'active', pulsePhase: 0 };
```

- [ ] **Step 2: 验证语法**

---

## Task 3: 重构 EvolutionEngine 类

**Files:**
- Modify: `index.html:850-950` (EvolutionEngine 类)

- [ ] **Step 1: 替换 EvolutionEngine 类**

找到 `class EvolutionEngine {`，替换为:

```javascript
// ============ EVOLUTION ENGINE ============
class EvolutionEngine {
    constructor() {
        this.departments = JSON.parse(JSON.stringify(DEPT_EVOLUTION));
        this.reviewAgent = { ...REVIEW_AGENT };
        this.expansionWave = null;       // 当前扩散光波
        this.phase = 'idle';            // 'idle', 'review', 'evolution'
        this.dataFlows = [];
        this.evolutionSpeed = 1;
        this.paused = false;
        this.logs = [];
        this.reviewQueue = [];
        this.evolutionQueue = [];
        this.initDataFlows();
        this.initKPIImprovement();
    }
    initKPIImprovement() {
        setInterval(() => {
            if (this.paused) return;
            this.departments.forEach(dept => {
                if (dept.kpi && !dept.underReview && !dept.inEvolution) {
                    const improvement = (Math.random() * 1.5);
                    if (dept.kpi.better === 'higher') {
                        dept.kpi.value = Math.min(100, dept.kpi.value + improvement);
                    } else {
                        dept.kpi.value = Math.max(0, dept.kpi.value - improvement);
                    }
                }
            });
        }, 2000);
    }
    initDataFlows() {
        const canvas = document.getElementById('mainCanvas2');
        if (!canvas) return;
        DEPT_CONNECTIONS_EVO.forEach(conn => {
            const fromDept = this.departments.find(d => d.id === conn.from);
            const toDept = this.departments.find(d => d.id === conn.to);
            if (fromDept && toDept) {
                const x1 = fromDept.x * canvas.width, y1 = fromDept.y * canvas.height;
                const x2 = toDept.x * canvas.width, y2 = toDept.y * canvas.height;
                this.dataFlows.push(new DataFlowParticle(x1, y1, x2, y2));
            }
        });
    }
    kpiPassed(dept) {
        if (!dept.kpi) return false;
        const { value, initial, better } = dept.kpi;
        if (better === 'higher') return value > initial;
        return value < initial;
    }
    getCanvasCenter() {
        const canvas = document.getElementById('mainCanvas2');
        if (!canvas) return { x: 0, y: 0 };
        return { x: canvas.width / 2, y: canvas.height / 2 };
    }
    getMaxRadius() {
        const canvas = document.getElementById('mainCanvas2');
        if (!canvas) return 0;
        return Math.max(canvas.width, canvas.height);
    }
    update(dt) {
        if (this.paused) return;
        this.reviewAgent.pulsePhase += dt * 3;

        const canvas = document.getElementById('mainCanvas2');
        if (!canvas) return;

        // 更新扩散光波
        if (this.expansionWave) {
            this.expansionWave.update(dt);
            // 检查哪些部门被波及
            this.departments.forEach(dept => {
                const deptX = dept.x * canvas.width;
                const deptY = dept.y * canvas.height;
                if (this.expansionWave.isInWave(deptX, deptY)) {
                    if (this.phase === 'review') {
                        dept.underReview = true;
                    } else if (this.phase === 'evolution') {
                        dept.inEvolution = true;
                    }
                }
            });
            if (!this.expansionWave.alive) {
                this.expansionWave = null;
                if (this.phase === 'review') {
                    // 审查光波结束，开始进化阶段
                    this.phase = 'evolution';
                    this.addLog('审查光波扩散完毕，开始进化', 'info');
                    // 重置演进状态
                    this.departments.forEach(d => {
                        d.inEvolution = false;
                        d.evolutionProgress = 0;
                    });
                    // 发出进化光波
                    const center = this.getCanvasCenter();
                    this.expansionWave = new ExpansionWave(center.x, center.y, this.getMaxRadius(), '#00ff88', 4000);
                } else if (this.phase === 'evolution') {
                    // 进化光波结束，一轮完成
                    this.phase = 'idle';
                    this.addLog('=== 一轮演进完成 ===', 'success');
                    // 重置状态，准备下一轮
                    setTimeout(() => this.startNewRound(), 3000);
                }
            }
        }

        // 空闲阶段，发出审查光波
        if (!this.expansionWave && this.phase === 'idle') {
            const center = this.getCanvasCenter();
            this.expansionWave = new ExpansionWave(center.x, center.y, this.getMaxRadius(), '#9b59b6', 3000);
            this.phase = 'review';
            this.departments.forEach(d => d.underReview = false);
            this.addLog('审查光波开始扩散', 'info');
        }

        // 演进进度更新
        this.departments.forEach(dept => {
            if (dept.inEvolution) {
                dept.evolutionProgress += dt * 15 * this.evolutionSpeed;
                if (dept.evolutionProgress >= 100) {
                    dept.evolutionProgress = 100;
                    dept.aiRate = Math.min(100, dept.aiRate + 20);
                }
            }
        });

        // 更新数据流
        this.dataFlows.forEach(f => f.update(dt));
        this.dataFlows = this.dataFlows.filter(f => f.alive);
        if (this.dataFlows.length < 10) {
            const conn = DEPT_CONNECTIONS_EVO[Math.floor(Math.random() * DEPT_CONNECTIONS_EVO.length)];
            const from = this.departments.find(d => d.id === conn.from);
            const to = this.departments.find(d => d.id === conn.to);
            if (from && to) {
                this.dataFlows.push(new DataFlowParticle(
                    from.x * canvas.width, from.y * canvas.height,
                    to.x * canvas.width, to.y * canvas.height
                ));
            }
        }
    }
    startNewRound() {
        this.phase = 'idle';
        this.departments.forEach(d => {
            d.underReview = false;
            d.inEvolution = false;
        });
        this.addLog('开始新一轮演进', 'info');
    }
    addLog(message, type = 'info') {
        const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        this.logs.unshift({ time, message, type });
        if (this.logs.length > 50) this.logs.pop();
    }
}
```

- [ ] **Step 2: 验证语法**

---

## Task 4: 新增部门人形渲染函数

**Files:**
- Modify: `index.html:950-1000` (在 drawRobot 函数后添加)

- [ ] **Step 1: 添加 drawDeptHumans 和 drawDeptRobot 函数**

找到 `function drawRobot` 函数结束处，在其后添加:

```javascript
// 绘制部门人形（上排）
function drawDeptHumans(ctx, x, y, size, count, color, alpha = 1) {
    if (count <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    const spacing = size * 0.4;
    const startX = x - ((count - 1) * spacing) / 2;
    for (let i = 0; i < count; i++) {
        const hx = startX + i * spacing;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        // 头
        ctx.beginPath(); ctx.arc(hx, y - size * 0.25, size * 0.12, 0, Math.PI * 2); ctx.stroke();
        // 身体
        ctx.beginPath(); ctx.moveTo(hx, y - size * 0.13); ctx.lineTo(hx, y + size * 0.15); ctx.stroke();
        // 手臂
        ctx.beginPath(); ctx.moveTo(hx - size * 0.15, y); ctx.lineTo(hx + size * 0.15, y); ctx.stroke();
        // 腿
        ctx.beginPath(); ctx.moveTo(hx, y + size * 0.15); ctx.lineTo(hx - size * 0.1, y + size * 0.3);
        ctx.moveTo(hx, y + size * 0.15); ctx.lineTo(hx + size * 0.1, y + size * 0.3); ctx.stroke();
    }
    ctx.restore();
}

// 绘制部门机器人（下排，单个）
function drawDeptRobot(ctx, x, y, size, color, time) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    // 六边形身体
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - Math.PI / 6;
        const px = x + Math.cos(angle) * size * 0.35;
        const py = y + Math.sin(angle) * size * 0.35;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(26, 35, 50, 0.9)';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // 眼睛
    const blinkPhase = (time / 200) % 100;
    const eyeH = blinkPhase < 5 ? 1 : 3;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(x - size * 0.1, y - size * 0.05, 3, eyeH, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + size * 0.1, y - size * 0.05, 3, eyeH, 0, 0, Math.PI * 2); ctx.fill();
    // 天线
    ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - size * 0.35); ctx.lineTo(x, y - size * 0.45); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - size * 0.5, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}
```

- [ ] **Step 2: 验证语法**

---

## Task 5: 更新渲染函数 renderEvolution

**Files:**
- Modify: `index.html:1100-1200` (renderEvolution 函数)

- [ ] **Step 1: 重写 renderEvolution 函数**

找到 `function renderEvolution(ctx, canvas, engine) {`，替换为:

```javascript
function renderEvolution(ctx, canvas, engine) {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#0a0e17'; ctx.fillRect(0, 0, w, h);
    drawEvolutionGrid(ctx, w, h);

    // 绘制连接线
    ctx.save();
    ctx.strokeStyle = 'rgba(42, 58, 80, 0.4)'; ctx.lineWidth = 1;
    DEPT_CONNECTIONS_EVO.forEach(conn => {
        const from = engine.departments.find(d => d.id === conn.from);
        const to = engine.departments.find(d => d.id === conn.to);
        if (from && to) {
            ctx.beginPath();
            ctx.moveTo(from.x * w, from.y * h);
            ctx.lineTo(to.x * w, to.y * h);
            ctx.stroke();
        }
    });
    ctx.restore();

    // 绘制数据流粒子
    engine.dataFlows.forEach(f => f.draw(ctx));

    // 绘制扩散光波
    if (engine.expansionWave) engine.expansionWave.draw(ctx);

    // 绘制审查 Agent（居中）
    drawReviewAgent(ctx, engine.reviewAgent.x * w, engine.reviewAgent.y * h, 50, engine.reviewAgent.pulsePhase);

    // 绘制部门节点
    engine.departments.forEach(dept => {
        const x = dept.x * w, y = dept.y * h, size = 45;

        // 计算演进相关数值
        const aiRate = dept.aiRate;
        const humanCount = Math.max(1, Math.round((1 - aiRate / 100) * 5));
        const dotCount = Math.round((aiRate / 100) * 5);
        const maturityColor = getMaturityColor(aiRate);

        // 演进中/审查中效果
        if (dept.inEvolution) {
            const pulse = 0.4 + 0.3 * Math.sin(Date.now() / 200);
            ctx.save();
            ctx.beginPath(); ctx.arc(x, y, size * 1.3, 0, Math.PI * 2);
            ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 3; ctx.globalAlpha = pulse; ctx.stroke();
            ctx.restore();
        }
        if (dept.underReview) {
            const pulse = 0.4 + 0.3 * Math.sin(Date.now() / 200);
            ctx.save();
            ctx.beginPath(); ctx.arc(x, y, size * 1.3, 0, Math.PI * 2);
            ctx.strokeStyle = '#9b59b6'; ctx.lineWidth = 3; ctx.globalAlpha = pulse; ctx.stroke();
            ctx.restore();
        }

        // 部门底色（根据演进百分比）
        ctx.save();
        ctx.beginPath(); ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = maturityColor; ctx.globalAlpha = 0.2; ctx.fill();
        ctx.restore();

        // 人形在上排（左侧）
        drawDeptHumans(ctx, x - 15, y - size * 0.5, size * 0.5, humanCount, '#8b9cb3', 1);

        // 机器人在下排（右侧）
        drawDeptRobot(ctx, x + 15, y + size * 0.3, size * 0.6, maturityColor, Date.now());

        // 绘制光点围绕机器人（右下侧）
        for (let i = 0; i < dotCount; i++) {
            const angle = (i / Math.max(1, dotCount)) * Math.PI * 1.5 - Math.PI * 0.25;
            const dotX = x + 15 + Math.cos(angle) * size * 0.7;
            const dotY = y + size * 0.3 + Math.sin(angle) * size * 0.5;
            ctx.save();
            ctx.shadowColor = i < dept.skills.length ? '#00ff88' : '#ff6b35';
            ctx.shadowBlur = 8;
            ctx.font = '11px Arial';
            ctx.fillText(i < dept.skills.length ? '⚡' : '🔧', dotX - 5, dotY + 4);
            ctx.restore();
        }

        // 部门图标
        drawDeptIcon(ctx, x, y - size * 1.1, dept.id);

        // 部门名称
        ctx.fillStyle = '#e0e6ed'; ctx.font = '10px Microsoft YaHei'; ctx.textAlign = 'center';
        ctx.fillText(dept.name, x, y + size + 12);
        ctx.fillStyle = maturityColor; ctx.font = '9px Microsoft YaHei';
        ctx.fillText(`AI ${aiRate}%`, x, y + size + 22);
    });
}
```

- [ ] **Step 2: 验证语法**

---

## Task 6: 更新 drawReviewAgent 位置和样式

**Files:**
- Modify: `index.html:700-750` (drawReviewAgent 函数)

- [ ] **Step 1: 更新 drawReviewAgent 居中显示**

找到 `function drawReviewAgent`，确保它能在居中位置正确渲染:

```javascript
function drawReviewAgent(ctx, x, y, size, phase) {
    ctx.save();
    // 外圈紫色光环
    const pulseSize = size + Math.sin(phase) * 6;
    ctx.beginPath(); ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(155, 89, 182, ${0.3 + Math.sin(phase) * 0.2})`; ctx.lineWidth = 3; ctx.stroke();
    // 内圈
    ctx.beginPath(); ctx.arc(x, y, size * 0.75, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(155, 89, 182, 0.5)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowColor = '#9b59b6'; ctx.shadowBlur = 20;
    // 六边形身体
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - Math.PI / 6;
        const px = x + Math.cos(angle) * size * 0.4;
        const py = y + Math.sin(angle) * size * 0.4;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(50, 30, 70, 0.9)'; ctx.fill();
    ctx.strokeStyle = '#9b59b6'; ctx.lineWidth = 2; ctx.stroke();
    // 眼睛
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath(); ctx.arc(x - size * 0.12, y - size * 0.05, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + size * 0.12, y - size * 0.05, 4, 0, Math.PI * 2); ctx.fill();
    // 天线
    ctx.strokeStyle = '#9b59b6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - size * 0.4); ctx.lineTo(x, y - size * 0.55); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - size * 0.6, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9b59b6'; ctx.font = 'bold 11px Microsoft YaHei'; ctx.textAlign = 'center';
    ctx.fillText('审查 Agent', x, y + size + 18);
    ctx.restore();
}
```

- [ ] **Step 2: 验证语法**

---

## Task 7: 删除无用的 drawEvolutionAgentV2

**Files:**
- Modify: `index.html` (删除 drawEvolutionAgentV2 函数)

- [ ] **Step 1: 删除 drawEvolutionAgentV2 函数**

找到 `function drawEvolutionAgentV2`，整个函数删除（不再需要）

- [ ] **Step 2: 验证语法**

---

## Task 8: 清理无用的绘制代码

**Files:**
- Modify: `index.html` (删除 drawMultipleHumans, drawMultipleRobots, drawEquipments 等)

- [ ] **Step 1: 删除不再使用的函数**

删除以下函数：
- `drawMultipleHumans`
- `drawMultipleRobots`
- `drawEquipments`（光点改为在 renderEvolution 中直接绘制）

- [ ] **Step 2: 验证语法**

---

## 自检清单

1. **Spec覆盖检查**:
   - [x] ExpansionWave 类实现光波扩散
   - [x] 审查Agent居中
   - [x] 人形在上、机器人在下、左右分开
   - [x] 人从数个减少到1个
   - [x] 光点围绕机器人增加
   - [x] 部门颜色渐变（橙→绿）

2. **占位符扫描**: 无TBD/TODO

3. **类型一致性**:
   - `ExpansionWave`: centerX, centerY, radius, maxRadius, color, duration, elapsed, alive
   - `dept`: humanCount, aiRate, evolutionProgress, inEvolution, underReview, kpi
   - `renderEvolution`: ctx, canvas, engine 参数

**Plan complete and saved to `docs/superpowers/plans/2026-04-13-工厂AI演进可视化系统-v3-implementation-plan.md`**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
