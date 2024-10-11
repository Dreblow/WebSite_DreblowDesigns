# Web_Portfolio

Derek Dreblow's personal webportfolio

Enjoy some simple HTML and CSS, with a minimist approach to the site. This repo hopes to help others get going a personal web portfolio, as well.

None of this could happen without Ubuntu Server working hard on my Hyper-V VM.

# Linux Setup

**1. Purchased a Domain and Setup DNS**

* Purchased a domain (**dreblowdesigns.com**) from GoDaddy or others like Namesilo.
* Configured DNS records in GoDaddy to point the A record to your server’s public IP.
* Set up CNAME records for **www.dreblowdesigns.com** to route traffic correctly.

**2. Installed and Configured Nginx on Ubuntu Server on Hyper-V**

* Installed Nginx on your Ubuntu Server.
* Configured the Nginx virtual host file (**dreblowdesigns.com**) to serve your portfolio website.
* Enabled both HTTP and HTTPS traffic.
* Installed an SSL certificate using Certbot for secure HTTPS access with the following commands:

`sudo apt install certbot python3-certbot-nginx`
`sudo certbot --nginx -d dreblowdesigns.com -d www.dreblowdesigns.com`

* Set up redirection from HTTP to HTTPS in the Nginx configuration.

**3. Enabled UFW Firewall on Ubuntu Server**

* Activated the UFW firewall to secure the server.
* Allowed OpenSSH, HTTP (port 80), and HTTPS (port 443) through the firewall.
* Verified the firewall status as active:

`sudo ufw allow OpenSSH`
`sudo ufw allow 'Nginx Full'`
`sudo ufw enable`

**4. Set Up FTP Server with vsftpd**

* Installed **vsftpd** (Very Secure FTP Daemon) on Ubuntu to act as the FTP server.
* Configured vsftpd to use passive mode, with the following settings:

`pasv_enable=YES`
`pasv_min_port=40000`
`pasv_max_port=50000`
`pasv_address=192.168.2.186  # Your server's internal IP`

* Opened the passive port range (40000-50000) in UFW:

`sudo ufw allow 40000:50000/tcp`

* Restarted the vsftpd service to apply the changes.
* Configured vsftpd to use TLS for secure FTP (FTPS).
* Tested the connection with FileZilla, fixed directory listing errors, and enabled passive mode on both the FTP server and FileZilla client.

**5. Configuring webpage source code** 

* Copy all web portfolio code to:

`/var/www/html/`

**6. Configure the config.php file**

* This example uses one's gmail to send emails from the web site.
* At directory location:

`/resources/config.php`

* The above config file needs a username and password.
* User name is one's full email address `john.doe@gmail.com`
* Password is app specific password Google provides.
