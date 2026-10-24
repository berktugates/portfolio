type ContactPayload = {
  name?: string;
  email?: string;
  projectType?: string;
  details?: string;
  locale?: string;
};

export async function handleContactIngest(request: Request, env: Env): Promise<Response> {
  if (
    !env.CONTACT_INGEST_SECRET ||
    request.headers.get("authorization") !== `Bearer ${env.CONTACT_INGEST_SECRET}`
  ) {
    return new Response("forbidden", { status: 403 });
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim().toLowerCase() ?? "";
  const projectType = payload.projectType?.trim() ?? "";
  const details = payload.details?.trim() ?? "";
  const locale = payload.locale?.trim() ?? "en";

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || details.length < 20 || details.length > 8000) {
    return Response.json({ error: "invalid-request" }, { status: 400 });
  }

  const to = env.CONTACT_INBOUND_EMAIL?.trim() ?? env.ADMIN_ALLOWED_EMAIL?.trim();
  if (!to || !env.ALERT_EMAIL) {
    return Response.json({ error: "not-configured" }, { status: 503 });
  }

  const from = env.CONTACT_FROM_EMAIL?.trim();
  if (!from) return new Response("Contact mail not configured", { status: 503 });
  const subject = `[${locale}] İletişim formu — ${name}`;
  const text = [
    `Ad: ${name}`,
    `E-posta: ${email}`,
    projectType ? `Proje türü: ${projectType}` : "",
    "",
    details,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await env.ALERT_EMAIL.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "send-failed";
    return Response.json({ error: message }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 202, headers: { "Cache-Control": "no-store" } });
}
