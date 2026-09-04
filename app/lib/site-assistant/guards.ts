import type { Locale } from "../i18n";

const STORAGE_DAY = "site_assistant_day";
const STORAGE_DAILY_COUNT = "site_assistant_daily_count";
const STORAGE_LAST_SEND = "site_assistant_last_send_ms";

export const ASSISTANT_GUARDS = {
  maxMessageChars: 1200,
  minIntervalMs: 2500,
  maxDailyClientRequests: 40,
  maxMessageHistory: 24,
} as const;

export type AssistantGuardResult = { ok: true } | { ok: false; code: "rate" | "length" | "history" };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readDailyCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const day = sessionStorage.getItem(STORAGE_DAY) ?? localStorage.getItem(STORAGE_DAY);
    if (day !== todayKey()) return 0;
    const raw = sessionStorage.getItem(STORAGE_DAILY_COUNT) ?? localStorage.getItem(STORAGE_DAILY_COUNT);
    return raw ? Number.parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function bumpDailyCount() {
  if (typeof window === "undefined") return;
  try {
    const key = todayKey();
    const next = readDailyCount() + 1;
    sessionStorage.setItem(STORAGE_DAY, key);
    sessionStorage.setItem(STORAGE_DAILY_COUNT, String(next));
    localStorage.setItem(STORAGE_DAY, key);
    localStorage.setItem(STORAGE_DAILY_COUNT, String(next));
  } catch {
    /* ignore private mode */
  }
}

export function guardAssistantRequest(
  userMessage: string,
  historyLength: number,
): AssistantGuardResult {
  const trimmed = userMessage.trim();
  if (trimmed.length > ASSISTANT_GUARDS.maxMessageChars) {
    return { ok: false, code: "length" };
  }
  if (historyLength > ASSISTANT_GUARDS.maxMessageHistory) {
    return { ok: false, code: "history" };
  }

  if (typeof window !== "undefined") {
    const last = Number.parseInt(sessionStorage.getItem(STORAGE_LAST_SEND) ?? "0", 10) || 0;
    if (Date.now() - last < ASSISTANT_GUARDS.minIntervalMs) {
      return { ok: false, code: "rate" };
    }
    if (readDailyCount() >= ASSISTANT_GUARDS.maxDailyClientRequests) {
      return { ok: false, code: "rate" };
    }
  }

  return { ok: true };
}

export function recordAssistantRequestSent() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_LAST_SEND, String(Date.now()));
    bumpDailyCount();
  } catch {
    /* ignore */
  }
}

export function guardMessageForLocale(locale: Locale, code: Exclude<AssistantGuardResult, { ok: true }>["code"]): string {
  const tr = locale === "tr";
  if (code === "length") {
    return tr
      ? "Mesaj çok uzun. Lütfen daha kısa bir soru yazın."
      : "Your message is too long. Please ask a shorter question.";
  }
  if (code === "history") {
    return tr
      ? "Sohbet sınırına ulaşıldı. Lütfen sohbeti kapatıp yeniden başlayın."
      : "This chat reached its length limit. Close the chat and start again.";
  }
  return tr
    ? "Kısa bir süre için istek sınırına ulaşıldı. Biraz bekleyip tekrar deneyin veya doğrudan iletişime geçin."
    : "Request limit reached for now. Wait a moment, try again, or email contact@berktugberke.com.";
}
