import fs from "fs";
import path from "path";
import { config } from "../config";

export function safeName(input: string) {
  return input.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function saveIncomingMedia(mediaId: string, filename: string, download: (id: string, dest: string) => Promise<any>) {
  const dir = path.resolve(config.storageDir);
  await fs.promises.mkdir(dir, { recursive: true });
  const destination = path.join(dir, `${Date.now()}_${safeName(filename)}`);
  return download(mediaId, destination);
}