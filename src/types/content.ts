/**
 * 内容相关类型
 *
 * 定义博客内容、分类、标签与分页的公共类型。
 */

// 便捷导出博客类型
export type { BlogPost, BlogSchema } from './blog';

/**
 * 分类结构（层级）
 */
export interface Category {
  /** 分类名称 */
  name: string;
  /** 从根到当前节点的分类路径 */
  path: string[];
  /** 子分类 */
  children?: Category[];
}

/**
 * 带数量信息的分类
 */
export interface CategoryWithCount extends Category {
  /** 该分类下的文章数 */
  count: number;
}

/**
 * 分类列表结果
 */
export interface CategoryListResult {
  /** 层级分类树 */
  categories: Category[];
  /** 分类路径(JSON 字符串)到文章数的映射 */
  countMap: Record<string, number>;
}

/**
 * 带数量信息的标签
 */
export interface TagWithCount {
  /** 标签名 */
  name: string;
  /** 含此标签的文章数 */
  count: number;
}

/**
 * 列表页使用的文章元数据
 */
export interface PostMetadata {
  /** 文章标题 */
  title: string;
  /** 文章描述 */
  description?: string;
  /** 文章链接 */
  url: string;
  /** 文章日期 */
  date: Date;
  /** 封面图 */
  cover?: string;
  /** 标签 */
  tags?: string[];
  /** 分类 */
  categories?: string[] | string[][];
  /** 阅读时长统计 */
  readingTime?: {
    text: string;
    minutes: number;
    words: number;
  };
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  /** 当前页数据 */
  data: T[];
  /** 当前页码（从 1 开始） */
  page: number;
  /** 总页数 */
  totalPages: number;
  /** 总条目数 */
  totalItems: number;
  /** 是否存在下一页 */
  hasNext: boolean;
  /** 是否存在上一页 */
  hasPrev: boolean;
}
