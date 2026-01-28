// lib/handler.js
const fs = require("fs");
const path = require("path");

module.exports = async (sock, m) => {
  try {
    // Get the message text
    const msg = m.message?.conversation || m.message?.extendedTextMessage?.text;
    if (!msg) return;

    // Convert to lowercase for easier matching
    const command = msg.toLowerCase().trim();

    // Load all plugin files dynamically
    const pluginFolder = path.join(__dirname, "../plugins");
    const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith(".js"));

    // Loop through each plugin and execute if command matches
    for (const file of pluginFiles) {
      const plugin = require(path.join(pluginFolder, file));

      // Each plugin must export: { name: "command", execute: async function }
      if (plugin.name && plugin.execute && plugin.name === command) {
        await plugin.execute(sock, m);
        return; // Stop after first match
      }
    }

  } catch (err) {
    console.error("Handler error:", err);
  }
};
