import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-de";
import { projectCopies } from "./projects-shared";
import ui from "./ui-de";

const content: LocaleContentModule = {
  projects: projectCopies.de,
  blogs,
  ui,
};

export default content;
