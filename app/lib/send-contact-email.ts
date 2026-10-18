import { contactInboundEmail } from "./contact-inbound";

type ContactEmailPayload = {
  name: string;
  email: string;
  projectTypeLabel: string;
  details: string;
  locale: string;
  sentAt: number;
};

async function sendViaFormSubmit(payload: ContactEmailPayload): Promise<boolean> {
  const inbox = process.env.CONTACT_FORMSUBMIT_EMAIL?.trim();
  if (!inbox) return false;

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "https://berktugberke.com",
      Referer: "https://berktugberke.com/tr/contact",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      project_type: payload.projectTypeLabel,
      message: payload.details,
      locale: payload.locale,
      _subject: `[${payload.locale}] İletişim formu — ${payload.name}`,
      _template: "table",
      _captcha: "false",
    }),
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) return false;
  const data = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
  return data?.success === true || data?.success === "true";
}

async function sendViaContentPublisher(payload: ContactEmailPayload): Promise<boolean> {
  const endpoint = process.env.CONTENT_PUBLISHER_CONTACT_URL?.trim();
  const secret = process.env.CONTACT_INGEST_SECRET?.trim();
  if (!endpoint || !secret) return false;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      projectType: payload.projectTypeLabel,
      details: payload.details,
      locale: payload.locale,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  return response.ok;
}

async function sendViaEmailJs(payload: ContactEmailPayload): Promise<boolean> {
  const serviceId = process.env.EMAILJS_SERVICE_ID?.trim();
  const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim();
  if (!serviceId || !templateId || !publicKey) return false;

  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();
  const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      ...(privateKey ? { accessToken: privateKey } : {}),
      template_params: {
        to_email: contactInboundEmail(),
        from_name: payload.name,
        reply_to: payload.email,
        project_type: payload.projectTypeLabel,
        message: payload.details,
        name: payload.name,
        email: payload.email,
        title: payload.projectTypeLabel,
        time: new Intl.DateTimeFormat(payload.locale === "tr" ? "tr-TR" : "en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "UTC",
        }).format(new Date(payload.sentAt)),
      },
    }),
    signal: AbortSignal.timeout(8_000),
  });

  return emailResponse.ok;
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<boolean> {
  if (await sendViaFormSubmit(payload)) return true;
  if (await sendViaContentPublisher(payload)) return true;
  return sendViaEmailJs(payload);
}
