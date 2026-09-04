import type { Locale } from "../i18n";

const ABUSE_RE =
  /\b(sex|seks|porn|xxx|nude|naked|fuck|shit|bitch|amk|aq|orospu|siktir|piç|yarrak|mal\s*af|sikerim)\b|pomp+a{2,}/iu;

const POLITICS_RE =
  /\b(seçim|parti|akp|chp|erdogan|erdoğan|trump|biden|siyaset|politic|election|war crime|genocide)\b/iu;

export function isBlockedUserMessage(text: string): boolean {
  const t = text.trim();
  if (t.length < 2) return true;
  if (/^(.)\1{4,}$/u.test(t.replace(/\s/g, ""))) return true;
  if (ABUSE_RE.test(t)) return true;
  if (POLITICS_RE.test(t)) return true;
  return false;
}

const REFUSAL: Record<Locale, string> = {
  tr: "Bu soru iş birliği, hizmetler veya teknik yetkinlik kapsamının dışında görünüyor. Proje, işe alım veya uzmanlıkla ilgili net bir soru yazarsanız yardımcı olunabilir.",
  en: "That question seems outside collaboration, services, or technical scope. Ask something clear about hiring, a project, or expertise and we can help.",
  de: "Diese Frage liegt außerhalb von Zusammenarbeit, Services oder technischer Expertise. Stellen Sie eine konkrete Frage zu Hiring, Projekt oder Fähigkeiten.",
  fr: "Cette question semble hors collaboration, services ou expertise technique. Posez une question claire sur l’embauche, un projet ou le savoir-faire.",
  it: "Questa domanda è fuori da collaborazione, servizi o competenze tecniche. Scrivi una domanda chiara su hiring, progetto o expertise.",
  zh: "该问题超出合作、服务或技术能力范围。请提出与招聘、项目或专业领域相关的具体问题。",
  ja: "ご質問は協業・サービス・技術的な範囲外のようです。採用、プロジェクト、専門性に関する具体的な質問をどうぞ。",
};

export function getRefusalReply(locale: Locale): string {
  return REFUSAL[locale] ?? REFUSAL.en;
}

export function sanitizeAssistantReply(reply: string, userMessage: string): string {
  let out = reply.trim();
  const user = userMessage.trim();
  if (user.length > 8) {
    const escaped = user.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`^${escaped}\\s*`, "iu"), "");
  }
  out = out.replace(/\bstaff engineer\b/gi, "senior engineer");
  out = out.replace(/\bstaff\b/gi, "senior");
  out = out.replace(/(?<![\[(])(https?:\/\/[^\s)\]]+)/g, (_, url: string) => {
    try {
      const u = new URL(url);
      const label = u.pathname.split("/").filter(Boolean).slice(-1)[0] || "link";
      return `[${label}](${url})`;
    } catch {
      return url;
    }
  });
  return out.trim();
}
