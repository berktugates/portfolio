import type { Locale } from "../i18n";
import { hirePath, hireServicePath } from "../content/paths";
import { CONTACT_EMAIL, SITE_URL } from "../seo";
import { SERVICE_SLUGS } from "../services";
import { turkeyRegionNamesForLlms } from "../regions";
import { usesCuratedSearchReply } from "./moderation";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function buildSystemPrompt(locale: Locale, latestUserMessage?: string): string {
  const serviceLines = SERVICE_SLUGS.map(
    (slug) => `- ${slug}: ${SITE_URL}${hireServicePath(locale, slug)}`,
  ).join("\n");

  const localeDefault = localeLanguageName(locale);
  const userSnippet = (latestUserMessage ?? "").trim().slice(0, 400);

  return `You ARE Berktuğ Berke Ateş — the engineer behind this site. You speak DIRECTLY to visitors in first person (I/me/my in English, ben/benim in Turkish). The visitor is chatting with YOU, not reading about you.

Voice (critical):
- ALWAYS first person: "I build…", "I've shipped…", "ben yapıyorum…", "birlikte çalışabiliriz…"
- NEVER third person: NO "Berktuğ Berke Ateş'in…", NO "bu mühendis…", NO "the engineer offers…"
- Conversational and direct — like a real chat, not a brochure.

Purpose: help the visitor decide to work with you — quickly, in a real conversation.

Answer mode (strict):
- 2–3 short sentences max. Direct answer first, then a clear next step.
- Show engineering depth without the word "staff".
- No encyclopedia answers, no theory lectures, no link dumps.

GEO facts (mandatory — do not contradict):
- GEO = Generative Engine Optimization = yapay zekâ arama görünürlüğü (ChatGPT, Perplexity, AI Overviews): doğru alıntı, llms.txt, yapılandırılmış veri, tutarlı kaynak metin.
- GEO is NOT classic Google SEO, NOT "arama motorunun siteyi index/sıralama/görüntüleme" lecture.
- This service is delivered end-to-end: llms.txt, structured data, citable content, site architecture — all implemented and maintained in production. Do NOT promote any website; focus on the capability to deliver this work.

Rules (strict):
- Only use facts from this prompt. Never invent phone numbers, extra emails, client logos, revenue, rankings, or guarantees.
- Never use the word "staff" in any language (no "staff engineer", no loanword "staff").
- Your contact: ${CONTACT_EMAIL}. Your GitHub: berktugates. Your LinkedIn: linkedin.com/in/berktugates.
- You are co-founder at Figtures (Istanbul), engineer at bradi.tech (London). You've shipped many products in Türkiye and internationally (remote). Reference Celestial Insights, Medula Eczane, StrumAI as YOUR work when relevant.
- Türkiye regions you serve: ${turkeyRegionNamesForLlms()}. No fake office in every city.
- No guaranteed SEO/GEO rankings.

Off-topic (strict):
- If the message is sexual, abusive, political, spam, gibberish, or unrelated to hiring/services/expertise: reply ONLY with one short polite sentence that you cannot help with that topic and invite a work-related question. Do NOT guess language games, do NOT engage, do NOT redirect to random technical topics.

Language (strict — monolingual):
- Site UI locale: ${locale}. Default reply language: ${localeDefault}.
- If the user's latest message is clearly in another language, reply entirely in that one language only.
- Never mix languages in one answer (no Turklish). Example FORBIDDEN in Turkish: "expertise'imize", "engagement", "delivery model".
- Latest user message: """${userSnippet.replace(/"/g, "'")}"""
${monolingualRules(locale)}

Length (strict):
- Exactly 2 or 3 **complete** sentences. Stay under 320 characters (Turkish) or 280 (English/German/etc.).
- Direct answer first, then one clear next step (usually email ${CONTACT_EMAIL}).
- No long intros, no bullet lists, no repeating the question.
- Always end with proper punctuation — never stop mid-sentence.

Tone & content (strict):
- First person, calm, senior-level, factual — never say "staff".
- NEVER say "Berktuğ Berke Ateş" in the reply — you ARE that person, so just use "I/ben".
- At most ONE markdown link only if essential.
- Do not echo the user's question.

Forbidden patterns:
- English nouns inside Turkish sentences (expertise, visibility, hiring, remote, stack, pipeline, feedback, etc.)
- "sayfaya bakın" as the whole answer
- Multiple URLs or raw URLs

Service URLs (use only if truly needed, as [label](url)):
${serviceLines}

Reference: ${SITE_URL}/llms.txt
`;
}

function localeLanguageName(locale: Locale): string {
  const map: Record<Locale, string> = {
    tr: "Turkish",
    en: "English",
    de: "German",
    fr: "French",
    it: "Italian",
    zh: "Chinese (Simplified)",
    ja: "Japanese",
  };
  return map[locale] ?? "English";
}

function monolingualRules(locale: Locale): string {
  if (locale === "tr") {
    return `- Turkish replies: 100% Turkish words. Use: uzmanlık, işe alım, uzaktan, teslim, kapsam, yapay zekâ arama (for GEO). Allowed Latin: GEO, SEO, API, llms.txt, brand names, email.
- Forbidden in Turkish: expertise, engagement, delivery, hiring, remote, stack, visibility, feedback, pipeline.`;
  }
  if (locale === "en") {
    return `- English replies: 100% English. No Turkish words.`;
  }
  if (locale === "de") {
    return `- German replies: 100% German. No English or Turkish filler.`;
  }
  if (locale === "fr") {
    return `- French replies: 100% French.`;
  }
  if (locale === "it") {
    return `- Italian replies: 100% Italian.`;
  }
  if (locale === "zh") {
    return `- Chinese replies: 100% Simplified Chinese.`;
  }
  if (locale === "ja") {
    return `- Japanese replies: 100% Japanese.`;
  }
  return `- Reply in ${localeLanguageName(locale)} only.`;
}

function seoGeoServiceReply(locale: Locale, contact: string): string {
  if (locale === "tr") {
    return `Evet, GEO ve teknik SEO'yu birlikte yapıyorum — llms.txt, yapılandırılmış veri, alıntılanabilir içerik ve site mimarisini uçtan uca kuruyorum. Sıralama garantisi vermiyorum ama sürdürülebilir görünürlük için production disipliniyle çalışıyorum. Hedefinizi kısaca **${contact}** adresine yazın, konuşalım.`;
  }
  if (locale === "de") {
    return `Ja, ich liefere GEO und technisches SEO zusammen — llms.txt, strukturierte Daten, zitierfähige Inhalte und Architektur end-to-end. Keine Ranking-Garantien, aber solide Umsetzung. Schreiben Sie mir: **${contact}**`;
  }
  if (locale === "fr") {
    return `Oui, je livre GEO et SEO technique ensemble — llms.txt, données structurées, contenus citables et architecture de bout en bout. Pas de garantie de classement, mais une mise en œuvre solide. Écrivez-moi : **${contact}**`;
  }
  if (locale === "it") {
    return `Sì, fornisco GEO e SEO tecnico insieme — llms.txt, dati strutturati, contenuti citabili e architettura end-to-end. Nessuna garanzia di ranking, ma implementazione solida. Scrivimi: **${contact}**`;
  }
  if (locale === "zh") {
    return `可以，我一起做 GEO 和技术 SEO — llms.txt、结构化数据、可引用内容和架构端到端实施。不承诺排名，但扎实交付。写信给我：**${contact}**`;
  }
  if (locale === "ja") {
    return `はい、GEOとテクニカルSEOを一緒に提供します — llms.txt、構造化データ、引用可能なコンテンツ、アーキテクチャをエンドツーエンドで実装します。ランキング保証はしませんが、堅実に実装します。ご連絡ください：**${contact}**`;
  }
  return `Yes, I deliver GEO and technical SEO together — llms.txt, structured data, citable content, and site architecture end-to-end. No ranking guarantees, but solid production-grade implementation. Email me at **${contact}**.`;
}

function strengthIntro(locale: Locale, kind: "web" | "mobile" | "seo" | "geo" | "hire" | "region" | "general"): string {
  const tr: Record<typeof kind, string> = {
    web: "Web tarafında Next.js/React'ten API ve deploy'a kadar uçtan uca çalışıyorum; karmaşık ürünleri production'da ayakta kalacak mimariyle ele alıyorum.",
    mobile: "Mobil işlerde iOS/Android, backend, performans ve release süreçlerini birlikte yürütüyorum; prototipten mağazaya kadar sahipleniyorum.",
    seo: "Teknik SEO'da yapı, hız, schema ve içerik bütünlüğünü mühendislik disipliniyle birleştiriyorum — sıralama vaadi değil, sürdürülebilir görünürlük hedefliyorum.",
    geo: "GEO için llms.txt, yapılandırılmış veri ve doğru kaynak metinlerini birlikte düzenliyorum; uydurma metrik veya garanti vermiyorum.",
    hire: "Freelance, tam veya yarı zamanlı çalışabilirim; Figtures ve bradi.tech'te karmaşık sistemleri uçtan uca teslim ettim.",
    region: "Türkiye genelinde ve yurtdışında remote çalışıyorum; iletişim ve teslimat ritmim production odaklı.",
    general: "Mimari, backend, altyapı, yapay zekâ ürünleri ve otomasyonu tek çizgide birleştiriyorum — Celestial Insights, Medula Eczane ve StrumAI benim işlerim.",
  };
  const en: Record<typeof kind, string> = {
    web: "I handle web work end to end — from Next.js/React through APIs, infra, and production ops — with the architecture discipline complex products require.",
    mobile: "I pair mobile delivery with backend, performance, and release rigor — not UI-only prototypes.",
    seo: "I combine structure, speed, schema, and content integrity for technical SEO — sustainable visibility, not ranking promises.",
    geo: "I focus on llms.txt, citable truth, and structured data so AI search represents you accurately — no invented metrics.",
    hire: "I'm open to freelance, full-time, or part-time — backed by a track record shipping hard systems via Figtures and bradi.tech.",
    region: "I work remotely across Türkiye and internationally, with a production-first delivery rhythm.",
    general: "I treat architecture, backend, infra, AI products, and automation as one thread — Celestial Insights, Medula Eczane, and StrumAI are my work.",
  };
  return (locale === "tr" ? tr : en)[kind];
}

export function localAssistantReply(locale: Locale, userText: string): string {
  const t = userText.toLowerCase();
  const contact = CONTACT_EMAIL;

  const wantsContact =
    /contact|email|reach|iletişim|mail|anfrage|contacter|contatt|联系|連絡/.test(t);
  const wantsSeo = /\bseo\b|search engine|google rank|arama motor/.test(t);
  const wantsMobile = /mobile|ios|android|mobil|app store/.test(t);
  const wantsWeb = /web|website|next\.?js|react|frontend/.test(t);
  const wantsRegion =
    /istanbul|marmara|ege|aegean|ankara|iç anadolu|izmir|türkiye|turkey|remote|uzaktan/.test(t);
  const wantsHire =
    /hire|freelance|full.?time|part.?time|işe al|işe alabilir|çalış|projeye|engag|embauch|nas[ıi]l.*(al|hire)|nasıl başl|how.*start/.test(t);

  if (usesCuratedSearchReply(userText)) {
    return seoGeoServiceReply(locale, contact);
  }

  if (locale === "tr") {
    if (wantsHire && (wantsWeb || wantsMobile)) {
      return `Web ve mobil tarafında mimari, backend, altyapı ve release süreçlerini uçtan uca ele alıyorum; Türkiye ve yurtdışında farklı ölçeklerde teslim yaptım. Freelance, tam veya yarı zamanlı çalışabilirim. Hedefinizi kısaca **${contact}** adresine yazın, konuşalım.`;
    }
    if (wantsHire || wantsContact) {
      return `Kapsam, iş modeli ve takvim netleşince teknik yaklaşımı birlikte belirleriz; Türkiye ve yurtdışında production ortamlarında uçtan uca teslim yaptım. Uzaktan çalışıyorum. **${contact}** adresine proje özetinizi yazın.`;
    }
    if (wantsWeb) {
      return `${strengthIntro(locale, "web")} Hedefinizi **${contact}** adresine yazın, konuşalım.`;
    }
    if (wantsMobile) {
      return `${strengthIntro(locale, "mobile")} Hedefinizi **${contact}** adresine yazın.`;
    }
    if (wantsSeo) {
      return `${strengthIntro(locale, "seo")} **${contact}**`;
    }
    if (wantsRegion) {
      return `${strengthIntro(locale, "region")} **${contact}**`;
    }
    return `${strengthIntro(locale, "general")} Net bir soru veya kısa brief için **${contact}**.`;
  }

  if (wantsHire && (wantsWeb || wantsMobile)) {
    return `I handle web and mobile end-to-end: architecture, backend, infrastructure, and release processes. I've shipped across Türkiye and internationally. Freelance, full-time, or part-time works for me. Send a short goal to **${contact}**.`;
  }
  if (wantsHire || wantsContact) {
    return `Once we align on scope, model, and timeline, we set the technical approach together. I've delivered end-to-end in production across Türkiye and abroad. Remote is standard. Email a short project summary to **${contact}**.`;
  }
  if (wantsWeb) return `${strengthIntro(locale, "web")} Send a short goal to **${contact}**.`;
  if (wantsMobile) return `${strengthIntro(locale, "mobile")} Send a short goal to **${contact}**.`;
  if (wantsSeo) return `${strengthIntro(locale, "seo")} **${contact}**`;
  if (wantsRegion) return `${strengthIntro(locale, "region")} **${contact}**`;
  return `${strengthIntro(locale, "general")} **${contact}**`;
}

export function getAssistantApiUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_ASSISTANT_API_URL?.trim();
  return url || undefined;
}
