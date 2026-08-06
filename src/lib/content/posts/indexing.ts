import type { BlogPost } from '@/types/blog';
import { Routes } from '@constants/router';

import { getPostStableKey, getVisibleBlogPostsSortedAsc } from '../repository';

let postIndexMapCache: Promise<Map<string, number>> | null = null;

export async function getPostIndexMap(): Promise<Map<string, number>> {
  const buildMap = async (): Promise<Map<string, number>> => {
    const sorted = await getVisibleBlogPostsSortedAsc();
    const map = new Map<string, number>();

    sorted.forEach((post, index) => {
      const key = getPostStableKey(post);
      if (key) map.set(key, index + 1);
    });

    return map;
  };

  if (import.meta.env.DEV) return buildMap();

  if (!postIndexMapCache) {
    postIndexMapCache = buildMap();
  }

  return new Map(await postIndexMapCache);
}

export function getPostIndex(
  post: BlogPost,
  indexMap: Map<string, number>,
): number | null {
  const key = getPostStableKey(post);
  if (!key) return null;
  return indexMap.get(key) ?? null;
}

export function getPostHref(
  post: BlogPost,
  indexMap?: Map<string, number>,
): string {
  if (indexMap) {
    const index = getPostIndex(post, indexMap);
    if (index) return `${Routes.Post}/${index}`;
  }

  const key = getPostStableKey(post);
  return key ? `${Routes.Post}/${key}` : Routes.Post;
}
