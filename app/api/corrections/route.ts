import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret || !token) return false;
  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  if (!response.ok) return false;
  return Boolean(((await response.json()) as { success?: boolean }).success);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;
  if (origin && origin !== expectedOrigin) return NextResponse.json({ error: "csrf" }, { status: 403 });
  const form = await request.formData();
  const token = String(form.get("cf-turnstile-response") ?? "");
  if (!(await verifyTurnstile(token, request.headers.get("cf-connecting-ip")))) {
    return NextResponse.json({ error: "turnstile" }, { status: 400 });
  }
  const endpoint = process.env.CONTENT_PUBLISHER_CORRECTION_URL;
  const secret = process.env.CORRECTION_INGEST_SECRET;
  if (!endpoint || !secret) return NextResponse.json({ error: "not-configured" }, { status: 503 });
  const payload = {
    articleUrl: String(form.get("articleUrl") ?? ""),
    requesterName: String(form.get("requesterName") ?? ""),
    requesterEmail: String(form.get("requesterEmail") ?? ""),
    statement: String(form.get("statement") ?? ""),
  };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({ error: "upstream" }));
  return NextResponse.json(data, { status: response.status });
}
