import type { BlogPost } from '@/types/blog';

export type PostSummarySource = 'description' | 'ai' | 'auto';

export interface PostSummaryData {
  text: string;
  source: PostSummarySource;
}

export interface PostLinkItem {
  post: BlogPost;
  href: string;
}
