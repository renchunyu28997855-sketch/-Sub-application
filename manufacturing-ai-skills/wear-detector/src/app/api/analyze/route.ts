import { NextRequest, NextResponse } from 'next/server';
import { analyzeWear, mockAnalyze } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wearDescription, context, mock } = body;

    if (!wearDescription) {
      return NextResponse.json({ error: '磨损描述不能为空' }, { status: 400 });
    }

    let result;
    if (mock || !process.env.MINIMAX_API_KEY) {
      result = mockAnalyze({ wearDescription, context });
    } else {
      result = await analyzeWear({ wearDescription, context });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '分析失败，请稍后重试', detail: message }, { status: 500 });
  }
}
