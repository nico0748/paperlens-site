import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Noto_Sans_JP, Noto_Sans_Mono } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

// DADS の基本書体（Noto Sans JP / Noto Sans Mono）
const sans = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-noto-sans" });
const mono = Noto_Sans_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-noto-mono" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: { default: t.title, template: `%s | ${site.name}` },
    description: t.description,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <SiteHeader lang={lang} dict={dict} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter lang={lang} dict={dict} />
      </body>
    </html>
  );
}
