// index.js - AMAR-MD bot (session always saved)
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs");
const QRCode = require("qrcode");

// Session folder
const sessionFolder = "./session";

// QR path (optional for first login)
const qrPath = "/data/data/com.termux/files/home/storage/downloads/amar_md_qr.png";

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startBot() {
  // Load or create session
  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["AMAR-MD", "Chrome", "1.0"]
  });

  // Always save credentials whenever they update
  sock.ev.on("creds.update", saveCreds);

  // Connection updates
  sock.ev.on("connection.update", async (update) => {
    if (update.qr) {
      // Always save QR to Downloads for first login
      QRCode.toFile(qrPath, update.qr, { width: 400 }, (err) => {
        if (err) console.error(err);
        else console.log(`📱 QR saved to Downloads: ${qrPath}`);
        console.log("Scan QR in WhatsApp → Linked Devices → Link a Device");
      });
    }

    if (update.connection === "open") {
      console.log("✅ Bot connected successfully!");
      // Save session every time connection opens
      saveCreds();
      console.log("💾 Session saved successfully!");
    }

    if (update.connection === "close") {
      console.log("🔄 Connection closed. Reconnecting in 5 seconds...");
      await delay(5000); // Wait before reconnecting
      startBot(); // Retry
    }
  });

  // Message handler
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    // Anti-delete
    if (fs.existsSync("./lib/antiDelete.js")) {
      await require("./lib/antiDelete")(sock, m);
    }

    // Anti view-once
    if (fs.existsSync("./lib/antiViewOnce.js")) {
      await require("./lib/antiViewOnce")(sock, m);
    }

    // Plugins / commands
    if (fs.existsSync("./lib/handler.js")) {
      await require("./lib/handler")(sock, m);
    }
  });
}

// Start bot
startBot();
