import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { blogPosts } from "./data/blogs";
import { blogHreflangLocalesForSlug, blogIndexHreflangLocales, blogIndexPageCount } from "./lib/content/blog-locale-overlay";
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
import { absoluteUrl } from "./lib/seo";
import { SERVICE_SLUGS } from "./lib/services";

export const dynamic = "force-static";
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLanguages = hreflangLanguages();
  const totalPages = Math.max(...LOCALES.map((locale) => blogIndexPageCount(locale)));

  // Home and hire lastmod used a single hand-edited stamp, not a per-template change time.
  // Omitting the field is the honest signal. Blog entries keep their own dates.
  const localeHomes = LOCALES.map((locale) => ({
    url: localeUrl(locale),
    alternates: { languages: homeLanguages },
  }));

  const hireLanguages = pathHreflangLanguages("/hire");
  const localeHires = LOCALES.map((locale) => ({
    url: absoluteUrl(hirePath(locale)),
    alternates: { languages: hireLanguages },
  }));

  const hireServiceEntries = SERVICE_SLUGS.flatMap((service) => {
    const languages = pathHreflangLanguages(`/hire/${service}`);
    return LOCALES.map((locale) => ({
      url: absoluteUrl(hireServicePath(locale, service)),
      alternates: { languages },
    }));
  });

  const projectEntries = projects.flatMap((project) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(projectPath(locale, project.slug)),
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
    return LOCALES.filter((locale) => blogIndexPageCount(locale) >= page).map((locale) => {
      const siblings = blogIndexHreflangLocales(locale, page);
      return {
        url: absoluteUrl(blogsIndexPath(locale, page)),
        alternates: {
          languages: Object.fromEntries([
            ["x-default", absoluteUrl(blogsIndexPath(siblings.includes("en") ? "en" : locale, page))],
            ...siblings.map((targetLocale) => [
              localeMeta[targetLocale].hreflang,
              absoluteUrl(blogsIndexPath(targetLocale, page)),
            ]),
          ]),
        },
      };
    });
  }).flat();

  const blogPostEntries = blogPosts.flatMap((post) => {
    const locales = blogHreflangLocalesForSlug(post.slug);
    return locales.map((locale) => ({
      url: absoluteUrl(blogPostPath(locale, post.slug)),
      lastModified: post.dateModified ?? post.publishedAt,
      alternates: {
        languages: Object.fromEntries([
          ["x-default", absoluteUrl(blogPostPath("en", post.slug))],
          ...locales.map((targetLocale) => [
            localeMeta[targetLocale].hreflang,
            absoluteUrl(blogPostPath(targetLocale, post.slug)),
          ]),
        ]),
      },
    }));
  });

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
