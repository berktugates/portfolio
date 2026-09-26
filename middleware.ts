import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { HABERLER_ORIGIN, isHaberlerHost } from "./app/lib/gundem/hosts";

const PROD_REDIRECT_GUNDEM = process.env.VERCEL_ENV === "production";
const APEX_HOST = "berktugberke.com";

function hostnameOf(host: string) {
  return host.split(":")[0]?.toLowerCase() ?? "";
}

export function middleware(request: NextRequest) {
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
    if (pathname === "/sitemap.xml" || pathname === "/sitemap-gundem.xml") {
      return NextResponse.rewrite(new URL("/sitemap-gundem.xml", request.url));
    }
    if (pathname === "/rss.xml" || pathname === "/gundem/rss.xml") {
      return NextResponse.rewrite(new URL("/gundem/rss.xml", request.url));
    }
    if (pathname === "/" || pathname === "/gundem") {
      return NextResponse.rewrite(new URL("/gundem", request.url));
    }
    if (pathname.startsWith("/gundem/")) {
      return NextResponse.next();
    }
    if (!pathname.includes(".") && pathname.length > 1) {
      const slug = pathname.replace(/^\//, "");
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
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:ico|png|webp|svg|txt|json)$).*)"],
};
