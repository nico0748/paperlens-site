"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** ヘッダーのログインボタン。ログインのページにいるときは aria-current を付け、押せない見た目にする */
export function LoginLink({ href, label }: { href: string; label: string }) {
  const current = usePathname() === href;
  return (
    <Link href={href} className="btn btn-ghost btn-sm" aria-current={current ? "page" : undefined}>
      {label}
    </Link>
  );
}
