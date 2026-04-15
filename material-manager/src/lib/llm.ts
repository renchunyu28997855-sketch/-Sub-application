import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.chat/v1',
});

export async function chatCompletion(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  console.log('chatCompletion messages:', JSON.stringify(messages, null, 2));
  const response = await client.chat.completions.create({
    model: 'MiniMax-M2.7',
    messages,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content || '';
}

export async function analyzeMaterial(input: {
  templateId: string;
  inputData: string;
  context: {
    production?: string;
    inventory?: string;
    demand?: string;
    leadTime?: string;
    supplier?: string;
  };
  mode: 'template' | 'custom';
}): Promise<{
  analysis: string;
  suggestions: string[];
  tags: string[];
}> {
  console.log('analyzeMaterial input:', JSON.stringify(input, null, 2));

  let templateType = '';
  if (input.templateId === 'production-material') {
    templateType = '生产物料需求计算';
  } else if (input.templateId === 'inventory-optimization') {
    templateType = '库存优化分析';
  } else if (input.templateId === 'procurement-plan') {
    templateType = '采购计划制定';
  } else {
    templateType = '自定义物料分析';
  }

  const systemPrompt = `你是一个制造业物料管理专家。你的任务是分析用户提供的物料管理数据，并给出专业的分析结果、优化建议和标签。

分析维度：
1. 物料需求计算：根据生产计划、BOM表计算所需物料
2. 库存优化分析：分析库存周转、安全库存、呆滞物料
3. 采购计划制定：根据需求预测制定合理采购计划

输出格式：
- analysis: HTML格式的分析结果，用<br/>换行，加粗用<strong>标签
- suggestions: 优化建议数组
- tags: 分析标签数组，如["需求计算", "库存优化"]

请分析以下物料管理需求，返回JSON格式结果。`;

  const userPrompt = `模板类型：${templateType}
输入数据：${input.inputData}
${input.context.production ? `生产计划：${input.context.production}` : ''}
${input.context.inventory ? `库存数据：${input.context.inventory}` : ''}
${input.context.demand ? `需求预测：${input.context.demand}` : ''}
${input.context.leadTime ? `交期信息：${input.context.leadTime}` : ''}
${input.context.supplier ? `供应商信息：${input.context.supplier}` : ''}

请返回JSON格式的分析结果：
{
  "analysis": "分析结果（HTML格式）",
  "suggestions": ["建议1", "建议2"],
  "tags": ["标签1", "标签2"]
}`;

  const resultText = await chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  console.log('LLM raw result:', resultText);
  try {
    let jsonStr = resultText;
    const jsonMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1];
    }
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (e) {
    console.error('JSON parse error:', e, 'Result:', resultText);
    return {
      analysis: resultText || '分析失败，请稍后重试',
      suggestions: [],
      tags: [],
    } as any;
  }
}

export function mockAnalyze(input: {
  templateId: string;
  inputData: string;
  context: {
    production?: string;
    inventory?: string;
    demand?: string;
    leadTime?: string;
    supplier?: string;
  };
  mode: 'template' | 'custom';
}) {
  let analysis = '';
  let suggestions: string[] = [];
  let tags: string[] = [];

  if (input.templateId === 'production-material') {
    analysis = `<strong>生产物料需求分析结果</strong><br/><br/>
根据生产计划计算：<br/>
• A产品1000件：需要原材料X=10000个，Y=5000个<br/>
• B产品500件：需要原材料X=5000个，Y=2500个<br/><br/>
合计需求：<br/>
• 原材料X：15000个（当前库存2000个，缺口13000个）<br/>
• 原材料Y：7500个（当前库存1500个，缺口6000个）<br/><br/>
建议立即采购以满足生产需求。`;
    suggestions = [
      '建议分批采购，首批采购X原材料10000个，Y原材料5000个',
      '可考虑开发备用供应商以降低供应风险',
      '建议建立安全库存机制，X材料安全库存3000个，Y材料1500个'
    ];
    tags = ['需求计算', '采购建议'];
  } else if (input.templateId === 'inventory-optimization') {
    analysis = `<strong>库存优化分析结果</strong><br/><br/>
当前库存状况：<br/>
• 原材料X库存5000个，按当前消耗速度可支撑45天<br/>
• 原材料Y库存3000个，按当前消耗速度可支撑60天<br/><br/>
优化建议：<br/>
• X材料库存偏高，建议减少采购频次<br/>
• Y材料库存适中，维持现有策略<br/><br/>
存在风险：若需求突然增加，X材料可能在10天内耗尽。`;
    suggestions = [
      '建议将X材料库存调整至4000个，减少资金占用',
      '建立库存预警机制，当X材料低于2000个时触发补货提醒',
      '考虑与供应商协商JIT供货模式'
    ];
    tags = ['库存优化', '风险预警'];
  } else if (input.templateId === 'procurement-plan') {
    analysis = `<strong>采购计划分析结果</strong><br/><br/>
基于下月需求预测：<br/>
• A产品2000件：需要原材料X=20000个，Y=10000个<br/>
• B产品1500件：需要原材料X=15000个，Y=7500个<br/><br/>
采购计划：<br/>
• 优先选择甲公司（交期5天），乙公司作为备选<br/>
• 建议分两批采购：第一批满足生产需求，第二批作为安全库存<br/><br/>
总采购成本预估：X材料约200000元，Y材料约150000元。`;
    suggestions = [
      '建议与甲公司签订季度采购协议，锁定价格',
      '第一批采购建议在月初完成，确保生产周期',
      '预留10%的缓冲库存应对需求波动'
    ];
    tags = ['采购计划', '成本优化'];
  } else {
    analysis = `<strong>物料管理分析结果</strong><br/><br/>
您输入的数据已收到，正在分析中...<br/><br/>
建议您提供更详细的物料信息以获得更精准的分析结果。`;
    suggestions = ['请提供完整的生产计划数据', '请提供当前库存明细', '请提供物料BOM表'];
    tags = ['待补充'];
  }

  return { analysis, suggestions, tags };
}
