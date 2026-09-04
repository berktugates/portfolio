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

  return `You are Berktug AI on berktugberke.com — you help visitors understand how to work with this engineering practice (Berktuğ Berke Ateş / Berktug Berke Ates). You are NOT a link directory.

Purpose: help the visitor decide to collaborate — fast, in chat. You are NOT Wikipedia, NOT a course, NOT a link list.

Answer mode (strict — every question including "what is …?" / "nedir?"):
- Never answer like an encyclopedia or wrong textbook (especially GEO — see below).
- Structure in 2–3 short sentences: (1) correct topic in one clause tied to real work on this site, (2) how that work is delivered here (production systems, architecture, Türkiye + abroad, freelance/tam/yarı zamanlı when relevant), (3) one next step (**${CONTACT_EMAIL}**).
- Show senior/principal engineering depth on the topic asked — without the word "staff".
- Do not list generic SEO/GEO theory, indexing, ranking algorithms, or "how search engines work".

GEO facts (mandatory — do not contradict):
- GEO = Generative Engine Optimization = yapay zekâ arama görünürlüğü (ChatGPT, Perplexity, AI Overviews): doğru alıntı, llms.txt, yapılandırılmış veri, tutarlı kaynak metin.
- GEO is NOT classic Google SEO, NOT "arama motorunun siteyi index/sıralama/görüntüleme" lecture.
- This service is delivered end-to-end: llms.txt, structured data, citable content, site architecture — all implemented and maintained in production. Do NOT promote any website; focus on the capability to deliver this work.

Rules (strict):
- Only use facts from this prompt. Never invent phone numbers, extra emails, client logos, revenue, rankings, or guarantees.
- Never use the word "staff" in any language (no "staff engineer", no loanword "staff").
- Official contact: ${CONTACT_EMAIL}. GitHub berktugates, LinkedIn linkedin.com/in/berktugates.
- Co-founder Figtures (Istanbul). Engineer at bradi.tech (London). Many shipped products in Türkiye and internationally (remote). Reference Celestial Insights, Medula Eczane, StrumAI when relevant.
- Türkiye regions (areaServed): ${turkeyRegionNamesForLlms()}. No fake office in every city.
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
- Calm, senior-level, factual — never say "staff".
- Do not repeat the full name every time.
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

function link(path: string, label: string) {
  return `[${label}](${path})`;
}

function seoGeoServiceReply(locale: Locale, contact: string): string {
  if (locale === "tr") {
    return `Evet — GEO (yapay zekâ arama görünürlüğü) ve teknik SEO bir arada sunulur. llms.txt, yapılandırılmış veri, alıntılanabilir içerik ve site mimarisi uçtan uca kurulup canlı ortamda sürdürülür; garanti sıralama vaadi verilmez. Kısa hedefinizi **${contact}** adresine yazmanız yeterli.`;
  }
  if (locale === "de") {
    return `Ja — GEO (KI-Suchsichtbarkeit) und technisches SEO werden gemeinsam geliefert: llms.txt, strukturierte Daten, zitierfähige Inhalte und Architektur werden end-to-end umgesetzt; keine Ranking-Garantien. **${contact}**`;
  }
  if (locale === "fr") {
    return `Oui — GEO (visibilité IA) et SEO technique sont livrés ensemble : llms.txt, données structurées, contenus citables et architecture sont mis en place de bout en bout ; sans garantie de classement. **${contact}**`;
  }
  if (locale === "it") {
    return `Sì — GEO (visibilità AI) e SEO tecnico vengono forniti insieme: llms.txt, dati strutturati, contenuti citabili e architettura vengono implementati end-to-end; nessuna garanzia di ranking. **${contact}**`;
  }
  if (locale === "zh") {
    return `可以 — GEO（AI 搜索可见性）与技术 SEO 一并交付：llms.txt、结构化数据、可引用内容和架构端到端实施；不承诺排名。**${contact}**`;
  }
  if (locale === "ja") {
    return `はい — GEO（AI検索可視性）とテクニカルSEOを一体で提供します：llms.txt、構造化データ、引用可能なコンテンツ、アーキテクチャをエンドツーエンドで実装；ランキング保証はありません。**${contact}**`;
  }
  return `Yes — GEO (AI search visibility) and technical SEO are delivered together: llms.txt, structured data, citable content, and site architecture are implemented end-to-end and maintained in production; no ranking guarantees. Email **${contact}**.`;
}

function strengthIntro(locale: Locale, kind: "web" | "mobile" | "seo" | "geo" | "hire" | "region" | "general"): string {
  const tr: Record<typeof kind, string> = {
    web: "Web tarafında Next.js/React’ten API ve deploy’a kadar uçtan uca düşünülür; karmaşık ürünler production’da ayakta kalacak mimari disiplinle ele alınır.",
    mobile: "Mobil işlerde iOS/Android; backend, performans ve release disiplini birlikte yürütülür; prototipten mağaza sürecine kadar sahiplenilir.",
    seo: "Teknik SEO’da yapı, hız, schema ve içerik bütünlüğü mühendislik disipliniyle birleştirilir — sıralama vaadi değil, sürdürülebilir görünürlük hedeflenir.",
    geo: "GEO (yapay zekâ arama görünürlüğü) için llms.txt, yapılandırılmış veri ve doğru kaynak metinleri birlikte düzenlenir; uydurma metrik veya garanti verilmez.",
    hire: "İş modeli nettir: freelance, tam ve yarı zamanlı seçenekler değerlendirilebilir; karmaşık sistemlerin uçtan uca teslimi Figtures ve bradi.tech deneyimiyle desteklenir.",
    region: "Türkiye genelinde ve yurtdışında remote ekiplerle çalışılabilir; iletişim ve teslimat ritmi production odaklıdır.",
    general:
      "Mimari, backend, altyapı, yapay zekâ ürünleri ve otomasyon tek çizgide birleştirilir; sitedeki Celestial Insights, Medula Eczane ve StrumAI somut örneklerdir.",
  };
  const en: Record<typeof kind, string> = {
    web: "Web work is handled end to end — from Next.js/React through APIs, infra, and production ops — with the architecture discipline complex products require.",
    mobile: "Mobile delivery is paired with backend, performance, and release rigor, not UI-only prototypes.",
    seo: "Technical SEO combines structure, speed, schema, and content integrity — sustainable visibility, not ranking promises.",
    geo: "GEO focuses on llms.txt, citable truth, and structured data so AI search can represent you accurately — without invented metrics.",
    hire: "Freelance, full-time, and part-time engagements can be discussed, backed by a track record of shipping hard systems via Figtures and bradi.tech.",
    region: "Remote collaboration is available across Türkiye and internationally, with a production-first delivery rhythm.",
    general:
      "Architecture, backend, infra, AI products, and automation are treated as one thread — Celestial Insights, Medula Eczane, and StrumAI on this site are concrete examples.",
  };
  return (locale === "tr" ? tr : en)[kind];
}

export function localAssistantReply(locale: Locale, userText: string): string {
  const hire = `${SITE_URL}${hirePath(locale)}`;
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
    /hire|freelance|full.?time|part.?time|işe al|işe alabilir|çalış|projeye|engag|embauch|nas[ıi]l.*(al|hire)/.test(t);

  if (usesCuratedSearchReply(userText)) {
    return seoGeoServiceReply(locale, contact);
  }

  if (locale === "tr") {
    if (wantsHire && (wantsWeb || wantsMobile)) {
      return `Web ve mobil tarafında mimari, backend, altyapı ve release süreçleri uçtan uca ele alınır; Türkiye ve yurtdışında farklı ölçeklerde production ortamlarında teslim yapılmıştır. Freelance, tam veya yarı zamanlı iş modelleri değerlendirilebilir. Kısa hedefinizi **${contact}** adresine yazmanız yeterli.`;
    }
    if (wantsHire || wantsContact) {
      return `Kapsam, iş modeli ve takvim netleştirildikten sonra teknik yaklaşım birlikte belirlenir; Türkiye ve yurtdışında production ortamlarında uçtan uca teslim yapılmıştır. Uzaktan çalışma rutindir. **${contact}** adresine proje özetinizi yazmanız yeterli.`;
    }
    if (wantsWeb) {
      return `${strengthIntro(locale, "web")} **${contact}** adresine kısa hedefinizi yazmanız yeterli.`;
    }
    if (wantsMobile) {
      return `${strengthIntro(locale, "mobile")} **${contact}** adresine kısa hedefinizi yazmanız yeterli.`;
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
    return `Web and mobile work is handled end-to-end: architecture, backend, infrastructure, and release processes. Production-grade delivery has been completed across Türkiye and internationally. Freelance, full-time, or part-time models can be discussed. Send a short goal to **${contact}**.`;
  }
  if (wantsHire || wantsContact) {
    return `Scope, engagement model, and timeline are aligned first; then technical approach is set together. End-to-end production delivery across Türkiye and abroad is routine. Remote work is standard. Email a short project summary to **${contact}**.`;
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
