"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
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
        style={{ border: "1px solid rgb(var(--gold-rgb) / 0.4)" }}
      >
        <span style={{ color: "var(--gold)" }}>✓</span>
      </div>
      <h1 className="font-victor font-bold text-xl tracking-wide" style={{ color: "var(--gold)" }}>
        pago confirmado
      </h1>
      <p className="font-victor text-xs max-w-sm" style={{ color: "rgba(176,170,152,0.5)" }}>
        tu pedido fue registrado. te vamos a contactar para coordinar la entrega.
      </p>
      <Link
        href="/#collection"
        className="mt-4 px-8 py-3 font-victor text-xs tracking-[0.35em]"
        style={{ background: "var(--gold)", color: "#0a0908" }}
      >
        seguir comprando
      </Link>
    </main>
  );
}
