import type { ReactNode } from "react";
import { HABERLER_CONTAINER_CLASS } from "../lib/gundem/haberler-container";
import type { HaberlerLane } from "../lib/gundem/lanes";
import { HaberlerAdsenseScript } from "./haberler-adsense-script";
import { HaberlerNav } from "./haberler-nav";

type HaberlerShellProps = {
  activeLane?: HaberlerLane | null;
  enableAds?: boolean;
  children: ReactNode;
};

export function HaberlerShell({ activeLane = null, enableAds = false, children }: HaberlerShellProps) {
  return (
    <div lang="tr" className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950">
      {enableAds ? <HaberlerAdsenseScript /> : null}
      <HaberlerNav activeLane={activeLane} />
      <div className={`${HABERLER_CONTAINER_CLASS} flex-1 pb-16 pt-8`}>
        {children}
      </div>
    </div>
  );
}
