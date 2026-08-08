---
title: 'Git 回退全场景速查：工作区、暂存区、本地、远程'
date: '2025-07-05 15:59'
link: 'cnblogs-18967266'
description: 'git 回退操作的常见场景与命令整理。'
tags:
  - 'git'
categories:
  - 'Git'
---

刚用 Git 那会儿，我干过最蠢的一件事就是 `git add` 错文件后一顿乱 `reset`，本地改的东西差点全没了。后来把回退这套彻底捋清楚才踏实。这篇按工作区、暂存区、本地提交、远程仓库四个层面把回退操作整理成速查，要用的时候直接翻。

# Git 回退操作完整教程

> 覆盖所有常见场景：工作区、暂存区、提交、远程仓库、分支、文件等回退操作
>
> Git 官网：https://git-scm.com/

---

这份笔记是血泪攒出来的。有回我手一抖 `git add` 错了文件，又慌着 `reset`，结果半天没折腾明白。后来我把工作区、暂存区、本地仓库、远程仓库四块的回退命令全整理了一遍，再手滑就不慌了。这篇文章就是那套速查，按场景翻就行。

## 1. 核心概念：Git 的三个区域

先花两分钟把 Git 的数据流理顺，回退命令全是照着它反着来的：

```
  工作区 (Working Directory)
       │
       │  git add
       ▼
  暂存区 (Staging Area / Index)
       │
       │  git commit
       ▼
  本地仓库 (Local Repository)
       │
       │  git push
       ▼
  远程仓库 (Remote Repository)
```

每个区域都有对应的回退命令，核心原则：**回退方向与操作方向相反**。

| 区域     | 修改方式     | 回退方式                                  |
| -------- | ------------ | ----------------------------------------- |
| 工作区   | 手动编辑文件 | `git checkout --` / `git restore`         |
| 暂存区   | `git add`    | `git reset HEAD` / `git restore --staged` |
| 本地仓库 | `git commit` | `git reset` / `git revert` / `git amend`  |
| 远程仓库 | `git push`   | `git push --force` / `git push -f`        |

---

## 2. 撤销工作区修改

场景：你修改了文件，但**还没 `git add`**，想丢弃修改。

### 2.1 撤销单个文件

```bash
# 方式一：checkout（传统方式）
git checkout -- <file>

# 方式二：restore（Git 2.23+ 推荐）
git restore <file>
```

### 2.2 撤销多个文件

```bash
# 撤销所有已修改文件
git restore .

# 撤销指定目录下所有文件
git restore src/
```

### 2.3 撤销新增文件（未暂存）

```bash
# 方式一
git clean -fd

# 方式二：先 dry-run 看看会删什么
git clean -fdn      # 预览模式
git clean -fd       # 确认后执行
```

### 2.4 区分 tracked 和 untracked 文件

```bash
# 只删除 untracked 文件，保留已修改的 tracked 文件
git clean -fd

# 删除 untracked 文件和目录
git clean -fdn      # 预览
git clean -fd       # 执行
```

> **⚠️ 警告：** `git clean` 删除的文件无法恢复，操作前务必用 `-n` 预览。

---

## 3. 撤销暂存区操作

场景：你已经 `git add` 了文件，但**还没 commit**，想把文件从暂存区移回工作区。

### 3.1 撤销单个文件的暂存

```bash
# 方式一：reset HEAD（传统方式）
git reset HEAD <file>

# 方式二：unstage（Git 2.23+ 推荐）
git restore --staged <file>
```

### 3.2 撤销所有暂存文件

```bash
# 方式一
git reset HEAD

# 方式二
git restore --staged .
```

### 3.3 实际示例

```bash
# 假设你 add 了三个文件
git add file1.txt file2.txt file3.txt

# 只想撤销 file3.txt 的暂存
git restore --staged file3.txt

# 或用 reset
git reset HEAD file3.txt
```

---

## 4. 撤销提交（本地）

场景：已经 `git commit` 了，但想撤销这次提交。

### 4.1 三种 reset 模式

```bash
git reset --soft <commit>   # 撤销提交，保留修改在暂存区
git reset --mixed <commit>  # 撤销提交，保留修改在工作区（默认）
git reset --hard <commit>   # 撤销提交，丢弃所有修改
```

**图解对比：**

```
初始状态：
  工作区: 修改内容
  暂存区: 修改内容
  仓库:   提交 C

--soft：
  工作区: 修改内容 ✓
  暂存区: 修改内容 ✓
  仓库:   回退到 B（C 的修改保留在暂存区）

--mixed（默认）：
  工作区: 修改内容 ✓
  暂存区: 空 ✗
  仓库:   回退到 B（C 的修改保留在工作区）

--hard：
  工作区: 空 ✗
  暂存区: 空 ✗
  仓库:   回退到 B（C 的修改完全丢失）
```

### 4.2 撤销最近一次提交（保留修改）

```bash
# 修改保留在暂存区，可以重新 commit
git reset --soft HEAD~1

# 修改保留在工作区，需要重新 add
git reset HEAD~1
```

### 4.3 撤销最近一次提交（丢弃修改）

```bash
# ⚠️ 危险操作：修改内容将丢失
git reset --hard HEAD~1
```

### 4.4 用 revert 创建"反向提交"

```bash
# 不删除原提交，而是创建一个新提交来抵消它的修改
git revert HEAD          # 撤销最近一次提交
git revert <commit-hash> # 撤销指定提交
```

**reset vs revert 对比：**

| 特性           | `git reset`          | `git revert`         |
| -------------- | -------------------- | -------------------- |
| 原提交是否保留 | 删除（从历史中移除） | 保留（创建反向提交） |
| 是否改写历史   | 是                   | 否                   |
| 适用场景       | 本地未推送的提交     | 已推送到远程的提交   |
| 安全性         | ⚠️ 需谨慎            | ✅ 安全              |

### 4.5 修改最近一次提交信息

```bash
# 只修改提交信息
git commit --amend -m "新的提交信息"

# 修改提交信息 + 追加文件
git add forgotten-file.txt
git commit --amend -m "更新的提交信息"
```

### 4.6 撤销最近 N 次提交

```bash
# 撤销最近 3 次提交，保留修改在工作区
git reset HEAD~3

# 撤销最近 3 次提交，保留修改在暂存区
git reset --soft HEAD~3

# 撤销最近 3 次提交，丢弃所有修改
git reset --hard HEAD~3
```

---

## 5. 回退到指定提交

### 5.1 reset 回退到指定 commit

```bash
# 回退到某次提交（保留修改）
git reset <commit-hash>

# 回退到某次提交（丢弃修改）
git reset --hard <commit-hash>

# 回退到某次提交（修改保留在暂存区）
git reset --soft <commit-hash>
```

### 5.2 查找要回退的提交

```bash
# 查看提交历史
git log --oneline

# 输出示例：
# a1b2c3d HEAD -> master (最新)
# e4f5g6h 修复登录 bug
# i7j8k9l 添加用户模块
# m0n1o2p 初始化项目

# 回退到 "初始化项目"
git reset --hard m0n1o2p
```

### 5.3 用 reflog 找回误操作

```bash
# 查看所有操作记录（包括 reset 掉的提交）
git reflog

# 输出示例：
# a1b2c3d HEAD@{0}: reset: moving to m0n1o2p
# b2c3d4e HEAD@{1}: commit: 添加用户模块
# ...

# 找回被 reset 掉的提交
git reset --hard b2c3d4e
```

> **💡 重要：** `git reflog` 是 Git 的"后悔药"，只要本地没清理，几乎所有操作都能恢复。

---

## 6. 远程仓库回退

### 6.1 场景：本地 reset 后推送到远程

```bash
# 1. 先在本地 reset
git reset --hard <commit-hash>

# 2. 强制推送到远程（⚠️ 危险操作）
git push --force origin main

# 或使用更安全的 force-with-lease
git push --force-with-lease origin main
```

### 6.2 force vs force-with-lease

```bash
# ⚠️ 无条件强制推送（危险）
git push --force origin main

# ✅ 安全的强制推送（检查远程是否有别人的新提交）
git push --force-with-lease origin main

# 更安全：指定旧的引用值
git push --force-with-lease=origin/main:old-ref origin main
```

### 6.3 用 revert 安全回退已推送的提交

```bash
# 推荐方式：不改写历史
git revert <commit-hash>      # 创建反向提交
git push origin main         # 正常推送
```

### 6.4 撤销远程分支的某次提交

```bash
# 方法一：revert（推荐）
git revert <commit-hash>
git push origin main

# 方法二：reset + force push（⚠️ 危险）
git reset --hard <commit-hash>^
git push --force origin main
```

### 6.5 清除远程分支的所有提交

```bash
# 将远程分支回退到某个提交
git push --force origin <commit-hash>:main
```

---

## 7. 文件/目录级别回退

### 7.1 恢复单个文件到某次提交的状态

```bash
# 将文件恢复到指定 commit 的版本（修改保留在工作区）
git checkout <commit-hash> -- <file>

# Git 2.23+ 推荐方式
git restore --source=<commit-hash> <file>
```

### 7.2 恢复整个目录

```bash
git checkout <commit-hash> -- src/
git restore --source=<commit-hash> src/
```

### 7.3 只查看某个文件的历史版本

```bash
# 查看文件的所有修改历史
git log -- <file>

# 查看某次提交时的文件内容
git show <commit-hash>:<file>

# 对比两个版本的差异
git diff <commit1> <commit2> -- <file>
```

### 7.4 恢复已删除的文件

```bash
# 查找文件是在哪次提交被删除的
git log --diff-filter=D -- <file>

# 恢复该文件
git checkout <commit-hash>^ -- <file>

# 或使用 Git 2.23+
git restore --source=<commit-hash>^ <file>
```

---

## 8. 分支级别操作

### 8.1 删除分支（丢弃该分支的所有提交）

```bash
# 删除本地分支
git branch -d <branch>      # 安全删除（已合并才允许）
git branch -D <branch>      # 强制删除（未合并也删除）

# 删除远程分支
git push origin --delete <branch>
```

### 8.2 重置分支到指定提交

```bash
# 将 feature 分支重置到 main
git checkout feature
git reset --hard main

# 将当前分支重置到远程分支
git fetch origin
git reset --hard origin/main
```

### 8.3 将当前分支回退到某个远程分支状态

```bash
git fetch origin
git reset --hard origin/feature
```

---

## 9. 合并冲突回退

### 9.1 放弃正在进行的合并

```bash
# 合并冲突后想放弃合并
git merge --abort

# 等价于
git reset --hard HEAD
```

### 9.2 放弃正在进行的 rebase

```bash
git rebase --abort
```

### 9.3 放弃正在进行的 cherry-pick

```bash
git cherry-pick --abort
```

### 9.4 放弃正在进行的 revert

```bash
git revert --abort
```

### 9.5 放弃正在进行的 stash pop

```bash
git stash drop
# 或查看 stash 列表确认后删除
git stash list
git stash drop stash@{0}
```

---

## 10. 误删文件恢复

### 10.1 恢复工作区误删的文件（未 git add）

```bash
# 文件如果在 Git 中 tracked 过
git checkout -- <file>
git restore <file>
```

### 10.2 恢复 git add 后误删的文件

```bash
git restore --staged <file>
git restore <file>
```

### 10.3 恢复 commit 后误删的文件

```bash
# 从最近一次提交恢复
git checkout HEAD -- <file>

# 从指定提交恢复
git checkout <commit-hash> -- <file>
```

### 10.4 恢复被 git clean 删除的 untracked 文件

```bash
# ⚠️ git clean 删除的文件无法恢复！
# 所以操作前一定要先预览
git clean -fdn    # 预览
git clean -fd     # 执行
```

---

## 11. 高级场景

### 11.1 回退但保留某些文件的修改

```bash
# 回退所有文件，但保留某个文件的修改
git reset HEAD~1
git checkout -- <file-to-keep>
```

### 11.2 回退指定文件到指定版本

```bash
# 从特定 commit 取出文件，直接写入工作区和暂存区
git checkout <commit-hash> -- <file>
git add <file>
git commit -m "恢复文件: <file>"
```

### 11.3 交互式 rebase 修改历史提交

```bash
# 修改最近 3 次提交
git rebase -i HEAD~3

# 交互界面中可以选择：
# pick   = 保留该提交
# reword = 修改提交信息
# edit   = 暂停，允许修改内容
# squash = 合并到上一个提交
# drop   = 删除该提交
```

### 11.4 将某个文件恢复到某次提交的版本并提交

```bash
git restore --source=<commit-hash> <file>
git add <file>
git commit -m "恢复 <file> 到版本 <commit-hash>"
```

### 11.5 回退 merge commit

```bash
# 查看 merge commit 的两个父提交
git log --format="%H %P" | head -1

# 回退 merge（保留工作区内容）
git reset --hard HEAD~1

# 或者 revert merge commit
git revert -m 1 <merge-commit-hash>
# -m 1 表示保留第一个父提交（通常是主分支）
```

### 11.6 暂存工作进度后再回退

```bash
# 先保存当前修改
git stash

# 执行 reset
git reset --hard HEAD~1

# 恢复之前保存的修改
git stash pop
```

### 11.7 批量回退特定模式的提交

```bash
# 回退所有 "WIP" 开头的提交
git log --oneline | grep "^.*WIP" | awk '{print $1}' | xargs -I {} git revert {}

# 只回退最近 5 次提交中的特定提交
git rebase -i HEAD~5
# 然后在交互界面中 drop 不需要的提交
```

---

## 12. 安全操作规范

### 12.1 操作前备份

```bash
# 备份当前分支
git branch backup-$(date +%Y%m%d)

# 或备份所有分支
git branch -a | while read branch; do
  git branch "backup/$branch" "$branch" 2>/dev/null
done
```

### 12.2 使用 stash 暂存修改

```bash
# 保存当前修改
git stash save "描述信息"

# 查看 stash 列表
git stash list

# 恢复 stash
git stash pop        # 恢复并删除
git stash apply      # 恢复但保留

# 删除 stash
git stash drop stash@{0}
```

### 12.3 使用 reflog 恢复

```bash
# 查看所有操作记录
git reflog

# 找到要恢复的 commit
git reset --hard <commit-hash>
```

### 12.4 推荐操作原则

| 场景               | 推荐方式                          | 原因               |
| ------------------ | --------------------------------- | ------------------ |
| 本地未推送的提交   | `git reset`                       | 改写本地历史无影响 |
| 已推送到远程的提交 | `git revert`                      | 不改写公共历史     |
| 撤销 merge         | `git revert -m 1`                 | 安全且可追溯       |
| 文件恢复           | `git restore --source`            | Git 2.23+ 推荐     |
| 撤销 add           | `git restore --staged`            | Git 2.23+ 推荐     |
| 危险操作前         | `git stash` + `git branch backup` | 双重保险           |

---

## 13. 命令速查表

### 按场景快速查找

| 场景                     | 命令                                 | 说明            |
| ------------------------ | ------------------------------------ | --------------- |
| 撤销工作区修改           | `git restore <file>`                 | 丢弃文件修改    |
| 撤销暂存                 | `git restore --staged <file>`        | 从暂存区移出    |
| 撤销最近提交（保留修改） | `git reset --soft HEAD~1`            | 修改在暂存区    |
| 撤销最近提交（保留修改） | `git reset HEAD~1`                   | 修改在工作区    |
| 撤销最近提交（丢弃修改） | `git reset --hard HEAD~1`            | ⚠️ 修改丢失     |
| 撤销已推送提交           | `git revert <hash>`                  | 创建反向提交    |
| 修改最近提交信息         | `git commit --amend -m "msg"`        | 替换上次提交    |
| 回退到指定提交           | `git reset --hard <hash>`            | ⚠️ 丢失后续修改 |
| 恢复文件到某版本         | `git restore --source=<hash> <file>` | 恢复单个文件    |
| 放弃合并                 | `git merge --abort`                  | 中止合并操作    |
| 恢复删除的文件           | `git checkout <hash> -- <file>`      | 从历史恢复      |
| 查看操作历史             | `git reflog`                         | 找回丢失的提交  |
| 强制推送                 | `git push -f`                        | ⚠️ 覆盖远程     |
| 安全强制推送             | `git push --force-with-lease`        | 检查后推送      |

### reset 模式速查

```
git reset --soft  HEAD~1  → 只撤销提交，修改在暂存区
git reset --mixed HEAD~1  → 撤销提交和暂存，修改在工作区（默认）
git reset --hard  HEAD~1  → 撤销一切，修改全部丢失
```

### restore vs checkout 对照

| 功能           | checkout (旧)                   | restore (新)                         |
| -------------- | ------------------------------- | ------------------------------------ |
| 恢复工作区文件 | `git checkout -- <file>`        | `git restore <file>`                 |
| 恢复暂存区文件 | `git reset HEAD <file>`         | `git restore --staged <file>`        |
| 从指定版本恢复 | `git checkout <hash> -- <file>` | `git restore --source=<hash> <file>` |

---

## 常见问题 FAQ

**Q: reset --hard 后能恢复吗？**

> 可以，用 `git reflog` 找到被 reset 前的 commit hash，然后 `git reset --hard <hash>` 恢复。

**Q: 已经 push 了，还能 reset 吗？**

> 可以，但需要 `git push --force`，会覆盖远程历史。推荐用 `git revert` 代替。

**Q: git clean 删除的文件能恢复吗？**

> 不能。`git clean` 删除的是 untracked 文件，从未被 Git 跟踪，无法恢复。

**Q: 如何同时撤销多个不连续的提交？**

> 用交互式 rebase：`git rebase -i HEAD~N`，在编辑器中标记要删除的提交为 `drop`。

**Q: 撤销 merge 后想保留其中一个分支的修改怎么办？**

> 使用 `git revert -m 1 <merge-hash>` 撤销 merge，然后手动 cherry-pick 需要保留的提交。
