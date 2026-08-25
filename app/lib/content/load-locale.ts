import type { Locale } from "../i18n/config";
import type { LocaleContentModule } from "./types";

const loaders: Record<Locale, () => Promise<{ default: LocaleContentModule }>> = {
  en: () => import("../../content/en"),
  tr: () => import("../../content/tr"),
  de: () => import("../../content/de"),
  fr: () => import("../../content/fr"),
  it: () => import("../../content/it"),
  zh: () => import("../../content/zh"),
  ja: () => import("../../content/ja"),
};

export async function getLocaleContent(locale: Locale): Promise<LocaleContentModule> {
  const mod = await loaders[locale]();
  return mod.default;
}
