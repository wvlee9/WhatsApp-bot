import "dotenv/config";

export const config = {
  port: Number(process.env.PORT || 3000),
  verifyToken: process.env.VERIFY_TOKEN || "",
  whatsappToken: process.env.WHATSAPP_TOKEN || "",
  phoneNumberId: process.env.PHONE_NUMBER_ID || "",
  graphApiVersion: process.env.GRAPH_API_VERSION || "vXX.X",
  adminWaId: process.env.ADMIN_WA_ID || "",
  aiApiKey: process.env.AI_API_KEY || "",
  aiModel: process.env.AI_MODEL || "",
  storageDir: process.env.STORAGE_DIR || "./storage"
};

export function requireWhatsAppConfig() {
  if (!config.whatsappToken || !config.phoneNumberId || config.graphApiVersion === "vXX.X") {
    throw new Error("WhatsApp Cloud API configuration is incomplete. Check .env");
  }
}