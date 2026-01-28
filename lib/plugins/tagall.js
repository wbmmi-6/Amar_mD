module.exports = {
  command: ["tagall"],
  ownerOnly: true,
  async execute(sock, m) {
    const group = await sock.groupMetadata(m.key.remoteJid);
    const members = group.participants.map(p => p.id);

    await sock.sendMessage(m.key.remoteJid, {
      text: "📢 Tagging everyone!",
      mentions: members
    });
  }
};
