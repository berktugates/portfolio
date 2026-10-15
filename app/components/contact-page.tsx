import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { LanguageSwitcher } from "./language-switcher";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { contactPath, pathHreflangLanguages } from "../lib/content/paths";
import { type Locale, getDictionary, localeMeta, localePath } from "../lib/i18n";
import { getContactPageCopy } from "../lib/i18n/contact-page-copy";
import { absoluteUrl, visibleAuthorMeta } from "../lib/seo";

export async function createContactMetadata(locale: Locale): Promise<Metadata> {
  const copy = getContactPageCopy(locale);
  const dict = await getDictionary(locale);
  const url = absoluteUrl(contactPath(locale));

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    ...visibleAuthorMeta(dict.headerName),
    alternates: {
      canonical: url,
      languages: pathHreflangLanguages("/contact"),
    },
    openGraph: {
      type: "website",
      locale: localeMeta[locale].ogLocale,
      url,
      siteName: dict.headerName,
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export async function ContactPage({ locale }: { locale: Locale }) {
  const [dict, copy] = await Promise.all([getDictionary(locale), Promise.resolve(getContactPageCopy(locale))]);
  const meta = localeMeta[locale];
  const homeHref = localePath(locale);
  const cjk = locale === "zh" || locale === "ja";

  return (
    <div
      lang={meta.htmlLang}
      dir={meta.dir}
      className={`mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-4 pt-20${cjk ? " font-sans tracking-normal" : ""}`}
      style={
        cjk
          ? {
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans", "Noto Sans SC", "Noto Sans JP", "Microsoft YaHei", sans-serif',
            }
          : undefined
      }
    >
      <SiteHeader
        homeHref={homeHref}
        name={dict.headerName}
        role={dict.headerRole}
        ariaLabel={dict.headerAriaLabel}
        contactLabel={dict.contact}
        contactHref={contactPath(locale)}
      />
      <main className="flex-1 pb-12">
        <h1 className="text-2xl font-medium text-zinc-950 dark:text-zinc-50">{copy.h1}</h1>
        <p className="mb-8 mt-3 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">{copy.intro}</p>
        <ContactForm locale={locale} copy={copy} />
      </main>
      <SiteFooter name={dict.headerName}>
        <LanguageSwitcher locale={locale} />
      </SiteFooter>
    </div>
  );
}
