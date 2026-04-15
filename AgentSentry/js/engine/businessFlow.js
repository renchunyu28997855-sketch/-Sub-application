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
