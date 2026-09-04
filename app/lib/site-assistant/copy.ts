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
  title: "Berktug AI",
  subtitle: "Ask about hiring, services, regions, SEO, GEO, and how to start a project.",
  placeholder: "How can I help?",
  send: "Send",
  thinking: "Berktug AI is thinking",
  openChat: "Chat with Berktug AI",
  closeChat: "Close chat",
  voiceInput: "Voice input",
  error: "Something went wrong. Email contact@berktugberke.com or try again.",
  offlineNote: "Live AI runs on Cloudflare Workers AI when configured; helpful answers still work offline.",
  suggestions: [
    "How can I hire you for a web or mobile app?",
    "Do you work remotely in Türkiye and abroad?",
    "Do you offer SEO and GEO services?",
  ],
};

const tr: SiteAssistantCopy = {
  title: "Berktug AI",
  subtitle: "İş birliği, hizmetler, bölgeler, SEO, GEO ve proje başlangıcı hakkında sorun.",
  placeholder: "Nasıl yardımcı olabilirim?",
  send: "Gönder",
  thinking: "Berktug AI düşünüyor",
  openChat: "Berktug AI ile sohbet",
  closeChat: "Sohbeti kapat",
  voiceInput: "Sesle yaz",
  error: "Bir sorun oluştu. contact@berktugberke.com yazın veya tekrar deneyin.",
  offlineNote: "Canlı AI, Cloudflare Workers AI yapılandırıldığında çalışır; yine de yardımcı yanıtlar verilir.",
  suggestions: [
    "Web veya mobil için nasıl işe alınır?",
    "Türkiye ve yurtdışında uzaktan çalışılıyor mu?",
    "SEO ve GEO hizmeti veriyor musunuz?",
  ],
};

const de: SiteAssistantCopy = {
  ...en,
  subtitle: "Fragen zu Hiring, Services, Regionen, SEO, GEO und Projektstart.",
  placeholder: "Wie kann ich helfen?",
  thinking: "Berktug AI denkt nach",
  openChat: "Mit Berktug AI chatten",
  closeChat: "Chat schließen",
  offlineNote: "Live-KI mit Cloudflare Workers AI wenn konfiguriert; hilfreiche Antworten auch offline.",
  suggestions: [
    "Wie engagiere ich Sie für Web oder Mobile?",
    "Arbeiten Sie remote in der Türkei und im Ausland?",
    "Bieten Sie SEO- und GEO-Leistungen an?",
  ],
};

const fr: SiteAssistantCopy = {
  ...en,
  subtitle: "Questions sur l'embauche, les services, les régions, SEO, GEO et démarrage de projet.",
  placeholder: "Comment puis-je vous aider ?",
  thinking: "Berktug AI réfléchit",
  openChat: "Discuter avec Berktug AI",
  closeChat: "Fermer le chat",
  suggestions: [
    "Comment vous engager pour web ou mobile ?",
    "Travaillez-vous à distance en Turquie et à l’étranger ?",
    "Proposez-vous des services SEO et GEO ?",
  ],
};

const it: SiteAssistantCopy = {
  ...en,
  subtitle: "Domande su hiring, servizi, regioni, SEO, GEO e avvio progetto.",
  placeholder: "Come posso aiutarti?",
  thinking: "Berktug AI sta pensando",
  openChat: "Chatta con Berktug AI",
  closeChat: "Chiudi chat",
  suggestions: [
    "Come assumerti per web o mobile?",
    "Lavori da remoto in Turchia e all’estero?",
    "Offri servizi SEO e GEO?",
  ],
};

const zh: SiteAssistantCopy = {
  ...en,
  title: "Berktug AI",
  subtitle: "咨询合作、服务、地区、SEO、GEO 与如何启动项目。",
  placeholder: "有什么可以帮您？",
  thinking: "Berktug AI 正在思考",
  openChat: "与 Berktug AI 对话",
  closeChat: "关闭对话",
  send: "发送",
  suggestions: [
    "如何聘请您做 Web 或移动应用？",
    "是否在土耳其及海外远程合作？",
    "是否提供 SEO 和 GEO 服务？",
  ],
};

const ja: SiteAssistantCopy = {
  ...en,
  subtitle: "採用、サービス、地域、SEO、GEO、プロジェクト開始について質問できます。",
  placeholder: "どのようなご用件でしょうか？",
  thinking: "Berktug AI が考えています",
  openChat: "Berktug AI とチャット",
  closeChat: "チャットを閉じる",
  send: "送信",
  suggestions: [
    "Web やモバイルでどう依頼できますか？",
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
