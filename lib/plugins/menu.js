const fs = require("fs");

module.exports = {
  name: ".menu",
  execute: async (sock, m) => {
    // Your menu image URL
    const imageUrl = "https://freeimage.host/i/fix5gKg"; // replace with your image URL

    // Menu text
    const menuText = `
📜 *AMAR-MD Bot Menu*

💠 .ping - Check bot status
💠 .repo - Show GitHub repo
💠 .rizz - Get a rizz message
💠 .tagall - Tag all group members
💠 .pickup - Send a pickup line
`;

    // Send image with caption
    await sock.sendMessage(m.key.remoteJid, {
      image: { url: imageUrl },
      caption: menuText
    });
  }
};
