---
title: Create Your Own Server with Docker and NGINX
description: Step-by-step guide to creating your own self-hosted web server using Docker, NGINX, and automatic HTTPS with Let's Encrypt.
keywords: Derek Dreblow, Docker, NGINX, HTTPS, Let's Encrypt, server setup, self-hosting, reverse proxy
author: Derek Dreblow
version: 2025-06-03
categories:
  - Server Setup
tags:
  - docker
  - nginx
  - reverse-proxy
  - https
  - automation
  - server-deployment
---

# DreblowDesignsWebServer
Dreblow Designs server

## Getting Started

This blog sets up a reverse proxy with automatic HTTPS using NGINX for website hosting and Let's Encrypt for SSL certificate. These are guides I've written based on setting up and maintaining my own production-grade Ubuntu server using Docker, NGINX, and shell scripts — fully open source and self-hosted.

#### Check out the required Docker Compose files for the server and sites:
* [Docker Compose: Sever Side](./DockerComposeServerSide.html)
* [Docker Compose: WebSite Side](./DockerComposeSiteSide.html)

### Prerequisites
- Docker
- Docker Compose
- Your DNS `A` record pointing to your server

---

### Setup

Clone the repo:

```bash
git clone git@github.com:Dreblow/DreblowDesignsWebServer.git
cd DreblowDesignsWebServer
```

Run the setup script:
```bash
sudo chmod +x setup.sh && ./setup.sh
```

This will:
* Create required directories (data/certs, data/html, data/vhost.d)
* Create the shared Docker network webproxy
* Start the NGINX proxy + SSL companion stack

Push the update over SSH:
```bash
ssh dreblow@<your_ip> '~/git/DreblowDesignsWebServer/setup.sh'
```
#### Take it one stop further and add as an alias on the Mac:
Add this to your `nano ~/.zshrc` or `nano /.bash_profile`:
```bash
alias deployserver="ssh dreblow@<your_ip> '~/git/DreblowDesignsWebServer/setup.sh'"
```

Then run:
```bash
source ~/.zshrc   # or ~/.bash_profile
```

Now anytime you want to deploy from terminal:
```bash
deployserver
```
Done!!

Here is mine in real life:
```bash
# Alias to invoke script on server
alias localdeploy='ssh dre@192.168.1.### "bash ~/git/DreblowDesignsWebServer/setup.sh"'           # Local IP
alias remotedeploy='ssh -p 6## dre@##.##.###.### "bash ~/git/DreblowDesignsWebServer/setup.sh"'   # Public IP 

# Optional: enable tab-completion for aliases
setopt complete_aliases                                                                           # Have to have tab auto complete
```

---

### Setup.sh
This script automates the entire web server deployment:
* Clones the website repos
* Copies them to /srv/sites/[domain]
* Starts a Docker reverse proxy with HTTPS
* Makes sure the server is the only one responsible for deployment — not the websites themselves

#### Step-by-Step Breakdown
1. Shebang + Error Handling
```bash
#!/bin/bash
set -e
```
* `#!/bin/bash` ensures the script runs with Bash.
* `set -e` means the script will stop immediately if any command fails — good for fail-fast behavior

```bash
# Prevent running as root (with sudo)
if [ "$EUID" -eq 0 ]; then
  echo "❌ Do not run this script with sudo. Exiting.."
  exit 1
fi
```
* Exit the script if running in sudo. We SSH into Git, and we need to be using user credentials and not root.

2. Introduction Output
```bash
echo "🚀 Launching Dreblow Designs Web Server setup..."
```
* Just a friendly launch message.

3. Settings Block
```bash
GIT_ROOT="$HOME/git"
DEPLOY_ROOT="/srv/sites"
REPOS=(
    # Add more repos here, no commas needed
  "git@github.com:Dreblow/WebSite_DreblowDesigns.git"
  "git@github.com:Dreblow/WebSite_MathSheetGen.git"
  "git@github.com:Dreblow/WebSite_DreblowandAssociates.git"
)
```
* GIT_ROOT: where your cloned repos will live on the server.
* DEPLOY_ROOT: where live web files are served from.
* REPOS: list of Git repos to deploy.

4. Directory Setup
```bash
if [ ! -d "$GIT_ROOT" ]; then
  sudo mkdir -p "$GIT_ROOT"
fi
if [ ! -d "$DEPLOY_ROOT" ]; then
  sudo mkdir -p "$DEPLOY_ROOT"
fi
sudo chown -R "$USER" "$GIT_ROOT" "$DEPLOY_ROOT"
```
* creates /git and /srv/sites if they don’t exist.
* Changes ownership to your current user so you don’t need sudo later.

5. Repo Cloning & Deployment Loop
```bash
for REPO in "${REPOS[@]}"; do
  NAME=$(basename "$REPO" .git)
  DOMAIN="$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/website_//g').com"

  LOCAL_REPO="$GIT_ROOT/$NAME"
  if [ -d "$LOCAL_REPO" ]; then
    echo "🗑️ Removing old repository at $LOCAL_REPO..."
    rm -rf "$LOCAL_REPO"
  fi

  if [ -d "$DEPLOY_ROOT/$DOMAIN" ]; then
    echo "🗑️ Removing deployed site at $DEPLOY_ROOT/$DOMAIN..."
    rm -rf "$DEPLOY_ROOT/$DOMAIN"
  fi

  if [ -d "$GIT_ROOT/$NAME/.git" ]; then
    git -C "$GIT_ROOT/$NAME" pull
  else
    git clone "$REPO" "$GIT_ROOT/$NAME"
  fi

  mkdir -p "$DEPLOY_ROOT/$DOMAIN"
  rsync -av --delete "$GIT_ROOT/$NAME/" "$DEPLOY_ROOT/$DOMAIN/" \
    --exclude ".git" --exclude "resources/dev" --exclude "node_modules"
done
```
* For each repo:
    * NAME gets the repo folder name.
    * DOMAIN transforms that name into a lowercase .com domain (e.g., WebSite_MyBlog → myblog.com).
    * LOCAL_REPO see if folder/files currently exists, if so delete it.
    * Removes the deployed site folder in /srv/sites if it exists.
    * If repo already exists: pull the latest.
    * If not: clone it.
    * Syncs the repo into /srv/sites/[domain]/, excluding development junk (.git, dev scripts, node modules).

6. Docker Network Setup
```bash
docker network inspect webproxy >/dev/null 2>&1 || \ docker network create webproxy
```
* Ensures the shared Docker network webproxy exists for your NGINX and SSL containers.

7. Start Reverse Proxy Stack
```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
docker compose -f "$SCRIPT_DIR/docker/server/docker-compose.yml" up -d
docker compose -f "$SCRIPT_DIR/docker/sites/docker-compose.yml" up -d
```
* Boots up your NGINX and acme-companion containers using the docker-compose files inside the docker/server and docker/sites directories.
* This approach centralizes and dynamically manages the proxy and site containers.
* Provides HTTPS and reverse proxying for all deployed sites.

8. Wrap-up
```bash
echo "✅ All websites are deployed and live with HTTPS support."
```
* Done! All sites are deployed under your single management umbrella.

---

9. The entire script
```bash
#!/bin/bash

# Super clean, Super Bias, Dreblow Designs Server Setup Script
# This script owns all deployments. Websites are dumb. Server is smart.

set -e

# Prevent running as root (with sudo)
if [ "$EUID" -eq 0 ]; then
  echo "❌ Do not run this script with sudo. Exiting.."
  exit 1
fi

echo "🚀 Launching Dreblow Designs Web Server setup..."

# === SETTINGS ===
GIT_ROOT="$HOME/git"
DEPLOY_ROOT="/srv/sites"
REPOS=(
  "git@github.com:Dreblow/WebSite_DreblowDesigns.git"
  "git@github.com:Dreblow/WebSite_MathSheetGen.git"
  "git@github.com:Dreblow/WebSite_DreblowandAssociates.git"
  # Add more repos here
)

# === PREP DIRECTORIES ===
echo "📁 Ensuring base directories exist..."
if [ ! -d "$GIT_ROOT" ]; then
  echo "📁 Creating git directory at $GIT_ROOT"
  sudo mkdir -p "$GIT_ROOT"
else
  echo "✅ Git directory exists at $GIT_ROOT"
fi

if [ ! -d "$DEPLOY_ROOT" ]; then
  echo "📁 Creating deploy directory at $DEPLOY_ROOT"
  sudo mkdir -p "$DEPLOY_ROOT"
else
  echo "✅ Deploy directory exists at $DEPLOY_ROOT"
fi

sudo chown -R "$USER" "$GIT_ROOT" "$DEPLOY_ROOT"

# === CLONE & DEPLOY ===
echo "📦 Cloning and copying website files..."
for REPO in "${REPOS[@]}"; do
  NAME=$(basename "$REPO" .git)
  DOMAIN="$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/website_//g').com"
  
  LOCAL_REPO="$GIT_ROOT/$NAME"
  if [ -d "$LOCAL_REPO" ]; then
    echo "🗑️ Removing old repository at $LOCAL_REPO..."
    rm -rf "$LOCAL_REPO"
  fi

  DOMAIN="$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/website_//g').com"

  # Clone or pull
  if [ -d "$GIT_ROOT/$NAME/.git" ]; then
    echo "🔄 Updating $NAME..."
    git -C "$GIT_ROOT/$NAME" pull
  else
    echo "📥 Cloning $NAME..."
    git clone "$REPO" "$GIT_ROOT/$NAME"
  fi

  # Copy static content
  echo "📤 Deploying to $DEPLOY_ROOT/$DOMAIN..."
  mkdir -p "$DEPLOY_ROOT/$DOMAIN"
  rsync -av --delete "$GIT_ROOT/$NAME/" "$DEPLOY_ROOT/$DOMAIN/" \
    --exclude ".git" --exclude "resources/dev" --exclude "node_modules"
done

# === NETWORK SETUP ===
echo "🌐 Ensuring shared Docker network exists..."
docker network inspect webproxy >/dev/null 2>&1 || \
  docker network create webproxy

# === START REVERSE PROXY ===
echo "🧰 Starting NGINX + SSL reverse proxy..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
docker compose -f "$SCRIPT_DIR/docker/server/docker-compose.yml" up -d
docker compose -f "$SCRIPT_DIR/docker/sites/docker-compose.yml" up -d

# === DONE ===
echo "✅ All websites are deployed and live with HTTPS support."
```