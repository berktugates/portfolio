import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { blogPosts, getBlogPage, getBlogTotalPages } from "./data/blogs";
import {
  blogPostPath,
  blogsIndexPath,
  hirePath,
  hireServicePath,
  pathHreflangLanguages,
  projectLegalPath,
  projectPath,
} from "./lib/content/paths";
import { LOCALES, hreflangLanguages, localeMeta, localeUrl } from "./lib/i18n";
import { SITE_LAST_MODIFIED, absoluteUrl } from "./lib/seo";
import { SERVICE_SLUGS } from "./lib/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLanguages = hreflangLanguages();
  const totalPages = getBlogTotalPages();

  const localeHomes = LOCALES.map((locale) => ({
    url: localeUrl(locale),
    lastModified: SITE_LAST_MODIFIED,
    alternates: { languages: homeLanguages },
  }));

  const hireLanguages = pathHreflangLanguages("/hire");
  const localeHires = LOCALES.map((locale) => ({
    url: absoluteUrl(hirePath(locale)),
    lastModified: SITE_LAST_MODIFIED,
    alternates: { languages: hireLanguages },
  }));

  const hireServiceEntries = SERVICE_SLUGS.flatMap((service) => {
    const languages = pathHreflangLanguages(`/hire/${service}`);
    return LOCALES.map((locale) => ({
      url: absoluteUrl(hireServicePath(locale, service)),
      lastModified: SITE_LAST_MODIFIED,
      alternates: { languages },
    }));
  });

  const projectEntries = projects.flatMap((project) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(projectPath(locale, project.slug)),
      lastModified: SITE_LAST_MODIFIED,
      alternates: {
        languages: Object.fromEntries([
          ["x-default", absoluteUrl(projectPath("en", project.slug))],
          ...LOCALES.map((targetLocale) => [
            localeMeta[targetLocale].hreflang,
            absoluteUrl(projectPath(targetLocale, project.slug)),
          ]),
        ]),
      },
    })),
  );
  const legalEntries = projects.flatMap((project) =>
    project.legal
      ? LOCALES.flatMap((locale) =>
          (["privacy", "terms"] as const).map((document) => ({
            url: absoluteUrl(projectLegalPath(locale, project.slug, document)),
            lastModified: SITE_LAST_MODIFIED,
            alternates: {
              languages: Object.fromEntries([
                ["x-default", absoluteUrl(projectLegalPath("en", project.slug, document))],
                ...LOCALES.map((targetLocale) => [
                  localeMeta[targetLocale].hreflang,
                  absoluteUrl(projectLegalPath(targetLocale, project.slug, document)),
                ]),
              ]),
            },
          })),
        )
      : [],
  );

  const blogIndexEntries = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return LOCALES.map((locale) => ({
      url: absoluteUrl(blogsIndexPath(locale, page)),
      lastModified: getBlogPage(page)[0]?.publishedAt,
      alternates: {
        languages: Object.fromEntries([
          ["x-default", absoluteUrl(blogsIndexPath("en", page))],
          ...LOCALES.map((targetLocale) => [
            localeMeta[targetLocale].hreflang,
            absoluteUrl(blogsIndexPath(targetLocale, page)),
          ]),
        ]),
      },
    }));
  }).flat();

  const blogPostEntries = blogPosts.flatMap((post) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(blogPostPath(locale, post.slug)),
      lastModified: post.publishedAt,
      alternates: {
        languages: Object.fromEntries([
          ["x-default", absoluteUrl(blogPostPath("en", post.slug))],
          ...LOCALES.map((targetLocale) => [
            localeMeta[targetLocale].hreflang,
            absoluteUrl(blogPostPath(targetLocale, post.slug)),
          ]),
        ]),
      },
    })),
  );

  return [
    ...localeHomes,
    ...localeHires,
    ...hireServiceEntries,
    ...projectEntries,
    ...legalEntries,
    ...blogIndexEntries,
    ...blogPostEntries,
  ];
}
