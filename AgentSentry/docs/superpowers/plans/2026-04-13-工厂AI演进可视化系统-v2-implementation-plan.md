# 工厂 AI 演进可视化系统 v2 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现双Agent架构（进化Agent+审查Agent）、沿连接线流动的工作流、部门KPI审查机制、人机比例动态变化

**Architecture:** 基于现有Canvas 2D渲染，重构EvolutionEngine类，新增WorkflowWave类处理工作流，审查Agent与进化Agent协同工作

**Tech Stack:** 纯HTML/CSS/JS，Canvas 2D API，requestAnimationFrame

---

## 文件结构

```
F:/develop/AgentSentry/
└── index.html                    # 单文件应用，修改以下区域:
    ├── 第568行: DEPT_EVOLUTION 数据
    ├── 第584行: EVOLUTION_AGENT
    ├── 第586行: DEPT_CONNECTIONS_EVO
    ├── 第598行: getMaturityColor 函数
    ├── 第610行: drawStickFigure 函数
    ├── 第624行: drawRobot 函数
    ├── 第652行: drawEvolutionAgent 函数
    ├── 第700行: EvolutionParticle/CollaborationFlow 类
    ├── 第745行: EvolutionEngine 类
    ├── 第890行: renderEvolution 函数
    └── 第1100行: evolutionLoop 函数
```

---

## Task 1: 更新部门数据结构和KPI

**Files:**
- Modify: `index.html:568-596` (DEPT_EVOLUTION, EVOLUTION_AGENT, DEPT_CONNECTIONS_EVO)
- Modify: `index.html:598-607` (getMaturityColor, getNodeBaseColor)

- [ ] **Step 1: 替换部门数据结构**

替换 `DEPT_EVOLUTION` 常量:

```javascript
const DEPT_EVOLUTION = [
    { id: 'order', name: '订单管理', x: 0.15, y: 0.2, humanCount: 6, agentCount: 1, aiRate: 10, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: [], mcps: [], collaborators: [], kpi: { name: '交付准时率', value: 85, initial: 85, unit: '%', better: 'higher' } },
    { id: 'design', name: '设计部', x: 0.35, y: 0.2, humanCount: 8, agentCount: 1, aiRate: 10, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: [], mcps: [], collaborators: [], kpi: { name: '设计周期', value: 15, initial: 15, unit: '天', better: 'lower' } },
    { id: 'production', name: '生产车间', x: 0.55, y: 0.2, humanCount: 50, agentCount: 2, aiRate: 10, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: [], mcps: [], collaborators: [], kpi: { name: '产能利用率', value: 70, initial: 70, unit: '%', better: 'higher' } },
    { id: 'quality', name: '质检部门', x: 0.75, y: 0.2, humanCount: 12, agentCount: 2, aiRate: 20, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: ['vision'], mcps: [], collaborators: [], kpi: { name: '良率', value: 92, initial: 92, unit: '%', better: 'higher' } },
    { id: 'equipment', name: '设备维护', x: 0.85, y: 0.4, humanCount: 10, agentCount: 2, aiRate: 25, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: [], mcps: ['sensor'], collaborators: [], kpi: { name: '设备故障率', value: 15, initial: 15, unit: '%', better: 'lower' } },
    { id: 'energy', name: '能源管理', x: 0.85, y: 0.6, humanCount: 4, agentCount: 2, aiRate: 30, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: [], mcps: [], collaborators: [], kpi: { name: '能耗效率', value: 75, initial: 75, unit: '%', better: 'higher' } },
    { id: 'warehouse', name: '仓储管理', x: 0.75, y: 0.75, humanCount: 15, agentCount: 3, aiRate: 35, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: ['logistics'], mcps: [], collaborators: [], kpi: { name: '库存周转率', value: 8, initial: 8, unit: '次/年', better: 'higher' } },
    { id: 'purchase', name: '采购部', x: 0.55, y: 0.75, humanCount: 6, agentCount: 2, aiRate: 40, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: [], mcps: ['erp'], collaborators: [], kpi: { name: '采购成本率', value: 95, initial: 95, unit: '%', better: 'lower' } },
    { id: 'finance', name: '财务部', x: 0.35, y: 0.75, humanCount: 6, agentCount: 2, aiRate: 45, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: ['accounting'], mcps: [], collaborators: [], kpi: { name: '账务准确率', value: 98, initial: 98, unit: '%', better: 'higher' } },
    { id: 'afterSales', name: '售后跟踪', x: 0.15, y: 0.75, humanCount: 10, agentCount: 2, aiRate: 25, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: [], mcps: [], collaborators: [], kpi: { name: '客户满意度', value: 80, initial: 80, unit: '%', better: 'higher' } },
    { id: 'hr', name: '人力资源', x: 0.15, y: 0.55, humanCount: 4, agentCount: 1, aiRate: 20, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'human', skills: [], mcps: [], collaborators: [], kpi: { name: '排班效率', value: 70, initial: 70, unit: '%', better: 'higher' } },
    { id: 'datahub', name: '数据中枢', x: 0.55, y: 0.45, humanCount: 5, agentCount: 4, aiRate: 60, maturityLevel: 0, inMaturity: false, inReview: false, nodeType: 'agent', skills: ['analytics'], mcps: ['ai'], collaborators: [], kpi: { name: '数据处理及时率', value: 85, initial: 85, unit: '%', better: 'higher' } }
];

const REVIEW_AGENT = { x: 0.5, y: 0.15, status: 'active', pulsePhase: 0 };
const EVOLUTION_AGENT = { x: 0.5, y: 0.40, status: 'active', pulsePhase: 0 };

const DEPT_CONNECTIONS_EVO = [
    { from: 'order', to: 'design' }, { from: 'design', to: 'production' },
    { from: 'production', to: 'quality' }, { from: 'production', to: 'equipment' },
    { from: 'quality', to: 'warehouse' }, { from: 'equipment', to: 'energy' },
    { from: 'energy', to: 'production' }, { from: 'warehouse', to: 'purchase' },
    { from: 'purchase', to: 'finance' }, { from: 'finance', to: 'afterSales' },
    { from: 'afterSales', to: 'order' }, { from: 'hr', to: 'production' },
    { from: 'datahub', to: 'order' }, { from: 'datahub', to: 'design' },
    { from: 'datahub', to: 'production' }, { from: 'datahub', to: 'quality' },
    { from: 'datahub', to: 'finance' }
];
```

- [ ] **Step 2: 提交变更**

```bash
git add index.html
git commit -m "feat(evolution): update dept data with humanCount, agentCount, kpi, and position agents"
```

---

## Task 2: 实现 WorkflowWave 类（工作流波纹）

**Files:**
- Modify: `index.html:700-745` (在 CollaborationFlow 前插入新类)

- [ ] **Step 1: 添加 WorkflowWave 类**

在 `class CollaborationFlow` 前插入:

```javascript
// ============ WORKFLOW WAVES ============
class WorkflowWave {
    constructor(startX, startY, endX, endY, color, speed = 400) {
        this.startX = startX; this.startY = startY;
        this.endX = endX; this.endY = endY;
        this.progress = 0;
        this.color = color;
        this.speed = speed; // px/秒
        this.alive = true;
        this.width = color === '#9b59b6' ? 6 : 8; // 紫色审查波纹细一些，青绿进化波纹粗一些
    }
    update(dt) {
        const pathLength = Math.sqrt((this.endX-this.startX)**2 + (this.endY-this.startY)**2);
        this.progress += (this.speed * dt) / pathLength;
        if (this.progress >= 1) { this.alive = false; }
    }
    draw(ctx) {
        if (!this.alive) return;
        const x = this.startX + (this.endX - this.startX) * this.progress;
        const y = this.startY + (this.endY - this.startY) * this.progress;
        // 绘制路径上的光带
        ctx.save();
        ctx.shadowColor = this.color; ctx.shadowBlur = 15;
        ctx.strokeStyle = this.color; ctx.lineWidth = this.width;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(this.startX + (this.endX - this.startX) * Math.max(0, this.progress - 0.3),
                   this.startY + (this.endY - this.startY) * Math.max(0, this.progress - 0.3));
        ctx.lineTo(x, y);
        ctx.stroke();
        // 绘制波纹头部
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
        // 波纹头部光晕
        ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = this.color; ctx.lineWidth = 2; ctx.globalAlpha = 0.5; ctx.stroke();
        ctx.restore();
    }
}

class DataFlowParticle {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
        this.t = 0; this.speed = 0.15 + Math.random() * 0.1; this.alive = true; this.dir = 1;
    }
    update(dt) {
        this.t += this.speed * dt * this.dir;
        if (this.t >= 1) { this.t = 1; this.dir = -1; }
        if (this.t <= 0) { this.alive = false; }
    }
    draw(ctx) {
        if (!this.alive) return;
        const x = this.x1 + (this.x2 - this.x1) * this.t;
        const y = this.y1 + (this.y2 - this.y1) * this.t;
        ctx.save();
        ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 10;
        ctx.fillStyle = '#00d4ff'; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
}
```

- [ ] **Step 2: 提交变更**

```bash
git add index.html
git commit -m "feat(evolution): add WorkflowWave class for workflow visualization"
```

---

## Task 3: 实现审查Agent和进化Agent的绘制函数

**Files:**
- Modify: `index.html:652-685` (drawEvolutionAgent 函数)

- [ ] **Step 1: 替换 drawEvolutionAgent 为 drawReviewAgent 和 drawEvolutionAgentV2**

替换现有 `drawEvolutionAgent` 函数:

```javascript
function drawReviewAgent(ctx, x, y, size, phase) {
    ctx.save();
    // 外圈紫色光环
    const pulseSize = size + Math.sin(phase) * 8;
    ctx.beginPath(); ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(155, 89, 182, ${0.3 + Math.sin(phase) * 0.2})`; ctx.lineWidth = 3; ctx.stroke();
    // 内圈
    ctx.beginPath(); ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(155, 89, 182, 0.5)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowColor = '#9b59b6'; ctx.shadowBlur = 20;
    // 六边形身体
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - Math.PI / 6;
        const px = x + Math.cos(angle) * size * 0.3;
        const py = y + Math.sin(angle) * size * 0.3;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(50, 30, 70, 0.9)'; ctx.fill();
    ctx.strokeStyle = '#9b59b6'; ctx.lineWidth = 2; ctx.stroke();
    // 眼睛
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath(); ctx.arc(x - size * 0.1, y - size * 0.05, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + size * 0.1, y - size * 0.05, 4, 0, Math.PI * 2); ctx.fill();
    // 天线
    ctx.strokeStyle = '#9b59b6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - size * 0.3); ctx.lineTo(x, y - size * 0.45); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - size * 0.5, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9b59b6'; ctx.font = 'bold 11px Microsoft YaHei'; ctx.textAlign = 'center';
    ctx.fillText('审查 Agent', x, y + size + 15);
    ctx.restore();
}

function drawEvolutionAgentV2(ctx, x, y, size, phase) {
    ctx.save();
    // 外圈青色/绿色光环
    const pulseSize = size + Math.sin(phase) * 10;
    ctx.beginPath(); ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 + Math.sin(phase) * 0.2})`; ctx.lineWidth = 3; ctx.stroke();
    // 内圈绿色
    ctx.beginPath(); ctx.arc(x, y, size * 0.75, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 25;
    // 六边形身体
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - Math.PI / 6;
        const px = x + Math.cos(angle) * size * 0.35;
        const py = y + Math.sin(angle) * size * 0.35;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(26, 35, 50, 0.9)'; ctx.fill();
    ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2; ctx.stroke();
    // 眼睛
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00ff88';
    ctx.beginPath(); ctx.arc(x - size * 0.1, y - size * 0.05, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + size * 0.1, y - size * 0.05, 4, 0, Math.PI * 2); ctx.fill();
    // 天线
    ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - size * 0.35); ctx.lineTo(x, y - size * 0.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - size * 0.55, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#00ff88'; ctx.font = 'bold 12px Microsoft YaHei'; ctx.textAlign = 'center';
    ctx.fillText('进化 Agent', x, y + size + 20);
    ctx.restore();
}
```

- [ ] **Step 2: 提交变更**

```bash
git add index.html
git commit -m "feat(evolution): add drawReviewAgent and drawEvolutionAgentV2 functions"
```

---

## Task 4: 重构 EvolutionEngine 类

**Files:**
- Modify: `index.html:745-892` (EvolutionEngine 类)

- [ ] **Step 1: 替换 EvolutionEngine 类**

替换整个 `class EvolutionEngine` 为新版本:

```javascript
// ============ EVOLUTION ENGINE ============
class EvolutionEngine {
    constructor() {
        this.departments = JSON.parse(JSON.stringify(DEPT_EVOLUTION));
        this.reviewAgent = { ...REVIEW_AGENT };
        this.evolutionAgent = { ...EVOLUTION_AGENT };
        this.evolutionWaves = [];      // 进化工作流
        this.reviewWaves = [];         // 审查工作流
        this.dataFlows = [];
        this.evolutionSpeed = 3;
        this.paused = false;
        this.logs = [];
        this.initDataFlows();
        this.initKPIImprovement();
    }
    initKPIImprovement() {
        // 模拟KPI逐渐改善
        setInterval(() => {
            if (this.paused) return;
            this.departments.forEach(dept => {
                if (dept.kpi) {
                    const improvement = (Math.random() * 2);
                    if (dept.kpi.better === 'higher') {
                        dept.kpi.value = Math.min(100, dept.kpi.value + improvement);
                    } else {
                        dept.kpi.value = Math.max(0, dept.kpi.value - improvement);
                    }
                }
            });
        }, 3000);
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
    update(dt) {
        if (this.paused) return;
        this.reviewAgent.pulsePhase += dt * 3;
        this.evolutionAgent.pulsePhase += dt * 3;

        const canvas = document.getElementById('mainCanvas2');
        if (!canvas) return;

        // 审查Agent检查各部门KPI，发出审查工作流
        if (Math.random() < 0.02 * this.evolutionSpeed) {
            const candidates = this.departments.filter(d => !d.inReview && !d.inMaturity && d.aiRate < 100);
            if (candidates.length > 0) {
                const target = candidates[Math.floor(Math.random() * candidates.length)];
                if (this.kpiPassed(target)) {
                    target.inReview = true;
                    const rx = this.reviewAgent.x * canvas.width;
                    const ry = this.reviewAgent.y * canvas.height;
                    const tx = target.x * canvas.width;
                    const ty = target.y * canvas.height;
                    this.reviewWaves.push(new WorkflowWave(rx, ry, tx, ty, '#9b59b6', 400));
                    this.addLog(`审查Agent开始审查 ${target.name} (${target.kpi.name}: ${target.kpi.value}${target.kpi.unit})`, 'info');
                }
            }
        }

        // 进化Agent在审查通过后发出进化工作流
        this.departments.forEach(dept => {
            if (dept.inReview && dept.maturityLevel >= 100) {
                dept.inReview = false;
                dept.inMaturity = true;
                const ex = this.evolutionAgent.x * canvas.width;
                const ey = this.evolutionAgent.y * canvas.height;
                const tx = dept.x * canvas.width;
                const ty = dept.y * canvas.height;
                this.evolutionWaves.push(new WorkflowWave(ex, ey, tx, ty, '#00ff88', 500));
                this.addLog(`${dept.name} 审查通过！开始演进`, 'success');
            }
        });

        // 审查工作流到达后，部门进入审查完成状态
        this.reviewWaves.forEach(wave => {
            if (!wave.alive) {
                const target = this.departments.find(d => {
                    const canvas2 = document.getElementById('mainCanvas2');
                    const tx = d.x * canvas2.width;
                    const ty = d.y * canvas2.height;
                    return Math.abs(tx - wave.endX) < 5 && Math.abs(ty - wave.endY) < 5;
                });
                if (target && target.inReview) {
                    target.maturityLevel = 0;
                }
            }
        });

        // 成熟度提升
        this.departments.forEach(dept => {
            if (dept.inMaturity) {
                dept.maturityLevel += dt * 8 * this.evolutionSpeed;
                if (dept.maturityLevel >= 100) {
                    dept.maturityLevel = 100;
                    dept.aiRate = Math.min(100, dept.aiRate + 15);
                    dept.inMaturity = false;
                    this.addLog(`${dept.name} 演进完成！AI率: ${dept.aiRate}%`, 'success');
                    this.triggerEvolution(dept);
                }
            }
            // 审查中的成熟度
            if (dept.inReview) {
                dept.maturityLevel += dt * 5 * this.evolutionSpeed;
            }
        });

        // 更新工作流
        this.evolutionWaves.forEach(w => w.update(dt));
        this.reviewWaves.forEach(w => w.update(dt));
        this.evolutionWaves = this.evolutionWaves.filter(w => w.alive);
        this.reviewWaves = this.reviewWaves.filter(w => w.alive);

        // 更新数据流
        this.dataFlows.forEach(f => f.update(dt));
        this.dataFlows = this.dataFlows.filter(f => f.alive);
        if (this.dataFlows.length < 15) {
            const conn = DEPT_CONNECTIONS_EVO[Math.floor(Math.random() * DEPT_CONNECTIONS_EVO.length)];
            const from = this.departments.find(d => d.id === conn.from);
            const to = this.departments.find(d => d.id === conn.to);
            if (from && to) {
                const canvas2 = document.getElementById('mainCanvas2');
                this.dataFlows.push(new DataFlowParticle(
                    from.x * canvas2.width, from.y * canvas2.height,
                    to.x * canvas2.width, to.y * canvas2.height
                ));
            }
        }
    }
    triggerEvolution(dept) {
        // 触发相邻部门的演进准备
        const conn = DEPT_CONNECTIONS_EVO.find(c => c.from === dept.id || c.to === dept.id);
        if (!conn) return;
        const neighborId = conn.from === dept.id ? conn.to : conn.from;
        const neighbor = this.departments.find(d => d.id === neighborId);
        if (neighbor && neighbor.aiRate < 100 && !neighbor.inReview && !neighbor.inMaturity) {
            this.addLog(`${neighbor.name} 等待审查...`, 'info');
        }
    }
    addLog(message, type = 'info') {
        const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        this.logs.unshift({ time, message, type });
        if (this.logs.length > 50) this.logs.pop();
    }
    startEvolution() {
        setTimeout(() => {
            const firstDept = this.departments.find(d => d.aiRate < 50);
            if (firstDept) {
                firstDept.aiRate = 20;
                firstDept.maturityLevel = 0;
                this.addLog(`${firstDept.name} 开始 AI 演进`, 'info');
            }
        }, 2000);
    }
}
```

- [ ] **Step 2: 提交变更**

```bash
git add index.html
git commit -m "feat(evolution): rewrite EvolutionEngine with review mechanism and workflow waves"
```

---

## Task 5: 实现人机比例渲染

**Files:**
- Modify: `index.html:894-910` (drawStickFigure 和 drawRobot 函数)

- [ ] **Step 1: 修改 drawStickFigure 函数支持多个人形**

替换 `drawStickFigure` 函数:

```javascript
function drawStickFigure(ctx, x, y, size, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    // 头
    ctx.beginPath(); ctx.arc(x, y - size * 0.3, size * 0.15, 0, Math.PI * 2); ctx.stroke();
    // 身体
    ctx.beginPath(); ctx.moveTo(x, y - size * 0.15); ctx.lineTo(x, y + size * 0.2); ctx.stroke();
    // 手臂
    ctx.beginPath(); ctx.moveTo(x - size * 0.2, y); ctx.lineTo(x + size * 0.2, y); ctx.stroke();
    // 腿
    ctx.beginPath(); ctx.moveTo(x, y + size * 0.2); ctx.lineTo(x - size * 0.15, y + size * 0.4);
    ctx.moveTo(x, y + size * 0.2); ctx.lineTo(x + size * 0.15, y + size * 0.4); ctx.stroke();
    ctx.restore();
}

function drawMultipleHumans(ctx, x, y, size, count, color, maxDisplay = 5) {
    // 按比例缩放显示人数
    const displayCount = Math.max(1, Math.round((count / 50) * maxDisplay));
    const spacing = size * 0.4;
    const startX = x - (displayCount - 1) * spacing / 2;
    for (let i = 0; i < displayCount; i++) {
        drawStickFigure(ctx, startX + i * spacing, y, size * 0.5, color);
    }
}

function drawMultipleRobots(ctx, x, y, size, count, color, maxDisplay = 5) {
    // 按比例缩放显示机器人数
    const displayCount = Math.max(1, Math.round((count / 10) * maxDisplay));
    const spacing = size * 0.5;
    const startX = x - (displayCount - 1) * spacing / 2;
    for (let i = 0; i < displayCount; i++) {
        drawRobot(ctx, startX + i * spacing, y, size * 0.5, color, 1, Date.now());
    }
}
```

- [ ] **Step 2: 提交变更**

```bash
git add index.html
git commit -m "feat(evolution): add drawMultipleHumans and drawMultipleRobots for ratio display"
```

---

## Task 6: 更新渲染函数 renderEvolution

**Files:**
- Modify: `index.html:960-1010` (renderEvolution 函数)

- [ ] **Step 1: 重写 renderEvolution 函数**

替换 `renderEvolution` 函数:

```javascript
function renderEvolution(ctx, canvas, engine) {
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#0a0e17'; ctx.fillRect(0, 0, w, h);
    drawEvolutionGrid(ctx, w, h);

    // 绘制连接线
    ctx.save();
    ctx.strokeStyle = 'rgba(42, 58, 80, 0.5)'; ctx.lineWidth = 2;
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

    // 绘制审查工作流
    engine.reviewWaves.forEach(w => w.draw(ctx));

    // 绘制进化工作流
    engine.evolutionWaves.forEach(w => w.draw(ctx));

    // 绘制审查Agent
    drawReviewAgent(ctx, engine.reviewAgent.x * w, engine.reviewAgent.y * h, 45, engine.reviewAgent.pulsePhase);

    // 绘制进化Agent
    drawEvolutionAgentV2(ctx, engine.evolutionAgent.x * w, engine.evolutionAgent.y * h, 55, engine.evolutionAgent.pulsePhase);

    // 绘制部门节点
    engine.departments.forEach(dept => {
        const x = dept.x * w, y = dept.y * h, size = 50;

        // 审查中状态 - 紫色光圈
        if (dept.inReview) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 300);
            ctx.save();
            ctx.beginPath(); ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(155, 89, 182, ${pulse})`; ctx.lineWidth = 3; ctx.stroke();
            ctx.restore();
        }

        // 磨合期状态 - 颜色光圈
        if (dept.inMaturity) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 500);
            ctx.save();
            ctx.beginPath(); ctx.arc(x, y, size * 0.9, 0, Math.PI * 2);
            ctx.strokeStyle = getMaturityColor(dept.maturityLevel); ctx.lineWidth = 3; ctx.globalAlpha = pulse; ctx.stroke();
            ctx.restore();
        }

        // 计算人机比例
        const totalUnits = dept.humanCount + dept.agentCount;
        const humanRatio = dept.humanCount / totalUnits;
        const currentHumanRatio = dept.aiRate / 100;
        const displayHumans = Math.max(1, Math.round(humanRatio * (1 - currentHumanRatio) * 5));
        const displayAgents = Math.max(0, Math.round(currentHumanRatio * 5));

        // 绘制人形
        if (displayHumans > 0) {
            drawMultipleHumans(ctx, x - 10, y, size, displayHumans, '#8b9cb3');
        }

        // 绘制机器人
        if (displayAgents > 0) {
            drawMultipleRobots(ctx, x + 15, y, size, displayAgents, getMaturityColor(dept.maturityLevel));
        }

        // 如果都是人，绘制人形
        if (displayHumans === 0 && displayAgents === 0) {
            drawStickFigure(ctx, x, y, size, '#8b9cb3');
        }

        // 绘制图标
        drawDeptIcon(ctx, x, y - size * 0.6, dept.id);

        // 绘制装备
        drawEquipments(ctx, x, y, size, dept);

        // 绘制名称和AI率
        ctx.fillStyle = '#e0e6ed'; ctx.font = '11px Microsoft YaHei'; ctx.textAlign = 'center';
        ctx.fillText(dept.name, x, y + size * 0.7 + 15);
        ctx.fillStyle = getMaturityColor(dept.maturityLevel); ctx.font = '10px Microsoft YaHei';
        ctx.fillText(`AI ${dept.aiRate}%`, x, y + size * 0.7 + 28);

        // 绘制KPI
        if (dept.kpi && (dept.inReview || dept.maturityLevel > 0)) {
            ctx.fillStyle = '#ffcc00'; ctx.font = '9px Microsoft YaHei';
            ctx.fillText(`${dept.kpi.name}: ${dept.kpi.value.toFixed(1)}${dept.kpi.unit}`, x, y - size * 0.8);
        }
    });
}
```

- [ ] **Step 2: 提交变更**

```bash
git add index.html
git commit -m "feat(evolution): rewrite renderEvolution with workflow waves and ratio display"
```

---

## Task 7: 更新动画循环和日志

**Files:**
- Modify: `index.html:1130-1180` (evolutionLoop 函数)

- [ ] **Step 1: 确保 evolutionLoop 调用更新**

检查 `evolutionLoop` 函数是否正确调用 `engine.update(dt)`:

```javascript
evolutionLoop() {
    if (this.currentTab !== 'evolution') { requestAnimationFrame(() => this.evolutionLoop()); return; }
    const now = performance.now();
    const dt = (now - this.lastEvolutionTime) / 1000;
    this.lastEvolutionTime = now;
    this.evolutionEngine.update(dt);
    if (this.evolutionCtx && document.getElementById('mainCanvas2')) {
        const canvas = document.getElementById('mainCanvas2');
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        renderEvolution(this.evolutionCtx, canvas, this.evolutionEngine);
    }
    this.updateEvolutionLog();
    requestAnimationFrame(() => this.evolutionLoop());
}
```

- [ ] **Step 2: 更新 updateEvolutionLog 显示KPI**

修改 `updateEvolutionLog` 函数以显示更多KPI信息:

```javascript
updateEvolutionLog() {
    const logEl = document.getElementById('evolution-log');
    if (logEl && this.evolutionEngine) {
        logEl.innerHTML = this.evolutionEngine.logs.slice(0, 15).map(log =>
            `<div class="log-item ${log.type}">${log.time} ${log.message}</div>`
        ).join('');
    }
}
```

- [ ] **Step 3: 提交变更**

```bash
git add index.html
git commit -m "feat(evolution): update evolution loop and log display"
```

---

## Task 8: 添加样式增强

**Files:**
- Modify: `index.html:100-160` (CSS样式)

- [ ] **Step 1: 添加进化相关的CSS样式**

查找 `.log-item` 样式，添加 `.log-item.info`, `.log-item.success`, `.log-item.review` 样式:

```css
.log-item { padding: 6px 10px; background: var(--bg-card); border-radius: 4px; font-size: 12px; margin-bottom: 4px; }
.log-item.info { border-left: 3px solid #00bbf9; }
.log-item.success { border-left: 3px solid #10b981; }
.log-item.review { border-left: 3px solid #9b59b6; }
```

- [ ] **Step 2: 提交变更**

```bash
git add index.html
git commit -m "feat(evolution): add styles for workflow log items"
```

---

## 自检清单

1. **Spec覆盖检查**:
   - [x] 进化Agent居中，发出工作流（青色/绿色）
   - [x] 审查Agent在上方，发出审查工作流（紫色）
   - [x] 工作流沿连接线流动
   - [x] 部门KPI审查机制
   - [x] 人机比例可视化
   - [x] 磨合期颜色变化（橙→黄→青→绿）

2. **占位符扫描**: 无TBD/TODO

3. **类型一致性**:
   - `WorkflowWave` 类属性: `startX, startY, endX, endY, progress, color, speed, alive`
   - `EvolutionEngine` 属性: `departments, reviewAgent, evolutionAgent, evolutionWaves, reviewWaves, dataFlows`
   - 部门属性: `humanCount, agentCount, aiRate, maturityLevel, inMaturity, inReview, kpi`

**Plan complete and saved to `docs/superpowers/plans/2026-04-13-工厂AI演进可视化系统-v2-implementation-plan.md`**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
