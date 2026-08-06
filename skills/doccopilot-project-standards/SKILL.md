---
name: doccopilot-project-standards
description: 面向 Astro + React 项目的稳健开发规范，目标是约束实现过程并产出健壮代码。用于功能开发、缺陷修复、重构落地、边界条件处理、异常恢复、类型与测试补强、以及依赖选择决策；要求先读取 package.json，优先复用现有依赖，避免引入脆弱实现与高风险改动。
---

# Doccopilot Project Standards

## Workflow

按以下顺序执行，不要跳步：

1. 先读取并分析项目根目录 `package.json`，确认可复用依赖与能力边界。
2. 阅读相关模块现有实现，优先沿用项目既有模式、命名、分层与工具。
3. 在编码前列出失败路径：空值、超时、并发、重复提交、竞态、非法输入、权限/网络异常。
4. 实现时先保证正确性与可恢复性，再做体验与性能优化。
5. 为关键路径补齐类型收窄、错误处理、边界保护与回退策略。
6. 为改动补齐测试（至少覆盖主路径 + 1 个失败路径）。
7. 执行校验命令并修复问题后再交付。

## Hard Rules

### 1) package.json First

- 必须先读 `package.json` 再输出建议。
- 优先复用已有依赖与本地工具，禁止无理由引入新依赖。
- 任何“新增依赖”建议必须包含：
  - 预期收益（稳定性、维护性、开发效率）
  - 当前依赖为何不能覆盖
  - 引入后的复杂度与迁移成本

### 2) Robustness First

以下要求必须满足：

- 输入校验：对外部输入、URL 参数、表单数据、接口数据做显式校验与兜底。
- 空值安全：禁止假设字段永远存在，必须处理 `null/undefined/empty`。
- 异常可恢复：失败时提供降级路径，不允许静默失败。
- 幂等与重入：重复点击、重复请求、重复订阅不会导致状态污染。
- 并发与竞态：异步请求需支持取消或过期结果丢弃，避免旧数据覆盖新数据。
- 副作用清理：事件监听、定时器、订阅必须成对清理，避免泄漏。
- 类型收窄：避免 `any` 扩散，关键分支使用类型守卫。

### 3) Clear Boundaries (Astro / React)

职责保持清晰：

- Astro：页面结构、静态内容、组合与分发。
- React：状态、交互、副作用、动态行为。

避免将复杂交互逻辑散落在 Astro 页面文件中。

### 4) react-use Priority (When Installed)

若 `package.json` 已包含 `react-use`，优先复用其 hooks，避免重复造轮子。优先场景：

- debounce/throttle
- storage 同步
- media/query 与可见性
- 事件绑定与 click-away
- previous/update-effect
- useEvent：用于给 DOM / window / element 绑定事件监听
- useLatest：保存最新的值，避免闭包拿到旧值
- useCallbackRef / useRef + useCallback：自己组合用来做“稳定 callback”
- 优先“组合多个小 hooks”，避免单个巨型 hook。

### 5) No Fragile Implementations

禁止以下实现：

- 仅靠时序“碰运气”通过的逻辑（未处理竞态与重入）。
- 仅在理想数据下可运行的逻辑（无边界检查）。
- 捕获异常但不记录上下文、不反馈状态的静默吞错。
- 过度抽象导致调用方难以理解和测试的设计。

## Output Contract

交付时按以下结构输出：

1. 依赖与工具分析（基于 `package.json`）
2. 风险清单（失败路径、边界条件、并发/竞态、异常恢复）
3. 实施方案（低风险修复 -> 结构优化 -> 质量补强）
4. 关键代码示例（健壮性改造前后对比）
5. 验证结果（类型、lint、测试覆盖与剩余风险）

## Project Conventions

### ClassName Composition

组合 className 使用 `src/lib/utils.ts` 的 `cn`：

- `import { cn } from '@/lib/utils';`
- 优先 `cn(...)`，避免手工拼接导致 Tailwind 冲突。

### Preferred Existing Libraries

优先复用：`react-use`、`zustand`、`clsx`、`tailwind-merge`、`dayjs`、`@floating-ui/react`、`@radix-ui/react-*`、`nanostores`。

### Validation Commands

如本次任务包含代码变更，至少执行并报告结果：

```bash
pnpm check
pnpm run lint
pnpm run typecheck
pnpm test
```

涉及交互链路变更时再执行：

```bash
pnpm run test:e2e
```

## Resources

按需读取：

- `references/global-prompt.md`(加载关键词: 《软件设计的哲学》)
