import type { TrMediaFeedItem } from "./feed-ingest";

export type FeedStoryCluster = {
  clusterId: string;
  items: TrMediaFeedItem[];
  distinctFeedIds: string[];
  independentPublisherGroupIds: string[];
  queryHint: string;
  latestPubDate?: string;
  conflicts: string[];
};

function normalizeToken(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP = new Set([
  "ve",
  "ile",
  "için",
  "bir",
  "bu",
  "da",
  "de",
  "mi",
  "mı",
  "mu",
  "mü",
  "son",
  "dakika",
  "flaş",
  "haber",
  "gündem",
  "türkiye",
  "turkiye",
]);

function significantTokens(title: string): string[] {
  return normalizeToken(title)
    .split(" ")
    .filter((t) => t.length >= 3 && !STOP.has(t));
}

function numbersIn(title: string): string[] {
  return [...title.matchAll(/\d+[,.]?\d*/g)].map((m) => m[0].replace(",", "."));
}

function dateMs(value?: string): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function withinEvidenceWindow(a?: string, b?: string, hours = 36): boolean {
  const ams = dateMs(a);
  const bms = dateMs(b);
  if (ams === null || bms === null) return true;
  return Math.abs(ams - bms) <= hours * 60 * 60 * 1000;
}

function jaccard(a: string[], b: string[]): number {
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

function similarityScore(titleA: string, titleB: string, tokensA: string[], tokensB: string[]): number {
  const sharedTokens = [...new Set(tokensA)].filter((token) => new Set(tokensB).has(token));
  let score = jaccard(tokensA, tokensB);
  const numsA = numbersIn(titleA);
  const numsB = numbersIn(titleB);
  const matchingNumber = numsA.length > 0 && numsB.length > 0 && numsA.some((n) => numsB.includes(n));
  const eventAnchor = sharedTokens.some((token) => ["dolar", "euro", "transfer", "deprem", "seçim", "maç"].includes(token));
  // A shared number is supporting evidence, never an event identity on its own.
  if (matchingNumber && (sharedTokens.length >= 2 || eventAnchor)) {
    score += 0.35;
  }
  const na = normalizeToken(titleA);
  const nb = normalizeToken(titleB);
  if (na.includes("dolar") && nb.includes("dolar")) score += 0.15;
  if (na.includes("transfer") && nb.includes("transfer")) score += 0.15;
  return score;
}

function materialNumberConflict(titleA: string, titleB: string): boolean {
  const a = numbersIn(titleA);
  const b = numbersIn(titleB);
  // If only one headline carries a number, we cannot prove it describes the
  // same event rather than a different development in the same broad story.
  if ((a.length === 0) !== (b.length === 0)) return true;
  if (a.length === 0) return false;
  return !a.some((number) => b.includes(number));
}

function contentSignature(title: string): string {
  return significantTokens(title).slice(0, 12).join(" ");
}

function independentPublisherGroups(items: readonly TrMediaFeedItem[]): string[] {
  const seenSignatures = new Set<string>();
  const groups: string[] = [];
  for (const item of items) {
    const signature = contentSignature(item.title);
    if (seenSignatures.has(signature)) continue;
    seenSignatures.add(signature);
    if (!groups.includes(item.publisherGroupId)) groups.push(item.publisherGroupId);
  }
  return groups;
}

function clusterIdFromTokens(tokens: string[]): string {
  const top = [...tokens].sort().slice(0, 6).join("-") || "gundem";
  return top.slice(0, 48);
}

/** Aynı olayı taşıyan RSS maddelerini kümele. */
export function clusterFeedItems(items: readonly TrMediaFeedItem[], evidenceWindowHours = 36): FeedStoryCluster[] {
  const clusters: { tokens: string[]; items: TrMediaFeedItem[] }[] = [];

  for (const item of items) {
    const tokens = significantTokens(item.title);
    if (tokens.length === 0) continue;

    let bestIdx = -1;
    let bestScore = 0;
    for (let i = 0; i < clusters.length; i++) {
      const rep = clusters[i].items[0]?.title ?? "";
      const repDate = clusters[i].items[0]?.pubDate;
      if (!withinEvidenceWindow(item.pubDate, repDate, evidenceWindowHours)) continue;
      if (materialNumberConflict(item.title, rep)) continue;
      const score = similarityScore(item.title, rep, tokens, clusters[i].tokens);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    if (bestScore >= 0.32 && bestIdx >= 0) {
      clusters[bestIdx].items.push(item);
      clusters[bestIdx].tokens = [
        ...new Set([...clusters[bestIdx].tokens, ...tokens]),
      ].slice(0, 24);
    } else {
      clusters.push({ tokens, items: [item] });
    }
  }

  return clusters
    .map((c) => {
      const feedIds = [...new Set(c.items.map((i) => i.feedId))];
      const publisherGroupIds = independentPublisherGroups(c.items);
      const queryHint = c.tokens.slice(0, 4).join(" ") || c.items[0].title.slice(0, 40);
      const dates = c.items.map((i) => i.pubDate).filter(Boolean) as string[];
      const conflicts: string[] = [];
      for (let i = 0; i < c.items.length; i++) {
        for (let j = i + 1; j < c.items.length; j++) {
          if (materialNumberConflict(c.items[i].title, c.items[j].title)) {
            conflicts.push(`number:${c.items[i].feedId}:${c.items[j].feedId}`);
          }
        }
      }
      return {
        clusterId: clusterIdFromTokens(c.tokens),
        items: c.items,
        distinctFeedIds: feedIds,
        independentPublisherGroupIds: publisherGroupIds,
        queryHint,
        latestPubDate: dates[0],
        conflicts,
      };
    })
    .sort((a, b) => b.distinctFeedIds.length - a.distinctFeedIds.length || b.items.length - a.items.length);
}

export function clusterMeetsSyndicationRules(
  cluster: FeedStoryCluster,
  minIndependentPublisherGroups: number,
): boolean {
  return cluster.conflicts.length === 0 &&
    cluster.independentPublisherGroupIds.length >= minIndependentPublisherGroups;
}
