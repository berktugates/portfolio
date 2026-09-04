import type { ServiceSlug } from "../services";

export type HireFaq = {
  question: string;
  answer: string;
};

export type HireServiceCopy = {
  slug: ServiceSlug;
  title: string;
  description: string;
};

export type HireDictionary = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  availabilityHeading: string;
  availabilityBody: string;
  workHeading: string;
  workBody: string;
  servicesHeading: string;
  servicesIntro: string;
  services: readonly HireServiceCopy[];
  productsHeading: string;
  howHeading: string;
  howBody: string;
  faqHeading: string;
  faqs: readonly HireFaq[];
};

export type HomeDictionary = {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  availability: string;
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
    /** Template with `{{count}}` */
    contribution: string;
  };
  carousel: {
    /** Template with `{{title}}` */
    viewProject: string;
    /** Template with `{{title}}` */
    showProject: string;
    select: string;
  };
  hire: HireDictionary;
};
