#!/usr/bin/env node

console.log(`
╔═══════════════════════════════════════╗
║    WhatsApp Bot for Termux           ║
║    With QR Code Pairing              ║
╚═══════════════════════════════════════╝
`);

require('dotenv').config();
const { spawn } = require('child_process');

// Check if running in Termux
const isTermux = process.env.TERMUX_VERSION !== undefined;

if (!isTermux) {
    console.warn('⚠️  This bot is optimized for Termux!');
}

// Start the bot
const botProcess = spawn('node', ['src/bot/bot.js'], {
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '3' }
});

// Start server if enabled
if (process.env.ENABLE_SERVER === 'true') {
    const serverProcess = spawn('node', ['src/server/server.js'], {
        stdio: 'inherit',
        env: { ...process.env, FORCE_COLOR: '3' }
    });
}

console.log('\n📱 Bot is starting...');
console.log('📸 You will see QR code in terminal shortly');
console.log('📝 Scan it with WhatsApp → Linked Devices\n');
