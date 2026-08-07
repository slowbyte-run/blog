---
title: 'Linux中常用的查找文件和文件夹的方法'
date: '2025-07-05 15:59'
link: 'cnblogs-18967362'
description: '整理 Linux 下 find 等常用查找文件与目录的命令及用法。'
tags:
  - 'tools'
  - 'linux'
categories:
  - 'Tools'
---

## 1\. `find` 命令（最通用最强大）

`find` 是 Linux 下查找文件和目录的终极利器。用法灵活，支持递归、条件过滤、正则、执行操作等。

- **查找名为 file.txt 的文件：**

```bash
find /path/to/search -name "file.txt"
```

    例：在全盘查找

```bash
find / -name "file.txt"
```

- **查找名为 myfolder 的文件夹：**

```bash
find /path/to/search -type d -name "myfolder"
```

- **查找所有以 .conf 结尾的文件：**

```bash
find /etc -type f -name "*.conf"
```

- **查找并显示详细路径：**

```bash
find $HOME -name "*.pdf"
```

---

## 2\. `locate` 命令（速度最快，适合频繁查找）

`locate` 利用数据库，查找极快。首次需要更新数据库：

- **安装：**

```bash
sudo pacman -S mlocate
sudo updatedb
```

- **使用：**

```bash
locate file.txt
locate myfolder
locate '*.pdf'
```

> 注意：`locate` 查到的是之前数据库里记录的，**新文件请先 `sudo updatedb` 刷新数据库**。

---

## 3\. `fd` 命令（更友好、现代化、输出美观）

`fd` 是现代化的 find 替代品，支持彩色输出、忽略 .gitignore、语法简单。

- **安装：**

```bash
sudo pacman -S fd
```

    （用命令叫 `fd`，有时是 `fdfind`）

- **用法示例：**

```bash
fd file.txt      # 在当前目录递归查找文件
fd myfolder -t d  # 只查找名为myfolder的目录
fd '\.pdf$'      # 查找所有 pdf 文件
```

---

## 4\. `find` + `grep` 联合查找（查内容或复杂匹配）

- **查找包含特定内容的文件：**

```bash
find . -type f -name "*.c" | xargs grep "main"
```

---

## 5\. `ranger` 文件管理器（交互式，支持模糊查找）

- **安装：**

```bash
sudo pacman -S ranger
```

- **运行后按 `/` 输入关键字查找**

---

## 总结推荐

- **最通用、最稳妥**：`find`
- **最快速**：`locate`
- **最美观现代**：`fd`
- **最简单GUI**：`ranger`

---

### 你可以直接复制以下命令尝试（以查找`test.py`为例）：

```bash
find ~ -name "test.py"
locate test.py
fd test.py ~
```

---

## 模糊查找

---

### 1\. 用 `find` 结合通配符（支持\*、?等）

- **查找包含关键字的文件（比如查找名字里有 "test" 的所有文件）：**

```bash
find /path/to/search -type f -name "*test*"
```

    例如在家目录下递归查找名字含有“data”的文件：

```bash
find ~ -type f -name "*data*"
```

---

### 2\. 用 `fd` 命令（推荐，支持模糊/正则）

- **查找名字中含有"data"的文件：**

```bash
fd data
```

    这会在当前目录递归查找所有文件名里含有“data”的条目（文件和目录）。

- **只查找文件夹：**

```bash
fd data -t d
```

- **正则查找所有以“data”结尾的文件：**

```bash
fd 'data$'
```

---

### 3\. 用 `locate` 配合正则或通配符（模糊但是基于索引）

- **查找包含"test"的所有文件和文件夹：**

```bash
locate test
```

    或使用通配符（注意引号）：

```bash
locate '*test*'
```

---

### 4\. 交互式模糊查找：`fzf`（终极推荐！）

`fzf` 是一款模糊查找神器，尤其适合大量文件时，**实时模糊筛选**，体验极佳。

- **安装：**

```bash
sudo pacman -S fzf
```

- **基本用法：**

```bash
find . -type f | fzf
```

    上面这条命令会把当前目录下所有文件管道到 `fzf`，你可以直接输入关键字模糊筛选，回车选中即可。

- **直接查找所有文件并模糊匹配（全盘）：**

```bash
locate "" | fzf
```

---

### 5\. `ranger` 文件管理器内置模糊查找

- 打开 ranger，直接按 `/`，输入模糊关键字，实时跳转查找。

---

#### 总结一句话

- 想**命令行模糊查找**：用 `fd 关键字` 或 `find ~ -name "*关键字*"`
- 想**交互模糊查找**：用 `fzf`（推荐，极快极爽！）

---

**补充小技巧：**

- 大部分现代 shell（如 zsh）也有内置模糊补全，查文件很方便。
- 组合 `fd | fzf`，就是终极文件模糊查找！

---

如需具体用法举例或结合其他操作，请告诉我你的实际场景！
