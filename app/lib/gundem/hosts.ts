/** Public origin for Turkish briefings (subdomain). */
export const HABERLER_ORIGIN =
  process.env.NEXT_PUBLIC_HABERLER_URL ?? "https://haberler.berktugberke.com";

const HABERLER_HOSTS = new Set([
  "haberler.berktugberke.com",
  "haberler.localhost",
]);

export function isHaberlerHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const bare = host.split(":")[0].toLowerCase();
  return HABERLER_HOSTS.has(bare);
}

export function haberlerUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, HABERLER_ORIGIN).toString();
}

export function haberlerArticlePath(slug: string): string {
  return `/${slug}`;
}
