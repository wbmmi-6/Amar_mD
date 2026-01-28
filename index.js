// index.js
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const readline = require("readline-sync");
const fs = require("fs");

// Ask for WhatsApp number
const phoneNumber = readline.question("Enter your WhatsApp number (with country code, e.g., 233xxxxxxxxx): ");

async function startBot() {
  // Create session folder for this number
  const { state, saveCreds } = await useMultiFileAuthState(`./session-${phoneNumber}`);

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["AMAR-MD", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    if (update.connection === "open") {
      console.log("✅ Connected successfully!");
      // Generate pairing code (base64 of session)
      const pairingCode = Buffer.from(JSON.stringify(state)).toString("base64");
      console.log("\n🔑 Your pairing code is:\n", pairingCode);
      console.log("\nSave this code somewhere safe. You can use it to log in without QR.");
    }

    if (update.connection === "close") {
      console.log("🔄 Connection closed, restarting...");
      startBot();
    }
  });

  // Message handler (plugins, anti-delete, etc.)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;
    await require("./lib/antiDelete")(sock, m);
    await require("./lib/antiViewOnce")(sock, m);
    await require("./lib/handler")(sock, m);
  });
}

startBot();
