import type { HomeDictionary } from "../types";
import { HIRE_ENGAGEMENT } from "../hire-engagement";
import { hireServicesIt } from "../hire-services-copy";

const hireIt = HIRE_ENGAGEMENT.it;

const dictionary: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — Software Engineer e Product Builder",
  metaDescription:
    "Software engineer e product builder che progetta prodotti software scalabili, sistemi digitali complessi, infrastrutture, sistemi di IA, automazione e prodotti end-to-end pronti per la produzione.",
  intro:
    "Berktuğ Berke Ates è un software engineer e product builder che progetta e costruisce prodotti software scalabili e sistemi digitali complessi. Il suo lavoro include architettura software, backend, infrastruttura, sistemi di IA, automazione e sviluppo prodotto end-to-end, dalla progettazione tecnica al rilascio in produzione.",
  availability: `${hireIt.availabilityShort} Delivery production-oriented con team distribuiti.`,
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
    "Un progetto, un ruolo o una collaborazione? Full-time, part-time e per progetto — usa il modulo di contatto.",
  emailMe: "Modulo di contatto",
  emailAria: "Apri il modulo di contatto",
  socialNav: "Profili social",
  latestBlog: "Articoli",
  viewAll: "Vedi tutti",
  engineer: "Software Engineer full-stack",
  engineerAria: "Software Engineer full-stack presso bradi.tech",
  bradiLine: "bradi.tech",
  bradiPeriod: "nov 2024 – presente",
  bradiLogoAlt: "Logo bradi.tech",
  degree: "Laurea in Ingegneria del Software",
  university: "Università Fırat",
  universityLogoAlt: "Logo dell’Università Fırat",
  educationPeriod: "2020 – 2025",
  projectSummaries: {
    "celestial-insights": "Astrologia personale, riflessione quotidiana ed esplorazione spirituale con IA.",
    strumai: "Sistema di pratica per chitarra con analisi audio in tempo reale e mentor IA.",
  },
  github: {
    title: "Attività GitHub",
    currentStreak: "Serie attuale",
    longestStreak: "Serie più lunga",
    noContributions: "Nessun contributo",
    contribution: "{{count}} contributi",
  },
  carousel: {
    viewProject: "Vedi il progetto {{title}}",
    showProject: "Mostra {{title}}",
    select: "Seleziona progetto",
  },
  hire: {
    metaTitle: "Assumi Berktuğ Berke Ateş — Web, mobile, SEO, GEO e IA",
    metaDescription: `Berktuğ Berke Ateş, software engineer. ${hireIt.availabilityShort} Modulo: berktugberke.com/contact.`,
    h1: "Assumi Berktuğ Berke Ateş",
    lead: hireIt.lead,
    availabilityHeading: "Disponibilità",
    availabilityBody: hireIt.availabilityLong,
    workHeading: "Cosa costruisce",
    workBody:
      "Il suo lavoro è architettura software, backend, infrastruttura, prodotti di IA e sistemi di produzione end-to-end — dalla progettazione tecnica al deployment. Software engineer full-stack in bradi.tech.",
    servicesHeading: "Servizi",
    servicesIntro:
      "Catalogo rappresentativo del lavoro software end-to-end. Non è una lista chiusa.",
    servicesScopeNote:
      "Ambito: ingegneria software end-to-end (dalla UI all’infra, IA, DevOps, dati, security, integrazioni, SEO, GEO, consulenza). Esigenze adiacenti nel perimetro — contattate per il fit. I dati strutturati rispecchiano il catalogo visibile; nessuna garanzia di ranking né metriche non verificate.",
    services: hireServicesIt,
    productsHeading: "Prodotti selezionati",
    howHeading: "Come assumerlo",
    howBody: hireIt.howBody,
    faqHeading: "Domande frequenti",
    faqs: [
      {
        question: "Berktuğ Berke Ateş è disponibile?",
        answer: hireIt.faqAvailable,
      },
      {
        question: "Quale stack usano i prodotti pubblicati?",
        answer:
          "Celestial Insights e StrumAI sono costruiti con React Native ed Expo. Il dettaglio è nelle pagine dei prodotti.",
      },
      {
        question: "Come si prende contatto?",
        answer: hireIt.faqContact,
      },
    ],
  },
};

export default dictionary;
