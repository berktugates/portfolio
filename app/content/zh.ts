import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-zh";
import { projectCopies } from "./projects-shared";
import ui from "./ui-zh";

const content: LocaleContentModule = {
  projects: projectCopies.zh,
  blogs,
  ui,
};

export default content;
