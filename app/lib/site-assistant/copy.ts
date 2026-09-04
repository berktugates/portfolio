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
    "Do you work with Istanbul / Marmara teams remotely?",
    "What is GEO and can you improve AI search visibility?",
    "Which end-to-end software services do you offer?",
    "How do I contact you for freelance or full-time work?",
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
    "Web veya mobil uygulama için nasıl işe alabilirim?",
    "İstanbul / Marmara ekipleriyle remote çalışıyor musun?",
    "GEO nedir, yapay zekâ arama görünürlüğüne yardım eder misin?",
    "Hangi uçtan uca yazılım hizmetlerini sunuyorsun?",
    "Freelance veya tam zamanlı için nasıl iletişime geçerim?",
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
    "Wie kann ich Sie für Web- oder Mobile-Apps engagieren?",
    "Arbeiten Sie remote mit Teams in Istanbul / Marmara?",
    "Was ist GEO und können Sie AI-Suchsichtbarkeit verbessern?",
    "Welche End-to-End-Software-Services bieten Sie?",
    "Wie kontaktiere ich Sie für Freelance oder Vollzeit?",
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
    "Comment vous engager pour une app web ou mobile ?",
    "Travaillez-vous à distance avec des équipes à Istanbul / Marmara ?",
    "Qu'est-ce que le GEO et pouvez-vous améliorer la visibilité IA ?",
    "Quels services logiciels end-to-end proposez-vous ?",
    "Comment vous contacter en freelance ou temps plein ?",
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
    "Come posso assumerti per un'app web o mobile?",
    "Lavori in remoto con team a Istanbul / Marmara?",
    "Cos'è il GEO e puoi migliorare la visibilità nelle ricerche IA?",
    "Quali servizi software end-to-end offri?",
    "Come contattarti per freelance o full-time?",
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
    "是否与伊斯坦布尔 / 马尔马拉团队远程合作？",
    "什么是 GEO，能否提升 AI 搜索可见性？",
    "提供哪些端到端软件服务？",
    "如何联系您谈 freelance 或全职？",
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
    "Web やモバイルアプリでどう依頼できますか？",
    "イスタンブール / マルマラのチームとリモートで働きますか？",
    "GEO とは何で、AI 検索の可視性を上げられますか？",
    "どんなエンドツーエンドのソフトウェアサービスがありますか？",
    "フリーランスやフルタイムの連絡方法は？",
  ],
};

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
  return COPY[locale] ?? en;
}
