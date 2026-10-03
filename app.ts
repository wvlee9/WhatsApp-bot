import express from "express";
import { config } from "./config";
import { webhookRouter } from "./webhook";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, bot: "WALEED WhatsApp Bot", version: "0.3.0" });
});

app.use("/webhook", webhookRouter);

app.listen(config.port, () => {
  console.log(`WALEED WhatsApp Bot v0.3 listening on :${config.port}`);
});