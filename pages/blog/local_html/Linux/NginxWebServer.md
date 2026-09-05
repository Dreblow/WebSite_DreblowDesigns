---
title: Nginx Web Server Setup Guide
description: A step-by-step guide to installing and configuring Nginx on Ubuntu, setting up SSL, and managing a web server.
keywords: nginx, ubuntu, linux, server configuration, ssl, networking, web hosting
author: Derek Dreblow
version: 2025-02-03
categories:
  - Web Hosting
  - Server Configuration
  - Networking
tags:
  - nginx
  - linux
  - ubuntu
  - ssl
  - configuration
---

# Nginx Web Server Setup Guide

## Overview
This guide goes over how to install and setup Ngnix Web Server. Don't believe it? You're using it right now! Running on
Windows 10, Hyper-V on Ubuntu Server, using Nginx.

---
## 1. Install Nginx
``` bash
sudo apt update && sudo apt install nginx -y
```

## 2. Start & Enable Nginx
``` bash
sudo systemctl start nginx
sudo systemctl enable nginx  # Auto-start on boot
```

To check status
``` bash
systemctl status nginx
```

## 3. Configure Firewall (if needed)
**Allow HTTP & HTTPS traffic:**
``` bash
sudo ufw allow 'Nginx Full'  # Ubuntu/Debian
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 4. Set Up Website Directory
``` bash
sudo mkdir -p /var/www/mywebsite.com/html
sudo chown -R $USER:$USER /var/www/mywebsite.com/html
sudo chmod -R 755 /var/www/mywebsite.com
```

Create an index.html file:
``` bash
nano /var/www/mywebsite.com/html/index.html
```

Example content:
``` bash
<!DOCTYPE html>
<html lang="en">
<head><title>Welcome to My Website</title></head>
<body><h1>It works!</h1></body>
</html>
```

## 5. Create Nginx Server Block
Create a new Nginx config file:
``` bash
sudo nano /etc/nginx/sites-available/mywebsite.com
```

Add the following:
``` nginx
server {
    listen 80;
    server_name mywebsite.com www.mywebsite.com;
    
    root /var/www/mywebsite.com/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Create a symlink to enable the site:
``` bash
sudo ln -s /etc/nginx/sites-available/mywebsite.com /etc/nginx/sites-enabled/
```

Test the configuration:
``` bash
sudo nginx -t
```

Restart Nginx:
``` bash
sudo systemctl restart nginx
```

## 6. Configure SSL with Let’s Encrypt (HTTPS)
Install Certbot:
``` bash
sudo apt install certbot python3-certbot-nginx -y
```

Get an SSL certificate:
``` bash
sudo certbot --nginx -d mywebsite.com -d www.mywebsite.com
```

Auto-renew SSL:
``` bash
sudo certbot renew --dry-run
```

## 7. Set Up Automatic HTTP to HTTPS Redirect
Modify your Nginx configuration:
``` nginx
server {
    listen 80;
    server_name mywebsite.com www.mywebsite.com;
    return 301 https://$server_name$request_uri;
}
```

Restart Nginx:
``` bash
sudo systemctl restart nginx
```

## 8. Commands to remember for Nginx
* Restart Nginx:
  ``` bash
  sudo systemctl restart nginx
  ```

* Stop Nginx:
  ``` bash
  sudo systemctl stop nginx
  ```

* Reload (without downtime):
  ``` bash
  sudo systemctl reload nginx
  ```

* View logs:
  ``` bash
  sudo tail -f /var/log/nginx/access.log
  sudo tail -f /var/log/nginx/error.log
  ```

## Thank You & Enjoy!

Thank you for following this guide! I hope it helped you successfully set up your Nginx web server. Whether you're hosting a personal project, a portfolio, or a business site, you're now equipped with the knowledge to configure, secure, and manage your server effectively.

### 🔥 What We Learned:
- How to **install and configure Nginx** on Ubuntu.
- Setting up **virtual hosts** and serving multiple domains.
- Securing your site with **Let's Encrypt SSL**.
- Managing **firewall rules** for better security.
- Backing up **critical server files** to prevent data loss.

Now you’re ready to deploy, scale, and maintain your Nginx server like a pro. If you have any issues, feel free to troubleshoot, tweak, and explore more advanced configurations.

Happy hosting! 🚀🎉