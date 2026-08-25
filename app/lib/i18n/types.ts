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
};
