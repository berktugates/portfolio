import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-tr";
import { projectCopies } from "./projects-shared";
import ui from "./ui-tr";

const content: LocaleContentModule = {
  projects: projectCopies.tr,
  blogs,
  ui,
};

export default content;
