---
title: Linux Headless VMs
description: How-to to get a headless VMs going in your headless Linux system
keywords: Linux, Guide, How-to
author: Derek Dreblow
version: 2025-25-24
machine: wiki
categories:
  - Linux
  - VM
  - Headless
tags:
  - Linux
  - Guide
  - Cheat Sheet
---
# Linux Headless VM Setup
Some info here

## Creating VMs

## Backing up VM
Before doing any kind of backing up, shutdown your VM. Get the list of running VMs:
```bash
virsh list --all
```

### Shutdown
Shutdown it fully via:
```bash
virsh shutdown <name of your VM>
virsh domstate <name of your VM>
```

And wait until you see 
```bash
shut off
```

Confirm things with 
```bash
virsh list --all
```
And the VM should no longer be listed.

### Determine current disk size
You'll probably want to jump right to the transfer, but its good to see how sparse the qcow2 or img file is. Personally, my 3-2-1 backup system involved a thumb drive that is in exFat. That means it can't handle empty space and will fill with zeros. That means my 1tb allocated fake space will try to turn into an actual 1tb file.

See what the size is set for:
```bash
ls -lh /location/of/your/VM/nameOfVm.qcow2
```
Note that `qcow2` could be `img`

But if you are like me and created a huge disk, you'll see something like
```bash
virtual size: 1.0T
```

To see the actual space consumed:
```bash
du -h /location/of/your/VM/nameOfVm.qcow2
```
With a response like
```bash
disk size:    2.7G
```

Point being is that we are going to want to compact this file for our thumb drive/simpler file systems. 

You could use `gzip`, but I prefer `qemu-img convert. Below is a nice little verbose command to compact.
```bash
qemu-img convert \
  -p \
  -c \
  -O qcow2 \
  nameOfVm.qcow2 \
  nameOfVm.compact.qcow2
```
**What each flag does**
* -p → progress bar
* -c → compress clusters
* -O qcow2 → output format
* source → destination

You’ll see something like:
```bash
(45.67/100%)
```