---
author: Sat Naing
pubDatetime: 2022-12-28T04:59:04.866Z
modDatetime: 2026-06-03T00:00:00.000Z
title: AstroPaper 博客文章中的动态 OG 图片生成
slug: dynamic-og-image-generation-in-astropaper-blog-posts
featured: false
draft: false
tags:
  - docs
  - release
description: AstroPaper v1.4.0 中的新功能，为博客文章引入动态 OG 图片生成。
---

AstroPaper v1.4.0 中的新功能，为博客文章引入动态 OG 图片生成。

![AstroPaper 博客文章中的动态 OG 图片生成](/posts/dynamic-og-image-generation-in-astropaper-blog-posts/index.png)

## Table of contents

## 简介

OG 图片（也称为社交图片）在社交媒体互动中扮演着重要角色。如果你不知道 OG 图片是什么，它是在 Facebook、Discord 等社交媒体上分享网站 URL 时显示的图片。

> 用于 Twitter 的社交图片技术上不称为 OG 图片。但是，在本文中，我将使用 OG 图片一词来指代所有类型的社交图片。

## 默认/静态 OG 图片（旧方式）

AstroPaper 已经提供了为博客文章添加 OG 图片的方式。作者可以在 frontmatter 的 `ogImage` 中指定 OG 图片。即使作者没有在 frontmatter 中定义 OG 图片，也会使用默认的 OG 图片作为备选方案（在这种情况下是 `public/default-og.jpg`）。但问题是默认的 OG 图片是静态的，这意味着每个没有在 frontmatter 中包含 OG 图片的博客文章都会使用相同的默认 OG 图片，尽管每篇文章的标题/内容各不相同。

## 动态 OG 图片

为每篇文章生成动态 OG 图片可以让作者避免为每篇博客文章指定 OG 图片。此外，这将防止所有博客文章使用相同的备选 OG 图片。

在 AstroPaper v1.4.0 中，使用 Vercel 的 [Satori](https://github.com/vercel/satori) 包进行动态 OG 图片生成。

在 AstroPaper v6+ 中，同样的理念保持不变（Satori 渲染 SVG，然后通过 [Sharp](https://sharp.pixelplumbing.com/) 生成 PNG），但字体来源于 Astro 的 **Fonts** 配置，并通过 [`experimental_getFontFileURL()`](https://astro.build/blog/astro-620/) 加载，因此 OG 生成可以复用与站点相同的字体管道。

动态 OG 图片将在构建时为满足以下条件的博客文章生成：

- 没有在 frontmatter 中包含 OG 图片
- 没有标记为草稿

## AstroPaper 动态 OG 图片的构成

动态 OG 图片包含 _博客文章标题_、_作者名称_ 和 _站点标题_。作者名称和站点标题从 `astro-paper.config.ts` 中的 `site.author` 和 `site.title` 获取。标题从博客文章 frontmatter 的 `title` 生成。

![示例动态 OG 图片链接](https://user-images.githubusercontent.com/53733092/209704501-e9c2236a-3f4d-4c67-bab3-025aebd63382.png)

### 非拉丁字符的问题

> [!CAUTION]
> 包含非拉丁字符的标题默认无法正确显示。请将 Google 字体系列切换为覆盖你的书写系统的字体，并包含 **400** 和 **700** 两种字重——Satori 使用单独的缓冲区处理常规和粗体，缺少任一会导致渲染不匹配。

```ts file="astro.config.ts"
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  fonts: [
    {
      // 示例：日语覆盖（根据你的受众选择所需的字体）
      name: "Noto Sans JP",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [400, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
});
```

如果你更改了 `cssVariable`，还需要更新以下文件中的对应键：

- `src/pages/og.png.ts`
- `src/pages/posts/[...slug]/index.png.ts`

> 查看[此 PR](https://github.com/satnaing/astro-paper/pull/318) 了解更多信息。

> [!WARNING] 注意事项
>
> - **构建时间**随内容量增长——每篇符合条件的文章在构建时都会生成一张 PNG。v6 中生成更快（PR [#632](https://github.com/satnaing/astro-paper/pull/632)），但在非常大的站点上，你可以通过在 `astro-paper.config.ts` 中设置 `features.dynamicOgImage: false` 来禁用它。
> - **RTL 语言**尚不支持。
> - 标题中的 **Emoji** 可能会有问题——有些可能无法正确渲染。
