/**
 * 同步计划：判断每篇本地文章该覆盖哪篇远端随笔，还是需要新建。
 *
 * 纯函数，不碰网络和文件，便于单元测试。
 */
import type { LocalPost } from './posts';
import type { RemotePost } from './remote';

export type PlanSource = 'map' | 'link' | 'title' | 'new';

export interface PlanItem {
  post: LocalPost;
  targetId: string | null;
  source: PlanSource;
}

/** 标题归一化：中文标点、空格、符号一律忽略，只比较文字本身。 */
export function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
}

/** 映射表优先，其次 frontmatter 的 cnblogs-<id>，都没有就新建。 */
export function resolveTarget(
  post: LocalPost,
  map: Record<string, string>,
): PlanItem {
  const mapped = map[post.key];
  if (mapped) return { post, targetId: mapped, source: 'map' };
  if (post.linkedCnblogsId) {
    return { post, targetId: post.linkedCnblogsId, source: 'link' };
  }
  return { post, targetId: null, source: 'new' };
}

/**
 * 本地没登记、但远端已有同名随笔时直接认领，避免重复创建。
 * 上一次同步中途失败（比如触发限流）后再跑就靠它兜底。
 *
 * 就地修改 items；每篇远端随笔只允许被认领一次。
 */
export function adoptByTitle(items: PlanItem[], remote: RemotePost[]): void {
  const claimed = new Set(
    items
      .map((item) => item.targetId)
      .filter((id): id is string => typeof id === 'string'),
  );

  const byTitle = new Map<string, RemotePost>();
  for (const post of remote) {
    const key = normalizeTitle(post.title);
    if (key && !byTitle.has(key)) byTitle.set(key, post);
  }

  for (const item of items) {
    if (item.targetId) continue;
    const matched = byTitle.get(normalizeTitle(item.post.title));
    if (!matched || claimed.has(matched.postid)) continue;
    item.targetId = matched.postid;
    item.source = 'title';
    claimed.add(matched.postid);
  }
}

/** 两篇本地文章指向同一篇远端随笔时直接报错，避免互相覆盖。 */
export function assertNoCollisions(items: PlanItem[]): void {
  const seen = new Map<string, string>();
  for (const item of items) {
    if (!item.targetId) continue;
    const existing = seen.get(item.targetId);
    if (existing && existing !== item.post.key) {
      throw new Error(
        `Both "${existing}" and "${item.post.key}" map to cnblogs post ${item.targetId}. Fix cnblogs-map.json first.`,
      );
    }
    seen.set(item.targetId, item.post.key);
  }
}
