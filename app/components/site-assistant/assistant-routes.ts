import { stripLocalePrefix } from "../../lib/content/paths";

/** FAB + bottom-right dock (blogs, project detail, legal docs under /projects/...). */
export function usesFabAssistant(pathname: string): boolean {
  const normalized = stripLocalePrefix(pathname.replace(/\/$/, "") || "/");
  if (normalized === "/blogs" || normalized.startsWith("/blogs/")) return true;
  const segments = normalized.split("/").filter(Boolean);
  return segments[0] === "projects" && segments.length >= 2;
}
