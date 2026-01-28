module.exports = {
  command: ["repo"],
  async execute(sock, m) {
    await sock.sendMessage(m.key.remoteJid, {
      text: "📦 *AMAR-MD GitHub Repository*\n\nhttps://github.com/YOUR_USERNAME/YOUR_REPO"
    });
  }
};
