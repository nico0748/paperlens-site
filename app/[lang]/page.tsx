import "./landing.css";
import { notFound } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { StackStrip } from "@/components/landing/StackStrip";
import { Features } from "@/components/landing/Features";
import { Privacy } from "@/components/landing/Privacy";
import { Download } from "@/components/landing/Download";
import { SharedBand } from "@/components/landing/SharedBand";
import { getDictionary, hasLocale } from "@/lib/i18n";

/** 流れ: ヒーロー（すぐ入手）→ つながる道具 → できること → 手元と外の比較 → ダウンロード → 共有データ */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <Hero dict={dict} />
      <StackStrip t={dict.stack} />
      <Features t={dict.features} />
      <Privacy t={dict.privacy} />
      <Download t={dict.download} />
      <SharedBand lang={lang} t={dict.sharedBand} />
    </>
  );
}
