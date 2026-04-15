import { NextRequest, NextResponse } from 'next/server';

async function getLlmModule() {
  const module = await import('@/lib/llm');
  return module;
}

interface AnalyzeRequest {
  skillId: string;
  input: Record<string, unknown>;
  mock?: boolean;
  token?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { skillId, input, mock, token } = body;

    if (!skillId) {
      return NextResponse.json({ error: '技能ID不能为空' }, { status: 400 });
    }

    // Check credits if token is provided
    if (token) {
      try {
        const appId = skillId.startsWith('skill-') ? skillId : `skill-${skillId}`;
        const creditResponse = await fetch('http://47.112.29.121/api/credit/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ appId }),
        });

        if (creditResponse.ok) {
          const creditData = await creditResponse.json();
          if (!creditData.sufficient) {
            return NextResponse.json(
              {
                error: `积分不足，需要 ${creditData.cost} 积分，当前可用 ${creditData.available} 积分`,
                code: 'INSUFFICIENT_CREDIT',
                cost: creditData.cost,
                available: creditData.available
              },
              { status: 402 }
            );
          }
        }
      } catch (creditErr) {
        console.error('Credit check error:', creditErr);
        // Continue without credit check - don't block if credit check fails
      }
    }

    const llm = await getLlmModule();

    // If mock is explicitly true or no API key, use mock mode
    if (mock || !process.env.MINIMAX_API_KEY || process.env.MINIMAX_API_KEY === 'your_api_key_here') {
      const result = llm.mockAnalyze(skillId, input);
      return NextResponse.json(result);
    }

    // Try real LLM
    try {
      const result = await llm.analyzeManufacturingSkill(skillId, input);
      return NextResponse.json(result);
    } catch (llmError) {
      // If LLM API fails, return error instead of fallback
      console.error('LLM API error:', llmError);
      const errorMessage = llmError instanceof Error ? llmError.message : String(llmError);
      return NextResponse.json(
        { error: 'AI服务暂时繁忙，请稍后重试', detail: errorMessage },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '分析失败，请稍后重试', detail: message }, { status: 500 });
  }
}
