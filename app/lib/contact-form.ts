export const CONTACT_PROJECT_TYPES = ["ai-automation", "saas-mvp", "mobile", "custom", "other"] as const;
export type ContactProjectType = (typeof CONTACT_PROJECT_TYPES)[number];

export type ContactSubmission = {
  projectType: ContactProjectType | "";
  name: string;
  email: string;
  details: string;
  turnstileToken: string;
  startedAt: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseContactSubmission(
  form: FormData,
  now = Date.now(),
): { ok: true; value: ContactSubmission } | { ok: false; error: string } {
  if (clean(form.get("website"))) return { ok: false, error: "spam" };

  const projectType = clean(form.get("projectType"));
  const name = clean(form.get("name"));
  const email = clean(form.get("email")).toLowerCase();
  const details = clean(form.get("details"));
  const turnstileToken = clean(form.get("cf-turnstile-response"));
  const startedAt = Number(clean(form.get("startedAt")));

  if (projectType && !CONTACT_PROJECT_TYPES.includes(projectType as ContactProjectType)) {
    return { ok: false, error: "project-type" };
  }
  if (name.length < 2 || name.length > 100) return { ok: false, error: "name" };
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return { ok: false, error: "email" };
  if (details.length < 20 || details.length > 5000) return { ok: false, error: "details" };
  if (!turnstileToken || turnstileToken.length > 2048) return { ok: false, error: "turnstile" };
  if (!Number.isFinite(startedAt) || now - startedAt < MIN_SUBMIT_DELAY_MS || now - startedAt > MAX_FORM_AGE_MS) {
    return { ok: false, error: "timing" };
  }

  return {
    ok: true,
    value: {
      projectType: projectType as ContactProjectType | "",
      name,
      email,
      details,
      turnstileToken,
      startedAt,
    },
  };
}

export function contactProjectLabel(type: ContactSubmission["projectType"]): string {
  return {
    "ai-automation": "AI / Otomasyon",
    "saas-mvp": "SaaS / MVP",
    mobile: "Mobil uygulama",
    custom: "Özel yazılım",
    other: "Diğer",
    "": "Belirtilmedi",
  }[type];
}

const MIN_DETAILS_LENGTH = 20;
const MIN_SUBMIT_DELAY_MS = 1_000;
const MAX_FORM_AGE_MS = 3_600_000;

export const contactFormLimits = {
  minDetailsLength: MIN_DETAILS_LENGTH,
  minSubmitDelayMs: MIN_SUBMIT_DELAY_MS,
  maxFormAgeMs: MAX_FORM_AGE_MS,
} as const;

export function contactSubmissionUserMessage(error: string): string {
  switch (error) {
    case "spam":
      return "Gönderim reddedildi. Sayfayı yenileyip tekrar deneyin.";
    case "project-type":
      return "Geçersiz proje türü seçimi.";
    case "name":
      return "Ad en az 2 karakter olmalı.";
    case "email":
      return "Geçerli bir e-posta adresi girin.";
    case "details":
      return `Proje detayları en az ${MIN_DETAILS_LENGTH} karakter olmalı.`;
    case "turnstile":
      return "Güvenlik doğrulamasını tamamlayın (Turnstile kutusu).";
    case "timing":
      return "Formu göndermeden önce alanları doldurun. Çok uzun süre açık kaldıysa sayfayı yenileyin.";
    default:
      return "Alanları kontrol edip tekrar deneyin.";
  }
}

export function validateContactFieldsClient(input: {
  name: string;
  email: string;
  details: string;
  turnstileToken: string;
  startedAt: number;
  now?: number;
}): string | null {
  const now = input.now ?? Date.now();
  if (input.name.trim().length < 2) return "name";
  if (input.email.trim().length > 254 || !EMAIL_PATTERN.test(input.email.trim().toLowerCase())) return "email";
  if (input.details.trim().length < MIN_DETAILS_LENGTH) return "details";
  if (!input.turnstileToken.trim()) return "turnstile";
  const startedAt = input.startedAt;
  if (!Number.isFinite(startedAt) || now - startedAt < MIN_SUBMIT_DELAY_MS || now - startedAt > MAX_FORM_AGE_MS) {
    return "timing";
  }
  return null;
}
