<p align="center">
  <strong>🌐 语言 | Language:</strong> 简体中文 | <a href="README_en.md">English</a>
</p>

# AstroPaper 📄

![AstroPaper](public/default-og.jpg)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/community/file/1356898632249991861)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub](https://img.shields.io/github/license/satnaing/astro-paper?color=%232F3741&style=for-the-badge)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white&style=for-the-badge)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)

AstroPaper 是一个极简、响应式、无障碍且 SEO 友好的 Astro 博客主题。该主题基于[我的个人博客](https://satnaing.dev/blog)设计和制作。

阅读[博客文章](https://astro-paper.pages.dev/posts/)或查看 [README 文档部分](#-documentation)了解更多信息。

## 🔥 功能特性

- [x] 类型安全的 Markdown
- [x] 极快的性能
- [x] 无障碍访问（键盘/VoiceOver）
- [x] 响应式设计（移动端 ~ 桌面端）
- [x] SEO 友好
- [x] 浅色与深色模式
- [x] 静态搜索（[Pagefind](https://pagefind.app/)）
- [x] 草稿文章与分页
- [x] 站点地图与 RSS 订阅
- [x] MDX 支持
- [x] 可折叠目录
- [x] 遵循最佳实践
- [x] 高度可定制
- [x] 博客文章动态 OG 图片生成（[博客文章](https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/)）
- [x] 支持国际化（i18n）

_注意：我已经使用 Mac 上的 **VoiceOver** 和 Android 上的 **TalkBack** 测试了 AstroPaper 的屏幕阅读器无障碍访问性。我无法测试所有其他的屏幕阅读器。但是，AstroPaper 中的无障碍增强功能在其他阅读器上也应该能正常工作。_

## ✅ Lighthouse 评分

<p align="center">
  <a href="https://pagespeed.web.dev/report?url=https%3A%2F%2Fastro-paper.pages.dev%2F&form_factor=desktop">
    <img width="710" alt="AstroPaper Lighthouse Score" src="AstroPaper-lighthouse-score.svg">
  </a>
</p>

## 🚀 项目结构

在 AstroPaper 中，你会看到以下文件夹和文件：

```bash
/
├── public/
│   ├── pagefind/          # 构建时自动生成
│   ├── favicon.svg
│   └── default-og.jpg
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   ├── content/
│   │   ├── pages/
│   │   │   └── about.md
│   │   └── posts/
│   │       └── some-blog-posts.md
│   ├── i18n/
│   ├── layouts/
│   ├── pages/
│   ├── scripts/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── config.ts
│   └── content.config.ts
├── astro-paper.config.ts  # 用户自定义配置
└── astro.config.ts
```

所有博客文章都存储在 `src/content/posts/` 目录中。你可以将文章组织到子目录中——子目录名称会成为文章 URL 的一部分。

## 📖 文档

文档可以通过两种格式阅读：_Markdown_ 和 _博客文章_。

- 集成 Giscus 评论 - [Markdown](src/content/posts/how-to-integrate-giscus-comments.md)
- 在博客文章中添加 LaTeX 公式 - [Markdown](src/content/posts/how-to-add-latex-equations-in-blog-posts.md)
- 通过 Git Hooks 设置日期 - [Markdown](src/content/posts/setting-dates-via-git-hooks.md)
- 更新依赖 - [Markdown](src/content/posts/how-to-update-dependencies.md)
- 动态 OG 图片 - [Markdown](src/content/posts/dynamic-og-images.md)
- 在 AstroPaper 中添加新文章 - [Markdown](src/content/posts/adding-new-post.mdx)
- 配置 AstroPaper 主题 - [Markdown](src/content/posts/how-to-configure-astropaper-theme.mdx)
- 自定义配色方案 - [Markdown](src/content/posts/customizing-astropaper-theme-color-schemes.mdx)

## 💻 技术栈

**主要框架** - [Astro](https://astro.build/)  
**类型检查** - [TypeScript](https://www.typescriptlang.org/)  
**样式** - [TailwindCSS](https://tailwindcss.com/)  
**UI/UX** - [Figma 设计文件](https://www.figma.com/community/file/1356898632249991861)  
**静态搜索** - [Pagefind](https://pagefind.app/)  
**图标** - [Tablers](https://tabler-icons.io/)  
**代码格式化** - [Prettier](https://prettier.io/)  
**部署** - [Cloudflare Pages](https://pages.cloudflare.com/)  
**代码检查** - [ESLint](https://eslint.org)  
**动态 OG 图片** - [Satori](https://github.com/vercel/satori) + [Sharp](https://sharp.pixelplumbing.com/) + [Astro Fonts](https://docs.astro.build/en/guides/fonts/)

## 👨🏻‍💻 本地运行

你可以在所需目录中运行以下命令来本地启动此项目：

```bash
# pnpm
pnpm create astro@latest --template satnaing/astro-paper

# npm
npm create astro@latest -- --template satnaing/astro-paper

# yarn
yarn create astro --template satnaing/astro-paper

# bun
bun create astro@latest -- --template satnaing/astro-paper
```

然后运行以下命令来启动项目：

```bash
# 如果你之前没有安装依赖，请先安装
pnpm install

# 启动项目
pnpm dev
```

## Google 站点验证（可选）

你可以通过在 `astro-paper.config.ts` 中设置 `site.googleVerification` 来添加 [Google 站点验证 HTML 标签](https://support.google.com/webmasters/answer/9008080#meta_tag_verification&zippy=%2Chtml-tag)：

```ts file="astro-paper.config.ts"
export default defineAstroPaperConfig({
  site: {
    // ...
    googleVerification: "your-google-site-verification-value",
  },
  // ...
});
```

> 参考[此讨论](https://github.com/satnaing/astro-paper/discussions/334#discussioncomment-10139247)了解如何将 AstroPaper 添加到 Google Search Console。

## 🧞 命令

所有命令都在项目根目录下的终端中运行：

| 命令             | 说明                                                                                                                             |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`   | 安装依赖                                                                                                                         |
| `pnpm dev`       | 在 `localhost:4321` 启动本地开发服务器                                                                                            |
| `pnpm build`     | 类型检查、构建站点、运行 Pagefind 索引，并将索引复制到 `public/pagefind/`                                                         |
| `pnpm preview`   | 在部署前本地预览构建结果                                                                                                         |
| `pnpm sync`      | 为所有 Astro 模块生成 TypeScript 类型。[了解更多](https://docs.astro.build/en/reference/cli-reference/#astro-sync)。              |
| `pnpm astro ...` | 运行 CLI 命令，如 `astro add`、`astro check`                                                                                     |

## ✨ 反馈与建议

如果你有任何建议/反馈，可以通过[我的邮箱](mailto:satnaingdev+astropaper@gmail.com)联系我。或者，如果你发现 bug 或想请求新功能，请随时提交 issue。

## 📜 许可证

基于 MIT 许可证授权，版权所有 © 2026

---

由 [Sat Naing](https://satnaing.dev) 👨🏻‍💻 和[贡献者](https://github.com/satnaing/astro-paper/graphs/contributors)用 🤍 制作。
