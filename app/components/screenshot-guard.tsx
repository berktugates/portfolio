"use client";

import { useEffect } from "react";

const SHIELD_ID = "screenshot-shield";

/** OS seviyesinde ekran görüntüsünü web tam engelleyemez; PrintScreen / yazdırma / odak kaybında senkron siyah katman. */
function ensureShieldElement(): HTMLDivElement {
  let el = document.getElementById(SHIELD_ID) as HTMLDivElement | null;
  if (el) return el;
  el = document.createElement("div");
  el.id = SHIELD_ID;
  el.setAttribute("aria-hidden", "true");
  Object.assign(el.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483647",
    background: "#000",
    display: "none",
    pointerEvents: "none",
  });
  document.body.appendChild(el);
  return el;
}

function showShield(el: HTMLDivElement, autoHideMs?: number) {
  el.style.display = "block";
  if (autoHideMs != null && autoHideMs > 0) {
    window.clearTimeout(Number(el.dataset.hideTimer ?? 0));
    const t = window.setTimeout(() => {
      if (!document.hidden) el.style.display = "none";
    }, autoHideMs);
    el.dataset.hideTimer = String(t);
  }
}

function hideShield(el: HTMLDivElement) {
  window.clearTimeout(Number(el.dataset.hideTimer ?? 0));
  el.style.display = "none";
}

function isScreenshotKey(e: KeyboardEvent): boolean {
  if (e.key === "PrintScreen" || e.code === "PrintScreen") return true;
  if (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) return true;
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") return true;
  if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "s") return true;
  return false;
}

export function ScreenshotGuard() {
  useEffect(() => {
    const el = ensureShieldElement();

    const onKey = (e: KeyboardEvent) => {
      if (!isScreenshotKey(e)) return;
      e.preventDefault();
      showShield(el, 8000);
    };

    const onBeforePrint = () => {
      showShield(el);
    };

    const onAfterPrint = () => {
      hideShield(el);
    };

    const onVisibility = () => {
      if (document.hidden) showShield(el);
      else hideShield(el);
    };

    const onBlur = () => {
      showShield(el, 2500);
    };

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("keyup", onKey, true);
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("keyup", onKey, true);
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      el.remove();
    };
  }, []);

  return null;
}
