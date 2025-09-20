---
title: Linux Cheat Sheet
description: Tips and tricks for Linux
keywords: Linux, Guide, How-to
author: Derek Dreblow
version: 2025-09-19
machine: command-card
categories:
  - Linux
tags:
  - Linux
  - Guide
  - Cheat Sheet
---

## ⌨️ Keyboard Shortcuts
```bash
# Kill process running in the terminal
Ctrl + C  

# Stop the current process (resume with fg or bg)
Ctrl + Z  

# Cut one word before the cursor and add it to the clipboard
Ctrl + W  

# Cut part of the line before the cursor and add it to the clipboard
Ctrl + U  

# Cut part of the line after the cursor and add it to the clipboard
Ctrl + K  

# Paste from clipboard
Ctrl + Y  

# Recall the last command that matches the provided characters
Ctrl + R  

# Run the previously recalled command
Ctrl + O  

# Exit command history without running a command
Ctrl + G  

# Clear the terminal screen
clear  

# Run the last command again
!!  

# Log out of the current session
exit  
```

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

## 📂 File & Directory Management
```bash
# List all files and directories in the current directory (long format, hidden files)
ls -la  

# List all files and directories in the current directory (shows hidden files).
ls -a

# Show the directory you are currently working in.
pwd

# Move back one directory
cd ..

# Change to the previous Directory
cd -

# Change directory
cd /path/to/dir  

# Make a new directory
mkdir new_folder  

# Remove directory (empty)
rmdir old_folder  

# Copy file
cp file1.txt /path/to/dir/  

# Move or rename file
mv oldname.txt newname.txt  

# Remove file
rm file.txt  

# Find files by name
find /path -name "*.log"  
```

## 📦 Package Management (Ubuntu/Debian)
```bash
# Update package lists
sudo apt update  

# Upgrade installed packages
sudo apt upgrade  

# Install a package
sudo apt install package-name  

# Remove a package
sudo apt remove package-name  

# Search for a package
apt search package-name  
```

## ⚙️ System Information
```bash
# Show current user
whoami  

# Show system info
uname -a  

# Show disk usage
df -h  

# Show memory usage
free -h  

# Show running processes
ps aux  

# Show real-time processes
top  
```

## 🌐 Networking
``` bash
# Show IP address
ip addr show  

# Ping a host
ping -c 4 google.com  

# Show listening ports
sudo netstat -tuln  

# Test open port (e.g., port 22)
nc -zv localhost 22  

# Download file with wget
wget http://example.com/file.zip  
```

## 🔐 SSH
``` bash
# Connect to remote host
ssh user@host  

# Connect with identity file
ssh -i ~/.ssh/id_rsa user@host  

# Copy file to remote
scp file.txt user@host:/path/  

# Copy file from remote
scp user@host:/path/file.txt ./  
```

## 📝 File Viewing & Editing
```bash
# View file contents
cat file.txt  

# View with pagination
less file.txt  

# Edit with nano
nano file.txt  

# Edit with vim
vim file.txt  

# Show first 10 lines
head file.txt  

# Show last 10 lines
tail file.txt  

# Follow file updates
tail -f logfile.log  
```

## 🖥️ Process Management
```bash
# List running jobs
jobs  

# Kill process by PID
kill -9 1234  

# Kill process by name
pkill -f process_name  

# Run in background
command &  

# Bring job to foreground
fg %1  
```

## 🔄 Permissions & Ownership
```bash
# Change file permissions (read/write/execute for user/group/other)
chmod 755 file.sh  

# Add execute permission
chmod +x script.sh  

# Change file owner
chown user:group file.txt  
```