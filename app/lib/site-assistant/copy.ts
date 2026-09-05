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
  subtitle: "Ask about hiring, services, regions, SEO, GEO, and how to start a project.",
  placeholder: "How can I help?",
  send: "Send",
  thinking: "Thinking…",
  openChat: "Open assistant",
  closeChat: "Close",
  voiceInput: "Voice input",
  error: "Something went wrong. Email contact@berktugberke.com or try again.",
  offlineNote: "Live AI runs on Cloudflare Workers AI when configured; helpful answers still work offline.",
  suggestions: [
    "How do we start a web or mobile project?",
    "Do you work remotely across Türkiye and internationally?",
    "Do you offer SEO and GEO services?",
  ],
};

const tr: SiteAssistantCopy = {
  title: "Asistan",
  subtitle: "İş birliği, hizmetler, bölgeler, SEO, GEO ve proje başlangıcı hakkında sorun.",
  placeholder: "Nasıl yardımcı olabilirim?",
  send: "Gönder",
  thinking: "Düşünüyor…",
  openChat: "Asistanı aç",
  closeChat: "Kapat",
  voiceInput: "Sesle yaz",
  error: "Bir sorun oluştu. contact@berktugberke.com yazın veya tekrar deneyin.",
  offlineNote: "Canlı AI, Cloudflare Workers AI yapılandırıldığında çalışır; yine de yardımcı yanıtlar verilir.",
  suggestions: [
    "Web veya mobil projeme nasıl başlarız?",
    "Türkiye ve yurtdışında uzaktan çalışıyor musunuz?",
    "SEO ve GEO hizmeti veriyor musunuz?",
  ],
};

const de: SiteAssistantCopy = {
  ...en,
  title: "Assistent",
  subtitle: "Fragen zu Hiring, Services, Regionen, SEO, GEO und Projektstart.",
  placeholder: "Wie kann ich helfen?",
  thinking: "Denkt nach…",
  openChat: "Assistent öffnen",
  closeChat: "Schließen",
  offlineNote: "Live-KI mit Cloudflare Workers AI wenn konfiguriert; hilfreiche Antworten auch offline.",
  suggestions: [
    "Wie starten wir ein Web- oder Mobilprojekt?",
    "Arbeiten Sie remote in der Türkei und international?",
    "Bieten Sie SEO- und GEO-Leistungen an?",
  ],
};

const fr: SiteAssistantCopy = {
  ...en,
  title: "Assistant",
  subtitle: "Questions sur l'embauche, les services, les régions, SEO, GEO et démarrage de projet.",
  placeholder: "Comment puis-je vous aider ?",
  thinking: "Réfléchit…",
  openChat: "Ouvrir l'assistant",
  closeChat: "Fermer",
  suggestions: [
    "Comment démarrer un projet web ou mobile ?",
    "Travaillez-vous à distance en Turquie et à l'international ?",
    "Proposez-vous des services SEO et GEO ?",
  ],
};

const it: SiteAssistantCopy = {
  ...en,
  title: "Assistente",
  subtitle: "Domande su hiring, servizi, regioni, SEO, GEO e avvio progetto.",
  placeholder: "Come posso aiutarti?",
  thinking: "Sta pensando…",
  openChat: "Apri assistente",
  closeChat: "Chiudi",
  suggestions: [
    "Come iniziamo un progetto web o mobile?",
    "Lavori da remoto in Turchia e a livello internazionale?",
    "Offri servizi SEO e GEO?",
  ],
};

const zh: SiteAssistantCopy = {
  ...en,
  title: "助手",
  subtitle: "咨询合作、服务、地区、SEO、GEO 与如何启动项目。",
  placeholder: "有什么可以帮您？",
  thinking: "思考中…",
  openChat: "打开助手",
  closeChat: "关闭",
  send: "发送",
  suggestions: [
    "Web 或移动项目如何启动？",
    "是否在土耳其及国际远程合作？",
    "是否提供 SEO 和 GEO 服务？",
  ],
};

const ja: SiteAssistantCopy = {
  ...en,
  title: "アシスタント",
  subtitle: "採用、サービス、地域、SEO、GEO、プロジェクト開始について質問できます。",
  placeholder: "どのようなご用件でしょうか？",
  thinking: "考え中…",
  openChat: "アシスタントを開く",
  closeChat: "閉じる",
  send: "送信",
  suggestions: [
    "Web やモバイルのプロジェクトはどう始めますか？",
    "トルコ国内外でリモート対応できますか？",
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

export function getSiteAssistantCopy(locale: Locale): SiteAssistantCopy {
  const copy = COPY[locale] ?? en;
  return {
    ...copy,
    suggestions: copy.suggestions.slice(0, DOCK_SUGGESTION_COUNT),
  };
}
