module.exports = async (sock, m) => {
  const msg =
    m.message?.viewOnceMessageV2 ||
    m.message?.viewOnceMessageV2Extension;

  if (!msg) return;

  await sock.sendMessage(m.key.remoteJid, {
    text: "👁️ *Anti View-Once*\nForwarded view-once media."
  });

  await sock.sendMessage(m.key.remoteJid, msg.message);
};
