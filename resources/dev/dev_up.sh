#!/bin/bash
set -e

PROJECT_DIR="/Users/derekdreblow/Git/WebSites/WebSite_DreblowDesigns"
MOUNT_POINT="$PROJECT_DIR/resources/media/dreblowdesigns"
SMB_HOST="192.168.2.50"
SMB_USER="dreblow"
LOCAL_PHP_PORT=8000

# 1. Mount SMB share if not already
if mount | grep -q "$MOUNT_POINT"; then
    echo "✅ SMB share already mounted at $MOUNT_POINT"
else
    echo "🔌 Mounting SMB share..."
    mkdir -p "$MOUNT_POINT"
    SMB_PASS=$(security find-internet-password -s "$SMB_HOST" -a "$SMB_USER" -w)
    mount_smbfs //dreblow:$SMB_PASS@192.168.2.51/media/dreblowdesigns "$MOUNT_POINT"  
fi


# 2. Ensure parent resources directory exists
if [ ! -d "$MOUNT_POINT" ]; then
    echo "📁 Creating media directory..."
    mkdir -p "$MOUNT_POINT"
fi

# 3. Ensure media directory exists
if [ ! -d "$PROJECT_DIR/resources/media/dreblowdesigns" ]; then
    echo "📁 Creating media directory..."
    mkdir -p "$PROJECT_DIR/resources/media/dreblowdesigns"
fi

# 4. Start local PHP server
echo "🚀 Starting PHP dev server at http://localhost:$LOCAL_PHP_PORT ..."
cd "$PROJECT_DIR"
php -S localhost:$LOCAL_PHP_PORT