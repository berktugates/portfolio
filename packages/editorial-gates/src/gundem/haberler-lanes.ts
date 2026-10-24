import type { GundemCategory } from "./categories";

/** Haberler nav / günlük yayın şeritleri (6). */
export type HaberlerLane = "gundem" | "ekonomi" | "spor" | "teknoloji" | "saglik" | "kultur";

export const HABERLER_LANES: readonly HaberlerLane[] = [
  "gundem",
  "ekonomi",
  "spor",
  "teknoloji",
  "saglik",
  "kultur",
] as const;

export const HABERLER_LANE_LABELS: Record<HaberlerLane, string> = {
  gundem: "Gündem",
  ekonomi: "Ekonomi",
  spor: "Spor",
  teknoloji: "Teknoloji",
  saglik: "Sağlık",
  kultur: "Kültür",
};

const LANE_SET = new Set<string>(HABERLER_LANES);

export function isHaberlerLane(value: string): value is HaberlerLane {
  return LANE_SET.has(value);
}

/** Eski kategori URL'leri → yeni şerit (308). */
export const LEGACY_CATEGORY_TO_LANE: Record<string, HaberlerLane> = {
  siyaset: "gundem",
  toplum: "gundem",
  dunya: "gundem",
  diger: "gundem",
  bilisim: "teknoloji",
  bilim: "teknoloji",
};

export function categoryToLane(category: GundemCategory | undefined): HaberlerLane {
  switch (category) {
    case "ekonomi":
      return "ekonomi";
    case "spor":
      return "spor";
    case "saglik":
      return "saglik";
    case "kultur":
      return "kultur";
    case "bilisim":
    case "bilim":
      return "teknoloji";
    case "siyaset":
    case "toplum":
    case "dunya":
    case "diger":
    default:
      return "gundem";
  }
}

export function briefingMatchesLane(
  category: GundemCategory | undefined,
  lane: HaberlerLane,
): boolean {
  return categoryToLane(category) === lane;
}
