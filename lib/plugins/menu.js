const config = require("../../config");

module.exports = {
  name: "menu",
  command: ["menu", "help"],
  async execute(sock, m) {
    const buttons = [
      { buttonId: ".rizz", buttonText: { displayText: "💘 Rizz" }, type: 1 },
      { buttonId: ".tagall", buttonText: { displayText: "📢 Tag All" }, type: 1 },
      { buttonId: ".owner", buttonText: { displayText: "👤 Owner" }, type: 1 }
    ];

    await sock.sendMessage(m.key.remoteJid, {
      image: { url: config.menuImage },
      caption: `🤖 *${config.botName}*\n\nA smart WhatsApp MD bot with powerful features.\n\nType a button below 👇`,
      buttons,
      footer: "AMAR-MD • Multi Device",
      headerType: 4
    });
  }
};
