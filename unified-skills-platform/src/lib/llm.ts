import { OpenAI } from 'openai';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.MINIMAX_API_KEY,
      baseURL: 'https://api.minimax.chat/v1',
    });
  }
  return client;
}

export async function chatCompletion(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  const openai = getClient();
  const response = await openai.chat.completions.create({
    model: 'MiniMax-M2',
    messages,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content || '';
}

export async function analyzeSkill(
  skillId: string,
  systemPrompt: string,
  userInput: string
): Promise<Record<string, unknown>> {
  const userPrompt = `${userInput}

请根据以上信息进行分析，直接返回JSON格式结果。`;

  const result = await chatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  return parseLLMResponse(result);
}

function parseLLMResponse(result: string): Record<string, unknown> {
  let cleaned = result.trim();

  // Remove <think>...</think> blocks
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
  cleaned = cleaned.replace(/<\/think>[\s\S]*?$/gi, '');

  // Remove markdown code blocks
  cleaned = cleaned.replace(/```json\s*/gi, '');
  cleaned = cleaned.replace(/```\s*/gi, '');

  // Remove newlines within JSON
  cleaned = cleaned.replace(/\n/g, ' ');

  // Find JSON object bounds
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
