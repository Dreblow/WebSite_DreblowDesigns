---
title: Setting up a PHP Local Server for Web Development
description: Learn how to launch a lightweight PHP-based web server for local development and testing.
keywords: PHP, web development, local server, localhost, command line
author: Derek Dreblow
version: 2025-05-04
categories:
  - Web Development
  - Local Server
  - PHP
tags:
  - PHP
  - Local Server
  - Command Line
  - Web Development
---

# **Setting Up a PHP Local Server for Web Development**

PHP includes a built-in web server that's perfect for local testing and development — no extra software needed.

---

## **When to Use It**
- You're working with `.php` files and want a simple way to preview them locally.
- You don’t want to install XAMPP, MAMP, or LAMP stacks.
- You just need a lightweight, no-database preview.

---

## **Requirements**

- PHP installed (comes preinstalled on macOS and Linux).
- Command line access (Terminal or PowerShell).

Check if PHP is installed:

```bash
php -v
```

- If you see your version of PHP, you are ready to move on.


## 1. Starting the Server
Navigate to the folder where your PHP files live:
```bash
cd /path/to/your/php/project
```

Then start the server:
```bash
php -S localhost:8000
```

Open a web browser and copy the following in the URL
```
http://localhost:8000
```

The above will open your index.html and function as a regular site.


## 2. (Optional) Serving a Specific Entry File
If your entry point is not index.php, you can specify a router file like this:
```bash
php -S localhost:8000 router.php
```


## 3. Stopping the Server
Just press `CTRL + C` in your terminal to stop the server.


## Security Note

This PHP server is intended only for development. Do not expose it to the internet — it’s not secure for production use.