#!/data/data/com.termux/files/usr/bin/bash

echo "╔═══════════════════════════════════════╗"
echo "║    WhatsApp Bot Termux Setup         ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Update packages
echo "📦 Updating packages..."
pkg update -y && pkg upgrade -y

# Install required packages
echo "📦 Installing Node.js..."
pkg install nodejs -y

echo "📦 Installing Git..."
pkg install git -y

echo "📦 Installing Python..."
pkg install python -y

echo "📦 Installing FFmpeg..."
pkg install ffmpeg -y

echo "📦 Installing wget..."
pkg install wget -y

# Install chromium for Termux
echo "📦 Installing Chromium..."
pkg install chromium -y

echo "📦 Installing necessary libraries..."
pkg install -y libcairo libjpeg-turbo libpng libwebp giflib pixman

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p ~/whatsapp-bot/data/{sessions,media,profiles}

# Clone repository (if needed)
echo "📥 Cloning repository..."
cd ~
if [ ! -d "whatsapp-bot-termux" ]; then
    git clone https://github.com/yourusername/whatsapp-bot-termux.git
fi

cd whatsapp-bot-termux

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Set permissions
echo "🔐 Setting permissions..."
chmod +x scripts/*.sh
chmod +x index.js

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration!"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file: nano .env"
echo "2. Add your phone number: OWNER_NUMBER=1234567890"
echo "3. Start bot: npm start"
echo ""
echo "📱 The QR code will appear in terminal"
echo "📸 Scan it with WhatsApp → Linked Devices"
echo ""
