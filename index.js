// index.js - Termux-ready AMAR-MD bot
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const QRCode = require("qrcode");
const path = "/storage/emulated/0/Download/amar_md_qr.png"; // device Downloads folder

// Bot modules
const handler = require("./lib/handler");
const antiDelete = require("./lib/antiDelete");
const antiViewOnce = require("./lib/antiViewOnce");

async function startBot() {
  // Load authentication state (session)
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["AMAR-MD", "Chrome", "1.0"]
  });

  // Save credentials automatically
  sock.ev.on("creds.update", saveCreds);

  // Connection updates
  sock.ev.on("connection.update", (update) => {
    if (update.qr) {
      // Save QR to device Downloads folder
      QRCode.toFile(path, update.qr, { width: 400 }, (err) => {
        if (err) console.error(err);
        console.log(`📱 QR code saved to your device Downloads folder: ${path}`);
        console.log("Open your Downloads folder and scan the QR with WhatsApp → Linked Devices → Link a Device");
      });
    }

    if (update.connection === "close") {
      console.log("🔄 Connection closed, restarting...");
      startBot();
    }

    if (update.connection === "open") {
      console.log("✅ Connected successfully!");
    }
  });

  // Listen to new messages
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    // Run anti-delete and anti view-once
    await antiDelete(sock, m);
    await antiViewOnce(sock, m);

    // Handle commands/plugins
    await handler(sock, m);
  });
}

// Start the bot
startBot();
