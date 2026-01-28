// lib/handler.js
const fs = require("fs");
const path = require("path");

module.exports = async (sock, m) => {
  try {
    // Only text messages
    const msg = m.message?.conversation || m.message?.extendedTextMessage?.text;
    if (!msg) return;

    // Convert to lowercase
    const command = msg.toLowerCase().trim();

    // Path to plugins
    const pluginFolder = path.join(__dirname, "../plugins");

    // Make sure folder exists
    if (!fs.existsSync(pluginFolder)) return;

    // Read plugin files
    const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith(".js"));

    for (const file of pluginFiles) {
      const plugin = require(path.join(pluginFolder, file));

      // Each plugin must have: name and execute
      if (plugin.name === command && plugin.execute) {
        await plugin.execute(sock, m);
        return;
      }
    }

  } catch (err) {
    console.error("Handler error:", err);
  }
};
