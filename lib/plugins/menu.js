const config = require("../../config");

module.exports = {
  command: ["menu", "help"],
  async execute(sock, m) {
    await sock.sendMessage(m.key.remoteJid, {
      image: { url: config.menuImage },
      caption: `🤖 *${config.botName}*\n\nChoose an option below 👇`,
      buttons: [
        { buttonId: ".rizz", buttonText: { displayText: "💘 Rizz" }, type: 1 },
        { buttonId: ".tagall", buttonText: { displayText: "📢 Tag All" }, type: 1 },
        { buttonId: ".owner", buttonText: { displayText: "👤 Owner" }, type: 1 }
      ],
      footer: "AMAR-MD",
      headerType: 4
    });
  }
};
