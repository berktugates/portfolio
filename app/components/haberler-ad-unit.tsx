"use client";

import { useEffect, useRef } from "react";
import {
  haberlerAdFormat,
  haberlerAdSlot,
  haberlerAdsenseClientId,
  haberlerAdsenseEnabled,
  type HaberlerAdPlacement,
} from "../lib/gundem/adsense";

type Props = {
  placement: HaberlerAdPlacement;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function HaberlerAdUnit({ placement, className = "" }: Props) {
  const pushed = useRef(false);
  const client = haberlerAdsenseClientId();
  const slot = haberlerAdSlot(placement);
  const format = haberlerAdFormat(placement);

  useEffect(() => {
    if (!haberlerAdsenseEnabled() || !client || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* Ad block / script not ready */
    }
  }, [client]);

  if (!haberlerAdsenseEnabled() || !client) return null;

  const isVertical = placement === "left-rail" || placement === "right-rail";

  return (
    <div
      className={`haberler-ad haberler-ad--${placement} ${className}`.trim()}
      aria-label="Reklam"
    >
      <ins
        className="adsbygoogle block"
        style={{
          display: "block",
          minHeight: isVertical ? 600 : 90,
          width: isVertical ? "100%" : "100%",
          maxWidth: "100%",
        }}
        data-ad-client={client}
        {...(slot ? { "data-ad-slot": slot } : {})}
        data-ad-format={format}
        data-full-width-responsive={isVertical ? "false" : "true"}
      />
    </div>
  );
}
