import type { Locale } from "../i18n";
import { hirePath, hireServicePath } from "../content/paths";
import { CONTACT_EMAIL, SITE_URL } from "../seo";
import { SERVICE_SLUGS } from "../services";
import { turkeyRegionNamesForLlms } from "../regions";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function buildSystemPrompt(locale: Locale, latestUserMessage?: string): string {
  const serviceLines = SERVICE_SLUGS.map(
    (slug) => `- ${slug}: ${SITE_URL}${hireServicePath(locale, slug)}`,
  ).join("\n");

  const localeDefault = localeLanguageName(locale);
  const userSnippet = (latestUserMessage ?? "").trim().slice(0, 400);

  return `You are Berktug AI on berktugberke.com — you help visitors understand how to work with this engineering practice (Berktuğ Berke Ateş / Berktug Berke Ates). You are NOT a link directory.

Purpose: answer clearly in the chat so the visitor can decide and act fast. Do not send them on a scavenger hunt.

Rules (strict):
- Only use facts from this prompt. Never invent phone numbers, extra emails, client logos, revenue, rankings, or guarantees.
- Never use the word "staff" in any language (no "staff engineer", no loanword "staff").
- Official contact: ${CONTACT_EMAIL}. GitHub berktugates, LinkedIn linkedin.com/in/berktugates.
- Co-founder Figtures (Istanbul). Engineer at bradi.tech (London). Many shipped products in Türkiye and internationally (remote). Reference Celestial Insights, Medula Eczane, StrumAI when relevant.
- Türkiye regions (areaServed): ${turkeyRegionNamesForLlms()}. No fake office in every city.
- No guaranteed SEO/GEO rankings.

Off-topic (strict):
- If the message is sexual, abusive, political, spam, gibberish, or unrelated to hiring/services/expertise: reply ONLY with one short polite sentence that you cannot help with that topic and invite a work-related question. Do NOT guess language games, do NOT engage, do NOT redirect to random technical topics.

Language (strict):
- Site UI locale: ${locale} — default answer language is ${localeDefault}.
- If the user's latest message is clearly in another language, reply entirely in that language.
- Latest user message: """${userSnippet.replace(/"/g, "'")}"""

Tone & content (strict):
- Senior/principal-level clarity: calm, precise, confident — without saying "staff".
- Prefer passive/neutral phrasing; do not repeat the full name every time.
- Answer the actual question first (2–4 sentences): process, fit, experience, delivery model (freelance / full-time / part-time), remote TR + abroad.
- At most ONE markdown link when essential, with a human label — never dump raw URLs or multiple hire links. Never paste "hire web-app" path names as plain text.
- Do not repeat or quote the user's question back to them.

Forbidden patterns:
- "sayfaya bakın" / "visit the page" as the main answer
- Listing multiple service URLs
- Echoing the user message at the start

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

function link(path: string, label: string) {
  return `[${label}](${path})`;
}

function strengthIntro(locale: Locale, kind: "web" | "mobile" | "seo" | "geo" | "hire" | "region" | "general"): string {
  const tr: Record<typeof kind, string> = {
    web: "Web tarafında Next.js/React’ten API ve deploy’a kadar uçtan uca düşünülür; karmaşık ürünler production’da ayakta kalacak mimari disiplinle ele alınır.",
    mobile: "Mobil işlerde iOS/Android; backend, performans ve release disiplini birlikte yürütülür; prototipten mağaza sürecine kadar sahiplenilir.",
    seo: "Teknik SEO’da yapı, hız, schema ve içerik bütünlüğü mühendislik disipliniyle birleştirilir — sıralama vaadi değil, sürdürülebilir görünürlük hedeflenir.",
    geo: "GEO’da llms.txt, doğru alıntılanabilir kaynaklar ve yapılandırılmış veriyle LLM aramalarında güvenilir temsil hedeflenir; uydurma metrik kullanılmaz.",
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
  const wantsGeo = /\bgeo\b|llm|ai search|generative|yapay zek|chatgpt|perplexity/.test(t);
  const wantsSeo = /\bseo\b|search engine|google rank|arama motor/.test(t);
  const wantsMobile = /mobile|ios|android|mobil|app store/.test(t);
  const wantsWeb = /web|website|next\.?js|react|frontend/.test(t);
  const wantsRegion =
    /istanbul|marmara|ege|aegean|ankara|iç anadolu|izmir|türkiye|turkey|remote|uzaktan/.test(t);
  const wantsHire =
    /hire|freelance|full.?time|part.?time|işe al|işe alabilir|çalış|projeye|engag|embauch|nas[ıi]l.*(al|hire)/.test(t);

  if (locale === "tr") {
    if (wantsHire && (wantsWeb || wantsMobile)) {
      return `Web ve mobil tarafında kapsam (ürün hedefi, stack, takvim) netleştirildikten sonra freelance, tam veya yarı zamanlı olarak devreye alınabilir. Türkiye ve yurtdışında production ortamlarında teslim edilmiş projelerde mimari, backend, mağaza/release ve operasyon birlikte yürütülmüştür. Başlamak için kısa bir brief **${contact}** adresine yeterlidir; uygun iş modeli ve ilk adımlar buna göre netleştirilir. İsterseniz detay için ${link(hire, "iş birliği sayfası")} da kullanılabilir.`;
    }
    if (wantsHire || wantsContact) {
      return `İş birliği için önce kapsam, teslim formatı (freelance / tam / yarı zamanlı) ve zaman çizelgesi konuşulur; ardından teknik yaklaşım ve ritim netleştirilir. Uzaktan çalışma Türkiye genelinde ve uluslararası ekiplerle rutindir. **${contact}** adresine proje özeti yazmanız yeterli.`;
    }
    if (wantsWeb) {
      return `${strengthIntro(locale, "web")} İşe alım süreci: kısa brief → kapsam/teknoloji uyumu → başlangıç. **${contact}**`;
    }
    if (wantsMobile) {
      return `${strengthIntro(locale, "mobile")} iOS/Android + backend birlikte ele alınır. **${contact}** ile başlayabilirsiniz.`;
    }
    if (wantsSeo) {
      return `${strengthIntro(locale, "seo")} **${contact}**`;
    }
    if (wantsGeo) {
      return `${strengthIntro(locale, "geo")} **${contact}**`;
    }
    if (wantsRegion) {
      return `${strengthIntro(locale, "region")} **${contact}**`;
    }
    return `${strengthIntro(locale, "general")} Net bir soru veya kısa brief için **${contact}**.`;
  }

  if (wantsHire && (wantsWeb || wantsMobile)) {
    return `For web and mobile work, scope (product goal, stack, timeline) is aligned first; then freelance, full-time, or part-time engagement can start. Delivery spans Türkiye and international remote teams with production-grade architecture, backend, and release discipline. Send a short brief to **${contact}** to confirm fit and next steps. Optional: ${link(hire, "collaboration page")}.`;
  }
  if (wantsHire || wantsContact) {
    return `Collaboration starts with scope, engagement type (freelance / full-time / part-time), and timeline — then technical approach and delivery rhythm. Remote work across Türkiye and abroad is standard. Email a short project summary to **${contact}**.`;
  }
  if (wantsWeb) return `${strengthIntro(locale, "web")} Start with a brief to **${contact}**.`;
  if (wantsMobile) return `${strengthIntro(locale, "mobile")} Contact **${contact}**.`;
  if (wantsSeo) return `${strengthIntro(locale, "seo")} **${contact}**`;
  if (wantsGeo) return `${strengthIntro(locale, "geo")} **${contact}**`;
  if (wantsRegion) return `${strengthIntro(locale, "region")} **${contact}**`;
  return `${strengthIntro(locale, "general")} **${contact}**`;
}

export function getAssistantApiUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_ASSISTANT_API_URL?.trim();
  return url || undefined;
}
