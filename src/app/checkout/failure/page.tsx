"use client";

import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6"
      style={{ background: "#1a1916", color: "#b0aa98" }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ border: "1px solid rgba(139,0,0,0.5)" }}
      >
        <span style={{ color: "#8b0000" }}>✕</span>
      </div>
      <h1 className="font-victor font-bold text-xl tracking-wide" style={{ color: "#8b0000" }}>
        el pago no se pudo procesar
      </h1>
      <p className="font-victor text-xs max-w-sm" style={{ color: "rgba(176,170,152,0.5)" }}>
        tu carrito sigue guardado. podés intentar de nuevo o volver a la tienda.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Link
          href="/checkout"
          className="px-8 py-3 font-victor text-xs tracking-[0.35em]"
          style={{ background: "var(--gold)", color: "#0a0908" }}
        >
          reintentar pago
        </Link>
        <Link
          href="/#collection"
          className="px-8 py-3 font-victor text-xs tracking-[0.35em]"
          style={{ border: "1px solid rgba(176,170,152,0.15)", color: "rgba(176,170,152,0.6)" }}
        >
          seguir comprando
        </Link>
      </div>
    </main>
  );
}
