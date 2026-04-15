import { NextRequest, NextResponse } from 'next/server';
import { analyzeCarbonEmissions, mockAnalyze } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { energySources, rawMaterials, logistics, productionData, reportingStandards, mock } = body;

    if (!energySources && !rawMaterials && !logistics) {
      return NextResponse.json({ error: '请至少提供一种排放数据（能源消耗、原材料或物流运输）' }, { status: 400 });
    }

    let result;
    if (mock || !process.env.MINIMAX_API_KEY) {
      result = mockAnalyze({ energySources, rawMaterials, logistics, productionData, reportingStandards });
    } else {
      result = await analyzeCarbonEmissions({ energySources, rawMaterials, logistics, productionData, reportingStandards });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Carbon analysis error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '碳排放分析失败，请稍后重试', detail: message }, { status: 500 });
  }
}
