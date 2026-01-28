module.exports = {
  command: ["ping"],
  async execute(sock, m) {
    const start = Date.now();
    await sock.sendMessage(m.key.remoteJid, { text: "🏓 Pinging..." });
    const end = Date.now();

    await sock.sendMessage(m.key.remoteJid, {
      text: `🏓 Pong!\nSpeed: ${end - start}ms`
    });
  }
};
