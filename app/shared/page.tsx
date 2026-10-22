import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatBytes, formatDate } from "@/lib/format";
import { listShared, type SharedItem } from "@/lib/storage";
import { getViewer } from "@/lib/viewer";
import { DeleteButton } from "./DeleteButton";
import "./shared.css";

export const metadata: Metadata = { title: "共有データ" };

export default async function SharedPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login?callbackUrl=/shared");

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
        <div className="page-head">
          <div>
            <h1>共有データ</h1>
            <p className="lead">PaperLens で読み込める論文データを、ZIP でダウンロードできます。</p>
          </div>
          {viewer.isAdmin && (
            <Link href="/upload" className="btn btn-primary">
              アップロード
            </Link>
          )}
        </div>

        {loadError && (
          <div className="notice error" role="alert">
            <p>一覧を読み込めませんでした。時間をおいて、ページを開き直してください。</p>
          </div>
        )}

        {!loadError && items.length === 0 && (
          <div className="notice">
            <p>共有データはまだありません。</p>
          </div>
        )}

        {items.length > 0 && (
          <ul className="shared-list" aria-label="共有データの一覧">
            {items.map((item) => (
              <li key={item.id} className="card shared-item">
                <h2 className="shared-title">{item.title}</h2>
                {item.description && <p className="shared-desc">{item.description}</p>}
                <dl className="shared-meta">
                  <div>
                    <dt>含まれる論文</dt>
                    <dd>
                      {item.layout === "single" ? "論文フォルダ 1 本" : `${item.paperCount} 本`}
                      {item.hasTemplates && "（テンプレート付き）"}
                    </dd>
                  </div>
                  <div>
                    <dt>大きさ</dt>
                    <dd>{formatBytes(item.size)}</dd>
                  </div>
                  <div>
                    <dt>アップロードした人</dt>
                    <dd>{item.uploadedBy}</dd>
                  </div>
                  <div>
                    <dt>日時</dt>
                    <dd>
                      <time dateTime={item.uploadedAt}>{formatDate(item.uploadedAt)}</time>
                    </dd>
                  </div>
                </dl>
                {item.papers.length > 0 && (
                  <details className="paper-details">
                    <summary>論文の一覧を見る</summary>
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
                        <li>ほか {item.paperCount - item.papers.length} 本</li>
                      )}
                    </ul>
                  </details>
                )}
                <div className="shared-actions">
                  <a
                    href={`/api/shared/${item.id}/download`}
                    className="btn btn-primary"
                    download={item.filename}
                    aria-label={`「${item.title}」をダウンロード（${formatBytes(item.size)}）`}
                  >
                    ダウンロード
                  </a>
                  {viewer.isAdmin && <DeleteButton id={item.id} title={item.title} />}
                </div>
              </li>
            ))}
          </ul>
        )}

        <section className="card how-to" aria-labelledby="how-to-heading" id="zip-format">
          <h2 id="how-to-heading">ZIP の使い方</h2>
          <p>ZIP の中身は、PaperLens の保管庫と同じ並びになっています。</p>
          <pre>
            {[
              "papers/<論文ID>/paper.pdf        原文の PDF（必ず入っています）",
              "papers/<論文ID>/note.md          読解ノート",
              "papers/<論文ID>/paperlens.json   マーカー・用語・数式",
              "papers/<論文ID>/sentences.json   1 文ずつの対訳",
            ].join("\n")}
          </pre>
          <ol>
            <li>ZIP をダウンロードして展開します。</li>
            <li>
              展開してできた <code>papers</code> フォルダの中身を、保管庫の <code>papers</code> フォルダへ移します。
              保管庫の場所は、PaperLens の設定画面で確かめられます。
            </li>
            <li>PaperLens を開いていれば、論文一覧に自動で加わります。出てこないときは、アプリを開き直してください。</li>
          </ol>
          <p>
            同じ論文 ID のフォルダが既にあるときは、上書きする前に中身を確かめてください。ZIP が
            <code>&lt;論文ID&gt;/paper.pdf</code> の形（論文フォルダ 1 本）のときは、そのフォルダを
            <code>papers</code> の中へ移します。
          </p>
          <p className="hint">
            共有された PDF は、元の論文の利用条件に従って扱ってください。再配布できないものもあります。
          </p>
        </section>
      </div>
    </div>
  );
}
