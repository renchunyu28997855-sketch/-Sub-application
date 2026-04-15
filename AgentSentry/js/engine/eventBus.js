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
