import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.chat/v1',
});

export async function chatCompletion(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  const response = await client.chat.completions.create({
    model: 'MiniMax-M2.7',
    messages,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content || '';
}

export async function analyzeSupplyChain(input: {
  scenario: string;
  context?: {
    suppliers?: string;
    products?: string;
    volume?: string;
    issues?: string;
  };
}): Promise<{
  analysis: {
    riskAssessment: { level: string; factors: string[] };
    supplierPerformance: { name: string; score: number; issues: string[] }[];
    inventoryOptimization: { currentStatus: string; suggestions: string[] };
    recommendations: { priority: string; action: string; impact: string }[];
  };
}> {
  const systemPrompt = `你是一个供应链管理专家。你的任务是分析供应链问题，提供优化建议。

分析维度：
1. 风险评估：识别供应链中的潜在风险
2. 供应商绩效：评估供应商表现
3. 库存优化：分析库存状况
4. 建议：提供改进建议

请用JSON格式返回分析结果。`;

  const userPrompt = `请分析以下供应链场景：
场景类型：${input.scenario}
${input.context ? `
上下文信息：
- 供应商信息：${input.context.suppliers || '未填写'}
- 产品信息：${input.context.products || '未填写'}
- 交易量：${input.context.volume || '未填写'}
- 存在问题：${input.context.issues || '未填写'}
` : ''}

请返回JSON格式的分析结果。`;

  const resultText = await chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  try {
    const jsonMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch && jsonMatch[1] ? jsonMatch[1] : resultText;
    return JSON.parse(jsonStr);
  } catch (e) {
    return {
      analysis: {
        riskAssessment: { level: 'medium', factors: ['数据解析中'] },
        supplierPerformance: [],
        inventoryOptimization: { currentStatus: '待分析', suggestions: [] },
        recommendations: [],
      },
    };
  }
}

export function mockAnalyze(input: { scenario: string; context?: any }) {
  return {
    analysis: {
      riskAssessment: {
        level: 'medium',
        factors: ['单一供应商依赖', '交期波动', '质量一致性']
      },
      supplierPerformance: [
        { name: '供应商A', score: 85, issues: ['交期偶尔延迟'] },
        { name: '供应商B', score: 92, issues: [] },
        { name: '供应商C', score: 78, issues: ['质量问题', '价格偏高'] }
      ],
      inventoryOptimization: {
        currentStatus: '库存周转率偏低，存在积压',
        suggestions: ['优化采购批量', '建立安全库存', '实施JIT']
      },
      recommendations: [
        { priority: 'high', action: '开发备选供应商', impact: '降低供应风险' },
        { priority: 'medium', action: '建立供应商评估体系', impact: '提升质量稳定性' },
        { priority: 'medium', action: '优化库存管理', impact: '降低库存成本15%' }
      ]
    }
  };
}
