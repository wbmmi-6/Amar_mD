const handler = require("./lib/handler");

sock.ev.on("messages.upsert", async ({ messages }) => {
  const m = messages[0];
  if (!m.message) return;
  await handler(sock, m);
});
