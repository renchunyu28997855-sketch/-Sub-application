import { NextRequest, NextResponse } from 'next/server';
import { analyzeMaterial, mockAnalyze } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, inputData, context, mode, mock } = body;

    if (!inputData) {
      return NextResponse.json({ error: '输入数据不能为空' }, { status: 400 });
    }

    let result;
    if (mock || !process.env.MINIMAX_API_KEY) {
      result = mockAnalyze({ templateId, inputData, context, mode });
    } else {
      result = await analyzeMaterial({ templateId, inputData, context, mode });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '分析失败，请稍后重试', detail: message }, { status: 500 });
  }
}
