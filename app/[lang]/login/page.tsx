import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GitHubIcon } from "@/components/icons";
import { Notice } from "@/components/Notice";
import { devLoginEnabled, safeCallbackUrl } from "@/lib/access";
import { getDictionary, hasLocale } from "@/lib/i18n";
import "../shared/shared.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/login">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).login.title } : {};
}

export default async function LoginPage({ params, searchParams }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.login;

  const query = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const callbackUrl = safeCallbackUrl(one(query.callbackUrl), `/${lang}/shared`);
  const session = await auth();
  if (session?.user) redirect(callbackUrl);

  const errorType = one(query.error);
  const error = errorType ? (t.errors[errorType] ?? t.errors.default) : null;
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
        redirect(`/${lang}/login?error=${encodeURIComponent(err.type)}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
      throw err;
    }
  }

  return (
    <div className="page page-center">
      <div className="container narrow">
        <Breadcrumb label={dict.common.breadcrumb} items={[{ label: dict.common.home, href: `/${lang}` }, { label: t.title }]} />
        <h1>{t.title}</h1>
        <p className="lead">{t.lead}</p>

        {error && (
          <Notice kind="error" title={t.errorTitle} role="alert">
            <p>{error}</p>
          </Notice>
        )}

        <div className="card stack">
          <form action={loginWithGitHub}>
            <button type="submit" className="btn btn-primary btn-lg btn-block">
              <GitHubIcon />
              {t.github}
            </button>
          </form>
          <p className="hint">{t.githubHint}</p>
        </div>

        {devEnabled && (
          <section className="card stack dev-login" aria-labelledby="dev-login-heading">
            <h2 id="dev-login-heading">{t.devTitle}</h2>
            <p className="hint">{t.devHint}</p>
            <form action={loginAsDev} className="stack">
              <div className="field">
                <label htmlFor="dev-login">{t.devLabel}</label>
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
                  {t.devFieldHint}
                </p>
              </div>
              <button type="submit" className="btn btn-secondary">
                {t.devSubmit}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
