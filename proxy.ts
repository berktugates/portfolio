import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { HABERLER_ORIGIN, isHaberlerHost } from "./app/lib/gundem/hosts";

const PROD_REDIRECT_GUNDEM = process.env.VERCEL_ENV === "production";
const APEX_HOST = "berktugberke.com";
const RETIRED_LEGACY_NEWS_SLUGS = new Set([
  // The former Trends-based generator produced a generic template for this URL,
  // not a verifiable news report. Keep an explicit tombstone so crawlers do not
  // mistake an intentionally retired page for a transient routing failure.
  "turkiye-mauro-icardi-brifing",
]);

function hostnameOf(host: string) {
  return host.split(":")[0]?.toLowerCase() ?? "";
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  if (hostnameOf(host) === `www.${APEX_HOST}`) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = APEX_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  if (isHaberlerHost(host)) {
    if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
      return NextResponse.next();
    }
    if (pathname === "/ads.txt") return NextResponse.next();
    if (pathname === "/robots.txt") return NextResponse.rewrite(new URL("/gundem/robots.txt", request.url));
    if (pathname === "/llms.txt") return NextResponse.rewrite(new URL("/gundem/llms.txt", request.url));
    if (pathname === "/sitemap.xml") return NextResponse.rewrite(new URL("/sitemap-haberler.xml", request.url));
    if (pathname === "/sitemap-news.xml") return NextResponse.next();
    if (pathname === "/sitemap-gundem.xml") {
      return NextResponse.rewrite(new URL("/sitemap-news.xml", request.url));
    }
    if (pathname === "/rss.xml" || pathname === "/gundem/rss.xml") {
      return NextResponse.rewrite(new URL("/gundem/rss.xml", request.url));
    }
    if (pathname === "/" || pathname === "/gundem") {
      return NextResponse.rewrite(new URL("/gundem", request.url));
    }
    if (pathname.startsWith("/kategori/")) {
      return NextResponse.rewrite(new URL(`/gundem${pathname}`, request.url));
    }
    if (["/kunye", "/editorial-policy", "/duzeltme-talebi"].includes(pathname) || pathname.startsWith("/yazar/")) {
      return NextResponse.rewrite(new URL(`/gundem${pathname}`, request.url));
    }
    if (pathname.startsWith("/gundem/")) {
      return NextResponse.next();
    }
    if (!pathname.includes(".") && pathname.length > 1) {
      const slug = pathname.replace(/^\//, "");
      if (RETIRED_LEGACY_NEWS_SLUGS.has(slug)) {
        return new NextResponse("Bu eski içerik kalıcı olarak yayından kaldırılmıştır.", {
          status: 410,
          headers: {
            "Cache-Control": "public, max-age=300, s-maxage=3600",
            "Content-Type": "text/plain; charset=utf-8",
            "X-Robots-Tag": "noindex, noarchive",
          },
        });
      }
      return NextResponse.rewrite(new URL(`/gundem/${slug}`, request.url));
    }
    return NextResponse.next();
  }

  if (!PROD_REDIRECT_GUNDEM) {
    return NextResponse.next();
  }

  if (pathname === "/gundem" || pathname.startsWith("/gundem/")) {
    const suffix = pathname.replace(/^\/gundem/, "") || "/";
    const target = new URL(suffix, HABERLER_ORIGIN);
    return NextResponse.redirect(target, 308);
  }
  if (pathname === "/sitemap-gundem.xml") {
    return NextResponse.redirect(new URL("/sitemap.xml", HABERLER_ORIGIN), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/robots.txt", "/llms.txt", "/((?!_next/static|_next/image|.*\\.(?:ico|png|webp|svg|json)$).*)"],
};
