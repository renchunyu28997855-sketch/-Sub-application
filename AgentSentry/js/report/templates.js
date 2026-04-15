// js/report/templates.js

export const REPORT_TEMPLATES = {
    generateReport(data) {
        const painPointLabels = {
            production: '生产效率低/交期不准',
            quality: '产品质检问题',
            equipment: '设备突发故障',
            inventory: '原材料/库存混乱',
            decision: '报表/决策缺数据'
        };

        const budgetLabels = { low: '低（<5万）', medium: '中（5-30万）', high: '高（>30万）' };
        const timelineLabels = { fast: '1个月内', medium: '3-6个月', long: '半年以上' };
        const productLabels = {
            injection: '注塑模具',
            stamping: '冲压模具',
            diecasting: '压铸模具',
            other: '其他'
        };

        return `
<h1>${data.factoryName || 'XX模具工厂'} AI 降本增效方案</h1>

<h2>一、工厂概况分析</h2>
<table>
<tr><th>指标</th><th>数值</th></tr>
<tr><td>员工人数</td><td>${data.employeeCount || '-'} 人</td></tr>
<tr><td>厂房面积</td><td>${data.factoryArea || '-'} ㎡</td></tr>
<tr><td>年产值</td><td>${data.annualOutput || '-'} 万元</td></tr>
<tr><td>净利润率</td><td>${data.profitRate || '-'}%</td></tr>
<tr><td>主要产品</td><td>${(data.products || []).map(p => productLabels[p]).join('、') || '-'}</td></tr>
<tr><td>核心痛点</td><td>${(data.painPoints || []).map(p => painPointLabels[p]).join('、') || '-'}</td></tr>
<tr><td>预算范围</td><td>${budgetLabels[data.budget] || '-'}</td></tr>
<tr><td>期望周期</td><td>${timelineLabels[data.timeline] || '-'}</td></tr>
</table>

<h2>二、解决方案（6大维度）</h2>

<h3>2.1 生产流程优化</h3>
<p><strong>现状问题：</strong>排产不合理导致交期延误，换模时间过长</p>
<p><strong>AI 方案：</strong>引入 AI 智能排产系统，基于订单优先级、设备负载、人员技能进行动态调度</p>
<p><strong>预期效果：</strong>生产周期缩短 15-25%，设备利用率提升 10-20%</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>部署 AI 智能排产引擎，接入现有 MES 系统</li>
<li>建立订单优先级模型（紧急度+利润+交期）</li>
<li>瓶颈工序识别与预警机制</li>
<li>工序节拍平衡分析，动态调整人员配置</li>
</ul>

<h3>2.2 质量检测智能化</h3>
<p><strong>现状问题：</strong>目检依赖人工，漏检率高，质量数据分散</p>
<p><strong>AI 方案：</strong>视觉 AI 检测系统 + 缺陷模式分析</p>
<p><strong>预期效果：</strong>良品率提升至 99%+，漏检率降低 80%</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>部署工业相机 + 视觉 AI 检测（裂纹/毛刺/尺寸偏差）</li>
<li>建立历史缺陷模式数据库</li>
<li>检测报告自动生成与实时上传</li>
<li>SPC 过程控制，异常实时预警</li>
</ul>

<h3>2.3 设备预测性维护</h3>
<p><strong>现状问题：</strong>突发停机频繁，维修成本高，被动维护为主</p>
<p><strong>AI 方案：</strong>IoT 传感器 + 预测性维护 AI 模型</p>
<p><strong>预期效果：</strong>非计划停机减少 50%，维修成本降低 20-30%</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>机床振动、温度、电流传感器部署</li>
<li>刀具寿命预测模型</li>
<li>维修工单智能分配与抢单机制</li>
<li>备件库存优化</li>
</ul>

<h3>2.4 供应链与库存优化</h3>
<p><strong>现状问题：</strong>原料浪费，库存积压，供应商交期不准</p>
<p><strong>AI 方案：</strong>智能库存管理系统 + 采购预测</p>
<p><strong>预期效果：</strong>库存周转提升 20-30%，减少资金占用</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>原料消耗实时监控与自动补货</li>
<li>安全库存智能计算</li>
<li>供应商绩效分析</li>
<li>呆滞物料预警与处理建议</li>
</ul>

<h3>2.5 能源管理</h3>
<p><strong>现状问题：</strong>电耗过高，空载运行，峰谷用电不均</p>
<p><strong>AI 方案：</strong>能源管理系统 + 用电优化</p>
<p><strong>预期效果：</strong>能耗降低 10-15%</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>主要设备能耗实时监测</li>
<li>峰谷用电优化策略</li>
<li>空载自动休眠机制</li>
<li>能耗 Dashboard 大屏展示</li>
</ul>

<h3>2.6 智能报表与决策</h3>
<p><strong>现状问题：</strong>数据分散，报表滞后，决策凭经验</p>
<p><strong>AI 方案：</strong>数据中台 + BI + AI 决策建议</p>
<p><strong>预期效果：</strong>报表效率提升 80%，决策有据可依</p>
<p><strong>实施措施：</strong></p>
<ul>
<li>打通 MES/ERP/设备数据孤岛</li>
<li>建立工厂数据中台</li>
<li>关键指标实时 Dashboard</li>
<li>AI 辅助决策建议系统</li>
</ul>

<h2>三、AI 接入架构</h2>

<h3>推荐方案：P1 深度改造（3-6个月）</h3>
<table>
<tr><th>层面</th><th>技术选型</th></tr>
<tr><td>应用层</td><td>Web Dashboard + 小程序</td></tr>
<tr><td>AI 服务层</td><td>DeepSeek API + 模具行业知识库</td></tr>
<tr><td>数据层</td><td>MES/ERP + IoT 传感器 + Excel</td></tr>
<tr><td>部署方式</td><td>SaaS + 本地混合</td></tr>
</table>

<h3>实施周期</h3>
<table>
<tr><th>阶段</th><th>周期</th><th>内容</th></tr>
<tr><td>第一阶段</td><td>1-2月</td><td>数据采集 + Dashboard + AI 客服</td></tr>
<tr><td>第二阶段</td><td>3-4月</td><td>智能排产 + 质检 AI</td></tr>
<tr><td>第三阶段</td><td>5-6月</td><td>预测维护 + 能源优化 + 全面集成</td></tr>
</table>

<h2>四、效果预估</h2>
<table>
<tr><th>指标</th><th>当前</th><th>目标</th><th>提升</th></tr>
<tr><td>生产效率</td><td>基线</td><td>+15-25%</td><td>显著</td></tr>
<tr><td>良品率</td><td>${data.profitRate || '95'}%</td><td>>99%</td><td>+4%+</td></tr>
<tr><td>设备 OEE</td><td>基线</td><td>+10-15%</td><td>显著</td></tr>
<tr><td>能源成本</td><td>基线</td><td>-10-15%</td><td>节约</td></tr>
<tr><td>库存周转</td><td>基线</td><td>+20-30%</td><td>优化</td></tr>
</table>

<h3>ROI 测算</h3>
<p>按年产值 ${data.annualOutput || '5000'} 万元测算：</p>
<ul>
<li>预计年度节约成本：200-400 万元</li>
<li>项目投入（中等预算）：50-100 万元</li>
<li>投资回收期：6-12 个月</li>
</ul>

<h2>五、下一步行动</h2>
<ol>
<li>确认工厂详细数据（设备清单、工艺流程）</li>
<li>现有系统调研（MES/ERP 品牌、版本）</li>
<li>试点工序选择（建议从质检或排产切入）</li>
<li>供应商评估与 POC</li>
<li>签订合同，启动第一阶段</li>
</ol>

<p style="text-align:center; margin-top: 3rem; color: #8b9cb3;">
本报告由 AI 生成，具体方案需根据工厂实际情况调整
</p>
        `;
    }
};
