# CLAUDE.md

本文档为 Claude Code 提供项目指引。

## 协作偏好

- **所有交互使用中文**，包括回复、commit message、代码注释等

## 项目

**古文互动学习** — 一个纯静态的古文学习网站。每篇文章页面都是独立的互动学习体验，包含原文、译文、字词词典、文学手法分析、测验和笔记功能。

## 架构

```
index.html         # 首页 — 文章卡片列表（无 JS）
common.css         # 文章页通用样式（用 CSS 变量做主题色）
common.js          # 通用交互逻辑（侧边栏、滚动、测验、工具提示、笔记）
mulanci.html       # 文章：木兰辞（北朝乐府民歌）
yueyanglouji.html  # 文章：岳阳楼记（范仲淹，北宋）
```

**配置文件：**
- `eslint.config.mjs` — ESLint 配置（ES2020，允许浏览器全局变量）
- `.stylelintrc.json` — Stylelint 规则（放宽类名/ID命名、允许重复选择器）
- `.gitignore` — Git 忽略规则
- `.github/` — GitHub CI/PR 模板

**文章页**（`mulanci.html`、`yueyanglouji.html`）是几乎自包含的 HTML，用 inline `<style>` 做页面特有样式，通过 `<link>` 引入 `common.css`，通过 `<script defer>` 引入 `common.js`。

**common.css** 使用 CSS 自定义属性做主题色：`--accent`、`--progress-gradient`、`--timeline-gradient`。每个文章页在 `<body>` 或 `:root` 上设置这些变量。

**common.js** 是一个自执行 IIFE。它期望：
- `window.PAGE_CONFIG` 对象，包含：`accent`（颜色字符串）、`progressGradient`、`timelineGradient`、`quizName`、`storagePrefix`
- 每个文章页在加载 `common.js` 前定义此对象

JS 功能：导航侧边栏、滚动定位、进度条、`.hl` 元素的悬浮注释、内联测验（`.mini-quiz`）、修辞手法小游戏（`.find-game`）、localStorage 笔记（`.notes-area`）、综合测验（`#quiz-container`）、阅读徽章、柱状图动画。

**新增一篇篇目：** 复制 `mulanci.html` 作为模板。必须定义 `PAGE_CONFIG`，引入 `common.css` 和 `common.js`。首页（`index.html`）需要添加一个新的 `<a class="article-card">` 卡片指向它。

## 开发

```bash
# 本地运行
python3 -m http.server 8765 --directory /path/to/yuwen

# HTML 检查
npx --yes htmlhint *.html

# CSS/JS 检查（使用项目配置文件）
npx --yes stylelint common.css
npx --yes eslint common.js
```

无构建步骤、无打包器、无 package.json。纯静态文件，lint 工具通过项目配置文件运行。

## 质量保障（自动 Hooks）

`.claude/settings.local.json` 配置了以下自动 hook：

- **每次修改文件后** — 自动运行 lint（htmlhint / stylelint / eslint），即时发现问题
- **git commit / git push / gh pr create 前** — 提醒先运行 `/verify` 和 `/code-review`

## 开发流程

推荐工作流：
1. 写代码 → lint 自动运行，即时反馈
2. 完成改动 → 运行 `/verify` 在浏览器中验证效果
3. 提交前 → 运行 `/code-review` 做代码审查
4. 确认无误 → git commit / git push

## 风格约定

- 中文书名用中文书名号：`《木兰辞》`
- 主题色跟随篇目：木兰辞用红色（`#c0392b`），岳阳楼记用绿色（`#2c5f2d`）
- 所有交互元素用 CSS transition，不用 JS 动画
- localStorage 的 key 通过 `storagePrefix` 做命名空间隔离（如 `mulan_xiao`、`yueyang_tianxia`）
- 代码中的注释用中文
