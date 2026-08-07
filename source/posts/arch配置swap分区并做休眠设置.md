---
title: Arch Linux 配置 Swap 分区并启用休眠
date: 2025-11-15 16:01
description: 双系统下为 Arch 单独划分 Swap 分区，并配置 GRUB / systemd-boot 与 initramfs 以支持休眠。
link: arch-swap-hibernate
tags:
  - archlinux
  - swap
  - 休眠
categories:
  - ArchLinux
  - SystemConfig
---

# Arch Linux 配置 Swap 分区并启用休眠

---

## 一、为什么不能直接用 zram 休眠

我的双系统机器原本的 Swap 是 `zram0`。zram 是一个**驻留在内存里的压缩块设备**，它没有真实的落盘数据——一旦断电，里面的内容就全部丢失。而休眠（suspend-to-disk）需要把内存镜像写入一个**断电后依然存在**的存储位置，所以 zram 无法承担休眠的职责。

> 补充：有人以为是因为 zram 的 UUID 每次启动都会变化。其实根因是它压根没有稳定的磁盘存储，重启后镜像就没了；UUID 变化只是表面现象。

因此需要单独划出一块真实磁盘分区作为 Swap。

## 二、创建 Swap 分区

先用磁盘管理工具（`fdisk` / `cfdisk` / `parted` 等）分出一块分区，**大小建议不小于内存容量**（休眠要写入整个内存镜像，Swap 比内存小会导致休眠失败或只能 `hibernate=shutdown` 强行关机）。

假设新分区是 `/dev/nvme1n1p4`（请替换为你的实际设备）：

```bash
# 1. 关闭当前所有 Swap（mkswap 不能对正在使用的 swap 操作）
sudo swapoff -a

# 2. 格式化为 swap 分区
sudo mkswap /dev/nvme1n1p4

# 3. 查出这块分区的 UUID，后面 fstab 和内核参数都要用它
sudo blkid /dev/nvme1n1p4
```

记下 `blkid` 输出的 UUID，例如 `72a4a6d5-4782-4f25-a027-ba90ffb4de1c`。

## 三、写入 fstab 开机自动启用

编辑 `/etc/fstab`，在末尾追加一行（UUID 换成你查到的实际值）：

```text
UUID=72a4a6d5-4782-4f25-a027-ba90ffb4de1c  none  swap  defaults  0  0
```

如果你之前用的是 swap 文件（比如 `/swap/swap.img`），顺手把它在 fstab 里注释掉，避免冲突：

```text
# /swap/swap.img  none  swap  defaults  0  0
```

然后测试配置是否正常：

```bash
sudo swapoff -a      # 先全部关闭，重新走一遍 fstab 逻辑
sudo mount -a        # 校验 fstab 是否有语法/挂载错误
sudo swapon -a       # 按 fstab 启用 swap
swapon --show        # 确认能列出你新建的 swap 分区
```

`swapon --show` 里出现刚才那块分区（UUID 一致）即说明配置成功。

## 四、配置内核参数 resume

休眠恢复时，内核需要一个 `resume=UUID=...` 参数告诉它"从哪块设备读回内存镜像"。**这里填的就是 swap 分区的 UUID。**

### 4.1 GRUB

```bash
sudo vim /etc/default/grub
```

把 `GRUB_CMDLINE_LINUX_DEFAULT` 里加上 `resume=UUID=...`：

```text
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet resume=UUID=72a4a6d5-4782-4f25-a027-ba90ffb4de1c"
```

保存后重新生成引导配置：

```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

### 4.2 systemd-boot

编辑入口文件（常见路径 `/boot/loader/entries/arch.conf`，文件名按你的发行版安装方式可能略有不同，结构大致如下）：

```text
title   Arch Linux
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=UUID=... rw quiet loglevel=3
```

在 `options` 这一行末尾追加 `resume=UUID=...`：

```text
options root=UUID=... rw quiet loglevel=3 resume=UUID=72a4a6d5-4782-4f25-a027-ba90ffb4de1c
```

> 用哪个引导器取决于你的安装方式：BIOS 通常是 GRUB，UEFI 系统既可能用 GRUB 也可能用 systemd-boot，按上面二选一即可。

## 五、在 initramfs 中加入 resume hook

修改 `/etc/mkinitcpio.conf`，在 `udev` 后面加上 `resume`：

```bash
sudo vim /etc/mkinitcpio.conf
```

```text
HOOKS=(base udev resume autodetect modconf block keyboard filesystems fsck)
```

重新生成 initramfs：

```bash
sudo mkinitcpio -P
```

> 注意：`resume` 必须放在 `udev` 之后、`filesystems` 之前，顺序错了可能导致恢复镜像时找不到分区。

## 六、验证休眠

全部配置完后，直接测试一次：

```bash
systemctl hibernate
```

机器应正常挂起并断电；重新开机后应恢复到休眠前的桌面会话，而不是冷启动。

## 七、常见问题

- **`resume_offset` 是什么？** 只有用 **swap 文件**（而不是 swap 分区）时才需要额外配置 `resume_offset=...`；本教程用的是 swap 分区，无需此项。
- **休眠失败或直接关机**：多半是 Swap 分区小于内存容量，或 `resume=UUID` 填错 / initramfs 没重新生成。
- **想改用 swap 文件**：可以新建 `/swapfile`，fstab 用 `none swap defaults 0 0`，此时必须为内核参数补上 `resume_offset`（用 `filefrag -v /swapfile` 查 offset 换算扇区数）。
