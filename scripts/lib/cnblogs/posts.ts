/**
 * 读取 source/posts 下的文章，抽出同步到博客园需要的字段。
 *
 * 只做「读取 + 校验」，任何写操作都不在这里发生。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import dayjs from 'dayjs';
import { POSTS_GLOB, TEMPLATE_BASENAME, MARKDOWN_CATEGORY } from './config';

export interface LocalPost {
  /** 相对 source/posts 的路径，用 / 分隔，作为映射表的键。 */
  key: string;
  absPath: string;
  title: string;
  /** frontmatter 里的 link，同时是站内 URL slug。 */
  slug: string | null;
  /** ISO 字符串，统一按站点本地时区（+08:00）解释。 */
  date: string;
  description: string;
  tags: string[];
  /** 多级分类拍平成 A/B/C 字符串。 */
  categoryPaths: string[][];
  body: string;
  draft: boolean;
  /** link 形如 cnblogs-18924572 时，解析出远端 id。 */
  linkedCnblogsId: string | null;
}

const CNBLOGS_LINK = /^cnblogs-(\d+)$/;

export function parseCnblogsIdFromLink(
  slug: string | null | undefined,
): string | null {
  if (!slug) return null;
  const matched = CNBLOGS_LINK.exec(slug.trim());
  return matched ? matched[1] : null;
}

export function normalizeCategories(input: unknown): string[][] {
  if (!Array.isArray(input)) return [];
  const paths: string[][] = [];
  for (const entry of input) {
    if (typeof entry === 'string' && entry.trim()) {
      paths.push([entry.trim()]);
      continue;
    }
    if (Array.isArray(entry)) {
      const chain = entry
        .filter((part): part is string => typeof part === 'string')
        .map((part) => part.trim())
        .filter(Boolean);
      if (chain.length > 0) paths.push(chain);
    }
  }
  return paths;
}

function normalizeStringList(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

/** frontmatter date 可能是字符串，也可能被 YAML 解析成 Date。 */
export function normalizeDate(input: unknown): string | null {
  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    return dayjs(input).format('YYYY-MM-DDTHH:mm:ssZ');
  }
  if (typeof input === 'string' && input.trim()) {
    const parsed = dayjs(input.trim());
    return parsed.isValid() ? parsed.format('YYYY-MM-DDTHH:mm:ssZ') : null;
  }
  if (typeof input === 'number' && Number.isFinite(input)) {
    const parsed = dayjs(input);
    return parsed.isValid() ? parsed.format('YYYY-MM-DDTHH:mm:ssZ') : null;
  }
  return null;
}

export interface LoadOptions {
  cwd: string;
  includeDrafts?: boolean;
  /** 只同步 key 含该子串的文章，便于先跑单篇验证。 */
  only?: string;
  limit?: number;
}

export interface LoadResult {
  posts: LocalPost[];
  skipped: Array<{ key: string; reason: string }>;
}

export async function loadLocalPosts(
  options: LoadOptions,
): Promise<LoadResult> {
  const { glob } = await import('glob');
  const files = await glob(POSTS_GLOB, { cwd: options.cwd, absolute: false });
  const posts: LocalPost[] = [];
  const skipped: Array<{ key: string; reason: string }> = [];

  for (const relative of files.sort()) {
    const key = relative.replace(/^source\/posts\//, '');
    if (path.basename(key) === TEMPLATE_BASENAME) continue;
    if (options.only && !key.includes(options.only)) continue;

    const absPath = path.join(options.cwd, relative);
    let raw: string;
    try {
      raw = await fs.readFile(absPath, 'utf8');
    } catch (error) {
      skipped.push({ key, reason: `read failed: ${String(error)}` });
      continue;
    }

    let parsed: matter.GrayMatterFile<string>;
    try {
      parsed = matter(raw);
    } catch (error) {
      skipped.push({ key, reason: `frontmatter invalid: ${String(error)}` });
      continue;
    }

    const data = parsed.data as Record<string, unknown>;
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const date = normalizeDate(data.date);
    const draft = data.draft === true;

    if (!title) {
      skipped.push({ key, reason: 'missing title' });
      continue;
    }
    if (!date) {
      skipped.push({ key, reason: 'missing or invalid date' });
      continue;
    }
    if (draft && !options.includeDrafts) {
      skipped.push({ key, reason: 'draft' });
      continue;
    }

    const slug = typeof data.link === 'string' ? data.link.trim() : null;

    posts.push({
      key,
      absPath,
      title,
      slug,
      date,
      description:
        typeof data.description === 'string' ? data.description.trim() : '',
      tags: normalizeStringList(data.tags),
      categoryPaths: normalizeCategories(data.categories),
      body: parsed.content.trim(),
      draft,
      linkedCnblogsId: parseCnblogsIdFromLink(slug),
    });

    if (options.limit && posts.length >= options.limit) break;
  }

  return { posts, skipped };
}

/** 新建随笔时要带上的分类：Markdown 标记是必须的，其余可选。 */
export function buildCreateCategories(
  categoryPaths: string[][],
  withCategories: boolean,
): string[] {
  const categories = new Set<string>([MARKDOWN_CATEGORY]);
  if (withCategories) {
    for (const chain of categoryPaths) {
      const joined = chain.join('/');
      if (joined) categories.add(joined);
    }
  }
  return [...categories];
}
