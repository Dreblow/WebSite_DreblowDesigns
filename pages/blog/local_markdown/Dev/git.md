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

<!-- render: git-wiki-style-blog -->

# Moving a Server Checkout Back to `main`

If a server is still checked out on an old feature branch after the PR was merged, the goal is usually to switch the working copy back to `main`, update it, and verify the branch state before redeploying.

<!-- render: command-card -->

## Check Current Branch

```bash
# Show the current branch
git branch --show-current

# Show branch status and local changes
git status
```

## Save or Inspect Local Changes First

```bash
# Show modified files
git status

# Show exact local changes
git diff

# Temporarily save local changes if needed
git stash push -m "server local changes before switching branches"
```

## Fetch Latest Remote Branches

```bash
# Fetch latest branches and prune deleted remote branches
git fetch --prune origin

# Show all local and remote branches
git branch -a
```

## Switch Back to Main

```bash
# Switch to local main branch
git switch main

# Older syntax
git checkout main
```

## Pull Latest Main

```bash
# Pull latest main from origin
git pull origin main

# Alternative: fetch then fast-forward only
git fetch origin
git merge --ff-only origin/main
```

## If Local Main Does Not Exist

```bash
# Create local main tracking origin/main
git switch -c main --track origin/main

# Older syntax
git checkout -b main origin/main
```

## If Server Branch Was Deleted Remotely

```bash
# Fetch and remove stale remote-tracking branches
git fetch --prune origin

# Delete old local branch after switching away from it
git branch -d old-branch-name

# Force delete only if you are sure
git branch -D old-branch-name
```

## Verify Final State

```bash
# Confirm current branch
git branch --show-current

# Confirm clean working tree
git status

# Confirm latest commit
git log --oneline -5
```

---

<!-- render: git-wiki-style-blog -->

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