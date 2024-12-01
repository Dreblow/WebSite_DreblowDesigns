---
title: Setting IP to Static on Ubuntu Server
description: Learn how to set a static IP address on Ubuntu Server step-by-step.
keywords: ubuntu, static ip, networking, server configuration, linux
author: Derek Dreblow
version: 2024-11-16
categories:
  - Ubuntu Server
  - Networking
tags:
  - static-ip
  - ubuntu-server
  - linux
  - configuration
---
# Setting a Static IP Address on Ubuntu Server

## 1. Identify Network Interface Details

- Use the command:
  ```bash
  ip addr
  ```
- Identify the network interface name (e.g., `eth0`, `ens33`, `wlan0`) and current IP configuration.

## 2. Access Netplan Configuration

- Ubuntu uses Netplan for network configuration. Locate the configuration file, typically in `/etc/netplan/`. Common filenames are `01-netcfg.yaml` or `50-cloud-init.yaml`.
- Use:
  ```bash
  ls /etc/netplan/
  ```

## 3. Back Up the Original Configuration

- Always back up the file before making changes:
  ```bash
  sudo cp /etc/netplan/01-netcfg.yaml /etc/netplan/01-netcfg.yaml.bak
  ```

## 4. Edit the Configuration File

- Open the configuration file with a text editor:

  ```bash
  sudo nano /etc/netplan/01-netcfg.yaml
  ```
- Replace or add the following configuration, substituting with your desired IP, gateway, and DNS:

  ```yaml
  network:
    version: 2
    ethernets:
      ens33:                   # Replace with your interface name
        addresses:
          - 192.168.1.100/24   # Replace with your desired IP and subnet mask
        gateway4: 192.168.1.1  # Replace with your gateway
        nameservers:
          addresses:
            - 8.8.8.8          # Google DNS
            - 8.8.4.4
  ```

## 5. Apply Configuration

- Apply the changes using:
  ```bash
  sudo netplan apply
  ```

## 6. Verify Configuration

- Confirm the changes using:
  ```bash
  ip addr
  ```
- Test connectivity by pinging the gateway or an external IP:
  ```bash
  ping 8.8.8.8
  ```

## 7. Troubleshooting

- If the network does not come up after applying the changes:
  - Revert to the backup file:
    ```bash
    sudo cp /etc/netplan/01-netcfg.yaml.bak /etc/netplan/01-netcfg.yaml
    sudo netplan apply
    ```
  - Check Netplan syntax before applying changes:
    ```bash
    sudo netplan try
    ```
  - Verify the correct interface name and ensure no conflicting DHCP settings.

## 8. Optional: Disable DHCP (if needed)

- If your network was using DHCP and you're switching to a static IP, ensure that DHCP is disabled for the interface.

  ```yaml
  dhcp4: false
  ```

## 9. Restart Network Services

- If issues persist, restart the network service:
  ```bash
  sudo systemctl restart systemd-networkd
  ```
