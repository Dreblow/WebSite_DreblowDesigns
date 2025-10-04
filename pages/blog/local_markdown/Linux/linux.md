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

## 💾 Disk Usage
```bash
# Check available and used disk space on all mounted file systems (human-readable format).
df -h  

# Show free and used inodes on mounted file systems.
df -i  

# List all disk partitions, sizes, and types.
fdisk -l  

# Show disk usage for every file and folder (recursively).
du -ah  

# Show total disk usage of the current directory.
du -sh  

# List all currently mounted file systems.
mount  

# Display all file systems with their mount points in a tree view.
findmnt  

# Mount a device to a directory (mount point).
mount device_path mount_point  
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

# How to enter into root shell
sudo -i
```

## 👥 Users & Groups
```bash
# Show details about the current user and groups
id  

# Show the last system logins
last  

# Display who is currently logged in
who  

# Show users logged in and their activity
w  

# Show information about a specific user
finger username  

# Create a new user account
sudo useradd username  

# Alternative: add user via interactive script
sudo adduser username  

# Delete a user account
sudo userdel username  

# Add user to a group
sudo usermod -aG groupname username  

# Change the current user's password
passwd  

# Change another user's password
sudo passwd username  

# Create a new group
sudo groupadd groupname  

# Delete a group
sudo groupdel groupname  

# Rename a group
sudo groupmod -n newname oldname  

# Temporarily run a command as superuser
sudo command  

# Switch to another user (or root if none specified)
su - username  

# Change file or directory group
chgrp groupname file_or_directory  
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

## 🔄 Permissions & Ownership
```bash
# Give read, write and execute permission to owner and give read and execute permission to group and others (rwxr-xr-x)
chmod 755 file.sh  

# Give read, write and execute permission to owner and read/write permission to group and others (rwxrw-rw-)
chmod 766 file.sh  

# Allow read, write and execute file permission to everyone (rwxrwxrwx)
chmod 777 file.sh  

# Add execute permission
chmod +x script.sh  

# Change file owner
chown user file.txt  

# Change file owner and group owner
chown user:group file.txt  
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

## 📄 File Operations
```bash
# Create a new file
touch filename  

# Create a symbolic link
ln -s /path/to/file linkname  

# Append contents of one file to another
cat source_file >> destination_file  

# Show the first 10 lines of a file
head filename  

# Show the last 10 lines of a file
tail filename  

# Display contents page by page
more filename  

# Display contents with navigation
less filename  

# Count words, lines, and bytes in a file
wc -w filename  

# Count lines/words/chars in multiple files
ls | xargs wc  

# Cut sections of a file using a delimiter
cut -d: -f1 filename  

# Cut sections from piped data
echo "one:two:three" | cut -d: -f2  

# Overwrite a file to securely delete it
shred -u filename  

# Compare two files and show differences
diff file1 file2  

# Execute file content in the current shell
source filename  

# Store command output in a file (and still show in terminal)
command | tee output.txt  
```

## 📦 Package Management (General)
```bash
# Install software from source code
tar zxvf [file_name.tar.gz]
cd [extracted_directory]
./configure
make
sudo make install
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

## 📦 Package Management (Red Hat / CentOS / Fedora)
```bash
# Install a package
sudo dnf install [package_name]

# Remove a package
sudo dnf remove [package_name]

# Search for a package in repositories
dnf search [keyword]

# List installed packages
dnf list installed

# Show information about a package
dnf info [package_name]

# Install a local RPM package
sudo rpm -i [package_name.rpm]

# (Legacy) Older systems may use YUM:
sudo yum install [package_name]
```

## 📦 Package Management (Arch with Pacman)
```bash
# Update package database and upgrade all packages
sudo pacman -Syu  

# Install a package
sudo pacman -S [package_name]  

# Remove a package
sudo pacman -R [package_name]  

# Search for a package
pacman -Ss [keyword]  

# List installed packages
pacman -Qe  
```

## 📦 Package Management (Snap)
```bash
# Install a Snap package
sudo snap install [package_name]  

# Search for a Snap package
sudo snap find [keyword]  

# List installed Snap packages
sudo snap list  
```

## 📦 Package Management (Flatpak)
```bash
# Install a Flatpak package
flatpak install [package_name]  

# Search for a Flatpak application
flatpak search [keyword]  

# List installed Flatpak packages
flatpak list  
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
# Connect to a remote system
ssh user@host  

# Use a specific private key for login
ssh -i ~/.ssh/id_rsa user@host  

# Connect using a custom port (default is 22)
ssh -p 2222 user@host  

# Generate a new SSH key pair
ssh-keygen  

# Start the SSH server (on systems with systemd)
sudo systemctl start sshd  

# Copy a file from local to remote
scp file.txt user@host:/remote/path/  

# Copy a file from remote to local
scp user@host:/remote/path/file.txt ./  

# Securely transfer files interactively with SFTP
sftp user@host  

# (Legacy) Connect via Telnet on port 23
telnet host  
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

## 🔍 Searching
```bash
# Find files and directories by name
find /path -name "pattern"  

# Find files larger than a specified size (e.g., 100MB)
find /path -size +100M  

# Search for a text pattern inside a file
grep "pattern" file.txt  

# Recursively search for a pattern inside a directory
grep -r "pattern" /path/to/dir  

# Locate files in the system’s database (faster than find)
locate filename  

# Show the full path of a command (from $PATH)
which command  

# Show source, binary, and man page for a command
whereis command  

# Print all lines in a file matching a pattern (awk)
awk '/pattern/ {print $0}' file.txt  

# Find and replace text in a file
sed 's/old/new/' file.txt  
```