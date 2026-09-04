import type { Locale } from "../i18n";
import type { ChatMessage } from "./knowledge";
import { buildSystemPrompt, getAssistantApiUrl, localAssistantReply } from "./knowledge";
import {
  guardAssistantRequest,
  guardMessageForLocale,
  recordAssistantRequestSent,
} from "./guards";
import { getRefusalReply, isBlockedUserMessage, isGeoTopicMessage, isMisleadingGeoReply, sanitizeAssistantReply } from "./moderation";

function finalizeReply(locale: Locale, userMessage: string, reply: string): string {
  const trimmed = userMessage.trim();
  let out = sanitizeAssistantReply(reply, trimmed, locale);
  if (isMisleadingGeoReply(out, trimmed)) {
    out = sanitizeAssistantReply(localAssistantReply(locale, trimmed), trimmed, locale);
  }
  return out;
}

export async function sendAssistantMessage(
  locale: Locale,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const trimmed = userMessage.trim();

  if (isBlockedUserMessage(trimmed)) {
    return getRefusalReply(locale);
  }

  if (isGeoTopicMessage(trimmed)) {
    return finalizeReply(locale, trimmed, localAssistantReply(locale, trimmed));
  }

  const guard = guardAssistantRequest(trimmed, history.length);
  if (!guard.ok) {
    return guardMessageForLocale(locale, guard.code);
  }

  const apiUrl = getAssistantApiUrl();

  if (!apiUrl) {
    return finalizeReply(locale, trimmed, localAssistantReply(locale, trimmed));
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
    return finalizeReply(locale, trimmed, localAssistantReply(locale, trimmed));
  }

  const data = (await res.json()) as { reply?: string; refused?: boolean };
  if (data.refused) {
    return getRefusalReply(locale);
  }
  const reply = data.reply?.trim();
  if (!reply) {
    return finalizeReply(locale, trimmed, localAssistantReply(locale, trimmed));
  }
  return finalizeReply(locale, trimmed, reply);
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
