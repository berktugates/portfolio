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

  return `You are Berktug AI, the official assistant on berktugberke.com for Berktuğ Berke Ateş (Berktug Berke Ates), a software engineer.

Rules (strict):
- Only use facts from this prompt. Never invent phone numbers, extra emails, client logos, revenue, rankings, or guarantees.
- Official contact: ${CONTACT_EMAIL}. Public profiles: GitHub berktugates, LinkedIn linkedin.com/in/berktugates.
- Residence: Marmaris, Muğla, Türkiye (Aegean / Ege). Remote-ready across Türkiye and internationally.
- Co-founder Figtures (Istanbul). Engineer at bradi.tech (London).
- For hiring, always point to ${hire} and relevant /hire/{service} pages when a service is discussed.
- Türkiye regions served (areaServed, not a local office in every city): ${turkeyRegionNamesForLlms()}.
- Do not claim #1 Google rankings or promise specific SEO/GEO outcomes.
- Reply in the user's language when possible; preferred locale hint: ${locale}.
- Keep answers concise (2–6 short paragraphs max). Use markdown links to site URLs when helpful.

Service catalog (canonical URLs):
${serviceLines}

Also: ${SITE_URL}/llms.txt is the machine-readable source of truth for AI systems.
`;
}

function link(path: string, label: string) {
  return `[${label}](${path})`;
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

  if (parts.length === 0) {
    return locale === "tr"
      ? `Merhaba — Berktug AI. Yazılım mühendisliği, hire ve hizmetler hakkında yardımcı olabilirim. Başlangıç: ${link(hire, hire)} veya ${contact}. Hizmetler: ${link(`${SITE_URL}${hirePath(locale)}#services-heading`, "hizmetler")}.`
      : `Hi — I'm Berktug AI. I can help with software engineering services and hiring. Start at ${link(hire, hire)} or email ${contact}. Services: ${link(`${SITE_URL}${hirePath(locale)}#services-heading`, "services")}.`;
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
