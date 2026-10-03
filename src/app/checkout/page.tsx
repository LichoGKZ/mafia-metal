"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, formatARS } from "@/context/CartContext";

interface ShippingData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

export default function CheckoutPage() {
  const { lines, subtotalARS, updateQty, removeItem } = useCart();
  const router = useRouter();

  const [shipping, setShipping] = useState<ShippingData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePay = async () => {
    setError(null);

    if (!shipping.name || !shipping.email || !shipping.address) {
      setError("Completá al menos nombre, email y dirección de envío.");
      return;
    }
    if (lines.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, shipping }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "No se pudo crear el pago.");
      }

      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error("Mercado Pago no devolvió un link de pago.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
      setLoading(false);
    }
  };

  if (lines.length === 0) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6"
        style={{ background: "#1a1916", color: "#b0aa98" }}
      >
        <p className="font-victor text-sm tracking-[0.2em]">
          tu carrito está vacío.
        </p>
        <Link
          href="/#collection"
          className="px-8 py-3 font-victor text-xs tracking-[0.35em]"
          style={{ background: "var(--gold)", color: "#0a0908" }}
        >
          seguir comprando
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-6 py-16 md:py-24"
      style={{ background: "#1a1916", color: "#b0aa98" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1
            className="font-victor font-bold text-lg tracking-[0.3em] uppercase"
            style={{ color: "var(--gold)" }}
          >
            pagar
          </h1>
          <Link
            href="/#collection"
            className="font-victor text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(176,170,152,0.5)" }}
          >
            ← seguir comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Order summary */}
          <div className="md:col-span-2 order-2 md:order-1">
            <p className="font-victor text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: "rgba(176,170,152,0.4)" }}>
              resumen del pedido
            </p>
            <ul className="space-y-5 mb-8">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="pb-5 flex flex-col gap-2"
                  style={{ borderBottom: "1px solid rgba(176,170,152,0.08)" }}
                >
                  <div className="flex justify-between">
                    <span className="font-victor text-sm">{line.name}</span>
                    <span className="font-victor text-sm" style={{ color: "var(--gold)" }}>
                      {formatARS(line.priceARS * line.qty)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(line.id, line.qty - 1)}
                      className="w-6 h-6 text-xs"
                      style={{ border: "1px solid rgba(176,170,152,0.15)" }}
                    >
                      −
                    </button>
                    <span className="font-victor text-xs w-4 text-center">{line.qty}</span>
                    <button
                      onClick={() => updateQty(line.id, line.qty + 1)}
                      className="w-6 h-6 text-xs"
                      style={{ border: "1px solid rgba(176,170,152,0.15)" }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(line.id)}
                      className="font-victor text-[10px] tracking-[0.2em] ml-2"
                      style={{ color: "rgba(139,0,0,0.7)" }}
                    >
                      quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-4" style={{ borderTop: "1px solid rgb(var(--gold-rgb) / 0.15)" }}>
              <span className="font-victor text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(176,170,152,0.5)" }}>
                total
              </span>
              <span className="font-victor text-lg tracking-widest" style={{ color: "var(--gold)" }}>
                {formatARS(subtotalARS)}
              </span>
            </div>
          </div>

          {/* Shipping form */}
          <div className="md:col-span-3 order-1 md:order-2">
            <p className="font-victor text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: "rgba(176,170,152,0.4)" }}>
              datos de envío
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <Field label="nombre completo *" name="name" value={shipping.name} onChange={handleChange} />
              <Field label="email *" name="email" type="email" value={shipping.email} onChange={handleChange} />
              <Field label="teléfono" name="phone" type="tel" value={shipping.phone} onChange={handleChange} />
              <Field label="ciudad" name="city" value={shipping.city} onChange={handleChange} />
              <Field label="código postal" name="postalCode" value={shipping.postalCode} onChange={handleChange} />
            </div>
            <Field label="dirección *" name="address" value={shipping.address} onChange={handleChange} />
            <div className="mt-6">
              <label className="font-victor text-[9px] tracking-[0.3em] uppercase block mb-2" style={{ color: "rgba(176,170,152,0.3)" }}>
                notas (opcional)
              </label>
              <textarea
                name="notes"
                value={shipping.notes}
                onChange={handleChange}
                rows={3}
                className="w-full bg-transparent py-2 font-victor text-xs outline-none resize-none"
                style={{ borderBottom: "1px solid rgba(176,170,152,0.1)", color: "#b0aa98" }}
              />
            </div>

            {error && (
              <p className="font-victor text-xs mt-6" style={{ color: "#c0392b" }}>
                {error}
              </p>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full mt-8 py-4 font-victor text-xs tracking-[0.35em] metal-shine disabled:opacity-50"
              style={{ background: "var(--gold)", color: "#0a0908" }}
            >
              {loading ? "redirigiendo a mercado pago..." : "pagar con mercado pago"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="font-victor text-[9px] tracking-[0.3em] uppercase block mb-2" style={{ color: "rgba(176,170,152,0.3)" }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent py-2 font-victor text-xs outline-none"
        style={{ borderBottom: "1px solid rgba(176,170,152,0.1)", color: "#b0aa98" }}
      />
    </div>
  );
}
