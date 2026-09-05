import type { Locale } from "../i18n";

function normUserText(text: string): string {
  return text.trim().toLocaleLowerCase("tr");
}

const ABUSE_RE =
  /\b(sex|seks|porn|xxx|nude|naked|fuck|shit|bitch|amk|aq|orospu|siktir|piç|yarrak|mal\s*af|sikerim)\b|pomp+a{2,}/iu;

const POLITICS_RE =
  /\b(seçim|parti|akp|chp|erdogan|erdoğan|trump|biden|siyaset|politic|election|war crime|genocide)\b/iu;

export function usesCuratedSearchReply(text: string): boolean {
  const t = normUserText(text);
  if (/(?:^|\s|\()geo\b|yapay zek[âa]|üretken arama|llms\.txt/.test(t)) return true;
  if (/seo[\s\-–/]*geo|geo[\s\-–/]*seo|seo ve geo/.test(t)) return true;
  if (/\bseo\b/.test(t) && /\bgeo\b/.test(t)) return true;
  if (/geo.*nedir|yapay zek[âa].*nedir|yapay zek[âa] arama.*nedir/.test(t)) return true;
  if (/\bseo\b/.test(t) && /hizmet|servis|veriyor|sunuyor|destek|offer|provide|help/.test(t)) return true;
  return false;
}

export function usesCuratedHireReply(text: string): boolean {
  const t = normUserText(text);
  const wantsWebOrMobile = /web|mobile|mobil|ios|android|app|uygulama|frontend|backend/.test(t);
  const wantsHire =
    /hire|freelance|full.?time|part.?time|işe al|işe alabilir|çalış|projeye|engag|embauch|nas[ıi]l.*(al|hire)|how.*(hire|work)|wie.*einstell/.test(
      t,
    ) ||
    (/nasıl başl|how do we start|how.*start|get started/.test(t) && wantsWebOrMobile);
  if (wantsHire && wantsWebOrMobile) return true;
  if (wantsHire && /hizmet|servis|service|remote|uzak|yurt|abroad|international/.test(t)) return true;
  return false;
}

export function usesCuratedProjectReply(text: string): boolean {
  const t = normUserText(text);
  if (usesCuratedHireReply(text)) return false;
  return /hangi proje|which project|what project|what.*projects|ne.*proje|proje.*çalış|projelerin|projelerde|your projects|experience.*project|referans|portfolio/.test(
    t,
  );
}

export function usesCuratedStartReply(text: string): boolean {
  const t = normUserText(text);
  if (usesCuratedHireReply(text)) return false;
  return /nasıl başl|how do we start|how.*start|ilk adım|first step|nereden başl|where.*begin|get started|başlamak/.test(
    t,
  );
}

const PROJECT_NAME_RE =
  /Celestial\s+Insights|Medula\s+Eczane|StrumAI|Figtures|bradi\.tech/gi;

const FULL_NAME_RE =
  /Berktu[gğ]\s*Berke\s*Ate[sş]|Berktug\s*Berke\s*Ates|Berktu[gğ]'?[uü]n|Berktu[gğ]\s*Berke\s*Ate[sş]'?in/giu;

function stripUnwantedNames(text: string, userMessage: string): string {
  let out = text;
  const userNamedProject = PROJECT_NAME_RE.test(userMessage);
  PROJECT_NAME_RE.lastIndex = 0;

  if (!userNamedProject) {
    const hits = out.match(PROJECT_NAME_RE);
    if (hits && hits.length > 0) {
      out = out.replace(PROJECT_NAME_RE, "");
      out = out.replace(/\s*(?:örnek olarak|such as|like|e\.g\.|for example)\s*[,.]?\s*/gi, " ");
      out = out.replace(/:\s*,/g, ":").replace(/,\s*,/g, ",").replace(/\s{2,}/g, " ");
    }
  }

  out = out.replace(FULL_NAME_RE, "");
  out = out.replace(/\buzmanlığımız\b/giu, "uzmanlığım");
  out = out.replace(/\bdeneyimlerimiz\b/giu, "deneyimim");
  out = out.replace(/\s+,\s+/g, ", ");
  out = out.replace(/\.\s*\./g, ".");
  return out.trim();
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
  out = stripUnwantedNames(out, user);
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
