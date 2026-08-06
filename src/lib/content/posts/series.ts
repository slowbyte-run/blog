import type { BlogPost } from '@/types/blog';

import {
  buildCategoryPath,
  DEFAULT_CATEGORY_NAME,
  getCategoryArr,
} from '../categories';
import { getPostStableKey } from '../repository';
import { getPostsByCategoryPath, getSortedPosts } from './listing';

export function getPostLastCategory(post: BlogPost): {
  link: string;
  name: string;
} {
  const categoryPath = getCategoryArr(post.data.categories);

  if (categoryPath.length === 0) {
    return {
      link: buildCategoryPath(DEFAULT_CATEGORY_NAME),
      name: DEFAULT_CATEGORY_NAME,
    };
  }

  return {
    link: buildCategoryPath(categoryPath),
    name: categoryPath[categoryPath.length - 1],
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function getRandomPosts(count: number = 10): Promise<BlogPost[]> {
  const posts = await getSortedPosts();
  const shuffled = shuffleArray(posts);
  return shuffled.slice(0, Math.min(count, posts.length));
}

export async function getSeriesPosts(post: BlogPost): Promise<BlogPost[]> {
  const categoryPath = getCategoryArr(post.data.categories);
  if (categoryPath.length === 0) return [];
  return getPostsByCategoryPath(categoryPath);
}

export async function getAdjacentSeriesPosts(currentPost: BlogPost): Promise<{
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}> {
  const seriesPosts = await getSeriesPosts(currentPost);
  if (seriesPosts.length === 0) {
    return { prevPost: null, nextPost: null };
  }

  const currentKey = getPostStableKey(currentPost);
  const currentIndex = seriesPosts.findIndex(
    (post) => getPostStableKey(post) === currentKey,
  );
  if (currentIndex === -1) {
    return { prevPost: null, nextPost: null };
  }

  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < seriesPosts.length - 1
      ? seriesPosts[currentIndex + 1]
      : null;

  return { prevPost, nextPost };
}
