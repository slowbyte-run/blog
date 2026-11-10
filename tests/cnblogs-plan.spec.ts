import { describe, expect, it } from 'vitest';
import {
  adoptByTitle,
  assertNoCollisions,
  normalizeTitle,
  resolveTarget,
  type PlanItem,
} from '../scripts/lib/cnblogs/plan';
import type { LocalPost } from '../scripts/lib/cnblogs/posts';
import type { RemotePost } from '../scripts/lib/cnblogs/remote';

function makePost(overrides: Partial<LocalPost> = {}): LocalPost {
  return {
    key: 'XCPC/Algorithm/Graph/LCA.md',
    absPath: '/repo/source/posts/XCPC/Algorithm/Graph/LCA.md',
    title: 'LCA（最近公共祖先）算法',
    slug: 'lca',
    date: '2025-06-11T21:27:00+08:00',
    description: 'LCA 的倍增实现',
    tags: ['algorithm'],
    categoryPaths: [['XCPC', 'Algorithm', 'Graph']],
    body: '## 定义',
    draft: false,
    linkedCnblogsId: null,
    ...overrides,
  };
}

function makeRemote(overrides: Partial<RemotePost> = {}): RemotePost {
  return {
    postid: '18924572',
    title: 'LCA（最近公共祖先问）算法',
    description: 'old',
    categories: ['[Markdown]'],
    keywords: '',
    dateCreated: '20250804T21:50:00',
    permalink: 'https://www.cnblogs.com/slowbyte/p/18924572',
    link: 'https://www.cnblogs.com/slowbyte/p/18924572',
    ...overrides,
  };
}

describe('normalizeTitle', () => {
  it('ignores case, spaces and punctuation', () => {
    expect(normalizeTitle('LCA（最近公共祖先）算法')).toBe(
      normalizeTitle('lca(最近公共祖先)算法'),
    );
    expect(normalizeTitle('Git 回退：全场景')).toBe('git回退全场景');
  });

  it('keeps the text itself', () => {
    expect(normalizeTitle('Codeforces Round 1027 (Div. 3)')).toContain(
      'codeforcesround1027',
    );
  });
});

describe('resolveTarget', () => {
  it('prefers the mapping file', () => {
    const post = makePost({ linkedCnblogsId: '111' });
    const item = resolveTarget(post, { [post.key]: '222' });
    expect(item).toMatchObject({ targetId: '222', source: 'map' });
  });

  it('falls back to the cnblogs link in frontmatter', () => {
    const post = makePost({ linkedCnblogsId: '111' });
    expect(resolveTarget(post, {})).toMatchObject({
      targetId: '111',
      source: 'link',
    });
  });

  it('marks unregistered posts as new', () => {
    expect(resolveTarget(makePost(), {})).toMatchObject({
      targetId: null,
      source: 'new',
    });
  });
});

describe('adoptByTitle', () => {
  const remote = makeRemote({ title: 'LCA（最近公共祖先）算法' });

  it('adopts a remote post whose title normalizes to the same text', () => {
    const items: PlanItem[] = [
      { post: makePost(), targetId: null, source: 'new' },
    ];
    adoptByTitle(items, [remote]);
    expect(items[0]).toMatchObject({
      targetId: '18924572',
      source: 'title',
    });
  });

  it('never adopts the same remote post twice', () => {
    const items: PlanItem[] = [
      { post: makePost(), targetId: null, source: 'new' },
      {
        post: makePost({ key: 'dupe.md', title: 'LCA 最近公共祖先 算法' }),
        targetId: null,
        source: 'new',
      },
    ];
    adoptByTitle(items, [remote]);
    expect(items[0].targetId).toBe('18924572');
    expect(items[1].targetId).toBeNull();
  });

  it('skips remote posts already claimed by an explicit mapping', () => {
    const items: PlanItem[] = [
      { post: makePost(), targetId: null, source: 'new' },
      {
        post: makePost({ key: 'other.md', title: 'other' }),
        targetId: '18924572',
        source: 'map',
      },
    ];
    adoptByTitle(items, [remote]);
    expect(items[0].targetId).toBeNull();
  });

  it('does not adopt a title that differs by even one character', () => {
    // 远端 18924572 的标题就多了一个「问」字，这种笔误不认领，靠 link 显式映射。
    const items: PlanItem[] = [
      { post: makePost(), targetId: null, source: 'new' },
    ];
    adoptByTitle(items, [makeRemote()]);
    expect(items[0].targetId).toBeNull();
  });

  it('does not adopt unrelated titles', () => {
    const items: PlanItem[] = [
      {
        post: makePost({ title: '完全不同的标题' }),
        targetId: null,
        source: 'new',
      },
    ];
    adoptByTitle(items, [remote]);
    expect(items[0].source).toBe('new');
  });
});

describe('assertNoCollisions', () => {
  it('passes when each post points at a distinct id', () => {
    const items: PlanItem[] = [
      { post: makePost(), targetId: '1', source: 'map' },
      {
        post: makePost({ key: 'b.md' }),
        targetId: '2',
        source: 'link',
      },
    ];
    expect(() => assertNoCollisions(items)).not.toThrow();
  });

  it('throws when two posts target the same remote post', () => {
    const items: PlanItem[] = [
      { post: makePost(), targetId: '1', source: 'map' },
      { post: makePost({ key: 'b.md' }), targetId: '1', source: 'map' },
    ];
    expect(() => assertNoCollisions(items)).toThrowError(/b\.md/);
  });
});
