"use client";

import { useEffect } from "react";

export function GundemViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `gundem-view-${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void fetch("/api/gundem/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
