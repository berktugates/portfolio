import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-it";
import { projectCopies } from "./projects-shared";
import ui from "./ui-it";

const content: LocaleContentModule = {
  projects: projectCopies.it,
  blogs,
  ui,
};

export default content;
