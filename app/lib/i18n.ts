import { SITE_URL, absoluteUrl } from "./seo";

export const LOCALES = ["en", "tr", "de", "fr", "it", "zh", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const PREFERRED_LOCALE_KEY = "preferred-locale";

export const localeMeta: Record<
  Locale,
  {
    path: string;
    htmlLang: string;
    hreflang: string;
    ogLocale: string;
    nativeName: string;
    dir: "ltr" | "rtl";
  }
> = {
  en: { path: "/", htmlLang: "en", hreflang: "en", ogLocale: "en_US", nativeName: "English", dir: "ltr" },
  tr: { path: "/tr", htmlLang: "tr", hreflang: "tr", ogLocale: "tr_TR", nativeName: "Türkçe", dir: "ltr" },
  de: { path: "/de", htmlLang: "de", hreflang: "de", ogLocale: "de_DE", nativeName: "Deutsch", dir: "ltr" },
  fr: { path: "/fr", htmlLang: "fr", hreflang: "fr", ogLocale: "fr_FR", nativeName: "Français", dir: "ltr" },
  it: { path: "/it", htmlLang: "it", hreflang: "it", ogLocale: "it_IT", nativeName: "Italiano", dir: "ltr" },
  zh: { path: "/zh", htmlLang: "zh-Hans", hreflang: "zh-Hans", ogLocale: "zh_CN", nativeName: "中文", dir: "ltr" },
  ja: { path: "/ja", htmlLang: "ja", hreflang: "ja", ogLocale: "ja_JP", nativeName: "日本語", dir: "ltr" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localePath(locale: Locale) {
  return localeMeta[locale].path;
}

export function localeUrl(locale: Locale) {
  return absoluteUrl(localePath(locale));
}

export function hreflangLanguages() {
  const languages: Record<string, string> = { "x-default": SITE_URL };
  for (const locale of LOCALES) {
    languages[localeMeta[locale].hreflang] = localeUrl(locale);
  }
  return languages;
}

/** Match Accept-Language / navigator.languages tags to a supported locale. */
export function matchLocale(tags: readonly string[]): Locale {
  for (const raw of tags) {
    const tag = raw.trim().toLowerCase();
    if (!tag) continue;
    if (tag.startsWith("zh")) return "zh";
    const base = tag.split("-")[0] ?? tag;
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export type HomeDictionary = {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  headerName: string;
  headerRole: string;
  headerAriaLabel: string;
  headerImageAlt: string;
  h1: string;
  products: string;
  productsAria: string;
  experience: string;
  education: string;
  contact: string;
  contactBody: string;
  emailMe: string;
  emailAria: string;
  socialNav: string;
  latestBlog: string;
  viewAll: string;
  coFounder: string;
  coFounderAria: string;
  figturesLine: string;
  figturesPeriod: string;
  figturesLogoAlt: string;
  engineer: string;
  engineerAria: string;
  bradiLine: string;
  bradiPeriod: string;
  bradiLogoAlt: string;
  degree: string;
  university: string;
  universityLogoAlt: string;
  educationPeriod: string;
  projectSummaries: Record<string, string>;
  github: {
    title: string;
    currentStreak: string;
    longestStreak: string;
    noContributions: string;
    contribution: (count: number) => string;
  };
  carousel: {
    view: (title: string) => string;
    show: (title: string) => string;
    select: string;
  };
};

const en: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — Software Engineer and Product Builder",
  metaDescription:
    "Software engineer and product builder designing scalable software products, complex digital systems, infrastructure, AI-powered systems, automation, and production-ready end-to-end products.",
  intro:
    "Based in Marmaris, Muğla, Türkiye, Berktuğ Berke Ates is a software engineer and product builder who designs and builds scalable software products and complex digital systems. His work covers software architecture, backend engineering, infrastructure, AI-powered systems, automation, and end-to-end product development, from technical design to production deployment.",
  headerName: "Berktug Berke Ates",
  headerRole: "Software Engineer",
  headerAriaLabel: "Berktug Berke Ates home",
  headerImageAlt: "Berktug Berke Ates",
  h1: "Berktug Berke Ates — Software Engineer and Product Builder",
  products: "Products",
  productsAria: "Selected projects",
  experience: "Work Experience",
  education: "Education",
  contact: "Get in Touch",
  contactBody:
    "Have a project in mind or simply want to connect? I'm always open to thoughtful conversations and meaningful collaborations.",
  emailMe: "Email me",
  emailAria: "Email Berktug Berke Ates",
  socialNav: "Social profiles",
  latestBlog: "Latest Blog",
  viewAll: "View all",
  coFounder: "Co-Founder",
  coFounderAria: "Co-Founder at Figtures",
  figturesLine: "Figtures · Istanbul",
  figturesPeriod: "Mar 2026 – Present",
  figturesLogoAlt: "Figtures logo",
  engineer: "Full-stack Software Engineer",
  engineerAria: "Full-stack Software Engineer at bradi.tech",
  bradiLine: "bradi.tech · London",
  bradiPeriod: "Nov 2024 – Present",
  bradiLogoAlt: "bradi.tech logo",
  degree: "B.Sc. Software Engineering",
  university: "Fırat University",
  universityLogoAlt: "Fırat University logo",
  educationPeriod: "2020 – 2025",
  projectSummaries: {},
  github: {
    title: "GitHub Activity",
    currentStreak: "Current Streak",
    longestStreak: "Longest Streak",
    noContributions: "No contributions",
    contribution: (count) => `${count} contribution${count === 1 ? "" : "s"}`,
  },
  carousel: {
    view: (title) => `View ${title} project`,
    show: (title) => `Show ${title}`,
    select: "Select project",
  },
};

const tr: HomeDictionary = {
  metaTitle: "Berktuğ Berke Ateş — Yazılım Mühendisi ve Ürün Geliştirici",
  metaDescription:
    "Yazılım mühendisi ve ürün geliştirici Berktuğ Berke Ateş; ölçeklenebilir yazılım ürünleri, karmaşık dijital sistemler, altyapı, yapay zekâ sistemleri, otomasyon ve uçtan uca üretim odaklı ürünler tasarlıyor.",
  intro:
    "Marmaris, Muğla merkezli yazılım mühendisi ve ürün geliştirici Berktuğ Berke Ateş; ölçeklenebilir yazılım ürünleri ve karmaşık dijital sistemler tasarlayıp geliştiriyor. Çalışmaları yazılım mimarisi, backend mühendisliği, altyapı, yapay zekâ sistemleri, otomasyon ve teknik tasarımdan üretim ortamına kadar uçtan uca ürün geliştirmeyi kapsıyor.",
  headerName: "Berktuğ Berke Ateş",
  headerRole: "Yazılım Mühendisi",
  headerAriaLabel: "Berktuğ Berke Ateş ana sayfa",
  headerImageAlt: "Berktuğ Berke Ateş",
  h1: "Berktuğ Berke Ateş — Yazılım Mühendisi ve Ürün Geliştirici",
  products: "Ürünler",
  productsAria: "Seçili ürünler",
  experience: "İş Deneyimi",
  education: "Eğitim",
  contact: "İletişim",
  contactBody:
    "Bir projeniz mi var, yoksa sadece bağlantı kurmak mı istiyorsunuz? Anlamlı sohbetlere ve iş birliklerine her zaman açığım.",
  emailMe: "E-posta gönder",
  emailAria: "Berktuğ Berke Ateş'e e-posta gönder",
  socialNav: "Sosyal profiller",
  latestBlog: "Son Yazı",
  viewAll: "Tümünü gör",
  coFounder: "Kurucu Ortak",
  coFounderAria: "Figtures Kurucu Ortağı",
  figturesLine: "Figtures · İstanbul",
  figturesPeriod: "Mar 2026 – Günümüz",
  figturesLogoAlt: "Figtures logosu",
  engineer: "Full-stack Yazılım Mühendisi",
  engineerAria: "bradi.tech Full-stack Yazılım Mühendisi",
  bradiLine: "bradi.tech · Londra",
  bradiPeriod: "Kas 2024 – Günümüz",
  bradiLogoAlt: "bradi.tech logosu",
  degree: "Yazılım Mühendisliği Lisans",
  university: "Fırat Üniversitesi",
  universityLogoAlt: "Fırat Üniversitesi logosu",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "Kişisel astroloji, günlük farkındalık ve yapay zekâ destekli spiritüel keşif.",
    "medula-eczane": "Web ve mobil istemcileri kapsayan çok kiracılı eczane ERP sistemi.",
    strumai: "Gerçek zamanlı ses analizi ve yapay zekâ mentoruna sahip gitar çalışma sistemi.",
  },
  github: {
    title: "GitHub Aktivitesi",
    currentStreak: "Güncel Seri",
    longestStreak: "En Uzun Seri",
    noContributions: "Katkı yok",
    contribution: (count) => `${count} katkı`,
  },
  carousel: {
    view: (title) => `${title} projesini incele`,
    show: (title) => `${title} ürününü göster`,
    select: "Ürün seç",
  },
};

const de: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — Software Engineer und Product Builder",
  metaDescription:
    "Software Engineer und Product Builder für skalierbare Softwareprodukte, komplexe digitale Systeme, Infrastruktur, KI-Systeme, Automatisierung und produktionsreife End-to-End-Produkte.",
  intro:
    "Berktuğ Berke Ates ist ein in Marmaris, Muğla, Türkiye ansässiger Software Engineer und Product Builder. Er entwirft und entwickelt skalierbare Softwareprodukte und komplexe digitale Systeme — von Softwarearchitektur und Backend über Infrastruktur und KI-Systeme bis zu Automatisierung und End-to-End-Produktentwicklung von der technischen Planung bis zum Produktionsbetrieb.",
  headerName: "Berktug Berke Ates",
  headerRole: "Software Engineer",
  headerAriaLabel: "Berktug Berke Ates Startseite",
  headerImageAlt: "Berktug Berke Ates",
  h1: "Berktug Berke Ates — Software Engineer und Product Builder",
  products: "Produkte",
  productsAria: "Ausgewählte Projekte",
  experience: "Berufserfahrung",
  education: "Ausbildung",
  contact: "Kontakt",
  contactBody:
    "Haben Sie ein Projekt im Sinn oder möchten Sie einfach in Kontakt treten? Ich bin stets offen für durchdachte Gespräche und sinnvolle Zusammenarbeit.",
  emailMe: "E-Mail schreiben",
  emailAria: "Berktug Berke Ates per E-Mail kontaktieren",
  socialNav: "Soziale Profile",
  latestBlog: "Neuester Beitrag",
  viewAll: "Alle anzeigen",
  coFounder: "Mitgründer",
  coFounderAria: "Mitgründer bei Figtures",
  figturesLine: "Figtures · Istanbul",
  figturesPeriod: "Mär 2026 – heute",
  figturesLogoAlt: "Figtures-Logo",
  engineer: "Full-stack Software Engineer",
  engineerAria: "Full-stack Software Engineer bei bradi.tech",
  bradiLine: "bradi.tech · London",
  bradiPeriod: "Nov 2024 – heute",
  bradiLogoAlt: "bradi.tech-Logo",
  degree: "B.Sc. Software Engineering",
  university: "Fırat-Universität",
  universityLogoAlt: "Logo der Fırat-Universität",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "Persönliche Astrologie, tägliche Reflexion und KI-gestützte spirituelle Exploration.",
    "medula-eczane": "Multi-Tenant-Apotheken-ERP für Web- und mobile Clients.",
    strumai: "Gitarren-Übungssystem mit Echtzeit-Audioanalyse und KI-Mentor.",
  },
  github: {
    title: "GitHub-Aktivität",
    currentStreak: "Aktuelle Serie",
    longestStreak: "Längste Serie",
    noContributions: "Keine Beiträge",
    contribution: (count) => `${count} Beitrag${count === 1 ? "" : "e"}`,
  },
  carousel: {
    view: (title) => `Projekt ${title} ansehen`,
    show: (title) => `${title} anzeigen`,
    select: "Projekt auswählen",
  },
};

const fr: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — Ingénieur logiciel et Product Builder",
  metaDescription:
    "Ingénieur logiciel et product builder concevant des produits logiciels évolutifs, des systèmes numériques complexes, des infrastructures, des systèmes d’IA, de l’automatisation et des produits de bout en bout prêts pour la production.",
  intro:
    "Basé à Marmaris, Muğla, Türkiye, Berktuğ Berke Ates est un ingénieur logiciel et product builder qui conçoit et construit des produits logiciels évolutifs et des systèmes numériques complexes. Son travail couvre l’architecture logicielle, le backend, l’infrastructure, les systèmes d’IA, l’automatisation et le développement produit de bout en bout, de la conception technique au déploiement en production.",
  headerName: "Berktug Berke Ates",
  headerRole: "Ingénieur logiciel",
  headerAriaLabel: "Accueil Berktug Berke Ates",
  headerImageAlt: "Berktug Berke Ates",
  h1: "Berktug Berke Ates — Ingénieur logiciel et Product Builder",
  products: "Produits",
  productsAria: "Projets sélectionnés",
  experience: "Expérience professionnelle",
  education: "Formation",
  contact: "Contact",
  contactBody:
    "Vous avez un projet en tête ou souhaitez simplement échanger ? Je suis toujours ouvert à des conversations réfléchies et à des collaborations porteuses de sens.",
  emailMe: "M’écrire",
  emailAria: "Envoyer un e-mail à Berktug Berke Ates",
  socialNav: "Profils sociaux",
  latestBlog: "Dernier article",
  viewAll: "Tout voir",
  coFounder: "Co-fondateur",
  coFounderAria: "Co-fondateur chez Figtures",
  figturesLine: "Figtures · Istanbul",
  figturesPeriod: "mars 2026 – aujourd’hui",
  figturesLogoAlt: "Logo Figtures",
  engineer: "Ingénieur logiciel full-stack",
  engineerAria: "Ingénieur logiciel full-stack chez bradi.tech",
  bradiLine: "bradi.tech · Londres",
  bradiPeriod: "nov. 2024 – aujourd’hui",
  bradiLogoAlt: "Logo bradi.tech",
  degree: "Licence en génie logiciel",
  university: "Université Fırat",
  universityLogoAlt: "Logo de l’Université Fırat",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "Astrologie personnelle, réflexion quotidienne et exploration spirituelle assistée par l’IA.",
    "medula-eczane": "ERP multi-locataire pour pharmacies, web et mobile.",
    strumai: "Système de pratique de guitare avec analyse audio en temps réel et mentor IA.",
  },
  github: {
    title: "Activité GitHub",
    currentStreak: "Série actuelle",
    longestStreak: "Plus longue série",
    noContributions: "Aucune contribution",
    contribution: (count) => `${count} contribution${count === 1 ? "" : "s"}`,
  },
  carousel: {
    view: (title) => `Voir le projet ${title}`,
    show: (title) => `Afficher ${title}`,
    select: "Sélectionner un projet",
  },
};

const it: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — Software Engineer e Product Builder",
  metaDescription:
    "Software engineer e product builder che progetta prodotti software scalabili, sistemi digitali complessi, infrastrutture, sistemi di IA, automazione e prodotti end-to-end pronti per la produzione.",
  intro:
    "Con base a Marmaris, Muğla, Türkiye, Berktuğ Berke Ates è un software engineer e product builder che progetta e costruisce prodotti software scalabili e sistemi digitali complessi. Il suo lavoro include architettura software, backend, infrastruttura, sistemi di IA, automazione e sviluppo prodotto end-to-end, dalla progettazione tecnica al rilascio in produzione.",
  headerName: "Berktug Berke Ates",
  headerRole: "Software Engineer",
  headerAriaLabel: "Home di Berktug Berke Ates",
  headerImageAlt: "Berktug Berke Ates",
  h1: "Berktug Berke Ates — Software Engineer e Product Builder",
  products: "Prodotti",
  productsAria: "Progetti selezionati",
  experience: "Esperienza lavorativa",
  education: "Formazione",
  contact: "Contatti",
  contactBody:
    "Hai un progetto in mente o vuoi semplicemente entrare in contatto? Sono sempre aperto a conversazioni ponderate e collaborazioni significative.",
  emailMe: "Scrivimi",
  emailAria: "Invia un’email a Berktug Berke Ates",
  socialNav: "Profili social",
  latestBlog: "Ultimo articolo",
  viewAll: "Vedi tutti",
  coFounder: "Co-fondatore",
  coFounderAria: "Co-fondatore di Figtures",
  figturesLine: "Figtures · Istanbul",
  figturesPeriod: "mar 2026 – presente",
  figturesLogoAlt: "Logo Figtures",
  engineer: "Software Engineer full-stack",
  engineerAria: "Software Engineer full-stack presso bradi.tech",
  bradiLine: "bradi.tech · Londra",
  bradiPeriod: "nov 2024 – presente",
  bradiLogoAlt: "Logo bradi.tech",
  degree: "Laurea in Ingegneria del Software",
  university: "Università Fırat",
  universityLogoAlt: "Logo dell’Università Fırat",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "Astrologia personale, riflessione quotidiana ed esplorazione spirituale con IA.",
    "medula-eczane": "ERP multi-tenant per farmacie su web e mobile.",
    strumai: "Sistema di pratica per chitarra con analisi audio in tempo reale e mentor IA.",
  },
  github: {
    title: "Attività GitHub",
    currentStreak: "Serie attuale",
    longestStreak: "Serie più lunga",
    noContributions: "Nessun contributo",
    contribution: (count) => `${count} contribut${count === 1 ? "o" : "i"}`,
  },
  carousel: {
    view: (title) => `Vedi il progetto ${title}`,
    show: (title) => `Mostra ${title}`,
    select: "Seleziona progetto",
  },
};

const zh: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — 软件工程师与产品构建者",
  metaDescription:
    "软件工程师与产品构建者，专注可扩展软件产品、复杂数字系统、基础设施、人工智能系统、自动化以及可上线的端到端产品。",
  intro:
    "Berktuğ Berke Ates 常驻土耳其穆拉省马尔马里斯，是一名软件工程师与产品构建者，负责设计并打造可扩展的软件产品与复杂数字系统。他的工作涵盖软件架构、后端工程、基础设施、人工智能系统、自动化，以及从技术方案到生产部署的端到端产品开发。",
  headerName: "Berktug Berke Ates",
  headerRole: "软件工程师",
  headerAriaLabel: "Berktug Berke Ates 首页",
  headerImageAlt: "Berktug Berke Ates",
  h1: "Berktug Berke Ates — 软件工程师与产品构建者",
  products: "产品",
  productsAria: "精选项目",
  experience: "工作经历",
  education: "教育背景",
  contact: "联系我",
  contactBody: "有项目想法，或只是想建立联系？我始终乐于进行有深度的交流与有意义的合作。",
  emailMe: "发送邮件",
  emailAria: "给 Berktug Berke Ates 发邮件",
  socialNav: "社交档案",
  latestBlog: "最新文章",
  viewAll: "查看全部",
  coFounder: "联合创始人",
  coFounderAria: "Figtures 联合创始人",
  figturesLine: "Figtures · 伊斯坦布尔",
  figturesPeriod: "2026年3月 – 至今",
  figturesLogoAlt: "Figtures 标志",
  engineer: "全栈软件工程师",
  engineerAria: "bradi.tech 全栈软件工程师",
  bradiLine: "bradi.tech · 伦敦",
  bradiPeriod: "2024年11月 – 至今",
  bradiLogoAlt: "bradi.tech 标志",
  degree: "软件工程学士",
  university: "菲拉特大学",
  universityLogoAlt: "菲拉特大学标志",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "个人占星、日常反思与人工智能辅助的灵性探索。",
    "medula-eczane": "覆盖 Web 与移动端的多租户药店 ERP 系统。",
    strumai: "具备实时音频分析与 AI 导师的吉他练习系统。",
  },
  github: {
    title: "GitHub 动态",
    currentStreak: "当前连续",
    longestStreak: "最长连续",
    noContributions: "暂无贡献",
    contribution: (count) => `${count} 次贡献`,
  },
  carousel: {
    view: (title) => `查看 ${title} 项目`,
    show: (title) => `显示 ${title}`,
    select: "选择项目",
  },
};

const ja: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — ソフトウェアエンジニア / プロダクトビルダー",
  metaDescription:
    "スケーラブルなソフトウェア製品、複雑なデジタルシステム、インフラ、AIシステム、自動化、本番対応のエンドツーエンド製品を設計するソフトウェアエンジニア兼プロダクトビルダー。",
  intro:
    "トルコ・ムーラ県マルマリスを拠点とする Berktuğ Berke Ates は、スケーラブルなソフトウェア製品と複雑なデジタルシステムを設計・構築するソフトウェアエンジニア兼プロダクトビルダーです。ソフトウェアアーキテクチャ、バックエンド、インフラ、AIシステム、自動化、そして技術設計から本番デプロイまでのエンドツーエンドな製品開発を手がけています。",
  headerName: "Berktug Berke Ates",
  headerRole: "ソフトウェアエンジニア",
  headerAriaLabel: "Berktug Berke Ates ホーム",
  headerImageAlt: "Berktug Berke Ates",
  h1: "Berktug Berke Ates — ソフトウェアエンジニア / プロダクトビルダー",
  products: "プロダクト",
  productsAria: "注目プロジェクト",
  experience: "職歴",
  education: "学歴",
  contact: "お問い合わせ",
  contactBody:
    "プロジェクトのご相談でも、まずはつながることでも歓迎です。丁寧な対話と、意味のある協業にいつでも開いています。",
  emailMe: "メールする",
  emailAria: "Berktug Berke Ates にメール",
  socialNav: "ソーシャルプロフィール",
  latestBlog: "最新記事",
  viewAll: "すべて見る",
  coFounder: "共同創業者",
  coFounderAria: "Figtures 共同創業者",
  figturesLine: "Figtures · イスタンブール",
  figturesPeriod: "2026年3月 – 現在",
  figturesLogoAlt: "Figtures ロゴ",
  engineer: "フルスタックソフトウェアエンジニア",
  engineerAria: "bradi.tech フルスタックソフトウェアエンジニア",
  bradiLine: "bradi.tech · ロンドン",
  bradiPeriod: "2024年11月 – 現在",
  bradiLogoAlt: "bradi.tech ロゴ",
  degree: "ソフトウェア工学学士",
  university: "フィラト大学",
  universityLogoAlt: "フィラト大学ロゴ",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "パーソナル占星術、日々の振り返り、AI支援のスピリチュアル探索。",
    "medula-eczane": "Web / モバイル対応のマルチテナント薬局ERP。",
    strumai: "リアルタイム音声分析とAIメンターを備えたギター練習システム。",
  },
  github: {
    title: "GitHub アクティビティ",
    currentStreak: "現在の連続",
    longestStreak: "最長連続",
    noContributions: "コントリビューションなし",
    contribution: (count) => `${count} 件のコントリビューション`,
  },
  carousel: {
    view: (title) => `${title} プロジェクトを見る`,
    show: (title) => `${title} を表示`,
    select: "プロジェクトを選択",
  },
};

export const dictionaries: Record<Locale, HomeDictionary> = { en, tr, de, fr, it, zh, ja };

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

/** Inline head script for static hosts: honor preference, else device language, else English. */
export const LOCALE_REDIRECT_SCRIPT = `(function(){try{var path=location.pathname.replace(/\\/$/,'')||'/';if(path!=='/')return;var KEY=${JSON.stringify(PREFERRED_LOCALE_KEY)};var supported={en:1,tr:1,de:1,fr:1,it:1,zh:1,ja:1};function match(tag){tag=String(tag||'').toLowerCase();if(!tag)return null;if(tag.indexOf('zh')===0)return'zh';var base=tag.split('-')[0];return supported[base]?base:null}var pref=localStorage.getItem(KEY);if(pref&&supported[pref]){if(pref!=='en')location.replace('/'+pref+location.search+location.hash);return}var list=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];for(var i=0;i<list.length;i++){var m=match(list[i]);if(m&&m!=='en'){localStorage.setItem(KEY,m);location.replace('/'+m+location.search+location.hash);return}if(m==='en')break}localStorage.setItem(KEY,'en')}catch(e){}})();`;
