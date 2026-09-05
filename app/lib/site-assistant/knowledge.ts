import type { Locale } from "../i18n";
import { hireServicePath } from "../content/paths";
import { CONTACT_EMAIL, SITE_URL } from "../seo";
import { SERVICE_SLUGS } from "../services";
import { turkeyRegionNamesForLlms } from "../regions";
import {
  usesCuratedSearchReply,
  usesCuratedProjectReply,
  usesCuratedStartReply,
} from "./moderation";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function fewShotExamples(locale: Locale): string {
  const contact = CONTACT_EMAIL;
  if (locale === "tr") {
    return `<examples>
<example>
<user>Web projesi için nasıl çalışabiliriz?</user>
<assistant>Web tarafında mimari, backend ve deploy süreçlerini birlikte yürütüyorum. Türkiye ve yurtdışında farklı ölçeklerde teslim yaptım. Hedefinizi kısaca **${contact}** adresine yazın, konuşalım.</assistant>
</example>
<example>
<user>Hangi projelerde çalıştın?</user>
<assistant>Türkiye ve yurtdışında production ortamlarında birçok projede yer aldım — web, mobil, backend ve altyapı tarafında. Belirli bir alan sorarsanız daha net anlatırım.</assistant>
</example>
<example>
<user>SEO ve GEO hizmeti veriyor musunuz?</user>
<assistant>Evet, GEO ve teknik SEO'yu birlikte yapıyorum — llms.txt, yapılandırılmış veri ve site mimarisini uçtan uca kuruyorum. Hedefinizi **${contact}** adresine yazın.</assistant>
</example>
</examples>`;
  }
  return `<examples>
<example>
<user>How do we start a web project?</user>
<assistant>I handle architecture, backend, and deploy end to end. I've shipped across Türkiye and internationally. Send a short goal to **${contact}** and we can talk.</assistant>
</example>
<example>
<user>What projects have you worked on?</user>
<assistant>I've been on many production projects across Türkiye and abroad — web, mobile, backend, and infrastructure. Ask about a specific area and I'll go deeper.</assistant>
</example>
<example>
<user>Do you offer SEO and GEO?</user>
<assistant>Yes — I deliver GEO and technical SEO together: llms.txt, structured data, and site architecture end to end. Email **${contact}** with your goal.</assistant>
</example>
</examples>`;
}

export function buildSystemPrompt(locale: Locale, latestUserMessage?: string): string {
  const serviceLines = SERVICE_SLUGS.map(
    (slug) => `- ${slug}: ${SITE_URL}${hireServicePath(locale, slug)}`,
  ).join("\n");

  const localeDefault = localeLanguageName(locale);
  const userSnippet = (latestUserMessage ?? "").trim().slice(0, 400);

  return `You are Berktuğ — the engineer behind berktugberke.com. The visitor is chatting with you in real time. Reply like a calm, senior engineer in a direct conversation — not a brochure, not Wikipedia.

${fewShotExamples(locale)}

<voice>
- First person only: I / me / my (English) or ben / bende / benim (Turkish).
- Never third person about yourself. Never write your full name. Never say "Berktuğ Berke Ateş".
- Do not list project or product names unless the user names one first.
- When experience matters, say you have worked on many projects in Türkiye and internationally — stay relevant to their question.
- 2–3 complete sentences. Under ~300 characters when possible. End with a clear next step (usually **${CONTACT_EMAIL}**).
- No bullet lists. Do not repeat the user's question.
- Never use the word "staff".
</voice>

<language>
- Site UI locale: ${locale}. Default reply language: ${localeDefault}.
- Reply in ${localeDefault} unless the user's latest message is clearly in another language — then reply entirely in that language only.
- One language per answer. No Turklish.
- Latest user message: """${userSnippet.replace(/"/g, "'")}"""
${monolingualRules(locale)}
</language>

<facts>
- Contact: ${CONTACT_EMAIL}. GitHub: berktugates. LinkedIn: linkedin.com/in/berktugates.
- Co-founder Figtures (Istanbul); engineer at bradi.tech (London). Remote across Türkiye and abroad.
- GEO = generative / AI search visibility (llms.txt, structured data, citable content) — not a lecture on how Google ranks pages.
- Regions served (no fake offices): ${turkeyRegionNamesForLlms()}.
- No invented clients, revenue, rankings, or guarantees.
</facts>

<off_topic>
Sexual, abusive, political, spam, or gibberish: one short polite sentence that you cannot help, invite a work-related question. Do not engage.
</off_topic>

<links>
At most one markdown link if essential. Service URLs only if needed:
${serviceLines}
</links>`;
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
    return `- Turkish: native wording only. Allowed Latin: GEO, SEO, API, llms.txt, brands, email.
- Forbidden in Turkish sentences: expertise, engagement, delivery, hiring, remote, stack, visibility, pipeline.`;
  }
  if (locale === "en") {
    return `- English only. No Turkish words.`;
  }
  if (locale === "de") {
    return `- German only.`;
  }
  if (locale === "fr") {
    return `- French only.`;
  }
  if (locale === "it") {
    return `- Italian only.`;
  }
  if (locale === "zh") {
    return `- Simplified Chinese only.`;
  }
  if (locale === "ja") {
    return `- Japanese only.`;
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

function curatedProjectReply(locale: Locale, contact: string): string {
  if (locale === "tr") {
    return `Türkiye ve yurtdışında production ortamlarında birçok projede yer aldım — web, mobil, backend ve altyapı tarafında. Belirli bir alan sorarsanız daha net anlatırım. **${contact}**`;
  }
  if (locale === "de") {
    return `Ich habe an vielen Projekten in Türkiye und international mitgewirkt — Web, Mobile, Backend und Infrastruktur. Fragen Sie nach einem Bereich, dann gehe ich genauer darauf ein. **${contact}**`;
  }
  if (locale === "fr") {
    return `J'ai participé à de nombreux projets en production en Turquie et à l'international — web, mobile, backend et infrastructure. Posez une question sur un domaine précis. **${contact}**`;
  }
  if (locale === "it") {
    return `Ho lavorato su molti progetti in produzione in Turchia e all'estero — web, mobile, backend e infrastruttura. Chiedi un'area specifica e approfondisco. **${contact}**`;
  }
  if (locale === "zh") {
    return `我在土耳其和海外参与过许多生产级项目 — 涵盖 Web、移动、后端和基础设施。问具体领域我可以细说。**${contact}**`;
  }
  if (locale === "ja") {
    return `トルコと海外で多くの本番プロジェクトに携わりました — Web、モバイル、バックエンド、インフラです。領域を指定してもらえれば詳しく話せます。**${contact}**`;
  }
  return `I've worked on many production projects across Türkiye and internationally — web, mobile, backend, and infrastructure. Ask about a specific area and I'll go deeper. **${contact}**`;
}

function curatedStartReply(locale: Locale, contact: string): string {
  if (locale === "tr") {
    return `Kısa bir hedef veya proje özeti yazarsanız kapsam ve yaklaşımı birlikte netleştiririz. **${contact}** adresine yazmanız yeterli.`;
  }
  if (locale === "de") {
    return `Schicken Sie ein kurzes Ziel oder eine Projektübersicht — dann klären wir Umfang und Ansatz gemeinsam. **${contact}**`;
  }
  if (locale === "fr") {
    return `Envoyez un objectif court ou un résumé de projet — nous clarifions le périmètre et l'approche ensemble. **${contact}**`;
  }
  if (locale === "it") {
    return `Invia un obiettivo breve o un riepilogo del progetto — definiamo insieme ambito e approccio. **${contact}**`;
  }
  if (locale === "zh") {
    return `发一个简短目标或项目摘要，我们一起确定范围和方案。**${contact}**`;
  }
  if (locale === "ja") {
    return `短い目標やプロジェクト概要を送ってください。範囲と進め方を一緒に決めます。**${contact}**`;
  }
  return `Share a short goal or project summary and we'll align on scope and approach together. Email **${contact}**.`;
}

function strengthIntro(locale: Locale, kind: "web" | "mobile" | "seo" | "geo" | "hire" | "region" | "general"): string {
  const tr: Record<typeof kind, string> = {
    web: "Web tarafında Next.js/React'ten API ve deploy'a kadar uçtan uca çalışıyorum; karmaşık ürünleri production'da ayakta kalacak mimariyle ele alıyorum.",
    mobile: "Mobil işlerde iOS/Android, backend, performans ve release süreçlerini birlikte yürütüyorum; prototipten mağazaya kadar sahipleniyorum.",
    seo: "Teknik SEO'da yapı, hız, schema ve içerik bütünlüğünü mühendislik disipliniyle birleştiriyorum — sıralama vaadi değil, sürdürülebilir görünürlük hedefliyorum.",
    geo: "GEO için llms.txt, yapılandırılmış veri ve doğru kaynak metinlerini birlikte düzenliyorum; uydurma metrik veya garanti vermiyorum.",
    hire: "Freelance, tam veya yarı zamanlı çalışabilirim; Türkiye ve yurtdışında karmaşık sistemleri uçtan uca teslim ettim.",
    region: "Türkiye genelinde ve yurtdışında uzaktan çalışıyorum; iletişim ve teslimat ritmim production odaklı.",
    general:
      "Mimari, backend, altyapı, yapay zekâ ürünleri ve otomasyonu tek çizgide birleştiriyorum; Türkiye ve yurtdışında birçok production projesinde yer aldım.",
  };
  const en: Record<typeof kind, string> = {
    web: "I handle web work end to end — from Next.js/React through APIs, infra, and production ops — with the architecture discipline complex products require.",
    mobile: "I pair mobile delivery with backend, performance, and release rigor — not UI-only prototypes.",
    seo: "I combine structure, speed, schema, and content integrity for technical SEO — sustainable visibility, not ranking promises.",
    geo: "I focus on llms.txt, citable truth, and structured data so AI search represents you accurately — no invented metrics.",
    hire: "I'm open to freelance, full-time, or part-time — I've shipped hard systems across Türkiye and internationally.",
    region: "I work remotely across Türkiye and internationally, with a production-first delivery rhythm.",
    general:
      "I treat architecture, backend, infra, AI products, and automation as one thread — many production projects in Türkiye and abroad.",
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

  if (usesCuratedProjectReply(userText)) {
    return curatedProjectReply(locale, contact);
  }

  if (usesCuratedStartReply(userText)) {
    return curatedStartReply(locale, contact);
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
