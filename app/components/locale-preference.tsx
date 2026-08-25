"use client";

import { useEffect } from "react";
import { PREFERRED_LOCALE_KEY, type Locale } from "../lib/i18n";

/** Persist explicit locale visits so `/` can honor the user's choice. */
export function LocalePreference({ locale }: { locale: Locale }) {
  useEffect(() => {
    try {
      localStorage.setItem(PREFERRED_LOCALE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  return null;
}
