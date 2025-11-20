---
title: Git Essentials Cheat Sheet
description: A clean, practical Git cheat sheet covering daily terminal workflows and essential .gitignore patterns.
keywords: git, git cheat sheet, git ignore, git commands, linux git, github, version control
author: Derek Dreblow
version: 2025-11-19
machine:
categories:
  - Git
  - Software Development
tags:
  - Git
  - GitIgnore
  - Version Control
  - CLI
  - Cheat Sheet
---

# Git - Maybe a cheat sheet
TLDR:
Lets talk about Git commands for linux terminal and git ignore file.

I think like most people, we all end up using GUI applications (like [SmartGit](https://www.smartgit.dev) or [Git-Fork](https://git-fork.com)) to do our git actions. In this blog post, I want to provide some stragiht forward commands to let you move on to the next thing in your jou Journey. 

Also some nice to knows about the .gitignore file that beginners may like to know quickly.

---

## Table of Contents
- [Cheat Sheet](#cheat-sheet)
- [Single Liner](#single-liner)
- [.gitignore](#gitignore)

---

## 📄 Cheat Sheet
#### Check current status
```bash
git status
```

#### Check what branch you're on
```bash
git branch
```

#### Always pull the newest changes from origin (fast-forward only)
```bash
git pull --ff-only
```

#### If you prefer forcing your local branch to match origin:
```bash
git fetch origin
git reset --hard origin/main     # Replace 'main' with your branch
```

#### Add all changes
```bash
git add .
```

#### Commit with a message
```bash
git commit -m "Your commit message here"
```

#### Push to origin
```bash
git push origin HEAD
```

---

## Single Liner
Maybe for the future, single line deployment:
```bash
git pull --ff-only && git add . && git commit -m "update" && git push
```

Or, if you want the force-sync first:
```bash
git fetch origin && git reset --hard origin/main && git add . && git commit -m "update" && git push
```

---

## 📁 .gitignore
#### Ignore everything in a folder except one file
```bash
/folder/*
!/folder/keep-me.txt
```

#### Ignore everything and subfolders too
```bash
**/folder/*
```

Without the `/*` at the end, it'll ignore everything regardless if you ass to negate ignore with the `!`

#### General ignores 
Lots of projects and sites usually give you a .gitignore ready to go to easily kick off your project, even by language type. Eg, starting a Rust project versus C# project, different things are ignored. How and where? When creating a project in GitHub, you'll see your repo being kicked off with a chance to select a pre-made gitignore file for you. 

Anyways! Below is a taste just in case you don't run into this. This really serves beginners, but you beginner, I recommend heading to [GitHub](https://github.com) and start playing around with your first repo. 