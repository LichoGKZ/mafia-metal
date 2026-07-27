"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPendingPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Pending means MP is still processing (e.g. rapipago, transferencia).
    // We clear the cart since the order was already created; if it fails
    // Mercado Pago will notify separately.
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6"
      style={{ background: "#1a1916", color: "#b0aa98" }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ border: "1px solid rgba(212,175,55,0.4)" }}
      >
        <span style={{ color: "#d4af37" }}>…</span>
      </div>
      <h1 className="font-victor font-bold text-xl tracking-wide" style={{ color: "#d4af37" }}>
        pago pendiente
      </h1>
      <p className="font-victor text-xs max-w-sm" style={{ color: "rgba(176,170,152,0.5)" }}>
        estamos esperando la confirmación de Mercado Pago (por ejemplo, si pagaste por
        transferencia o efectivo). te avisamos apenas se acredite.
      </p>
      <Link
        href="/#collection"
        className="mt-4 px-8 py-3 font-victor text-xs tracking-[0.35em]"
        style={{ background: "#d4af37", color: "#0a0908" }}
      >
        seguir comprando
      </Link>
    </main>
  );
}
