---
title: 如何更新 AstroPaper 的依赖
author: Sat Naing
pubDatetime: 2023-07-20T15:33:05.569Z
slug: how-to-update-dependencies
featured: false
draft: false
ogImage: ../../assets/images/forrest-gump-quote.png
tags:
  - FAQ
description: 如何更新项目依赖和 AstroPaper 模板。
---

更新项目依赖可能很繁琐。然而，忽略更新项目依赖也不是个好主意 😬。在本文中，我将分享我通常如何更新我的项目，以 AstroPaper 为例。不过，这些步骤也可以应用于其他 js/node 项目。

![Forrest Gump 伪名言](@/assets/images/forrest-gump-quote.png)

## Table of contents

## 更新包依赖

有几种更新依赖的方法，我尝试了各种方法来找到最简单的一种。一种方法是使用 `npm install package-name@latest` 手动更新每个包。这是最直接的更新方式。然而，它可能不是最有效的选择。

我推荐的更新依赖方法是使用 [npm-check-updates 包](https://www.npmjs.com/package/npm-check-updates)。freeCodeCamp 上有一篇关于它的好[文章](https://www.freecodecamp.org/news/how-to-update-npm-dependencies/)，所以我不会详细解释它是什么以及如何使用这个包。相反，我将展示我的典型方法。

首先，全局安装 `npm-check-updates` 包。

```bash
npm install -g npm-check-updates
```

在进行任何更新之前，最好检查所有可以更新的新依赖。

```bash
ncu
```

大多数时候，补丁依赖可以在完全不影响项目的情况下更新。所以我通常通过运行 `ncu -i --target patch` 或 `ncu -u --target patch` 来更新补丁依赖。区别在于 `ncu -u --target patch` 会更新所有补丁，而 `ncu -i --target patch` 会提供切换要更新的包的选项。你可以自己决定采用哪种方式。

下一部分涉及更新次要依赖。次要包更新通常不会破坏项目，但始终最好检查各自包的发布说明。这些次要更新通常包含一些可以应用于我们项目的很酷的功能。

```bash
ncu -i --target minor
```

最后但同样重要的是，依赖中可能有一些主要的包更新。所以，通过运行以下命令检查剩余的依赖更新

```bash
ncu -i
```

如果有任何主要更新（或者你仍然需要进行的一些更新），上述命令将输出那些剩余的包。如果包是主要版本更新，你必须非常小心，因为这可能会破坏整个项目。因此，请仔细阅读相应的发布说明（或）文档，并相应地进行更改。

如果你运行 `ncu -i` 并发现没有更多包需要更新，_**恭喜！！！**_ 你已成功更新了项目中的所有依赖。

## 更新 AstroPaper 模板

像其他开源项目一样，AstroPaper 随着 bug 修复、功能更新等不断发展。所以如果你是使用 AstroPaper 作为模板的人，你可能也想在有新版本发布时更新模板。

问题是，你可能已经根据自己的喜好更新了模板。因此，我无法准确展示**"一种万能的完美方式"**来将模板更新到最新版本。但是，这里有一些提示可以帮助你在不破坏仓库的情况下更新模板。请记住，大多数时候，更新包依赖可能就足够了。

### 需要注意的文件和目录

在大多数情况下，你可能不想覆盖的文件和目录（因为你可能已经更新了这些文件）是 `src/content/blog/`、`src/config.ts`、`src/pages/about.md` 以及其他资源和样式，如 `public/` 和 `src/styles/base.css`。

如果你只是更新了模板的最低限度，那么除了上述文件和目录外，用最新的 AstroPaper 替换所有内容应该没问题。就像纯 Android OS 和其他厂商特定的 OS（如 OneUI）一样。你修改的基础越少，你需要更新的就越少。

你可以手动逐个替换每个文件，或者你可以使用 git 的魔力来更新所有内容。我不会展示手动替换过程，因为它非常直接。如果你对那个直接但低效的方法不感兴趣，请耐心等待 🐻。

### 使用 Git 更新 AstroPaper

**重要！！！**

> 只有在你知道如何解决合并冲突时才执行以下操作。否则，你最好手动替换文件或仅更新依赖。

首先，将 astro-paper 添加为项目中的远程仓库。

```bash
git remote add astro-paper https://github.com/satnaing/astro-paper.git
```

切换到新分支以更新模板。如果你知道自己在做什么并且对自己的 git 技能有信心，可以省略此步骤。

```bash
git checkout -b build/update-astro-paper
```

然后，通过运行以下命令从 astro-paper 拉取更改

```bash
git pull astro-paper main
```

如果遇到 `fatal: refusing to merge unrelated histories` 错误，可以通过运行以下命令解决

```bash
git pull astro-paper main --allow-unrelated-histories
```

运行上述命令后，你可能会在项目中遇到冲突。你需要手动解决这些冲突，并根据需要进行必要的调整。

解决冲突后，彻底测试你的博客，确保一切按预期工作。检查你的文章、组件和你做的任何自定义。

一旦你对结果满意，就可以将更新分支合并到主分支了（只有在另一个分支中更新模板时）。恭喜！你已成功将模板更新到最新版本。你的博客现在是最新的，准备好闪耀了！🎉

## 总结

在本文中，我分享了我关于更新依赖和 AstroPaper 模板的一些见解和过程。我真诚地希望这篇文章被证明是有价值的，并帮助你更高效地管理你的项目。

如果你有任何更新依赖/AstroPaper 的替代或改进方法，我很乐意听取你的意见。因此，请毫不犹豫地在仓库中发起讨论、给我发邮件或提交 issue。你的输入和想法将非常感谢！

请理解我最近的日程很忙，我可能无法快速回复。但我承诺会尽快回复你。😬

感谢你花时间阅读本文，祝你一切顺利！
