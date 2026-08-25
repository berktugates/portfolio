import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-fr";
import { projectCopies } from "./projects-shared";
import ui from "./ui-fr";

const content: LocaleContentModule = {
  projects: projectCopies.fr,
  blogs,
  ui,
};

export default content;
