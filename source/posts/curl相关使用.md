---
title: curl——实用的网络传输工具
date: 2026-08-07 20:47
description: curl —— 一个功能强大的命令行网络传输工具，支持 HTTP/HTTPS/FTP 等多种协议
tags:
  - tools
  - curl
categories:
  - Tools
---

# curl 介绍与使用教程

> curl —— 一个功能强大的命令行网络传输工具，支持 HTTP/HTTPS/FTP 等多种协议
>
> 官方文档：<https://curl.se/docs/>
> 手册：<https://curl.se/docs/manpage.html>

---

## 目录

1. [curl 简介](#1-curl-简介)
2. [安装方式](#2-安装方式)
3. [基础用法](#3-基础用法)
4. [接口测试：请求方法](#4-接口测试请求方法)
5. [接口测试：请求头与参数](#5-接口测试请求头与参数)
6. [接口测试：JSON 与认证](#6-接口测试json-与认证)
7. [下载软件包](#7-下载软件包)
8. [高级下载与断点续传](#8-高级下载与断点续传)
9. [其他实用功能](#9-其他实用功能)
10. [与 jq 组合处理 JSON](#10-与-jq-组合处理-json)
11. [调试与排错](#11-调试与排错)
12. [常用命令速查表](#12-常用命令速查表)

---

## 1. curl 简介

### 什么是 curl

curl（Client URL）是一个用 C 语言编写的命令行网络传输工具，名字含义是"客户端 URL"。它是 Linux/macOS 系统自带的标准工具，几乎所有发行版都预装了它。curl 内置在 Linux、macOS 和 Windows 10+ 中，无需额外安装。

### 核心能力

| 能力         | 说明                                     |
| ------------ | ---------------------------------------- |
| **接口测试** | 发送 GET/POST/PUT/DELETE 等 HTTP 请求    |
| **文件下载** | 从 HTTP/FTP 服务器下载文件，支持断点续传 |
| **文件上传** | 通过 POST/上传表单等方式上传数据         |
| **多种协议** | HTTP、HTTPS、FTP、SFTP、SMTP 等 20+ 协议 |
| **认证支持** | Basic、Digest、Bearer Token、Cookie 等   |
| **脚本友好** | 命令行工具，方便在 Shell 脚本中使用      |
| **无交互**   | 非交互式，适合自动化任务                 |

### 与 wget 的对比

| 特性         | curl                    | wget          |
| ------------ | ----------------------- | ------------- |
| **协议支持** | 20+ 种                  | 主要 HTTP/FTP |
| **接口测试** | 支持（POST/JSON 等）    | 不支持        |
| **递归下载** | 不支持                  | 支持          |
| **输出控制** | 精细（可输出到 stdout） | 侧重文件下载  |
| **上传文件** | 支持                    | 弱            |

> **适用场景**：测试 API 接口、下载软件包用 curl；抓取整个网站目录用 wget。

### 常用版本查看

```bash
curl --version
# curl 8.21.0 (x86_64-pc-linux-gnu) ...
```

---

## 2. 安装方式

### 2.1 Linux（系统自带）

```bash
# Debian/Ubuntu
sudo apt install curl

# Arch Linux
sudo pacman -S curl

# Fedora
sudo dnf install curl
```

### 2.2 macOS

```bash
# macOS 自带，或用 Homebrew 更新
brew install curl
```

### 2.3 Windows

```powershell
# Windows 10+ 自带 curl.exe，或用包管理器安装
winget install curl
```

---

## 3. 基础用法

### 3.1 最简用法：获取页面内容

```bash
curl https://example.com
# 将 HTML 内容直接打印到终端
```

### 3.2 输出到文件

```bash
# -o：保存为指定文件名（不输出到终端）
curl -o index.html https://example.com

# 等价写法：-o 后面跟文件名
```

### 3.3 静默模式

```bash
# -s：静默模式，不显示进度条和错误信息
curl -s https://example.com

# -sS：静默但保留错误信息（推荐，出错时能看到原因）
curl -sS https://example.com
```

### 3.4 查看响应头

```bash
# -i：同时显示响应头（header）和响应体（body）
curl -i https://example.com

# -I：只显示响应头（等价于 HEAD 请求）
curl -I https://example.com
```

### 3.5 不输出任何内容（只检查连通性）

```bash
# -o /dev/null：丢弃响应体；-w 输出状态码
curl -s -o /dev/null -w "%{http_code}\n" https://example.com
# 输出：200
```

---

## 4. 接口测试：请求方法

### 4.1 GET 请求（默认）

```bash
curl https://api.example.com/users
```

### 4.2 POST 请求

```bash
# -X：指定请求方法
curl -X POST https://api.example.com/users

# 带请求体（-d 默认就是 POST，可省略 -X POST）
curl -d "name=zhangsan&age=18" https://api.example.com/users
```

### 4.3 PUT / DELETE / PATCH

```bash
curl -X PUT https://api.example.com/users/1
curl -X DELETE https://api.example.com/users/1
curl -X PATCH https://api.example.com/users/1
```

> **注意**：`-X POST` 后如果没有 `-d`，则请求体为空。`-d` 会自动把方法设为 POST，也会自动加 `Content-Type: application/x-www-form-urlencoded`。

---

## 5. 接口测试：请求头与参数

### 5.1 设置请求头

```bash
# -H：设置单个请求头，可多次使用
curl -H "Accept: application/json" \
     -H "User-Agent: Mozilla/5.0" \
     https://api.example.com/users
```

### 5.2 URL 查询参数

```bash
# 直接拼在 URL 后面
curl "https://api.example.com/users?page=1&size=10"

# 或用 -G + --data-urlencode 自动编码（避免特殊字符问题）
curl -G https://api.example.com/users \
     --data-urlencode "keyword=spring boot" \
     --data-urlencode "page=1"
```

### 5.3 表单数据

```bash
# 表单编码（application/x-www-form-urlencoded）
curl -d "username=admin&password=123456" https://api.example.com/login

# 文件作为表单字段上传（multipart/form-data）
curl -F "file=@./report.pdf" \
     -F "remark=月度报告" \
     https://api.example.com/upload
```

### 5.4 Cookie

```bash
# 发送 Cookie
curl -H "Cookie: sessionid=abc123" https://api.example.com/me

# 或使用 -b：从字符串或文件读取 Cookie
curl -b "sessionid=abc123" https://api.example.com/me
curl -b cookies.txt https://api.example.com/me

# -c：把服务器返回的 Set-Cookie 保存到文件（模拟登录保持会话）
curl -c cookies.txt -d "username=admin&password=123456" https://api.example.com/login
curl -b cookies.txt https://api.example.com/me
```

---

## 6. 接口测试：JSON 与认证

### 6.1 发送 JSON 请求

```bash
# -H 设置 Content-Type，-d 传 JSON 字符串
curl -X POST https://api.example.com/users \
     -H "Content-Type: application/json" \
     -d '{"name": "zhangsan", "age": 18}'

# 从文件读取 JSON（大数据时更清晰）
curl -X POST https://api.example.com/users \
     -H "Content-Type: application/json" \
     -d @user.json
```

### 6.2 Basic 认证

```bash
# -u：用户名:密码，自动加 Authorization: Basic 头
curl -u admin:123456 https://api.example.com/admin

# 不写密码会交互式提示输入（更安全）
curl -u admin https://api.example.com/admin
```

### 6.3 Bearer Token（JWT）

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     https://api.example.com/me
```

### 6.4 简化写法

```bash
# curl 8.x 支持 -J 自动识别，或用简写
curl -X POST ...

# 常用简写对照（curl 支持单字母短选项）
# -H 等价 --header，-d 等价 --data，-X 等价 --request
```

---

## 7. 下载软件包

### 7.1 下载并保存为服务器文件名

```bash
# -O：大写 O，使用 URL 中的文件名保存
curl -O https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/Anaconda3-2024.10-1-Linux-x86_64.sh
```

### 7.2 下载并指定文件名

```bash
# -o：小写 o，自定义文件名
curl -o jdk-21.tar.gz https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.tar.gz
```

### 7.3 跟随重定向（重要）

```bash
# -L：跟随 301/302 重定向，下载时几乎必须加
curl -L -O https://github.com/git/git/archive/refs/tags/v2.47.0.tar.gz

# GitHub 的 release 下载都经过重定向，不加 -L 只会下载到跳转页
```

### 7.4 下载带文件名 + 重定向

```bash
# -LO 是下载软件包最常用的组合
curl -LO https://nodejs.org/dist/v22.11.0/node-v22.11.0-linux-x64.tar.xz
```

### 7.5 批量下载

```bash
# 多 URL 下载（会保存各自的文件名）
curl -O https://example.com/a.tar.gz -O https://example.com/b.tar.gz

# 配合 xargs 从文件列表批量下载
cat urls.txt | xargs -n1 -P4 curl -O
```

---

## 8. 高级下载与断点续传

### 8.1 断点续传

```bash
# -C -：从上次中断的地方继续下载（大文件下载必备）
curl -C - -O https://mirrors.aliyun.com/ubuntu-releases/24.04/ubuntu-24.04-live-server-amd64.iso
```

### 8.2 限制下载速度

```bash
# --limit-rate：限制速度为 500KB/s
curl --limit-rate 500K -O https://example.com/big.iso
```

### 8.3 下载多个文件（curl 8.x）

```bash
# --parallel：并行下载多个 URL
curl --parallel -O https://example.com/a.iso -O https://example.com/b.iso

# 默认串行；--parallel-max 控制并行数
curl --parallel-max 3 --parallel -O url1 -O url2
```

### 8.4 代理下载（加速/翻墙场景）

```bash
# -x：指定代理服务器
curl -x http://127.0.0.1:7890 -O https://github.com/xxx/repo/releases/download/v1.0/app.tar.gz

# 或者从环境变量读取代理
export https_proxy=http://127.0.0.1:7890
curl -O https://github.com/xxx/app.tar.gz
```

### 8.5 跳过证书校验（仅限测试环境）

```bash
# -k：跳过 SSL 证书校验（自签名证书时用，注意安全）
curl -k https://self-signed.example.com/api

# 指定自定义 CA 证书
curl --cacert /path/to/ca.crt https://example.com
```

---

## 9. 其他实用功能

### 9.1 超时控制

```bash
# --connect-timeout：连接超时（秒）
# -m：总超时时间（秒），防止命令卡死
curl -m 10 --connect-timeout 3 https://api.example.com/slow-api

# 示例：脚本中请求超时自动失败
if curl -s -m 5 -o /dev/null https://api.example.com/health; then
  echo "服务正常"
else
  echo "服务异常"
fi
```

### 9.2 查看耗时统计

```bash
# -w：输出自定义信息，\n 换行
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\nDNS解析: %{time_namelookup}s\n连接时间: %{time_connect}s\nTLS握手: %{time_appconnect}s\n总耗时: %{time_total}s\n" \
     https://api.example.com
```

### 9.3 上传文件

```bash
# 二进制上传（POST 原始数据）
curl -X POST --data-binary @local.zip https://api.example.com/upload

# PUT 上传（覆盖式上传文件）
curl -X PUT -T local.zip https://api.example.com/files/remote.zip
```

### 9.4 网页快照/调试输出

```bash
# --trace-ascii：记录完整请求/响应到文件
curl --trace-ascii trace.txt https://api.example.com

# 或简写 -v：输出详细交互过程（开发时最常用）
curl -v https://api.example.com
```

### 9.5 重试机制

```bash
# --retry：失败自动重试次数；--retry-delay：重试间隔
curl --retry 3 --retry-delay 2 -O https://example.com/flaky.tar.gz
```

### 9.6 测试负载均衡/多 IP

```bash
# --resolve：强制解析到指定 IP（绕过 DNS，测试多节点）
curl --resolve api.example.com:443:127.0.0.1 https://api.example.com/api
```

### 9.7 发送 HEAD 请求检查资源是否存在

```bash
# 检查链接是否有效
curl -s -o /dev/null -w "%{http_code}\n" -I https://example.com/nonexist
# 输出：404
```

---

## 10. 与 jq 组合处理 JSON

### 10.1 基础管道

```bash
# curl 输出 JSON 后用 jq 格式化/筛选
curl -s https://api.example.com/users | jq .
```

### 10.2 实战：提取字段

```bash
# 提取 id 和 name
curl -s https://api.example.com/users | jq '.data[] | {id: .id, name: .name}'

# 按字段过滤
curl -s https://api.example.com/users | jq '.data[] | select(.age > 18)'
```

### 10.3 实战：请求→提取→再请求

```bash
# 先登录拿 token，再带 token 请求（模拟真实业务）
TOKEN=$(curl -s -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}' | jq -r '.token')

curl -s -H "Authorization: Bearer $TOKEN" https://api.example.com/me | jq .
```

> jq 是 JSON 处理神器，安装：`sudo apt install jq` / `sudo pacman -S jq`，详见 `tools/` 目录中相关笔记。

---

## 11. 调试与排错

### 11.1 详细输出（-v）

```bash
# 显示请求头、响应头、TLS 握手等完整过程
curl -v https://api.example.com

# 输出解读：
# > 表示发出的请求信息
# < 表示接收到的响应信息
# * 表示 curl 的内部处理信息
```

### 11.2 只看请求（模拟发送）

```bash
# --trace-ascii /dev/stdout 可查看实际发送的字节
curl --trace-ascii /dev/stdout -d "name=test" https://api.example.com > /dev/null
```

### 11.3 常见错误排查

| 错误                      | 原因             | 解决办法                          |
| ------------------------- | ---------------- | --------------------------------- |
| `Could not resolve host`  | DNS 解析失败     | 检查域名拼写、网络、DNS           |
| `Connection timed out`    | 连接超时         | 加 `-m` 超时、检查端口/防火墙     |
| `SSL certificate problem` | 证书校验失败     | 使用正规 CA 证书，或测试环境 `-k` |
| `HTTP 301/302` 未跳转     | 没加 `-L`        | 加 `-L` 跟随重定向                |
| `HTTP 403 Forbidden`      | 缺少认证/Cookie  | 检查 UA、Cookie、Token            |
| 下载的网页不是文件        | 服务器返回跳转页 | 加 `-L`，或检查 URL               |

---

## 12. 常用命令速查表

| 功能                   | 命令                                                                  |
| ---------------------- | --------------------------------------------------------------------- |
| 测试 GET 接口          | `curl https://api.example.com/users`                                  |
| 测试 POST 接口         | `curl -X POST -d "key=value" https://api.example.com`                 |
| 发送 JSON              | `curl -X POST -H "Content-Type: application/json" -d '{"k":"v"}' url` |
| 发送认证 Token         | `curl -H "Authorization: Bearer <token>" url`                         |
| 带 Cookie 访问         | `curl -b cookies.txt url`                                             |
| 下载软件包（自动命名） | `curl -LO <url>`                                                      |
| 断点续传               | `curl -C - -O <url>`                                                  |
| 跟随重定向下载         | `curl -L -O <url>`                                                    |
| 限制下载速度           | `curl --limit-rate 500K -O <url>`                                     |
| 走代理下载             | `curl -x http://127.0.0.1:7890 -O <url>`                              |
| 静默获取状态码         | `curl -s -o /dev/null -w "%{http_code}" url`                          |
| 只查看响应头           | `curl -I url`                                                         |
| 详细调试               | `curl -v url`                                                         |
| 设置超时               | `curl -m 10 --connect-timeout 3 url`                                  |
| 失败重试               | `curl --retry 3 --retry-delay 2 -O url`                               |
| JSON + jq 解析         | `curl -s url                                                          | jq .` |
| 上传文件               | `curl -F "file=@local.zip" url`                                       |
