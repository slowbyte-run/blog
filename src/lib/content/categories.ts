/**
 * 分类相关工具函数
 */

import { categoryMap } from '@constants/category';
import { withBlogBase } from '@constants/router';

import { getVisibleBlogPosts } from './repository';
import type { Category, CategoryListResult } from './types';
import {
  DEFAULT_CATEGORY_NAME,
  REVERSE_CATEGORY_MAP,
} from './categories/constants';
import {
  normalizeCategories,
  normalizeCategoryPathInput,
  normalizeSegment,
} from './categories/normalize';
import {
  getCategoryNodeCount,
  getParentCategory,
  upsertCategoryPath,
} from './categories/tree';

export { DEFAULT_CATEGORY_NAME, getCategoryNodeCount, getParentCategory };

export function getCategoryCountKey(categoryNames: string | string[]): string {
  return JSON.stringify(normalizeCategoryPathInput(categoryNames));
}

export function getCategoryCount(
  countMap: Record<string, number>,
  categoryNames: string | string[],
): number {
  return countMap[getCategoryCountKey(categoryNames)] ?? 0;
}

export function getCategorySlug(name: string): string {
  const mapped = categoryMap[name];
  if (mapped) return mapped;
  return encodeURIComponent(name.trim());
}

export async function getCategoryList(): Promise<CategoryListResult> {
  const allBlogPosts = await getVisibleBlogPosts();
  const countMap: Record<string, number> = {};
  const resCategories: Category[] = [];

  for (const post of allBlogPosts) {
    if (post.data.catalog === false) continue;

    const categoryPath = getCategoryArr(post.data.categories);
    for (let index = 0; index < categoryPath.length; index++) {
      const currentPath = categoryPath.slice(0, index + 1);
      const key = getCategoryCountKey(currentPath);
      countMap[key] = (countMap[key] || 0) + 1;
    }

    upsertCategoryPath(resCategories, categoryPath);
  }

  return { categories: resCategories, countMap };
}

export function addCategoryRecursively(
  rootCategories: Category[],
  parentNames: string[],
  name: string,
) {
  upsertCategoryPath(rootCategories, [...parentNames, name]);
}

export function getCategoryLinks(
  categories?: Category[],
  parentLink?: string,
): string[] {
  if (!categories?.length) return [];
  const res: string[] = [];

  for (const category of categories) {
    const link = getCategorySlug(category.name);
    const fullLink = parentLink ? `${parentLink}/${link}` : link;
    res.push(fullLink);

    if (category.children?.length) {
      res.push(...getCategoryLinks(category.children, fullLink));
    }
  }

  return res;
}

export function getCategoryNameByLink(link: string): string {
  if (!link) return '';

  const cleanLink = link.replace(/^\/+|\/+$/g, '');
  if (!cleanLink) return '';

  const segments = cleanLink.split('/').filter(Boolean);
  if (segments.length === 0) return '';

  const lastSegment = segments[segments.length - 1];
  return REVERSE_CATEGORY_MAP[lastSegment] ?? normalizeSegment(lastSegment);
}

export function getCategoryByLink(
  categories: Category[],
  link?: string,
): Category | null {
  if (!link || !categories?.length) return null;
  const cleanLink = link.replace(/^\/+|\/+$/g, '');
  if (!cleanLink) return null;

  const segments = cleanLink.split('/').filter(Boolean);
  let currentCategories = categories;
  let currentCategory: Category | null = null;

  for (const segment of segments) {
    const normalized = normalizeSegment(segment);
    const nextCategory = currentCategories.find(
      (category) =>
        getCategorySlug(category.name) === segment ||
        category.name === normalized,
    );
    if (!nextCategory) return null;

    currentCategory = nextCategory;
    currentCategories = nextCategory.children ?? [];
  }

  return currentCategory;
}

export function buildCategoryPath(categoryNames: string | string[]): string {
  if (!categoryNames) return '';

  const names = Array.isArray(categoryNames) ? categoryNames : [categoryNames];
  if (names.length === 0) return '';

  const slugs = names.map((name) => getCategorySlug(name));
  return withBlogBase(`/categories/${slugs.join('/')}`);
}

export function getCategoryArr(
  categories?: string | string[] | string[][],
): string[] {
  return normalizeCategories(categories)[0];
}
