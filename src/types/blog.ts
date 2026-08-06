export interface BlogPost {
  id: string;
  slug?: string;
  body?: string;
  collection: 'blog';
  data: BlogSchema;
}

export interface BlogSchema {
  title: string;
  description?: string; // 文章描述
  link?: string; // 文章短链接
  date: Date;
  cover?: string;
  tags?: string | string[];
  /**
   * 老 hexo shoka 的分类有的是这样的, 为了兼容这么写了：
   * categories:
   * - [笔记, 算法]
   * 有的是这样的：
   * categories:
   * - 笔记
   */
  categories?: string | string[] | string[][];
  subtitle?: string; // 文章副标题
  catalog?: boolean; // 是否分离
  tocNumbering?: boolean; // 目录是否编号
  sticky?: boolean; // 是否置顶
  draft?: boolean; // 是否为草稿（开发环境可见，生产环境隐藏）
}
