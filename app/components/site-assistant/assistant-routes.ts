import { isLocale } from "../../lib/i18n";

/** FAB + bottom-right dock (blogs, project detail, legal docs under /projects/...). */
export function usesFabAssistant(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return false;

  const [first, second] = segments;

  if (first === "blogs") return true;
  if (isLocale(first) && second === "blogs") return true;

  if (first === "projects") return segments.length >= 2;
  if (isLocale(first) && second === "projects") return segments.length >= 3;

  return false;
}
