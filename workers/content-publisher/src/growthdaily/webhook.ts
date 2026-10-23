import { ingestGrowthDailyPost } from "./ingest";
import type { ArticleReadyPayload } from "./types";
import { verifyGrowthDailyWebhook, webhookHeaders } from "./verify";

export async function handleGrowthDailyWebhook(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
): Promise<Response> {
  const secret = env.GROWTHDAILY_WEBHOOK_SECRET;
  if (!secret) return new Response("misconfigured", { status: 503 });

  const rawBody = await request.text();
  const { timestamp, signature } = webhookHeaders(request);
  const valid = await verifyGrowthDailyWebhook({ secret, rawBody, timestamp, signature });
  if (!valid) return new Response("invalid signature", { status: 401 });

  let payload: ArticleReadyPayload;
  try {
    payload = JSON.parse(rawBody) as ArticleReadyPayload;
  } catch {
    return new Response("bad json", { status: 400 });
  }

  if (payload.event === "webhook.test") {
    return Response.json({ ok: true, test: true });
  }

  const ingestEvents = new Set(["article.ready", "article.published", "article.updated"]);
  if (!ingestEvents.has(payload.event)) {
    return Response.json({ ok: true, ignored: payload.event });
  }

  const slug = payload.slug;
  if (!slug) return new Response("missing slug", { status: 400 });

  const runIngest = async (): Promise<Response> => {
    const result = await ingestGrowthDailyPost(env, slug);
    if (!result.ok) {
      return Response.json({ ok: false, code: result.code, detail: result.detail }, { status: 422 });
    }
    if (result.skipped) console.log(`growthdaily webhook skipped slug=${slug} reason=${result.reason ?? "unchanged"}`);
    return Response.json({
      ok: true,
      slug: result.slug,
      locales: result.locales,
      skipped: result.skipped,
      reason: result.reason,
    });
  };

  if (ctx) {
    ctx.waitUntil(
      runIngest().then(async (res) => {
        if (!res.ok) console.error(`growthdaily webhook ingest failed slug=${slug} status=${res.status}`);
      }),
    );
    return Response.json({ ok: true, accepted: true, slug });
  }

  return runIngest();
}
