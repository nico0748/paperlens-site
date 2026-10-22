import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ArrowRightIcon } from "../icons";

/** ページの締めの帯。共有データへ案内する */
export function SharedBand({ lang, t }: { lang: Locale; t: Dictionary["sharedBand"] }) {
  return (
    <section className="lp-band" aria-labelledby="shared-title">
      <div className="container">
        <div className="lp-band-inner">
          <div>
            <p className="lp-eyebrow">{t.eyebrow}</p>
            <h2 id="shared-title" className="lp-h2">
              {t.title}
            </h2>
            <p className="lp-band-body">{t.body}</p>
          </div>
          <Link href={`/${lang}/shared`} className="btn btn-primary btn-lg">
            {t.cta}
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
