// index.js - AMAR-MD Termux-ready
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs");
const QRCode = require("qrcode");

// Path for session folder
const sessionFolder = "./session";

// Path to save QR code (Downloads folder)
const qrPath = "/data/data/com.termux/files/home/storage/downloads/amar_md_qr.png";

async function startBot() {
  // Load or create session
  const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["AMAR-MD", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  // Connection updates
  sock.ev.on("connection.update", (update) => {
    if (update.qr) {
      // First-time login: save QR to Downloads
      QRCode.toFile(qrPath, update.qr, { width: 400 }, (err) => {
        if (err) console.error(err);
        else console.log(`📱 First-time login! QR saved to Downloads: ${qrPath}`);
        console.log("Open Files app → Downloads → scan QR with WhatsApp → Linked Devices → Link a Device");
      });
    }

    if (update.connection === "open") {
      console.log("✅ Bot connected successfully!");
    }

    if (update.connection === "close") {
      console.log("🔄 Connection closed. Restarting...");
      startBot();
    }
  });

  // Handle incoming messages
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

// Start the bot
startBot();
