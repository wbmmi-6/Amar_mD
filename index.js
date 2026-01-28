const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");
const readline = require("readline-sync");
const fs = require("fs");

// Ask user for their WhatsApp number
const phoneNumber = readline.question("Enter your WhatsApp number (with country code, e.g., 233xxxxxxxxx): ");

console.log(`You entered: ${phoneNumber}`);

// Path to save the session file for this number
const sessionFile = `./session-${phoneNumber}.json`;

// Load or create session
let state, saveCreds;
if (fs.existsSync(sessionFile)) {
  ({ state, saveCreds } = useSingleFileAuthState(sessionFile));
  console.log("✅ Found existing session. Will login automatically.");
} else {
  ({ state, saveCreds } = useSingleFileAuthState(sessionFile));
  console.log("No session found. A pairing code will be generated after login.");
}

async function startBot() {
  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["AMAR-MD", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    // If first time, generate a pairing code
    if (update.connection === "open" && !fs.existsSync(sessionFile)) {
      const pairingCode = Buffer.from(JSON.stringify(state)).toString("base64");
      console.log("🔑 Your pairing code is:\n", pairingCode);
      console.log("Save this code. Next time you can use it to login without QR.");
    }

    if (update.connection === "close") console.log("🔄 Connection closed, restarting...");
    if (update.connection === "open") console.log("✅ Connected successfully!");
  });

  // Handle messages (plugins, anti-delete, etc.)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;
    await require("./lib/antiDelete")(sock, m);
    await require("./lib/antiViewOnce")(sock, m);
    await require("./lib/handler")(sock, m);
  });
}

startBot();
