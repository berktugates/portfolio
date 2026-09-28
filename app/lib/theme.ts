export const THEME_STORAGE_KEY = "theme";
export const THEME_COOKIE_NAME = "site-theme";

export type ThemePreference = "light" | "dark" | "system";

export function parseThemePreference(raw: string | null | undefined): ThemePreference {
  if (raw === "light" || raw === "dark") return raw;
  return "system";
}

/** Inline head script: must stay in sync with resolveDarkFromStoredValue below. */
export const THEME_INLINE_BOOTSTRAP_SCRIPT = `(function(){try{var k='${THEME_STORAGE_KEY}',c='${THEME_COOKIE_NAME}';var p=localStorage.getItem(k);if(p!=='light'&&p!=='dark'){var m=document.cookie.match(new RegExp('(?:^|; )'+c+'=([^;]*)'));var v=m?decodeURIComponent(m[1]):'';if(v==='light'||v==='dark')p=v;else p=null}var d=p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})();`;

export function prefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveDarkFromPreference(pref: ThemePreference): boolean {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return prefersDark();
}

export function readThemePreference(): ThemePreference {
  try {
    return parseThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

function themeCookieDomain(): string | undefined {
  const host = location.hostname;
  if (host === "berktugberke.com" || host.endsWith(".berktugberke.com")) {
    return ".berktugberke.com";
  }
  return undefined;
}

export function writeThemePreference(pref: ThemePreference): void {
  try {
    if (pref === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* private mode / blocked storage */
  }
  try {
    const domain = themeCookieDomain();
    const domainAttr = domain ? `; domain=${domain}` : "";
    document.cookie = `${THEME_COOKIE_NAME}=${encodeURIComponent(pref)}; path=/; max-age=31536000; SameSite=Lax${domainAttr}`;
  } catch {
    /* ignore */
  }
}

export function applyThemePreference(pref: ThemePreference): void {
  const dark = resolveDarkFromPreference(pref);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}
