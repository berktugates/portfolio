import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-de";
import { projectCopies } from "./projects-shared";
import ui from "./ui-de";
import { projectLegalCopies } from "./legal-shared";

const content: LocaleContentModule = {
  projects: projectCopies.de,
  blogs,
  legal: projectLegalCopies.de,
  ui,
};

export default content;
