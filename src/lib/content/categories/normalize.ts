import { DEFAULT_CATEGORY_NAME } from './constants';

export function normalizeCategoryPathInput(
  categoryNames: string | string[],
): string[] {
  return Array.isArray(categoryNames) ? categoryNames : [categoryNames];
}

export function normalizeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function normalizeCategories(
  categories?: string | string[] | string[][],
): string[][] {
  if (!categories) return [[DEFAULT_CATEGORY_NAME]];

  if (Array.isArray(categories)) {
    if (categories.length === 0) return [[DEFAULT_CATEGORY_NAME]];

    const first = categories[0];
    if (Array.isArray(first)) {
      const path = first.filter(
        (name) => typeof name === 'string' && name.trim().length > 0,
      );
      return [path.length > 0 ? path : [DEFAULT_CATEGORY_NAME]];
    }

    const path = categories.filter(
      (name): name is string =>
        typeof name === 'string' && name.trim().length > 0,
    );
    return [path.length > 0 ? path : [DEFAULT_CATEGORY_NAME]];
  }

  return [[categories]];
}
