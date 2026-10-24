export {
  HABERLER_LANES,
  HABERLER_LANE_LABELS,
  LEGACY_CATEGORY_TO_LANE,
  briefingMatchesLane,
  categoryToLane,
  isHaberlerLane,
  type HaberlerLane,
} from "@berktug/editorial-gates/gundem/haberler-lanes";

import { HABERLER_LANE_LABELS, type HaberlerLane } from "@berktug/editorial-gates/gundem/haberler-lanes";

export const HABERLER_NAV_LANES: readonly HaberlerLane[] = [
  "gundem",
  "ekonomi",
  "spor",
  "teknoloji",
  "saglik",
  "kultur",
] as const;

export function formatHaberlerLane(lane: HaberlerLane): string {
  return HABERLER_LANE_LABELS[lane];
}

export function haberlerLanePath(lane: HaberlerLane): string {
  return `/kategori/${lane}`;
}
