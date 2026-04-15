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
        this.startX = x;
        this.startY = y;

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
