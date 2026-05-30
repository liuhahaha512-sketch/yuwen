# 古文互动学习

一个纯静态的古文互动学习网站，提供原文阅读、译文对照、字词词典、文学手法分析、测验和笔记等学习功能。

**在线预览：** <https://liuhahaha512-sketch.github.io/yuwen/>

## 特性

- 📖 **原文与译文对照** — 逐段展示原文和现代汉语翻译
- 💡 **悬浮注释** — 鼠标悬停查看字词解释
- 🧩 **互动测验** — 每篇篇目配有随堂小测和综合测验
- 🎮 **趣味互动** — 修辞手法识别小游戏
- 📝 **学习笔记** — 基于 `localStorage` 的个人笔记，关闭页面后仍保留
- 🏆 **阅读徽章** — 记录学习进度与成就

## 架构

```
index.html          # 首页 — 文章卡片列表
common.css          # 文章页通用样式（CSS 自定义属性做主题色）
common.js           # 通用交互逻辑（侧边栏、测验、悬浮注释、笔记等）
mulanci.html        # 文章：《木兰辞》（北朝乐府民歌）
yueyanglouji.html   # 文章：《岳阳楼记》（范仲淹）
```

无构建步骤、无打包器，纯静态文件。

## 开发

### 本地运行

```bash
python3 -m http.server 8765
```

然后浏览器访问 `http://localhost:8765`。

### 代码检查

```bash
# HTML
npx --yes htmlhint *.html

# CSS
npx --yes stylelint common.css

# JS
npx --yes eslint common.js
```

### 新增一篇篇目

1. 复制 `mulanci.html` 作为模板，重命名为新篇目文件名
2. 在 `<body>` 前定义 `window.PAGE_CONFIG` 对象，设置 `accent`、`progressGradient`、`timelineGradient`、`quizName`、`storagePrefix`
3. 替换原文、译文、测验等内容
4. 在首页 `index.html` 添加对应的 `<a class="article-card">` 卡片

## 协作

- 所有交互使用中文
- 主题色跟随篇目：《木兰辞》用红色（`#c0392b`），《岳阳楼记》用绿色（`#2c5f2d`）
- 代码注释使用中文
