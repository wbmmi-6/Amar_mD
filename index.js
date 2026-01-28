// index.js - Termux-ready AMAR-MD bot
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const qrcode = require("qrcode-terminal");

// Your bot modules
const handler = require("./lib/handler");
const antiDelete = require("./lib/antiDelete");
const antiViewOnce = require("./lib/antiViewOnce");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["AMAR-MD", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    if (update.qr) {
      // Print QR as ASCII for Termux
      qrcode.generate(update.qr, { small: true });
      console.log("📱 Scan this QR code with WhatsApp");
    }

    if (update.connection === "close") {
      console.log("🔄 Connection closed, restarting...");
      startBot();
    }

    if (update.connection === "open") {
      console.log("✅ Connected successfully!");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    // Run anti-delete and anti-view-once
    await antiDelete(sock, m);
    await antiViewOnce(sock, m);

    // Handle commands and plugins
    await handler(sock, m);
  });
}

// Start the bot
startBot();
