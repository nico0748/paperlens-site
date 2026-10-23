import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Noto_Sans_Mono, Noto_Serif_JP } from "next/font/google";
import "../globals.css";
import { AdobeFonts } from "@/components/AdobeFonts";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

// 本文は筑紫明朝（Adobe Fonts）。キットが無いときや読み込む前は、無料の明朝（Noto Serif JP）で出す
const serif = Noto_Serif_JP({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-noto-serif" });
const mono = Noto_Sans_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-noto-mono" });

/** Adobe Fonts のキット ID（英数字だけ）。未設定なら筑紫明朝は読まない */
const adobeFontsKit = /^[a-z0-9]+$/i.test(process.env.ADOBE_FONTS_KIT_ID ?? "") ? process.env.ADOBE_FONTS_KIT_ID! : null;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

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
    <html lang={lang} className={`${serif.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <SiteHeader lang={lang} dict={dict} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter lang={lang} dict={dict} />
        {adobeFontsKit && <AdobeFonts kitId={adobeFontsKit} />}
      </body>
    </html>
  );
}
