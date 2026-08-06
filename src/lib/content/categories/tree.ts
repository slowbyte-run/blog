import type { Category } from '../types';

export function upsertCategoryPath(
  rootCategories: Category[],
  path: string[],
): void {
  let currentLevel = rootCategories;
  const currentPath: string[] = [];

  for (const name of path) {
    currentPath.push(name);
    let current = currentLevel.find((category) => category.name === name);
    if (!current) {
      current = { name, path: [...currentPath] };
      currentLevel.push(current);
    } else if (!current.path?.length) {
      current.path = [...currentPath];
    }

    if (!current.children) {
      current.children = [];
    }
    currentLevel = current.children;
  }
}

export function getCategoryNodeCount(categories?: Category[]): number {
  if (!categories?.length) return 0;

  return categories.reduce((count, category) => {
    return count + 1 + getCategoryNodeCount(category.children);
  }, 0);
}

export function getParentCategory(
  category: Category | null,
  categories: Category[],
): Category | null {
  if (!category || categories.length === 0) return null;

  const queue: Array<{ node: Category; parent: Category | null }> =
    categories.map((node) => ({ node, parent: null }));

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    if (current.node.name === category.name) return current.parent;

    for (const child of current.node.children ?? []) {
      queue.push({ node: child, parent: current.node });
    }
  }

  return null;
}
