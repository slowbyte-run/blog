---
title: 'git 重建后连不上远程仓库？冲突这样解决'
date: '2025-05-13 16:55'
link: 'cnblogs-18874306'
description: '解决重建本地仓库后重新连接远程仓库时的冲突。'
tags:
  - 'git'
categories:
  - 'Git'
---

# **情形**

当时我把本地仓库整个删了重建，折腾完想再连回原来的远程仓库，结果 `push` 各种报错、冲突不断。说白了就是本地历史和远程历史已经分道扬镳，Git 以为这是两个互不相干的仓库。解决办法不复杂：把远程拉下来合并。下面是我当时的操作步骤，跟着走就行。

# **解决办法**

---

## ✅ 操作步骤如下：

### 1\. 打开项目文件夹，并初始化 Git（如果还没初始化）

```bash
cd your_project_folder
git init
```

### 2\. 添加远程仓库地址

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

你可以通过下面命令确认是否成功：

```bash
git remote -v
```

### 3\. 添加所有文件并提交

```bash
git add .
git commit -m "Initial commit from Qt Creator project"
```

### 4\. 拉取远程仓库的主分支（如果有 `README.md` 或其他文件，防止冲突）

你需要把远程仓库内容合并到本地，推荐做法是先拉取下来：

```bash
git pull origin main --allow-unrelated-histories
```

> 如果你的默认分支叫 `master`，就用：

```bash
git pull origin master --allow-unrelated-histories
```

这一步可能会提示冲突，比如 `README.md`，你可以按提示解决冲突(比如`git pull --rebase origin main`)，再进行提交：

```bash
git add .
git commit -m "Resolve merge conflicts"
```

### 5\. 最后推送到 GitHub

```bash
git push origin main
```

或（如果是 master 分支）：

```bash
git push origin master
```

---

## 🔁 总结一下流程：

```bash
cd your_qt_project_folder
git init
git remote add origin https://github.com/your_username/your_repo.git
git add .
git commit -m "Initial commit"
git pull origin main --allow-unrelated-histories   # 如果默认分支是main
# 解决冲突后继续
git push origin main
```
