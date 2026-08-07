import { generateText } from '@xsai/generate-text';
import { OPENAI_API_BASE_URL, OPENAI_API_KEY } from './config';
import {
  buildFallbackSummary,
  countChineseChars,
  isSummaryAcceptable,
  normalizeSummaryText,
} from './quality';

const SUMMARY_SYSTEM_PROMPT = [
  '你是一位资深的博客文章摘要写手，擅长把技术博客浓缩成高质量、可直接用作文章副标题的中文摘要。',
  '要求：',
  '1. 用简体中文，风格自然、具体、信息密度高，避免空泛套话，不要用“本文/这篇文章介绍了”这类开头。',
  '2. 通常输出 2 到 4 句，总字数控制在 40 到 120 字。',
  '3. 覆盖三点：文章讲什么（主题 / 要解决的问题）、核心方法或关键点、对读者的价值或适用场景。',
  '4. 技术类文章要自然点出涉及的工具、框架或技术名称（如 git、ArchLinux、并查集、BFS、KaTeX）。',
  '5. 不要分点、不要标题、不要列表符号、不要任何前缀，也不要输出思考过程。',
  '6. 禁止输出音标、LaTeX、代码片段、链接、网址或大段英文。',
  '7. 直接输出摘要正文，不要解释你的做法。',
].join('\n');

const SUMMARY_REPAIR_SYSTEM_PROMPT = [
  '你是一位资深的中文博客摘要修订助手。',
  '请把给定的摘要改写成更自然、具体、信息密度高的简体中文博客摘要。',
  '要求：总字数 40 到 120 字；覆盖文章主题、核心方法或关键点和价值；技术文章点出关键技术名；',
  '不要分点、不要标题、不要“本文介绍了”之类的空话；禁止音标、LaTeX、代码、链接和大段英文。',
  '只输出摘要正文。',
].join('\n');

async function requestSummary(
  model: string,
  messages: Array<{ role: 'system' | 'user'; content: string }>,
  temperature: number,
): Promise<string> {
  const { text: summary } = await generateText({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_API_BASE_URL,
    model,
    messages,
    temperature,
    maxTokens: 220,
  });

  return normalizeSummaryText(summary ?? '');
}

export async function checkApiRunning(model: string): Promise<boolean> {
  try {
    if (!OPENAI_API_KEY) {
      return false;
    }

    const headers: Record<string, string> = {};
    headers.Authorization = `Bearer ${OPENAI_API_KEY}`;
    headers['Content-Type'] = 'application/json';

    const response = await fetch(`${OPENAI_API_BASE_URL}chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'ping' }],
        temperature: 0,
        max_tokens: 1,
        stream: false,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function generateSummary(
  title: string,
  text: string,
  model: string,
): Promise<string> {
  const truncatedText = text.slice(0, 6000);
  const fallback = buildFallbackSummary(truncatedText, title);
  const shouldSkipApi =
    truncatedText.trim().length < 24 && countChineseChars(truncatedText) < 12;

  if (shouldSkipApi && isSummaryAcceptable(fallback)) {
    return fallback;
  }

  let firstPass = '';
  let repaired = '';
  let lastError: unknown;

  try {
    firstPass = await requestSummary(
      model,
      [
        {
          role: 'system',
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            '请基于下面文章生成摘要。',
            '要求：中文为主、信息密度高、覆盖主题与关键点、通常 2 到 4 句、不要分点、不要标题、不要空话。',
            '文章如下：',
            truncatedText,
          ].join('\n\n'),
        },
      ],
      0.2,
    );
  } catch (error) {
    lastError = error;
  }

  if (isSummaryAcceptable(firstPass)) {
    return firstPass;
  }

  try {
    repaired = await requestSummary(
      model,
      [
        {
          role: 'system',
          content: SUMMARY_REPAIR_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            '下面这段摘要不够稳定，请改写成更自然、以简体中文为主、简洁客观的博客摘要。',
            '要求：通常 2 句、45 到 100 字、保留主题、关键理由和最终结论，不要音标、LaTeX、代码、链接和大段英文。',
            `原摘要：${firstPass || '（空）'}`,
            '参考文章：',
            truncatedText,
          ].join('\n\n'),
        },
      ],
      0.1,
    );
  } catch (error) {
    lastError = error;
  }

  if (isSummaryAcceptable(repaired)) {
    return repaired;
  }

  if (isSummaryAcceptable(fallback)) {
    return fallback;
  }

  if (isSummaryAcceptable(firstPass)) {
    return firstPass;
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error('Unable to generate a stable Chinese summary');
}
