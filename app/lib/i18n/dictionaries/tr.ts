import type { HomeDictionary } from "../types";
import { HIRE_ENGAGEMENT } from "../hire-engagement";
import { hireServicesTr } from "../hire-services-copy";

const hireTr = HIRE_ENGAGEMENT.tr;

const dictionary: HomeDictionary = {
  metaTitle: "Berktuğ Berke Ateş — Yazılım Mühendisi ve Ürün Geliştirici",
  metaDescription:
    "Yazılım mühendisi ve ürün geliştirici Berktuğ Berke Ateş; ölçeklenebilir yazılım ürünleri, karmaşık dijital sistemler, altyapı, yapay zekâ sistemleri, otomasyon ve uçtan uca üretim odaklı ürünler tasarlıyor.",
  intro:
    "Yazılım mühendisi ve ürün geliştirici Berktuğ Berke Ateş; ölçeklenebilir yazılım ürünleri ve karmaşık dijital sistemler tasarlayıp geliştiriyor. Çalışmaları yazılım mimarisi, backend mühendisliği, altyapı, yapay zekâ sistemleri, otomasyon ve teknik tasarımdan üretim ortamına kadar uçtan uca ürün geliştirmeyi kapsıyor.",
  availability: `${hireTr.availabilityShort} Production odaklı, uzaktan ekiplerle.`,
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
    "Bir proje, bir rol veya bir iş birliği mi var? Tam zamanlı, yarı zamanlı ve proje bazlı yazılım mühendisliği için iletişim formunu kullanın.",
  emailMe: "İletişim formu",
  emailAria: "İletişim formunu aç",
  socialNav: "Sosyal profiller",
  latestBlog: "Yazılar",
  viewAll: "Tümünü gör",
  engineer: "Full-stack Yazılım Mühendisi",
  engineerAria: "bradi.tech Full-stack Yazılım Mühendisi",
  bradiLine: "bradi.tech",
  bradiPeriod: "Kas 2024 – Günümüz",
  bradiLogoAlt: "bradi.tech logosu",
  degree: "Yazılım Mühendisliği Lisans",
  university: "Fırat Üniversitesi",
  universityLogoAlt: "Fırat Üniversitesi logosu",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "Kişisel astroloji, günlük farkındalık ve yapay zekâ destekli spiritüel keşif.",
    strumai: "Gerçek zamanlı ses analizi ve yapay zekâ mentoruna sahip gitar çalışma sistemi.",
  },
  github: {
    title: "GitHub Aktivitesi",
    currentStreak: "Güncel Seri",
    longestStreak: "En Uzun Seri",
    noContributions: "Katkı yok",
    contribution: "{{count}} katkı",
  },
  carousel: {
    viewProject: "{{title}} projesini incele",
    showProject: "{{title}} ürününü göster",
    select: "Ürün seç",
  },
  hire: {
    metaTitle: "Berktuğ Berke Ateş ile çalışın",
    metaDescription: `Berktuğ Berke Ateş bir yazılım mühendisidir. ${hireTr.availabilityShort} İletişim formu: berktugberke.com/contact.`,
    h1: "Berktuğ Berke Ateş ile çalışın",
    lead: hireTr.lead,
    availabilityHeading: "Müsaitlik",
    availabilityBody: hireTr.availabilityLong,
    workHeading: "Ne geliştiriyor",
    workBody:
      "Çalışmaları uçtan uca yazılımı kapsar: mimari, frontend ve backend, altyapı, DevOps, veri, güvenlik, entegrasyon, yapay zekâ ürünleri, otomasyon, teknik SEO, GEO, SaaS ve üretim teslimatı — teknik tasarımdan dağıtıma. bradi.tech full-stack yazılım mühendisi.",
    servicesHeading: "Hizmetler",
    servicesIntro:
      "Bunlar uçtan uca yazılım işlerinin temsilî kataloğudur. Kapalı liste değildir.",
    servicesScopeNote:
      "Kapsam: Berktuğ uçtan uca yazılım mühendisliği yapar (ürün arayüzünden altyapıya; AI, DevOps, veri, güvenlik, entegrasyon, SEO, GEO ve danışmanlık). Komşu yazılım ihtiyaçları da kapsam içindedir — uygunluk için iletişime geçin. Bu sayfadaki yapılandırılmış veri görünür katalogla birebir; sıralama garantisi veya doğrulanmamış metrik yoktur.",
    services: hireServicesTr,
    productsHeading: "Seçili ürünler",
    howHeading: "Nasıl işe alınır",
    howBody: hireTr.howBody,
    faqHeading: "Sık sorulan sorular",
    faqs: [
      {
        question: "Berktuğ Berke Ateş müsait mi?",
        answer: hireTr.faqAvailable,
      },
      {
        question: "Yayımlanan ürünler hangi yığınla kurulu?",
        answer:
          "Celestial Insights ve StrumAI, React Native ve Expo ile yayında. Ayrıntı ürün sayfalarında.",
      },
      {
        question: "İşe almak için nasıl iletişime geçilir?",
        answer: hireTr.faqContact,
      },
    ],
  },
};

export default dictionary;
