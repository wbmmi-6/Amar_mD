// plugins/menu.js
module.exports = {
  name: ".menu",
  execute: async (sock, m) => {
    const menuText = `
📜 *AMAR-MD Bot Menu*

💠 .ping - Check bot status
💠 .repo - Show GitHub repo
💠 .rizz - Get a rizz message
💠 .tagall - Tag all group members
💠 .pickup - Send a pickup line
`;
    await sock.sendMessage(m.key.remoteJid, { text: menuText });
  }
};
