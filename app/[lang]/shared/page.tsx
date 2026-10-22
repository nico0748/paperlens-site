import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DownloadIcon } from "@/components/icons";
import { Notice } from "@/components/Notice";
import { formatBytes, formatDate } from "@/lib/format";
import { fill, getDictionary, hasLocale } from "@/lib/i18n";
import { listShared, type SharedItem } from "@/lib/storage";
import { getViewer } from "@/lib/viewer";
import { DeleteButton } from "./DeleteButton";
import "./shared.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/shared">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).shared.title } : {};
}

export default async function SharedPage({ params }: PageProps<"/[lang]/shared">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.shared;

  const viewer = await getViewer();
  if (!viewer) redirect(`/${lang}/login?callbackUrl=/${lang}/shared`);

  let items: SharedItem[] = [];
  let loadError = false;
  try {
    items = await listShared();
  } catch {
    loadError = true;
  }

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb label={dict.common.breadcrumb} items={[{ label: dict.common.home, href: `/${lang}` }, { label: t.title }]} />
        <div className="page-head">
          <div>
            <h1>{t.title}</h1>
            <p className="lead">{t.lead}</p>
          </div>
          {viewer.isAdmin && (
            <Link href={`/${lang}/upload`} className="btn btn-primary">
              {t.upload}
            </Link>
          )}
        </div>

        {loadError && (
          <Notice kind="error" title={t.loadErrorTitle} role="alert">
            <p>{t.loadError}</p>
          </Notice>
        )}

        {!loadError && items.length === 0 && (
          <Notice>
            <p>{t.empty}</p>
          </Notice>
        )}

        {items.length > 0 && (
          <ul className="shared-list" aria-label={t.listLabel}>
            {items.map((item) => (
              <li key={item.id} className="card shared-item">
                <h2 className="shared-title">{item.title}</h2>
                {item.description && <p className="shared-desc">{item.description}</p>}
                <dl className="shared-meta">
                  <div>
                    <dt>{t.papers}</dt>
                    <dd>
                      {item.layout === "single" ? t.singleFolder : fill(t.paperCount, { count: item.paperCount })}
                      {item.hasTemplates && t.withTemplates}
                    </dd>
                  </div>
                  <div>
                    <dt>{t.size}</dt>
                    <dd>{formatBytes(item.size)}</dd>
                  </div>
                  <div>
                    <dt>{t.uploadedBy}</dt>
                    <dd>{item.uploadedBy}</dd>
                  </div>
                  <div>
                    <dt>{t.uploadedAt}</dt>
                    <dd>
                      <time dateTime={item.uploadedAt}>{formatDate(item.uploadedAt, lang)}</time>
                    </dd>
                  </div>
                </dl>
                {item.papers.length > 0 && (
                  <details className="paper-details">
                    <summary>{t.showPapers}</summary>
                    <ul className="paper-list">
                      {item.papers.map((p) => (
                        <li key={p.id}>
                          {p.title ? (
                            <>
                              <span className="paper-title">{p.title}</span> <code>{p.id}</code>
                            </>
                          ) : (
                            <code>{p.id}</code>
                          )}
                        </li>
                      ))}
                      {item.paperCount > item.papers.length && (
                        <li>{fill(t.morePapers, { count: item.paperCount - item.papers.length })}</li>
                      )}
                    </ul>
                  </details>
                )}
                <div className="shared-actions">
                  <a
                    href={`/api/shared/${item.id}/download`}
                    className="btn btn-primary"
                    download={item.filename}
                    aria-label={fill(t.downloadLabel, { title: item.title, size: formatBytes(item.size) })}
                  >
                    <DownloadIcon />
                    {t.download}
                  </a>
                  {viewer.isAdmin && (
                    <DeleteButton
                      id={item.id}
                      lang={lang}
                      labels={{
                        delete: t.delete,
                        deleting: t.deleting,
                        label: fill(t.deleteLabel, { title: item.title }),
                        confirm: fill(t.deleteConfirm, { title: item.title }),
                      }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <section className="card how-to" aria-labelledby="how-to-heading" id="zip-format">
          <h2 id="how-to-heading">{t.howToTitle}</h2>
          <p>{t.howToIntro}</p>
          <pre>{t.howToLayout.join("\n")}</pre>
          <ol>
            {t.howToSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p>{t.howToOverwrite}</p>
          <p className="hint">{t.howToLicense}</p>
        </section>
      </div>
    </div>
  );
}
