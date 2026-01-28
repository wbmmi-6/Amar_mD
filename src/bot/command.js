const fs = require('fs');
const path = require('path');
const axios = require('axios');

const commands = {
    async help(message, client) {
        const helpText = `
🤖 *WHATSAPP BOT COMMANDS*

*📋 General Commands:*
!help - Show this help menu
!owner - Contact bot owner
!ping - Check if bot is alive
!status - Show bot status

*🎮 Fun Commands:*
!rizz - Get a random pickup line
!joke - Get a funny joke
!quote - Inspirational quote

*👥 Group Commands:*
!tagall - Mention all group members
!info - Group information

*🛠️ Admin Commands:*
!savepic [@mention] - Save profile picture
!restart - Restart bot (owner only)

*🔗 Setup:*
Bot pairs automatically via QR code

📝 *Note:* Some features require admin permissions.
        `;
        await message.reply(helpText);
    },
    
    async owner(message, client) {
        const ownerInfo = `
👑 *BOT OWNER*

📱 *Contact Info:*
• Phone: ${process.env.OWNER_NUMBER || 'Not set'}
• Name: ${process.env.OWNER_NAME || 'Bot Owner'}
• Email: ${process.env.OWNER_EMAIL || 'owner@example.com'}

💬 *Support Group:*
${process.env.SUPPORT_GROUP || 'Not available'}

⚠️ *Only contact for serious issues!*
        `;
        await message.reply(ownerInfo);
    },
    
    async rizz(message, client) {
        const pickupLines = [
            "Are you a magician? Because whenever I look at you, everyone else disappears.",
            "Do you have a map? I keep getting lost in your eyes.",
            "Is your name Google? Because you have everything I've been searching for.",
            "Are you made of copper and tellurium? Because you're Cu-Te.",
            "If you were a vegetable, you'd be a cute-cumber!",
            "Do you believe in love at first sight, or should I walk by again?",
            "Are you a time traveler? Because I see you in my future.",
            "Is there an airport nearby or is it my heart taking off?",
            "Do you have a sunburn, or are you always this hot?",
            "Can I follow you home? Cause my parents always told me to follow my dreams."
        ];
        
        const randomLine = pickupLines[Math.floor(Math.random() * pickupLines.length)];
        await message.reply(`💘 *Rizz Line:*\n\n"${randomLine}"`);
    },
    
    async saveProfilePic(message, client) {
        try {
            let contactId = message.from;
            
            // Check if someone was mentioned
            if (message.mentionedIds && message.mentionedIds.length > 0) {
                contactId = message.mentionedIds[0];
            }
            
            const contact = await client.getContactById(contactId);
            const profilePicUrl = await contact.getProfilePicUrl();
            
            if (profilePicUrl) {
                // Download and save
                const response = await axios.get(profilePicUrl, { responseType: 'arraybuffer' });
                const filename = `${contactId.user}_${Date.now()}.jpg`;
                const filepath = path.join(__dirname, '../../data/profiles', filename);
                
                // Ensure directory exists
                if (!fs.existsSync(path.dirname(filepath))) {
                    fs.mkdirSync(path.dirname(filepath), { recursive: true });
                }
                
                fs.writeFileSync(filepath, Buffer.from(response.data));
                
                await message.reply(`✅ Profile picture saved!\n📁 File: ${filename}\n👤 User: ${contact.pushname || contactId.user}`);
            } else {
                await message.reply('❌ No profile picture available for this user.');
            }
        } catch (error) {
            console.error('Save profile pic error:', error);
            await message.reply('❌ Error saving profile picture.');
        }
    },
    
    async tagAll(message, chat, client) {
        try {
            await chat.fetchParticipants();
            let mentions = "📢 *TAGGING ALL MEMBERS:*\n\n";
            
            chat.participants.forEach((participant, index) => {
                mentions += `@${participant.id.user} `;
                if ((index + 1) % 5 === 0) mentions += '\n';
            });
            
            await chat.sendMessage(mentions, { mentions: chat.participants });
        } catch (error) {
            console.error('Tag all error:', error);
            await message.reply('❌ Error tagging members.');
        }
    }
};

module.exports = commands;
