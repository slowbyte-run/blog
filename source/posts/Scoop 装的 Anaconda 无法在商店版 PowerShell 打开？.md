---
title: 'Scoop 装的 Anaconda 无法在商店版 PowerShell 打开？'
date: '2025-10-12 11:36'
link: 'cnblogs-19136430'
description: '解决通过 Scoop 安装的 Anaconda 无法在 Microsoft Store 版 PowerShell 中激活 conda 的问题。'
tags:
  - 'tools'
  - 'windows'
categories:
  - 'Tools'
---

商店版 PowerShell 里敲 `conda` 一直提示找不到命令，当时我还以为是 Scoop 装岔了，重装了好几遍都不行，后来才明白是启动时压根没加载 conda 的 hook。折腾的过程按步骤记下来，从临时启用到最后固化进 profile。

## 1) 不依赖 profile，先在当前会话“临时启用” conda

```powershell
$CondaRoot = 'D:\Scoop\apps\anaconda3\current\App'
$env:PATH = "$CondaRoot\condabin;$CondaRoot\Scripts;$CondaRoot;$CondaRoot\Library\bin;$env:PATH"

# 关键点：**用点号 dot-source** 加载官方 hook（不要用 &）
. "$CondaRoot\shell\condabin\conda-hook.ps1"

# 立即验证
Get-Command conda
conda -V
conda info
```

- 如果这一步就能成功显示版本/信息，说明问题只是“启动时没正确加载 hook”。继续第 2 步把它写入 profile。
- 如果依旧不行，先看 `Get-Command conda` 输出了什么（是否有 `Function conda`）；如果没有，往下做第 3 步“强力最小函数”。

---

## 2) 用“官方 hook”固化到 profile（替换写入）

把 hook 和 PATH 固化到 **PowerShell 7 专属 profile** 和 **当前用户-所有主机**的 profile；我们用覆盖写入，避免之前追加了很多次导致混乱。

```powershell
$CondaRoot = 'D:\Scoop\apps\anaconda3\current\App'

# 确保目录 & 文件存在
$files = @($PROFILE, $PROFILE.CurrentUserAllHosts)
foreach ($f in $files) {
  $dir = Split-Path -Parent $f
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
}

# 统一写入内容（覆盖 Set-Content）
$content = @"
# ===== Conda bootstrap (Store pwsh 7) =====
`$CondaRoot = "$CondaRoot"
`$env:PATH = "$CondaRoot\condabin;$CondaRoot\Scripts;$CondaRoot;$CondaRoot\Library\bin;`$env:PATH"
. "$CondaRoot\shell\condabin\conda-hook.ps1"
# 可选：启动即激活 base，取消下一行注释
# conda activate base
# ===== End =====
"@

Set-Content -Path $PROFILE -Value $content -Encoding UTF8
Set-Content -Path $PROFILE.CurrentUserAllHosts -Value $content -Encoding UTF8

# 执行策略（仅当前用户）
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

# 立刻加载并验证
. $PROFILE
Get-Command conda
conda -V
```

> 重点：**`conda-hook.ps1` 要用「点号 .」加载**，否则不会把 `conda` 函数注入当前会话。这是很多人卡住的地方。

---

## 3) 如果官方 hook 仍然无效，用“最小函数”兜底

（极少见，但商店版 pwsh 在某些环境里 hook 不生效时，这招最稳。）

```powershell
$CondaRoot = 'D:\Scoop\apps\anaconda3\current\App'
$min = @"
# ===== Conda minimal fallback =====
`$CondaRoot = "$CondaRoot"
`$env:PATH = "$CondaRoot\condabin;$CondaRoot\Scripts;$CondaRoot;$CondaRoot\Library\bin;`$env:PATH"
function conda { & "$CondaRoot\condabin\conda.bat" @Args }
# conda activate base
# ===== End =====
"@
Set-Content -Path $PROFILE -Value $min -Encoding UTF8
. $PROFILE
conda -V
```

---

## 4) 两个快速自检

```powershell
# A) 确认不是以 -NoProfile 启动
$PSCommandPath  # 通常为空；若你用的是带 -NoProfile 的快捷方式，请改回默认

# B) 看看当前会话里 conda 的解析
Get-Command conda -All
$env:PATH -split ';' | ? { $_ -match 'anaconda3|conda|Scoop' }
```

---

### 仍不行？三件事再确认

1.  你确实在 **PowerShell 7（pwsh）** 中做这些（窗口标题通常是 `PowerShell 7.x`；`$PSVersionTable.PSVersion` 主版本应为 7）；
2.  `$CondaRoot` 写的是 **`...\anaconda3\current\App`**（你前面的输出已表明文件都在那里）；
3.  没用到公司/学校的限制策略：`Get-ExecutionPolicy -List` 看 `CurrentUser` 至少是 `RemoteSigned` 或 `Bypass`。

照着上面 1→2→3 的顺序走，通常在第 1 或第 2 步就能恢复 `conda`。
