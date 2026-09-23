# Minerhut 博客文章编写与发布说明书

> 适用项目：`F:\fuwari`  
> 文章目录：`src/content/posts/`  
> 正式站点：<https://www.minerhut.xyz/>

这份说明书根据项目中的实际文章示例、内容字段定义和渲染代码整理。日后写文章时，可以先阅读“快速开始”和“完整文章模板”，遇到特殊排版需求时再查询对应章节。

## 详细目录

- [1. 快速开始：发布一篇新文章](#1-快速开始发布一篇新文章)
  - [1.1 使用命令自动创建文章](#11-使用命令自动创建文章)
  - [1.2 手动创建文章](#12-手动创建文章)
  - [1.3 本地预览](#13-本地预览)
- [2. 文章文件应该放在哪里](#2-文章文件应该放在哪里)
  - [2.1 单文件文章](#21-单文件文章)
  - [2.2 带图片的文章目录](#22-带图片的文章目录)
  - [2.3 文件名与访问地址](#23-文件名与访问地址)
- [3. Frontmatter：文章基本信息](#3-frontmatter文章基本信息)
  - [3.1 推荐的完整写法](#31-推荐的完整写法)
  - [3.2 字段详细说明](#32-字段详细说明)
  - [3.3 日期写法](#33-日期写法)
  - [3.4 草稿机制](#34-草稿机制)
  - [3.5 分类与标签](#35-分类与标签)
  - [3.6 语言字段](#36-语言字段)
- [4. 封面图片和正文图片](#4-封面图片和正文图片)
  - [4.1 与文章放在同一目录](#41-与文章放在同一目录)
  - [4.2 使用 public 目录中的图片](#42-使用-public-目录中的图片)
  - [4.3 使用网络图片](#43-使用网络图片)
  - [4.4 正文插图](#44-正文插图)
  - [4.5 图片使用建议](#45-图片使用建议)
- [5. 基础 Markdown 写法](#5-基础-markdown-写法)
  - [5.1 标题](#51-标题)
  - [5.2 段落和换行](#52-段落和换行)
  - [5.3 粗体、斜体、删除线和行内代码](#53-粗体斜体删除线和行内代码)
  - [5.4 无序列表与有序列表](#54-无序列表与有序列表)
  - [5.5 引用](#55-引用)
  - [5.6 分隔线](#56-分隔线)
  - [5.7 链接与文章内跳转](#57-链接与文章内跳转)
  - [5.8 表格](#58-表格)
  - [5.9 脚注](#59-脚注)
  - [5.10 转义特殊字符](#510-转义特殊字符)
- [6. 数学公式](#6-数学公式)
  - [6.1 行内公式](#61-行内公式)
  - [6.2 独立公式](#62-独立公式)
- [7. 提示框 Admonitions](#7-提示框-admonitions)
  - [7.1 支持的类型](#71-支持的类型)
  - [7.2 基本写法](#72-基本写法)
  - [7.3 自定义标题](#73-自定义标题)
  - [7.4 GitHub 风格写法](#74-github-风格写法)
- [8. 隐藏文字 Spoiler](#8-隐藏文字-spoiler)
- [9. GitHub 仓库卡片](#9-github-仓库卡片)
- [10. 代码块与 Expressive Code](#10-代码块与-expressive-code)
  - [10.1 普通代码高亮](#101-普通代码高亮)
  - [10.2 显示文件名](#102-显示文件名)
  - [10.3 编辑器框、终端框与无边框](#103-编辑器框终端框与无边框)
  - [10.4 高亮指定行](#104-高亮指定行)
  - [10.5 新增行、删除行与普通标记](#105-新增行删除行与普通标记)
  - [10.6 给标记添加说明文字](#106-给标记添加说明文字)
  - [10.7 高亮指定文字](#107-高亮指定文字)
  - [10.8 Diff 对比代码](#108-diff-对比代码)
  - [10.9 自动换行](#109-自动换行)
  - [10.10 折叠部分代码](#1010-折叠部分代码)
  - [10.11 行号与起始行号](#1011-行号与起始行号)
- [11. 嵌入视频](#11-嵌入视频)
  - [11.1 YouTube](#111-youtube)
  - [11.2 Bilibili](#112-bilibili)
  - [11.3 视频嵌入注意事项](#113-视频嵌入注意事项)
- [12. 文章排序、摘要与阅读信息](#12-文章排序摘要与阅读信息)
- [13. 本地检查与正式构建](#13-本地检查与正式构建)
  - [13.1 启动开发服务器](#131-启动开发服务器)
  - [13.2 类型和内容检查](#132-类型和内容检查)
  - [13.3 生产构建](#133-生产构建)
  - [13.4 预览生产版本](#134-预览生产版本)
- [14. 上传 GitHub 与 Cloudflare Pages 发布](#14-上传-github-与-cloudflare-pages-发布)
- [15. 常见错误与解决方法](#15-常见错误与解决方法)
- [16. 发布前检查清单](#16-发布前检查清单)
- [17. 可直接复制的完整文章模板](#17-可直接复制的完整文章模板)
- [18. 极简文章模板](#18-极简文章模板)
- [19. 项目内置示例的用途](#19-项目内置示例的用途)

## 1. 快速开始：发布一篇新文章

一篇文章本质上是 `src/content/posts/` 目录中的 Markdown 文件。文件顶部是文章信息，下面是正文。

### 1.1 使用命令自动创建文章

在项目根目录 `F:\fuwari` 打开终端，执行：

```powershell
pnpm new-post -- my-new-post
```

项目会自动创建：

```text
src/content/posts/my-new-post.md
```

自动生成的内容包含标题、发布日期、描述、封面、标签、分类、草稿状态和语言字段。

建议把 `my-new-post` 换成简短的英文名称，例如：

```powershell
pnpm new-post -- minecraft-server-guide
```

不要重复创建同名文章，否则脚本会提示文件已经存在。

### 1.2 手动创建文章

也可以手动创建文件，例如：

```text
src/content/posts/my-first-post.md
```

写入最基本的内容：

```markdown
---
title: 我的第一篇文章
published: 2026-09-23
description: 这是一篇文章简介。
tags: [生活, 随笔]
category: 日常
draft: false
---

这里开始写正文。
```

### 1.3 本地预览

保存文章后，在项目根目录运行：

```powershell
pnpm dev
```

浏览器访问：

```text
http://localhost:4321/
```

开发服务器通常会自动检测文件变化。修改并保存 Markdown 后，刷新页面即可看到结果。

## 2. 文章文件应该放在哪里

所有文章都必须放在：

```text
src/content/posts/
```

### 2.1 单文件文章

不需要本地封面或配图时，可以直接创建一个 Markdown 文件：

```text
src/content/posts/minecraft-notes.md
```

这种方式最简单，适合纯文字文章或只使用网络图片的文章。

### 2.2 带图片的文章目录

如果文章有封面和多张本地图片，推荐为文章建立单独目录：

```text
src/content/posts/minecraft-notes/
├── index.md
├── cover.jpg
├── step-1.png
└── step-2.png
```

在 `index.md` 中可以使用相对路径引用这些图片：

```yaml
image: "./cover.jpg"
```

```markdown
![第一步操作截图](./step-1.png)
```

这样文章和资源放在一起，日后移动、备份或删除时更方便。

### 2.3 文件名与访问地址

一般情况下，文件路径会成为文章地址中的 slug：

```text
src/content/posts/minecraft-notes.md
→ https://www.minerhut.xyz/posts/minecraft-notes/
```

目录形式：

```text
src/content/posts/minecraft-notes/index.md
→ https://www.minerhut.xyz/posts/minecraft-notes/
```

文件名建议：

- 使用小写英文字母、数字和连字符 `-`。
- 不使用空格。
- 尽量不使用中文文件名，避免 URL 编码后过长。
- 名称发布后尽量不要修改，否则旧链接会失效。
- 不要让 `.md` 文件和同名目录文章同时存在。

推荐：

```text
minecraft-server-guide.md
cloudflare-pages-notes/index.md
life-in-september.md
```

不推荐：

```text
我的文章 01.md
New Post!!.md
```

## 3. Frontmatter：文章基本信息

Frontmatter 位于文件最顶部，由两组 `---` 包围，使用 YAML 格式。

### 3.1 推荐的完整写法

```yaml
---
title: 我的文章标题
published: 2026-09-23
updated: 2026-09-25
description: 用一两句话概括文章内容，这段文字会显示在首页文章卡片中。
image: "./cover.jpg"
tags: [Minecraft, 教程, 建站]
category: 技术
draft: false
lang: zh_CN
---
```

注意：

- 字段名后面必须有英文冒号 `:`。
- 冒号后需要留一个空格。
- 不要使用中文冒号 `：`。
- `---` 必须单独占一行。
- 字符串包含冒号、井号或其他特殊字符时，建议加引号。

### 3.2 字段详细说明

| 字段 | 是否必填 | 类型 | 作用 | 推荐写法 |
| --- | --- | --- | --- | --- |
| `title` | 是 | 字符串 | 文章标题，显示在首页、文章页和浏览器标题中 | `title: 我的文章` |
| `published` | 是 | 日期 | 发布时间，也是文章排序依据 | `published: 2026-09-23` |
| `updated` | 否 | 日期 | 最近更新时间；修改旧文章时填写 | `updated: 2026-09-25` |
| `description` | 否 | 字符串 | 首页摘要、SEO 描述；未填写时可能使用正文摘录 | `description: "文章简介"` |
| `image` | 否 | 字符串 | 文章封面图片 | `image: "./cover.jpg"` |
| `tags` | 否 | 字符串数组 | 文章标签，可以有多个 | `tags: [教程, Astro]` |
| `category` | 否 | 字符串 | 文章分类，通常只填一个 | `category: 技术` |
| `draft` | 否 | 布尔值 | 是否为草稿 | `draft: true` |
| `lang` | 否 | 字符串 | 文章语言；空白时使用站点默认语言 | `lang: zh_CN` |

项目内部还会自动使用 `prevTitle`、`prevSlug`、`nextTitle`、`nextSlug` 生成上一篇和下一篇链接。写文章时不要手动填写这些字段。

### 3.3 日期写法

最推荐的日期格式：

```yaml
published: 2026-09-23
updated: 2026-09-25
```

也支持带具体时间的 ISO 格式：

```yaml
published: 2026-09-23T14:30:00+08:00
```

注意：项目会按照 `published` 从新到旧排列文章，但当前逻辑不会因为发布日期在未来就自动隐藏文章。需要定时发布时，应先保持：

```yaml
draft: true
```

到发布时间后再改为 `false` 并推送。

### 3.4 草稿机制

未完成的文章设置为：

```yaml
draft: true
```

行为如下：

- 本地开发环境中仍能看到草稿，便于预览。
- 正式生产构建时会过滤草稿。
- 草稿不会出现在正式首页、归档和标签统计中。

正式发布时改为：

```yaml
draft: false
```

也可以不写 `draft`，项目默认值为 `false`。不过为了避免误发布，建议始终明确填写。

### 3.5 分类与标签

分类通常用于表示文章的大方向，一篇文章只填一个：

```yaml
category: 技术
```

标签用于描述更具体的主题，可以有多个：

```yaml
tags: [Astro, Cloudflare, 博客]
```

建议提前确定一套稳定命名，避免出现含义相同但写法不同的标签，例如：

```text
Cloudflare / cloudflare / CloudFlare
```

它们可能被当作不同标签。建议统一使用 `Cloudflare`。

没有分类时可以写：

```yaml
category: ""
```

没有标签时可以写：

```yaml
tags: []
```

### 3.6 语言字段

中文文章推荐：

```yaml
lang: zh_CN
```

英文文章可以写：

```yaml
lang: en
```

不填写或留空时，会使用项目的默认站点语言：

```yaml
lang: ""
```

## 4. 封面图片和正文图片

### 4.1 与文章放在同一目录

推荐目录：

```text
src/content/posts/my-post/
├── index.md
└── cover.jpg
```

Frontmatter：

```yaml
image: "./cover.jpg"
```

这是最推荐的做法，因为图片会跟随文章一起管理，并由 Astro 构建流程处理。

### 4.2 使用 public 目录中的图片

如果图片放在：

```text
public/images/posts/my-cover.jpg
```

则写成：

```yaml
image: "/images/posts/my-cover.jpg"
```

以 `/` 开头表示从网站根目录读取。

### 4.3 使用网络图片

```yaml
image: "https://example.com/images/cover.jpg"
```

使用外部图片时请确认：

- 图片允许外链。
- 图片地址使用 HTTPS。
- 图片不会很快失效。
- 你有权使用这张图片。

长期使用时，更建议把图片保存到自己的项目中。

### 4.4 正文插图

Markdown 图片语法：

```markdown
![图片说明](./step-1.png)
```

网络图片：

```markdown
![远程图片说明](https://example.com/image.png)
```

`[]` 中的图片说明不要留空。它有助于无障碍阅读，也能在图片加载失败时说明图片内容。

### 4.5 图片使用建议

- 封面优先使用 JPG、PNG 或 WebP。
- 截图建议使用 PNG 或 WebP。
- 照片建议使用 JPG 或 WebP。
- 上传前压缩大图，避免页面加载过慢。
- 文件名使用小写英文和连字符，例如 `server-settings.png`。
- 不要直接粘贴本机绝对路径，例如 `C:\Users\...\image.png`，线上无法访问该路径。

## 5. 基础 Markdown 写法

### 5.1 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

文章页面已经单独显示 Frontmatter 中的 `title`，因此正文通常建议从二级标题 `##` 开始，避免同一页面出现两个主标题。

标题会自动生成锚点，右侧目录也会读取标题结构。标题层级应连续，不要从 `##` 直接跳到 `####`。

### 5.2 段落和换行

段落之间留一个空行：

```markdown
这是第一段。

这是第二段。
```

不要只按一次回车就期待生成新段落。

### 5.3 粗体、斜体、删除线和行内代码

```markdown
**粗体文字**
_斜体文字_
~~删除线文字~~
`pnpm build`
```

### 5.4 无序列表与有序列表

无序列表：

```markdown
- 第一项
- 第二项
  - 第二项的子项
- 第三项
```

有序列表：

```markdown
1. 第一步
2. 第二步
3. 第三步
```

列表中的子内容建议缩进四个空格。

### 5.5 引用

```markdown
> 这是一段引用。
>
> 引用中也可以包含多个段落。
```

### 5.6 分隔线

```markdown
---
```

Frontmatter 结束后也使用 `---`，但它只在文件最顶部承担 Frontmatter 边界的作用。

### 5.7 链接与文章内跳转

普通链接：

```markdown
[访问 Minerhut](https://www.minerhut.xyz/)
```

跳转到当前文章中的标题：

```markdown
[跳转到安装步骤](#安装步骤)
```

标题锚点通常由标题文字自动生成。中文标题可以使用，但如果文章链接需要长期分享，英文或简短稳定的标题更容易维护。

### 5.8 表格

推荐使用标准的竖线表格：

```markdown
| 名称 | 作用 | 是否必填 |
| --- | --- | --- |
| title | 文章标题 | 是 |
| tags | 文章标签 | 否 |
```

对齐方式：

```markdown
| 左对齐 | 居中 | 右对齐 |
| :--- | :---: | ---: |
| 内容 | 内容 | 100 |
```

示例文章 `markdown.md` 中还包含 Pandoc 风格表格和定义列表，但当前博客基于 Astro Markdown，不能保证所有 Pandoc 专用语法都按预期渲染。日常写作应优先使用上面的标准竖线表格。

### 5.9 脚注

```markdown
这里引用一个补充说明[^1]。

[^1]: 这里是脚注内容。
```

如果构建或预览时发现脚注未按预期显示，可以改成普通链接或文章末尾的“补充说明”章节；不要只依赖某个编辑器的预览结果。

### 5.10 转义特殊字符

如果想原样显示 Markdown 特殊字符，可以在前面加反斜杠：

```markdown
\*这段文字不会变成斜体\*
\`这段文字不会变成代码\`
```

## 6. 数学公式

项目已启用数学公式支持，并使用 KaTeX 渲染。

### 6.1 行内公式

```markdown
角速度公式为 $\omega = d\phi / dt$。
```

### 6.2 独立公式

```markdown
$$
I = \int \rho R^{2} dV
$$
```

复杂公式也可以使用 LaTeX 语法：

```markdown
$$
\begin{equation*}
E = mc^2
\end{equation*}
$$
```

## 7. 提示框 Admonitions

### 7.1 支持的类型

项目支持五种提示框：

| 类型 | 用途 |
| --- | --- |
| `note` | 普通补充信息 |
| `tip` | 建议和技巧 |
| `important` | 必须注意的重要内容 |
| `warning` | 风险警告 |
| `caution` | 可能造成负面结果的操作 |

### 7.2 基本写法

```markdown
:::note
这里是普通说明。
:::

:::tip
这里是实用技巧。
:::

:::important
这里是重要内容。
:::

:::warning
这里是风险警告。
:::

:::caution
这里是谨慎操作说明。
:::
```

开头和结尾的三个冒号必须单独占一行。

### 7.3 自定义标题

```markdown
:::note[准备工作]
开始操作前，请先备份配置文件。
:::
```

### 7.4 GitHub 风格写法

项目也支持 GitHub 风格：

```markdown
> [!NOTE]
> 这里是普通说明。

> [!TIP]
> 这里是技巧。

> [!WARNING]
> 这里是警告。
```

两种写法都可以。为了方便添加自定义标题，推荐优先使用 `:::note` 形式。

## 8. 隐藏文字 Spoiler

隐藏部分内容，读者悬停后显示：

```markdown
答案是 :spoiler[这里的隐藏内容]。
```

隐藏内容中可以使用部分 Markdown：

```markdown
结局是 :spoiler[主角最终获得了 **胜利**]。
```

不要把关键操作步骤只放在 Spoiler 中，因为触屏设备没有传统鼠标悬停体验。

## 9. GitHub 仓库卡片

使用以下语法插入 GitHub 仓库卡片：

```markdown
::github{repo="saicaca/fuwari"}
```

替换为自己的仓库：

```markdown
::github{repo="用户名/仓库名"}
```

卡片会在浏览器加载页面时请求 GitHub API 获取仓库信息，因此：

- 仓库必须存在并且可公开访问。
- 用户名和仓库名必须准确。
- 网络受限或 GitHub API 暂时不可用时，卡片信息可能加载失败。
- 不要把私有仓库信息放进公开文章。

## 10. 代码块与 Expressive Code

代码围栏由三个反引号组成。开头反引号后写语言名称，可以启用语法高亮。

### 10.1 普通代码高亮

````markdown
```javascript
console.log("Hello, world!");
```
````

常用语言标识：

```text
javascript  typescript  html  css  json  yaml
bash        shell       powershell
python      java        csharp
```

### 10.2 显示文件名

````markdown
```javascript title="src/main.js"
console.log("显示文件名");
```
````

### 10.3 编辑器框、终端框与无边框

Shell 语言通常显示为终端框：

````markdown
```bash
pnpm build
```
````

强制不显示框架：

````markdown
```bash frame="none"
pnpm build
```
````

强制使用代码编辑器框：

````markdown
```powershell frame="code" title="PowerShell Profile.ps1"
Write-Output "Hello"
```
````

### 10.4 高亮指定行

高亮第 1、4、7 到 8 行：

````markdown
```javascript {1,4,7-8}
const one = 1;
const two = 2;
const three = 3;
console.log(one);
const five = 5;
const six = 6;
console.log("seven");
console.log("eight");
```
````

### 10.5 新增行、删除行与普通标记

````markdown
```javascript title="config.js" del={2} ins={3-4} {6}
function demo() {
  console.log("这行标记为删除");
  console.log("这行标记为新增");
  console.log("这一行也标记为新增");

  return "这一行是普通高亮";
}
```
````

- `{6}`：普通高亮。
- `ins={3-4}`：新增行。
- `del={2}`：删除行。

### 10.6 给标记添加说明文字

````markdown
```javascript {"1. 修改这里":2} ins={"2. 加入新配置":4-5}
const config = {
  oldValue: true,
  name: "demo",
  newValue: true,
  enabled: true,
};
```
````

引号中的文字会作为标记说明。

### 10.7 高亮指定文字

高亮普通文字：

````markdown
```javascript "importantValue"
const importantValue = true;
```
````

使用正则表达式：

````markdown
```javascript /value[0-9]/
const value1 = 1;
const value2 = 2;
```
````

区分新增、删除和普通文字标记：

````markdown
```javascript "return true;" ins="newValue" del="oldValue"
const oldValue = false;
const newValue = true;
return true;
```
````

### 10.8 Diff 对比代码

````markdown
```diff
-const enabled = false;
+const enabled = true;
```
````

需要同时使用某种语言的语法高亮时：

````markdown
```diff lang="javascript"
-console.log("旧内容");
+console.log("新内容");
```
````

### 10.9 自动换行

启用换行：

````markdown
```javascript wrap
const message = "这是一段可能超过页面宽度的长文字";
```
````

关闭换行：

````markdown
```javascript wrap=false
const message = "这是一段可能超过页面宽度的长文字";
```
````

保留或关闭换行后的缩进：

```text
wrap preserveIndent
wrap preserveIndent=false
```

### 10.10 折叠部分代码

折叠第 1 到 5 行以及第 12 到 14 行：

````markdown
```javascript collapse={1-5,12-14}
// 很长的初始化代码
// ……
```
````

折叠适合隐藏样板代码，但文章关键步骤不要默认折叠。

### 10.11 行号与起始行号

显示行号：

````markdown
```javascript showLineNumbers
console.log("第 1 行");
console.log("第 2 行");
```
````

指定从第 5 行开始：

````markdown
```javascript showLineNumbers startLineNumber=5
console.log("这里显示为第 5 行");
```
````

关闭行号：

````markdown
```javascript showLineNumbers=false
console.log("不显示行号");
```
````

## 11. 嵌入视频

项目允许在 Markdown 中直接使用 HTML `iframe`。

### 11.1 YouTube

```html
<iframe
  width="100%"
  height="468"
  src="https://www.youtube.com/embed/视频ID"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen>
</iframe>
```

不要粘贴普通观看地址，应使用平台提供的“嵌入”地址。

### 11.2 Bilibili

```html
<iframe
  width="100%"
  height="468"
  src="https://player.bilibili.com/player.html?bvid=视频BV号&p=1"
  title="Bilibili video player"
  scrolling="no"
  frameborder="0"
  allowfullscreen>
</iframe>
```

示例文章中使用了以 `//player.bilibili.com` 开头的协议相对地址。为了避免不同环境行为不一致，推荐明确使用 `https://`。

### 11.3 视频嵌入注意事项

- `width="100%"` 可以让视频适应文章宽度。
- 固定 `height="468"` 在手机上可能显得较高；发布前应检查移动端效果。
- `title` 用于无障碍说明，不应省略。
- 视频能否播放取决于平台、网络区域和视频权限。
- 不要使用自动播放，避免影响读者体验。
- 只嵌入可信来源，避免把未知网页放入 iframe。

## 12. 文章排序、摘要与阅读信息

- 首页文章按照 `published` 从新到旧排列。
- `updated` 只表示更新时间，不负责首页排序。
- `description` 会优先作为首页文章摘要。
- 未填写 `description` 时，项目可能使用自动生成的正文摘录。
- 项目会自动统计字数和预计阅读时间，不需要手动填写。
- 文章末尾会自动显示作者、原文链接、发布日期和许可协议。
- 文章页底部的上一篇、下一篇由发布日期排序自动生成。

为了让首页卡片清晰，`description` 建议控制在一到两句话内，不要在其中使用复杂 Markdown。

## 13. 本地检查与正式构建

以下命令都应在项目根目录执行：

```text
F:\fuwari
```

### 13.1 启动开发服务器

```powershell
pnpm dev
```

默认地址：

```text
http://localhost:4321/
```

这里出现 `localhost` 只代表本地预览。部署到 Cloudflare Pages 后，正式链接会使用：

```text
https://www.minerhut.xyz/
```

### 13.2 类型和内容检查

```powershell
pnpm check
```

这个命令可以发现：

- Frontmatter 字段类型错误。
- Astro 文件的类型问题。
- 部分构建前错误。

### 13.3 生产构建

```powershell
pnpm build
```

构建结果输出到：

```text
dist/
```

该命令还会生成 Pagefind 搜索索引。推送前最好至少成功运行一次。

### 13.4 预览生产版本

先构建，再运行：

```powershell
pnpm preview
```

生产预览更接近 Cloudflare Pages 上的最终结果，适合检查：

- 草稿是否被隐藏。
- 页面链接是否正确。
- 搜索是否可用。
- 图片是否丢失。
- 视频是否能正常显示。

## 14. 上传 GitHub 与 Cloudflare Pages 发布

你的 Cloudflare Pages 已经连接 GitHub 仓库，并绑定正式域名 `www.minerhut.xyz`。因此日常发布流程是：

1. 在 `src/content/posts/` 新建或修改文章。
2. 运行 `pnpm dev` 检查页面效果。
3. 运行 `pnpm check`。
4. 运行 `pnpm build`。
5. 确认文章的 `draft` 已设置为 `false`。
6. 将变更提交到 Git。
7. 推送到 Cloudflare Pages 所连接的 GitHub 分支。
8. 等待 Cloudflare Pages 自动构建和部署。
9. 打开 `https://www.minerhut.xyz/` 检查线上文章。

常用 Git 命令示例：

```powershell
git status
git add src/content/posts
git commit -m "content: publish new post"
git push
```

注意：执行 `git add src/content/posts` 会加入该目录下所有文章变更。提交前务必先运行 `git status`，确认没有把未完成的草稿、私人图片或无关文件一起上传。

## 15. 常见错误与解决方法

### 文章构建时报日期错误

检查是否使用了有效日期：

```yaml
published: 2026-09-23
```

不要写：

```yaml
published: 2026年9月23日
```

### 文章意外出现在正式网站

未完成时应设置：

```yaml
draft: true
```

### 草稿在本地仍然可见

这是项目的正常行为。本地开发会显示草稿，生产构建才会过滤草稿。

### 首页没有显示新文章

依次检查：

1. 文件是否位于 `src/content/posts/`。
2. Frontmatter 是否有正确的 `title` 和 `published`。
3. `draft` 是否为 `true`。
4. 开发服务器或生产构建是否报错。

### 封面图片不显示

检查：

- 相对图片是否和文章放在正确目录。
- 路径大小写是否完全一致。
- Windows 上可用的路径不一定能在 Linux 构建环境中容忍大小写错误。
- `public` 图片路径是否以 `/` 开头。
- 不要使用本机绝对路径。

### YAML 解析失败

含冒号的文本应加引号：

```yaml
title: "教程：如何创建博客文章"
```

数组应使用：

```yaml
tags: [教程, 博客]
```

不要混用 Tab 缩进和空格缩进。

### 代码块后面的正文也变成代码

确认代码块结尾有三个反引号：

````markdown
```javascript
console.log("Hello");
```

这里恢复为正文。
````

### 提示框没有结束

确认结尾有单独一行 `:::`：

```markdown
:::note
提示内容
:::
```

### GitHub 卡片不显示数据

确认仓库是公开的、`用户名/仓库名` 正确，并检查是否能正常访问 GitHub API。

### 本地显示 localhost

本地运行 `pnpm dev` 时显示 `http://localhost:4321/` 是正常的。正式构建和线上访问会使用 `https://www.minerhut.xyz/`。

## 16. 发布前检查清单

每次发布文章前，可以逐项确认：

- [ ] 文件位于 `src/content/posts/` 中。
- [ ] 文件名使用小写英文、数字和连字符。
- [ ] `title` 已填写且没有错别字。
- [ ] `published` 日期正确。
- [ ] 修改旧文章时填写了 `updated`。
- [ ] `description` 能清楚概括文章。
- [ ] 分类和标签使用统一命名。
- [ ] 准备发布时 `draft: false`。
- [ ] 中文文章设置了 `lang: zh_CN`。
- [ ] 封面和正文图片在本地能够显示。
- [ ] 图片没有使用本机绝对路径。
- [ ] 标题层级连续，正文通常从 `##` 开始。
- [ ] 所有代码块、提示框和数学公式都正确闭合。
- [ ] 外部链接和视频地址可以访问。
- [ ] 没有提交密码、令牌、邮箱隐私或其他敏感信息。
- [ ] `pnpm check` 没有错误。
- [ ] `pnpm build` 构建成功。
- [ ] `git status` 中没有无关文件。
- [ ] 推送后在正式网站检查了文章页面。

## 17. 可直接复制的完整文章模板

````markdown
---
title: "文章标题"
published: 2026-09-23
updated: 2026-09-23
description: "用一到两句话介绍这篇文章的内容。"
image: "./cover.jpg"
tags: [教程, 示例]
category: 技术
draft: true
lang: zh_CN
---

这里写文章开头。简单说明文章要解决的问题，以及读者能获得什么。

:::note[阅读说明]
这里可以写阅读前需要了解的信息。
:::

## 准备工作

开始前需要准备：

- 第一项准备内容
- 第二项准备内容
- 第三项准备内容

## 操作步骤

### 第一步

说明第一步操作。

```powershell title="PowerShell"
pnpm dev
```

### 第二步

说明第二步操作。

![第二步操作截图](./step-2.png)

:::warning
这里填写可能导致错误或数据丢失的注意事项。
:::

## 配置示例

```javascript title="config.js" showLineNumbers {2} ins={3}
const config = {
  site: "https://www.minerhut.xyz/",
  enabled: true,
};
```

## 常见问题

### 问题一

这里填写解决方法。

### 问题二

这里填写解决方法。

## 总结

总结文章完成了什么，并给出下一步建议。
````

发布时记得将：

```yaml
draft: true
```

改为：

```yaml
draft: false
```

如果没有封面图片，可以把 `image` 改为空字符串：

```yaml
image: ""
```

## 18. 极简文章模板

适合随笔和短文章：

```markdown
---
title: "文章标题"
published: 2026-09-23
description: "文章简介"
tags: [随笔]
category: 日常
draft: true
lang: zh_CN
---

这里开始写正文。
```

## 19. 项目内置示例的用途

需要查看更多原始例子时，可以参考：

| 文件 | 主要内容 |
| --- | --- |
| `src/content/posts/draft.md` | 草稿文章的使用方法 |
| `src/content/posts/guide/index.md` | Frontmatter、文章目录和封面图片 |
| `src/content/posts/markdown.md` | 基础 Markdown 和数学公式 |
| `src/content/posts/markdown-extended.md` | 提示框、GitHub 卡片和 Spoiler |
| `src/content/posts/expressive-code.md` | 代码块高亮、标记、折叠和行号 |
| `src/content/posts/video.md` | YouTube 和 Bilibili 视频嵌入 |

如果示例文章与本说明书存在差异，优先以项目当前构建结果和 `src/content/config.ts` 中的字段定义为准。
