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

1. 在 `source/posts/` 新建 `.md` 文件。frontmatter 必填 `title`、`date`，可选 `description / cover / tags / categories / subtitle / catalog / tocNumbering / sticky / draft`。
2. 图片放在 `source/img/`（如 `source/img/posts/`），markdown 里用 `/img/...` 或相对路径引用。
3. 提交并推送，自动部署：

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
- `source/img/avatar.png` 与 `homePageConfig.avatarUrl`：头像
- `source/CNAME`：自定义域名（`blog.novaspace.me`）

> 社交链接存在两处（头部 `blogSocialConfig` 与引导页 `homePageLinks`），增删平台需同步修改 `SocialConfig` 类型、两处配置及 `getSocialButtons`。

## 🚢 部署

GitHub Actions（`.github/workflows/deploy.yml`）在 push 或手动触发时自动执行：

1. 安装依赖
2. 生成构建缓存（LQIP / AI 摘要 / 语义相似度）
3. 构建静态站点
4. 通过 `peaceiris/actions-gh-pages` 推送到 `slowbyte-run/slowbyte-run.github.io`

仓库 Secrets 需配置：`DEPLOY_TOKEN`、`OPENAI_API_BASE_URL`、`OPENAI_API_KEY`、`OPENAI_MODEL`。

## 🙏 鸣谢

- [astro-snow](https://github.com/XueHua-s/astro-snow) —— 本博客使用的主题
- [astro-koharu](https://github.com/cosZone/astro-koharu) —— 主题灵感来源
- 字体：[寒蝉全圆体](https://chinese-font.netlify.app/zh-cn/fonts/hcqyt/ChillRoundFRegular)
