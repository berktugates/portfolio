import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { contactInboundEmail } from "../../lib/contact-inbound";
import {
  contactProjectLabel,
  contactSubmissionUserMessage,
  parseContactSubmission,
  parseFormLocale,
} from "../../lib/contact-form";
import { getContactPageCopy } from "../../lib/i18n/contact-page-copy";

export const dynamic = "force-dynamic";

const COOLDOWN_SECONDS = 10 * 60;
const recentIps = new Map<string, number>();

function json(body: Record<string, string>, status: number, retryAfter?: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
    },
  });
}

function requestIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function ipKey(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

async function verifyTurnstile(token: string, ip: string, hostname: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return false;

  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  body.set("remoteip", ip);
  body.set("idempotency_key", randomUUID());

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean; action?: string; hostname?: string };
  if (!result.success) return false;
  if (result.action && result.action !== "contact") return false;
  const host = hostname.toLowerCase();
  const verified = (result.hostname ?? "").toLowerCase();
  return (
    verified === host ||
    verified === `www.${host}` ||
    host === `www.${verified}` ||
    (process.env.NODE_ENV !== "production" && (verified === "localhost" || verified === "127.0.0.1"))
  );
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const fallbackApi = getContactPageCopy("en").api;
  const origin = request.headers.get("origin");
  if (!origin || origin !== requestUrl.origin) return json({ error: fallbackApi.invalidRequest }, 403);

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_384) return json({ error: fallbackApi.tooLarge }, 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: fallbackApi.formUnreadable }, 400);
  }

  const locale = parseFormLocale(form);
  const api = getContactPageCopy(locale).api;

  if (request.headers.get("cookie")?.includes("contact_cooldown=1")) {
    return json({ error: api.cooldown }, 429, COOLDOWN_SECONDS);
  }

  const ip = requestIp(request);
  const key = ipKey(ip);
  const now = Date.now();
  const lastAttempt = recentIps.get(key) ?? 0;
  if (now - lastAttempt < COOLDOWN_SECONDS * 1_000) {
    const retryAfter = Math.ceil((COOLDOWN_SECONDS * 1_000 - (now - lastAttempt)) / 1_000);
    return json({ error: api.cooldown }, 429, retryAfter);
  }

  const parsed = parseContactSubmission(form, now);
  if (!parsed.ok) return json({ error: contactSubmissionUserMessage(parsed.error, locale) }, 400);

  let turnstileValid = false;
  try {
    turnstileValid = await verifyTurnstile(parsed.value.turnstileToken, ip, requestUrl.hostname);
  } catch {
    return json({ error: api.turnstileUnavailable }, 503);
  }
  if (!turnstileValid) {
    return json({ error: api.turnstileFailed }, 400);
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) {
    return json({ error: api.serviceUnavailable }, 503);
  }

  recentIps.set(key, now);
  let emailResponse: Response;
  try {
    emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        ...(process.env.EMAILJS_PRIVATE_KEY ? { accessToken: process.env.EMAILJS_PRIVATE_KEY } : {}),
        template_params: {
          to_email: contactInboundEmail(),
          from_name: parsed.value.name,
          reply_to: parsed.value.email,
          project_type: contactProjectLabel(parsed.value.projectType, locale),
          message: parsed.value.details,
          name: parsed.value.name,
          email: parsed.value.email,
          title: contactProjectLabel(parsed.value.projectType, locale),
          time: new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "UTC",
          }).format(new Date(now)),
        },
      }),
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    recentIps.delete(key);
    return json({ error: api.emailUnreachable }, 502);
  }

  if (!emailResponse.ok) {
    recentIps.delete(key);
    return json({ error: api.emailFailed }, 502);
  }

  const response = json({ message: api.success }, 200);
  response.cookies.set("contact_cooldown", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOLDOWN_SECONDS,
    path: "/api/contact",
  });
  return response;
}
