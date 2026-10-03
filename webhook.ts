import { Router, Request, Response } from "express";
import { config } from "./config";
import { handleMessage } from "./handlers/messageHandler";

export const webhookRouter = Router();

webhookRouter.get("/", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.verifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

webhookRouter.post("/", async (req: Request, res: Response) => {
  try {
    const entry = req.body?.entry ?? [];
    for (const e of entry) {
      for (const change of e.changes ?? []) {
        const value = change.value;
        for (const message of value?.messages ?? []) {
          await handleMessage(message);
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(200);
  }
});