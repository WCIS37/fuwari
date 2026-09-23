# Minerhut / Zephyr 博客项目交接说明

> 最后更新：2026-09-23  
> 项目目录：`F:\fuwari`  
> 正式域名：<https://www.minerhut.xyz/>

本文档记录当前项目真实状态，供后续开发或新的 Codex 任务快速接手。项目源自 Fuwari，但已经完成较多视觉、导航和内容结构定制，不应直接使用上游文件覆盖当前实现。

## 1. 项目概况

- 技术栈：Astro 5、Svelte 5、Tailwind CSS、Swup、Pagefind。
- 包管理器：pnpm 9。
- 部署方式：GitHub 仓库连接 Cloudflare Pages。
- Astro `site` 已设置为 `https://www.minerhut.xyz/`，RSS、Sitemap、SEO 和版权卡片均生成正式链接。
- 首页标题：`Zephyr`；顶部品牌：`Minerhut`；作者：`Mineroid`。
- 文章目录：`src/content/posts/`。
- Banner 已关闭，页面使用独立的全屏氛围背景。

## 2. 工作区保护规则

当前工作区包含尚未统一提交的用户定制、图片、测试和文章。开始修改前必须运行：

```powershell
git status --short
```

- 不使用 `git reset --hard` 或 `git checkout --` 覆盖用户文件。
- 不覆盖 `src/assets/images/avatar.jpeg`。
- 不删除 `src/content/posts/HelloWorld.md`、`ARTICLE-WRITING-GUIDE.md` 或本文件。
- 只修改当前任务涉及的文件。
- 未经明确确认，不执行 `git push` 或 Cloudflare 部署。

## 3. 常用命令

```powershell
cd F:\fuwari
pnpm install
pnpm dev
node --test tests/*.test.mjs
pnpm check
pnpm build
pnpm preview
```

不要同时启动多个开发服务器。若端口变为 4322、4323，应先停止旧实例。

## 4. 当前页面架构

网站使用“固定主页外壳 + 局部内容切换”的结构：

- 顶部导航、全屏背景和左侧栏保持挂载。
- Swup 只替换 `main` 和 `#toc`。
- 点击文章、首页、归档或关于时，不进行整页刷新。
- URL、直接访问及浏览器前进/后退保持可用。
- 无 JavaScript 时保留原生链接作为降级方案。

关键文件：

```text
astro.config.mjs
src/layouts/Layout.astro
src/layouts/MainGridLayout.astro
src/utils/navigation-ui.mjs
```

不要给 Home、Minerhut 或内部导航添加 `data-no-swup`。旧文档中的“强制完整刷新首页”方案已经废弃。

## 5. 首页视觉设计

- 全屏蓝绿植物、水波氛围背景。
- 日间和夜间独立底图，主题切换时交叉淡变。
- 水波、植物层保留鼠标视差、漂移和呼吸效果。
- `Zephyr` 标题随滚动向左上方缩小并淡出。
- 标题滚动动画使用 `requestAnimationFrame` 插值，避免字形抖动。
- 头像、分类和标签组成手账式左侧栏，并带双叶压印。
- 文章卡片显示顺序编号和悬停效果。
- 界面栏目使用“首页”“归档”“关于”“分类”“标签”。

关键文件：

```text
src/layouts/MainGridLayout.astro
src/styles/main.css
src/components/PostCard.astro
src/components/PostPage.astro
src/components/widget/SideBar.astro
src/components/widget/Profile.astro
src/components/widget/Categories.astro
src/components/widget/Tags.astro
src/components/widget/WidgetLayout.astro
```

背景资源：

```text
src/assets/images/home/atmosphere-base.png
src/assets/images/home/atmosphere-base-night.png
src/assets/images/home/atmosphere-flow.png
src/assets/images/home/atmosphere-foliage.png
```

这些图片依靠 CSS 对称扩展画布，修改尺寸或比例后必须检查视差移动是否露出空白。

## 6. 导航与滚动修复

- `Minerhut` 和“首页”通过 Swup 返回首页，不会重复刷新。
- “归档”和“关于”也在主页外壳内平滑切换。
- GitHub 链接指向 `https://github.com/WCIS37`。
- 罗盘按钮从所有非草稿文章中随机选择一篇。
- 矿灯按钮负责浅色、深色和跟随系统主题。
- 顶部导航固定在视口顶部。
- 已删除旧导航上方的白色延伸层。
- 页面带纵向 overscroll 防护，避免上拉时白块和标题重叠。
- 标题锚点带 5.5rem 顶部补偿，目录跳转不会被固定导航遮挡。

相关文件：

```text
src/components/Navbar.astro
src/components/LightDarkSwitch.svelte
src/styles/main.css
src/styles/markdown.css
src/assets/icons/compass.svg
src/assets/icons/miner-lamp-off.svg
src/assets/icons/miner-lamp-on.svg
```

## 7. 页面切换动画

当前使用轻量水波揭示：旧内容轻微缩小淡出，蓝绿色水波横向扫过，新内容从轻微放大恢复。背景、导航和侧栏不参与替换。

`prefers-reduced-motion: reduce` 下会关闭水波和缩放，只保留极短淡变。顶部仍保留细线式路由进度提示。

相关文件：

```text
src/styles/transition.css
src/layouts/MainGridLayout.astro
```

修改动画时应测试：首页 → 文章、文章 → 首页、首页 → 归档、首页 → 关于以及浏览器前进/后退。

## 8. 搜索

搜索由 Pagefind 提供。开发模式不会生成真实索引，验证真实搜索必须运行：

```powershell
pnpm build
pnpm preview
```

生产构建会在 `dist/pagefind/` 生成索引。`dist/` 是可重建目录，不应提交 Git。

## 9. 个人资料与 About

个人资料位于 `src/config.ts` 的 `profileConfig`。当前头像：

```text
src/assets/images/avatar.jpeg
```

About 正文：

```text
src/content/spec/about.md
```

## 10. 文章管理

当前保留的正式文章：

```text
src/content/posts/HelloWorld.md
```

模板演示文章已经清理。详细写作与发布说明位于：

```text
ARTICLE-WRITING-GUIDE.md
```

创建文章：

```powershell
pnpm new-post -- my-new-post
```

生产环境隐藏 `draft: true` 的文章，开发环境仍显示草稿；文章按照 `published` 从新到旧排序。

## 11. 文章版权卡片

文章末尾版权模块保持启用，显示文章标题、正式链接、作者、发布时间和 `CC BY-NC-SA 4.0`。

相关文件：

```text
src/config.ts
src/components/misc/License.astro
```

本地开发显示 `localhost:4321` 是正常现象；生产构建使用 `https://www.minerhut.xyz/`。

## 12. Cloudflare Pages 发布

Cloudflare Pages 已连接 GitHub 仓库并绑定 `www.minerhut.xyz`。发布前应依次运行自动测试、`pnpm check` 和 `pnpm build`，检查 `git status` 后再提交并推送到 Cloudflare 监听的分支。

项目不再使用 Vercel，空的 `vercel.json` 已清理。

## 13. 测试要求

```text
tests/home-design.test.mjs
tests/navigation-ui.test.mjs
tests/css-build-compat.test.mjs
```

发布前至少运行：

```powershell
node --test tests/*.test.mjs
pnpm check
pnpm build
```

`pnpm check` 可能显示 Expressive Code 插件中 `_cssVar` 未使用的提示；它不是错误。构建时也可能显示 Browserslist 数据较旧的提醒，不影响成功构建。

## 14. 已清理的遗留内容

- 模板演示文章及对应封面。
- 未引用的演示头像和 DisplaySettings 组件。
- 空的 Vercel 配置。
- 已完成的临时设计方案文档。
- 未引用的文章字段说明截图。
- 可重建的本地构建产物和缓存。

上游多语言 README、贡献说明和 GitHub Actions 暂时保留，避免 README 链接失效并继续提供构建检查。

## 15. 新任务建议开场提示

> 请先完整阅读 `F:\fuwari\PROJECT-HANDOFF.md`，再运行 `git status --short` 检查当前工作区。这个项目是基于 Fuwari 深度定制的 Minerhut / Zephyr 博客，请保留固定主页外壳、Swup 局部内容切换、首页日夜背景、鼠标视差、标题滚动动画、手账侧栏、水波页面过渡、随机文章罗盘和矿灯主题按钮。不要覆盖已有未提交修改，也不要未经确认推送到 GitHub。
