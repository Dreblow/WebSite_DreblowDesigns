---
title: Linux & Unix CLI Terminal Toolbox
description: A collection of terminal tools, install commands, and quick notes for Linux and macOS.
keywords: Linux, Unix, macOS, Terminal, CLI, Homebrew, Ubuntu, Guide, Cheat Sheet
author: Derek Dreblow
version: 2026-07-11
machine: mixed
categories:
  - Linux
  - macOS
tags:
  - Linux
  - Unix
  - macOS
  - Terminal
  - CLI
  - Homebrew
  - Ubuntu
  - Guide
  - Cheat Sheet
---

# Linux & Unix CLI Terminal Toolbox

This page is a growing collection of terminal tools that I frequently use on Linux and macOS. Rather than searching the web every time I set up a new machine, I keep my favorite install commands and a few useful notes here.

Every command on this page has been tested by me. Where applicable, I’ll note the operating system or distribution that was used during testing.

---

## tree (macOS)

**Tested with: Homebrew on macOS**

The `tree` utility displays directories as a hierarchical tree, making it much easier to visualize folder structures from the terminal. I mainly use this for my READMEs. It really is the way to go for creating CLI folder path representations. Now with AI, its a must. Imagine having a README, with a full tree of your project. Talk about getting you Ai project up to speed with all that context.

### Install
```bash
brew install tree
```

### Verify Installation
```bash
tree --version
```

### Example
```bash
tree -L2
```
output:
```bash
.
├── !Archive
│   ├── Ops-vm
│   ├── dds-sync
│   ├── dreblowdesigns.com.conf
│   ├── info.ini
│   └── linode
├── README.md
├── ansible
│   ├── ansible.cfg
│   ├── inventory
│   ├── playbooks
│   └── roles
├── gateway-vm
│   └── README-gateway.md
├── host
│   ├── README-Host.md
│   ├── compose
│   ├── config
│   ├── images
│   └── secrets
└── tools
    ├── macos
    └── scripts

18 directories, 6 files
```

This is from a real project of mine with 2 levels, that `-L2`

As you could guess, `tree --help` gives you the full spiel of information, so jump in and check it out! Highly recommend it. 

---

## tmux (Ubuntu Server)

**Tested with: Ubuntu Server 24.04 x86**

tmux is a terminal multiplexer that allows multiple terminal sessions to run inside a single SSH connection. It’s one of my favorite tools for remote Linux administration because sessions continue running even after disconnecting.

### Install
```bash
sudo apt update
sudo apt install tmux
```

### Verify Installation
```bash
tmux -V
```

### Start a New Session
```bash
tmux
```
Or create a named session:
```bash
tmux new -s my-session-name
```

When you want to disconnect:
```bash
Ctrl+b
d
```
### SSH back in later:
```bash
tmux attach -t my-session-name
```

That's it! because if you leave your shell, what ever process you have running will stop. What's a good example? How about migrating 5TB of data from one drive to and another and use `rsync`. Use `tmux` to *set it and forget it*. But you should come back to see how things are going periodically 😃