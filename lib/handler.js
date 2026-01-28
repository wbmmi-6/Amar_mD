const fs = require("fs");
const path = require("path");

module.exports = async (sock, m) => {
  const body =
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    "";

  const pluginsPath = path.join(__dirname, "plugins");
  const plugins = fs.readdirSync(pluginsPath).filter(f => f.endsWith(".js"));

  for (let file of plugins) {
    const plugin = require(path.join(pluginsPath, file));
    if (plugin.command?.includes(body.replace(".", ""))) {
      await plugin.execute(sock, m);
    }
  }
};
