"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { formatBytes } from "@/lib/format";
import { blobReader, inspectZip, type ZipSummary } from "@/lib/zip/inspect";

type Check =
  | { state: "none" }
  | { state: "checking" }
  | { state: "ok"; summary: ZipSummary }
  | { state: "error"; errors: string[] };

type Phase =
  | { state: "idle" }
  | { state: "uploading"; loaded: number; total: number }
  | { state: "finishing" }
  | { state: "error"; message: string };

type UploadTarget = { method: "PUT"; url: string; headers: Record<string, string> };

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `サーバーがエラーを返しました（${res.status}）。`);
  return data as T;
}

/** 進み具合を出すため fetch ではなく XHR で送る */
function putWithProgress(target: UploadTarget, file: File, onProgress: (loaded: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(target.method, target.url);
    for (const [k, v] of Object.entries(target.headers)) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => onProgress(e.loaded);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else {
        let msg = `送信に失敗しました（${xhr.status}）。`;
        try {
          msg = JSON.parse(xhr.responseText).error ?? msg;
        } catch {
          // ストレージの XML エラーなど
        }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("送信に失敗しました。通信の状態を確かめてください。"));
    xhr.send(file);
  });
}

export function UploadForm({ maxBytes }: { maxBytes: number }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [check, setCheck] = useState<Check>({ state: "none" });
  const [fileError, setFileError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>({ state: "idle" });
  const fileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const busy = phase.state === "uploading" || phase.state === "finishing";

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setFileError(null);
    setPhase({ state: "idle" });
    if (!f) {
      setCheck({ state: "none" });
      return;
    }
    if (!/\.zip$/i.test(f.name)) {
      setCheck({ state: "error", errors: ["拡張子が .zip のファイルを選んでください。"] });
      return;
    }
    if (f.size > maxBytes) {
      setCheck({ state: "error", errors: [`ファイルが大きすぎます。${formatBytes(maxBytes)} までにしてください。`] });
      return;
    }
    setCheck({ state: "checking" });
    const result = await inspectZip(blobReader(f));
    setCheck(result.ok ? { state: "ok", summary: result.summary } : { state: "error", errors: result.errors });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();

    let fErr: string | null = null;
    if (!file) fErr = "ZIP ファイルを選んでください。";
    else if (check.state === "checking") fErr = "ZIP の中身を確かめています。終わるまでお待ちください。";
    else if (check.state !== "ok") fErr = "このファイルはアップロードできません。下の理由を確かめてください。";
    const tErr = title ? null : "題名を入力してください。";
    setFileError(fErr);
    setTitleError(tErr);
    if (fErr) {
      fileRef.current?.focus();
      return;
    }
    if (tErr) {
      titleRef.current?.focus();
      return;
    }

    try {
      const f = file!;
      const { id, upload } = await postJson<{ id: string; upload: UploadTarget }>("/api/shared/uploads", {
        size: f.size,
      });
      setPhase({ state: "uploading", loaded: 0, total: f.size });
      await putWithProgress(upload, f, (loaded) => setPhase({ state: "uploading", loaded, total: f.size }));
      setPhase({ state: "finishing" });
      await postJson(`/api/shared/uploads/${id}/complete`, { title, description, filename: f.name });
      router.push("/shared");
      router.refresh();
    } catch (err) {
      setPhase({ state: "error", message: err instanceof Error ? err.message : "アップロードに失敗しました。" });
    }
  }

  const fileDescribedBy = ["file-hint", fileError ? "file-error" : null, check.state !== "none" ? "file-check" : null]
    .filter(Boolean)
    .join(" ");

  return (
    <form className="card stack" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="file">
          ZIP ファイル<span className="req">必須</span>
        </label>
        <p id="file-hint" className="hint">
          <code>papers/&lt;論文ID&gt;/paper.pdf</code> の形の ZIP を選んでください。{formatBytes(maxBytes)} までです。
        </p>
        <input
          ref={fileRef}
          id="file"
          name="file"
          type="file"
          accept=".zip,application/zip"
          onChange={onFileChange}
          disabled={busy}
          aria-describedby={fileDescribedBy}
          aria-invalid={fileError || check.state === "error" ? true : undefined}
        />
        {fileError && (
          <p id="file-error" className="field-error">
            {fileError}
          </p>
        )}
        <div id="file-check" aria-live="polite">
          {check.state === "checking" && <p className="hint">ZIP の中身を確かめています…</p>}
          {check.state === "error" && (
            <div className="notice error">
              <p>この ZIP はアップロードできません。</p>
              <ul className="error-list">
                {check.errors.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          {check.state === "ok" && file && <Preview summary={check.summary} file={file} />}
        </div>
      </div>

      <div className="field">
        <label htmlFor="title">
          題名<span className="req">必須</span>
        </label>
        <input
          ref={titleRef}
          id="title"
          name="title"
          type="text"
          maxLength={120}
          required
          disabled={busy}
          aria-describedby={titleError ? "title-hint title-error" : "title-hint"}
          aria-invalid={titleError ? true : undefined}
        />
        <p id="title-hint" className="hint">
          一覧に出る名前です。120 文字までです。
        </p>
        {titleError && (
          <p id="title-error" className="field-error">
            {titleError}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="description">
          説明<span className="opt">任意</span>
        </label>
        <textarea id="description" name="description" maxLength={2000} disabled={busy} aria-describedby="desc-hint" />
        <p id="desc-hint" className="hint">
          どんな論文をまとめたものかを書きます。2000 文字までです。
        </p>
      </div>

      <div aria-live="polite">
        {phase.state === "uploading" && (
          <div className="progress">
            <label htmlFor="upload-progress">
              送信しています… {Math.floor((phase.loaded / Math.max(phase.total, 1)) * 100)}%（
              {formatBytes(phase.loaded)} / {formatBytes(phase.total)}）
            </label>
            <progress id="upload-progress" max={phase.total} value={phase.loaded} />
          </div>
        )}
        {phase.state === "finishing" && <p className="hint">ZIP の中身を確かめて、登録しています…</p>}
        {phase.state === "error" && (
          <div className="notice error" role="alert">
            <p>{phase.message}</p>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "アップロードしています…" : "アップロード"}
        </button>
      </div>
    </form>
  );
}

function Preview({ summary, file }: { summary: ZipSummary; file: File }) {
  return (
    <div className="preview">
      <h3>
        {summary.layout === "single" ? "論文フォルダ 1 本" : `論文 ${summary.papers.length} 本`}
        {summary.hasTemplates && "（テンプレート付き）"}
      </h3>
      <p className="hint">
        {file.name}・{formatBytes(file.size)}・ファイル {summary.fileCount} 個（展開すると{" "}
        {formatBytes(summary.uncompressedSize)}）
      </p>
      <ul>
        {summary.papers.map((p) => (
          <li key={p.id}>
            {p.title ? (
              <>
                {p.title} <code>{p.id}</code>
              </>
            ) : (
              <code>{p.id}</code>
            )}
            <span className="hint">（{p.files.join(", ")}）</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
