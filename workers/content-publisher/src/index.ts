import { runBlogCron } from "./blog-cron";
import { runHaberCron } from "./haber-cron";
import { flushRevalidatePending } from "./revalidate";

const HABER_CRON = "0 4 * * *";
const BLOG_CRON = "0 6 * * 1";

export default {
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    try {
      await flushRevalidatePending(env);
      if (event.cron === HABER_CRON) {
        await runHaberCron(env);
      } else if (event.cron === BLOG_CRON) {
        await runBlogCron(env);
      } else {
        console.log(`content-publisher: unknown cron ${event.cron}`);
      }
    } catch (e) {
      console.error("content-publisher scheduled error", e);
    }
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return new Response(null, { status: 204 });
    }

    if (url.pathname === "/cron/haber" && request.method === "POST") {
      const auth = request.headers.get("Authorization") ?? "";
      if (!env.MANUAL_CRON_SECRET || auth !== `Bearer ${env.MANUAL_CRON_SECRET}`) {
        return new Response("forbidden", { status: 403 });
      }
      const result = await runHaberCron(env);
      return Response.json(result);
    }

    if (url.pathname === "/cron/blog" && request.method === "POST") {
      const auth = request.headers.get("Authorization") ?? "";
      if (!env.MANUAL_CRON_SECRET || auth !== `Bearer ${env.MANUAL_CRON_SECRET}`) {
        return new Response("forbidden", { status: 403 });
      }
      const result = await runBlogCron(env);
      return Response.json(result);
    }

    return new Response("not found", { status: 404 });
  },
};
