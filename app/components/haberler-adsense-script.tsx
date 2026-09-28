import Script from "next/script";
import { haberlerAdsenseClientId, haberlerAdsenseEnabled } from "../lib/gundem/adsense";

export function HaberlerAdsenseScript() {
  const client = haberlerAdsenseClientId();
  if (!haberlerAdsenseEnabled() || !client) return null;

  return (
    <Script
      id="haberler-adsense-js"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
