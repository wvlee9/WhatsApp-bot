import fs from "fs";
import path from "path";
import { config } from "../config";

const file = path.resolve(config.storageDir, "events.jsonl");

export async function logEvent(event: unknown) {
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.appendFile(file, JSON.stringify({ at: new Date().toISOString(), event }) + "\n");
}