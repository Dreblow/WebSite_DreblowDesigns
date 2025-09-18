---
title: All that is ssh
description: Tips and tricks for ssh
keywords: ubuntu, networking, server configuration, linux, ssh
author: Derek Dreblow
version: 2024-12-14
categories:
  - Ubuntu Server
  - Networking
tags:
  - linux
  - configuration
  - ssh
---

# All that is ssh

## Overview
For now this is the area of the blog where I put ssh commands I use hardly so I don't remember by heart. Hopefully it grows into something great!

---
## 1. Removing RSA key from a know IP
- This is useful when you redid a computer and set it to the same static IP address. So if you're working from a Mac or other machine, you need to
  remove the old RSA key so it can be replaced with the new one from the new machine.

- Run the following command to remove the conflicting key associated with the specific IP address:
  ```bash
  ssh-keygen -R <IP_ADDRESS>
  ```
- For example:
  ```bash
  ssh-keygen -R 192.168.1.100
  ```