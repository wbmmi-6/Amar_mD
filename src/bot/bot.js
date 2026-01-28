const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const handleMessage = require('./handler');
const logger = require('../utils/logger');

class WhatsAppBot {
    constructor() {
        // Configure paths for Termux
        const sessionPath = path.join(__dirname, '../../data/sessions');
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }

        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: "whatsapp-bot",
                dataPath: sessionPath
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ],
                executablePath: process.env.CHROME_PATH || 'chromium-browser'
            },
            webVersionCache: {
                type: 'remote',
                remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
            }
        });

        this.init();
    }

    init() {
        // QR Code event
        this.client.on('qr', (qr) => {
            console.log('\n' + '═'.repeat(50));
            console.log('📱 SCAN THIS QR CODE WITH WHATSAPP:');
            console.log('═'.repeat(50) + '\n');
            
            // Display QR in terminal
            qrcode.generate(qr, { small: true });
            
            console.log('\n' + '═'.repeat(50));
            console.log('📝 Steps:');
            console.log('1. Open WhatsApp on your phone');
            console.log('2. Tap Menu (3 dots) → Linked Devices');
            console.log('3. Tap "Link a Device"');
            console.log('4. Scan the QR code above');
            console.log('═'.repeat(50));
            
            // Also save QR to file for easy access
            this.saveQRToFile(qr);
        });

        // When ready
        this.client.on('ready', () => {
            console.log('\n' + '✅'.repeat(20));
            console.log('🤖 BOT IS READY AND CONNECTED!');
            console.log('📱 Connected as: ' + this.client.info.pushname);
            console.log('👤 Phone number: ' + this.client.info.wid.user);
            console.log('✅'.repeat(20) + '\n');
            
            // Show available commands
            this.showHelp();
        });

        // Authentication events
        this.client.on('authenticated', () => {
            console.log('🔐 Authentication successful!');
            console.log('💾 Session saved for future use\n');
        });

        this.client.on('auth_failure', (msg) => {
            console.error('❌ Authentication failed:', msg);
            console.log('🔄 Try deleting data/sessions folder and restarting');
        });

        // Message handling
        this.client.on('message', async (message) => {
            await handleMessage(message, this.client);
        });

        // Listen for disconnection
        this.client.on('disconnected', (reason) => {
            console.log('\n⚠️  Bot disconnected:', reason);
            console.log('🔄 Restarting in 5 seconds...');
            setTimeout(() => {
                this.client.initialize();
            }, 5000);
        });
    }

    saveQRToFile(qr) {
        try {
            const qrPath = path.join(__dirname, '../../data/qr.txt');
            fs.writeFileSync(qrPath, qr);
            console.log(`\n💾 QR code saved to: data/qr.txt`);
            console.log(`📁 You can also use external QR scanner apps to scan from this file\n`);
        } catch (error) {
            logger.error('Failed to save QR:', error);
        }
    }

    showHelp() {
        const helpText = `
╔══════════════════════════════════════════╗
║           🤖 BOT COMMANDS                ║
╠══════════════════════════════════════════╣
║ !help        - Show this help menu      ║
║ !owner       - Contact bot owner        ║
║ !rizz        - Random pickup line       ║
║ !savepic     - Save profile picture     ║
║ !tagall      - Tag all group members    ║
║ !ping        - Check bot response       ║
║ !status      - Show bot status          ║
║ !restart     - Restart the bot          ║
╚══════════════════════════════════════════╝
`;
        console.log(helpText);
    }

    start() {
        this.client.initialize();
    }
}

// Export and start
const bot = new WhatsAppBot();
bot.start();

module.exports = WhatsAppBot;
