import { NextRequest, NextResponse } from 'next/server';
import { analyzeEquipmentHealth, mockAnalyzeEquipment } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { equipmentData, context, mock } = body;

    if (!equipmentData) {
      return NextResponse.json({ error: '设备数据不能为空' }, { status: 400 });
    }

    let result;
    if (mock || !process.env.MINIMAX_API_KEY) {
      result = mockAnalyzeEquipment({ equipmentData, context });
    } else {
      result = await analyzeEquipmentHealth({ equipmentData, context });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '分析失败，请稍后重试', detail: message }, { status: 500 });
  }
}
