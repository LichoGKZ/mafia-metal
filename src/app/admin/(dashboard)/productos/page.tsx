import Link from "next/link";
import { listProductsAdmin } from "@/app/admin/actions";
import DeleteButton from "./DeleteButton";
import VisibilityToggle from "./VisibilityToggle";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProductsAdmin();

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="font-victor text-sm tracking-[0.35em] uppercase"
          style={{ color: "var(--gold)" }}
        >
          productos
        </h1>
      </div>

      <Link
          href="/admin/productos/nuevo"
          className="inline-block mb-8 px-6 py-3 font-victor text-xs tracking-[0.3em]"
          style={{ background: "var(--gold)", color: "#0a0908" }}
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
                className="w-14 h-14 flex-shrink-0 bg-contain bg-center bg-no-repeat"
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
                  {p.id}{p.color ? ` · ${p.color}` : ""} · ${p.price_ars}
                </p>
              </div>

              <VisibilityToggle id={p.id} isVisible={p.is_visible} />

              <Link
                href={`/admin/productos/${p.id}/editar`}
                className="font-victor text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "var(--gold)" }}
              >
                editar
              </Link>

              <DeleteButton id={p.id} name={p.name} />
            </div>
          ))}
        </div>
    </>
  );
}
