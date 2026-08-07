---
title: 'git提交说明的规范性'
date: '2025-05-15 18:24'
link: 'cnblogs-18878863'
description: 'Conventional Commits 提交规范：type 类型、作用域与提交示例。'
tags:
  - 'git'
categories:
  - 'Git'
---

在 Git 提交时，**提交说明（Commit Message）**的规范性对团队协作和代码维护至关重要。以下是常见的术语和分类方式，通常遵循 **Conventional Commits** 或行业约定：

---

### 一、提交类型（Type）

用于快速分类提交目的，常见的类型前缀（按频率排序）：

类型

说明

示例

`feat:`

新增功能（Feature）

`feat: 添加用户登录功能`

`fix:`

修复 Bug

`fix: 解决登录页面闪退问题`

`docs:`

文档更新（Documentation）

`docs: 更新API接口说明`

`style:`

代码样式调整（不影响逻辑，如空格、格式化）

`style: 格式化首页CSS`

`refactor:`

代码重构（既不修复 Bug 也不新增功能）

`refactor: 优化用户验证逻辑`

`perf:`

性能优化（Performance）

`perf: 减少首屏加载时间`

`test:`

测试相关（新增或修改测试用例）

`test: 添加登录模块单元测试`

`chore:`

杂项变更（构建流程、依赖库更新等）

`chore: 升级webpack到v5`

`revert:`

回滚之前的提交

`revert: 撤销某次错误合并`

`build:`

构建系统或外部依赖变更（如 npm、docker）

`build: 更新Dockerfile配置`

`ci:`

持续集成配置变更（如 GitHub Actions、Jenkins）

`ci: 添加自动化部署脚本`

---

### 二、正文（Body）与脚注（Footer）

- **正文**（可选）：详细说明变更原因、实现逻辑或注意事项，用空行与标题隔开。

```markdown
feat: 支持暗黑模式

在用户设置页面新增主题切换开关，默认跟随系统设置。
涉及修改：

- 新增ThemeContext组件
- 调整全局CSS变量
```

- **脚注**（可选）：关联 Issue 或 Breaking Changes（不兼容变更）。

```markdown
fix: 修复订单页404错误

Closes #123 // 关闭Issue
BREAKING CHANGE: 移除旧的API接口 `/v1/orders`
```

---

### 三、行业规范参考

1.  **AngJS 规范**：最早提出类型化提交消息的团队之一。
2.  **Conventional Commits**：标准化格式，支持自动化生成 CHANGELOG。
3.  **Gitmoji**：用表情符号增加可读性（如 `:bug:` 表示修复 Bug）。

---

### 四、反例 vs 正例

❌ **不推荐**：

- `更新代码`
- `修复了一个问题`

✅ **推荐**：

- `fix: 解决用户头像上传失败问题（文件大小限制）`
- `docs: 补充快速入门指南的安装步骤`

---

### 五、工具支持

- **Commitizen**：交互式生成规范提交消息。
- **Husky + commitlint**：在提交时自动检查格式。

通过规范化的提交说明，可以显著提升代码可维护性和协作效率。
