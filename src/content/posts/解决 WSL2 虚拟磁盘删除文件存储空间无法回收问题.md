---
author: Sandmeyer
pubDatetime: 2026-09-13T07:21:18.000+08:00
modDatetime: 
title: 解决 WSL2 虚拟磁盘删除文件存储空间无法回收问题
featured: false
draft: false
tags:
  - 教程
  - WSL2
description: WSL2 删除大文件后空间却没有释放？原因是 WSL2 虚拟磁盘可自动扩容但不会自动收缩。本文使用 fstrim 回收空闲块，配合 Windows diskpart 压缩 ext4.vhdx，完整步骤解决此问题。
---

最近在用 WSL2 配置 Linux 环境来编译 Rust 项目

一个项目编译后多了几个 G 的编译产物那都是家常便饭 :<

跑完直接就是一个 `cargo clean` 清理所有产物，神清气爽
![WSL cargo clean: Removed 2.99Gib total](@/assets/images/WSL-cargo-clean-Removed-2.99Gib-total.png)

欸？我的 D 盘空间怎么没有增加？

别急！经过我一顿检索[^1]，找到了解决方案（至少是对我可行的）。

## Table of contents

##  解决步骤
首先进入需要清理的 `WSL2` 实例：
```powershell
wsl -d Ubuntu-24.04

# 我这里是 Ubuntu，具体以你的实例名为准
```

> [!NOTE]
> `WSL2` 的多个 Linux 实例共享同一个底层轻量级虚拟机；每个实例拥有独立的 `ext4.vhdx` 虚拟磁盘文件

然后在 Linux 命令窗口下，将虚拟硬盘空间写零，回收`WSL`中未使用的空间：
```bash
fstrim -a
```
随后退出 `WSL2` 实例，彻底关闭它
```bash
exit
```

```powershell
wsl --shutdown
```

使用 Windows 下的 `Diskpart` 工具，压缩磁盘镜像文件：
```powershell
diskpart
```

这会新打开一个 `Diskpart` 窗口，允许以管理员身份运行

找到你的 `WSL2` 实例磁盘镜像文件的位置，一般文件名叫 `ext4.vhdx` 

在该窗口下：
指定刚才找到的磁盘镜像文件路径
```bash
select vdisk file="D:\wsl\…\ext4.vhdx"

# file="你的 ext4.vhdx 虚拟磁盘路径"
```
以只读模式附加磁盘镜像文件
```bash
attach vdisk readonly
```

压缩 vhdx 磁盘镜像文件
```bash
compact vdisk
```

等待压缩完成后，分离 vhdx 磁盘镜像文件
```bash
detach vdisk
```

OK！大功告成！
现在你就能在文件资源管理器中看到存储空间得到了释放

## 原理
`WSL2` 的 Linux 实例使用动态扩展的 `ext4.vhdx` 虚拟磁盘。这种磁盘的特性是**只可自动扩容，不会自动收缩**。当你在 WSL 内删除大文件时，Linux 文件系统只是把对应磁盘块标记为**空闲**，而虚拟磁盘文件本身大小**不会减小**，所以 Windows C/D 盘占用不会下降

解决分为两步：首先在 WSL 内部执行 `fstrim -a`，向虚拟磁盘驱动上报哪些块已经空闲可丢弃；随后通过 diskpart 的 `compact` 命令扫描虚拟磁盘，清理掉被标记丢弃的块，缩小 `vhdx` 文件，最终把空间归还到 Windows

## 参考
[^1]: [知乎-解决WSL2中删除文件存储空间不释放的问题](https://zhuanlan.zhihu.com/p/648571909)
