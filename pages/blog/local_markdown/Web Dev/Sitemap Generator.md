---
title: Build Your Own Sitemap Generator with Python
description: Learn how to create a custom Python script that scans your website and automatically generates a Google-friendly sitemap.
keywords: Python, SEO, Web Development, Sitemap, Automation
author: Derek Dreblow
version: 2025-05-05
categories:
  - Web Development
  - Python
tags:
  - Python
  - SEO
  - Sitemap
  - Automation
---

# Creating your own Sitemap Generator

Creating your own sitemap generator may sound intense — but it’s actually super fun and helps you deeply understand how websites get indexed by search engines like Google and Bing.

This post will walk you through building a Python script that:
- Scans your project directory for all `.html` files
- Skips irrelevant files like stylesheets or dev scripts
- Automatically generates a valid `sitemap.xml` file
- Formats everything using current best practices (ISO date, percent-encoded URLs, and schema metadata)

> 🔥 Bonus: We explain **why** each step exists so you’re not just copy-pasting blindly.

---

## Why Build It Yourself?

Sure, there are online sitemap generators. But when you’re hosting your own site (like I do at [dreblowdesigns.com](https://dreblowdesigns.com)), it gives you an opportunity to automate your web development. It has been countless time where I published new pages and forgot to change the sitemap! 

Plus, you get complete control.

---

## Step-by-Step: The Script

Let’s go through the Python script in stages, with explanations.

---

### 1. Define Your Setup

```python
import os
from urllib.parse import urljoin, quote
from datetime import datetime, timezone
```
* `os` to walk through folders
* `urljoin` and quote to safely construct URLs
* `datetime` for timestamps


### 2. Configurable Constants
```python
BASE_URL = "https://dreblowdesigns.com/"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "../../"))
SITEMAP_FILE = os.path.join(ROOT_DIR, "sitemap.xml")
```
* `BASE_URL` is your actual website URL.
* `SCRIPT_DIR` anchors all paths relative to where this script is.
* `ROOT_DIR` points to your site root — where the .html files live.
* `SITEMAP_FILE` is the full path where we’ll write the output.

This avoids issues where `../` might resolve incorrectly depending on where you run the script from.


### 3. Exclude Unwanted Paths
```python
EXCLUDE_PATHS = [
    "resources/",
    "local_markdown/",
    "local_js/node_modules/",
    "dev/",
    "server/",
    "sitemap.xml"
]

def is_excluded(path):
    return any(excluded in path for excluded in EXCLUDE_PATHS)
```
* This keeps the sitemap clean — no CSS, scripts, dev stuff, or redundant entries.


### 4. Crawl Files and Build URLs
```python
urls = []

for root, _, files in os.walk(ROOT_DIR):
    for file in files:
        if file.endswith(".html"):
            rel_path = os.path.relpath(os.path.join(root, file), ROOT_DIR)
            rel_path = rel_path.replace(os.sep, '/')
            if not is_excluded(rel_path):
                escaped_path = quote(rel_path)
                full_url = urljoin(BASE_URL, escaped_path)
                urls.append((full_url, rel_path))
```
* Walks through the full directory tree
* Filters for .html files
* Escapes URLs (e.g. spaces → %20)
* Constructs full URLs based on your domain


### 5. Generate the XML Output
```python
sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
sitemap.append('        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"')
sitemap.append('        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9')
sitemap.append('        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">')
sitemap.append('<!-- generated with Dreblow Designs Python Sitemap Generator -->\n')
```
* This creates the root `<urlset>` block using proper schema attributes that Google recognizes.


### 6. Populate Entries with Metadata
```python
for url, path in urls:
    if "index.html" in path:
        priority = "1.00"
    elif "about" in path or "contact" in path or "blog.html" in path:
        priority = "0.80"
    else:
        priority = "0.64"

    lastmod = datetime.now(timezone.utc).isoformat()

    sitemap.append("  <url>")
    sitemap.append(f"    <loc>{url}</loc>")
    sitemap.append(f"    <lastmod>{lastmod}</lastmod>")
    sitemap.append(f"    <priority>{priority}</priority>")
    sitemap.append("  </url>")
```
* `priority` tells search engines how important each page is.
* `lastmod` uses UTC ISO format: 2025-05-05T20:30:00+00:00


### 7. Save the File
```python
os.makedirs(os.path.dirname(SITEMAP_FILE), exist_ok=True)
with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(sitemap))

print(f"✅ Sitemap generated at {SITEMAP_FILE} with {len(urls)} URLs.")
```
* It creates the directory if needed, writes the full XML, and confirms success.


### Bonus: Automation!
```python
const { exec } = require('child_process');

setTimeout(() => {
  exec('python3 ./resources/dev/generate-sitemap.py', (error, stdout, stderr) => {
    if (error) console.error(`Sitemap error: ${error.message}`);
    else console.log(stdout);
  });
}, 100); // wait 100ms to ensure all files are written
```
* The whole reason I did this, so when my static site generator [Mark Down to HTML js converter](./Web%20Dev/Mark%20Down%20to%20HTML.html) is done creating my blogs, the sitemap is done!


---
## The Complete Python Script
* Before diving in, look for `YOUR SITE` in two different spots. 

```python
import os
from urllib.parse import urljoin, quote
from datetime import datetime, timezone

# === Config ===
BASE_URL = "https://YOUR SITE.com/" # <-- UPDATE TO YOUR SITE
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "../../"))  # project root
SITEMAP_FILE = os.path.join(ROOT_DIR, "sitemap.xml")

# === Exclusions ===
EXCLUDE_PATHS = [
    "resources/",
    "local_markdown/",
    "local_js/node_modules/",
    "dev/",
    "server/",
    "sitemap.xml"
]

def is_excluded(path):
    return any(excluded in path for excluded in EXCLUDE_PATHS)

# === Collect URLs ===
urls = []

for root, _, files in os.walk(ROOT_DIR):
    for file in files:
        if file.endswith(".html"):
            rel_path = os.path.relpath(os.path.join(root, file), ROOT_DIR)
            rel_path = rel_path.replace(os.sep, '/')
            if not is_excluded(rel_path):
                escaped_path = quote(rel_path)  # encode spaces
                full_url = urljoin(BASE_URL, escaped_path)
                urls.append((full_url, rel_path))

# === Build Sitemap XML ===
sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
sitemap.append('        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"')
sitemap.append('        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9')
sitemap.append('        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">')
sitemap.append('<!-- generated with YOUR SITE AGAIN Python Sitemap Generator -->\n')

for url, path in urls:
    # Determine priority
    if "index.html" in path:
        priority = "1.00"
    elif "about" in path or "contact" in path or "blog.html" in path:
        priority = "0.80"
    else:
        priority = "0.64"

    lastmod = datetime.now(timezone.utc).isoformat()

    sitemap.append("  <url>")
    sitemap.append(f"    <loc>{url}</loc>")
    sitemap.append(f"    <lastmod>{lastmod}</lastmod>")
    sitemap.append(f"    <priority>{priority}</priority>")
    sitemap.append("  </url>")

sitemap.append("</urlset>")

# === Save Output ===
os.makedirs(os.path.dirname(SITEMAP_FILE), exist_ok=True)
with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(sitemap))

print(f"✅ Sitemap generated at {SITEMAP_FILE} with {len(urls)} URLs.")
```