import type { Locale } from "../i18n";
import type { ChatMessage } from "./knowledge";
import { buildSystemPrompt, getAssistantApiUrl, localAssistantReply } from "./knowledge";
import {
  guardAssistantRequest,
  guardMessageForLocale,
  recordAssistantRequestSent,
} from "./guards";
import { getRefusalReply, isBlockedUserMessage, sanitizeAssistantReply } from "./moderation";

export async function sendAssistantMessage(
  locale: Locale,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const trimmed = userMessage.trim();

  if (isBlockedUserMessage(trimmed)) {
    return getRefusalReply(locale);
  }

  const guard = guardAssistantRequest(trimmed, history.length);
  if (!guard.ok) {
    return guardMessageForLocale(locale, guard.code);
  }

  const apiUrl = getAssistantApiUrl();

  if (!apiUrl) {
    return sanitizeAssistantReply(localAssistantReply(locale, trimmed), trimmed);
  }

  recordAssistantRequestSent();

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locale,
      messages: history.concat({ role: "user", content: trimmed }),
      system: buildSystemPrompt(locale, trimmed),
    }),
  });

  if (res.status === 429) {
    return guardMessageForLocale(locale, "rate");
  }

  if (!res.ok) {
    return sanitizeAssistantReply(localAssistantReply(locale, trimmed), trimmed);
  }

  const data = (await res.json()) as { reply?: string; refused?: boolean };
  if (data.refused) {
    return getRefusalReply(locale);
  }
  const reply = data.reply?.trim();
  if (!reply) {
    return sanitizeAssistantReply(localAssistantReply(locale, trimmed), trimmed);
  }
  return sanitizeAssistantReply(reply, trimmed);
}

export function trackAssistantEvent(
  event: "open" | "send" | "suggestion",
  detail?: Record<string, string>,
) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "site_assistant",
    assistant_action: event,
    ...detail,
  });
}
