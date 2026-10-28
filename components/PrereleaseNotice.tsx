import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { Breadcrumb } from "./Breadcrumb";
import { Notice } from "./Notice";

/** ログイン・共有データ・アップロードのページの代わりに出す、プレリリース準備中の案内 */
export function PrereleaseNotice({ lang, dict, title }: { lang: string; dict: Dictionary; title: string }) {
  const t = dict.prerelease;
  return (
    <div className="page page-center">
      <div className="container narrow">
        <Breadcrumb label={dict.common.breadcrumb} items={[{ label: dict.common.home, href: `/${lang}` }, { label: title }]} />
        <h1>{title}</h1>
        <Notice kind="info" title={t.title} role="status">
          <p>{t.body}</p>
        </Notice>
        <p>
          <Link href={`/${lang}`} className="btn btn-secondary">
            {t.back}
          </Link>
        </p>
      </div>
    </div>
  );
}
