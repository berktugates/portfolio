import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { contactProjectLabel, parseContactSubmission } from "../../lib/contact-form";

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
  if (!result.success || result.action !== "contact") return false;
  return result.hostname === hostname || (process.env.NODE_ENV !== "production" && result.hostname === "localhost");
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (!origin || origin !== requestUrl.origin) return json({ error: "Geçersiz istek." }, 403);

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_384) return json({ error: "İstek çok büyük." }, 413);
  if (request.headers.get("cookie")?.includes("contact_cooldown=1")) {
    return json({ error: "Yeni bir mesaj göndermeden önce 10 dakika bekleyin." }, 429, COOLDOWN_SECONDS);
  }

  const ip = requestIp(request);
  const key = ipKey(ip);
  const now = Date.now();
  const lastAttempt = recentIps.get(key) ?? 0;
  if (now - lastAttempt < COOLDOWN_SECONDS * 1_000) {
    const retryAfter = Math.ceil((COOLDOWN_SECONDS * 1_000 - (now - lastAttempt)) / 1_000);
    return json({ error: "Yeni bir mesaj göndermeden önce 10 dakika bekleyin." }, 429, retryAfter);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Form okunamadı." }, 400);
  }
  const parsed = parseContactSubmission(form, now);
  if (!parsed.ok) return json({ error: "Alanları kontrol edip tekrar deneyin." }, 400);

  let turnstileValid = false;
  try {
    turnstileValid = await verifyTurnstile(parsed.value.turnstileToken, ip, requestUrl.hostname);
  } catch {
    return json({ error: "Güvenlik doğrulaması geçici olarak kullanılamıyor." }, 503);
  }
  if (!turnstileValid) {
    return json({ error: "Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin." }, 400);
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) {
    return json({ error: "İletişim servisi geçici olarak kullanılamıyor." }, 503);
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
          to_email: "contact@berktugberke.com",
          from_name: parsed.value.name,
          reply_to: parsed.value.email,
          project_type: contactProjectLabel(parsed.value.projectType),
          message: parsed.value.details,
          // Keep the stock EmailJS contact-template variables populated too.
          name: parsed.value.name,
          email: parsed.value.email,
          title: contactProjectLabel(parsed.value.projectType),
          time: new Intl.DateTimeFormat("tr-TR", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Istanbul",
          }).format(new Date(now)),
        },
      }),
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    recentIps.delete(key);
    return json({ error: "E-posta servisine ulaşılamadı. Lütfen daha sonra tekrar deneyin." }, 502);
  }

  if (!emailResponse.ok) {
    recentIps.delete(key);
    return json({ error: "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin." }, 502);
  }

  const response = json({ message: "Mesajınız başarıyla gönderildi." }, 200);
  response.cookies.set("contact_cooldown", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOLDOWN_SECONDS,
    path: "/api/contact",
  });
  return response;
}
