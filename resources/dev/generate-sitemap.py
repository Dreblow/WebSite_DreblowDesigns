import os
from urllib.parse import urljoin, quote
from datetime import datetime, timezone

# === Config ===
BASE_URL = "https://dreblowdesigns.com/"
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
sitemap.append('<!-- generated with Dreblow Designs Python Sitemap Generator -->\n')

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