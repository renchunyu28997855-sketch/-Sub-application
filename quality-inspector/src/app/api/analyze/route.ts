import { NextRequest, NextResponse } from 'next/server';
import { analyzeQualityInspection, mockAnalyzeQuality } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inspectionType, productId, productType, parameters, mock } = body;

    if (!inspectionType || !productId) {
      return NextResponse.json(
        { error: '检测类型和产品ID不能为空' },
        { status: 400 }
      );
    }

    let result;
    if (mock || !process.env.MINIMAX_API_KEY) {
      result = mockAnalyzeQuality({ inspectionType, productId, productType, parameters });
    } else {
      result = await analyzeQualityInspection({ inspectionType, productId, productType, parameters });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: '检测分析失败，请稍后重试', detail: message },
      { status: 500 }
    );
  }
}
