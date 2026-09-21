"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { stripLocalePrefix } from "../lib/content/paths";

function contentGroupForPath(pathname: string, hostname: string): string {
  if (hostname === "haberler.berktugberke.com" || hostname === "haberler.localhost") {
    return "gundem";
  }
  const normalized = stripLocalePrefix(pathname.replace(/\/$/, "") || "/");
  if (normalized === "/gundem" || normalized.startsWith("/gundem/")) return "gundem";
  if (normalized === "/blogs" || normalized.startsWith("/blogs/")) return "blog";
  if (normalized === "/hire" || normalized.startsWith("/hire/")) return "hire";
  if (normalized === "/projects" || normalized.startsWith("/projects/")) return "project";
  return "home";
}

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
