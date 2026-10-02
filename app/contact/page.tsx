import type { Metadata } from "next";
import { ContactForm } from "../components/contact-form";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Berktuğ Berke Ateş ile yazılım projesi, iş birliği veya ürün geliştirme hakkında iletişime geçin.",
  alternates: { canonical: "https://berktugberke.com/contact" },
};

export default function ContactPage() {
  return (
    <div lang="tr" className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col px-4 pt-20">
      <SiteHeader
        homeHref="/tr"
        name="Berktuğ Berke Ateş"
        role="Yazılım Mühendisi"
        ariaLabel="Berktuğ Berke Ateş ana sayfa"
        contactLabel="İletişim"
      />
      <main className="flex-1">
        <h1 className="text-2xl font-medium text-zinc-950 dark:text-zinc-50">İletişim</h1>
        <p className="mb-8 mt-3 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Projenizi kısaca anlatın. Yanıt verebilmem için kendi e-posta adresinizi doğru yazın.
        </p>
        <ContactForm />
      </main>
      <SiteFooter name="Berktuğ Berke Ateş" />
    </div>
  );
}
