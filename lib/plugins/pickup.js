// plugins/pickup.js
module.exports = {
  name: ".pickup",
  execute: async (sock, m) => {
    const lines = [
      "Are you French? Because *Eiffel* for you 😍",
      "Do you have a map? I just got lost in your eyes 😉",
      "Are you a camera? Every time I look at you, I smile 📸"
    ];
    const random = lines[Math.floor(Math.random() * lines.length)];
    await sock.sendMessage(m.key.remoteJid, { text: random });
  }
};
