/** 博客园同步脚本的常量与路径约定。 */
export const SITE_ORIGIN = 'https://blog.novaspace.me';

/** 博客园 blogapp，同时也是 MetaWeblog 的 blogid。 */
export const BLOG_APP = 'slowbyte';

export const RPC_ENDPOINT = `https://rpc.cnblogs.com/metaweblog/${BLOG_APP}`;

export const POSTS_GLOB = 'source/posts/**/*.md';

/** 内容集合里的模板文件，永远不参与同步。 */
export const TEMPLATE_BASENAME = '文章模板.md';

/** 本地文章相对路径 -> 博客园 postid。新建成功后自动写回。 */
export const MAP_FILE = 'scripts/cnblogs-map.json';

/** 覆盖远端正文前的原文备份，避免误操作不可回滚。 */
export const BACKUP_DIR = '.cache/cnblogs-backup';

/**
 * 博客园用这个伪分类标记「该随笔按 Markdown 渲染」。
 * 漏掉它，正文会以纯文本 HTML 显示。
 */
export const MARKDOWN_CATEGORY = '[Markdown]';
