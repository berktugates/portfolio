import type { Locale } from "../i18n";

const ABUSE_RE =
  /\b(sex|seks|porn|xxx|nude|naked|fuck|shit|bitch|amk|aq|orospu|siktir|piç|yarrak|mal\s*af|sikerim)\b|pomp+a{2,}/iu;

const POLITICS_RE =
  /\b(seçim|parti|akp|chp|erdogan|erdoğan|trump|biden|siyaset|politic|election)\b/iu;

export function isBlockedUserMessage(text: string): boolean {
  const t = text.trim();
  if (t.length < 2) return true;
  if (/^(.)\1{4,}$/u.test(t.replace(/\s/g, ""))) return true;
  if (ABUSE_RE.test(t)) return true;
  if (POLITICS_RE.test(t)) return true;
  return false;
}

export function refusalReply(locale: string | undefined): string {
  const map: Record<string, string> = {
    tr: "Bu soru iş birliği, hizmetler veya teknik yetkinlik kapsamının dışında görünüyor. Proje, işe alım veya uzmanlıkla ilgili net bir soru yazın.",
    en: "That question is outside collaboration, services, or technical scope. Ask something clear about hiring, a project, or expertise.",
    de: "Diese Frage liegt außerhalb von Zusammenarbeit, Services oder technischer Expertise.",
    fr: "Cette question est hors collaboration, services ou expertise technique.",
    it: "Questa domanda è fuori da collaborazione, servizi o competenze tecniche.",
    zh: "该问题超出合作、服务或技术能力范围。",
    ja: "ご質問は協業・サービス・技術的な範囲外のようです。",
  };
  return map[locale ?? ""] ?? map.en;
}
