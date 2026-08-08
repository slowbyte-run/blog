---
title: 'Arch 系统救急：live 盘 + btrfs 快照无痛回退'
date: '2025-11-11 23:19'
link: 'cnblogs-19211892'
description: 'Arch 系统无法进入时，用 live 盘配合 btrfs 快照在无法使用 timeshift 的情况下回退系统的步骤。'
tags:
  - 'archlinux'
categories:
  - 'ArchLinux'
---

当时我系统更新完直接进不去桌面，timeshift 又因为在原系统里根本没法启动而用不上，整个人是懵的。好在平时留了 btrfs 快照，我又有个 live 盘，折腾一圈把系统捞了回来。过程记录一下，给同样遇险的人参考。

## 制作 arch live 盘

工具： ventoy等制作启动盘的工具，archlinux的iso文件，usb等移动硬盘

## 具体操作

```bash
# 进入 live 环境之后，先挂载顶层字卷
sudo mount -o subvolid=5 /dev/nvme1n1p2 /mnt

# 用快照替换你的顶层字卷，@或者@root等，可用一列命令查看
findmnt -no SOURCE,OPTIONS /
# 下面以 @root 为例
# 用目标快照创建新的 @root
sudo btrfs subvolume snapshot /mnt/timeshift-btrfs/snapshots-daily/xxx/@ /mnt/@root

# 卸载并重启
sudo umount -R /mnt
reboot
```
