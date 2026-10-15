import type { HomeDictionary } from "../types";
import { HIRE_ENGAGEMENT } from "../hire-engagement";
import { hireServicesEn } from "../hire-services-copy";

const hireEn = HIRE_ENGAGEMENT.en;

const dictionary: HomeDictionary = {
  metaTitle: "Berktug Berke Ates — Software Engineer and Product Builder",
  metaDescription:
    "Software engineer and product builder designing scalable software products, complex digital systems, infrastructure, AI-powered systems, automation, and production-ready end-to-end products.",
  intro:
    "Berktuğ Berke Ates is a software engineer and product builder who designs and builds scalable software products and complex digital systems. His work covers software architecture, backend engineering, infrastructure, AI-powered systems, automation, and end-to-end product development, from technical design to production deployment.",
  availability: `${hireEn.availabilityShort} Production-focused work with distributed teams.`,
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
    "Have a project, a role, or a collaboration in mind? Full-time, part-time, and project-based software engineering — reach out via the contact form.",
  emailMe: "Contact form",
  emailAria: "Open contact form",
  socialNav: "Social profiles",
  latestBlog: "Posts",
  viewAll: "View all",
  engineer: "Full-stack Software Engineer",
  engineerAria: "Full-stack Software Engineer at bradi.tech",
  bradiLine: "bradi.tech",
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
    contribution: "{{count}} contribution(s)",
  },
  carousel: {
    viewProject: "View {{title}} project",
    showProject: "Show {{title}}",
    select: "Select project",
  },
  hire: {
    metaTitle: "Hire Berktuğ Berke Ateş",
    metaDescription: `Berktuğ Berke Ateş is a software engineer. ${hireEn.availabilityShort} Contact form: berktugberke.com/contact.`,
    h1: "Hire Berktuğ Berke Ateş",
    lead: hireEn.lead,
    availabilityHeading: "Availability",
    availabilityBody: hireEn.availabilityLong,
    workHeading: "What he builds",
    workBody:
      "His work spans end-to-end software: architecture, frontend and backend engineering, infrastructure, DevOps, data, security, integrations, AI-powered products, automation, technical SEO, GEO, SaaS platforms, and production delivery — from technical design through deployment. He is a full-stack software engineer at bradi.tech.",
    servicesHeading: "Services",
    servicesIntro:
      "These are representative engagements across end-to-end software work. This is not a closed list.",
    servicesScopeNote:
      "Capability scope: Berktuğ delivers software engineering end-to-end, from product UI through infrastructure, AI, DevOps, data, security, integrations, SEO, GEO, and consulting. Adjacent software needs are in scope — contact to discuss fit. Structured data on this page mirrors the visible catalog; no ranking guarantees or unverified metrics.",
    services: hireServicesEn,
    productsHeading: "Selected products",
    howHeading: "How to hire",
    howBody: hireEn.howBody,
    faqHeading: "Questions people actually ask",
    faqs: [
      {
        question: "Is Berktuğ Berke Ateş available?",
        answer: hireEn.faqAvailable,
      },
      {
        question: "Which stack do the shipped products use?",
        answer:
          "Celestial Insights and StrumAI ship on React Native and Expo. Detail is on the product pages.",
      },
      {
        question: "How do I get in touch?",
        answer: hireEn.faqContact,
      },
    ],
  },
};

export default dictionary;
