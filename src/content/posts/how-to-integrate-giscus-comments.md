---
author: FjellOverflow
pubDatetime: 2024-07-25T11:11:53Z
modDatetime: 2025-03-12T12:28:53Z
title: 如何将 Giscus 评论集成到 AstroPaper 中
slug: how-to-integrate-giscus-comments
featured: false
draft: false
tags:
  - astro
  - blog
  - docs
description: 使用 Giscus 在 GitHub Pages 托管的静态博客上添加评论功能。
---

在 [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) 等平台上托管一个轻量级静态博客有很多优势，但也会失去一些互动性。幸运的是，[Giscus](https://giscus.app/) 的存在提供了一种在静态站点上嵌入用户评论的方式。

## Table of contents

## _Giscus_ 的工作原理

[Giscus 使用 GitHub API](https://github.com/giscus/giscus?tab=readme-ov-file#how-it-works) 来读取和存储 _GitHub_ 用户在仓库关联的 `Discussions` 中发表的评论。

在你的站点上嵌入 _Giscus_ 客户端脚本包，配置正确的仓库 URL，用户就可以查看和撰写评论（需要登录 _GitHub_）。

这种方式是无服务器的，因为评论存储在 _GitHub_ 上，并在客户端从中动态加载，因此非常适合像 _AstroPaper_ 这样的静态博客。

## 设置 _Giscus_

_Giscus_ 可以在 [giscus.app](https://giscus.app/) 上轻松设置，但我还是简要概述一下流程。

### 前提条件

_Giscus_ 正常工作需要满足以下前提条件：

- 仓库是[公开的](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility#making-a-repository-public)
- 已安装 [Giscus 应用](https://github.com/apps/giscus)
- 你的仓库已启用 [Discussions](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/enabling-or-disabling-github-discussions-for-a-repository) 功能

如果由于任何原因无法满足这些条件，很遗憾，_Giscus_ 无法集成。

### 配置 _Giscus_

接下来，需要配置 _Giscus_。在大多数情况下，预选的默认值是合适的，除非你有特定原因并且知道自己在做什么，否则不应该修改它们。不要太担心做出错误的选择；你随时可以稍后调整配置。

但是你需要：

- 为 UI 选择正确的语言
- 指定要连接的 _GitHub_ 仓库，通常是包含你托管在 _GitHub Pages_ 上的 _AstroPaper_ 博客的仓库
- 如果你想确保没有人可以直接在 _GitHub_ 上创建随机评论，请在 _GitHub_ 上创建并设置一个 `Announcement` 类型的讨论
- 定义配色方案

配置好设置后，_Giscus_ 会为你提供一个生成的 `<script>` 标签，你将在下一步中用到它。

## 简单的脚本标签

你现在应该有一个类似这样的脚本标签：

```html
<script
  src="https://giscus.app/client.js"
  data-repo="[在此输入仓库]"
  data-repo-id="[在此输入仓库 ID]"
  data-category="[在此输入分类名称]"
  data-category-id="[在此输入分类 ID]"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="preferred_color_scheme"
  data-lang="en"
  crossorigin="anonymous"
  async
></script>
```

只需将其添加到站点的源代码中。如果你使用 _AstroPaper_ 并想在文章上启用评论，请导航到 `PostDetails.astro` 并将其粘贴到你希望评论出现的位置，也许在 `Share this post on:` 按钮下方。

```astro file=src/layouts/PostDetails.astro
<Layout {...layoutProps}>
  <main>
    <ShareLinks />

    <!-- [!code ++:6] -->
    <script
      src="https://giscus.app/client.js"
      data-repo="[在此输入仓库]"
      data-repo-id="[在此输入仓库 ID]"
      data-category="[在此输入分类名称]"
      data-category-id="[在此输入分类 ID]"></script>
  </main>
  <Footer />
</Layout>
```

就这样！你已成功在 _AstroPaper_ 中集成了评论功能！

## 带有浅色/深色主题的 React 组件

在布局中嵌入的脚本标签相当静态，_Giscus_ 的配置（包括 `theme`）都硬编码在布局中。考虑到 _AstroPaper_ 具有浅色/深色主题切换功能，评论能与站点的其余部分一起在浅色和深色主题之间无缝切换会更好。为了实现这一点，需要更复杂的 _Giscus_ 嵌入方式。

首先，我们将安装 _Giscus_ 的 [React 组件](https://www.npmjs.com/package/@giscus/react)：

```bash
npm i @giscus/react && npx astro add react
```

然后我们在 `src/components` 中创建一个新的 `Comments.tsx` React 组件：

```tsx file=src/components/Comments.tsx
import Giscus, { type Theme } from "@giscus/react";
import { GISCUS } from "@/constants";
import { useEffect, useState } from "react";

interface CommentsProps {
  lightTheme?: Theme;
  darkTheme?: Theme;
}

export default function Comments({
  lightTheme = "light",
  darkTheme = "dark",
}: CommentsProps) {
  const [theme, setTheme] = useState(() => {
    const currentTheme = localStorage.getItem("theme");
    const browserTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    return currentTheme || browserTheme;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      setTheme(matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const themeButton = document.querySelector("#theme-btn");
    const handleClick = () => {
      setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
    };

    themeButton?.addEventListener("click", handleClick);

    return () => themeButton?.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="mt-8">
      <Giscus theme={theme === "light" ? lightTheme : darkTheme} {...GISCUS} />
    </div>
  );
}
```

这个 _React_ 组件不仅包装了原生 _Giscus_ 组件，还引入了额外的 props，即 `lightTheme` 和 `darkTheme`。利用两个事件监听器，_Giscus_ 评论将与站点的主题保持一致，在站点或浏览器主题更改时动态切换深色和浅色主题。

我们还需要定义 `GISCUS` 配置，最佳位置是在 `constants.ts` 中：

```ts file=src/constants.ts
import type { GiscusProps } from "@giscus/react";

...

export const GISCUS: GiscusProps = {
  repo: "[在此输入仓库]",
  repoId: "[在此输入仓库 ID]",
  category: "[在此输入分类名称]",
  categoryId: "[在此输入分类 ID]",
  mapping: "pathname",
  reactionsEnabled: "0",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "en",
  loading: "lazy",
};
```

请注意，在此处指定 `theme` 会覆盖 `lightTheme` 和 `darkTheme` props，导致静态主题设置，类似于之前使用 `<script>` 标签嵌入 _Giscus_ 的方式。

最后，将新的 Comments 组件添加到 `PostDetails.astro` 中（替换上一步中的 `script` 标签）。

```jsx file=src/layouts/PostDetails.astro
// [!code ++:1]
import Comments from "@/components/Comments";

<ShareLinks />

// [!code ++:1]
<Comments client:only="react" />

<hr class="my-6 border-dashed" />

<Footer />
```

就这样！
