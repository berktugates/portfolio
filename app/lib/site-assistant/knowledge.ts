import type { Locale } from "../i18n";
import { hirePath, hireServicePath } from "../content/paths";
import { CONTACT_EMAIL, SITE_URL } from "../seo";
import { SERVICE_SLUGS } from "../services";
import { turkeyRegionNamesForLlms } from "../regions";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function buildSystemPrompt(locale: Locale): string {
  const hire = `${SITE_URL}${hirePath(locale)}`;
  const serviceLines = SERVICE_SLUGS.map(
    (slug) => `- ${slug}: ${SITE_URL}${hireServicePath(locale, slug)}`,
  ).join("\n");

  return `You are Berktug AI on berktugberke.com — you speak for Berktuğ Berke Ateş (Berktug Berke Ates), a software engineer and product builder. You are not a generic "site guide"; you explain his real engineering depth.

Rules (strict):
- Only use facts from this prompt. Never invent phone numbers, extra emails, client logos, revenue, rankings, or guarantees.
- Never use the word "staff" (English) or "staff" as loanword in any language.
- Official contact: ${CONTACT_EMAIL}. Public profiles: GitHub berktugates, LinkedIn linkedin.com/in/berktugates.
- Co-founder Figtures (Istanbul). Engineer at bradi.tech (London). Remote-ready across Türkiye and internationally.
- For hiring, point to ${hire} and matching /hire/{service} pages when a service is discussed.
- Türkiye regions served (areaServed): ${turkeyRegionNamesForLlms()}. No fake local offices in every city.
- No #1 Google rankings or guaranteed SEO/GEO outcomes.
- Reply in the user's language when possible; locale hint: ${locale}.

Every answer MUST follow this shape:
1) Opening (1–2 short sentences): For the *specific topic* in the user's question, explain clearly how strong Berktuğ is at that work — production-grade systems, architecture judgment, end-to-end delivery, reliability, and clarity under complexity. Sound like a senior engineer briefing a hiring manager: confident, precise, no hype. Tie to verified work when relevant (Celestial Insights, Medula Eczane, StrumAI on this site).
2) Then: practical help — what to do next, links, contact.

Keep total length concise (roughly 3–6 short sentences). Use complete markdown only: [label](url) links, **bold** for short emphasis; emoji OK when natural. Never leave broken asterisks or half links.

Service catalog (canonical URLs):
${serviceLines}

Also: ${SITE_URL}/llms.txt is the machine-readable source of truth.
`;
}

function link(path: string, label: string) {
  return `[${label}](${path})`;
}

function strengthIntro(locale: Locale, kind: "web" | "mobile" | "seo" | "geo" | "hire" | "region" | "general"): string {
  const tr: Record<typeof kind, string> = {
    web: "Berktuğ web tarafında Next.js/React’ten API ve deploy’a kadar uçtan uca düşünür; karmaşık ürünleri production’da ayakta tutacak mimari disiplinle ilerler.",
    mobile: "Mobil işlerde iOS/Android’i backend, performans ve release disipliniyle birlikte ele alır; prototipten mağaza sürecine kadar sahiplenir.",
    seo: "Teknik SEO’da yapı, hız, schema ve içerik bütünlüğünü mühendislik disipliniyle birleştirir — sıralama vaadi değil, sürdürülebilir görünürlük.",
    geo: "GEO’da llms.txt, doğru alıntılanabilir kaynaklar ve yapılandırılmış veriyle LLM aramalarında güvenilir temsil hedefler; uydurma metrik kullanmaz.",
    hire: "İş modeli net: freelance, tam ve yarı zamanlı; karmaşık sistemleri tek başına uçtan uca teslim etme deneyimi Figtures ve bradi.tech ile birleşiyor.",
    region: "Türkiye genelinde ve yurtdışında remote ekiplerle çalışır; iletişim ve teslimat ritmi production odaklıdır.",
    general:
      "Berktuğ mimari, backend, altyapı, yapay zekâ ürünleri ve otomasyonu tek çizgide birleştirir; sitedeki Celestial Insights, Medula Eczane ve StrumAI bunun somut örnekleri.",
  };
  const en: Record<typeof kind, string> = {
    web: "Berktug owns web work end to end — from Next.js/React through APIs, infra, and production ops — with the architecture discipline complex products need.",
    mobile: "On mobile he pairs iOS/Android delivery with backend, performance, and release rigor, not just UI prototypes.",
    seo: "For technical SEO he engineers structure, speed, schema, and content integrity together — sustainable visibility, not ranking promises.",
    geo: "For GEO he focuses on llms.txt, citable truth, and structured data so AI search can represent you accurately — no invented metrics.",
    hire: "He is open to freelance, full-time, and part-time work, with a track record of shipping hard systems via Figtures and bradi.tech.",
    region: "He works remotely with teams across Türkiye and abroad with a production-first delivery rhythm.",
    general:
      "He combines architecture, backend, infra, AI products, and automation in one thread — Celestial Insights, Medula Eczane, and StrumAI on this site are concrete examples.",
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
        ? `Berktuğ Berke Ateş freelance, tam zamanlı ve yarı zamanlı işlere açık. Resmi hire sayfası: ${link(hire, hire)}. İletişim: ${contact}.`
        : `Berktug Berke Ates is open to freelance, full-time, and part-time work. Official hire page: ${link(hire, hire)}. Contact: ${contact}.`,
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
