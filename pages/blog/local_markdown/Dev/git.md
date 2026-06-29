---
title: Git Essentials Cheat Sheet
description: A clean, practical Git cheat sheet covering daily terminal workflows and essential .gitignore patterns.
keywords: git, git cheat sheet, git ignore, git commands, linux git, github, version control
author: Derek Dreblow
version: 2026-06-11
machine: mixed
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
<!-- render: git-wiki-style-blog -->
# Git - Maybe a cheat sheet
TLDR:
Lets talk about Git commands for linux terminal and git ignore file.

I think like most people, we all end up using GUI applications (like [SmartGit](https://www.smartgit.dev) or [Git-Fork](https://git-fork.com)) to do our git actions. In this blog post, I want to provide some stragiht forward commands to let you move on to the next thing in your jou Journey. 

Also some nice to knows about the .gitignore file that beginners may like to know quickly.

---

<!-- render: command-card -->
## 🌿 Move Back to Main
```bash
# Show the current branch
git branch --show-current

# Show local changes before switching branches
git status

# Fetch latest remote branch info and prune deleted remote branches
git fetch --prune origin

# Switch to main
git switch main

# Older syntax for switching to main
git checkout main

# Pull latest main from origin
git pull origin main

# Create local main if it does not exist yet
git switch -c main --track origin/main

# Confirm the working tree is clean
git status

# Show the latest commits
git log --oneline -5
```

## 🌱 Move to Another Branch
```bash
# Show the current branch
git branch --show-current

# Show local changes before switching branches
git status

# Fetch latest remote branch info and prune deleted remote branches
git fetch --prune origin

# Take a look at all the branches currently locally on your system. Anything marked with '[gone]' means its locally exists only.
git branch -vv

# Good old force delete of local branches (only if your 100% sure)
git branch -D NameOfBranch

# Switch to an existing branch
git switch branch-name

# Older syntax for switching to an existing branch
git checkout branch-name

# Pull latest branch from origin
git pull origin branch-name

# Create a local branch tracking a remote branch
git switch -c branch-name --track origin/branch-name

# Show all local branches
git branch

# Show local and remote branches
git branch -a

# Confirm the working tree is clean
git status

# Show the latest commits
git log --oneline -5
```

<!-- render: git-wiki-style-blog -->
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