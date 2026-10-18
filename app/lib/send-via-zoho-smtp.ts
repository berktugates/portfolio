import nodemailer from "nodemailer";
import { contactInboundEmail } from "./contact-inbound";

export type ZohoContactPayload = {
  name: string;
  email: string;
  projectTypeLabel: string;
  details: string;
  locale: string;
  sentAt: number;
};

function zohoSmtpConfig() {
  const user = process.env.ZOHO_SMTP_USER?.trim();
  const pass = process.env.ZOHO_SMTP_PASSWORD?.trim();
  if (!user || !pass) return null;

  const host = process.env.ZOHO_SMTP_HOST?.trim() || "smtppro.zoho.com";
  const port = Number(process.env.ZOHO_SMTP_PORT?.trim() || "465");
  const secure = process.env.ZOHO_SMTP_SECURE?.trim() !== "false";

  return { user, pass, host, port, secure };
}

export function isZohoSmtpConfigured(): boolean {
  return zohoSmtpConfig() !== null;
}

export async function sendViaZohoSmtp(payload: ZohoContactPayload): Promise<boolean> {
  const config = zohoSmtpConfig();
  if (!config) return false;

  const from =
    process.env.ZOHO_MAIL_FROM?.trim() ||
    process.env.ZOHO_SMTP_USER?.trim() ||
    `contact@berktugberke.com`;
  const to = contactInboundEmail();

  const sentLabel = new Intl.DateTimeFormat(payload.locale === "tr" ? "tr-TR" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(payload.sentAt));

  const subject = `[${payload.locale}] İletişim formu — ${payload.name}`;
  const text = [
    `Ad: ${payload.name}`,
    `E-posta: ${payload.email}`,
    payload.projectTypeLabel ? `Proje türü: ${payload.projectTypeLabel}` : "",
    `Zaman (UTC): ${sentLabel}`,
    "",
    payload.details,
  ]
    .filter(Boolean)
    .join("\n");

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });

  await transport.sendMail({
    from: `"Berktuğ Berke Ateş — İletişim" <${from}>`,
    to,
    replyTo: payload.email,
    subject,
    text,
  });

  return true;
}
