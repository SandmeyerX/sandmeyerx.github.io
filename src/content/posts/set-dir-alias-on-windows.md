---
author: Sandmeyer
pubDatetime: 2026-10-14T10:58:41.000+08:00
modDatetime: 
title: 在 Windows 上给常用目录设置别名
featured: false
draft: false
tags:
  - Windows
  - 常用设置
  - 教程
description: 借助 doskey，我们可以为常用目录设置别名从而更简单地切换到该目录下，而不是手动 `cd` 一个超长路径。
---

在 Linux 系统下，我们可以使用 `alias` 给常用命令设置另个简短的名称，例如：
```shell
alias ll='ls -alF'
```
借助此功能，我们可以更简单地切换到常用目录下，而不是手动 `cd` 一个超长路径。
例如：
```shell
alias proj="cd ../foo/bar/project"
```

这样只需要输入 `proj` 便能自动切换到该目录。

那么，这么方便快捷的东西 Windows 下有没有呢？

**有的兄弟，有的有的！**

## 设置步骤

在 Windows 下，没有 `alias`，但我们可以使用 `doskey` 替代。

> [!TIP]
> `doskey` 是 Windows `cmd.exe` 里从 DOS 时代留下来的工具，主要用来：
>
> 1. 定义命令宏：给命令起别名，输入短名称执行长命令；
> 2. 管理命令历史：查看、调用、清除输入过的命令。

### 创建宏文件

> [!NOTE]
> `%USERPROFILE%` 通常是你的用户根目录，例如：`C:\Users\用户名`
> 可以通过快捷键 Win + R 打开 `运行` 并输入 `%USERPROFILE%` 打开该目录

新建 `%USERPROFILE%\cmd-macros.txt`，内容是想设置的别名，例如：
```
proj=cd /d "D:\work\project"
docs=cd /d "D:\Docs"
```
**注意**：如果想切换盘符，例如从 c 盘切换到 d 盘，这里的 `/d` 必不可少 

### 创建启动脚本

新建 `%USERPROFILE%\cmd-init.cmd`，内容为：
```cmd
@echo off
doskey /macrofile="%USERPROFILE%\cmd-macros.txt"
```

### 设置 CMD 启动时自动运行

> [!WARNING]
>
> 此处涉及修改注册表，请谨慎处理！

在 CMD 中运行命令：
```cmd
reg add "HKCU\Software\Microsoft\Command Processor" /v AutoRun /t REG_SZ /d "%USERPROFILE%\cmd-init.cmd" /f
```

也可以手动打开注册表编辑器，定位到：
```
HKEY_CURRENT_USER\Software\Microsoft\Command Processor
```

新建字符串值 `AutoRun`，值设为：
```
"C:\Users\你的用户名\cmd-init.cmd"
```

如果已经有 `AutoRun`，不要覆盖，追加即可，例如：
```
原来的命令 & "C:\Users\你的用户名\cmd-init.cmd"
```

大功告成！
