import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-tr";
import { projectCopies } from "./projects-shared";
import ui from "./ui-tr";
import { projectLegalCopies } from "./legal-shared";

const content: LocaleContentModule = {
  projects: projectCopies.tr,
  blogs,
  legal: projectLegalCopies.tr,
  ui,
};

export default content;
