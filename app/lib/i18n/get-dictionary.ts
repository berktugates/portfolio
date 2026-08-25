import type { Locale } from "./config";
import type { HomeDictionary } from "./types";

const loaders: Record<Locale, () => Promise<{ default: HomeDictionary }>> = {
  en: () => import("./dictionaries/en"),
  tr: () => import("./dictionaries/tr"),
  de: () => import("./dictionaries/de"),
  fr: () => import("./dictionaries/fr"),
  it: () => import("./dictionaries/it"),
  zh: () => import("./dictionaries/zh"),
  ja: () => import("./dictionaries/ja"),
};

/** Load only the requested locale dictionary (code-split per language). */
export async function getDictionary(locale: Locale): Promise<HomeDictionary> {
  const mod = await loaders[locale]();
  return mod.default;
}
