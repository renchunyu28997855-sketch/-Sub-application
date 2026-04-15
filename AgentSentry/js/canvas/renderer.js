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
        if (deltaTime > 0) {
            this.lastTime = timestamp;
            this.render(deltaTime);
        }
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
        const fpsEl = document.getElementById('fps-counter');
        if (fpsEl) {
            fpsEl.textContent = `${Math.round(1 / Math.max(deltaTime, 0.001))} FPS`;
        }
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
