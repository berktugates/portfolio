import type { Locale } from "../i18n";
import { hireServicePath } from "../content/paths";
import { CONTACT_FORM_PATH_LABEL } from "../i18n/hire-engagement";
import { CONTACT_PAGE_URL, SITE_URL } from "../seo";
import { SERVICE_SLUGS } from "../services";

import {
  usesCuratedSearchReply,
  usesCuratedProjectReply,
  usesCuratedStartReply,
} from "./moderation";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function contactFormMarkdownLink(contact: string): string {
  return `[${CONTACT_FORM_PATH_LABEL}](${contact})`;
}

function contactFormPhrase(locale: Locale, contact: string): string {
  const link = contactFormMarkdownLink(contact);
  if (locale === "tr") return `İletişim formu: ${link}`;
  if (locale === "de") return `Kontaktformular: ${link}`;
  if (locale === "fr") return `Formulaire de contact : ${link}`;
  if (locale === "it") return `Modulo di contatto: ${link}`;
  if (locale === "zh") return `联系表单：${link}`;
  if (locale === "ja") return `お問い合わせフォーム：${link}`;
  return `Contact form: ${link}`;
}

function fewShotExamples(locale: Locale): string {
  const contact = CONTACT_PAGE_URL;
  const form = contactFormPhrase(locale, contact);
  if (locale === "tr") {
    return `<examples>
<example>
<user>Web projesi için nasıl çalışabiliriz?</user>
<assistant>Web tarafında mimari, backend ve deploy süreçlerini birlikte yürütüyorum. Farklı ölçeklerde production teslimi yaptım. Kısa hedefinizi ${form} üzerinden paylaşın, konuşalım.</assistant>
</example>
<example>
<user>Hangi projelerde çalıştın?</user>
<assistant>Production ortamlarında birçok projede yer aldım — web, mobil, backend ve altyapı tarafında. Belirli bir alan sorarsanız daha net anlatırım.</assistant>
</example>
<example>
<user>SEO ve GEO hizmeti veriyor musunuz?</user>
<assistant>Evet, GEO ve teknik SEO'yu birlikte yapıyorum — llms.txt, yapılandırılmış veri ve site mimarisini uçtan uca kuruyorum. Hedefinizi ${form} ile iletin.</assistant>
</example>
</examples>`;
  }
  return `<examples>
<example>
<user>How do we start a web project?</user>
<assistant>I handle architecture, backend, and deploy end to end. I've shipped production systems at different scales. Share a short goal via the ${form.replace("Contact form", "contact form")} and we can talk.</assistant>
</example>
<example>
<user>What projects have you worked on?</user>
<assistant>I've been on many production projects — web, mobile, backend, and infrastructure. Ask about a specific area and I'll go deeper.</assistant>
</example>
<example>
<user>Do you offer SEO and GEO?</user>
<assistant>Yes — I deliver GEO and technical SEO together: llms.txt, structured data, and site architecture end to end. Use the ${form.replace("Contact form", "contact form")} with your goal.</assistant>
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
- When experience matters, say you have worked on many production projects — stay relevant to their question. Do not mention countries, cities, regions, or where you live.
- 2–3 complete sentences. Under ~300 characters when possible. End with a clear next step (usually the contact form **${CONTACT_PAGE_URL}**).
- No bullet lists. Do not repeat the user's question.
- Never use the word "staff".
- Never use the word "freelance".
</voice>

<language>
- Site UI locale: ${locale}. Default reply language: ${localeDefault}.
- Reply in ${localeDefault} unless the user's latest message is clearly in another language — then reply entirely in that language only.
- One language per answer. No Turklish.
- Latest user message: """${userSnippet.replace(/"/g, "'")}"""
${monolingualRules(locale)}
</language>

<facts>
- Contact form: ${CONTACT_PAGE_URL}. GitHub: berktugates. LinkedIn: linkedin.com/in/berktugates. Never publish an email address.
- Full-stack software engineer at bradi.tech.
- GEO = generative / AI search visibility (llms.txt, structured data, citable content) — not a lecture on how Google ranks pages.
- Full-time, part-time, and project-based engagements. Do not state a residence, city, region, or geography tied to where he lives.
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
    return `- Turkish: native wording only. Allowed Latin: GEO, SEO, API, llms.txt, brands.
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
  const form = contactFormPhrase(locale, contact);
  if (locale === "tr") {
    return `Evet, GEO ve teknik SEO'yu birlikte yapıyorum — llms.txt, yapılandırılmış veri, alıntılanabilir içerik ve site mimarisini uçtan uca kuruyorum. Sıralama garantisi vermiyorum ama sürdürülebilir görünürlük için production disipliniyle çalışıyorum. Kısa hedefinizi ${form} ile paylaşın.`;
  }
  if (locale === "de") {
    return `Ja, ich liefere GEO und technisches SEO zusammen — llms.txt, strukturierte Daten, zitierfähige Inhalte und Architektur end-to-end. Keine Ranking-Garantien, aber solide Umsetzung. ${form}.`;
  }
  if (locale === "fr") {
    return `Oui, je livre GEO et SEO technique ensemble — llms.txt, données structurées, contenus citables et architecture de bout en bout. Pas de garantie de classement, mais une mise en œuvre solide. ${form}.`;
  }
  if (locale === "it") {
    return `Sì, fornisco GEO e SEO tecnico insieme — llms.txt, dati strutturati, contenuti citabili e architettura end-to-end. Nessuna garanzia di ranking, ma implementazione solida. ${form}.`;
  }
  if (locale === "zh") {
    return `可以，我一起做 GEO 和技术 SEO — llms.txt、结构化数据、可引用内容和架构端到端实施。不承诺排名，但扎实交付。${form}。`;
  }
  if (locale === "ja") {
    return `はい、GEOとテクニカルSEOを一緒に提供します — llms.txt、構造化データ、引用可能なコンテンツ、アーキテクチャをエンドツーエンドで実装します。ランキング保証はしませんが、堅実に実装します。${form}。`;
  }
  return `Yes, I deliver GEO and technical SEO together — llms.txt, structured data, citable content, and site architecture end-to-end. No ranking guarantees, but solid production-grade implementation. ${form}.`;
}

function curatedProjectReply(locale: Locale, contact: string): string {
  const form = contactFormPhrase(locale, contact);
  if (locale === "tr") {
    return `Production ortamlarında birçok projede yer aldım — web, mobil, backend ve altyapı tarafında. Belirli bir alan sorarsanız daha net anlatırım. ${form}.`;
  }
  if (locale === "de") {
    return `Ich habe an vielen Projekten in Production mitgewirkt — Web, Mobile, Backend und Infrastruktur. Fragen Sie nach einem Bereich, dann gehe ich genauer darauf ein. ${form}.`;
  }
  if (locale === "fr") {
    return `J'ai participé à de nombreux projets en production — web, mobile, backend et infrastructure. Posez une question sur un domaine précis. ${form}.`;
  }
  if (locale === "it") {
    return `Ho lavorato su molti progetti in produzione — web, mobile, backend e infrastruttura. Chiedi un'area specifica e approfondisco. ${form}.`;
  }
  if (locale === "zh") {
    return `我参与过许多生产级项目 — 涵盖 Web、移动、后端和基础设施。问具体领域我可以细说。${form}。`;
  }
  if (locale === "ja") {
    return `多くの本番プロジェクトに携わりました — Web、モバイル、バックエンド、インフラです。領域を指定してもらえれば詳しく話せます。${form}。`;
  }
  return `I've worked on many production projects — web, mobile, backend, and infrastructure. Ask about a specific area and I'll go deeper. ${form}.`;
}

function curatedStartReply(locale: Locale, contact: string): string {
  const form = contactFormPhrase(locale, contact);
  if (locale === "tr") {
    return `Kısa bir hedef veya proje özeti yazarsanız kapsam ve yaklaşımı birlikte netleştiririz. ${form}.`;
  }
  if (locale === "de") {
    return `Schicken Sie ein kurzes Ziel oder eine Projektübersicht — dann klären wir Umfang und Ansatz gemeinsam. ${form}.`;
  }
  if (locale === "fr") {
    return `Envoyez un objectif court ou un résumé de projet — nous clarifions le périmètre et l'approche ensemble. ${form}.`;
  }
  if (locale === "it") {
    return `Invia un obiettivo breve o un riepilogo del progetto — definiamo insieme ambito e approccio. ${form}.`;
  }
  if (locale === "zh") {
    return `发一个简短目标或项目摘要，我们一起确定范围和方案。${form}。`;
  }
  if (locale === "ja") {
    return `短い目標やプロジェクト概要を送ってください。範囲と進め方を一緒に決めます。${form}。`;
  }
  return `Share a short goal or project summary and we'll align on scope and approach together. ${form}.`;
}

function strengthIntro(locale: Locale, kind: "web" | "mobile" | "seo" | "geo" | "hire" | "region" | "general"): string {
  const tr: Record<typeof kind, string> = {
    web: "Web tarafında Next.js/React'ten API ve deploy'a kadar uçtan uca çalışıyorum; karmaşık ürünleri production'da ayakta kalacak mimariyle ele alıyorum.",
    mobile: "Mobil işlerde iOS/Android, backend, performans ve release süreçlerini birlikte yürütüyorum; prototipten mağazaya kadar sahipleniyorum.",
    seo: "Teknik SEO'da yapı, hız, schema ve içerik bütünlüğünü mühendislik disipliniyle birleştiriyorum — sıralama vaadi değil, sürdürülebilir görünürlük hedefliyorum.",
    geo: "GEO için llms.txt, yapılandırılmış veri ve doğru kaynak metinlerini birlikte düzenliyorum; uydurma metrik veya garanti vermiyorum.",
    hire: "Tam zamanlı, yarı zamanlı ve proje bazlı çalışabilirim; karmaşık sistemleri uçtan uca teslim ettim.",
    region: "Dağıtık ekiplerle production odaklı teslimat; brief iletişim formu üzerinden alınır.",
    general:
      "Mimari, backend, altyapı, yapay zekâ ürünleri ve otomasyonu tek çizgide birleştiriyorum; birçok production projesinde yer aldım.",
  };
  const en: Record<typeof kind, string> = {
    web: "I handle web work end to end — from Next.js/React through APIs, infra, and production ops — with the architecture discipline complex products require.",
    mobile: "I pair mobile delivery with backend, performance, and release rigor — not UI-only prototypes.",
    seo: "I combine structure, speed, schema, and content integrity for technical SEO — sustainable visibility, not ranking promises.",
    geo: "I focus on llms.txt, citable truth, and structured data so AI search represents you accurately — no invented metrics.",
    hire: "I'm open to full-time, part-time, and project-based work — I've shipped hard systems end to end.",
    region: "Distributed teams, production-first delivery — start with the contact form.",
    general:
      "I treat architecture, backend, infra, AI products, and automation as one thread — many production projects shipped.",
  };
  return (locale === "tr" ? tr : en)[kind];
}

export function localAssistantReply(locale: Locale, userText: string): string {
  const t = userText.toLowerCase();
  const contact = CONTACT_PAGE_URL;
  const form = contactFormPhrase(locale, contact);

  const wantsContact =
    /contact|email|reach|iletişim|mail|anfrage|contacter|contatt|联系|連絡/.test(t);
  const wantsSeo = /\bseo\b|search engine|google rank|arama motor/.test(t);
  const wantsMobile = /mobile|ios|android|mobil|app store/.test(t);
  const wantsWeb = /web|website|next\.?js|react|frontend/.test(t);
  const wantsHire =
    /hire|full.?time|part.?time|project.?based|proje.?baz|işe al|işe alabilir|çalış|projeye|engag|embauch|nas[ıi]l.*(al|hire)|nasıl başl|how.*start/.test(t);

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
      return `Web ve mobil tarafında mimari, backend, altyapı ve release süreçlerini uçtan uca ele alıyorum. Tam zamanlı, yarı zamanlı ve proje bazlı çalışabilirim. ${form}.`;
    }
    if (wantsHire || wantsContact) {
      return `Kapsam, iş modeli ve takvim netleşince teknik yaklaşımı birlikte belirleriz. ${form}.`;
    }
    if (wantsWeb) {
      return `${strengthIntro(locale, "web")} ${form}.`;
    }
    if (wantsMobile) {
      return `${strengthIntro(locale, "mobile")} ${form}.`;
    }
    if (wantsSeo) {
      return `${strengthIntro(locale, "seo")} ${form}.`;
    }
    return `${strengthIntro(locale, "general")} Net bir soru veya kısa brief için ${form}.`;
  }

  if (wantsHire && (wantsWeb || wantsMobile)) {
    return `I handle web and mobile end-to-end: architecture, backend, infrastructure, and release processes. Full-time, part-time, and project-based work. ${form}.`;
  }
  if (wantsHire || wantsContact) {
    return `Once we align on scope, model, and timeline, we set the technical approach together. ${form}.`;
  }
  if (wantsWeb) return `${strengthIntro(locale, "web")} ${form}.`;
  if (wantsMobile) return `${strengthIntro(locale, "mobile")} ${form}.`;
  if (wantsSeo) return `${strengthIntro(locale, "seo")} ${form}.`;
  return `${strengthIntro(locale, "general")} ${form}.`;
}

export function getAssistantApiUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SITE_ASSISTANT_API_URL?.trim();
  return url || undefined;
}
