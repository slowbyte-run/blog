export interface PostData {
  slug: string;
  title: string;
  description?: string;
  text: string;
}

export interface SimilarPost {
  slug: string;
  title: string;
  similarity: number;
}

export type SimilarityMap = Record<string, SimilarPost[]>;

export interface SummaryEntry {
  title: string;
  summary: string;
}

export type SummariesMap = Record<string, SummaryEntry>;
