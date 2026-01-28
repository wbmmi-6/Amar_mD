module.exports = {
  command: ["rizz"],
  async execute(sock, m) {
    const lines = [
      "Are you electricity? Because you shock my heart ⚡❤️",
      "Is your smile data bundle? It keeps me connected 😏",
      "You must be WhatsApp, because I can’t stop checking you 👀"
    ];
    await sock.sendMessage(m.key.remoteJid, {
      text: lines[Math.floor(Math.random() * lines.length)]
    });
  }
};
