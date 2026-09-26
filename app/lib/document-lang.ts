import { workAsyncStorage } from "next/dist/server/app-render/work-async-storage.external";
import { htmlLangFromPathname } from "./i18n/config";

/**
 * `headers()` opts every route into dynamic rendering. The render store already
 * knows the route template while the page is prerendered, so the lang attribute
 * can be baked into the static HTML without a request-time API.
 */
export function documentLang(): string {
  const route = workAsyncStorage.getStore()?.route ?? "/";
  return htmlLangFromPathname(route);
}
