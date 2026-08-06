export interface PostData {
  slug: string;
  title: string;
  description?: string;
  text: string;
  hash: string;
}

export interface CacheEntry {
  hash: string;
  title: string;
  summary: string;
  generatedAt: string;
}

export interface SummariesCache {
  version: string;
  model: string;
  entries: Record<string, CacheEntry>;
}

export interface SummaryOutput {
  title: string;
  summary: string;
}
