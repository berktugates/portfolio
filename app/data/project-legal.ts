import type { ProjectLegalLocaleMap } from "../lib/content/types";

export const projectLegalDocuments: ProjectLegalLocaleMap = {
  "celestial-insights": {
    privacy: {
      title: "Privacy Policy",
      effectiveDate: "Last updated: June 7, 2026",
      introduction: "This policy explains what Celestial Insights collects, why it is collected, how it is used across the iOS app and web experience, and how users can manage or delete their data.",
      sections: [
        { title: "What we collect", items: ["Account information such as your email address, account identifier, and optional profile names.", "Birth and natal profile information you choose to save, including birth date, birth time, birth place, and related chart snapshots derived from that information.", "Onboarding, preference, and settings data such as reading style, focus area, language preference, notification preferences, and audio preferences.", "Reading content and product usage such as saved records, AI chat history, quota counters, and feature usage events.", "Subscription state mirrored from RevenueCat and the App Store, including plan tier, entitlement status, renewal state, and expiration timestamps.", "Technical and security data such as IP address, device/browser metadata, request logs, and fraud or abuse prevention signals."] },
        { title: "Why we collect it", items: ["To authenticate users and keep one account working across mobile and web.", "To generate charts, readings, compatibility results, and other personalized astrology outputs.", "To save records, sync account state, and keep subscription entitlements aligned across surfaces.", "To send account emails such as verification and password recovery codes.", "To improve reliability, investigate abuse, and monitor product performance."] },
        { title: "Third-party services", items: ["Supabase is used for authentication, database storage, and server functions.", "RevenueCat is used to mirror App Store subscription state and entitlement changes.", "Google and Apple authentication services may be used when you choose those sign-in methods.", "EmailJS is currently used for low-volume transactional authentication email delivery.", "Google AdSense may place cookies or collect browser-level advertising signals on the public website where ads are displayed."] },
        { title: "How data is shared", paragraphs: ["We do not sell your personal data. We share data only with service providers that help run the product, such as infrastructure, authentication, subscription, email, and analytics vendors, and only for the purposes described in this policy."] },
        { title: "Retention and deletion", paragraphs: ["We keep account and reading data for as long as needed to operate the service, comply with legal obligations, resolve disputes, and maintain security. When you request account deletion, we delete the account record and associated data that we are not legally required to retain."] },
        { title: "Your choices", items: ["You can update your profile data from the Celestial Insights app account area.", "You can request account deletion from the Celestial Insights app settings flow.", "You can review subscription management through Apple at https://apps.apple.com/account/subscriptions.", "You can contact support for privacy or deletion questions at alurixofficial@gmail.com."] },
        { title: "Contact", paragraphs: ["For privacy questions, data requests, or account concerns, contact alurixofficial@gmail.com."] },
      ],
    },
    terms: {
      title: "Terms of Service",
      effectiveDate: "Effective: June 7, 2026",
      introduction: "These terms govern access to the Celestial Insights mobile application, website, and related services.",
      sections: [
        { title: "Service scope", paragraphs: ["Celestial Insights provides astrology, oracle, ritual, and AI-assisted interpretation tools for personal reflection and entertainment. The service is not medical, legal, financial, psychological, or emergency advice."] },
        { title: "Accounts", items: ["You are responsible for the accuracy of information you choose to save to your account.", "You are responsible for maintaining the confidentiality of your sign-in credentials.", "We may suspend or terminate access for abuse, fraud, unlawful use, or attempts to interfere with the service."] },
        { title: "Subscriptions", items: ["Paid subscriptions for Celestial Insights are sold through Apple in-app purchases in the iOS app.", "Billing, renewal, cancellation, and refunds are governed by Apple’s systems and policies.", "Subscription management is available through Apple at https://apps.apple.com/account/subscriptions."] },
        { title: "Saved content and records", paragraphs: ["If you save readings, chat history, or other account-linked outputs, those records are tied to your account so they can be accessed across supported surfaces. You remain responsible for how you use or share your saved outputs."] },
        { title: "Availability and changes", paragraphs: ["We may update, improve, limit, or remove features at any time to maintain product quality, security, or commercial viability. We do not guarantee that every feature will always be available on every platform."] },
        { title: "Limitation of liability", paragraphs: ["To the maximum extent allowed by law, Celestial Insights is provided on an as-is and as-available basis. We are not liable for decisions, outcomes, losses, or damages resulting from use of astrological or AI-generated content."] },
        { title: "Contact", paragraphs: ["For support or legal questions, contact alurixofficial@gmail.com."] },
      ],
    },
  },
  strumai: {
    privacy: {
      title: "Privacy Policy",
      effectiveDate: "Last updated: July 16, 2026",
      introduction: "This policy explains what StrumAI collects, why it is collected, and how you can contact us about your privacy rights.",
      sections: [
        { title: "Information we collect", paragraphs: ["StrumAI may process account identifiers from Apple or Google sign-in, profile details you choose to add, community posts and comments, practice activity, app settings, subscription status, support messages, and technical diagnostics needed to operate the service."] },
        { title: "How we use information", paragraphs: ["We use information to provide authentication, subscriptions, practice tracking, community features, AI-assisted guitar tools, notifications, safety controls, support, and service reliability."] },
        { title: "Third-party services", paragraphs: ["The app may use service providers including Supabase for backend infrastructure, RevenueCat and Apple for subscriptions, Google or Apple for sign-in, AI providers for music-focused responses, and notification services for device alerts."] },
        { title: "Your choices", paragraphs: ["You can update profile information, manage notification preferences, restore purchases, block users, delete content where available, or contact alurixofficial@gmail.com for privacy requests."] },
        { title: "Children", paragraphs: ["StrumAI is designed for general guitar learning audiences and is not directed to children under 13."] },
      ],
    },
    terms: {
      title: "Terms of Service",
      effectiveDate: "Last updated: July 16, 2026",
      introduction: "These terms describe acceptable use, subscriptions, community content, AI guidance, and support expectations.",
      sections: [
        { title: "Use of StrumAI", paragraphs: ["Use StrumAI for lawful guitar learning, music practice, tone exploration, and community sharing. Do not misuse community features, impersonate others, or upload content you do not have rights to share."] },
        { title: "Subscriptions", paragraphs: ["StrumAI Plus purchases are handled through Apple. Renewal, cancellation, refunds, and billing are governed by Apple account settings and App Store rules."] },
        { title: "AI guidance", paragraphs: ["AI responses are educational music guidance, not a guarantee of musical, technical, health, or professional outcomes. Always use your judgment and protect your hearing and equipment."] },
        { title: "Community content", paragraphs: ["You are responsible for what you post. We may remove content or restrict accounts that violate safety, rights, or community expectations."] },
        { title: "Support", paragraphs: ["Questions about these terms can be sent to alurixofficial@gmail.com."] },
      ],
    },
  },
};
