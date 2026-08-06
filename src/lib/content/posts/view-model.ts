import type { BlogPost } from '@/types/blog';
import { Routes } from '@constants/router';
import type { Page } from 'astro';

import { extractTextFromMarkdown } from '../../sanitize';
import { buildCategoryPath, getCategoryArr } from '../categories';
import { getPostStableKey } from '../repository';
import { getPostHref, getPostIndexMap } from './indexing';
import { getPostSummary } from './summary';
import { getAdjacentSeriesPosts, getSeriesPosts } from './series';
import { getSortedPosts } from './listing';
import type { PostLinkItem, PostSummaryData } from './types';

export function groupPostsByYear(
  posts: BlogPost[],
): Record<number, BlogPost[]> {
  return posts.reduce(
    (result, post) => {
      const year = new Date(post.data.date).getFullYear();
      if (!result[year]) result[year] = [];
      result[year].push(post);
      return result;
    },
    {} as Record<number, BlogPost[]>,
  );
}

export async function getArchiveData(): Promise<{
  posts: BlogPost[];
  postsByYear: Record<number, BlogPost[]>;
  years: number[];
}> {
  const posts = await getSortedPosts();
  const postsByYear = groupPostsByYear(posts);
  const years = Object.keys(postsByYear)
    .map((year) => Number(year))
    .sort((a, b) => b - a);

  return { posts, postsByYear, years };
}

export function getPostSummaryData(
  post: BlogPost,
  autoLength: number = 200,
): PostSummaryData {
  if (post.data.description) {
    return {
      text: post.data.description,
      source: 'description',
    };
  }

  const key = getPostStableKey(post);
  const aiSummary = getPostSummary(key);
  if (aiSummary) {
    return {
      text: aiSummary,
      source: 'ai',
    };
  }

  return {
    text: extractTextFromMarkdown(post.body ?? '', autoLength),
    source: 'auto',
  };
}

export function getPostCategoryBreadcrumbs(
  post: BlogPost,
): Array<{ name: string; link: string }> {
  const categoryArr = getCategoryArr(post.data.categories);
  if (categoryArr.length === 0) return [];

  return categoryArr.map((name, index) => ({
    name,
    link: buildCategoryPath(categoryArr.slice(0, index + 1)),
  }));
}

export function getPostKeywords(post: BlogPost): string[] {
  const tags = Array.isArray(post.data.tags)
    ? post.data.tags
    : post.data.tags
      ? [post.data.tags]
      : [];
  const categories = getCategoryArr(post.data.categories);
  return categories.length > 0 ? tags.concat(categories) : tags;
}

export async function getPostSeriesViewModel(post: BlogPost): Promise<{
  seriesPostItems: PostLinkItem[];
  prevPostItem: PostLinkItem | null;
  nextPostItem: PostLinkItem | null;
  currentPostSlug: string;
}> {
  const [seriesPosts, postIndexMap, adjacentPosts] = await Promise.all([
    getSeriesPosts(post),
    getPostIndexMap(),
    getAdjacentSeriesPosts(post),
  ]);

  const seriesPostItems = seriesPosts.map((seriesPost) => ({
    post: seriesPost,
    href: getPostHref(seriesPost, postIndexMap),
  }));

  const prevPostItem = adjacentPosts.prevPost
    ? {
        post: adjacentPosts.prevPost,
        href: getPostHref(adjacentPosts.prevPost, postIndexMap),
      }
    : null;

  const nextPostItem = adjacentPosts.nextPost
    ? {
        post: adjacentPosts.nextPost,
        href: getPostHref(adjacentPosts.nextPost, postIndexMap),
      }
    : null;

  return {
    seriesPostItems,
    prevPostItem,
    nextPostItem,
    currentPostSlug: getPostStableKey(post),
  };
}

export function buildHomePageData(
  allPosts: BlogPost[],
  pageSize: number = 10,
): {
  posts: BlogPost[];
  page: Page<BlogPost>;
} {
  const posts = allPosts.slice(0, pageSize);
  const lastPage = Math.max(1, Math.ceil(allPosts.length / pageSize));

  return {
    posts,
    page: {
      data: posts,
      start: 0,
      end: Math.max(0, posts.length - 1),
      size: pageSize,
      total: allPosts.length,
      currentPage: 1,
      lastPage,
      url: {
        current: Routes.Home,
        prev: undefined,
        next: allPosts.length > pageSize ? `${Routes.Posts}/2` : undefined,
        first: Routes.Home,
        last: `${Routes.Posts}/${lastPage}`,
      },
    },
  };
}
