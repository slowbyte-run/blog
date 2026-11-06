# Repository Guidelines — astro-snow

个人博客（Astro 5 SSG + React 19 + TS 严格模式，Tailwind 3）。站点 `blog.novaspace.me`，评论用 Giscus，构建后推送到 `slowbyte-run/slowbyte-run.github.io`。

## Commands

```bash
pnpm dev            # astro dev
pnpm build:ci       # 构建；没有 pnpm build
pnpm check          # astro check（.astro 类型检查）
pnpm run typecheck  # tsc --noEmit（.ts/.tsx）
pnpm run lint       # ESLint
pnpm test           # Vitest 单元测试
pnpm run test:e2e   # Playwright
pnpm run format:check
```

- `check` 和 `typecheck` 覆盖不同文件，两者都要跑。
- **`.husky/pre-commit` 已按顺序跑整套校验**（check → typecheck → lint → format:check → test）。提交一次即可，不必先手动跑一遍；失败信息来自这里。
- E2E 首次需 `pnpm exec playwright install`。webServer 起 `astro dev` 于 4330（`reuseExistingServer`），workers=1、retries=1。
- `pnpm run knip` 当前是坏的（`knip.json` 的 `plugins` 键不被 v5 接受，报 `unrecognized_keys`）。别把它当校验步骤。
- 单文件 / 单用例：
  ```bash
  pnpm test tests/utils.spec.ts
  pnpm exec vitest run -t '部分测试名'
  pnpm exec playwright test tests/e2e/blog.spec.ts -g 'route'
  ```

## 关键架构事实

不看代码会猜错的：

- **`publicDir` 是 `source/`，不是 `public/`**（`astro.config.mjs`）。静态资源放 `source/`，URL 以 `/` 开头：`source/img/x.webp` → `/img/x.webp`。`public/` 是无人引用的遗留目录，往里放东西不会生效。
- **`/` 是引导页，博客在 `/blog`**。`src/pages/blog/about.md` 是页面，不属于内容集合。
- **文章 URL = `link ?? 序号 ?? id`**（`src/pages/blog/post/[...slug].astro`）。序号会随排序变化，所以**每篇文章都写 `link`**；子目录帖尤其必须，否则 URL 不稳定。
- **`link` 同时是 AI 摘要/相似度缓存的键**：脚本侧 `extractSlug` 无 `link` 时用相对路径（含子目录）小写，运行时 `getPostStableKey = link ?? id`。缺 `link` 时两者对不上，缓存静默失效。
- **`source/posts` 会从构建产物中删除**（`astro.config.mjs` 的 `astro:build:done` hook）。文章是内容集合，不是静态文件。
- **`source/img/backgrounds/` 只读 `.webp`**（`src/lib/backgrounds.ts` 硬过滤；目录里另有 20 个 `.jpg` 被静默忽略）。池为空时兜底 `defaultCoverList`（`/img/cover/1-13.webp`）。
- **`src/cache/*.json` 是构建期生成物**（lqips/similarities/summaries），由 `scripts/` 生成、被 CI 回写提交。别手改；刷新用 `pnpm run generate:lqips` / `generate:similarities`（本地模型，无 key） / `generate:summaries`（需 `OPENAI_API_KEY`）。`{}` 是合法状态。
- **AI 摘要**：OpenAI 兼容协议，默认 DeepSeek `https://api.deepseek.com/v1/` + `deepseek-flash`，可用 `OPENAI_API_BASE_URL`/`OPENAI_API_KEY`/`OPENAI_MODEL` 覆盖。无 key 或接口不通时只告警跳过，不会让构建失败。
- **所有文章都写了 `description`，AI 分支在常规流程里不可达**：脚本 `manual` 分支和运行时 `view-model.ts` 都优先 `description`，所以 `generate:summaries` 恒为 `generated 0`。验证真实凭据用 `pnpm run probe:summaries`（`--probe N`，只读、不写缓存）；CI 里手动触发 `deploy.yml` 并勾选 `probe_summaries`。
- **搜索用 pagefind，索引只在 build 时生成**。纯 `pnpm dev` 下搜索不可用、搜索框可能不渲染——这是预期行为，不是 bug。`tests/e2e/helpers/runtime-errors.ts` 已过滤这类噪音。
- **站点信息分散在三个配置**，改标题/简介/头像要同步：`src/config/blogLayoutConfig.ts`（`title`/`subtitle`/`avatar`/`site`/`blogSocialConfig`）、`indexConfig.ts`、`homePageConfig.ts`（`avatarUrl`、`homePageLinks`）。
- **社交链接存在两处**：`blogSocialConfig`（头部 `Social.tsx`）与 `homePageLinks`（引导页，`HomePage.tsx` 的 `getSocialButtons`）。增删平台要同时改 `SocialConfig` 类型、两处配置和 `getSocialButtons`。
- 头部 Logo 是 `src/assets/logo.png`（Vite `?url` 导入），与 favicon 不同，放 `src/assets` 而非 `source/`。
- 分类映射 `_config.yml`（shoka 遗留）不存在时走 `src/constants/category.ts` 的 `fallbackCategoryMap`；当前仓库无该文件。

## 内容约定

- 文章：`source/posts/**/*.md`（glob loader 递归匹配子目录）。frontmatter：`title`（必填）、`date`（必填）、`description`、`link`、`cover`、`tags`、`categories`、`subtitle`、`catalog`、`tocNumbering`、`sticky`、`draft`。
- `draft: true` 只在 production 生效（`repository.ts`）；dev 下草稿可见。
- 按主题分子目录：`XCPC/{Contest/<平台>,Algorithm/<板块>,Problems}`、`Backend`、`ArchLinux`、`Tools`（含 `Git`）、`knowledge-share-hub`。模板 `文章模板.md` 在根目录。
- `Algorithm/` 下固定 10 个板块：`Basic`、`Bitwise`、`DataStructure`、`DP`、`Graph`、`Math`、`Prefix`、`Random`、`String`、`XOR`；分类同步为 `XCPC → Algorithm → <板块>`，新帖按板块就位。
- 分类走多级：`categories` 的多行数组就是**一条**路径（`XCPC → Contest → Codeforces`）；要多条路径得用嵌套数组 `[[..],[..]]`。目录层级与分类层级保持一致，改目录就要同步改分类。
- 图片放 `source/img/`（建议按用途建子目录），markdown 用 `/img/...` 引用。
- 竞赛源码归档在仓库根的 `solutions/xcpc/<平台>/<比赛>/<题号>.cpp`，**不在 `source/` 下**，因此不部署；每个竞赛帖开头有一行指向它。已在 `.prettierignore` / ESLint ignores 中排除。
- 算法源码归档在 `solutions/xcpc/algorithm/<板块小写>/<知识点>/`，目录名用 ASCII（`dp/knapsack-01`、`graph/dsu`、`ds/segment-tree` 等）。帖子开头有一行引用块指过去；不归档 `t*.cpp` / `temp.cpp` / `solve.cpp` 这类临时文件。

## 代码约定

- `cn` from `@/lib/utils`（clsx + tailwind-merge）组合 className。
- **交互/状态统一用 nanostores**：`src/store/*.ts` 定义 `atom`，组件用 `@nanostores/react` 的 `useStore`。`zustand` 在 dependencies 里但 `src/` 中零引用——新增状态请跟随现有 nanostores 写法。
- 复用 `@reactuses/core` hooks（debounce/throttle/storage/media/event）。
- 日期 `dayjs`；浮层 `@floating-ui/react`；UI 原语 `@radix-ui/react-*`；工具函数 `es-toolkit`。
- **路径别名只在部分环境可用**：`tsconfig.json` 有全套 `@/*`、`@components/*`、`@lib/*` 等，`astro.config.mjs` 只注册了 `@`；`vitest.config.ts` 只映射 `@` 和 `@constants`。**单元测试里用其他别名会解析失败**。
- Astro 管页面结构、静态内容、路由；React 管状态、交互、副作用。页面文件里不放复杂交互。
- 关键修复加 `FIXED:` 注释。

## 测试

- 单元测试：`tests/**/*.spec.ts`（Vitest，`environment: node`，排除 `tests/e2e`）。
- E2E：`tests/e2e/`，helpers 在 `tests/e2e/helpers/`（`blog-routes.ts`、`runtime-errors.ts`）。跑在 dev server 上，因此受 pagefind 未构建的限制。
- 改动覆盖主路径 + 1 个失败路径。

## 技能与 Agent 文档

- 技能正文在 `.agents/skills/*/SKILL.md`；默认入口 `doccopilot-project-standards`。
- `.claude/skills.md` 和 `.agents/skills.md` 只是路由表，里面写的 `skills/*` 是旧路径，**不要按它找文件**。
- **Tickets**: 用 `gh` 操作 GitHub issue。见 `docs/agents/issue-tracker.md`。
- **Triage**: 评估 issue 状态时打/清标签。见 `docs/agents/triage-labels.md`。
- **Domain**: 提出重构或命名新概念前，先读 `GLOSSARY.md` 和相关 ADR。见 `docs/agents/domain.md`。

## Git 与部署

- 分支 `main`，remote `slowbyte-run/blog`。
- Conventional Commits（commitlint 强制）：`feat/fix/docs/style/refactor/perf/test/build/ci/chore/revert`，header ≤ 100 字符。
- **CI 会回写缓存**：`deploy.yml` 先生成三个缓存，再把 `src/cache/` 以 `chore: update cache files [skip ci]` 提交回 `main`。推送前先 `git pull --rebase`；文章提交别带 `[skip ci]`，否则不触发部署。
- 部署只在 `deploy.yml` 的 `paths` 命中时触发（`src/**`、`source/**`、`scripts/**`、`public/**`、配置文件）。只改 `tests/`、`AGENTS.md`、`README.md` 不会发布。
- `source/CNAME` 声明 `blog.novaspace.me`，随构建复制到 dist。
