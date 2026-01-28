const commands = require('./commands');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

async function handleMessage(message, client) {
    try {
        const content = message.body.toLowerCase();
        const sender = message.from;
        const chat = await message.getChat();
        
        // Log message
        logger.message(`From: ${sender} | Chat: ${chat.isGroup ? 'Group' : 'Private'} | Message: ${message.body.substring(0, 50)}...`);
        
        // Handle commands (start with ! or .)
        if (content.startsWith('!') || content.startsWith('.')) {
            const prefix = content[0];
            const cmd = content.substring(1).split(' ')[0];
            const args = content.substring(prefix.length + cmd.length + 1).trim();
            
            await handleCommand(cmd, args, message, chat, client);
            return;
        }
        
        // Handle auto-reactions (if enabled)
        if (process.env.AUTO_REACT === 'true') {
            await autoReact(message, client);
        }
        
        // Handle special cases
        if (message.hasMedia) {
            await handleMedia(message, client);
        }
        
    } catch (error) {
        logger.error('Message handler error:', error);
    }
}

async function handleCommand(cmd, args, message, chat, client) {
    try {
        switch(cmd) {
            case 'help':
                await commands.help(message, client);
                break;
                
            case 'owner':
                await commands.owner(message, client);
                break;
                
            case 'rizz':
                await commands.rizz(message, client);
                break;
                
            case 'savepic':
                await commands.saveProfilePic(message, client);
                break;
                
            case 'tagall':
                if (chat.isGroup) {
                    await commands.tagAll(message, chat, client);
                } else {
                    await message.reply('⚠️ This command only works in groups!');
                }
                break;
                
            case 'ping':
                await message.reply('🏓 Pong! Bot is alive.');
                break;
                
            case 'status':
                const status = `🤖 Bot Status:
• Uptime: ${process.uptime().toFixed(0)}s
• Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB
• Connected: Yes
• User: ${client.info?.pushname || 'Unknown'}
• Version: 1.0.0`;
                await message.reply(status);
                break;
                
            case 'restart':
                if (message.from.includes(process.env.OWNER_NUMBER)) {
                    await message.reply('🔄 Restarting bot...');
                    process.exit(0);
                }
                break;
                
            default:
                await message.reply(`❌ Unknown command. Use *!help* for available commands.`);
        }
    } catch (error) {
        logger.error('Command error:', error);
        await message.reply('❌ Error executing command.');
    }
}

async function autoReact(message, client) {
    try {
        // Auto react to messages from specific people
        const autoReactNumbers = (process.env.AUTO_REACT_NUMBERS || '').split(',');
        
        if (autoReactNumbers.includes(message.from) || process.env.AUTO_REACT_ALL === 'true') {
            await message.react('❤️');
        }
    } catch (error) {
        // Silent fail for reactions
    }
}

async function handleMedia(message, client) {
    try {
        // Save media if it's view once
        if (message.isViewOnce) {
            const media = await message.downloadMedia();
            const filename = `viewonce_${Date.now()}.${media.mimetype.split('/')[1]}`;
            const filepath = path.join(__dirname, '../../data/media', filename);
            
            fs.writeFileSync(filepath, media.data, 'base64');
            logger.message(`Saved view-once media: ${filename}`);
            
            // Notify owner
            if (process.env.OWNER_NUMBER) {
                const ownerMsg = `📸 View-once media saved from ${message.from}\n📁 File: ${filename}`;
                await client.sendMessage(process.env.OWNER_NUMBER, ownerMsg);
            }
        }
    } catch (error) {
        logger.error('Media handler error:', error);
    }
}

module.exports = handleMessage;
