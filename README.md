# slowbyteのblog

个人博客，基于 [astro-snow](https://github.com/XueHua-s/astro-snow) 主题搭建（Astro 5 + React 19 + TypeScript 的 SSG），ACG / 粉蓝配色。

- 站点：https://blog.novaspace.me/
- 源码仓库：`slowbyte-run/blog`
- 部署仓库：`slowbyte-run/slowbyte-run.github.io`

## ✨ 功能特性

- **提交即部署**：push 到 `main` 自动构建并发布到 GitHub Pages
- **随机背景图**：`source/img/backgrounds/` 下的 webp 图片作为横幅 / 文章封面，构建时随机分配，页面每次加载还会再次随机换图
- **AI 摘要**：构建时自动生成文章摘要（OpenAI 兼容协议，默认 DeepSeek）
- **语义推荐**：本地 transformers.js 计算文章相似度，无需 API key
- **无后端搜索**：基于 Pagefind 的全站搜索，仅构建时生成索引
- **Markdown 增强**：GFM、代码高亮、自动目录、Mermaid 图表、LQIP 渐变占位
- 优雅的深色 / 浅色主题切换、阅读进度、多分类 / 多标签、归档、友链、Giscus 评论

## 🚀 本地开发

```bash
pnpm install
pnpm dev       # http://localhost:4321
```

构建与校验（代码变更后至少执行）：

```bash
pnpm build:ci          # 生产构建
pnpm check             # Astro 类型检查
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:e2e      # 需先 pnpm exec playwright install
pnpm run format:check
```

## ✍️ 写文章

1. 在 `source/posts/` 下（可按主题放进子目录，如 `Algorithm/`、`Backend/`、`Git/`、`Tools/`）新建 `.md` 文件。frontmatter 必填 `title`、`date`，可选 `description / link / cover / tags / categories / subtitle / catalog / tocNumbering / sticky / draft`。
2. 图片放在 `source/img/`（如 `source/img/posts/`），markdown 里用 `/img/...` 或相对路径引用。
3. 建议给每篇设 `link`（稳定 URL）；放在子目录的帖子务必设置 `link`。
4. 提交并推送，自动部署：

```bash
git pull --rebase        # 拉取上次 CI 生成的缓存提交
git add .
git commit -m "feat: 新增 xxx 文章"
git push
```

> 注意：提交信息不要带 `[skip ci]`，否则不会触发部署；本地 pre-commit 会跑校验套件（check + typecheck + lint + format:check + test）。

## ⚙️ 站点配置

站点信息分散在多个配置文件，改标题 / 简介需要同步：

- `src/config/blogLayoutConfig.ts`：全局站点信息 + 头部社交栏（`blogSocialConfig`）
- `src/config/indexConfig.ts`：引导页 baseLayout
- `src/config/homePageConfig.ts`：引导页头像 / 标语 / 社交按钮（`homePageLinks`）
- `src/components/home/HomePage.tsx`：`getSocialButtons`（与 `homePageLinks` 同步）
- `source/img/avatar.webp` 与 `homePageConfig.avatarUrl`：头像
- `source/CNAME`：自定义域名（`blog.novaspace.me`）

> 社交链接存在两处（头部 `blogSocialConfig` 与引导页 `homePageLinks`），增删平台需同步修改 `SocialConfig` 类型、两处配置及 `getSocialButtons`。

## 🚢 部署

GitHub Actions（`.github/workflows/deploy.yml`）在 push 或手动触发时自动执行：

1. 安装依赖
2. 生成构建缓存（LQIP / AI 摘要 / 语义相似度）
3. 构建静态站点
4. 通过 `peaceiris/actions-gh-pages` 推送到 `slowbyte-run/slowbyte-run.github.io`

仓库 Secrets 需配置：`DEPLOY_TOKEN`、`OPENAI_API_BASE_URL`、`OPENAI_API_KEY`、`OPENAI_MODEL`。

### AI 摘要凭据与验证

三处配置位置，按用途选：

| 场景           | 配在哪                                                       | 生效方式                                                              |
| -------------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| CI / 线上部署  | 仓库 **Settings → Secrets and variables → Actions**          | `deploy.yml` 通过 `env:` 注入，`workflow_dispatch` 手动触发时同样生效 |
| 本地一次性调用 | 命令行内联：`OPENAI_API_KEY=sk-xxx pnpm run probe:summaries` | 仅当前进程，不留痕                                                    |
| 本地长期开发   | 仓库根 `.env`（**已被 `.gitignore` 忽略**），或写进 shell rc | 脚本不自动加载 `.env`，需自行 `export` 或用 `pnpm exec dotenv-cli`    |

`OPENAI_API_BASE_URL` 可留空走默认 DeepSeek；`OPENAI_MODEL` 留空则用 `deepseek-flash`。

验证真实凭据是否可用（**只读，不写缓存，不部署**）：

```bash
pnpm run probe:summaries            # 默认抽样 3 篇，等价的 --probe 3
pnpm run probe:summaries -- 5       # 自定义篇数
```

成功时逐篇打印模型返回的摘要并以退出码 0 结束；凭据无效、接口不通或摘要不过质量门时退出码 1。CI 侧同理：在 Actions 页面 **Run workflow** 勾选 `probe_summaries`，只跑验证、跳过部署。

> 注意：仓库内所有文章都写了 `description`，而生成脚本与运行时都以 `description` 优先，所以常规 `generate:summaries` 永远是 `manual N, generated 0`。`--probe` 是唯一能在这种状态下验证 AI 链路的入口。

### 博客园同步

`scripts/syncCnblogs.ts` 把 `source/posts` 的文章推到[博客园](https://www.cnblogs.com/slowbyte)，走 MetaWeblog API。脚本会自己读仓库根的 `.env`（已被忽略）：

```bash
CNBLOGS_USERNAME=slowbyte
CNBLOGS_TOKEN=<博客园 后台 → 设置 → 其他设置 → MetaWeblog 访问令牌>
```

```bash
pnpm run sync:cnblogs                  # 只打印计划，不写远端
pnpm run sync:cnblogs -- --apply       # 真正执行
pnpm run sync:cnblogs -- --only LCA --apply
pnpm run sync:cnblogs -- --limit 1 --apply
```

规则：

- `frontmatter link: cnblogs-<id>` 或 `scripts/cnblogs-map.json` 里登记过的文章 → 覆盖正文；其余新建随笔，并把返回的 id 写回映射表。
- 远端已有同名文章会被认领（`ADOPT`），中断后重跑不会重复创建。
- 覆盖前把远端原文备份到 `.cache/cnblogs-backup/`。
- 正文按 Markdown 原样推送，`[Markdown]` 分类是渲染开关；`/img/`、`/blog/` 开头的站内链接会补成绝对地址。
- 博客园限制每分钟 20 篇、每天约 30 篇：脚本按 3.2s 间隔串行写入，命中分钟级限流会等 65s 自动重试；用尽当日额度时剩余的会失败，隔天重跑同一条命令即可（已完成的会被识别为 `SAME`）。
- `-- --status` 逐篇探测线上可见性（`public` / `restricted` 需登录即审核或私有 / `missing` 404 / `pending` 未创建），不改任何东西，适合收尾核对。
- `-- --draft` 把新文章先存成草稿；`-- --only <关键词> --force --apply` 可把草稿重新写一次转成已发布；`-- --delete <postid> --apply` 删除误建的随笔并同步清掉映射条目。
- MetaWeblog 不接受 `dateCreated`：新建的随笔发布日期是同步当天，已有随笔的日期保持不变。
- `draft: true` 与 `文章模板.md` 默认跳过。

## 🙏 鸣谢

- [astro-snow](https://github.com/XueHua-s/astro-snow) —— 本博客使用的主题
- [astro-koharu](https://github.com/cosZone/astro-koharu) —— 主题灵感来源
- 字体：[寒蝉全圆体](https://chinese-font.netlify.app/zh-cn/fonts/hcqyt/ChillRoundFRegular)
