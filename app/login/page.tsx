import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { devLoginEnabled, safeCallbackUrl } from "@/lib/access";
import "../shared/shared.css";

export const metadata: Metadata = { title: "ログイン" };

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "このアカウントではログインできません。管理者に、使えるアカウントの一覧に入れてもらってください。",
  CredentialsSignin: "ユーザー名が正しくありません。英数字とハイフンで入力してください。",
  Configuration: "ログインの設定に問題があります。サイトの管理者に知らせてください。",
  OAuthCallbackError: "GitHub でのログインを完了できませんでした。もう一度お試しください。",
};

type Props = { searchParams: Promise<{ callbackUrl?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const session = await auth();
  if (session?.user) redirect(callbackUrl);

  const error = params.error ? (ERROR_MESSAGES[params.error] ?? "ログインできませんでした。もう一度お試しください。") : null;
  const devEnabled = devLoginEnabled();

  async function loginWithGitHub() {
    "use server";
    await signIn("github", { redirectTo: callbackUrl });
  }

  async function loginAsDev(formData: FormData) {
    "use server";
    if (!devLoginEnabled()) return;
    try {
      await signIn("dev", { login: String(formData.get("login") ?? ""), redirectTo: callbackUrl });
    } catch (err) {
      // 成功時の転送（NEXT_REDIRECT）はそのまま投げ直す
      if (err instanceof AuthError) {
        redirect(`/login?error=${encodeURIComponent(err.type)}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
      throw err;
    }
  }

  return (
    <div className="page">
      <div className="container narrow">
        <h1>ログイン</h1>
        <p className="lead">共有データのダウンロードには、ログインが必要です。</p>

        {error && (
          <div className="notice error" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="card stack">
          <form action={loginWithGitHub}>
            <button type="submit" className="btn btn-primary btn-block">
              GitHub でログイン
            </button>
          </form>
          <p className="hint">GitHub のアカウントでログインします。このサイトはデータベースを持たず、ログインの情報はお使いのブラウザの Cookie にだけ保存します。</p>
        </div>

        {devEnabled && (
          <section className="card stack dev-login" aria-labelledby="dev-login-heading">
            <h2 id="dev-login-heading">開発用ログイン</h2>
            <p className="hint">
              開発環境でだけ表示しています（AUTH_DEV_LOGIN=1）。入力した GitHub のユーザー名としてログインします。
            </p>
            <form action={loginAsDev} className="stack">
              <div className="field">
                <label htmlFor="dev-login">ユーザー名</label>
                <input
                  id="dev-login"
                  name="login"
                  type="text"
                  required
                  pattern="[A-Za-z0-9\-]{1,39}"
                  autoComplete="username"
                  aria-describedby="dev-login-hint"
                />
                <p id="dev-login-hint" className="hint">
                  英数字とハイフンで、39 文字まで入力してください。
                </p>
              </div>
              <button type="submit" className="btn btn-secondary">
                このユーザー名でログイン
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
