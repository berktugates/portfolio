import type { Locale } from "../i18n";
import type { ChatMessage } from "./knowledge";
import { buildSystemPrompt, getAssistantApiUrl, localAssistantReply } from "./knowledge";

export async function sendAssistantMessage(
  locale: Locale,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const apiUrl = getAssistantApiUrl();

  if (!apiUrl) {
    return localAssistantReply(locale, userMessage);
  }

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locale,
      messages: history.concat({ role: "user", content: userMessage }),
      system: buildSystemPrompt(locale),
    }),
  });

  if (!res.ok) {
    return localAssistantReply(locale, userMessage);
  }

  const data = (await res.json()) as { reply?: string };
  const reply = data.reply?.trim();
  if (!reply) {
    return localAssistantReply(locale, userMessage);
  }
  return reply;
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
