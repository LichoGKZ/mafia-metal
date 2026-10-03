"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavLink({
  href,
  children,
  badge,
}: {
  href: string;
  children: React.ReactNode;
  badge?: number;
}) {
  const pathname = usePathname();
  const active = pathname?.startsWith(href);

  return (
    <Link
      href={href}
      className="relative font-victor text-[10px] tracking-[0.3em] uppercase transition-colors"
      style={{ color: active ? "var(--gold)" : "rgba(176,170,152,0.5)" }}
    >
      {children}
      {!!badge && badge > 0 && (
        <span
          className="ml-2 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold align-middle"
          style={{ background: "#8b0000", color: "#f3f0e7" }}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}
