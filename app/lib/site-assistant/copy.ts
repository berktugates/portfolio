import type { Locale } from "../i18n";

export type SiteAssistantCopy = {
  title: string;
  subtitle: string;
  placeholder: string;
  send: string;
  thinking: string;
  openChat: string;
  closeChat: string;
  voiceInput: string;
  error: string;
  offlineNote: string;
  suggestions: string[];
};

const en: SiteAssistantCopy = {
  title: "Assistant",
  subtitle: "Ask about hiring, services, SEO, GEO, and how to start a project.",
  placeholder: "How can I help?",
  send: "Send",
  thinking: "Thinking…",
  openChat: "Open assistant",
  closeChat: "Close",
  voiceInput: "Voice input",
  error: "Something went wrong. Try again or use the contact form at berktugberke.com/contact.",
  offlineNote: "Live AI runs on Cloudflare Workers AI when configured; helpful answers still work offline.",
  suggestions: [
    "How do we start a web or mobile project?",
    "Are you open to full-time, part-time, or project-based work?",
    "Do you offer SEO and GEO services?",
  ],
};

const tr: SiteAssistantCopy = {
  title: "Asistan",
  subtitle: "İş birliği, hizmetler, SEO, GEO ve proje başlangıcı hakkında sorun.",
  placeholder: "Nasıl yardımcı olabilirim?",
  send: "Gönder",
  thinking: "Düşünüyor…",
  openChat: "Asistanı aç",
  closeChat: "Kapat",
  voiceInput: "Sesle yaz",
  error: "Bir sorun oluştu. Tekrar deneyin veya berktugberke.com/contact formunu kullanın.",
  offlineNote: "Canlı AI, Cloudflare Workers AI yapılandırıldığında çalışır; yine de yardımcı yanıtlar verilir.",
  suggestions: [
    "Web veya mobil projeme nasıl başlarız?",
    "Tam zamanlı, yarı zamanlı veya proje bazlı çalışıyor musunuz?",
    "SEO ve GEO hizmeti veriyor musunuz?",
  ],
};

const de: SiteAssistantCopy = {
  ...en,
  title: "Assistent",
  subtitle: "Fragen zu Hiring, Services, SEO, GEO und Projektstart.",
  placeholder: "Wie kann ich helfen?",
  thinking: "Denkt nach…",
  openChat: "Assistent öffnen",
  closeChat: "Schließen",
  offlineNote: "Live-KI mit Cloudflare Workers AI wenn konfiguriert; hilfreiche Antworten auch offline.",
  suggestions: [
    "Wie starten wir ein Web- oder Mobilprojekt?",
    "Sind Vollzeit, Teilzeit oder projektbasierte Zusammenarbeit möglich?",
    "Bieten Sie SEO- und GEO-Leistungen an?",
  ],
};

const fr: SiteAssistantCopy = {
  ...en,
  title: "Assistant",
  subtitle: "Questions sur l'embauche, les services, SEO, GEO et démarrage de projet.",
  placeholder: "Comment puis-je vous aider ?",
  thinking: "Réfléchit…",
  openChat: "Ouvrir l'assistant",
  closeChat: "Fermer",
  suggestions: [
    "Comment démarrer un projet web ou mobile ?",
    "Proposez-vous temps plein, temps partiel ou missions par projet ?",
    "Proposez-vous des services SEO et GEO ?",
  ],
};

const it: SiteAssistantCopy = {
  ...en,
  title: "Assistente",
  subtitle: "Domande su hiring, servizi, SEO, GEO e avvio progetto.",
  placeholder: "Come posso aiutarti?",
  thinking: "Sta pensando…",
  openChat: "Apri assistente",
  closeChat: "Chiudi",
  suggestions: [
    "Come iniziamo un progetto web o mobile?",
    "Accetti full-time, part-time o lavoro per progetto?",
    "Offri servizi SEO e GEO?",
  ],
};

const zh: SiteAssistantCopy = {
  ...en,
  title: "助手",
  subtitle: "咨询合作、服务、SEO、GEO 与如何启动项目。",
  placeholder: "有什么可以帮您？",
  thinking: "思考中…",
  openChat: "打开助手",
  closeChat: "关闭",
  send: "发送",
  suggestions: [
    "Web 或移动项目如何启动？",
    "是否接受全职、兼职或项目制合作？",
    "是否提供 SEO 和 GEO 服务？",
  ],
};

const ja: SiteAssistantCopy = {
  ...en,
  title: "アシスタント",
  subtitle: "採用、サービス、SEO、GEO、プロジェクト開始について質問できます。",
  placeholder: "どのようなご用件でしょうか？",
  thinking: "考え中…",
  openChat: "アシスタントを開く",
  closeChat: "閉じる",
  send: "送信",
  suggestions: [
    "Web やモバイルのプロジェクトはどう始めますか？",
    "フルタイム、パートタイム、プロジェクト単位の協業は可能ですか？",
    "SEO と GEO のサービスはありますか？",
  ],
};

const DOCK_SUGGESTION_COUNT = 3;

const COPY: Record<Locale, SiteAssistantCopy> = {
  en,
  tr,
  de,
  fr,
  it,
  zh,
  ja,
};

export type AssistantSurface = "default" | "gundem";

const gundemTrSuggestions = [
  "Bu gündem maddesi okuyucuyu nasıl etkiler?",
  "Kaynaklar nereden geliyor?",
  "Bu site ajans haberi mi?",
];

const gundemEnSuggestions = [
  "How does this briefing affect everyday readers in Turkey?",
  "Where do the sources come from?",
  "Is this wire news or original analysis?",
];

export function getSiteAssistantCopy(
  locale: Locale,
  surface: AssistantSurface = "default",
): SiteAssistantCopy {
  const copy = COPY[locale] ?? en;
  const suggestions =
    surface === "gundem"
      ? locale === "tr"
        ? gundemTrSuggestions
        : gundemEnSuggestions
      : copy.suggestions;
  return {
    ...copy,
    suggestions: suggestions.slice(0, DOCK_SUGGESTION_COUNT),
  };
}
