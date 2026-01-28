const config = require("../../config");

module.exports = {
  command: ["owner"],
  async execute(sock, m) {
    await sock.sendMessage(m.key.remoteJid, {
      contacts: {
        displayName: config.ownerName,
        contacts: [{
          vcard: `BEGIN:VCARD\nFN:${config.ownerName}\nTEL;waid=${config.ownerNumber}:${config.ownerNumber}\nEND:VCARD`
        }]
      }
    });
  }
};
