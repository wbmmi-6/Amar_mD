const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");
const P = require("pino");

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

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    await antiDelete(sock, m);
    await antiViewOnce(sock, m);
    await handler(sock, m);
  });
}

startBot();
