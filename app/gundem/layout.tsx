import type { ReactNode } from "react";
import { headers } from "next/headers";
import { HaberlerAdsenseScript } from "../components/haberler-adsense-script";
import { haberlerAdsenseEnabled } from "../lib/gundem/adsense";
import { isHaberlerHost } from "../lib/gundem/hosts";

/** AdSense yalnızca haberler host — berktugberke.com portföyde script yok. */
export default async function GundemLayout({ children }: { children: ReactNode }) {
  const host = (await headers()).get("host");
  const showAds = isHaberlerHost(host) && haberlerAdsenseEnabled();

  return (
    <>
      {showAds ? <HaberlerAdsenseScript /> : null}
      {children}
    </>
  );
}
