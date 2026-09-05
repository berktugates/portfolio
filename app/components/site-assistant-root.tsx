"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "../lib/i18n";
import { SiteAssistantDock } from "./site-assistant";
import { SiteAssistantSidebar } from "./site-assistant-sidebar";
import { usesFabAssistant } from "./site-assistant/assistant-routes";

function localeFromPathname(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && isLocale(segment) && segment !== DEFAULT_LOCALE) {
    return segment;
  }
  return DEFAULT_LOCALE;
}

export function SiteAssistantRoot() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname ?? "/");
  const fabSurface = usesFabAssistant(pathname ?? "/");

  if (fabSurface) {
    return <SiteAssistantSidebar locale={locale} />;
  }

  return <SiteAssistantDock locale={locale} />;
}
