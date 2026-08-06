/**
 * 内容工具导出入口
 *
 * 统一从模块化文件重新导出，保持兼容并降低调用方的导入复杂度。
 */

// 导出类型
export type { Category, CategoryListResult } from './content/types';

// 导出分类工具
export {
  addCategoryRecursively,
  buildCategoryPath,
  getCategoryArr,
  getCategoryByLink,
  getCategoryCount,
  getCategoryCountKey,
  getCategoryLinks,
  getCategoryList,
  getCategoryNodeCount,
  getCategoryNameByLink,
  getParentCategory,
} from './content/categories';

// 导出文章工具
export {
  buildHomePageData,
  getArchiveData,
  getAdjacentSeriesPosts,
  getPostCategoryBreadcrumbs,
  groupPostsByYear,
  getPostCount,
  getPostDescription,
  getPostDescriptionWithSummary,
  getPostHref,
  getPostIndex,
  getPostIndexMap,
  getPostKeywords,
  getPostLastCategory,
  getPostSummaryData,
  getPostSeriesViewModel,
  getPostsByCategory,
  getPostsByCategoryPath,
  getPostsBySticky,
  getPostSummary,
  getRandomPosts,
  getSeriesPosts,
  getSortedPosts,
} from './content/posts';

export type {
  PostLinkItem,
  PostSummaryData,
  PostSummarySource,
} from './content/posts';

// 导出标签工具
export {
  getAllTags,
  getSortedTagsWithCount,
  getTagPostMap,
  normalizePostTags,
  toTagParam,
} from './content/tags';
