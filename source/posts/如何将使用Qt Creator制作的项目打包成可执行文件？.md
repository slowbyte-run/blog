---
title: '如何将使用Qt Creator制作的项目打包成可执行文件？'
date: '2025-05-11 14:30'
link: 'cnblogs-18870773'
description: '以音乐播放器为例，在 Arch 上把 Qt Creator 项目打包成可执行文件。'
tags:
  - 'tools'
  - 'qt'
categories:
  - 'Tools'
---

## 前言

本篇文章以使用**Qt Creator**写的一个音乐播放器项目为例，给出在**archlinux**下的打包方式

## **For Arch Linux**

1.  创建打包目录，存放你的项目的**release**版本  
    `mkdir -p ~/packing/musicplayer && cd ~packing/musicplayer`
2.  在打包目录下创建并填写`PKGBUILD`文件  
    `vim PKGBUILD`  
    将下面内容复制到该文件中

```
# Maintainer: Thin_time <thintime123@gmail>

pkgname=musicplayer
pkgver=1.0.0
pkgrel=1
pkgdesc="A Qt6-based music player with lyrics and disc rotation animation"
arch=('x86_64')
url="https://github.com/Thintime123/MusicPlayer"
license=('GPL')
depends=('qt6-base' 'qt6-multimedia')
makedepends=('qt6-tools')
source=("$pkgname-$pkgver.tar.gz")
md5sums=('SKIP')

build() {
  cd "$srcdir/$pkgname-$pkgver"
  mkdir -p build
  cd build
  qmake6 ../MusicPlayer.pro
  make
}

package() {
  cd "$srcdir/$pkgname-$pkgver/build"

  # 创建目录结构
  mkdir -p "$pkgdir/usr/bin"
  mkdir -p "$pkgdir/usr/share/applications"
  mkdir -p "$pkgdir/usr/share/icons/hicolor/256x256/apps"
  mkdir -p "$pkgdir/usr/share/musicplayer/res"

  # 复制可执行文件
  install -Dm755 MusicPlayer "$pkgdir/usr/bin/musicplayer"

  # 复制资源文件
  cp -r ../res "$pkgdir/usr/share/musicplayer/"

  # 创建桌面文件
  cat > "$pkgdir/usr/share/applications/musicplayer.desktop" << EOF
[Desktop Entry]
Type=Application
Name=Music Player
Comment=A Qt6-based music player with lyrics and disc rotation
Exec=musicplayer
Icon=musicplayer
Categories=AudioVideo;Audio;Player;Qt;
Terminal=false
EOF

  # 复制图标文件
  if [ -f "../res/Icon/AppIcon.png" ]; then
    install -Dm644 "../res/Icon/AppIcon.png" "$pkgdir/usr/share/icons/hicolor/256x256/apps/musicplayer.png"
  elif [ -f "../res/Icon/Disc.png" ]; then
    install -Dm644 "../res/Icon/Disc.png" "$pkgdir/usr/share/icons/hicolor/256x256/apps/musicplayer.png"
  fi
}
```

保存并关闭文件  
3\. 准备源代码，将其整理成适合打包的格式

```
# 切换到项目目录
cd /home/xxx/Projects

# 创建打包用的临时目录
mkdir -p ~/packaging/musicplayer/src
cp -r MusicPlayer ~/packaging/musicplayer/src/musicplayer-1.0.0

# 确保删除任何编译产生的文件和中间文件
cd ~/packaging/musicplayer/src/musicplayer-1.0.0
rm -rf *.o moc_* ui_* .qmake.stash build Makefile

# 创建源代码压缩包
cd ~/packaging/musicplayer/src
tar -czf ../musicplayer-1.0.0.tar.gz musicplayer-1.0.0
```

4.  创建图标和桌面文件  
    将应用图标`AppIcon.png`放到`res/Icon`目录下
5.  构建包

```
cd ~/packaging/musicplayer
makepkg -si
```

`-s`会自动安装所缺少的依赖，`-i`会在编译成功后安装包  
6\. 完成后的安装测试

```
# 如果使用 makepkg -i 则已经安装，否则需要手动安装
sudo pacman -U musicplayer-1.0.0-1-x86_64.pkg.tar.zst

# 运行应用程序
musicplayer
```

7.  如果遇到权限问题

```
chmod 755 "$pkgdir/usr/bin/musicplayer"
chmod -R 755 "$pkgdir/usr/share/musicplayer/res"
```
