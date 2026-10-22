"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { formatBytes } from "@/lib/format";
import { fill, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/ja";
import { blobReader, inspectZip, type ZipSummary } from "@/lib/zip/inspect";
import { Notice } from "@/components/Notice";

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
type T = Dictionary["upload"];

async function postJson<R>(t: T, url: string, body: unknown): Promise<R> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? fill(t.serverError, { status: res.status }));
  return data as R;
}

/** 進み具合を出すため fetch ではなく XHR で送る */
function putWithProgress(t: T, target: UploadTarget, file: File, onProgress: (loaded: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(target.method, target.url);
    for (const [k, v] of Object.entries(target.headers)) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => onProgress(e.loaded);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else {
        let msg = fill(t.sendFailedStatus, { status: xhr.status });
        try {
          msg = JSON.parse(xhr.responseText).error ?? msg;
        } catch {
          // ストレージの XML エラーなど
        }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error(t.sendFailed));
    xhr.send(file);
  });
}

export function UploadForm({ maxBytes, lang, t }: { maxBytes: number; lang: Locale; t: T }) {
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
      setCheck({ state: "error", errors: [t.notZip] });
      return;
    }
    if (f.size > maxBytes) {
      setCheck({ state: "error", errors: [fill(t.tooLarge, { max: formatBytes(maxBytes) })] });
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
    if (!file) fErr = t.chooseFile;
    else if (check.state === "checking") fErr = t.stillChecking;
    else if (check.state !== "ok") fErr = t.cannotUpload;
    const tErr = title ? null : t.titleRequired;
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
      const { id, upload } = await postJson<{ id: string; upload: UploadTarget }>(t, "/api/shared/uploads", {
        size: f.size,
      });
      setPhase({ state: "uploading", loaded: 0, total: f.size });
      await putWithProgress(t, upload, f, (loaded) => setPhase({ state: "uploading", loaded, total: f.size }));
      setPhase({ state: "finishing" });
      await postJson(t, `/api/shared/uploads/${id}/complete`, { title, description, filename: f.name });
      router.push(`/${lang}/shared`);
      router.refresh();
    } catch (err) {
      setPhase({ state: "error", message: err instanceof Error ? err.message : t.failed });
    }
  }

  const fileDescribedBy = ["file-hint", fileError ? "file-error" : null, check.state !== "none" ? "file-check" : null]
    .filter(Boolean)
    .join(" ");

  return (
    <form className="card stack" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="file">
          {t.fileLabel}
          <span className="req">{t.required}</span>
        </label>
        <p id="file-hint" className="hint">
          {fill(t.fileHint, { max: formatBytes(maxBytes) })}
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
          {check.state === "checking" && <p className="hint">{t.checking}</p>}
          {check.state === "error" && (
            <Notice kind="error" title={t.rejected}>
              <ul className="error-list">
                {check.errors.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Notice>
          )}
          {check.state === "ok" && file && <Preview summary={check.summary} file={file} t={t} />}
        </div>
      </div>

      <div className="field">
        <label htmlFor="title">
          {t.titleLabel}
          <span className="req">{t.required}</span>
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
          {t.titleHint}
        </p>
        {titleError && (
          <p id="title-error" className="field-error">
            {titleError}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="description">
          {t.descLabel}
          <span className="opt">{t.optional}</span>
        </label>
        <textarea id="description" name="description" maxLength={2000} disabled={busy} aria-describedby="desc-hint" />
        <p id="desc-hint" className="hint">
          {t.descHint}
        </p>
      </div>

      <div aria-live="polite">
        {phase.state === "uploading" && (
          <div className="progress">
            <label htmlFor="upload-progress">
              {fill(t.sending, {
                percent: Math.floor((phase.loaded / Math.max(phase.total, 1)) * 100),
                loaded: formatBytes(phase.loaded),
                total: formatBytes(phase.total),
              })}
            </label>
            <progress id="upload-progress" max={phase.total} value={phase.loaded} />
          </div>
        )}
        {phase.state === "finishing" && <p className="hint">{t.finishing}</p>}
        {phase.state === "error" && (
          <Notice kind="error" role="alert">
            <p>{phase.message}</p>
          </Notice>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? t.submitting : t.submit}
        </button>
      </div>
    </form>
  );
}

function Preview({ summary, file, t }: { summary: ZipSummary; file: File; t: T }) {
  return (
    <div className="preview">
      <h3>
        {summary.layout === "single" ? t.previewSingle : fill(t.previewCount, { count: summary.papers.length })}
        {summary.hasTemplates && t.previewTemplates}
      </h3>
      <p className="hint">
        {fill(t.previewMeta, {
          name: file.name,
          size: formatBytes(file.size),
          files: summary.fileCount,
          unpacked: formatBytes(summary.uncompressedSize),
        })}
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
            <span className="hint"> ({p.files.join(", ")})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
