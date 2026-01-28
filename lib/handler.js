const fs = require("fs");
const path = require("path");
const config = require("../config");

module.exports = async (sock, m) => {
  const body =
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    "";

  if (!body.startsWith(config.prefix)) return;

  const command = body.slice(1).split(" ")[0];
  const sender = m.key.participant || m.key.remoteJid;

  const pluginsPath = path.join(__dirname, "plugins");
  const plugins = fs.readdirSync(pluginsPath);

  for (let file of plugins) {
    const plugin = require(path.join(pluginsPath, file));
    if (plugin.command.includes(command)) {

      // OWNER ONLY CHECK
      if (plugin.ownerOnly) {
        if (!sender.includes(config.ownerNumber)) {
          return sock.sendMessage(m.key.remoteJid, {
            text: "⛔ This command is for the owner only."
          });
        }
      }

      await plugin.execute(sock, m);
    }
  }
};
