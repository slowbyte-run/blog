export const CONTENT_GLOB = 'source/posts/**/*.{md,MD}';
export const CACHE_FILE = '.cache/summaries-cache.json';
export const OUTPUT_FILE = 'src/cache/summaries.json';
export const CACHE_VERSION = '4';

// FIXED: Summary generation now defaults to the DeepSeek endpoint.
// Normalize to a trailing slash so `${BASE}chat/completions` concatenation
// works regardless of whether the secret value ends with `/`, `/v1` or nothing.
const rawBaseUrl =
  process.env.OPENAI_API_BASE_URL?.trim() || 'https://api.deepseek.com/v1/';
export const OPENAI_API_BASE_URL = rawBaseUrl.endsWith('/')
  ? rawBaseUrl
  : `${rawBaseUrl}/`;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim() ?? '';
export const DEFAULT_MODEL =
  process.env.OPENAI_MODEL?.trim() || 'deepseek-v4-flash';

export const EXCLUDE_PATTERNS: string[] = [];
