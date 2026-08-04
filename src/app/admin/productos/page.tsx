import Link from "next/link";
import { listProductsAdmin, signOut } from "@/app/admin/actions";
import DeleteButton from "./DeleteButton";
import VisibilityToggle from "./VisibilityToggle";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProductsAdmin();

  return (
    <main
      className="min-h-screen px-6 py-12 md:px-12"
      style={{ background: "#1a1916", color: "#b0aa98" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1
            className="font-victor text-sm tracking-[0.35em] uppercase"
            style={{ color: "#d4af37" }}
          >
            productos · mafia metal
          </h1>
          <form action={signOut}>
            <button
              type="submit"
              className="font-victor text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(176,170,152,0.5)" }}
            >
              cerrar sesión
            </button>
          </form>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="inline-block mb-8 px-6 py-3 font-victor text-xs tracking-[0.3em]"
          style={{ background: "#d4af37", color: "#0a0908" }}
        >
          + nuevo producto
        </Link>

        <div className="space-y-3">
          {products?.length === 0 && (
            <p className="font-victor text-xs" style={{ color: "rgba(176,170,152,0.4)" }}>
              No hay productos todavía.
            </p>
          )}

          {products?.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4"
              style={{ border: "1px solid rgba(176,170,152,0.1)" }}
            >
              <div
                className="w-14 h-14 flex-shrink-0 bg-cover bg-center"
                style={{
                  backgroundImage: p.image ? `url(${p.image})` : undefined,
                  background: p.image ? undefined : "rgba(176,170,152,0.08)",
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-victor text-sm truncate">{p.name}</p>
                <p
                  className="font-victor text-[10px] tracking-wider truncate"
                  style={{ color: "rgba(176,170,152,0.4)" }}
                >
                  {p.id} · {p.material} · ${p.price_ars}
                </p>
              </div>

              <VisibilityToggle id={p.id} isVisible={p.is_visible} />

              <Link
                href={`/admin/productos/${p.id}/editar`}
                className="font-victor text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "#d4af37" }}
              >
                editar
              </Link>

              <DeleteButton id={p.id} name={p.name} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
