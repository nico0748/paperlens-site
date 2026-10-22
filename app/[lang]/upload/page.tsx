import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Notice } from "@/components/Notice";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { maxUploadBytes } from "@/lib/storage";
import { getViewer } from "@/lib/viewer";
import { UploadForm } from "./UploadForm";
import "../shared/shared.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/upload">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).upload.title } : {};
}

export default async function UploadPage({ params }: PageProps<"/[lang]/upload">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.upload;

  const viewer = await getViewer();
  if (!viewer) redirect(`/${lang}/login?callbackUrl=/${lang}/upload`);

  const crumbs = [
    { label: dict.common.home, href: `/${lang}` },
    { label: dict.shared.title, href: `/${lang}/shared` },
    { label: t.title },
  ];

  if (!viewer.isAdmin) {
    return (
      <div className="page">
        <div className="container narrow">
          <Breadcrumb label={dict.common.breadcrumb} items={crumbs} />
          <h1>{t.forbiddenTitle}</h1>
          <Notice kind="error" role="alert">
            <p>{t.forbidden}</p>
          </Notice>
          <p>
            <Link href={`/${lang}/shared`}>{t.backToList}</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container narrow">
        <Breadcrumb label={dict.common.breadcrumb} items={crumbs} />
        <h1>{t.title}</h1>
        <p className="lead">{t.lead}</p>
        <UploadForm maxBytes={maxUploadBytes()} lang={lang} t={t} />
        <p>
          <Link href={`/${lang}/shared#zip-format`}>{t.aboutZip}</Link>
        </p>
      </div>
    </div>
  );
}
