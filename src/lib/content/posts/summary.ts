import summaries from '@/cache/summaries.json';
import type { BlogPost } from '@/types/blog';

import { extractTextFromMarkdown } from '../../sanitize';
import { getPostStableKey } from '../repository';

export function getPostDescription(
  post: BlogPost,
  maxLength: number = 150,
): string {
  return (
    post.data.description || extractTextFromMarkdown(post.body ?? '', maxLength)
  );
}

export function getPostSummary(slug: string): string | null {
  return summaries[slug]?.summary ?? null;
}

export function getPostDescriptionWithSummary(
  post: BlogPost,
  maxLength: number = 150,
): string {
  const key = getPostStableKey(post);
  return (
    post.data.description ||
    getPostSummary(key) ||
    extractTextFromMarkdown(post.body ?? '', maxLength)
  );
}
