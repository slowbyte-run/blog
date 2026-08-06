/**
 * Content-related type definitions
 */

export type Category = {
  name: string;
  path: string[];
  children?: Category[];
};

export type CategoryListResult = {
  categories: Category[];
  // key 为分类完整路径（JSON 字符串），例如：["笔记","前端"]
  countMap: { [key: string]: number };
};
