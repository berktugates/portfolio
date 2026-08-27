import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-fr";
import { projectCopies } from "./projects-shared";
import ui from "./ui-fr";
import { projectLegalCopies } from "./legal-shared";

const content: LocaleContentModule = {
  projects: projectCopies.fr,
  blogs,
  legal: projectLegalCopies.fr,
  ui,
};

export default content;
