import { env } from '@huggingface/transformers';

export const CONTENT_GLOB = 'source/posts/**/*.md';
export const OUTPUT_FILE = 'src/cache/similarities.json';
export const TOP_N_SIMILAR = 5;
export const MODEL_NAME = 'Snowflake/snowflake-arctic-embed-m-v2.0';
export const INCLUDE_BODY = false;
export const USE_AI_SUMMARY = true;
export const SUMMARIES_FILE = 'src/cache/summaries.json';
export const EXCLUDE_PATTERNS: string[] = [];

env.cacheDir = './.cache/transformers';
