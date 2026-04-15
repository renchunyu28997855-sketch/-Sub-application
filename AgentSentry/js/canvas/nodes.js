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
