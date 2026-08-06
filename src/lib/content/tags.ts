/**
 * 标签相关工具函数
 */

import type { BlogPost } from '@/types/blog';
import type { TagWithCount } from '@/types/content';

/**
 * 统一标签输入为数组格式。
 */
export function normalizePostTags(tags: BlogPost['data']['tags']): string[] {
  if (!tags) return [];
  return Array.isArray(tags) ? tags : [tags];
}

/**
 * 获取标签到文章列表的映射。
 */
export function getTagPostMap(posts: BlogPost[]): Map<string, BlogPost[]> {
  const map = new Map<string, BlogPost[]>();

  for (const post of posts) {
    for (const tag of normalizePostTags(post.data.tags)) {
      const tagPosts = map.get(tag);
      if (tagPosts) {
        tagPosts.push(post);
      } else {
        map.set(tag, [post]);
      }
    }
  }

  return map;
}

/**
 * 获取所有标签及其数量。
 */
export function getAllTags(posts: BlogPost[]): Record<string, number> {
  return posts.reduce<Record<string, number>>((acc, post) => {
    for (const tag of normalizePostTags(post.data.tags)) {
      acc[tag] = (acc[tag] || 0) + 1;
    }
    return acc;
  }, {});
}

/**
 * 获取按数量降序排列的标签列表（同数量按名称排序）。
 */
export function getSortedTagsWithCount(posts: BlogPost[]): TagWithCount[] {
  return Object.entries(getAllTags(posts))
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (a.count !== b.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
}

/**
 * 将标签转换为路由参数（保持现有兼容规则）。
 */
export function toTagParam(tag: string): string {
  return tag.replace(/\//g, '-');
}
