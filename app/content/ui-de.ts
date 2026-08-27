import type { ContentUi } from "../lib/content/types";

const ui: ContentUi = {
  back: "Zurück",
  blogs: "Blog",
  blogsIntro:
    "Feldnotizen zu Softwarearchitektur, KI-Produkten, plattformübergreifender Entwicklung, Zuverlässigkeit und technischer Führung.",
  blogsMetaTitle: "Software Engineering & KI Blog",
  blogsMetaDescription:
    "Ausführliche Artikel zu Softwarearchitektur, KI-Produktengineering, plattformübergreifender Mobile-Entwicklung, Zuverlässigkeit, APIs, Barrierefreiheit und technischer Führung.",
  blogsMetaTitlePaged: "Software Engineering & KI Blog · Seite {{page}}",
  minRead: "{{minutes}} Min. Lesezeit",
  publishedBy: "Veröffentlicht am {{date}} von Berktug Berke Ates.",
  previous: "Zurück",
  next: "Weiter",
  paginationAria: "Blog-Seitennavigation",
  productScope: "Produktumfang",
  techStack: "Tech-Stack",
  downloadOnAppStore: "Im App Store laden",
  downloadOnAppStoreAria: "{{title}} im App Store laden",
  privacyPolicy: "Datenschutzerklärung",
  termsOfService: "Nutzungsbedingungen",
  legalDocumentsAria: "Rechtliche Dokumente für {{title}}",
  appStoreScreenshotsAria: "App-Store-Screenshots von {{title}}",
  appStoreScreenshotAlt: "App-Store-Screenshot {{index}} von {{title}}",
  previousScreenshots: "Vorherige Screenshots",
  nextScreenshots: "Nächste Screenshots",
  subscribe: {
    title: "Bleib auf dem Laufenden",
    body: "Erhalte eine E-Mail, wenn auf berktugberke.com ein neuer Beitrag erscheint. Optional—jederzeit überspringen.",
    emailLabel: "E-Mail",
    emailPlaceholder: "du@beispiel.com",
    skip: "Überspringen",
    submit: "Benachrichtige mich",
    submitting: "Wird abonniert…",
    footnote: "Nur neue Blogbeiträge. Jederzeit abbestellbar.",
    successTitle: "Du bist dabei",
    successBody: "Prüfe dein Postfach zur Bestätigung. Neue Beiträge landen dort, sobald sie live sind.",
    dismissAria: "Abonnieren-Dialog schließen",
  },
};

export default ui;
