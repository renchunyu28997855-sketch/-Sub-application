import { NextRequest, NextResponse } from 'next/server';

async function getLlmModule() {
  const module = await import('@/lib/llm');
  return module;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { facilityId, analysisType, consumptionData, equipmentData, renewableData, utilityData, mock } = body;

    if (!analysisType) {
      return NextResponse.json({ error: '分析类型不能为空' }, { status: 400 });
    }

    const llm = await getLlmModule();
    let result;
    if (mock || !process.env.MINIMAX_API_KEY) {
      result = llm.mockAnalyze({ facilityId, analysisType, consumptionData, equipmentData, renewableData, utilityData });
    } else {
      result = await llm.analyzeEnergy({ facilityId, analysisType, consumptionData, equipmentData, renewableData, utilityData });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '分析失败，请稍后重试', detail: message }, { status: 500 });
  }
}
