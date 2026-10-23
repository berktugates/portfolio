import type { GrowthDailyPost } from "./types";
import { isGdsApprovedForSitePublish } from "./gds-approval";
import {
  countDailyPublishes,
  hasDailyPublishRow,
  releaseDailyPublishSlot,
  reserveDailyPublishSlot,
} from "./d1-sync";

export const DEFAULT_DAILY_PUBLISH_CAP = 1;
const MAX_DAILY_PUBLISH_CAP = 50;
export const DAILY_CAP_REASON = "daily-publish-cap";
export const ISTANBUL_TZ = "Europe/Istanbul";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: ISTANBUL_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** `YYYY-MM-DD` in Europe/Istanbul. */
export function istanbulCalendarDay(at: Date = new Date()): string {
  return dayFormatter.format(at);
}

/** Missing/invalid => 1 (trial). "0" disables site publishing. */
export function parseDailyPublishCap(raw: string | undefined | null): number {
  if (raw === undefined || raw === null || raw.trim() === "") return DEFAULT_DAILY_PUBLISH_CAP;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) return DEFAULT_DAILY_PUBLISH_CAP;
  return Math.min(n, MAX_DAILY_PUBLISH_CAP);
}

const QUALITY_RANK: Record<string, number> = { premium: 3, standard: 2, review: 1 };

export function qualityRank(band: string | null | undefined): number {
  return QUALITY_RANK[(band ?? "").toLowerCase()] ?? 0;
}

function ts(iso: string | null | undefined): number {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(t) ? 0 : t;
}

type RankablePost = Pick<GrowthDailyPost, "slug" | "qualityBand" | "updatedAt" | "publishedAt"> &
  Partial<Pick<GrowthDailyPost, "status" | "reviewStatus">>;

/** premium > standard > review; tie => newest updatedAt; then slug for determinism. */
export function compareDailyCandidates(a: RankablePost, b: RankablePost): number {
  const q = qualityRank(b.qualityBand) - qualityRank(a.qualityBand);
  if (q !== 0) return q;
  const t = ts(b.updatedAt ?? b.publishedAt) - ts(a.updatedAt ?? a.publishedAt);
  if (t !== 0) return t;
  return a.slug.localeCompare(b.slug);
}

/** Best candidate first. GDS-approved posts always precede unapproved ones. */
export function rankDailyCandidates<T extends RankablePost>(
  posts: readonly T[],
  opts?: { publishDrafts?: boolean },
): T[] {
  const approved = (p: T) =>
    p.status === undefined && p.reviewStatus === undefined
      ? true
      : isGdsApprovedForSitePublish(
          { status: p.status ?? "draft", reviewStatus: p.reviewStatus ?? null },
          opts,
        );
  return [...posts].sort((a, b) => {
    const aa = approved(a) ? 1 : 0;
    const ba = approved(b) ? 1 : 0;
    if (aa !== ba) return ba - aa;
    return compareDailyCandidates(a, b);
  });
}

/** Top-N for the remaining slots of the day. */
export function selectDailyBatch<T extends RankablePost>(
  posts: readonly T[],
  remainingSlots: number,
  opts?: { publishDrafts?: boolean },
): T[] {
  if (remainingSlots <= 0) return [];
  return rankDailyCandidates(posts, opts).slice(0, remainingSlots);
}

/**
 * Read-only pre-check (before any sanitize/gate work).
 * Updates of already published posts and posts already counted today are exempt.
 */
export async function isDailyCapReached(
  env: Env,
  input: { postId: string; isUpdate: boolean; now?: Date },
): Promise<boolean> {
  if (input.isUpdate) return false;
  const day = istanbulCalendarDay(input.now);
  if (await hasDailyPublishRow(env, day, input.postId)) return false;
  const cap = parseDailyPublishCap(env.GROWTHDAILY_DAILY_PUBLISH_CAP);
  return (await countDailyPublishes(env, day)) >= cap;
}

export type DailySlot = { istanbulDay: string; postId: string; counted: boolean };

/**
 * Atomic claim right before the R2 write. Returns null when the cap is reached.
 * Updates / already-counted posts return a non-counted slot (nothing to release).
 */
export async function reserveDailySlot(
  env: Env,
  input: { postId: string; slug: string; qualityBand: string | null; isUpdate: boolean; now?: Date },
): Promise<DailySlot | null> {
  const now = input.now ?? new Date();
  const istanbulDay = istanbulCalendarDay(now);
  if (input.isUpdate || (await hasDailyPublishRow(env, istanbulDay, input.postId))) {
    return { istanbulDay, postId: input.postId, counted: false };
  }
  const ok = await reserveDailyPublishSlot(env, {
    istanbulDay,
    postId: input.postId,
    slug: input.slug,
    qualityBand: input.qualityBand,
    at: now.toISOString(),
    cap: parseDailyPublishCap(env.GROWTHDAILY_DAILY_PUBLISH_CAP),
  });
  return ok ? { istanbulDay, postId: input.postId, counted: true } : null;
}

export async function releaseDailySlot(env: Env, slot: DailySlot): Promise<void> {
  if (!slot.counted) return;
  await releaseDailyPublishSlot(env, slot.istanbulDay, slot.postId);
}
