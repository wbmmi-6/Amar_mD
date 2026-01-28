// plugins/ping.js
module.exports = {
  name: ".ping",
  execute: async (sock, m) => {
    await sock.sendMessage(m.key.remoteJid, { text: "🏓 Pong!" });
  }
};
