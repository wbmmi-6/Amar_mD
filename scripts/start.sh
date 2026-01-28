#!/data/data/com.termux/files/usr/bin/bash

clear
echo "Starting WhatsApp Bot..."
echo ""

# Check if running in Termux
if [ ! -d "/data/data/com.termux" ]; then
    echo "⚠️  Warning: Not running in Termux!"
    echo "   Some features may not work properly."
    echo ""
fi

# Check dependencies
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "Run: pkg install nodejs"
    exit 1
fi

if ! command -v chromium &> /dev/null; then
    echo "⚠️  Chromium not found, installing..."
    pkg install chromium -y
fi

# Check .env file
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Copy .env.example to .env and edit it"
    exit 1
fi

# Clean previous sessions if needed
if [ "$1" = "--fresh" ]; then
    echo "🧹 Cleaning previous sessions..."
    rm -rf data/sessions/*
fi

# Start the bot
echo "🤖 Starting WhatsApp Bot..."
echo "📱 You'll see QR code in a moment..."
echo ""
echo "════════════════════════════════════════════"
echo "   SCAN THE QR CODE WITH WHATSAPP"
echo "   WhatsApp → Menu → Linked Devices"
echo "════════════════════════════════════════════"
echo ""

# Export Chrome path for Termux
export CHROME_PATH=$(which chromium)

# Start the bot
node index.js
