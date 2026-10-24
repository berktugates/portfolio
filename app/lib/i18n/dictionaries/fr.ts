import type { HomeDictionary } from "../types";
import { HIRE_ENGAGEMENT } from "../hire-engagement";
import { hireServicesFr } from "../hire-services-copy";

const hireFr = HIRE_ENGAGEMENT.fr;

const dictionary: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — Ingénieur logiciel et Product Builder",
  metaDescription:
    "Ingénieur logiciel et product builder concevant des produits logiciels évolutifs, des systèmes numériques complexes, des infrastructures, des systèmes d’IA, de l’automatisation et des produits de bout en bout prêts pour la production.",
  intro:
    "Berktuğ Berke Ates est un ingénieur logiciel et product builder qui conçoit et construit des produits logiciels évolutifs et des systèmes numériques complexes. Son travail couvre l’architecture logicielle, le backend, l’infrastructure, les systèmes d’IA, l’automatisation et le développement produit de bout en bout, de la conception technique au déploiement en production.",
  availability: `${hireFr.availabilityShort} Livraison orientée production avec des équipes distribuées.`,
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
    "Un projet, un poste ou une collaboration ? Temps plein, temps partiel et missions par projet — via le formulaire de contact.",
  emailMe: "Formulaire de contact",
  emailAria: "Ouvrir le formulaire de contact",
  socialNav: "Profils sociaux",
  latestBlog: "Derniers articles de blog",
  viewAll: "Tout voir",
  engineer: "Ingénieur logiciel full-stack",
  engineerAria: "Ingénieur logiciel full-stack chez bradi.tech",
  bradiLine: "bradi.tech",
  bradiPeriod: "nov. 2024 – aujourd’hui",
  bradiLogoAlt: "Logo bradi.tech",
  degree: "Licence en génie logiciel",
  university: "Université Fırat",
  universityLogoAlt: "Logo de l’Université Fırat",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "Astrologie personnelle, réflexion quotidienne et exploration spirituelle assistée par l’IA.",
    strumai: "Système de pratique de guitare avec analyse audio en temps réel et mentor IA.",
  },
  github: {
    title: "Activité GitHub",
    currentStreak: "Série actuelle",
    longestStreak: "Plus longue série",
    noContributions: "Aucune contribution",
    contribution: "{{count}} contributions",
  },
  carousel: {
    viewProject: "Voir le projet {{title}}",
    showProject: "Afficher {{title}}",
    select: "Sélectionner un projet",
  },
  hire: {
    metaTitle: "Engager Berktuğ Berke Ateş — Web, mobile, SEO, GEO et IA",
    metaDescription: `Berktuğ Berke Ateş, ingénieur logiciel. ${hireFr.availabilityShort} Formulaire : berktugberke.com/contact.`,
    h1: "Engager Berktuğ Berke Ateş",
    lead: hireFr.lead,
    availabilityHeading: "Disponibilité",
    availabilityBody: hireFr.availabilityLong,
    workHeading: "Ce qu’il construit",
    workBody:
      "Son travail couvre l’architecture logicielle, le backend, l’infrastructure, les produits d’IA et les systèmes de production de bout en bout — de la conception technique au déploiement. Ingénieur logiciel full-stack chez bradi.tech.",
    servicesHeading: "Services",
    servicesIntro:
      "Catalogue représentatif du travail logiciel de bout en bout. Ce n’est pas une liste fermée.",
    servicesScopeNote:
      "Périmètre : ingénierie logicielle de bout en bout (UI jusqu’à l’infra, IA, DevOps, data, sécurité, intégrations, SEO, GEO, conseil). Besoins adjacents inclus — contactez pour le fit. Les données structurées reflètent le catalogue visible ; aucune garantie de classement ni métriques non vérifiées.",
    services: hireServicesFr,
    productsHeading: "Produits sélectionnés",
    howHeading: "Comment l’engager",
    howBody: hireFr.howBody,
    faqHeading: "Questions fréquentes",
    faqs: [
      {
        question: "Berktuğ Berke Ateş est-il disponible ?",
        answer: hireFr.faqAvailable,
      },
      {
        question: "Quelle pile utilisent les produits publiés ?",
        answer:
          "Celestial Insights et StrumAI sont construits avec React Native et Expo. Le détail est sur les pages produit.",
      },
      {
        question: "Comment le contacter ?",
        answer: hireFr.faqContact,
      },
    ],
  },
};

export default dictionary;
