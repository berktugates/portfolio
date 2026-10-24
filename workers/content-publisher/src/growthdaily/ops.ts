import { parseDailyPublishCap, istanbulCalendarDay, DAILY_CAP_REASON } from "./daily-cap";
import {
  countDailyPublishes,
  getGrowthDailySyncCursor,
  listDailyPublishes,
  listDeferredForDay,
} from "./d1-sync";

export async function growthDailyOpsSnapshot(env: Env) {
  const istanbulDay = istanbulCalendarDay();
  const cap = parseDailyPublishCap(env.GROWTHDAILY_DAILY_PUBLISH_CAP);
  const publishedToday = await listDailyPublishes(env, istanbulDay);
  const deferredToday = await listDeferredForDay(env, istanbulDay, DAILY_CAP_REASON);
  const countToday = await countDailyPublishes(env, istanbulDay);
  const cursor = await getGrowthDailySyncCursor(env);

  return {
    istanbulDay,
    cap,
    countToday,
    slotsRemaining: Math.max(0, cap - countToday),
    publishedToday,
    deferredToday,
    reconcileCursor: cursor,
    indexNow: {
      host: env.INDEXNOW_HOST ?? "berktugberke.com",
      keyConfigured: Boolean(env.INDEXNOW_KEY?.trim()),
      publicKeyUrl: env.INDEXNOW_KEY
        ? `https://${env.INDEXNOW_HOST ?? "berktugberke.com"}/${env.INDEXNOW_KEY}.txt`
        : null,
      gdsPanelHint:
        "IndexNow key 8–128 hex (0-9a-f); host berktugberke.com; key file at https://{host}/{key}.txt contains {key}.",
    },
    gdsBillingNote:
      "Site cap is D1 growthdaily_daily_publish for istanbulDay; GDS billing counter is a separate product metric.",
    webhookUrl: "https://berktug-content-publisher.berktugates.workers.dev/webhooks/growthdaily",
  };
}
