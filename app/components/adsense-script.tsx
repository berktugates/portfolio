import Script from "next/script";
import { adsenseClientId, adsenseEnabled } from "../lib/adsense";

export function AdsenseScript() {
  const client = adsenseClientId();
  if (!adsenseEnabled() || !client) return null;

  return (
    <Script
      id="adsense-js"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
