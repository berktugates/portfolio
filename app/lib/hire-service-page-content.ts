import type { Locale } from "./i18n";
import {
  hireServicesDe,
  hireServicesEn,
  hireServicesFr,
  hireServicesIt,
  hireServicesJa,
  hireServicesTr,
  hireServicesZh,
} from "./i18n/hire-services-copy";
import type { HireServiceCopy } from "./i18n/types";

import { CONTACT_EMAIL, SITE_URL } from "./seo";
import { SERVICE_OFFERS, type ServiceSlug, isServiceSlug } from "./services";

export type HireServicePageSection = {
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
};

export type HireServicePageFaq = {
  question: string;
  answer: string;
};

export type HireServicePageCopy = {
  slug: ServiceSlug;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  sections: readonly HireServicePageSection[];
  faqs: readonly HireServicePageFaq[];
  regionsHeading: string;
  regionsBody: string;
  howHeading: string;
  howBody: string;
  backToHire: string;
  relatedHeading: string;
};

const LOCALE_SERVICES: Record<Locale, readonly HireServiceCopy[]> = {
  en: hireServicesEn,
  tr: hireServicesTr,
  de: hireServicesDe,
  fr: hireServicesFr,
  it: hireServicesIt,
  zh: hireServicesZh,
  ja: hireServicesJa,
};

const DELIVERABLES: Record<ServiceSlug, { en: string[]; tr: string[] }> = {
  "web-app": {
    en: [
      "Product UI and application flows that match real user jobs",
      "API contracts, auth, and data models ready for production traffic",
      "Deployable architecture with observability and release safety",
    ],
    tr: [
      "Gerçek kullanıcı işlerine uyan ürün arayüzü ve akışlar",
      "Üretim trafiğine hazır API sözleşmeleri, auth ve veri modelleri",
      "Gözlemlenebilirlik ve yayın güvenliği olan deploy edilebilir mimari",
    ],
  },
  "mobile-app": {
    en: [
      "iOS/Android product architecture with store-ready release hygiene",
      "Backend integration, offline/edge cases, and performance budgets",
      "Clear ownership of client ↔ API contracts",
    ],
    tr: [
      "Mağaza hazırlığı olan iOS/Android ürün mimarisi",
      "Backend entegrasyonu, offline/kenar durumlar ve performans bütçeleri",
      "İstemci ↔ API sözleşmelerinde net sahiplik",
    ],
  },
  frontend: {
    en: [
      "Accessible product UI and coherent interaction design",
      "Design-system foundations teams can extend without drift",
      "Frontend performance and maintainable component architecture",
    ],
    tr: [
      "Erişilebilir ürün arayüzü ve tutarlı etkileşim tasarımı",
      "Ekiplerin sapmadan genişletebileceği design-system temeli",
      "Frontend performansı ve sürdürülebilir bileşen mimarisi",
    ],
  },
  backend: {
    en: [
      "APIs and domain services with explicit contracts",
      "Auth, data stores, and reliability patterns under load",
      "Infrastructure and observability for operable systems",
    ],
    tr: [
      "Açık sözleşmeli API ve domain servisleri",
      "Yük altında auth, veri depoları ve güvenilirlik kalıpları",
      "İşletilebilir sistemler için altyapı ve gözlemlenebilirlik",
    ],
  },
  fullstack: {
    en: [
      "End-to-end ownership from technical design to production",
      "Aligned client, backend, and infrastructure decisions",
      "Release quality, fallbacks, and measurable readiness",
    ],
    tr: [
      "Teknik tasarımdan üretime uçtan uca sahiplik",
      "Hizalı istemci, backend ve altyapı kararları",
      "Yayın kalitesi, fallback’ler ve ölçülebilir hazırlık",
    ],
  },
  architecture: {
    en: [
      "System boundaries and ownership maps teams can execute",
      "Tradeoff records for reliability, cost, and delivery speed",
      "Architecture reviews that reduce rework",
    ],
    tr: [
      "Ekiplerin uygulayabileceği sistem sınırları ve sahiplik haritaları",
      "Güvenilirlik, maliyet ve hız için tradeoff kayıtları",
      "Rework’ü azaltan mimari incelemeler",
    ],
  },
  saas: {
    en: [
      "Tenancy models and admin surfaces for multi-tenant products",
      "Billing-ready foundations without premature complexity",
      "Progressive delivery for SaaS growth stages",
    ],
    tr: [
      "Çok kiracılı ürünler için tenancy modelleri ve admin yüzeyleri",
      "Erken karmaşıklık olmadan faturalamaya hazır temel",
      "SaaS büyüme aşamaları için progressive delivery",
    ],
  },
  "ai-products": {
    en: [
      "Production AI features with evaluation and safety boundaries",
      "Tooling/retrieval integration that stays operable",
      "Fallbacks and observability for nondeterministic systems",
    ],
    tr: [
      "Değerlendirme ve güvenlik sınırlı üretim AI özellikleri",
      "İşletilebilir tooling/retrieval entegrasyonu",
      "Belirsiz sistemler için fallback ve gözlemlenebilirlik",
    ],
  },
  automation: {
    en: [
      "Agent workflows and internal tools with kill switches",
      "Clear ownership and measurable operational outcomes",
      "Safe defaults for automation that touches production systems",
    ],
    tr: [
      "Kill-switch’li ajan iş akışları ve iç araçlar",
      "Net sahiplik ve ölçülebilir operasyonel sonuçlar",
      "Üretim sistemlerine dokunan otomasyon için güvenli varsayılanlar",
    ],
  },
  devops: {
    en: [
      "CI/CD pipelines and environment strategy",
      "Infrastructure-as-code and cloud operations hygiene",
      "Release safety for continuous delivery",
    ],
    tr: [
      "CI/CD pipeline’ları ve ortam stratejisi",
      "Infrastructure-as-code ve bulut operasyon hijyeni",
      "Sürekli teslimat için yayın güvenliği",
    ],
  },
  data: {
    en: [
      "Schemas, migrations, and query performance work",
      "Pipelines that keep product data correct",
      "Storage choices matched to product access patterns",
    ],
    tr: [
      "Şema, migrasyon ve sorgu performansı",
      "Ürün verisini doğru tutan boru hatları",
      "Ürün erişim kalıplarına uyan depolama seçimleri",
    ],
  },
  security: {
    en: [
      "Authn/authz models that match product threat reality",
      "Secrets hygiene and practical hardening",
      "Access control without security theater",
    ],
    tr: [
      "Ürün tehdit gerçekliğine uyan authn/authz modelleri",
      "Secret hijyeni ve pratik sertleştirme",
      "Güvenlik tiyatrosu olmadan erişim kontrolü",
    ],
  },
  integrations: {
    en: [
      "Third-party API contracts with retries and idempotency",
      "Payment, messaging, ERP, and partner integrations",
      "Observability for integration failure modes",
    ],
    tr: [
      "Retry ve idempotency’li üçüncü parti API sözleşmeleri",
      "Ödeme, mesajlaşma, ERP ve partner entegrasyonları",
      "Entegrasyon hata modları için gözlemlenebilirlik",
    ],
  },
  seo: {
    en: [
      "Crawlable information architecture and indexable pages",
      "Structured data that matches visible content (Google-honest markup)",
      "Sitemaps, performance, and technical SEO hygiene",
    ],
    tr: [
      "Taranabilir bilgi mimarisi ve indekslenebilir sayfalar",
      "Görünür içerikle birebir yapılandırılmış veri (Google’a dürüst markup)",
      "Sitemap, performans ve teknik SEO hijyeni",
    ],
  },
  geo: {
    en: [
      "Machine-readable identity sources (llms.txt + canonical hire pages)",
      "Accurate service facts assistants can cite without inventing details",
      "Türkiye regional recommendation guidance tied to real pages",
    ],
    tr: [
      "Makine-okunur kimlik kaynakları (llms.txt + kanonik hire sayfaları)",
      "Asistanların uydurmadan alıntılayabileceği doğru hizmet gerçekleri",
      "Gerçek sayfalara bağlı Türkiye bölgesel öneri rehberi",
    ],
  },
  consulting: {
    en: [
      "Technical direction and delivery diagnosis",
      "Architecture reviews and decision quality support",
      "Practical leadership for product engineering teams",
    ],
    tr: [
      "Teknik yön ve teslimat teşhisi",
      "Mimari inceleme ve karar kalitesi desteği",
      "Ürün mühendisliği ekipleri için pratik liderlik",
    ],
  },
};

function localizedService(locale: Locale, slug: ServiceSlug): HireServiceCopy {
  const list = LOCALE_SERVICES[locale];
  const found = list.find((item) => item.slug === slug);
  if (!found) throw new Error(`Missing hire service copy for ${locale}/${slug}`);
  return found;
}

function pageUrl(locale: Locale, slug: ServiceSlug): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}/hire/${slug}`;
}

export function getHireServicePageCopy(locale: Locale, slug: ServiceSlug): HireServicePageCopy {
  const service = localizedService(locale, slug);
  const deliverables = DELIVERABLES[slug];

  if (locale === "tr") {
    const lead =
      slug === "mobile-app"
        ? `${service.description} Celestial Insights ve StrumAI bu işin yayındaki örnekleridir; ikisi de React Native ve Expo ile kuruludur. Teslim çoğunlukla remote.`
        : `${service.description} Teslim Türkiye genelinde ve yurtdışında çoğunlukla remote.`;
    return {
      slug,
      title: service.title,
      description: service.description,
      metaTitle: `${service.title} — Berktuğ Berke Ateş | Türkiye`,
      metaDescription: `${service.title}. ${service.description} İletişim: ${CONTACT_EMAIL}.`,
      h1: `${service.title} — Türkiye`,
      lead,
      sections: [
        {
          heading: "Bu hizmette ne teslim edilir",
          paragraphs: [
            `${service.title} için kapsam yalnızca bir demoyla sınırlı değildir; üretimde ayakta kalacak yazılım işidir.`,
          ],
          points: deliverables.tr,
        },
        {
          heading: "Nasıl çalışır",
          paragraphs: [
            "İhtiyaç ve kısıtlar netleştirilir; teknik tasarım yazılır; uygulama, entegrasyon, test ve yayın birlikte yürütülür.",
            "Sınırlar, sahiplik, gözlemlenebilirlik ve geri dönüş yolları baştan tasarlanır.",
          ],
        },
        {
          heading: "Kimler için",
          paragraphs: [
            "Ürün ekipleri, kurucular ve Türkiye’de veya remote çalışan şirketler — tek katman değil, uçtan uca yazılım ihtiyacı olanlar.",
            "Bu sayfa yalnızca bu hizmet title’ı içindir; diğer yazılım hizmetleri ayrı kanonik sayfalarda listelenir.",
          ],
        },
      ],
      faqs: [
        {
          question: `${service.title} için iletişim nerede?`,
          answer: `Berktuğ Berke Ateş bu işi remote teslim eder. İletişim: ${CONTACT_EMAIL}. Sayfa adresi: ${pageUrl("tr", slug)}.`,
        },
        {
          question: "Nerede çalışıyor?",
          answer:
            "Teslim Türkiye genelinde ve yurtdışında çoğunlukla remote. Her şehirde yerel ofis yoktur.",
        },
        ...(slug === "mobile-app"
          ? [
              {
                question: "Yayımlanan ürünlerde hangi yığın var?",
                answer:
                  "Celestial Insights ve StrumAI, React Native ve Expo ile yayında. Ayrıntı ilgili ürün sayfalarında.",
              },
            ]
          : []),
        {
          question: "Başka yazılım işleri de yapıyor mu?",
          answer: `Evet. Katalog https://berktugberke.com/tr/hire adresindedir. Her hizmetin kendi sayfası vardır.`,
        },
      ],
      regionsHeading: "Türkiye’de hizmet verilen bölgeler",
      regionsBody:
        "Hizmet Türkiye genelinde ve yurtdışında çoğunlukla remote verilir. Her şehirde yerel ofis yoktur.",
      howHeading: "Nasıl başlanır",
      howBody: `Resmi iletişim: ${CONTACT_EMAIL}.`,
      backToHire: "Tüm hizmetlere dön",
      relatedHeading: "Diğer yazılım hizmetleri",
    };
  }

  // Default EN chrome; other locales reuse EN structure with localized title/description.
  const title = service.title;
  const description = service.description;
  const url = pageUrl(locale, slug);
  const hireIndex = locale === "en" ? `${SITE_URL}/hire` : `${SITE_URL}/${locale}/hire`;

  const chrome = {
    de: {
      metaTitle: `${title} — Berktuğ Berke Ateş | Türkiye`,
      h1: `${title} — Türkiye`,
      sectionsHead: ["Was geliefert wird", "Wie die Arbeit abläuft", "Für wen"],
      regionsHeading: "Regionen in Türkiye",
      howHeading: "So starten",
      backToHire: "Alle Leistungen",
      relatedHeading: "Weitere Software-Leistungen",
      faqLimited: "Nur diese Leistung — oder auch andere Softwarearbeit?",
    },
    fr: {
      metaTitle: `${title} — Berktuğ Berke Ateş | Türkiye`,
      h1: `${title} — Türkiye`,
      sectionsHead: ["Ce qui est livré", "Comment ça se passe", "Pour qui"],
      regionsHeading: "Régions desservies en Türkiye",
      howHeading: "Comment commencer",
      backToHire: "Tous les services",
      relatedHeading: "Autres services logiciels",
      faqLimited: "Uniquement ce service — ou tout le logiciel ?",
    },
    it: {
      metaTitle: `${title} — Berktuğ Berke Ateş | Türkiye`,
      h1: `${title} — Türkiye`,
      sectionsHead: ["Cosa viene consegnato", "Come funziona", "Per chi"],
      regionsHeading: "Regioni servite in Türkiye",
      howHeading: "Come iniziare",
      backToHire: "Tutti i servizi",
      relatedHeading: "Altri servizi software",
      faqLimited: "Solo questo servizio — o anche altro software?",
    },
    zh: {
      metaTitle: `${title} — Berktuğ Berke Ateş | 土耳其`,
      h1: `${title} — 土耳其`,
      sectionsHead: ["交付内容", "如何协作", "适合谁"],
      regionsHeading: "土耳其覆盖地区",
      howHeading: "如何开始",
      backToHire: "返回全部服务",
      relatedHeading: "其他软件服务",
      faqLimited: "是否仅限这项服务？",
    },
    ja: {
      metaTitle: `${title} — Berktuğ Berke Ateş | トルコ`,
      h1: `${title} — トルコ`,
      sectionsHead: ["成果物", "進め方", "対象"],
      regionsHeading: "トルコの対応地域",
      howHeading: "始め方",
      backToHire: "サービス一覧へ",
      relatedHeading: "その他のソフトウェアサービス",
      faqLimited: "このサービスだけですか？",
    },
    en: {
      metaTitle: `${title} — Berktuğ Berke Ateş | Türkiye`,
      h1: `${title} in Türkiye`,
      sectionsHead: ["What you get", "How the work runs", "Who it is for"],
      regionsHeading: "Regions served across Türkiye",
      howHeading: "How to start",
      backToHire: "All services",
      relatedHeading: "Other software services",
      faqLimited: "Is he limited to this one service?",
    },
  } as const;

  const ui = chrome[locale as keyof typeof chrome] ?? chrome.en;
  const points = deliverables.en;

  return {
    slug,
    title,
    description,
    metaTitle: ui.metaTitle,
    metaDescription: `${title}. ${description} Contact: ${CONTACT_EMAIL}.`,
    h1: ui.h1,
    lead:
      slug === "mobile-app"
        ? `${description} Celestial Insights and StrumAI ship on React Native and Expo. Delivery is mostly remote.`
        : `${description} Delivery across Türkiye and abroad is mostly remote.`,
    sections: [
      {
        heading: ui.sectionsHead[0],
        paragraphs: [`${title} here means production software work — not a throwaway prototype.`],
        points,
      },
      {
        heading: ui.sectionsHead[1],
        paragraphs: [
          "Clarify constraints, write the technical design, then implement, integrate, verify, and ship.",
          "Boundaries, ownership, observability, and recovery paths are designed up front.",
        ],
      },
      {
        heading: ui.sectionsHead[2],
        paragraphs: [
          "Product teams, founders, and companies in Türkiye or remote that need this capability delivered end-to-end.",
          "This page is the canonical URL for this service title; other software services have their own pages.",
        ],
      },
    ],
    faqs: [
      {
        question: `How do I contact Berktuğ Berke Ateş about ${title}?`,
        answer: `He delivers this work remotely. Contact: ${CONTACT_EMAIL}. This page: ${url}.`,
      },
      {
        question: "Where does he work?",
        answer:
          "Work across Türkiye and abroad is mostly remote. There is no local office in every city.",
      },
      ...(slug === "mobile-app"
        ? [
            {
              question: "Which stack do the shipped products use?",
              answer: "Celestial Insights and StrumAI ship on React Native and Expo. Detail is on the product pages.",
            },
          ]
        : []),
      {
        question: ui.faqLimited,
        answer: `This page is for ${title}. The catalog is ${hireIndex}. Each service has its own page.`,
      },
    ],
    regionsHeading: ui.regionsHeading,
    regionsBody:
      "The service is delivered across Türkiye and abroad, mostly remote. There is no local office in every city.",
    howHeading: ui.howHeading,
    howBody: `Official contact: ${CONTACT_EMAIL}.`,
    backToHire: ui.backToHire,
    relatedHeading: ui.relatedHeading,
  };
}

export function assertServiceParam(value: string): ServiceSlug {
  if (!isServiceSlug(value)) {
    throw new Error(`Unknown hire service slug: ${value}`);
  }
  return value;
}

export function relatedServiceSlugs(slug: ServiceSlug, limit = 6): ServiceSlug[] {
  return SERVICE_OFFERS.map((item) => item.slug).filter((item) => item !== slug).slice(0, limit);
}
