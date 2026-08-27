import type { LocaleContentModule } from "../lib/content/types";
import { projectLegalCopies } from "./legal-shared";

const content: LocaleContentModule = {
  projects: {},
  blogs: {},
  legal: projectLegalCopies.en,
  ui: {
    back: "Back",
    blogs: "Blogs",
    blogsIntro:
      "Field notes on software architecture, AI products, cross-platform engineering, reliability, and technical leadership.",
    blogsMetaTitle: "Software Engineering & AI Blogs",
    blogsMetaDescription:
      "Long-form writing on software architecture, AI product engineering, cross-platform mobile development, reliability, APIs, accessibility, and technical leadership.",
    blogsMetaTitlePaged: "Software Engineering & AI Blogs · Page {{page}}",
    minRead: "{{minutes}} min read",
    publishedBy: "Published on {{date}} by Berktug Berke Ates.",
    previous: "Previous",
    next: "Next",
    paginationAria: "Blog pagination",
    productScope: "Product Scope",
    techStack: "Tech Stack",
    downloadOnAppStore: "Download on the App Store",
    downloadOnAppStoreAria: "Download {{title}} on the App Store",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    legalDocumentsAria: "{{title}} legal documents",
    appStoreScreenshotsAria: "{{title}} App Store screenshots",
    appStoreScreenshotAlt: "{{title}} App Store screenshot {{index}}",
    subscribe: {
      title: "Stay in the loop",
      body: "Get an email when a new post goes live on berktugberke.com. Optional—skip anytime.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      skip: "Skip",
      submit: "Notify me",
      submitting: "Subscribing…",
      footnote: "Only new blog posts. Unsubscribe anytime.",
      successTitle: "You're in",
      successBody: "Check your inbox to confirm. New posts land there when they ship.",
      dismissAria: "Dismiss subscribe dialog",
    },
  },
};

export default content;
