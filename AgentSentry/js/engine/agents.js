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
