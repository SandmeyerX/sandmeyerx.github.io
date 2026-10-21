---
author: Sandmeyer
pubDatetime: 2026-10-20T18:06:21.000+08:00
modDatetime: 
title: 解决 WSL2 Ubuntu GUI 界面中文显示方块/乱码
featured: false
draft: false
tags:
  - WSL2
  - Ubuntu
  - 中文
  - 教程
description: 本文介绍 WSL2 Ubuntu GUI 界面中文显示为方块/乱码的解决方法：确认系统缺失中文字体后，通过将 Windows 字体目录软链接到 WSL2 字体目录并刷新字体缓存，即可恢复正常中文显示。
---

在 WSL2 下跑 GPUI-Kit demo 时发现界面英文文本显示正常，但中文内容都显示为小方框。

经验丰富的我一眼就看出了可能是**字体问题**导致的，经过我的一顿搜索[^1][^2]，找到如下解决方案。

## 确认是否缺失中文字体
在 WSL2 下，运行以下命令：
```bash
ls /usr/share/fonts/
```

```bash
ls /usr/share/fonts/truetype/
```

如果字体文件目录下只有 `truetype` 一个文件夹，并且 `truetype/` 下只有 `dejavu/` `ubuntu/` 这两个文件夹 ，那么很可能是缺失了 GUI 所使用的中文字体。

## 解决方法
解决方案是安装缺少的字体。

一般来说，Windows 下已经安装了所需的字体，
为了节约硬盘资源，我们可以用软链接把 WSL2 系统字体文件夹链接到 Windows 字体文件夹。

**在 WSL2 下：**

创建字体目录：
```bash
sudo mkdir -p /usr/share/fonts/win11
```

软链接 Windows 字体到 WSL2：
```bash
sudo ln -s /mnt/c/Windows/Fonts/* /usr/share/fonts/win11
```

刷新字体缓存：
```bash
sudo fc-cache -fv
```

一般来说，此时再打开 GUI 界面，中文显示就是正常的。

## 参考
[^1]: [稀土掘金 | WSL2 Ubuntu GUI 图形界面中文显示乱码](https://juejin.cn/post/7320102376175501322)
[^2]: [知乎 | WSL2 图形界面 中文显示 方框/乱码 解决方式](https://zhuanlan.zhihu.com/p/683470601)
