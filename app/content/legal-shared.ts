import { projectLegalDocuments as en } from "../data/project-legal";
import tr from "./legal-tr";
import de from "./legal-de";
import fr from "./legal-fr";
import it from "./legal-it";
import zh from "./legal-zh";
import ja from "./legal-ja";
import type { Locale } from "../lib/i18n/config";
import type { ProjectLegalLocaleMap } from "../lib/content/types";

export const projectLegalCopies: Record<Locale, ProjectLegalLocaleMap> = {
  en,
  tr,
  de,
  fr,
  it,
  zh,
  ja,
};
