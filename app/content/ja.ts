import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-ja";
import { projectCopies } from "./projects-shared";
import ui from "./ui-ja";
import { projectLegalCopies } from "./legal-shared";

const content: LocaleContentModule = {
  projects: projectCopies.ja,
  blogs,
  legal: projectLegalCopies.ja,
  ui,
};

export default content;
