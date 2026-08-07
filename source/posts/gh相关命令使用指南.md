---
title: 'GitHub CLI 实战指南：从安装到常用命令'
date: '2025-06-13 19:46'
link: 'cnblogs-18927584'
description: 'GitHub CLI（gh）的安装配置与常用命令使用指南。'
tags:
  - 'git'
  - 'gh'
categories:
  - 'Git'
---

下面我将从安装与配置、核心命令分类、示例演示以及进阶用法四个方面，系统地介绍 GitHub 官方命令行工具 `gh` 的使用方法。

---

## 一、安装与初始化

1.  **安装方式**

    - **macOS**（Homebrew）：

```bash
brew install gh
```

    -   **Windows**（scoop 或 Chocolatey）：

```powershell
scoop install gh
# 或
choco install gh
```

    -   **Linux**（apt/yum 或下载二进制包）：

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install gh
# CentOS/Fedora
sudo dnf install gh
```

    也可访问 [https://github.com/cli/cli/releases](https://github.com/cli/cli/releases) 下载对应平台的二进制压缩包。

2. **首次登录**

```bash
gh auth login
```

    会提示选择 GitHub.com 还是 Enterprise，接着可选浏览器自动登录或手动输入 Token。完成后可用：

```bash
gh auth status
```

    检查登录状态。

---

## 二、仓库（Repository）操作

1.  **克隆仓库**

```bash
gh repo clone owner/repo
# 例如
gh repo clone cli/cli
```

2.  **创建新仓库**

```bash
gh repo create my-project \
  --public \
  --description "我的项目描述"
```

    可选 `--private` 或 `--internal`。

3. **查看仓库信息**

```bash
gh repo view [owner/]repo [--web]
```

    加 `--web` 则在浏览器打开。

4. **Fork 仓库**

```bash
gh repo fork owner/repo --clone=true
```

    自动将 Fork 完成并克隆到本地。

---

## 三、Issue 与 Pull Request 管理

### 1\. Issue

- **列出 Issue**

```bash
gh issue list [--state open|closed|all] [--label bug]
```

- **新建 Issue**

```bash
gh issue create \
  --title "Bug: 登录失败" \
  --body "在输入用户名后，界面无响应。\n重现步骤：..." \
  --label bug,help-wanted
```

- **查看单个 Issue**

```bash
gh issue view 123 --web
```

    加 `--json` 可以输出 JSON。

### 2\. Pull Request

- **列出 PR**

```bash
gh pr list [--state open|closed|merged]
```

- **创建 PR**

```bash
# 假设当前在 feature 分支
gh pr create \
  --base main \
  --head feature-branch \
  --title "添加登陆功能" \
  --body "实现了 OAuth2 登录流程"
```

- **检查 & 合并 PR**

```bash
gh pr checkout 45      # 切换到 PR 分支
gh pr merge 45 --merge  # 使用 merge 策略合并
```

    合并策略还可选 `--squash` 或 `--rebase`。

---

## 四、Gist、Workflow 与插件

1.  **Gist 操作**

    - 列出自己的 Gist：

```bash
gh gist list
```

    -   创建 Gist：

```bash
gh gist create file1.txt file2.txt \
  --public \
  --desc "一些代码片段"
```

2.  **Actions Workflow**

    - 查看运行记录：

```bash
gh run list
```

    -   查看某次运行详情：

```bash
gh run view <run-id> --log
```

    -   重新触发 workflow：

```bash
gh run rerun <run-id>
```

3.  **插件与别名**

    - 安装插件（community 插件）：

```bash
gh extension install dlvhdr/gh-dash
gh dash            # 使用插件
```

    -   定义别名：编辑 `~/.config/gh/config.yml`，添加：

```yaml
aliases:
  co: pr checkout
  pc: pr create
```

        之后即可 `gh co 45` 快速切换到 PR 45。

4. **获取帮助**

```bash
gh help          # 列出所有命令
gh <category> --help  # 如 gh pr --help
```

---

## 五、示例：提交流程

```bash
# 1. 克隆仓库并新建分支
gh repo clone myname/myrepo
cd myrepo
git checkout -b feature/login

# 2. 编码、提交并推送
git add .
git commit -m "feat: 实现登录模块"
git push --set-upstream origin feature/login

# 3. 创建 PR
gh pr create \
  --base main \
  --title "feat: 登录模块" \
  --body "实现了用户登录和会话管理功能"

# 4. 审查、合并（review 后）
gh pr merge --squash
```

---

以上即为 `gh` 命令行工具的核心使用指南，涵盖了安装配置、仓库/Issue/PR 管理，以及进阶插件与别名。掌握这些，即可大幅提升在终端中与 GitHub 交互的效率。若需更深入的定制，建议阅读官方文档或安装社区插件。
