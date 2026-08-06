import { categoryMap } from '@constants/category';

export const DEFAULT_CATEGORY_NAME = '技术教程';

export const REVERSE_CATEGORY_MAP = Object.fromEntries(
  Object.entries(categoryMap).map(([key, value]) => [value, key]),
);
