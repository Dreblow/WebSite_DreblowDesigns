---
title: Markdown Editor
description: Learn to create your own Markdown editor in a popular language, with spell check!
keywords: Linux, Guide, How-to, Markdown, Software, Developer, Python, Swift, C#
author: Derek Dreblow
version: 2026-09-05
machine: mixed
categories:
  - Linux
  - Markdown
  - Software
tags:
  - Developer
  - Python
  - Swift
  - C#
---
<!-- render: git-wiki-style-blog -->
# Markdown Editor
Welcome to the first Dreblow Designs Web Tool!

This Markdown editor is a live playground for writing Markdown, checking spelling, and seeing the rendered result in real time.

The inspiration for this tool came from something I genuinely love doing: writing up my solutions on LeetCode. I enjoy documenting the intuition, approach, complexity, and code almost as much as solving the problem itself.

There is just one little problem: **no spell checker!**

So I thought, why not build my own Markdown editor? Better yet, make it a tool that I can actually use, share it with anyone else who finds it useful, and show how to create one yourself along the way.

This editor is built on **[Monaco Editor](https://github.com/microsoft/monaco-editor)**, the open-source code editor that powers Visual Studio Code. I’m using Monaco as the editing foundation, then layering on my own Markdown preview, spell checking via **[Typo.js](https://github.com/cfinke/Typo.js)**, learned-word support (aka local storage), download tools, styling (coming soon), and other Dreblow Designs features around it.

Use the editor below to try it out!

<!-- render: blank-template -->