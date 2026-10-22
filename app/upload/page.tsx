import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { maxUploadBytes } from "@/lib/storage";
import { getViewer } from "@/lib/viewer";
import { UploadForm } from "./UploadForm";
import "../shared/shared.css";

export const metadata: Metadata = { title: "共有データのアップロード" };

export default async function UploadPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login?callbackUrl=/upload");

  if (!viewer.isAdmin) {
    return (
      <div className="page">
        <div className="container narrow">
          <h1>アップロードできません</h1>
          <div className="notice error" role="alert">
            <p>共有データのアップロードは、管理者だけができます（403）。</p>
          </div>
          <p>
            <Link href="/shared">共有データの一覧へ戻る</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container narrow">
        <h1>共有データのアップロード</h1>
        <p className="lead">PaperLens の論文フォルダをまとめた ZIP を登録します。</p>
        <UploadForm maxBytes={maxUploadBytes()} />
        <p>
          <Link href="/shared#zip-format">ZIP の形について</Link>
        </p>
      </div>
    </div>
  );
}
