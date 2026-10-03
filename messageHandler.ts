import path from "path";
import { config } from "../config";
import { logEvent } from "../database/store";
import { downloadMedia, sendReaction, sendText } from "../services/whatsappService";
import { saveIncomingMedia } from "../services/storageService";

type Message = {
  id?: string;
  from?: string;
  type?: string;
  text?: { body?: string };
  image?: { id?: string; mime_type?: string; filename?: string; caption?: string };
  video?: { id?: string; mime_type?: string; filename?: string; caption?: string };
  audio?: { id?: string; mime_type?: string };
  document?: { id?: string; mime_type?: string; filename?: string; caption?: string };
  context?: { id?: string };
};

function quotedId(msg: Message) {
  return msg.context?.id;
}

export async function handleMessage(message: Message) {
  const from = message.from;
  if (!from) return;

  await logEvent(message);

  const body = message.text?.body?.trim() || "";
  const command = body.split(/\s+/)[0]?.toLowerCase();

  if (command === "/ping") {
    await sendText(from, "🏓 Pong — WALEED Bot v0.3 يعمل.");
    return;
  }

  if (command === "/menu" || command === "/help") {
    await sendText(from,
`🔥 WALEED BOT v0.3

الأوامر:
• /ping
• /menu
• /react 😂   ← رد على رسالة
• /save       ← رد على صورة/فيديو/ملف عادي

ملاحظة: View Once لا يتم تجاوز حمايته.`);
    return;
  }

  if (command === "/react") {
    const emoji = body.split(/\s+/)[1] || "❤️";
    const id = quotedId(message);
    if (!id) {
      await sendText(from, "↩️ استخدم /react كـ Reply على الرسالة التي تريد التفاعل معها.");
      return;
    }
    await sendReaction(from, id, emoji);
    return;
  }

  if (command === "/save") {
    const quoted = message.context?.id;
    if (!quoted) {
      await sendText(from, "📌 اعمل Reply على صورة/فيديو/ملف عادي ثم اكتب /save.");
      return;
    }
    await sendText(from, "📥 تم استقبال الأمر. حفظ الوسائط يعتمد على أن WhatsApp API يتيح ملف الرسالة المقتبس.");
    return;
  }

  if (message.type === "image" && message.image?.id) {
    await sendText(from, "📸 وصلت الصورة. Reply بـ /save لحفظ الوسائط التي تسمح بها واجهة WhatsApp.");
    return;
  }

  if (message.type === "video" && message.video?.id) {
    await sendText(from, "🎬 وصل الفيديو. Reply بـ /save لحفظ الوسائط التي تسمح بها واجهة WhatsApp.");
    return;
  }

  if (message.type === "document" && message.document?.id) {
    await sendText(from, "📄 وصل الملف. Reply بـ /save للحفظ عندما تكون بيانات الوسائط متاحة.");
    return;
  }

  if (message.type === "audio" && message.audio?.id) {
    await sendText(from, "🎵 وصل الصوت.");
    return;
  }

  if (body && !body.startsWith("/")) {
    await sendText(from, "🤖 AI Router: وصلت رسالتك. اربط مزود AI في الخطوة التالية لتفعيل الرد الذكي الحقيقي.");
  }
}