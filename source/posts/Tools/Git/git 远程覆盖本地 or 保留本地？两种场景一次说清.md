---
title: 'git 远程覆盖本地 or 保留本地？两种场景一次说清'
date: '2025-06-11 21:27'
link: 'cnblogs-18924113'
description: '两种 git 场景的处理：远程仓库完全覆盖本地、以及拉取远程但保留本地改动。'
tags:
  - 'git'
categories:
  - 'Git'
---

那次我是真被坑惨了。本地改了一堆东西，远程同事又推了一版，两边完全对不上。我当时就两个诉求：要么远程直接覆盖我本地，要么保住本地改动。网上答案东一句西一句，越看越懵，最后我自己把两种情况都踩了一遍，才算彻底捋顺。这篇就把这两种极端场景的写法写清楚。

---

## 一、让远程分支完全覆盖本地

> **场景**：本地改动都可以丢弃，你只想把远程仓库的状态“生硬”地拉下来。

1. **强制同步**

   ```bash
   git fetch origin
   git reset --hard origin/<branch>
   git clean -df
   ```

   - `git fetch`：先更新远程引用，不做任何合并。
   - `git reset --hard`：把当前 HEAD、索引、工作区都重置到远程分支对应的提交，丢弃一切本地提交和暂存改动。
   - `git clean -df`：删除所有未跟踪（untracked）的文件和目录，彻底干净。

2. **（可选）单步命令**
   如果你只是为了快速覆盖，也可以直接用：

   ```bash
   git fetch origin && git reset --hard @{u} && git clean -df
   ```

   其中 `@{u}` 默认指向当前分支的上游分支（即 `origin/<branch>`）。

---

## 二、拉远程但不覆盖本地（始终保留本地改动）

> **场景**：你想把远程最新提交“揉进来”，但一旦有冲突或重叠，总是以本地内容为准，远程内容让路。

1. **使用 Merge 策略 `ours`**

   ```bash
   git pull -s recursive -X ours origin <branch>
   ```

   - `-s recursive`：指定递归合并策略（也是默认策略）。
   - `-X ours`：当出现冲突时，冲突文件都以「我们的」版本（本地版本）为准。
   - **结果**：会生成一个合并提交，但所有冲突都自动选择本地内容，远程冲突部分被丢弃。

2. **使用 Rebase，但保留本地**
   如果你更喜欢线性历史，也可以先 fetch，再用 rebase 并在冲突时一概保 local：

   ```bash
   git fetch origin
   git rebase origin/<branch> --strategy-option=ours
   ```

   - 这样相当于把远程放前面，然后把本地每个提交“贴”上去，冲突时都保本地版本。

3. **只 `fetch`，不自动合并**
   如果你甚至不想合并，只是想看远程状态，根本不让它动本地：

   ```bash
   git fetch origin
   ```

   然后可以用

   ```bash
   git diff HEAD..origin/<branch>
   ```

   查看差异，决定下一步是否手动合并、cherry-pick 或者放弃。

---

### 区别小结

| 方式                      | 本地改动是否保留？   | 提交历史                               | 典型命令示例                                                   |
| ------------------------- | -------------------- | -------------------------------------- | -------------------------------------------------------------- |
| 完全覆盖（reset + clean） | 全部丢弃             | 直接切到远程最新，无 merge/rebase 历史 | `git fetch && git reset --hard origin/主分支 && git clean -df` |
| Merge + ours              | 保留所有本地改动     | 会生成一次合并提交                     | `git pull -s recursive -X ours origin 主分支`                  |
| Rebase + ours             | 保留所有本地改动     | 历史线性，无额外 merge                 | `git fetch && git rebase origin/主分支 --strategy-option=ours` |
| 仅 fetch，不合并          | 保留本地，且不动远程 | 无任何合并或 reset                     | `git fetch origin`                                             |

---

**小贴士**

- 如果只是临时清理本地未提交改动、去拉远程再恢复，可以配合 `git stash` 或者 `--autostash`。
- 在操作前务必确认本地改动是否已备份或不再需要，尤其是 `reset --hard` 和 `clean -df`，否则丢失无法恢复。

## 三、选择性合并远程与本地

如果你不想一次性全盘覆盖，而是想自己拍板哪些改动合并进来、哪些保留本地，那就走“先 fetch → 再按需合并/拣选”的路子。我当时就是这么一步步试出来的：

---

### 1. 拿到远程最新状态（`git fetch`）

```bash
git fetch origin
```

- 只更新本地对远程分支（`origin/<branch>`）的 “镜像”，不触及当前分支。
- 拿到最新的提交、标签等对象，但你的 HEAD、索引（stage）和工作区保持不变。

---

### 2. 查看远程与本地的差异

动手合并前，我习惯先看清楚远程到底改了什么。

- **提交历史对比**

  ```bash
  git log --oneline --graph --decorate HEAD..origin/<branch>
  ```

  显示远程分支比当前分支新增了哪些提交。

- **文件差异对比**

  ```bash
  git diff --name-status HEAD..origin/<branch>
  ```

  列出所有有变动的文件，以及它们是新增（A）、修改（M）还是删除（D）。

- **详细差异**

  ```bash
  git diff HEAD..origin/<branch>              # 全量 diff
  git diff -- <path/to/file> HEAD origin/<branch>
  ```

---

### 3. 按需合并改动

#### 3.1 合并整个分支（带冲突手动解决）

    ```bash
    git merge origin/<branch>
    ```

- Git 会自动将远程所有提交合并到当前分支。
- 若有冲突，会在冲突文件里留下 `<<<<<<<` 标记，你可以逐个文件、逐个冲突块地选择“保本地”或“用远程”：

  ```diff
  <<<<<<< HEAD
  // 本地内容
  =======
  // 远程内容
  >>>>>>> origin/<branch>
  ```

- 解决完冲突后：

  ```bash
  git add <冲突已解决的文件>
  git commit   # 完成合并提交
  ```

#### 3.2 只挑选个别提交（`git cherry-pick`）

如果你只想把远程的某几个提交拣过来，而不合并整个分支：

1. 找到想要的远程提交哈希（`git log origin/<branch>`）。
2. 执行：

   ```bash
   git cherry-pick <commit-hash>
   ```

3. 按需解决 cherry-pick 过程中的冲突，完成后 `git add` + `git cherry-pick --continue`。

#### 3.3 只取某些文件（`git checkout` 或 `git restore`）

有时你只想把远程某几个文件拿过来：

- **Git 2.23+** 推荐：

  ```bash
  git restore --source=origin/<branch> -- path/to/file1 path/to/file2
  ```

- **老版本** 等价于：

  ```bash
  git checkout origin/<branch> -- path/to/file1 path/to/file2
  ```

这样只把指定文件恢复成远程版本，不影响其他文件，也不会自动提交。

---

### 4. 处理冲突与验收

1. **冲突解决**

   - 编辑冲突文件，清理标记，保留本地／远程／混合内容。
   - `git add <file>` 标记冲突已解决。

2. **测试 & 验证**

   - 合并后一定要运行已有测试、编译或手动验收，确保新旧改动配合正常。

3. **提交合并结果**

   - 如果是 `git merge`：冲突解决后直接 `git commit`。
   - 如果是 `cherry-pick`：解决后 `git cherry-pick --continue`。

---

### 5. 小贴士

- **预览合并结果**：
  在做正式 `merge` 前，可以试一个 “假合并”：

  ```bash
  git merge --no-commit --no-ff origin/<branch>
  ```

  如果结果不满意，用 `git merge --abort` 回退。

- **可视化工具**：
  可以用 `gitk`, `tig`, 或者 IDE/GUI（如 VSCode 的 Source Control 面板）来看 diff/解决冲突，更直观。

- **保留本地提交顺序**：
  如果你想在保留线性历史的前提下合并整个远程分支，推荐先 `rebase` 然后手动挑选冲突：

  ```bash
  git rebase origin/<branch>
  ```

  遇冲突同样逐文件解决，再 `git rebase --continue`。

---

现在我已经养成习惯了：先 fetch → review diff → 再按需 merge/cherry-pick/checkout，每一处远程改动都自己拍板，决定哪些拿进本地、哪些先放着。这样本地改动永远安全，远程的更新想吸收随时都能吸收。
