---
title: WireGuard Self-Hosting Setup Instructions
description: Learn how to setup wireguard on a linux server.
keywords: ubuntu, wireguard, networking, server configuration, linux, VPN
author: Derek Dreblow
version: 2024-12-12
categories:
  - Linux
  - VPN
  - Networking
tags:
  - Ubuntu Server
  - WireGuard
  - IPv4
---
# WireGuard Self-Hosting Setup Instructions

## Overview
This guide walks you through setting up a self-hosted WireGuard server for secure remote access, restricting access to only your Linux server on Hyper-V while keeping the rest of your network hidden.

As of now this guide is WIP, which only supports IPv4 communications. I hope to explain IPv6 in the near future. 

---

## 1. Install WireGuard on the Server
- Ensure you have root access to the Linux server.
- Run the following commands:
    ```bash
    sudo apt update && sudo apt upgrade -y
    sudo apt install wireguard
    ```
- Alternatively, you can use Docker if preferred.

---

## 2. Generate Keys
- Create private and public keys for the server. This example goes over how to setup the server and, MacBook Pro and iPhone as clients.
    ```bash
    wg genkey | tee server_privatekey | wg pubkey > server_publickey
    ```
    ```bash
    wg genkey | tee maclappy_privatekey | wg pubkey > maclappy_publickey
    ```
    ```bash
    wg genkey | tee phone_privatekey | wg pubkey > phone_publickey
    ```
- This didn't work out the box, it was easiest to be in root. Some don't like this, but for the ease of this tutorial, we'll be bad ;)
    ```bash
    sudo -i
    ```
- Also note, if you forgot your keys, you can look them up as so, but remember, if you used `sudo -i` then the files are in the root directory. Use `sudo ls /root/` to see them.
    ```bash
    sudo cat  /root/maclappy_privatekey
    sudo cat  /root/maclappy_publickey
    ```
- To exit out of root, type `exit` in terminal and hit enter.
---

## 3. Set Up the WireGuard Configuration
- Create a configuration file with:
    ```bash
    sudo nano /etc/wireguard/wg0.conf
    ```
- and add the following:
    ```ini
    [Interface]
    PrivateKey = <ServerPrivateKey>
    Address = 10.0.0.1/24
    ListenPort = 42465

    # MacLappy Configuration
    [Peer]
    PublicKey = <MacLappyPublicKey>
    AllowedIPs = 10.0.0.2/32

    # iPhone Configuration
    [Peer]
    PublicKey = <iPhonePublicKey>
    AllowedIPs = 10.0.0.3/32
    ```
- Replace `ServerPrivateKey` and a `machinePublicKey` via the cat command back in section 2.

---

## 4. Enable port forwarding (WIP)
- Enabled IP forwarding to allow routing between the VPN subnet `10.0.0.0/24` and the specific network address `192.168.1.186`
- To test if it is enabled, which should return a `1`
  ```bash
  sysctl net.ipv4.ip_forward
  ```
- Edit `/etc/sysctl.conf` and ensure this line exists:
  ```bash
  sudo nano /etc/sysctl.conf
  ```
- And update
  ```bash 
  net.ipv4.ip_forward=1
  ```
- And then apply
  ```bash
  sudo sysctl -p
  ```

- Make sure the WireGuard server knows how to forward traffic from the 10.0.0.0/24 subnet to the specific IP in your LAN (e.g., 192.168.1. 186). Add this NAT rule to allow traffic to the specific IP:
  ```bash
  sudo iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -d 192.168.1.186 -j MASQUERADE
  ```

- Add this forwarding rule to allow traffic from `10.0.0.0/24` to `192.168.1.186`:
  ```bash
  sudo iptables -A FORWARD -s 10.0.0.0/24 -d 192.168.1.186 -j ACCEPT
  ```

- Save the rule to make it persistent across reboots:
  ```bash
  sudo apt install iptables-persistent
  sudo netfilter-persistent save
  ```

---

## 5. Enable and Start the WireGuard Interface
- Start the service
    ```bash
    sudo systemctl start wg-quick@wg0
    ```
- Or if you want to shutdown the service and restart it.
    ```bash
    sudo wg-quick down wg0
    sudo wg-quick up wg0
    ```
- Persist after a reboot, add:
    ```bash
    sudo systemctl enable wg-quick@wg0
    ```
---

## 5. Firewall Configuration
- Use `ufw` or `iptables` to allow traffic on port 51564:
- `ufw`:

    ```bash
    sudo ufw allow ListenPort = 51564/udp
    ```
- `iptables`:
    ```bash
    sudo iptables -A INPUT -p udp --dport 51564 -j ACCEPT
    ```

---

## 6. Router Configuration
- There is where you need to hop on the your web browser and put in the ip address of your router. Go find where port forwarding is handled. Since I setup the port to be `51564`. Mu router allowed for external and internal ports, internal ip address of the server, and the connection type `UDP`

---

## 7. Client Configuration
- Install WireGuard on your remote device (e.g., laptop or phone).
- Create a configuration file for the client, here is one for maclappy.conf:
    ```ini
    [Interface]
    PrivateKey = 000000000000000000000000000000000000000000= #<DevicePrivateKey>
    Address = 10.0.0.2/24
    DNS = 1.1.1.1

    [Peer]
    PublicKey = 000000000000000000000000000000000000000000= #<ServerPublicKey>
    Endpoint = 999.999.9.999:42465                          #<ServerPublicIP>:51564
    AllowedIPs = 10.0.0.0/24
    ```
- Then in the GUI app, upload the file to it, and let her rip!
---

## 8. Test the Connection
- Start the client interface and verify connectivity on laptop:
    ```bash
    wg-quick up wg0
    ping 10.0.0.1
    ```
- From the phone, I used [whatismyipaddress](https://whatismyipaddress.com) to confirm my home's outside IP address.

---

## Optional Enhancements
- **NAT Traversal**: Use `Tailscale` if your setup requires it.
- **DNS Configuration**: Set up DNS for hostname resolution.
- **Firewall Setup**: Ensure your router only exposes port 42465 to the server.

---

## Notes
- Use secure methods to store and transfer keys.
- Regularly update WireGuard and monitor the configuration for any unauthorized changes.

---

### Additional Resources
- [WireGuard Documentation](https://www.wireguard.com/)
- [Tailscale Documentation](https://tailscale.com/kb/)

