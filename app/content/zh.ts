import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-zh";
import { projectCopies } from "./projects-shared";
import ui from "./ui-zh";
import { projectLegalCopies } from "./legal-shared";

const content: LocaleContentModule = {
  projects: projectCopies.zh,
  blogs,
  legal: projectLegalCopies.zh,
  ui,
};

export default content;
