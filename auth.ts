import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { devLoginEnabled, isAdminLogin, isAllowedLogin } from "@/lib/access";

/**
 * ログイン（Auth.js v5）。GitHub OAuth で入り、JWT のセッションに GitHub のユーザー名（login）を持つ。
 * DB は使わない。権限は環境変数のユーザー名の一覧で決める（lib/access.ts）。
 */
const providers: Provider[] = [GitHub];

if (devLoginEnabled()) {
  // 開発用。AUTH_DEV_LOGIN=1 かつ本番でないときだけ。名前を入れるだけでその人として入る
  providers.push(
    Credentials({
      id: "dev",
      name: "開発用ログイン",
      credentials: { login: { label: "ユーザー名" } },
      authorize(credentials) {
        const login = String(credentials?.login ?? "").trim();
        if (!/^[A-Za-z0-9-]{1,39}$/.test(login)) return null;
        return { id: `dev:${login}`, name: login, login };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    signIn({ user, profile }) {
      const login = (profile?.login as string | undefined) ?? (user as { login?: string }).login;
      return isAllowedLogin(login);
    },
    jwt({ token, user, profile }) {
      if (profile?.login) token.login = String(profile.login);
      else if (user && (user as { login?: string }).login) token.login = (user as { login?: string }).login;
      return token;
    },
    session({ session, token }) {
      const login = typeof token.login === "string" ? token.login : undefined;
      session.user.login = login;
      // 管理者かどうかは毎回環境変数から決める（一覧を変えたらすぐ効く）
      session.user.isAdmin = isAdminLogin(login);
      return session;
    },
  },
});
