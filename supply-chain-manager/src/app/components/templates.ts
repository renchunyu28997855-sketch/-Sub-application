export interface Template {
  id: string;
  name: string;
  category: string;
  scenario: string;
  context: {
    suppliers: string;
    products: string;
    volume: string;
    issues: string;
  };
}

export const templates: Template[] = [
  {
    id: 'supplier-evaluation',
    name: '供应商绩效评估',
    category: '供应商管理',
    scenario: '对现有供应商进行综合绩效评估，包括交货及时性、产品质量、价格竞争力、服务响应等方面，识别优秀供应商和需要改进的供应商。',
    context: {
      suppliers: '3-5家核心供应商，包含原材料供应商和零部件供应商',
      products: '主要产品线5-10个SKU',
      volume: '月度采购额约200万元',
      issues: '交期不稳定、偶有质量投诉'
    }
  },
  {
    id: 'supply-risk',
    name: '供应链风险分析',
    category: '风险管理',
    scenario: '识别供应链中的潜在风险点，包括供应中断、质量问题、价格波动、物流延迟等，制定风险应对策略。',
    context: {
      suppliers: '多家供应商，分布在不同地区',
      products: '产品种类繁多，部分关键零部件',
      volume: '采购品种100+',
      issues: '担心供应商集中度过高'
    }
  },
  {
    id: 'inventory-optimization',
    name: '库存协调优化',
    category: '库存管理',
    scenario: '分析当前库存状况，优化库存水平，减少积压和缺货，提高库存周转率。',
    context: {
      suppliers: '供应商交期7-30天不等',
      products: '成品50+SKU，原料200+',
      volume: '月销售约500万元',
      issues: '库存周转慢，积压严重'
    }
  }
];

export const categories = [...new Set(templates.map(t => t.category))];
