import Link from "next/link";

type Crumb = { label: string; href?: string };

/** DADS のパンくずリスト。最後の項目が今のページで、リンクにしない */
export function Breadcrumb({ label, items }: { label: string; items: Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label={label}>
      <ol>
        {items.map((c, i) => (
          <li key={c.label}>
            {c.href && i < items.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
