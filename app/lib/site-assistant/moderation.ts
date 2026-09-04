import type { Locale } from "../i18n";

const ABUSE_RE =
  /\b(sex|seks|porn|xxx|nude|naked|fuck|shit|bitch|amk|aq|orospu|siktir|piç|yarrak|mal\s*af|sikerim)\b|pomp+a{2,}/iu;

const POLITICS_RE =
  /\b(seçim|parti|akp|chp|erdogan|erdoğan|trump|biden|siyaset|politic|election|war crime|genocide)\b/iu;

export function usesCuratedSearchReply(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (/(?:^|\s|\()geo\b|yapay zek[âa]|üretken arama|llms\.txt/.test(t)) return true;
  if (/seo[\s\-–/]*geo|geo[\s\-–/]*seo|seo ve geo/.test(t)) return true;
  if (/\bseo\b/.test(t) && /\bgeo\b/.test(t)) return true;
  if (/geo.*nedir|yapay zek[âa].*nedir|yapay zek[âa] arama.*nedir/.test(t)) return true;
  if (/\bseo\b/.test(t) && /hizmet|servis|veriyor|sunuyor|destek|offer|provide|help/.test(t)) return true;
  return false;
}

export function isGeoTopicMessage(text: string): boolean {
  return usesCuratedSearchReply(text);
}

/** @deprecated use isGeoTopicMessage */
export function isGeoDefinitionQuestion(text: string): boolean {
  return isGeoTopicMessage(text) && /nedir|ne demek|what is|was ist|qu['']est|とは|是什么/.test(text.toLowerCase());
}

export function isMisleadingGeoReply(reply: string, userMessage: string): boolean {
  if (!isGeoTopicMessage(userMessage)) return false;
  const r = reply.toLowerCase();
  const bad =
    /google öneri|google suggestion|google öznellik|öznellik ve bağlam|autocomplete|otomatik tamaml|arama motorunun|arama motoru taraf|index ed|indeks|sıralan|sıralama|serp|web uygulamasının.*arama|kullanıcılara arama sonuçlarından önce|aramanan kelime/.test(
      r,
    );
  const good = /llms|perplexity|chatgpt|yapay zek|üretken|alıntı|schema|yapılandırılmış|generative/.test(r);
  if (bad) return true;
  return !good;
}

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

export function sanitizeAssistantReply(reply: string, userMessage: string, locale?: Locale): string {
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

  if (locale === "tr") {
    out = out
      .replace(/\bexpertise['’]?(imize|imiz|e|i|miz|mız)?\b/giu, "uzmanlığımız")
      .replace(/\bexpertise\b/giu, "uzmanlık")
      .replace(/\bengagement\b/giu, "iş birliği")
      .replace(/\bdelivery\b/giu, "teslim")
      .replace(/\bvisibility\b/giu, "görünürlük")
      .replace(/\bremote\b/giu, "uzaktan")
      .replace(/\bhiring\b/giu, "işe alım")
      .replace(/\bpipeline\b/giu, "süreç")
      .replace(/\bstack\b/giu, "teknoloji yığını")
      .replace(/\bfreelance\b/giu, "serbest")
      .replace(/\bfull-time\b/giu, "tam zamanlı")
      .replace(/\bpart-time\b/giu, "yarı zamanlı");
  }

  out = ensureCompleteSentences(out);
  out = limitSentences(out, 3);
  return out.trim();
}

function limitSentences(text: string, maxSentences: number): string {
  const matches = text.match(/[^.!?…]+[.!?…]+["')\]]*/g);
  if (!matches || matches.length <= maxSentences) return text;
  return matches.slice(0, maxSentences).join("").trim();
}

function ensureCompleteSentences(text: string): string {
  const t = text.trim();
  if (!t) return t;
  if (/[.!?…][)"\]'`]*\s*$/.test(t)) return t;
  const cut = Math.max(t.lastIndexOf("."), t.lastIndexOf("!"), t.lastIndexOf("?"), t.lastIndexOf("…"));
  if (cut > 40) return t.slice(0, cut + 1).trim();
  return t;
}
