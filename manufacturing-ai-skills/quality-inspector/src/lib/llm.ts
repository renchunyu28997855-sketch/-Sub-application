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
    temperature: 0.3,
  });
  return response.choices[0]?.message?.content || '';
}

export async function analyzeQualityInspection(input: {
  inspectionType: string;
  productId: string;
  productType: string;
  parameters: Record<string, any>;
}): Promise<{
  inspectionType: string;
  productId: string;
  success: boolean;
  hasDefects: boolean;
  allPassed: boolean;
  overallStatus: 'pass' | 'fail' | 'warning';
  defects: Array<{
    type: string;
    confidence: number;
    location: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  dimensions: Array<{
    dimension: string;
    value: number;
    nominal: number;
    tolerance: string;
    deviation: number;
    status: 'pass' | 'fail' | 'warning';
  }>;
  recommendations: string[];
}> {
  console.log('analyzeQualityInspection input:', JSON.stringify(input, null, 2));

  const systemPrompt = `你是一个专业的质量检测专家。你的任务是根据输入的检测参数，分析产品质量并返回标准化的检测结果。

检测类型包括：
- visual-defect: 视觉缺陷检测（划痕、凹坑、气泡、色差等）
- dimension: 尺寸测量检测
- surface-roughness: 表面粗糙度检测
- coating-thickness: 涂层厚度检测
- color-difference: 色差检测
- comprehensive: 综合质量检测

请根据检测类型和参数，返回JSON格式的分析结果。`;

  const userPrompt = `请分析以下质量检测数据：
检测类型：${input.inspectionType}
产品ID：${input.productId}
产品类型：${input.productType}
检测参数：${JSON.stringify(input.parameters, null, 2)}

请返回JSON格式的检测结果：
{
  "inspectionType": "${input.inspectionType}",
  "productId": "${input.productId}",
  "success": true/false,
  "hasDefects": true/false,
  "allPassed": true/false,
  "overallStatus": "pass/fail/warning",
  "defects": [
    {
      "type": "缺陷类型",
      "confidence": 0.0-1.0,
      "location": "缺陷位置",
      "severity": "high/medium/low"
    }
  ],
  "dimensions": [
    {
      "dimension": "尺寸名称",
      "value": 实测值,
      "nominal": 标称值,
      "tolerance": "公差范围",
      "deviation": 偏差值,
      "status": "pass/fail/warning"
    }
  ],
  "recommendations": ["建议1", "建议2"]
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
      inspectionType: input.inspectionType,
      productId: input.productId,
      success: false,
      hasDefects: false,
      allPassed: false,
      overallStatus: 'warning' as const,
      defects: [],
      dimensions: [],
      recommendations: ['检测分析失败，请稍后重试'],
      _raw: resultText,
    } as any;
  }
}

export function mockAnalyzeQuality(input: {
  inspectionType: string;
  productId: string;
  productType: string;
  parameters: Record<string, any>;
}) {
  // Generate mock data based on inspection type
  const mockResults: Record<string, any> = {
    'visual-defect': {
      success: true,
      hasDefects: true,
      allPassed: false,
      overallStatus: 'warning',
      defects: [
        { type: '划痕', confidence: 0.85, location: '产品表面左侧', severity: 'medium' },
        { type: '气泡', confidence: 0.72, location: '边缘区域', severity: 'low' },
      ],
      dimensions: [],
      recommendations: [
        '建议加强生产过程中的表面保护',
        '检查模具表面光洁度',
        '对缺陷区域进行返工处理',
      ],
    },
    'dimension': {
      success: true,
      hasDefects: false,
      allPassed: true,
      overallStatus: 'pass',
      defects: [],
      dimensions: [
        { dimension: '长度', value: 49.8, nominal: 50.0, tolerance: '±0.2mm', deviation: -0.2, status: 'pass' },
        { dimension: '宽度', value: 30.1, nominal: 30.0, tolerance: '±0.1mm', deviation: 0.1, status: 'pass' },
        { dimension: '高度', value: 15.3, nominal: 15.0, tolerance: '±0.2mm', deviation: 0.3, status: 'warning' },
        { dimension: '直径', value: 8.02, nominal: 8.0, tolerance: '±0.05mm', deviation: 0.02, status: 'pass' },
      ],
      recommendations: [
        '尺寸检测全部通过',
        '高度尺寸接近上限，建议关注',
        '建议保持当前加工工艺稳定',
      ],
    },
    'surface-roughness': {
      success: true,
      hasDefects: false,
      allPassed: true,
      overallStatus: 'pass',
      defects: [],
      dimensions: [
        { dimension: 'Ra', value: 1.2, nominal: 1.6, tolerance: '≤1.6μm', deviation: -0.4, status: 'pass' },
        { dimension: 'Rz', value: 6.5, nominal: 8.0, tolerance: '≤8.0μm', deviation: -1.5, status: 'pass' },
      ],
      recommendations: [
        '表面粗糙度符合要求',
        '建议定期校准测量仪器',
      ],
    },
    'coating-thickness': {
      success: true,
      hasDefects: false,
      allPassed: true,
      overallStatus: 'pass',
      defects: [],
      dimensions: [
        { dimension: '涂层厚度', value: 35, nominal: 40, tolerance: '30-50μm', deviation: -5, status: 'pass' },
      ],
      recommendations: [
        '涂层厚度在正常范围内',
        '建议监控涂装工艺稳定性',
      ],
    },
    'color-difference': {
      success: true,
      hasDefects: false,
      allPassed: true,
      overallStatus: 'pass',
      defects: [],
      dimensions: [
        { dimension: 'ΔE', value: 0.6, nominal: 0.0, tolerance: '≤1.0', deviation: 0.6, status: 'pass' },
      ],
      recommendations: [
        '色差符合标准要求',
        '颜色一致性良好',
      ],
    },
    'comprehensive': {
      success: true,
      hasDefects: true,
      allPassed: false,
      overallStatus: 'warning',
      defects: [
        { type: '轻微划痕', confidence: 0.78, location: '产品右下角', severity: 'low' },
      ],
      dimensions: [
        { dimension: '长度', value: 49.9, nominal: 50.0, tolerance: '±0.2mm', deviation: -0.1, status: 'pass' },
        { dimension: '宽度', value: 30.0, nominal: 30.0, tolerance: '±0.1mm', deviation: 0.0, status: 'pass' },
        { dimension: '表面粗糙度', value: 1.4, nominal: 1.6, tolerance: '≤1.6μm', deviation: -0.2, status: 'pass' },
        { dimension: '涂层厚度', value: 38, nominal: 40, tolerance: '30-50μm', deviation: -2, status: 'pass' },
      ],
      recommendations: [
        '整体质量良好，仅发现轻微外观缺陷',
        '尺寸和材料性能均符合要求',
        '建议对轻微划痕进行抛光处理',
        '可以投入正常使用',
      ],
    },
  };

  const result = mockResults[input.inspectionType] || mockResults['comprehensive'];
  return {
    inspectionType: input.inspectionType,
    productId: input.productId,
    ...result,
  };
}
