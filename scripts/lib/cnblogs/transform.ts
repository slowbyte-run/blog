/**
 * 把仓库里的 Markdown 转成可以直接交给博客园的形态。
 *
 * 博客园把带 `[Markdown]` 分类的随笔按 Markdown 渲染，所以这里不做
 * Markdown -> HTML 的转换（那会毁掉公式和代码块），只修两类站内链接：
 * 相对路径的图片和站内文章链接。
 */
import { SITE_ORIGIN, MARKDOWN_CATEGORY } from './config';
import type { LocalPost } from './posts';

/** 会被补全成绝对地址的站内路径前缀。 */
const INTERNAL_PREFIXES = ['/img/', '/blog/'] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function absolutizeMarkdown(
  markdown: string,
  origin: string = SITE_ORIGIN,
): string {
  let output = markdown;

  for (const prefix of INTERNAL_PREFIXES) {
    const escaped = escapeRegExp(prefix);

    // [text](/img/x.png) / ![alt](/img/x.png "<title>") / [t](</img/x y.png>)
    output = output.replace(
      new RegExp(`\\((<?)${escaped}`, 'g'),
      (_match, angle: string) => `(${angle}${origin}${prefix}`,
    );

    // <img src="/img/x.png">
    output = output.replace(
      new RegExp(`(src=["'])${escaped}`, 'g'),
      (_match, quote: string) => `${quote}${origin}${prefix}`,
    );

    // 引用式链接定义：[id]: /img/x.png
    output = output.replace(
      new RegExp(`(\\]:\\s*<?)${escaped}`, 'g'),
      (_match, lead: string) => `${lead}${origin}${prefix}`,
    );
  }

  return output;
}

export interface PostPayload {
  title: string;
  description: string;
  categories: string[];
  mt_keywords: string;
  mt_excerpt?: string;
  dateCreated?: string;
}

export interface BuildPayloadOptions {
  origin?: string;
  withTags?: boolean;
  /** 新建时额外写入仓库里的多级分类。 */
  categories?: string[];
  /** 更新时必须沿用远端已有分类，否则会丢掉 [Markdown] 标记。 */
  keepCategories?: string[];
  /** 更新时沿用远端发布时间，避免文章被顶到首页。 */
  dateCreated?: string;
  /** 更新时沿用远端标签，避免把已在博客园手工维护的关键字清空。 */
  keepKeywords?: string;
}

/** 摘要用于列表页展示，过长没有意义，这里截断到 200 字。 */
export function buildExcerpt(text: string, max = 200): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length <= max ? flat : `${flat.slice(0, max)}…`;
}

export function buildPayload(
  post: LocalPost,
  options: BuildPayloadOptions = {},
): PostPayload {
  const {
    origin = SITE_ORIGIN,
    withTags = false,
    categories,
    keepCategories,
    dateCreated,
    keepKeywords,
  } = options;

  const baseCategories = keepCategories?.length
    ? keepCategories
    : (categories ?? [MARKDOWN_CATEGORY]);

  const categorySet = new Set<string>(baseCategories);
  categorySet.add(MARKDOWN_CATEGORY);

  return {
    title: post.title,
    description: absolutizeMarkdown(post.body, origin),
    categories: [...categorySet],
    mt_keywords: withTags ? post.tags.join(', ') : (keepKeywords ?? ''),
    mt_excerpt: buildExcerpt(post.description || post.title),
    dateCreated: dateCreated ?? post.date,
  };
}

/** 判断远端是否已经和本地一致，用来实现「重复执行不重发」。 */
export function isPayloadApplied(
  payload: PostPayload,
  remote: { title?: string; description?: string },
): boolean {
  const normalize = (value: string | undefined) =>
    (value ?? '').replace(/\r\n/g, '\n').trim();
  return (
    normalize(payload.title) === normalize(remote.title) &&
    normalize(payload.description) === normalize(remote.description)
  );
}
