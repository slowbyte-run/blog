---
title: '电脑使用ssh连接termux'
date: '2025-08-03 16:11'
link: 'cnblogs-19020181'
description: '在 Termux 中搭建 SSH 服务端，让电脑通过 SSH 连接手机终端。'
tags:
  - 'tools'
  - 'termux'
categories:
  - 'Tools'
---

**思路**：在 Termux 上搭建 SSH 服务端，你电脑作为客户端通过 SSH 登录手机的 Termux，实现命令行操作。

### 步骤

#### 1\. 在 Termux 安装 SSH 服务器

```bash
pkg update
pkg install openssh
```

#### 2\. 启动 SSH 服务器

```bash
sshd
```

#### 3\. 查看手机的 IP 地址

```bash
ip addr show
# 或者 ifconfig
```

> 假设你看到 wlan0 下有 `192.168.1.5` 这样的 IP。

#### 4\. 设置 SSH 登录密码（建议做一次）

```bash
passwd
```

#### 5\. 电脑端用 ssh 命令连接手机

```bash
ssh <用户名>@<手机IP地址> -p 8022
```

**注意**：Termux 默认的 SSH 端口是 `8022`。用户名一般是 `u0_a数字` 这样的，执行 `whoami` 可得。

**例子：**

```bash
ssh u0_a123@192.168.1.5 -p 8022
```
