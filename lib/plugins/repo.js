// plugins/repo.js
module.exports = {
  name: ".repo",
  execute: async (sock, m) => {
    await sock.sendMessage(m.key.remoteJid, { text: "📂 GitHub Repo: https://github.com/wbmmi-6/Amar_mD" });
  }
};
