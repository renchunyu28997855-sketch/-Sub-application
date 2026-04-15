import { NextRequest, NextResponse } from 'next/server';
import { analyzeMaintenance, mockAnalyze } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.equipmentId) {
      return NextResponse.json({ error: '设备ID不能为空' }, { status: 400 });
    }

    let result;
    if (!process.env.MINIMAX_API_KEY) {
      result = mockAnalyze(body);
    } else {
      result = await analyzeMaintenance(body);
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '分析失败，请稍后重试', detail: message }, { status: 500 });
  }
}
