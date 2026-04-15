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
        this.businessFlow.setRenderer(this.renderer);
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