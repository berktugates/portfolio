"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "../lib/i18n";
import { SiteAssistantDock } from "./site-assistant";
import { SiteAssistantSidebar } from "./site-assistant-sidebar";
import { usesFabAssistant } from "./site-assistant/assistant-routes";
import { isHaberlerHost } from "../lib/gundem/hosts";
import { stripLocalePrefix } from "../lib/content/paths";

function isHaberlerSurface(pathname: string, hostname: string): boolean {
  if (hostname && isHaberlerHost(hostname)) return true;
  const normalized = stripLocalePrefix(pathname.replace(/\/$/, "") || "/");
  return normalized === "/gundem" || normalized.startsWith("/gundem/");
}

function localeFromPathname(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && isLocale(segment) && segment !== DEFAULT_LOCALE) {
    return segment;
  }
  return DEFAULT_LOCALE;
}

export function SiteAssistantRoot() {
  const pathname = usePathname() ?? "";
  const locale = localeFromPathname(pathname || "/");
  const [hostname, setHostname] = useState("");
  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);
  if (isHaberlerSurface(pathname, hostname)) {
    return null;
  }

  const fabSurface = usesFabAssistant(pathname, hostname || undefined);

  if (fabSurface) {
    return <SiteAssistantSidebar key={pathname} locale={locale} />;
  }

  return <SiteAssistantDock key={pathname} locale={locale} />;
}
