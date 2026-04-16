const MINIMAX_API_URL = 'https://api.minimaxi.chat/v1/text/chatcompletion_v2';
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AnalyzeOptions {
  temperature?: number;
  maxTokens?: number;
}

/**
 * 构建对话上下文
 * 将历史消息和当前输入组合成对话格式
 */
function buildConversationContext(
  systemPrompt: string,
  history: Message[],
  currentInput: string
): Array<{ role: string; content: string }> {
  const conversation: Array<{ role: string; content: string }> = [];

  // 添加系统提示
  conversation.push({
    role: 'system',
    content: `${systemPrompt}\n\n请以专业、友好的方式回复。如果需要更多信息，请明确询问。`
  });

  // 添加历史对话
  for (const msg of history) {
    conversation.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    });
  }

  // 添加当前输入
  conversation.push({
    role: 'user',
    content: currentInput
  });

  return conversation;
}

/**
 * 调用LLM进行技能分析
 * 支持多轮对话
 */
export async function analyzeSkill(
  skillId: string,
  systemPrompt: string,
  input: string,
  history?: Message[],
  options: AnalyzeOptions = {}
): Promise<Record<string, unknown>> {
  const { temperature = 0.7, maxTokens = 4096 } = options;

  // 构建对话上下文
  const messages = buildConversationContext(systemPrompt, history || [], input);

  const requestBody = {
    model: 'abab6.5s-chat',
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  const response = await fetch(MINIMAX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (data.base_resp?.status_msg !== 'success') {
    throw new Error(data.base_resp?.status_msg || 'API returned error');
  }

  const result = data.choices?.[0]?.message?.content;
  if (!result) {
    throw new Error('No result in API response');
  }

  // 尝试解析JSON响应
  return parseLLMResponse(result);
}

/**
 * 解析LLM响应
 * 尝试提取JSON，如果失败则返回纯文本
 */
function parseLLMResponse(result: string): Record<string, unknown> {
  // 清理响应内容
  let cleaned = result.trim();

  // 移除思考标签（如果有）
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
  cleaned = cleaned.replace(/<\/think>[\s\S]*?$/gi, '');

  // 移除markdown代码块
  cleaned = cleaned.replace(/```json\s*/gi, '');
  cleaned = cleaned.replace(/```\s*/gi, '');

  // 移除newlines within JSON
  cleaned = cleaned.replace(/\n/g, ' ');

  // 查找JSON对象边界
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    const jsonStr = cleaned.substring(jsonStart, jsonEnd + 1);
    try {
      return JSON.parse(jsonStr);
    } catch {
      return { analysis: result };
    }
  }

  return { analysis: result };
}
