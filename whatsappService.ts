import axios from "axios";
import fs from "fs";
import path from "path";
import { config } from "../config";

function graphBase() {
  return `https://graph.facebook.com/${config.graphApiVersion}`;
}

function headers() {
  return { Authorization: `Bearer ${config.whatsappToken}` };
}

export async function sendText(to: string, body: string) {
  return axios.post(
    `${graphBase()}/${config.phoneNumberId}/messages`,
    { messaging_product: "whatsapp", to, type: "text", text: { body } },
    { headers: { ...headers(), "Content-Type": "application/json" } }
  );
}

export async function sendReaction(to: string, messageId: string, emoji: string) {
  return axios.post(
    `${graphBase()}/${config.phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "reaction",
      reaction: { message_id: messageId, emoji }
    },
    { headers: { ...headers(), "Content-Type": "application/json" } }
  );
}

export async function getMediaInfo(mediaId: string): Promise<{ url: string; mime_type?: string; sha256?: string; file_size?: number }> {
  const response = await axios.get(`${graphBase()}/${mediaId}`, { headers: headers() });
  return response.data;
}

export async function downloadMedia(mediaId: string, destination: string) {
  const info = await getMediaInfo(mediaId);
  await fs.promises.mkdir(path.dirname(destination), { recursive: true });
  const response = await axios.get(info.url, {
    headers: headers(),
    responseType: "arraybuffer"
  });
  await fs.promises.writeFile(destination, response.data);
  return { ...info, destination };
}

export async function uploadMedia(filePath: string, mimeType: string) {
  const form = new FormData();
  const blob = new Blob([await fs.promises.readFile(filePath)], { type: mimeType });
  form.append("messaging_product", "whatsapp");
  form.append("file", blob, path.basename(filePath));
  const response = await fetch(`${graphBase()}/${config.phoneNumberId}/media`, {
    method: "POST",
    headers: headers(),
    body: form
  });
  if (!response.ok) throw new Error(`Media upload failed: ${response.status} ${await response.text()}`);
  return await response.json() as { id: string };
}

export async function sendMediaById(
  to: string,
  type: "image" | "video" | "audio" | "document",
  mediaId: string,
  caption?: string,
  filename?: string
) {
  const media: Record<string, unknown> = { id: mediaId };
  if (caption && ["image", "video", "document"].includes(type)) media.caption = caption;
  if (filename && type === "document") media.filename = filename;

  return axios.post(
    `${graphBase()}/${config.phoneNumberId}/messages`,
    { messaging_product: "whatsapp", to, type, [type]: media },
    { headers: { ...headers(), "Content-Type": "application/json" } }
  );
}