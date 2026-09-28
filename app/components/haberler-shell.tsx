import type { ReactNode } from "react";
import type { GundemCategory } from "../lib/gundem/editorial";
import { haberlerAdsenseEnabled } from "../lib/gundem/adsense";
import { HABERLER_CONTAINER_CLASS } from "../lib/gundem/haberler-container";
import { HaberlerAdUnit } from "./haberler-ad-unit";
import { HaberlerNav } from "./haberler-nav";

type HaberlerShellProps = {
  activeCategory?: GundemCategory | null;
  children: ReactNode;
};

function SideRail({ side }: { side: "left" | "right" }) {
  const placement = side === "left" ? "left-rail" : "right-rail";
  return (
    <aside
      className="hidden min-w-[120px] max-w-[160px] lg:block xl:max-w-[180px]"
      aria-label={side === "left" ? "Sol reklam alanı" : "Sağ reklam alanı"}
    >
      <div className="sticky top-24 flex justify-center">
        <HaberlerAdUnit placement={placement} className="w-full max-w-[160px]" />
      </div>
    </aside>
  );
}

export function HaberlerShell({ activeCategory = null, children }: HaberlerShellProps) {
  const ads = haberlerAdsenseEnabled();

  return (
    <div lang="tr" className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <HaberlerNav activeCategory={activeCategory} />
      <div className={`${HABERLER_CONTAINER_CLASS} flex-1 pb-16 pt-8`}>
        {ads ? (
          <div className="mb-6 lg:hidden">
            <HaberlerAdUnit placement="mobile-banner" />
          </div>
        ) : null}
        <div
          className={
            ads
              ? "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,160px)_minmax(0,1fr)_minmax(0,160px)] lg:gap-8 xl:gap-10"
              : undefined
          }
        >
          {ads ? <SideRail side="left" /> : null}
          <div className="min-w-0 flex-1">{children}</div>
          {ads ? <SideRail side="right" /> : null}
        </div>
      </div>
    </div>
  );
}
