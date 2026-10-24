import type { HaberlerLane } from "./lanes";
import { HABERLER_NAV_LANES, haberlerLanePath } from "./lanes";

/** @deprecated Use HABERLER_NAV_LANES */
export const HABERLER_NAV_CATEGORIES = HABERLER_NAV_LANES;

export { HABERLER_NAV_LANES };

export function haberlerCategoryPath(lane: HaberlerLane): string {
  return haberlerLanePath(lane);
}
