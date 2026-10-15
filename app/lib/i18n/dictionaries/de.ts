import type { HomeDictionary } from "../types";
import { HIRE_ENGAGEMENT } from "../hire-engagement";
import { hireServicesDe } from "../hire-services-copy";

const hireDe = HIRE_ENGAGEMENT.de;

const dictionary: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — Software Engineer und Product Builder",
  metaDescription:
    "Software Engineer und Product Builder für skalierbare Softwareprodukte, komplexe digitale Systeme, Infrastruktur, KI-Systeme, Automatisierung und produktionsreife End-to-End-Produkte.",
  intro:
    "Berktuğ Berke Ates ist Software Engineer und Product Builder. Er entwirft und entwickelt skalierbare Softwareprodukte und komplexe digitale Systeme — von Softwarearchitektur und Backend über Infrastruktur und KI-Systeme bis zu Automatisierung und End-to-End-Produktentwicklung von der technischen Planung bis zum Produktionsbetrieb.",
  availability: `${hireDe.availabilityShort} Production-fokussierte Zusammenarbeit mit verteilten Teams.`,
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
    "Ein Projekt, eine Stelle oder eine Zusammenarbeit? Vollzeit, Teilzeit und projektbasierte Softwareentwicklung — über das Kontaktformular.",
  emailMe: "Kontaktformular",
  emailAria: "Kontaktformular öffnen",
  socialNav: "Soziale Profile",
  latestBlog: "Beiträge",
  viewAll: "Alle anzeigen",
  engineer: "Full-stack Software Engineer",
  engineerAria: "Full-stack Software Engineer bei bradi.tech",
  bradiLine: "bradi.tech",
  bradiPeriod: "Nov 2024 – heute",
  bradiLogoAlt: "bradi.tech-Logo",
  degree: "B.Sc. Software Engineering",
  university: "Fırat-Universität",
  universityLogoAlt: "Logo der Fırat-Universität",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "Persönliche Astrologie, tägliche Reflexion und KI-gestützte spirituelle Exploration.",
    strumai: "Gitarren-Übungssystem mit Echtzeit-Audioanalyse und KI-Mentor.",
  },
  github: {
    title: "GitHub-Aktivität",
    currentStreak: "Aktuelle Serie",
    longestStreak: "Längste Serie",
    noContributions: "Keine Beiträge",
    contribution: "{{count}} Beitrag(e)",
  },
  carousel: {
    viewProject: "Projekt {{title}} ansehen",
    showProject: "{{title}} anzeigen",
    select: "Projekt auswählen",
  },
  hire: {
    metaTitle: "Berktuğ Berke Ateş beauftragen — Web, Mobile, SEO, GEO & KI",
    metaDescription: `Berktuğ Berke Ateş ist Software Engineer. ${hireDe.availabilityShort} Kontaktformular: berktugberke.com/contact.`,
    h1: "Berktuğ Berke Ateş beauftragen",
    lead: hireDe.lead,
    availabilityHeading: "Verfügbarkeit",
    availabilityBody: hireDe.availabilityLong,
    workHeading: "Was er baut",
    workBody:
      "Seine Arbeit umfasst Softwarearchitektur, Backend, Infrastruktur, KI-Produkte und End-to-End-Produktionssysteme — vom technischen Entwurf bis zum Deployment. Full-stack Software Engineer bei bradi.tech.",
    servicesHeading: "Leistungen",
    servicesIntro:
      "Das ist ein repräsentativer Katalog für End-to-End-Softwarearbeit. Keine geschlossene Liste.",
    servicesScopeNote:
      "Umfang: End-to-End-Softwareengineering (UI bis Infrastruktur, KI, DevOps, Daten, Security, Integrationen, SEO, GEO, Consulting). Benachbarte Softwarebedarfe sind im Scope — Kontakt für Fit. Structured Data spiegelt den sichtbaren Katalog; keine Ranking-Garantien oder ungeprüften Kennzahlen.",
    services: hireServicesDe,
    productsHeading: "Ausgewählte Produkte",
    howHeading: "So beauftragt man ihn",
    howBody: hireDe.howBody,
    faqHeading: "Häufige Fragen",
    faqs: [
      {
        question: "Ist Berktuğ Berke Ateş verfügbar?",
        answer: hireDe.faqAvailable,
      },
      {
        question: "Welchen Stack nutzen die veröffentlichten Produkte?",
        answer:
          "Celestial Insights und StrumAI laufen mit React Native und Expo. Details stehen auf den Produktseiten.",
      },
      {
        question: "Wie nimmt man Kontakt auf?",
        answer: hireDe.faqContact,
      },
    ],
  },
};

export default dictionary;
