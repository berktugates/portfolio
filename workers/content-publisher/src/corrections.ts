import { EmailMessage } from "cloudflare:email";
import { createCorrectionRequest } from "./d1";

type CorrectionPayload = {
  articleUrl?: string;
  storyId?: string;
  requesterName?: string;
  requesterEmail?: string;
  statement?: string;
};

export async function handleCorrectionRequest(request: Request, env: Env): Promise<Response> {
  if (!env.CORRECTION_INGEST_SECRET || request.headers.get("authorization") !== `Bearer ${env.CORRECTION_INGEST_SECRET}`) {
    return new Response("forbidden", { status: 403 });
  }
  let payload: CorrectionPayload;
  try { payload = await request.json() as CorrectionPayload; }
  catch { return Response.json({ error: "invalid-json" }, { status: 400 }); }
  const articleUrl = payload.articleUrl?.trim() ?? "";
  const requesterName = payload.requesterName?.trim() ?? "";
  const requesterEmail = payload.requesterEmail?.trim().toLowerCase() ?? "";
  const statement = payload.statement?.trim() ?? "";
  if (!articleUrl.startsWith("https://haberler.berktugberke.com/") || requesterName.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requesterEmail) || statement.length < 20 || statement.length > 5000) {
    return Response.json({ error: "invalid-request" }, { status: 400 });
  }
  const requestId = crypto.randomUUID();
  await createCorrectionRequest(env, {
    requestId,
    storyId: payload.storyId,
    articleUrl,
    requesterName,
    requesterEmail,
    statement,
  });
  if (env.ALERT_EMAIL && env.ADMIN_ALLOWED_EMAIL) {
    const raw = `From: newsroom@berktugberke.com\r\nTo: ${env.ADMIN_ALLOWED_EMAIL}\r\nSubject: Duzeltme talebi ${requestId}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${articleUrl}\n${requesterName} <${requesterEmail}>\n\n${statement}`;
    await env.ALERT_EMAIL.send(new EmailMessage("newsroom@berktugberke.com", env.ADMIN_ALLOWED_EMAIL, raw));
  }
  return Response.json({ ok: true, requestId }, { status: 202, headers: { "Cache-Control": "no-store" } });
}
