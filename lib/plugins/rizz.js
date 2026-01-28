// plugins/rizz.js
module.exports = {
  name: ".rizz",
  execute: async (sock, m) => {
    const rizzLines = [
      "Hey there 😏",
      "You must be a magician, because whenever I look at you, everyone else disappears 😎",
      "Are you a Wi-Fi signal? Because I'm feeling a strong connection!"
    ];
    const random = rizzLines[Math.floor(Math.random() * rizzLines.length)];
    await sock.sendMessage(m.key.remoteJid, { text: random });
  }
};
