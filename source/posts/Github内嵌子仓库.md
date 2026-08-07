---
title: 'Github内嵌子仓库'
date: '2025-07-01 14:32'
link: 'cnblogs-18959607'
description: '对比 Git Submodule 与 Subtree 两种在仓库内嵌子仓库的方案与用法。'
tags:
  - 'git'
  - 'github'
categories:
  - 'Git'
---

在一个 GitHub 仓库中嵌入（包含）另一个仓库，最常用的有两种方案：**Git Submodule** 和 **Git Subtree**。它们各有优劣，下面分别介绍它们的用法。

---

## 一、Git Submodule

Submodule 会在你的主仓库中保留一个对子仓库的引用（commit ID），子仓库的源码存放在一个独立目录下。

### 1\. 添加子模块

```bash
# 进入主仓库目录
cd your-main-repo

# 添加子模块：将子仓库克隆到 subdir 目录
git submodule add https://github.com/username/other-repo.git subdir
```

> 这时，主仓库会新增一个 `.gitmodules` 文件，记录子模块的 URL 和路径，并在 `subdir` 目录下生成一个指向子仓库特定提交的指针。

### 2\. 提交变更

```bash
git add .gitmodules subdir
git commit -m "Add other-repo as submodule in subdir"
git push
```

### 3\. 克隆包含子模块的仓库

其他人克隆时，需要加上 `--recurse-submodules`，或者在克隆后执行初始化：

```bash
# 克隆并自动初始化子模块
git clone --recurse-submodules https://github.com/yourname/your-main-repo.git

# 如果已经克隆过，执行：
git submodule init
git submodule update
```

### 4\. 更新子模块

如果子仓库有新提交，需要在主仓库里更新引用：

```bash
# 进入子模块目录，拉取最新
cd subdir
git pull origin main   # 或者其他分支

# 返回主仓库，提交更新的子模块引用
cd ..
git add subdir
git commit -m "Update submodule to latest"
git push
```

---

## 二、Git Subtree

Subtree 会把子仓库的代码合并到主仓库的某个子目录下，历史记录也被合并到你的主仓库中，不需要 `.gitmodules`。

### 1\. 添加子树

```bash
# 在主仓库中将 other-repo 的 main 分支作为子树引入到 subdir
git remote add other-repo https://github.com/username/other-repo.git
git fetch other-repo
git subtree add --prefix=subdir other-repo main --squash
```

- `--prefix=subdir`：要将子仓库放在哪个子目录
- `other-repo main`：指定远端名和分支
- `--squash`：将子仓库历史压缩为一个合并提交（可选）

### 2\. 更新子树

当子仓库有新提交时，拉取并合并到子目录：

```bash
git fetch other-repo
git subtree pull --prefix=subdir other-repo main --squash
```

如果想保留完整历史，可去掉 `--squash`。

---

## 小结

| 特性     | Submodule                             | Subtree                                              |
| -------- | ------------------------------------- | ---------------------------------------------------- |
| 仓库历史 | 独立管理，主仓库只记录引用            | 合并到主仓库历史                                     |
| 克隆依赖 | 需额外初始化 (`--recurse-submodules`) | 像普通代码一样直接克隆                               |
| 灵活性   | 可以切换子模块到任意提交              | 更新操作稍重，需要合并                               |
| 适用场景 | 子仓库独立发展，修改频率低            | 需要把子项目完全打包进主仓库，或不想管理多个仓库依赖 |

- **子模块（Submodule）**：适合子项目独立开发、并且需要在不同主仓库间共享同一份代码的场景。
- **子树（Subtree）**：适合你希望把子项目的代码完全纳入主仓库，并且减少操作步骤的场景。
