# Repository Guidelines — astro-snow

## First Read

- `CLAUDE.md` 是 Claude 的入口文件。
- `.claude/skills.md`（Claude Code）和 `.agents/skills.md`（Codex CLI）提供技能路由。
- 默认入口技能：`skills/doccopilot-project-standards/SKILL.md`。

## Project Overview

astro-snow 是一个基于 Astro 5 + React 19 + TypeScript 的个人博客（SSG），ACG/粉蓝配色。已按用户 slowbyte 自定义：站点 `blog.novaspace.me`，评论用 Giscus（仓库 `slowbyte-run/blog`），部署到 `slowbyte-run/slowbyte-run.github.io`。周刊、音乐播放器、简历页已移除，勿重新添加。

## 关键架构事实（不看代码猜不到的）

- **`publicDir` 是 `source/` 而非 `public/`**（`astro.config.mjs:29`）。所有静态资源放 `source/` 下，URL 以 `/` 开头：`source/img/x.webp` → `/img/x.webp`。`public/` 目录是未使用的遗留（`public/js/GridArrayBg.min.js` 无引用），不要往里面放东西。
- **博客文章是 `source/posts/**/*.md`**（`src/content/config.ts` 的 glob loader），frontmatter 支持 `title/date/description/cover/tags/categories/subtitle/catalog/tocNumbering/sticky/draft`。
- **`source/posts` 会被从构建产物中删除**（`astro.config.mjs` 的 `sourcePublicDir` hook）——文章是内容集合，不是静态文件。
- **图片放 `source/img/`**（建议按用途建子目录），markdown 里用 `/img/...` 或相对路径 `../img/...` 引用。
- **`source/img/backgrounds/` 只读 `.webp`**（`src/lib/backgrounds.ts` 硬过滤），作为文章卡片/横幅随机图池；无随机图时兜底 `source/img/cover/1-13.webp`（`defaultCoverList`）。
- **`src/cache/*.json`（lqips/similarities/summaries）是构建期缓存**，由 `scripts/` 脚本生成；内容为空 `{}` 是合法的。
- **AI 摘要走 OpenAI 兼容协议**：默认 DeepSeek 端点（`https://api.deepseek.com/v1/`）、模型 `deepseek-v4-flash`，可用环境变量 `OPENAI_API_BASE_URL` / `OPENAI_API_KEY` / `OPENAI_MODEL` 覆盖（`scripts/lib/summaries/config.ts`）。
- **语义推荐不需要 API key**：本地 transformers.js 模型 `Snowflake/snowflake-arctic-embed-m-v2.0`（`scripts/lib/similarities/config.ts`）。
- **全站搜索用 pagefind，索引只在构建时生成**。开发模式下 `/pagefind/` 从 `dist/` 提供——若从未 build，搜索输入框可能不渲染。此行为是已知噪音，e2e 的 `runtime-errors.ts` 已过滤。
- **站点信息分散在 3 个配置文件**，改标题/简介需同步：`src/config/blogLayoutConfig.ts`（全局+社交栏）、`src/config/indexConfig.ts`（引导页 baseLayout）、`src/config/homePageConfig.ts`（引导页头像/标语/社交按钮）。
- **社交链接存在两处，必须保持同步**：`blogSocialConfig`（`blogLayoutConfig.ts`，头部 `Social.tsx`）和 `homePageLinks`（`homePageConfig.ts`，引导页按钮）。删除/新增平台要同时改 `SocialConfig` 类型、两处配置、以及 `HomePage.tsx` 的 `getSocialButtons`。
- 头像 `avatar`（`blogLayoutConfig.avatar`）与引导页 `avatarUrl`（`homePageConfig.ts`）都要改。
- 头部 Logo 是 `src/assets/logo.png`（`Header.tsx` 用 `?url` 导入），与 favicon 不同，不放 `source/`。
- `_config.yml`（shoka 旧分类映射）可选；不存在时用 `src/constants/category.ts` 的 `fallbackCategoryMap`。

## Project Structure

```
src/
├── components/        # React & Astro 组件
│   ├── category/      # 分类组件
│   ├── comment/       # 评论系统（Giscus）
│   ├── common/        # 通用组件
│   ├── control/       # 控制组件
│   ├── embed/         # 嵌入处理（tweet、link）
│   ├── friends/       # 友链组件
│   ├── home/          # 首页（引导页）组件
│   ├── layout/        # 布局组件（Header、Social、搜索等）
│   ├── markdown/      # Markdown 增强
│   ├── post/          # 文章展示组件
│   ├── svg/           # SVG 组件
│   ├── theme/         # 主题切换
│   └── ui/            # UI 基础组件
├── assets/            # 源码资源（logo.png 等，经 Vite 打包）
├── cache/             # 构建缓存（lqips、similarities、summaries）
├── config/            # 站点配置（blogLayoutConfig、homePageConfig、friends-config 等）
├── constants/         # 常量与设计令牌（router、category、design-tokens）
├── content/           # 内容集合 schema
├── hooks/             # React 自定义 hooks
├── layouts/           # Astro 布局（BaseLayout、Layout、AboutLayout）
├── lib/               # 工具库（content、markdown、lqip、backgrounds、utils 等）
├── pages/             # 页面路由（引导页 index.astro + blog/）
├── store/             # 状态管理（nanostores）
├── styles/            # 全局 CSS 与主题样式（含 pagefind.css 搜索 UI 定制）
├── types/             # TypeScript 类型
└── scripts/           # 辅助脚本（transformShokaConfig 等）
```

其他关键目录：

```
skills/                # Claude Code / Codex 技能
tests/                 # 单元测试（Vitest）
tests/e2e/             # E2E 测试（Playwright，跑在 astro dev:4330）
scripts/               # 内容生成脚本（LQIP、相似度、摘要）
source/                # publicDir：静态资源 + posts 内容集合 + CNAME
```

## Skill Routing

| 技能                           | 适用场景                                                         |
| ------------------------------ | ---------------------------------------------------------------- |
| `doccopilot-project-standards` | 默认入口：功能开发、依赖复用、cn 工具、健壮性规范、校验命令      |
| `software-design-philosophy`   | 模块设计、复杂度分析、接口收敛、深浅模块判断                     |
| `code-review-expert`           | 审查 diff、Bug 排查、安全风险、测试缺口                          |
| `frontend-design`              | 页面与组件设计、交互体验、视觉品质                               |
| `vercel-react-best-practices`  | 性能优化、Bundle 体积、瀑布流、重渲染、数据获取                  |
| `astro`                        | Astro 组件/页面、SSG、Islands、Content Collections、适配器、部署 |

## Working Rules

### Environment

- Node >= 22，仅使用 pnpm
- 框架：Astro 5（SSG）+ React 19（交互组件）+ TypeScript 5（严格模式）
- 样式：Tailwind CSS 3 + PostCSS（nesting）

### Dependencies First

- 编码前先读 `package.json`，优先复用已有依赖。
- 引入新依赖前必须说明：预期收益、现有依赖为何不能覆盖、迁移成本。

### Key Conventions

- 使用 `cn` from `@/lib/utils` 组合 className（clsx + tailwind-merge）
- 优先复用 `@reactuses/core` hooks（debounce、throttle、storage、media、event）
- 状态管理：React 内用 `zustand`，跨框架用 `nanostores`（@nanostores/react）
- 日期：`dayjs`；浮层：`@floating-ui/react`；UI 原语：`@radix-ui/react-*`
- 工具函数：`es-toolkit`
- 标记关键代码：添加 `FIXED:` 注释

### Astro / React Boundaries

- **Astro**：页面结构、静态内容、组合与分发、路由
- **React**：状态、交互、副作用、动态行为
- 避免在 Astro 页面文件中放置复杂交互逻辑

### Testing

- 单元测试放在 `tests/`（Vitest）
- E2E 测试放在 `tests/e2e/`（Playwright，webServer 起 `astro dev` 于 4330）
- 改动至少覆盖主路径 + 1 个失败路径
- E2E 首次运行需 `pnpm exec playwright install` 下载浏览器

## Build And Verification

```bash
# 安装
pnpm install

# 开发
pnpm dev

# 构建
pnpm build:ci

# 校验（代码变更后至少执行以下命令）
pnpm check          # Astro 类型检查
pnpm run lint       # ESLint
pnpm run typecheck  # TypeScript 类型检查
pnpm test           # 单元测试

# 涉及交互链路变更时
pnpm run test:e2e   # Playwright E2E 测试（需浏览器已安装）

# 代码格式化
pnpm run format     # Prettier
pnpm run format:check

# 内容生成（构建前如需刷新缓存）
pnpm run generate:lqips          # 低质量图片占位
pnpm run generate:similarities   # 文章语义相似度（本地模型，无需 API key）
pnpm run generate:summaries      # AI 摘要（需 OPENAI_API_KEY）
```

## Git And Scope

- 基础分支：`main`；remote 为 `slowbyte-run/blog`
- 提交规范：Conventional Commits（commitlint 强制，type 枚举：feat/fix/docs/style/refactor/perf/test/build/ci/chore/revert）
- **预提交 `.husky/pre-commit` 会跑完整套件**（check + typecheck + lint + format:check + test + test:e2e），提交较慢；lint-staged 仅配置于依赖，未启用
- 部署：GitHub Actions（`.github/workflows/deploy.yml`）构建后推送到 `slowbyte-run/slowbyte-run.github.io`，依赖仓库 secrets：`DEPLOY_TOKEN`、`OPENAI_API_BASE_URL`、`OPENAI_API_KEY`、`OPENAI_MODEL`
- 自定义域名由 `source/CNAME`（`blog.novaspace.me`）声明，会随构建复制到 dist
