---
title: '如何在 niri 下进行屏幕共享'
date: '2026-11-05 15:03'
link: niri-screenshare
description: '总结一下我在 niri 下共享屏幕的解决方案'
tags:
  - 'archlinux'
  - 'niri'
  - 'screenshare'
  - 'wemeet'
  - 'dingtalk'
  - 'feishu'
  - 'sunshine'
  - 'tailscale'
  - 'moonlight'
categories:
  - 'ArchLinux'
---

## 总结一下我在 niri 下进行屏幕共享的方案

屏幕共享在很长时间一直都是 niri(wayland) 下的一个痛点，我也一直在寻找解决方案，现在总结下我现在的方案。

```bash
pacman -Qs niri
local/niri-shm-sharing 26.04-2
    A scrollable-tiling Wayland compositor with SHM/MemFd fallback patch for PipeWire screencasting
```

这是我之前给 niri 打的大佬提供的 patch，相关链接 [support-shm-sharing](https://forum.archlinuxcn.org/t/topic/16843)，该 patch 在 9 月 13 日已经 merge 入 niri-git 了。

可能涉及到的 portal（根据你的 DM/WM 检查和补充）：

```bash
pacman -Qs portal
local/libportal 0.11.0-1.1
    GIO-style async APIs for most Flatpak portals
local/libportal-gtk4 0.11.0-1.1
    GIO-style async APIs for most Flatpak portals - GTK 4 backend
local/xdg-desktop-portal 1.22.1-2.1
    Desktop integration portals for sandboxed apps
local/xdg-desktop-portal-gnome 51.0-1.1 (gnome)
    Backend implementation for xdg-desktop-portal for the GNOME desktop environment
local/xdg-desktop-portal-gtk 1.15.3-2.1
    A backend implementation for xdg-desktop-portal using GTK
local/xdg-desktop-portal-hyprland 1.5.0-1.1
    xdg-desktop-portal backend for hyprland
local/xdg-desktop-portal-kde 6.8.2-1.1 (plasma)
    A backend implementation for xdg-desktop-portal using Qt/KF5
local/xdg-desktop-portal-lxqt 1.4.0-1.1 (lxqt)
    A backend implementation for xdg-desktop-portal using Qt/KDE Frameworks/libfm-qt
local/xdg-desktop-portal-wlr 0.8.4-1.1
    xdg-desktop-portal backend for wlroots
```

### wemeet-bin

```bash
pacman -Qs wemeet
local/wemeet-bin 3.26.10.401-5
    Tencent Video Conferencing, tencent meeting 腾讯会议
local/wemeet-wayland-repair 0.1.0-2
    Tencent Wemeet 3.26.10.401 screen-sharing repair for Hyprland/wlr
```

另外也可以使用 flatpak 中 com.tencent.wemeet 的旧提交

```bash
# 换源，否则找不到那个提交
flatpak remote-modify flathub --url=https://mirrors.ustc.edu.cn/flathub
# 以 user 身份进行
flatpak install com.tencent.wemeet
flatpak update --commit=a43efff41927d4d630bf01d0b06b915496c863658c2e8d730989017cfbd5ff68 com.tencent.wemeet
```

相关链接：[wemeet-bin](https://aur.archlinux.org/packages/wemeet-bin)

### feishu

安装好 `feishu-bin` 和必要 portal 之后就已经可以在飞书中进行屏幕共享了，另外也可以使用网页版飞书进行屏幕共享（以加入者身份）

### dingtalk

```bash
pacman -Qs dingtalk
local/dingtalk-bin 8.1.0.6021101-1
    钉钉
local/dingtalk-wayland-screenshare-rust-git r5.59a6b7c-1
    Pure Rust rewrite of Wayland screensharing hook for DingTalk, zero-dependency drop-in replacement
```

### 其他

也可以通过内网穿透 + 远程串流，控制端 tailscale + moonlight，被控端 sunshine + tailscale，在 sunshine-WebUI中 可以设置串流时输入限制

### 鸣谢

感谢大佬的开源贡献！

- [wemeet-wayland-repire-aur](https://github.com/Horoaw/wemeet-wayland-repire-aur)
- [dingtalk-wayland-screenshare](https://github.com/cagedbird043/dingtalk-wayland-screenshare)
- [Support shm sharing](https://github.com/niri-wm/niri/pull/1791)
