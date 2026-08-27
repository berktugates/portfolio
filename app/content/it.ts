import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-it";
import { projectCopies } from "./projects-shared";
import ui from "./ui-it";
import { projectLegalCopies } from "./legal-shared";

const content: LocaleContentModule = {
  projects: projectCopies.it,
  blogs,
  legal: projectLegalCopies.it,
  ui,
};

export default content;
