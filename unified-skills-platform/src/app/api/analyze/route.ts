import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkill } from '@/lib/llm';
import { getSkillById } from '@/lib/skills';

interface AnalyzeRequest {
  skillId: string;
  input: string;
  token?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { skillId, input, token } = body;

    if (!skillId) {
      return NextResponse.json({ error: '技能ID不能为空' }, { status: 400 });
    }

    if (!input || input.trim() === '') {
      return NextResponse.json({ error: '请输入内容' }, { status: 400 });
    }

    // Check credits if token is provided
    if (token) {
      try {
        const appId = `skill-${skillId}`;
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
              },
              { status: 402 }
            );
          }
        }
      } catch (creditErr) {
        console.error('Credit check error:', creditErr);
      }
    }

    // Get skill config
    const skill = getSkillById(skillId);
    if (!skill) {
      return NextResponse.json({ error: '技能不存在' }, { status: 404 });
    }

    // Use mock if no API key
    if (!process.env.MINIMAX_API_KEY || process.env.MINIMAX_API_KEY === 'your_api_key_here') {
      return NextResponse.json({
        skillId,
        skillName: skill.name,
        mock: true,
        input,
        result: `这是 ${skill.name} 的模拟分析结果`
      });
    }

    // Call LLM
    let result: Record<string, unknown>;
    try {
      result = await analyzeSkill(skillId, skill.systemPrompt, input);
      result.skillId = skillId;
      result.skillName = skill.name;
    } catch (llmError) {
      console.error('LLM API error:', llmError);
      return NextResponse.json(
        { error: 'AI服务暂时繁忙，请稍后重试' },
        { status: 503 }
      );
    }

    // Deduct credit after successful analysis
    if (token) {
      try {
        const appId = `skill-${skillId}`;
        await fetch('http://47.112.29.121/api/credit/consume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ appId, description: `使用技能: ${skill.name}` }),
        });
      } catch (consumeErr) {
        console.error('Credit consume error:', consumeErr);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '分析失败，请稍后重试', detail: message }, { status: 500 });
  }
}
