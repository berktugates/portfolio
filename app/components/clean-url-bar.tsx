"use client";

import { useEffect } from "react";

/** Drop legacy section hashes (#blog, etc.) so shared URLs stay path-only. */
export function CleanUrlBar() {
  useEffect(() => {
    if (!window.location.hash) return;
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", `${pathname}${search}`);
  }, []);

  return null;
}
