---
title: 'wget、curl、aria2c：下载工具怎么选'
date: 2026-11-05
description: '三个命令行下载工具的分工、常用参数和踩坑点，附可直接复制的示例。'
link: 'wget-curl-aria2c'
tags:
  - tools
  - wget
  - curl
  - aria2
categories:
  - Tools
---

装完系统第一件事往往是拉个文件。`wget`、`curl`、`aria2c` 都能干这事，但用错了会白等半小时：抓整站拿 curl 手搓循环，或者下 4K 镜像只开一个连接。

先给结论：

| 场景                      | 用哪个               |
| ------------------------- | -------------------- |
| 下一个普通文件            | `wget` 或 `curl -LO` |
| 调接口、看响应头、发 JSON | `curl`               |
| 镜像整站、离线文档        | `wget`               |
| 大文件、跨境慢速链路      | `aria2c -x 16 -s 16` |
| 按列表批量下、要限并发    | `aria2c -i urls.txt` |
| BT 种子 / 磁力链          | `aria2c`             |

## wget：稳，适合抓站

`wget` 的定位是"无人值守地下载"。断线自动重试，递归抓取，几乎每个发行版都预装。

```bash
# 下载，保存为同名文件
wget https://example.com/file.tar.gz

# 指定名字、指定目录
wget -O rust.tar.gz https://example.com/file
wget -P ./downloads https://example.com/a.zip

# 断点续传：大文件被中断后接着下
wget -c https://example.com/big.iso

# 批量下载，一行一个 URL
wget -i urls.txt -P ./downloads

# 限速 2MB/s，超时 10s，失败重试 3 次
wget --limit-rate=2m --timeout=10 --tries=3 -c https://example.com/big.iso

# 丢后台跑，日志写到 wget-log
wget -b -c https://example.com/big.iso

# 证书有问题时临时跳过校验
wget --no-check-certificate https://example.com/file
```

抓整站是它最不可替代的地方：

```bash
# 镜像站点：递归 + 不爬上级目录 + 转换链接 + 下载页面所需资源
wget -m -np -k -p https://docs.example.com/

# 只抓某一层，避免被索引页拖进无限循环
wget -r -l 2 -np -k -E https://docs.example.com/
```

`-m` 等价于 `-r -N -l inf --no-remove-listing`，`-k` 把页面里的链接改成本地路径，`-p` 连图片、CSS、JS 一起拉。没有 `-np` 很容易从子页面爬回根目录再爬一遍。

## curl：不只是下载

`curl` 真正的价值在 HTTP 调试。下载只是顺手能做的事，更细的用法我另写过一篇（[curl 实战速查](/blog/post/curl-guide)），这里只留下载相关的。

```bash
# 下载，自动用远端文件名
curl -LO https://example.com/file.zip

# 跳转链接必须加 -L，否则存下来的是 302 页面
curl -L -o out.zip https://example.com/download?id=123

# 断点续传
curl -C - -O https://example.com/big.iso

# 静默下载 + 失败重试（-sS 静默但保留报错）
curl -sS --retry 3 --retry-delay 2 -C - -O https://example.com/big.iso

# 限速、走代理
curl --limit-rate 2M -O https://example.com/big.iso
curl -x http://127.0.0.1:7890 -O https://example.com/big.iso
```

接口调试才是主场：

```bash
# 只看状态码
curl -s -o /dev/null -w '%{http_code}\n' https://example.com

# 带 Token 发 JSON
curl -X POST https://api.example.com/v1/items \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"name":"test"}'

# 上传文件
curl -F 'file=@archive.zip' https://api.example.com/upload
```

curl 7.66 之后支持 `-Z` 并行拉多个 URL，但它是"多文件并发"，不是"单文件多连接"，单文件加速还是得靠 aria2。

```bash
curl -Z -O https://example.com/a.zip -O https://example.com/b.zip
```

## aria2c：大文件和多来源

`aria2c` 的卖点是单文件多连接、多协议（HTTP/HTTPS/FTP/SFTP/BT/Metalink），以及一个能挂远程控制的 RPC。

```bash
# 16 个连接切同一文件，每块最小 1M
aria2c -x 16 -s 16 -k 1M https://example.com/big.iso

# 断点续传 + 指定目录和文件名
aria2c -c -x 16 -s 16 -d ~/Downloads -o ubuntu.iso https://example.com/ubuntu.iso

# 从列表批量下，同时最多 5 个任务
aria2c -i urls.txt -j 5 -x 16 -s 16

# 限速、最多试 5 次、间隔 3 秒
aria2c --limit-rate=2M --max-tries=5 --retry-wait=3 -c https://example.com/big.iso

# 证书不受信时
aria2c --check-certificate=false https://example.com/file
```

BT 和磁力链直接喂给它：

```bash
aria2c file.torrent
aria2c 'magnet:?xt=urn:btih:xxxxxxxx'
aria2c --seed-time=0 'magnet:?...'   # 下完不做种
```

需要长期挂着下载时，开 RPC，用 AriaNg 之类的网页前端管任务：

```bash
aria2c --enable-rpc --rpc-listen-all=false --rpc-listen-port=6800 \
  --rpc-secret=your-token --save-session=/tmp/aria2.session
```

`--save-session` 配合 `-i` 能把没下完的任务在重启后接上，比手工记 URL 靠谱。

## 对比

| 维度         | wget               | curl                | aria2c              |
| ------------ | ------------------ | ------------------- | ------------------- |
| 单文件多连接 | 不支持             | 不支持              | 支持（`-x` / `-s`） |
| 断点续传     | `-c`               | `-C -`              | `-c`                |
| 递归 / 镜像  | 支持（`-m`、`-r`） | 不支持              | 不支持              |
| 批量列表     | `-i`               | 多 URL 或 `-Z` 并行 | `-i` + `-j` 控并发  |
| HTTP 调试    | 弱                 | 强                  | 基本没有            |
| BT / 磁力    | 不支持             | 不支持              | 支持                |
| 远程控制     | 无                 | 无                  | JSON-RPC + Web UI   |
| 装上就能用   | 是                 | 是                  | 需另装              |

## 几个坑

**`curl -O` 忘了 `-L`**。跳转链接会把 302 响应体存成文件，打开一看是几行 HTML。

**aria2 的 `-x` 不是越大越好**。单服务器上限 16，很多站点反而会因为你并发过高返回 403/429。遇到这种情况降到 `-x 4` 再试。

**磁盘空间被预占**。aria2 默认预分配文件空间，小磁盘或网络文件系统上可能直接卡住，加 `--file-allocation=none`。

**断点续传要看服务器脸色**。`-c`、`-C -` 都依赖服务端支持 `Range`。如果日志里显示从 0 重新开始，那就是服务端没给 206。

**RPC 别裸奔**。`--rpc-listen-all` 且没有 `--rpc-secret`，等于把下载器交给整个局域网。

## 收尾

日常下一个文件，`wget -c` 够用；要调接口或者拼请求，curl 更顺手；碰上大文件慢链路，或者一次几十个 URL，直接上 aria2c。三个都装着不冲突，按场景换就行。
