---
title: Deploying Static Sites with Docker Compose (Site Side)
description: This guide explains how to use Docker Compose to deploy multiple static websites behind a secure NGINX reverse proxy with Let's Encrypt SSL certificates. This section covers the site container configuration.
keywords: Docker, NGINX, Let's Encrypt, static site hosting, reverse proxy, Derek Dreblow, Dreblow Designs
author: Derek Dreblow
version: 2025-06-03
categories:
  - Web Hosting
tags:
  - docker
  - nginx
  - reverse-proxy
  - https
  - letsencrypt
  - self-hosting
  - static-sites
---

# Docker Composer Site Side

## Breakdown of the File
Services:

This section defines individual **services** (containers) you want Docker to run. Each service corresponds to a website.

### WebSites: dreblowdesigns, mathsheetgen, dreblowandassociates

Each block under `services:` defines one site. Let's use one as an example:

```yml
dreblowdesigns:
    image: nginx:latest
    restart: always
```
* `image: nginx:latest`
Tells Docker to use the official NGINX image (web server software) from Docker Hub.
* `restart: always`
Ensures the container restarts if it crashes, or when Docker starts on reboot.

## Volumes
```yml
volumes:
    - /srv/sites/dreblowdesigns.com:/usr/share/nginx/html:ro
```
* This maps a folder from your host system `(/srv/sites/dreblowdesigns.com)` into the container’s web root `(/usr/share/nginx/html)` in read-only mode `(:ro)`.
* That’s how your actual HTML/CSS/JS content is served inside the container.

## Environment Variables
```yml
environment:
- VIRTUAL_HOST=dreblowdesigns.com, www.dreblowdesigns.com
- LETSENCRYPT_HOST=dreblowdesigns.com, www.dreblowdesigns.com
- LETSENCRYPT_EMAIL=####.#####@gmail.com
```
These are picked up by the nginx-proxy and acme-companion services you defined in the server-side Compose file:
* `VIRTUAL_HOST:` Tells nginx-proxy which hostnames should route traffic to this container.
* `LETSENCRYPT_HOST:` Tells acme-companion to request HTTPS certificates for these domains.
* `LETSENCRYPT_EMAIL:` Email to register with Let’s Encrypt in case of urgent SSL certificate notifications (masked here in the blog for privacy).

## Networks
```yml
networks:
    - webproxy
```
* This connects the service to an external Docker network named webproxy. This shared network lets the site containers communicate with the proxy containers defined in your other docker-compose.yml.
* The bottom section makes this explicit:
```yml
networks:
  webproxy:
    external: true
```

## Why This Works
* Automatic HTTPS with Let’s Encrypt
* Smart domain-to-container mapping
* One unified network with clean separation between infrastructure and content
* Easy to scale: just add more blocks like this!


## The entire file
```yml
services:
  dreblowdesigns:
    image: nginx:latest
    restart: always
    volumes:
      - /srv/sites/dreblowdesigns.com:/usr/share/nginx/html:ro
    environment:
      - VIRTUAL_HOST=dreblowdesigns.com, www.dreblowdesigns.com
      - LETSENCRYPT_HOST=dreblowdesigns.com, www.dreblowdesigns.com
      - LETSENCRYPT_EMAIL=####.#####@gmail.com                              # Or some email address
    networks:
      - webproxy

  mathsheetgen:
    image: nginx:latest
    restart: always
    volumes:
      - /srv/sites/mathsheetgen.com:/usr/share/nginx/html:ro
    environment:
      - VIRTUAL_HOST=mathsheetgen.com, www.mathsheetgen.com
      - LETSENCRYPT_HOST=mathsheetgen.com, www.mathsheetgen.com
      - LETSENCRYPT_EMAIL=####.#####@gmail.com                              # Or some email address
    networks:
      - webproxy

  dreblowandassociates:
    image: nginx:latest
    restart: always
    volumes:
      - /srv/sites/dreblowandassociates.com:/usr/share/nginx/html:ro
    environment:
      - VIRTUAL_HOST=dreblowandassociates.com, www.dreblowandassociates.com
      - LETSENCRYPT_HOST=dreblowandassociates.com, www.dreblowandassociates.com
      - LETSENCRYPT_EMAIL=####.#####@gmail.com                              # Or some email address
    networks:
      - webproxy

networks:
  webproxy:
    external: true
```