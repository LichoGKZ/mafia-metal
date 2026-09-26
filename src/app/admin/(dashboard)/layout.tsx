import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { unreadMessagesCount } from "@/app/admin/mensajes/actions";
import AdminNavLink from "./AdminNavLink";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unread = await unreadMessagesCount().catch(() => 0);

  return (
    <main
      className="min-h-screen px-6 py-8 md:px-12"
      style={{ background: "#1a1916", color: "#b0aa98" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <Link
            href="/admin/productos"
            className="font-victor text-sm tracking-[0.35em] uppercase"
            style={{ color: "#d4af37" }}
          >
            panel · mafia metal
          </Link>

          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <AdminNavLink href="/admin/productos">productos</AdminNavLink>
              <AdminNavLink href="/admin/mensajes" badge={unread}>
                mensajes
              </AdminNavLink>
            </nav>

            <form action={signOut}>
              <button
                type="submit"
                className="font-victor text-[10px] tracking-[0.3em] uppercase transition-colors hover:text-[#d4af37]"
                style={{ color: "rgba(176,170,152,0.5)" }}
              >
                cerrar sesión
              </button>
            </form>
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}
