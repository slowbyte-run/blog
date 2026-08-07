---
title: 'Arch 装不了官网软件包？两种方法轻松搞定'
date: '2025-05-13 16:55'
link: 'cnblogs-18874518'
description: '在 Arch 上安装 JetBrains 等从官网下载的预编译软件包的两种方法。'
tags:
  - 'archlinux'
categories:
  - 'ArchLinux'
---

在 Arch Linux 中，你从 JetBrains 官网下载的 `pycharm-2025.1.1.tar.gz` 是一个 **预编译的二进制归档文件**（而非 Arch Linux 的 `.pkg.tar.zst` 软件包），因此不能直接用 `pacman -U` 安装。以下是两种安装方法：

---

## **方法 1：手动解压安装（推荐）**

### **步骤 1：解压到 `/opt/`（推荐）**

```bash
sudo tar -xzf pycharm-2025.1.1.tar.gz -C /opt/
```

这会解压到 `/opt/pycharm-2025.1.1/`。

### **步骤 2：创建启动脚本**

```bash
sudo ln -s /opt/pycharm-2025.1.1/bin/pycharm.sh /usr/local/bin/pycharm
```

现在可以通过终端直接运行：

```bash
pycharm
```

### **步骤 3：创建桌面快捷方式**

```bash
sudo cp /opt/pycharm-2025.1.1/bin/pycharm.desktop /usr/share/applications/
```

更新图标缓存：

```bash
sudo gtk-update-icon-cache -qtf /usr/share/icons/hicolor
```

之后可以在应用菜单中找到 PyCharm。

---

## **方法 2：通过 AUR 安装（自动更新）**

如果你想用 `pacman` 管理 PyCharm（方便后续更新），可以通过 **AUR** 安装：

### **步骤 1：安装 AUR 助手（如 `yay`）**

```bash
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

### **步骤 2：从 AUR 安装 PyCharm**

```bash
yay -S pycharm-professional  # 专业版
# 或
yay -S pycharm-community    # 社区版
```

这会自动下载、编译并生成 Arch Linux 的 `.pkg.tar.zst` 包，然后用 `pacman` 管理。

---

## **方法对比**

**方式**

**优点**

**缺点**

**手动解压**

无需依赖管理工具

需手动更新，无 `pacman` 集成

**AUR 安装**

自动更新，`pacman` 统一管理

需配置 AUR 助手

---

## **卸载方法**

### **手动安装的 PyCharm**

```bash
sudo rm -rf /opt/pycharm-2025.1.1/
sudo rm /usr/local/bin/pycharm
sudo rm /usr/share/applications/pycharm.desktop
```

### **AUR 安装的 PyCharm**

```bash
sudo pacman -Rns pycharm-professional
```

---

## **常见问题**

### **Q1: 为什么不用 `pacman -U` 安装 `.tar.gz`？**

- `pacman -U` 仅适用于 Arch 的 `.pkg.tar.zst` 包，而官网下载的是通用 Linux 压缩包。

### **Q2: 如何更新手动安装的 PyCharm？**

- 重复解压步骤，覆盖旧版本（或删除旧版再解压新版本）。

### **Q3: 输入法无法在 PyCharm 中使用？**

- 启动时添加环境变量：

```bash
env GTK_IM_MODULE=fcitx QT_IM_MODULE=fcitx /opt/pycharm-2025.1.1/bin/pycharm.sh
```

---

推荐使用 **AUR 安装**（方法 2），以便后续一键更新。如果追求最新版或测试版，选择手动安装（方法 1）。

## 发生错误

执行`sudo cp /opt/pycharm-2025.1.1/bin/pycharm.desktop /usr/share/applications/`时返回cp: 对 '/opt/pycharm-2025.1.1/bin/pycharm.desktop'调用`stat`失败: 没有那个文件或目录  
这个错误表明 PyCharm 的 `.desktop` 文件路径不正确，可能是因为 PyCharm 的目录结构在新版本中发生了变化。以下是解决方法：

---

### **1\. 确认 PyCharm 的实际安装路径**

首先检查 `/opt/pycharm-2025.1.1/bin/` 下是否存在 `pycharm.desktop` 文件：

```bash
ls /opt/pycharm-2025.1.1/bin/
```

如果输出中没有 `pycharm.desktop`，可能是以下原因：

- JetBrains 在新版本中移除了该文件。
- 文件可能被放置在其他目录（如 `/opt/pycharm-2025.1.1/` 根目录）。

---

### **2\. 手动创建 `.desktop` 文件**

如果文件不存在，可以手动创建（推荐）：

#### **(1) 创建文件**

```bash
sudo vim /usr/share/applications/pycharm.desktop
```

#### **(2) 填入以下内容**

```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=PyCharm
Icon=/opt/pycharm-2025.1.1/bin/pycharm.png
Exec=/opt/pycharm-2025.1.1/bin/pycharm.sh
Comment=Python IDE
Categories=Development;IDE;
Terminal=false
StartupWMClass=jetbrains-pycharm
```

> **注**：
>
> - 如果 `pycharm.png` 不存在，可以从 JetBrains 官网下载图标，或使用其他路径的图标文件。
> - 确保 `pycharm.sh` 的路径正确。

#### **(3) 赋予可执行权限**

```bash
sudo chmod +x /usr/share/applications/pycharm.desktop
```

---

### **3\. 更新桌面数据库**

```bash
sudo update-desktop-database
```

---

### **4\. 验证快捷方式**

- 在应用菜单中搜索 **PyCharm**，确认能否启动。
- 如果图标不显示，检查图标路径是否正确：

```bash
ls /opt/pycharm-2025.1.1/bin/ | grep png
```

---

### **5\. 替代方案：直接通过脚本启动**

如果不想创建快捷方式，可以直接运行：

```bash
/opt/pycharm-2025.1.1/bin/pycharm.sh
```

或添加别名到 `~/.bashrc`：

```bash
echo 'alias pycharm="/opt/pycharm-2025.1.1/bin/pycharm.sh"' >> ~/.bashrc
source ~/.bashrc
```

之后只需在终端输入 `pycharm` 即可启动。

---

### **总结**

**问题原因**

**解决方案**

`.desktop` 文件路径错误

手动创建 `/usr/share/applications/pycharm.desktop`

PyCharm 版本结构变化

检查 `/opt/pycharm-2025.1.1/` 下的实际路径

图标缺失

下载图标并指定正确路径，或使用默认图标（如 `jetbrains-pycharm`）

如果仍有问题，可以尝试从 AUR 安装 PyCharm（自动处理快捷方式）：

```bash
yay -S pycharm-professional  # 专业版
# 或
yay -S pycharm-community    # 社区版
```
