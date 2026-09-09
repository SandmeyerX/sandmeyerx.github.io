---
author: Simon Smale
pubDatetime: 2024-01-03T20:40:08Z
modDatetime: 2024-01-08T18:59:05Z
title: 如何使用 Git Hooks 设置创建和修改日期
featured: false
draft: false
tags:
  - docs
  - FAQ
canonicalURL: https://smale.codes/posts/setting-dates-via-git-hooks/
description: 如何使用 Git Hooks 在 AstroPaper 上设置创建日期和修改日期
---

在本文中，我将解释如何使用 pre-commit Git hook 来自动填写 AstroPaper 博客主题 frontmatter 中的创建日期（`pubDatetime`）和修改日期（`modDatetime`）

## Table of contents

## 让它无处不在

[Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) 非常适合自动化任务，比如[将](https://gist.github.com/SSmale/3b380e5bbed3233159fb7031451726ea)或[检查](https://itnext.io/using-git-hooks-to-enforce-branch-naming-policy-ffd81fa01e5e)分支名称添加到提交消息中，或者[阻止你提交纯文本密钥](https://gist.github.com/SSmale/367deee757a9b2e119d241e120249000)。它们最大的缺点是客户端钩子是按机器设置的。

你可以通过拥有一个 `hooks` 目录并手动将其复制到 `.git/hooks` 目录或设置符号链接来解决这个问题，但这都需要你记得设置，而这并不是我擅长的事情。

由于这个项目使用了 npm，我们可以利用一个名为 [Husky](https://typicode.github.io/husky/) 的包（这在 AstroPaper 中已经安装）来自动为我们安装钩子。

> 更新！在 AstroPaper [v4.3.0](https://github.com/satnaing/astro-paper/releases/tag/v4.3.0) 中，pre-commit 钩子已被移除，改用 GitHub Actions。不过，你可以自己轻松[安装 Husky](https://typicode.github.io/husky/get-started.html)。

## 钩子

由于我们希望这个钩子在提交代码时运行以更新日期，然后将其作为我们更改的一部分，我们将使用 `pre-commit` 钩子。AstroPaper 项目已经设置好了这个钩子，但如果还没有设置，你需要运行 `npx husky add .husky/pre-commit 'echo "This is our new pre-commit hook"'`。

导航到 `hooks/pre-commit` 文件，我们将添加以下一个或两个代码片段。

### 在文件编辑时更新修改日期

---

更新：

本节已更新为更智能的新版本钩子。它现在不会在文章发布前增加 `modDatetime`。首次发布时，将草稿状态设置为 `first`，然后等待生效。

---

```shell
# 修改的文件，更新 modDatetime
git diff --cached --name-status |
grep -i '^M.*\.md$' |
while read _ file; do
  filecontent=$(cat "$file")
  frontmatter=$(echo "$filecontent" | awk -v RS='---' 'NR==2{print}')
  draft=$(echo "$frontmatter" | awk '/^draft: /{print $2}')
  if [ "$draft" = "false" ]; then
    echo "$file modDateTime 已更新"
    cat $file | sed "/---.*/,/---.*/s/^modDatetime:.*$/modDatetime: $(date -u "+%Y-%m-%dT%H:%M:%SZ")/" > tmp
    mv tmp $file
    git add $file
  fi
  if [ "$draft" = "first" ]; then
    echo "$file 首次发布，draft 设为 false 且 modDateTime 已移除"
    cat $file | sed "/---.*/,/---.*/s/^modDatetime:.*$/modDatetime:/" | sed "/---.*/,/---.*/s/^draft:.*$/draft: false/" > tmp
    mv tmp $file
    git add $file
  fi
done
```

`git diff --cached --name-status` 从 git 中获取已暂存待提交的文件。输出如下：

```shell
A       src/content/blog/setting-dates-via-git-hooks.md
```

开头的字母表示采取了什么操作，在上面的示例中，文件已被添加。已修改的文件显示为 `M`

我们将该输出通过管道传递给 grep 命令，逐行查找已修改的文件。该行需要以 `M` 开头（`^(M)`），后面可以有任意字符（`*`），并以 `.md` 文件扩展名结尾（`.(md)$`）。这将过滤出非修改的 markdown 文件 `egrep -i "^(M).*\.(md)$"`。

---

#### 改进 - 更加明确

可以添加仅查找 `blog` 目录中的 markdown 文件，因为只有这些文件才有正确的 frontmatter

---

正则表达式将捕获两个部分，字母和文件路径。我们将把这个列表通过管道传递到 while 循环中，遍历匹配的行，将字母赋值给 `a`，路径赋值给 `b`。我们现在将忽略 `a`。

要了解文件的草稿状态，我们需要它的 frontmatter。在以下代码中，我们使用 `cat` 获取文件内容，然后使用 `awk` 在 frontmatter 分隔符（`---`）处分割文件，并获取第二个块（frontmatter，即 `---` 之间的部分）。从这里我们再次使用 `awk` 查找 draft 键并打印其值。

```shell
  filecontent=$(cat "$file")
  frontmatter=$(echo "$filecontent" | awk -v RS='---' 'NR==2{print}')
  draft=$(echo "$frontmatter" | awk '/^draft: /{print $2}')
```

现在我们有了 `draft` 的值，我们将执行 3 种操作之一：将 modDatetime 设置为当前时间（当 draft 为 false 时 `if [ "$draft" = "false" ]; then`），清空 modDatetime 并将 draft 设为 false（当 draft 设为 first 时 `if [ "$draft" = "first" ]; then`），或者不执行任何操作（其他情况）。

接下来的 sed 命令对我来说有点神奇，因为我并不经常使用它，它是从[另一篇执行类似操作的博客文章](https://mademistakes.com/notes/adding-last-modified-timestamps-with-git/)中复制的。本质上，它在文件的 frontmatter 标签（`---`）内查找 `pubDatetime:` 键，获取整行并将其替换为 `pubDatetime: $(date -u "+%Y-%m-%dT%H:%M:%SZ")/"` 相同的键和正确格式化的当前日期时间。

这个替换是在整个文件的上下文中进行的，所以我们将其放入临时文件（`> tmp`），然后移动（`mv`）新文件到旧文件的位置，覆盖它。然后将其添加到 git 中，就像我们自己做了更改一样。

---

#### 注意

为了让 `sed` 正常工作，frontmatter 中需要已经存在 `modDatetime` 键。你还需要进行一些其他更改才能让应用在日期为空时构建，参见[下文](#空的-moddatetime-更改)

---

### 为新文件添加日期

为新文件添加日期与上述过程相同，但这次我们查找已添加的行（`A`），并将替换 `pubDatetime` 值。

```shell
# 新文件，添加/更新 pubDatetime
git diff --cached --name-status | egrep -i "^(A).*\.(md)$" | while read a b; do
  cat $b | sed "/---.*/,/---.*/s/^pubDatetime:.*$/pubDatetime: $(date -u "+%Y-%m-%dT%H:%M:%SZ")/" > tmp
  mv tmp $b
  git add $b
done
```

---

#### 改进 - 只循环一次

我们可以在循环内使用 `a` 变量来切换，要么更新 `modDatetime`，要么添加 `pubDatetime`，一次循环完成。

---

## 填充 frontmatter

如果你的 IDE 支持代码片段，可以选择创建自定义片段来填充 frontmatter。[AstroPaper v4 将默认附带一个适用于 VSCode 的片段。](https://github.com/satnaing/astro-paper/pull/206)

<video autoplay muted="muted" controls plays-inline="true" class="border border-skin-line">
  <source src="https://github.com/satnaing/astro-paper/assets/17761689/e13babbc-2d78-405d-8758-ca31915e41b0" type="video/mp4">
</video>

## 空的 `modDatetime` 更改

为了允许 Astro 编译 markdown 并执行其操作，它需要知道 frontmatter 中期望什么。它通过 `src/content/config.ts` 中的配置来实现这一点。

为了允许该键存在但没有值，我们需要编辑第 10 行添加 `.nullable()` 函数。

```ts
const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional(), // [!code --]
      modDatetime: z.date().optional().nullable(), // [!code ++]
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      readingTime: z.string().optional(),
    }),
});
```

为了阻止 IDE 在博客引擎文件中报错，我还进行了以下操作：

1. 在 `src/layouts/Layout.astro` 的第 15 行添加 `| null`，使其如下所示

   ```typescript
   export interface Props {
     title?: string;
     author?: string;
     description?: string;
     ogImage?: string;
     canonicalURL?: string;
     pubDatetime?: Date;
     modDatetime?: Date | null;
   }
   ```

2. 在 `src/components/Datetime.tsx` 的第 5 行添加 `| null`，使其如下所示

   ```typescript
   interface DatetimesProps {
     pubDatetime: string | Date;
     modDatetime: string | Date | undefined | null;
   }
   ```
