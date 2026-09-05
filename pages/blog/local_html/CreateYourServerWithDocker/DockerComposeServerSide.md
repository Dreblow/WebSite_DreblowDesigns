---
title: Create Your Own Server with Docker and NGINX
description: Step-by-step guide to creating your own self-hosted web server using Docker, NGINX, and automatic HTTPS with Let's Encrypt. This portion is the docker compose file to support server side functionality.
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

# Docker Composer Server Side

## Why this setup?

This `docker-compose.yml` config is the heart of your self-hosted reverse proxy system. It launches two core services:

### `nginx-proxy`
This is the automated reverse proxy. It watches for other Docker containers with `VIRTUAL_HOST` environment variables and automatically routes requests to them. It handles:

- HTTP routing
- HTTPS redirection (via config from companion)
- Dynamic configuration based on running containers

### `acme-companion`
This container works alongside `nginx-proxy` to generate and renew Let's Encrypt SSL certificates on the fly. When you define `LETSENCRYPT_HOST` and `LETSENCRYPT_EMAIL`, it:

- Automatically fetches a certificate the first time the container is created
- Renews the certificate before expiration
- Stores everything in the shared `./data/certs` directory

## Folder structure expectations

Your working directory should look like this:

```
docker/
├── data/
│   ├── certs/
│   ├── html/
│   └── vhost.d/
├── sites/
│   └── docker-compose.yml  <-- Your website containers
└── server/
    └── docker-compose.yml  <-- This file (nginx-proxy + acme-companion)
```

## Prerequisites

- Docker and Docker Compose installed
- Port 80 and 443 exposed on your public IP
- Your domain(s) pointed to the public IP via DNS
- A shared Docker network called `webproxy` (`docker network create webproxy`)

## Final thoughts

This setup gives you a centralized, scalable, and fully automated reverse proxy with free HTTPS support. Add or remove sites by just spinning up a new container with the correct environment variables. No more manually editing NGINX configs or renewing certs!

## This file is live
```yml
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    container_name: nginx-proxy
    labels:
      - com.github.nginx-proxy.nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./data/certs:/etc/nginx/certs:ro
      - ./data/vhost.d:/etc/nginx/vhost.d
      - ./data/html:/usr/share/nginx/html
      - /var/run/docker.sock:/tmp/docker.sock:ro
    networks:
      - webproxy

  acme-companion:
    image: nginxproxy/acme-companion
    container_name: nginx-acme
    restart: always
    environment:
      DEFAULT_EMAIL: ####.#####@gmail.com             # Or some email address
      NGINX_PROXY_CONTAINER: nginx-proxy
    volumes:
      - ./data/certs:/etc/nginx/certs
      - ./data/vhost.d:/etc/nginx/vhost.d
      - ./data/html:/usr/share/nginx/html
      - /var/run/docker.sock:/var/run/docker.sock:ro
    depends_on:
      - nginx-proxy
    networks:
      - webproxy

networks:
  webproxy:
    external: true
```