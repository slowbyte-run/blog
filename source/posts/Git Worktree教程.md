---
# ===== 文章模板（draft: true，不会发布）=====
# 复制本文件为 source/posts/你的文章.md，删掉 frontmatter 里的注释和
# 用不到的字段，把 draft 改为 false（或删除该行）即可发布。
# 必填：title / date。其余可选，详见字段说明。
#
# title          : 文章标题（必填）
# date           : 发布日期（必填，支持 2026-08-07 或 2026-08-07 12:00:00）
# description    : 摘要，缺省时用 AI 摘要或正文截取
# link           : 文章稳定标识（用于相似推荐/系列列表），一般不用填
# cover          : 封面图路径（/img/posts/xxx.webp），缺省用随机背景图
# tags           : 标签，可单个字符串或数组
# categories     : 分类，单个字符串 = 单级；字符串数组 = 一条多级路径
# subtitle       : 副标题
# catalog        : false 时不归入分类/不显示分类链接
# tocNumbering   : 目录标题自动编号，默认 true
# sticky         : 置顶（当前版本列表尚未生效）
# draft          : true 时仅本地可见，不会发布
title: Git Worktree 教程
date: 2026-05-05
description: Git Worktree — 让你从同一个仓库同时检出多个工作目录，实现多分支并行开发
# link: my-post-id
# cover: /img/posts/example.webp
tags:
  - git
categories:
  - Git
# subtitle: '副标题'
# catalog: true
# tocNumbering: true
# sticky: false
---

# Git Worktree 教程

> Git Worktree — 让你从同一个仓库同时检出多个工作目录，实现多分支并行开发
>
> 官方文档：https://git-scm.com/docs/git-worktree
> Git 官网：https://git-scm.com/

---

## 1. 什么是 Git Worktree

Git Worktree 允许你从**同一个 Git 仓库**中，在**不同的目录**里同时检出**多个分支**。每个目录称为一个 **worktree（工作树）**，它们共享同一个 `.git` 数据库。

```
my-project/              ← 主工作树（main 分支）
├── .git/                ← 所有 worktree 共享这个 .git
├── src/
└── ...

../my-project-feature/   ← 另一个 worktree（feature 分支）
├── src/
└── ...

../my-project-hotfix/    ← 又一个 worktree（hotfix 分支）
├── src/
└── ...
```

### 核心概念

| 概念                             | 说明                                       |
| -------------------------------- | ------------------------------------------ |
| **主工作树 (main worktree)**     | 仓库克隆时的默认工作目录                   |
| **附加工作树 (linked worktree)** | 通过 `git worktree add` 创建的额外工作目录 |
| **共享 `.git`**                  | 所有 worktree 共享同一个对象数据库和 refs  |
| **HEAD 独立**                    | 每个 worktree 有自己独立的 HEAD，互不干扰  |

---

## 2. 为什么需要 Worktree

### 传统分支切换的痛点

```bash
# 传统方式：切换分支前必须处理未提交的修改
git stash                    # 1. 暂存修改
git switch feature-a         # 2. 切换分支
# ... 工作 ...
git switch main              # 3. 切回来
git stash pop                # 4. 恢复修改（可能冲突！）
```

**问题：**

- 频繁切换分支时，stash/commit 的操作非常耗时
- 大型项目中 `git checkout` 需要替换大量文件，速度慢
- stash pop 可能产生冲突，打断工作流
- 无法同时在多个分支上工作

### Worktree 的优势

```bash
# 使用 worktree：并行开发，无需切换
git worktree add ../project-feature -b feature-a
git worktree add ../project-hotfix -b hotfix-b

# 两个目录可以同时打开在不同的 IDE 窗口中
# 修改互不影响，无需 stash
```

---

## 3. 基础操作

### 3.1 创建 Worktree

#### 创建已有分支的 worktree

```bash
# 基本语法
git worktree add <path> <branch>

# 示例：为已有的 feature 分支创建 worktree
git worktree add ../my-project-feature feature/awesome-feature
```

#### 创建新分支的 worktree

```bash
# 创建新分支并同时创建 worktree
git worktree add -b hotfix/login-bug ../my-project-hotfix

# 等价于：
# git worktree add ../my-project-hotfix -b hotfix/login-bug
```

#### 从特定提交创建 worktree

```bash
# 检出某个特定的 commit（detached HEAD 状态）
git worktree add --detach ../my-project-review abc1234

# 从某个 tag 创建
git worktree add --detach ../my-project-v1.0 v1.0
```

### 3.2 列出所有 Worktree

```bash
git worktree list
```

输出示例：

```
/home/user/my-project               abc1234 [main]
/home/user/my-project-feature       def5678 [feature/awesome-feature]
/home/user/my-project-hotfix        ghi9012 [hotfix/login-bug]
```

### 3.3 删除 Worktree

```bash
# 删除 worktree（推荐）
git worktree remove ../my-project-hotfix

# 强制删除（有未提交修改时）
git worktree remove --force ../my-project-hotfix
```

> 删除 worktree 后，对应的分支不会被删除，仍然保留在仓库中。

### 3.4 清理失效的 Worktree 引用

```bash
# 清理已不存在的 worktree 引用
git worktree prune

# 预览将被清理的内容（不实际执行）
git worktree prune --dry-run
```

---

## 4. 进阶用法

### 4.1 锁定 Worktree

锁定可以防止 worktree 被意外清理或 prune：

```bash
# 锁定 worktree
git worktree lock ../my-project-feature

# 给锁添加备注
git worktree lock --reason "长期分支，勿清理" ../my-project-feature

# 解锁
git worktree unlock ../my-project-feature
```

### 4.2 创建独立于任何分支的 Worktree（Detached HEAD）

```bash
# 从特定 commit 创建 detached worktree
git worktree add --detach ../review-branch HEAD~5

# 适合用于代码审查，不关联任何分支
```

在 detached HEAD 的 worktree 中，你可以：

- 测试特定版本的代码
- 阅读历史提交的代码
- 基于该 commit 创建新分支（`git checkout -b new-branch`）

### 4.3 将 Worktree 移动到新位置

```bash
# 移动 worktree
git worktree move ../old-path ../new-path
```

### 4.4 查看 Worktree 的详细信息

```bash
# 查看当前 worktree 的主仓库路径
git worktree list --porcelain
```

输出示例：

```
worktree /home/user/my-project
HEAD abc1234567890abcdef1234567890abcdef123456
branch refs/heads/main

worktree /home/user/my-project-feature
HEAD def5678901234567890abcdef1234567890abcdef
branch refs/heads/feature/awesome-feature
```

### 4.5 在 Worktree 中创建新分支

```bash
# 先进入 worktree 目录
cd ../my-project-feature

# 创建并切换到新分支
git switch -c feature/new-part

# 或者回到主仓库，直接创建
git worktree add ../new-worktree -b feature/new-part
```

---

## 5. 实际工作流场景

### 5.1 场景一：开发中紧急修复线上 Bug

你正在 `feature/x` 上开发，突然收到线上 Bug 需要立即修复：

```bash
# 1. 不中断当前工作，直接创建 hotfix worktree
git worktree add ../my-project-hotfix -b hotfix/production-bug

# 2. 在新目录中修复 Bug
cd ../my-project-hotfix
vim src/bugfix.py
git add . && git commit -m "fix: production bug"

# 3. 推送并创建 PR
git push origin hotfix/production-bug

# 4. 回到原来的目录继续开发（无需任何 stash 操作）
cd ../my-project-feature
# 继续原来的工作...
```

### 5.2 场景二：同时审查多个 PR

```bash
# 为每个 PR 创建独立的 worktree
git worktree add ../review-pr-42 origin/feature/pr-42
git worktree add ../review-pr-58 origin/feature/pr-58

# 在各自的目录中审查代码
cd ../review-pr-42
# 启动 IDE 审查...

cd ../review-pr-58
# 启动另一个 IDE 审查...

# 审查完毕后清理
git worktree remove ../review-pr-42
git worktree remove ../review-pr-58
```

### 5.3 场景三：同时开发前端和后端

```bash
# 假设 main 分支包含全栈代码
# 创建前端和后端的独立 worktree
git worktree add ../my-project-frontend -b feature/frontend-redesign
git worktree add ../my-project-backend -b feature/api-v2

# 用不同的 IDE 打开不同的目录
# 前端修改不会影响后端，反之亦然
```

### 5.4 场景四：对比不同版本的代码

```bash
# 创建两个 worktree，分别检出不同版本
git worktree add --detach ../compare-v1 v1.0.0
git worktree add --detach ../compare-v2 v2.0.0

# 使用 diff 工具对比
diff -r ../compare-v1 ../compare-v2

# 对比完毕后清理
git worktree remove ../compare-v1
git worktree remove ../compare-v2
```

### 5.5 场景五：在 CI/CD 中并行测试多个分支

```bash
#!/bin/bash
# CI 脚本示例
branches=("main" "feature/a" "feature/b")

for branch in "${branches[@]}"; do
  workdir="../test-$branch"
  git worktree add "$workdir" "$branch"
  cd "$workdir"
  uv sync && uv run pytest
  cd -
  git worktree remove "$workdir"
done
```

---

## 6. 限制与注意事项

### 6.1 同一分支不能被两个 Worktree 同时检出

```bash
# ❌ 错误：main 分支已经在主工作树中检出了
git worktree add ../another-main main
# error: 'main' is already checked out at '/home/user/my-project'
```

**解决方案：** 创建一个新分支

```bash
git worktree add ../another-main -b main-copy
```

### 6.2 子模块（Submodule）限制

```bash
# 子模块不会在新 worktree 中自动初始化
# 需要手动执行：
cd ../new-worktree
git submodule init
git submodule update
```

> 这是一个已知的限制。每个 worktree 需要独立初始化子模块。

### 6.3 Git Hooks 行为

- 只有**主工作树**（主克隆目录）会执行 `.git/hooks` 中的 hook
- 附加 worktree 的 `.git` 文件只是一个指向主仓库的引用，不会触发 hook

**解决方案：** 使用 `core.hooksPath` 为每个 worktree 指定 hook 路径：

```bash
cd ../my-worktree
git config core.hooksPath .hooks
```

### 6.4 磁盘空间

每个 worktree 都会检出完整的文件副本，会占用额外的磁盘空间。但它们**共享** `.git` 对象数据库，所以比克隆整个仓库要节省空间。

### 6.5 IDE / 编辑器配置

大多数 IDE（VS Code、JetBrains 系列）可以同时打开多个 worktree 目录。每个 worktree 可以在独立的 IDE 窗口中打开。

---

## 7. 常见问题

### Q: Worktree 和 `git clone` 有什么区别？

| 对比          | `git worktree add` | `git clone` |
| ------------- | ------------------ | ----------- |
| `.git` 数据库 | 共享               | 独立复制    |
| 磁盘空间      | 较小               | 较大        |
| 网络要求      | 不需要             | 需要        |
| 推送/拉取     | 在主仓库操作       | 各自独立    |
| 适合场景      | 同一项目的并行开发 | 全新项目    |

### Q: 如何将 Worktree 的修改合并回主分支？

```bash
# 在 worktree 中正常开发并提交
cd ../my-project-feature
git add . && git commit -m "feat: new feature"

# 回到主工作树
cd ../my-project

# 合并 worktree 的分支
git merge feature/awesome-feature

# 或者推送并创建 PR
git push origin feature/awesome-feature
```

### Q: 删除 Worktree 后分支会丢失吗？

不会。`git worktree remove` 只删除工作目录，分支和提交历史都保留在仓库中。你可以随时通过 `git switch feature/awesome-feature` 检出它。

### Q: 如何查看某个 Worktree 中的未提交修改？

```bash
# 查看所有 worktree 的状态
for wt in $(git worktree list --porcelain | grep "^worktree " | awk '{print $2}'); do
  echo "=== $wt ==="
  git -C "$wt" status --short
done
```

### Q: Worktree 支持 worktree 里面再创建 worktree 吗？

不推荐。嵌套 worktree 可能导致路径和 `.git` 引用混乱。始终从主仓库目录创建 worktree。

---

## 8. Worktree vs 其他方案对比

| 特性           | git worktree   | git switch     | git clone | docker 容器 |
| -------------- | -------------- | -------------- | --------- | ----------- |
| 并行开发       | ✅             | ❌             | ✅        | ✅          |
| 共享对象数据库 | ✅             | ✅             | ❌        | ❌          |
| 磁盘开销       | 中             | 无             | 高        | 高          |
| 切换速度       | 即时（已检出） | 慢（文件替换） | 不适用    | 启动慢      |
| 需要 stash     | ❌             | ✅             | ❌        | ❌          |
| 设置复杂度     | 低             | 低             | 低        | 高          |
| 适合场景       | 多分支并行     | 单分支切换     | 新环境    | 完全隔离    |

---

## 9. 常用命令速查表

### 创建

| 命令                                        | 说明                                |
| ------------------------------------------- | ----------------------------------- |
| `git worktree add <path> <branch>`          | 为已有分支创建 worktree             |
| `git worktree add -b <name> <path>`         | 创建新分支并创建 worktree           |
| `git worktree add --detach <path> <commit>` | 从特定 commit 创建（detached HEAD） |

### 管理

| 命令                            | 说明                   |
| ------------------------------- | ---------------------- |
| `git worktree list`             | 列出所有 worktree      |
| `git worktree list --porcelain` | 以机器可读格式列出     |
| `git worktree move <old> <new>` | 移动 worktree 到新位置 |
| `git worktree lock <path>`      | 锁定 worktree          |
| `git worktree unlock <path>`    | 解锁 worktree          |

### 清理

| 命令                                 | 说明                     |
| ------------------------------------ | ------------------------ |
| `git worktree remove <path>`         | 删除 worktree            |
| `git worktree remove --force <path>` | 强制删除（含未提交修改） |
| `git worktree prune`                 | 清理失效的 worktree 引用 |
| `git worktree prune --dry-run`       | 预览将被清理的内容       |

### 其他

| 命令                               | 说明                       |
| ---------------------------------- | -------------------------- |
| `git worktree list --porcelain`    | 查看 worktree 详细信息     |
| `git config core.hooksPath <path>` | 为 worktree 指定 hook 路径 |

---

## 完整工作流示例

以下是日常开发中的一个典型 Worktree 工作流：

```bash
# === 早上开始工作 ===

# 1. 查看当前 worktree 状态
git worktree list

# 2. 为今天的任务创建 worktree
git worktree add ../my-app-feature -b feature/new-dashboard

# === 在 worktree 中开发 ===

cd ../my-app-feature
# 用 IDE 打开这个目录
code .

# 开发、测试、提交
git add . && git commit -m "feat: add dashboard page"

# === 线上紧急 Bug ===

# 3. 不需要切换，直接创建 hotfix worktree
git worktree add ../my-app-hotfix -b hotfix/urgent-fix

cd ../my-app-hotfix
# 修复 Bug
git add . && git commit -m "fix: urgent production bug"
git push origin hotfix/urgent-fix

# === 回到正常工作 ===

# 4. 回到 feature worktree 继续开发
cd ../my-app-feature
# 继续之前的工作...

# === 完成任务 ===

# 5. 合并分支
git checkout main
git merge feature/new-dashboard

# 6. 清理 worktree
git worktree remove ../my-app-feature
git worktree remove ../my-app-hotfix
```
