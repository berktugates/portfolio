"use client";

import { useLayoutEffect } from "react";
import { applyThemePreference, readThemePreference, writeThemePreference } from "../lib/theme";

const COOKIE_MIRROR_KEY = "theme-cookie-synced";

export function ThemeSync() {
  useLayoutEffect(() => {
    const pref = readThemePreference();
    applyThemePreference(pref);
    try {
      if (!sessionStorage.getItem(COOKIE_MIRROR_KEY)) {
        writeThemePreference(pref);
        sessionStorage.setItem(COOKIE_MIRROR_KEY, "1");
      }
    } catch {
      /* sessionStorage blocked */
    }

    const onSystemChange = () => {
      if (readThemePreference() === "system") applyThemePreference("system");
    };
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  return null;
}
