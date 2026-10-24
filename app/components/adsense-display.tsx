"use client";

import { useEffect, useRef } from "react";
import { adsenseClientId, adsenseDisplaySlot } from "../lib/adsense";

type AdsenseDisplayProps = {
  slotKind: "haberler" | "blog" | "home";
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Responsive display unit; slot env yoksa yalnız Auto Ads script yüklenir (boş kutu yok). */
export function AdsenseDisplay({ slotKind, className = "" }: AdsenseDisplayProps) {
  const pushed = useRef(false);
  const client = adsenseClientId();
  const slot = adsenseDisplaySlot(slotKind);

  useEffect(() => {
    if (!client || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* Ad blocker / consent */
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <div className={`my-6 flex min-h-[90px] w-full justify-center ${className}`.trim()}>
      <ins
        className="adsbygoogle block w-full max-w-3xl"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
