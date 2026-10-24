import { runBlogCron } from "./blog-cron";
import { runHaberCron } from "./haber-cron";
import { flushRevalidatePending } from "./revalidate";
import { handleAdminRequest } from "./admin";
import { handleCorrectionRequest } from "./corrections";
import { handleContactIngest } from "./contact-ingest";
import { handleGrowthDailyWebhook } from "./growthdaily/webhook";
import { reconcileGrowthDaily } from "./growthdaily/ingest";
import { growthDailyOpsSnapshot } from "./growthdaily/ops";

const HABER_CRON = "7,22,37,52 * * * *";
const GROWTHDAILY_CRON = "0 */2 * * *";
/** ≈ 07:15 Europe/Istanbul: once-daily cap-aware best-post pick. */
const GROWTHDAILY_DAILY_CRON = "15 4 * * *";

export default {
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    try {
      await flushRevalidatePending(env);
      if (event.cron === HABER_CRON) {
        await runHaberCron(env);
      } else if (event.cron === GROWTHDAILY_CRON || event.cron === GROWTHDAILY_DAILY_CRON) {
        const result = await reconcileGrowthDaily(env);
        console.log(
          `growthdaily reconcile cron=${event.cron} processed=${result.processed} deferredByCap=${result.deferredByCap}`,
        );
      } else {
        console.log(`content-publisher: unknown cron ${event.cron}`);
      }
    } catch (e) {
      console.error("content-publisher scheduled error", e);
    }
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return new Response(null, { status: 204 });
    }

    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
      return handleAdminRequest(request, env);
    }

    if (url.pathname === "/public/corrections" && request.method === "POST") {
      return handleCorrectionRequest(request, env);
    }

    if (url.pathname === "/public/contact" && request.method === "POST") {
      return handleContactIngest(request, env);
    }

    if (url.pathname === "/cron/haber" && request.method === "POST") {
      const auth = request.headers.get("Authorization") ?? "";
      if (!env.MANUAL_CRON_SECRET || auth !== `Bearer ${env.MANUAL_CRON_SECRET}`) {
        return new Response("forbidden", { status: 403 });
      }
      const result = await runHaberCron(env);
      return Response.json(result);
    }

    if (url.pathname === "/webhooks/growthdaily" && request.method === "POST") {
      return handleGrowthDailyWebhook(request, env, ctx);
    }

    if (url.pathname === "/cron/blog" && request.method === "POST") {
      const auth = request.headers.get("Authorization") ?? "";
      if (!env.MANUAL_CRON_SECRET || auth !== `Bearer ${env.MANUAL_CRON_SECRET}`) {
        return new Response("forbidden", { status: 403 });
      }
      const result = await runBlogCron(env);
      return Response.json(result);
    }

    if (url.pathname === "/cron/growthdaily" && request.method === "POST") {
      const auth = request.headers.get("Authorization") ?? "";
      if (!env.MANUAL_CRON_SECRET || auth !== `Bearer ${env.MANUAL_CRON_SECRET}`) {
        return new Response("forbidden", { status: 403 });
      }
      const result = await reconcileGrowthDaily(env);
      return Response.json(result);
    }

    if (url.pathname === "/ops/growthdaily" && request.method === "GET") {
      const auth = request.headers.get("Authorization") ?? "";
      if (!env.MANUAL_CRON_SECRET || auth !== `Bearer ${env.MANUAL_CRON_SECRET}`) {
        return new Response("forbidden", { status: 403 });
      }
      const snapshot = await growthDailyOpsSnapshot(env);
      return Response.json(snapshot, { headers: { "Cache-Control": "no-store" } });
    }

    return new Response("not found", { status: 404 });
  },
};
