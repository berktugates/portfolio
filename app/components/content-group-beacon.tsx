"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { contentGroupForPath } from "../lib/content-group";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function ContentGroupBeacon() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const content_group = contentGroupForPath(pathname, window.location.hostname);
    const segment = pathname.split("/").filter(Boolean)[0];
    const page_locale = segment?.length === 2 ? segment : "en";
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: "page_context",
      content_group,
      page_locale,
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}
