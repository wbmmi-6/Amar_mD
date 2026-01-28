module.exports = async (sock, m) => {
  if (m.message?.protocolMessage?.type === 0) {
    const msgKey = m.message.protocolMessage.key;

    await sock.sendMessage(m.key.remoteJid, {
      text: "🚫 *Anti-Delete*\nA message was deleted."
    });

    await sock.sendMessage(m.key.remoteJid, {
      forward: msgKey
    });
  }
};
