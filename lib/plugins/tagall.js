// plugins/tagall.js
module.exports = {
  name: ".tagall",
  execute: async (sock, m) => {
    try {
      if (!m.key.remoteJid.endsWith("@g.us")) {
        return await sock.sendMessage(m.key.remoteJid, { text: "❌ This command only works in groups!" });
      }

      const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
      const mentions = groupMetadata.participants.map(p => p.id);

      await sock.sendMessage(m.key.remoteJid, { text: "📢 Tagging everyone!", mentions });
    } catch (err) {
      console.error(err);
    }
  }
};
