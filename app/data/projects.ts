export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  details: readonly string[];
  highlights: readonly string[];
  period: string;
  image: string;
  imageAlt: string;
  screenshots?: readonly { src: string; alt: string }[];
  legal?: { privacy: string; terms: string };
  visualClassName: string;
  href?: string;
  stores?: { apple?: string; google?: string };
  stack: readonly string[];
};

export const projects: readonly Project[] = [
  {
    slug: "celestial-insights",
    title: "Celestial Insights",
    summary: "Personal astrology, reflection, and AI-guided spiritual exploration.",
    description:
      "Celestial Insights is a cross-platform astrology and spiritual guidance product that turns birth data into a deeply personalized daily experience. It brings natal chart interpretation, horoscopes, tarot-inspired readings, rituals, relationship insights, and Celeste—the in-app AI guide—into one cohesive system.",
    details: [
      "The mobile client is built with React Native and Expo Router, with TanStack Query handling server state and Zustand coordinating local product state. Supabase powers authentication, persistence, reading history, quota enforcement, scheduled horoscope generation, notifications, and RevenueCat subscription synchronization through dedicated Edge Functions.",
      "The product also includes multilingual content, deterministic fallbacks for generated readings, media-rich spiritual tools, growth analytics, rewarded access policies, and native iOS widgets for glanceable daily guidance.",
    ],
    highlights: [
      "Personalized natal charts, daily horoscopes, synastry, tarot, and ritual tools",
      "Gemini-powered Celeste assistant with server-side policy and quota controls",
      "Supabase Edge Functions, push notifications, subscriptions, and iOS widgets",
    ],
    period: "2026",
    image: "/projects/celestial-insights.png",
    imageAlt: "Celestial Insights app icon",
    screenshots: Array.from({ length: 6 }, (_, index) => ({
      src: `/projects/celestial-insights/screenshot-${index + 1}.jpg`,
      alt: `Celestial Insights App Store screenshot ${index + 1}`,
    })),
    legal: {
      privacy: "/projects/celestial-insights/privacy",
      terms: "/projects/celestial-insights/terms",
    },
    visualClassName: "project-visual-celestial",
    href: "https://apps.apple.com/app/celestial-insights/id6771793086",
    stores: { apple: "https://apps.apple.com/us/app/celestial-insights/id6771793086" },
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Expo Router",
      "Supabase",
      "Gemini AI",
      "TanStack Query",
      "Zustand",
      "RevenueCat",
      "i18next",
    ],
  },
  {
    slug: "medula-eczane",
    title: "Medula Eczane",
    summary: "A multi-tenant pharmacy ERP spanning web and cross-platform mobile.",
    description:
      "Medula Eczane is a multi-tenant pharmacy ERP designed around the operational reality of Turkish pharmacies. It unifies products, patients, prescriptions, stock, purchases, returns, finance, reporting, and full point-of-sale workflows across web and mobile clients.",
    details: [
      "The web platform is a React 19 and Vite monorepo organized into domain packages for UI, OpenAPI-generated API access, shared utilities, and permission-aware product features. TanStack Query manages remote state, Zustand handles focused client state, React Router provides the application shell, and MUI supplies the accessible component foundation.",
      "The companion Expo application brings the same domain model to iOS and Android with typed API contracts, secure credential storage, camera-based barcode and QR scanning, responsive operational screens, and feature modules that mirror the web workflows. Both clients are backed by automated unit, responsive, accessibility, and end-to-end test suites.",
    ],
    highlights: [
      "Products, master data, prescriptions, inventory, purchases, returns, and reporting",
      "Draft-to-payment POS flow with barcode/QR input, terminals, receipts, and cancellation",
      "Shared OpenAPI contracts with responsive web, iOS, and Android clients",
    ],
    period: "In development",
    image: "/projects/medula-eczane.png",
    imageAlt: "Medula Eczane app icon",
    visualClassName: "project-visual-medula",
    stack: [
      "React 19",
      "React Native",
      "Expo",
      "TypeScript",
      "Vite",
      "MUI",
      "TanStack Query",
      "Zustand",
      "OpenAPI",
      "Playwright",
    ],
  },
  {
    slug: "strumai",
    title: "Strumai",
    summary: "A complete guitar practice system with real-time audio and an AI mentor.",
    description:
      "Strumai is a cross-platform guitar practice system built around real playing, not passive content. It combines a microphone-driven tuner, metronome and tempo training, chords and theory, ear and performance tools, transcription, practice streaks, achievements, and Maestro—an AI mentor for contextual guidance.",
    details: [
      "The app uses Expo and React Native with Pitchy for pitch detection, Skia for responsive audio visualization, Expo Audio for recording and playback, and Gemini-backed Supabase Edge Functions for Maestro chat and tone matching. TanStack Query and Zustand split remote and local state responsibilities across the product.",
      "Beyond individual practice, Strumai includes community profiles, posts, recordings, mentions, notifications, leaderboards, content moderation, RevenueCat subscriptions, configurable reminders, and native practice-streak widgets.",
    ],
    highlights: [
      "Real-time tuner, metronome, theory, transcription, recordings, and performance tools",
      "Gemini-powered Maestro mentor and AI-assisted guitar tone matching",
      "Community, moderation, gamification, subscriptions, notifications, and widgets",
    ],
    period: "2026",
    image: "/projects/strumai.png",
    imageAlt: "Strumai app icon",
    screenshots: Array.from({ length: 6 }, (_, index) => ({
      src: `/projects/strumai/screenshot-${index + 1}.jpg`,
      alt: `StrumAI App Store screenshot ${index + 1}`,
    })),
    legal: {
      privacy: "/projects/strumai/privacy",
      terms: "/projects/strumai/terms",
    },
    visualClassName: "project-visual-strumai",
    href: "https://apps.apple.com/app/strumai/id6780034403",
    stores: { apple: "https://apps.apple.com/us/app/strumai/id6780034403" },
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Expo Router",
      "Supabase",
      "Gemini AI",
      "Pitchy",
      "React Native Skia",
      "TanStack Query",
      "RevenueCat",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
