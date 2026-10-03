# WALEED WhatsApp Bot v0.3 🔥

Modular WhatsApp Cloud API starter.

## Included
- Webhook verification + incoming message handling
- `/ping`, `/menu`, `/help`
- Reply-based `/react 😂`
- Media message detection
- Storage/event logging foundation
- WhatsApp media download/upload service foundation
- AI routing placeholder
- No View Once bypass

## Setup
1. Copy `.env.example` to `.env`.
2. Fill in your WhatsApp Cloud API token, phone number ID and webhook verification token.
3. Set `GRAPH_API_VERSION` to the API version enabled for your Meta app.
4. Install dependencies:
   `npm install`
5. Run:
   `npm run dev`

## Webhook
Point your Meta webhook callback to:

`https://YOUR-DOMAIN/webhook`

Use the same `VERIFY_TOKEN` in your Meta webhook configuration.

## Important
This project intentionally does not bypass WhatsApp View Once protections. It processes only media made available through the supported API flow.

## Next upgrade
- Real `/save` lookup of the quoted message from persistent message storage
- FFmpeg audio extraction/conversion
- Real AI provider adapter
- PostgreSQL/Redis
- Admin dashboard
- Production logging and signature verification
