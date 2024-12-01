---
title: Setting up a local server to test your DIY webpage
description: Learn how to kick off a python local server step-by-step.
keywords: DIY, web development, local server, python
author: Derek Dreblow
version: 2024-11-30
categories:
  - Web Development
  - Local Server
tags:
  - Web Development
  - Local Server
  - Python
  - Home Brew
---
Notes: Running on `MacOS`, getting `Python 3` on `Homebrew`, then creating a script to launch a local server that doesn't cache.

# Setting up a local server

## 1. Get Homebrew 
* If you don't already a package manager for MacOS, [Homebrew](https://brew.sh) is a great choice! even for the M series chips. The provided link goes over how to get that going.If you're not sure if you have `Homebrew`, try
  ```bash
  brew --version
  ```
* If you/when you're up, 
    ```bash
    brew update
    ```
## 2. Get Python 3
* Use the following command to install Python 3:
  ```bash
  brew install python
  ```
* This will install the latest version of Python 3 and set up symbolic links.

### 1. Verify Python Installation
* Check the installed Python 3 version:
  ```bash
  python 3 --version
  ```
* Check the path to ensure Homebrew’s Python 3 is being used:
  ```bash
  which python3
  ```
* The output should be something like:
  ```bash
  /opt/homebrew/bin/python3
  ```
### 2. Update PATH (Optional)
If Python 3 is not recognized after installation, ensure Homebrew’s Python path is added to your PATH variable.
* Open your shell configuration file (~/.zshrc for zsh):
  ```bash
  nano ~/.zshrc
  ```
* Add the following line:
  ```bash
  export PATH="/opt/homebrew/bin:$PATH"
  ```
* Save and exit (Ctrl + X, then Y and Enter)
* Apply the changes:
  ```bash
  source ~/.zshrc
  ```
### 3. Install Pip (Optional)
* pip (Python's package manager) is typically installed with Python 3. Verify its installation: 
  ```bash
  pip3 --version
  ```
* If its missing, you can install it using:
  ```bash
  python3 -m ensurepip --upgrade
  ```
### 4. Test Python Installation
* Run Python interactively to confirm
  ```bash
  python3
  ```
* You should see a prompt like:
  ```bash
  Python 3.x.x (default, ...)
  [Clang ...] on darwin
  Type "help", "copyright", "credits" or "license" for more information.
  >>>
  ```
* Type exit() to leave.

## 3. Creating the server script
* Create a new .py file, and fill in the following:
```py
import http.server
import socketserver

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add Cache-Control header
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

# Define the port
PORT = 8000

try:
    # Start the server
    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer interrupted. Shutting down gracefully...")
    httpd.server_close()
```
* Then in shell, be in the current directory of your index.html file. If you have the .py file in a different location, then you'll have to state it. In the below example, `LocalServer.py` is the example file name for the .py file.
  ```bash
  python /root/usr/your/script/here/LocalServer.py
  ```
* You know you're good if you can open `localhost:8000` in a web browser, and your site launches. 