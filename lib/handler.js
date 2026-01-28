// lib/handler.js
module.exports = async (sock, m) => {
  try {
    // Ignore status updates or messages without content
    if (!m.message) return;

    // Get message text from all possible types
    const messageContent =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      m.message.videoMessage?.caption;

    if (!messageContent) return;

    const command = messageContent.toLowerCase().trim();

    // Load plugins dynamically
    const fs = require("fs");
    const path = require("path");
    const pluginFolder = path.join(__dirname, "../plugins");

    if (!fs.existsSync(pluginFolder)) return;

    const pluginFiles = fs.readdirSync(pluginFolder).filter(f => f.endsWith(".js"));

    for (const file of pluginFiles) {
      const plugin = require(path.join(pluginFolder, file));
      if (plugin.name === command && plugin.execute) {
        await plugin.execute(sock, m);
        return;
      }
    }
  } catch (err) {
    console.error("Handler error:", err);
  }
};
