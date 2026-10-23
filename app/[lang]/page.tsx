import "./landing.css";
import { notFound } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { StackStrip } from "@/components/landing/StackStrip";
import { Features } from "@/components/landing/Features";
import { Screens } from "@/components/landing/Screens";
import { Privacy } from "@/components/landing/Privacy";
import { Download } from "@/components/landing/Download";
import { Closing } from "@/components/landing/Closing";
import { Motion } from "@/components/landing/Motion";
import { getDictionary, hasLocale } from "@/lib/i18n";

/**
 * 流れ（紺と白を交互に）:
 * ヒーロー（紺）→ つながる道具（白）→ できること（白）→ 実際の画面（紺）→ プライバシー（淡）→ ダウンロード（白）→ 締め（紺）
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const k = dict.landing.kickers;

  return (
    <>
      <Hero dict={dict} />
      <StackStrip t={dict.stack} />
      <Features t={dict.features} kicker={k.features} />
      <Screens dict={dict} />
      <Privacy t={dict.privacy} kicker={k.privacy} />
      <Download lang={lang} dict={dict} />
      <Closing dict={dict} />
      <Motion />
    </>
  );
}
