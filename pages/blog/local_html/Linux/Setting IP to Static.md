---
title: Setting IP to Static on Ubuntu Server
description: Learn how to set a static IP address on Ubuntu Server step-by-step.
keywords: ubuntu, static ip, networking, server configuration, linux
author: Derek Dreblow
version: 2025-09-30
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
      eth0:                   # Replace with your interface name
        dhcp4: false
        addresses:
          - 192.168.1.100/24   # Replace with your desired IP and subnet mask
        routes:
          - to: default
            via: 192.168.1.1   # Replace with your gateway
        nameservers:
          addresses:
            - 8.8.8.8          # Google DNS
            - 8.8.4.4

      eth1:
        dhcp4: false
        addresses:
        - 10.10.10.1/24       # second NIC, this example is a private network
  ```

## 5. Apply Configuration

- Apply the changes using:
  ```bash
  sudo netplan generate
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

## 8. Restart Network Services

- If issues persist, restart the network service:
  ```bash
  sudo systemctl restart systemd-networkd
  ```

## 9. Optional: Enable forwarding

- When you enable IP forwarding, Linux begins routing traffic between interfaces (e.g., from your `192.168.1.0/24` network to your `10.10.10.0/24` network).
This is required if Node 1 is acting as a gateway or bridge between your LAN and your direct private network link.

- For example, lets say `node 1` is your webserver, and `node 2` is a NAS, and you decide to private and direct connect `node 1` and `node 2` together. This private connection is `10.10.10.0` and your other network your workstation is on `192.168.1.0`. How to get access `10.10.10.0`? We can use `node 1` to forward packets instead of an all out gateway, but your workstation needs to know this.

On node 1
  ```bash
  echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  ```

##### On MacOS workstation - temporary
* `node 1` ip address example is `192.168.1.50`

```bash
sudo route -n add 10.10.10.0/24 192.168.1.50
```

##### On MacOS workstation - permanent
Create a file

```bash
sudo nano /Library/LaunchDaemons/com.local.staticroutes.plist
```

Add:
```plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key><string>com.local.staticroutes</string>
    <key>ProgramArguments</key>
    <array>
      <string>/sbin/route</string>
      <string>-n</string>
      <string>add</string>
      <string>10.10.10.0/24</string>
      <string>192.168.2.50</string>
    </array>
    <key>RunAtLoad</key><true/>
  </dict>
</plist>
```

Then load it:
```bash
sudo launchctl load /Library/LaunchDaemons/com.local.staticroutes.plist
```

Now it’ll reapply at every boot.

##### Test it
You should be able to ping the private network, assuming we made `node 1` second NIC `10.10.10.1` and `node 2` `10.10.10.2`
```bash
ping 10.10.10.2
```