import type { LocaleContentModule } from "../lib/content/types";
import blogs from "./blogs-ja";
import { projectCopies } from "./projects-shared";
import ui from "./ui-ja";

const content: LocaleContentModule = {
  projects: projectCopies.ja,
  blogs,
  ui,
};

export default content;
