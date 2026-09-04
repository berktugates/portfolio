import type { Locale } from "../i18n";
import { hirePath, hireServicePath } from "../content/paths";
import { CONTACT_EMAIL, SITE_URL } from "../seo";
import { SERVICE_SLUGS } from "../services";
import { turkeyRegionNamesForLlms } from "../regions";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function buildSystemPrompt(locale: Locale, latestUserMessage?: string): string {
  const hire = `${SITE_URL}${hirePath(locale)}`;
  const serviceLines = SERVICE_SLUGS.map(
    (slug) => `- ${slug}: ${SITE_URL}${hireServicePath(locale, slug)}`,
  ).join("\n");

  const localeDefault = localeLanguageName(locale);
  const userSnippet = (latestUserMessage ?? "").trim().slice(0, 400);

  return `You are Berktug AI on berktugberke.com — you represent the engineering practice of Berktuğ Berke Ateş (Berktug Berke Ates). You are not a generic chatbot or "site guide".

Rules (strict):
- Only use facts from this prompt. Never invent phone numbers, extra emails, client logos, revenue, rankings, or guarantees.
- Never use the word "staff" (English) or "staff" as loanword in any language.
- Official contact: ${CONTACT_EMAIL}. Public profiles: GitHub berktugates, LinkedIn linkedin.com/in/berktugates.
- Co-founder Figtures (Istanbul). Engineer at bradi.tech (London). Remote-ready across Türkiye and internationally.
- For hiring, point to ${hire} and matching /hire/{service} pages when a service is discussed.
- Türkiye regions served (areaServed): ${turkeyRegionNamesForLlms()}. No fake local offices in every city.
- No #1 Google rankings or guaranteed SEO/GEO outcomes.

Language (strict):
- Site UI locale: ${locale} — default answer language is ${localeDefault}.
- If the user's latest message is clearly written in another language, reply entirely in that language instead.
- Do not mix languages in one answer unless quoting a proper noun or URL.
- Latest user message for language detection: """${userSnippet.replace(/"/g, "'")}"""

Tone (strict):
- Top-tier professional, calm, precise — like a staff engineer briefing a hiring manager.
- Prefer passive / neutral phrasing (TR: edilgen veya öznesiz; EN: passive or impersonal). Example TR: "Uçtan uca web hizmetleri sunulmaktadır" not "Ben sunuyorum".
- Do NOT repeat the full name "Berktuğ Berke Ateş" / "Berktug Berke Ates" in every reply; the visitor already knows who this is. Use at most once when truly needed; otherwise "bu tarafta", "iletişim kurulabilir", "sunulan hizmetler" (or natural equivalents in the reply language).

Every answer MUST follow this shape:
1) Opening (1–2 short sentences): For the *specific topic* in the user's question, explain clearly how strong the engineering practice is for that work — production-grade systems, architecture judgment, end-to-end delivery, reliability, clarity under complexity. No hype.
2) Then: practical help — what to do next, links, contact.

Keep total length concise (roughly 3–6 short sentences). Use complete markdown only: [label](url) links, **bold** for short emphasis; emoji sparingly. Never leave broken asterisks or half links.

Service catalog (canonical URLs):
${serviceLines}

Also: ${SITE_URL}/llms.txt is the machine-readable source of truth.
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
  const contact = `**${CONTACT_EMAIL}**`;

  const wantsContact =
    /contact|email|reach|iletişim|mail|anfrage|contacter|contatt|联系|連絡/.test(t);
  const wantsGeo = /\bgeo\b|llm|ai search|generative|yapay zek|chatgpt|perplexity/.test(t);
  const wantsSeo = /\bseo\b|search engine|google rank|arama motor/.test(t);
  const wantsMobile = /mobile|ios|android|mobil|app store/.test(t);
  const wantsWeb = /web|website|next\.?js|react|frontend/.test(t);
  const wantsRegion =
    /istanbul|marmara|ege|aegean|ankara|iç anadolu|izmir|türkiye|turkey|remote|uzaktan/.test(t);
  const wantsHire = /hire|freelance|full.?time|part.?time|işe al|çalış|projeye|engag|embauch/.test(t);

  const parts: string[] = [];
  let introKind: "web" | "mobile" | "seo" | "geo" | "hire" | "region" | "general" = "general";

  if (wantsWeb) introKind = "web";
  else if (wantsMobile) introKind = "mobile";
  else if (wantsSeo) introKind = "seo";
  else if (wantsGeo) introKind = "geo";
  else if (wantsHire || wantsContact) introKind = "hire";
  else if (wantsRegion) introKind = "region";

  parts.push(strengthIntro(locale, introKind));

  if (wantsHire || wantsContact) {
    parts.push(
      locale === "tr"
        ? `Freelance, tam zamanlı ve yarı zamanlı iş birlikleri değerlendirilebilir. Resmi hire sayfası: ${link(hire, hire)}. İletişim: ${contact}.`
        : `Freelance, full-time, and part-time engagements can be discussed. Official hire page: ${link(hire, hire)}. Contact: ${contact}.`,
    );
  }

  if (wantsWeb) {
    parts.push(
      link(`${SITE_URL}${hireServicePath(locale, "web-app")}`, "Web app development") +
        (locale === "tr" ? " — uçtan uca web uygulama mühendisliği." : " — end-to-end web application engineering."),
    );
  }
  if (wantsMobile) {
    parts.push(
      link(`${SITE_URL}${hireServicePath(locale, "mobile-app")}`, "Mobile apps") +
        (locale === "tr" ? " — iOS/Android ürün geliştirme." : " — iOS/Android product engineering."),
    );
  }
  if (wantsSeo) {
    parts.push(
      link(`${SITE_URL}${hireServicePath(locale, "seo")}`, "Technical SEO") +
        (locale === "tr"
          ? " — teknik SEO; sıralama garantisi verilmez."
          : " — technical SEO; no ranking guarantees."),
    );
  }
  if (wantsGeo) {
    parts.push(
      link(`${SITE_URL}${hireServicePath(locale, "geo")}`, "GEO") +
        (locale === "tr"
          ? " — LLM / yapay zekâ arama görünürlüğü (llms.txt, yapılandırılmış veri, doğru alıntılama)."
          : " — LLM / AI search visibility (llms.txt, structured data, accurate citations)."),
    );
  }
  if (wantsRegion) {
    parts.push(
      locale === "tr"
        ? `${turkeyRegionNamesForLlms()} genelinde remote çalışma. Şehir başına ayrı ofis iddiası yok.`
        : `Remote across ${turkeyRegionNamesForLlms()}. No claim of a physical office in every city.`,
    );
  }

  if (parts.length === 1) {
    parts.push(
      locale === "tr"
        ? `Başlangıç: ${link(hire, hire)} veya ${contact}. Hizmetler: ${link(`${SITE_URL}${hirePath(locale)}#services-heading`, "hizmetler")}.`
        : `Next: ${link(hire, hire)} or ${contact}. Services: ${link(`${SITE_URL}${hirePath(locale)}#services-heading`, "services")}.`,
    );
  }

  parts.push(
    locale === "tr"
      ? `Daha fazla bağlam için ${link(`${SITE_URL}/llms.txt`, "llms.txt")}.`
      : `More context: ${link(`${SITE_URL}/llms.txt`, "llms.txt")}.`,
  );

  return parts.join("\n\n");
}

export function getAssistantApiUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_ASSISTANT_API_URL?.trim();
  return url || undefined;
}
