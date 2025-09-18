---
title: Linux Cheat Sheet
description: Tips and tricks for Linux
keywords: Linux, Guide, How-to
author: Derek Dreblow
version: 2025-09-14
machine: command-card
categories:
  - Linux
tags:
  - Linux
  - Guide
---

## 🔑 User & Permissions
```bash
# Switch user
su - username  

# Add new user
sudo adduser newuser  

# Add user to sudoers
sudo usermod -aG sudo newuser  

# Change permissions
chmod 755 file.sh  

# Change ownership
chown user:group file.txt  
```