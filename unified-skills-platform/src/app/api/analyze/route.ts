import { NextRequest, NextResponse } from 'next/server';
import { getSkillById } from '@/lib/skills';
import { executeSkill, SkillType } from '@/lib/skills-workflow';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AnalyzeRequest {
  skillId: string;
  input: string;
  token?: string;
  messages?: Message[];
}

// 通过主站代理调用LLM
async function callLLMViaProxy(token: string, appId: string, messages: Array<{ role: string; content: string }>) {
  const response = await fetch('http://127.0.0.1:3002/api/llm/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      appId,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM proxy failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { skillId, input, token, messages } = body;

    if (!skillId) {
      return NextResponse.json({ error: '技能ID不能为空' }, { status: 400 });
    }

    if (!input || input.trim() === '') {
      return NextResponse.json({ error: '请输入内容' }, { status: 400 });
    }

    // 获取技能配置
    const skill = getSkillById(skillId);
    if (!skill) {
      return NextResponse.json({ error: '技能不存在' }, { status: 404 });
    }

    // appId 格式: {categoryKey}-{skillId}
    const appId = `${skill.categoryKey}-${skill.id}`;

    // Check credits if token is provided
    if (token) {
      try {
        const creditResponse = await fetch('http://127.0.0.1:3002/api/credit/check', {
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

    // 使用高效工作流执行技能
    const execResult = await executeSkill(skill, input, messages || []);

    // 模板型：直接返回，不需要调用LLM
    if (execResult.type === 'template') {
      return NextResponse.json({
        skillId,
        skillName: skill.name,
        type: 'template',
        analysis: execResult.output,
        steps: execResult.steps,
      });
    }

    // 需要LLM：构建消息并调用
    if (execResult.llmContext) {
      const { systemPrompt, userInput } = execResult.llmContext;

      // 构建发送给LLM的消息
      const llmMessages: Array<{ role: string; content: string }> = [
        { role: 'system', content: `${systemPrompt}\n\n请以专业、友好的方式回复。如果需要更多信息，请明确询问。` }
      ];

      // 添加历史消息
      if (messages && messages.length > 0) {
        for (const msg of messages) {
          llmMessages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
        }
      }

      // 添加当前输入
      llmMessages.push({ role: 'user', content: userInput });

      // 调用LLM（通过主站代理）
      let result: string;
      try {
        if (token) {
          const llmResponse = await callLLMViaProxy(token, appId, llmMessages);
          result = llmResponse.choices?.[0]?.message?.content || JSON.stringify(llmResponse);
        } else {
          return NextResponse.json({
            skillId,
            skillName: skill.name,
            type: execResult.type,
            mock: true,
            input: userInput,
            analysis: `这是 ${skill.name} 的模拟分析结果（${execResult.type}模式）`,
            steps: execResult.steps,
          });
        }
      } catch (llmError) {
        console.error('LLM API error:', llmError);
        return NextResponse.json(
          { error: 'AI服务暂时繁忙，请稍后重试' },
          { status: 503 }
        );
      }

      // 扣除积分
      if (token) {
        try {
          await fetch('http://127.0.0.1:3002/api/credit/consume', {
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

      return NextResponse.json({
        skillId,
        skillName: skill.name,
        type: execResult.type,
        analysis: result,
        steps: execResult.steps,
      });
    }

    // Fallback
    return NextResponse.json({
      skillId,
      skillName: skill.name,
      analysis: execResult.output,
    });

  } catch (error) {
    console.error('Analyze error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: '分析失败，请稍后重试', detail: message }, { status: 500 });
  }
}
