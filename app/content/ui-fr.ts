import type { ContentUi } from "../lib/content/types";

const ui: ContentUi = {
  back: "Retour",
  blogs: "Blog",
  blogsIntro:
    "Notes de terrain sur l'architecture logicielle, les produits d'IA, l'ingénierie multiplateforme, la fiabilité et le leadership technique.",
  blogsMetaTitle: "Blog ingénierie logicielle & IA",
  blogsMetaDescription:
    "Articles approfondis sur l'architecture logicielle, l'ingénierie de produits d'IA, le développement mobile multiplateforme, la fiabilité, les API, l'accessibilité et le leadership technique.",
  blogsMetaTitlePaged: "Blog ingénierie logicielle & IA · Page {{page}}",
  minRead: "{{minutes}} min de lecture",
  publishedBy: "Publié le {{date}} par Berktug Berke Ates.",
  previous: "Précédent",
  next: "Suivant",
  paginationAria: "Pagination du blog",
  productScope: "Périmètre produit",
  techStack: "Stack technique",
  downloadOnAppStore: "Télécharger dans l'App Store",
  downloadOnAppStoreAria: "Télécharger {{title}} dans l'App Store",
  privacyPolicy: "Politique de confidentialité",
  termsOfService: "Conditions d’utilisation",
  legalDocumentsAria: "Documents juridiques de {{title}}",
  appStoreScreenshotsAria: "Captures d’écran App Store de {{title}}",
  appStoreScreenshotAlt: "Capture d’écran App Store {{index}} de {{title}}",
  previousScreenshots: "Captures d’écran précédentes",
  nextScreenshots: "Captures d’écran suivantes",
  subscribe: {
    title: "Restez informé",
    body: "Recevez un e-mail lorsqu'un nouvel article est publié sur berktugberke.com. Facultatif—passez quand vous voulez.",
    emailLabel: "E-mail",
    emailPlaceholder: "vous@exemple.com",
    skip: "Passer",
    submit: "Me prévenir",
    submitting: "Inscription…",
    footnote: "Uniquement les nouveaux articles. Désabonnement à tout moment.",
    successTitle: "C'est noté",
    successBody: "Vérifiez votre boîte mail pour confirmer. Les nouveaux articles y arriveront dès leur publication.",
    dismissAria: "Fermer la boîte d'inscription",
  },
};

export default ui;
