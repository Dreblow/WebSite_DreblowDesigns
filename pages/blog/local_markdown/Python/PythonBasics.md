---
title: Python
description: Tips and tricks for Python
keywords: Python, Guide, How-to
author: Derek Dreblow
version: 2024-12-21
categories:
  - Python
tags:
  - Python
  - Guide
---

# Python Basics

## Overview
Times keep changing for the tools we use. Since so many solutions are relaying on Python, Python has gotten to the point 
where it needs to be isolated so packages don't negatively impact each other. 

This guide hopes to help those who run into issues with Python. Please note this guide is from the perspective of MacOS Sequoia. 

---
## Checking Python Version
- For Python under 3 or python 3, respectively.
    ```bash
    python --version
    python3 --version
    ```

## Locate Python
- Find the exact locations of the Python executables:
    ```bash
    which python
    which python3
    ```
- List Python Installed via Homebrew
    ```bash
    brew list | grep python
    ```
- You can check the version via `pyenv`
    ```bash
    brew install pyenv
    pyenv versions
    ```
## Installing Python
#### Check Home Brew
- `Homnebrew` is a good choice as package manager. Its good practice to update `Homebrew` is you have'nt done so.
    ```bash
    brew --version
    brew update
    ```
- Then to install `Python` 
    ```bash
    brew install python
    ```

#### Updating PATH
- Use the correct Python version. Homebrew installs Python in /usr/local/bin (Intel Macs) or /opt/homebrew/bin (M1/M2 Macs). Ensure that this version is prioritized in your PATH.
- Add the following to your ~/.zshrc or ~/.bashrc (depending on your shell):
    ```bash 
    export PATH="/usr/local/bin:$PATH"  # For Intel Macs
    export PATH="/opt/homebrew/bin:$PATH"  # For M1/M2 Macs
    ```
- Reload your shell:
    ```bash
    source ~/.zshrc
    ```

## Install a Specific Version of Python
- If you need a specific version of Python, you can use Homebrew’s `python@x` formula. For example:
- Install Python 3.10:
    ```bash
    brew install python@3.10
    ```
- To use a specific version, link it to your default python3 command:
    ```bash
    brew link --overwrite python@3.10
    ```

## Setting up a Virtual Environment
- This one was new to me, I need to know setup virtual environments to download packages and develop! 

#### 1. Prerequisites 
- Ensure you have Python installed. Verify the version:
    ```bash
    python3 --version
    ```

#### 2. Create a Virtual Environment 
- Navigate to Your Project Directory:
    ```bash
    cd /path/to/your/project
    ```

- Use Python’s built-in `venv` module to create the environment:
    ```bash
    python3 -m venv venv_name
    ```

- Replace `venv_name` with the desired name for the virtual environment (e.g., venv or env).
- This creates a directory named `venv_name` containing the virtual environment.

#### 3. Activate the Virtual Environment
- macOS/Linux:
    ```bash
    source venv_name/bin/activate
    ```
- Windows:
    ```bash
    venv_name\Scripts\activate
    ```

- Once activated, you’ll see the environment name in your shell prompt, indicating that the virtual environment is active, e.g.:
    ```bash
    (venv_name) user@computer:~/project$
    ```

- To exit the virtual environment:
    ```bash
    deactivate
    ```

#### 4. Install Packages
- This will install packages locally to the virtual environment only, which is the point of it. 
- Once you `deactivate`, the packages are no longer reachable, but they are still there in the project directory.
- Inside the virtual environment, you can use pip to install packages:
    ```bash 
    pip install package_name
    ```
- Example:
    ```bash
    pip install numpy
    ```

- List current packages:
    ```bash
    pip list
    ```

#### 5. Re-Activate the Environment
- If you need to work on the project again, re-activate the virtual environment:
    ```bash
    source venv_name/bin/activate  # macOS/Linux
    venv_name\Scripts\activate     # Windows
    ```

#### 6. Save and Reuse Dependencies
- To share your environment with others or recreate it via export installed packages:
    ```bash 
    pip freeze > requirements.txt
    ```

- Reinstall Dependencies in a New Environment:
    ```bash
    pip install -r requirements.txt
    ```
- Delete a Virtual Environment
    ```bash
    rm -rf venv_name
    ```

#### 7. Using Virtual Environments with IDEs
- Most modern IDEs (like VSCode or PyCharm) detect and integrate with virtual environments automatically.
- VSCode:
    - Install the Python extension.
    - Open the Command Palette `(Ctrl+Shift+P` or `Cmd+Shift+P)`
    - Select “Python: Select Interpreter” and choose the virtual environment.
- PyCharm:
    - Go to “Settings” → “Project Interpreter.”
    - Add your virtual environment as a new interpreter.

By using virtual environments, you can keep your Python projects organized and avoid dependency conflicts. Cheers!