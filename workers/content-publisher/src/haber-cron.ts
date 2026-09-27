import {
  composeBriefingFromTrend,
  scoreTrendItem,
  type DemandSignal,
} from "@berktug/editorial-gates/gundem/compose";
import { fetchTurkeyTrends } from "@berktug/editorial-gates/gundem/trends";
import { runGundemPublishGates } from "@berktug/editorial-gates/publish/gates";
import type { GundemBriefing } from "@berktug/editorial-gates/gundem/types";
import { recordTrendPublish, trendAlreadyPublished } from "./d1";
import { mergeGundemIndex, putJson } from "./r2";
import { revalidateOrQueue } from "./revalidate";
import { submitIndexNow } from "./indexnow";

async function loadDemandSignals(bucket: R2Bucket): Promise<DemandSignal[]> {
  const obj = await bucket.get("meta/gundem-demand-signals.json");
  if (!obj) return [];
  try {
    const data = (await obj.json()) as { queries?: DemandSignal[] };
    return data.queries ?? [];
  } catch {
    return [];
  }
}

async function loadGundemIndex(bucket: R2Bucket): Promise<GundemBriefing[]> {
  const obj = await bucket.get("gundem/index.json");
  if (!obj) return [];
  try {
    const data = (await obj.json()) as { posts?: GundemBriefing[] };
    return data.posts ?? [];
  } catch {
    return [];
  }
}

function indexHasTrendQuery(posts: GundemBriefing[], trendQuery: string): boolean {
  const n = trendQuery.toLocaleLowerCase("tr").trim();
  return posts.some((p) => p.trendQuery?.toLocaleLowerCase("tr").trim() === n);
}

function indexHasSlug(posts: GundemBriefing[], slug: string): boolean {
  return posts.some((p) => p.slug === slug);
}

export async function runHaberCron(env: Env): Promise<{ published: boolean; reason?: string }> {
  const today = new Date().toISOString().slice(0, 10);
  let trends;
  try {
    trends = await fetchTurkeyTrends();
  } catch (e) {
    console.log("haber-cron: trends-fetch-failed", e instanceof Error ? e.message : e);
    return { published: false, reason: "trends-fetch-failed" };
  }

  const [demand, indexPosts] = await Promise.all([
    loadDemandSignals(env.CONTENT_BUCKET),
    loadGundemIndex(env.CONTENT_BUCKET),
  ]);

  const ranked = trends
    .map((t) => ({ trend: t, score: scoreTrendItem(t, demand) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    console.log("haber-cron: no-eligible-trends");
    return { published: false, reason: "no-eligible-trends" };
  }

  for (const { trend } of ranked) {
    const draft = composeBriefingFromTrend(trend, today);
    if (!draft) {
      console.log(`haber-cron: no-copy trend=${trend.query}`);
      continue;
    }
    if (
      indexHasTrendQuery(indexPosts, draft.trendQuery) ||
      indexHasSlug(indexPosts, draft.slug) ||
      (await trendAlreadyPublished(env, draft.trendQuery))
    ) {
      console.log(`haber-cron: skip-dedup ${draft.trendQuery}`);
      continue;
    }

    const gated = await runGundemPublishGates(draft);
    if (!gated.ok) {
      console.log(`haber-cron: gate-fail ${gated.code} ${gated.detail ?? ""}`);
      continue;
    }

    const briefing = gated.briefing;
    await putJson(env.CONTENT_BUCKET, `gundem/${briefing.slug}.json`, briefing);
    await mergeGundemIndex(env.CONTENT_BUCKET, briefing);
    await recordTrendPublish(env, briefing.trendQuery, briefing.slug, today);

    const paths = [
      "/gundem",
      "/sitemap-gundem.xml",
      "/gundem/rss.xml",
      `/gundem/${briefing.slug}`,
    ];
    await revalidateOrQueue(env, paths, ["gundem"]);

    const host = env.HABERLER_HOST ?? "haberler.berktugberke.com";
    await submitIndexNow(env, [`https://${host}/`, `https://${host}/${briefing.slug}`]);

    console.log(`haber-cron: published slug=${briefing.slug}`);
    return { published: true };
  }

  console.log("haber-cron: all-ranked-skipped");
  return { published: false, reason: "all-ranked-skipped" };
}
