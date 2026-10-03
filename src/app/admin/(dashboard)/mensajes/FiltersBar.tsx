"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "todos", label: "todos" },
  { value: "nuevo", label: "nuevos" },
  { value: "leido", label: "leídos" },
  { value: "respondido", label: "respondidos" },
  { value: "archivado", label: "archivados" },
];

const INTEREST_OPTIONS = [
  { value: "todos", label: "todas las categorías" },
  { value: "rings", label: "anillos" },
  { value: "chains", label: "cadenas y collares" },
  { value: "bracelets", label: "pulseras" },
  { value: "custom", label: "pieza a medida" },
  { value: "wholesale", label: "mayorista" },
  { value: "other", label: "otro / sin especificar" },
];

export default function FiltersBar({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const status = searchParams.get("status") || "todos";
  const interest = searchParams.get("interest") || "todos";
  const [search, setSearch] = useState(searchParams.get("q") || "");

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "todos") params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // debounce del buscador
  useEffect(() => {
    const t = setTimeout(() => {
      const current = searchParams.get("q") || "";
      if (search !== current) {
        const params = new URLSearchParams(searchParams.toString());
        if (search.trim()) params.set("q", search.trim());
        else params.delete("q");
        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`);
        });
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="mb-8 space-y-5">
      {/* Tabs de estado con contador */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setParam("status", tab.value)}
              className="px-4 py-2 font-victor text-[10px] tracking-[0.25em] uppercase transition-colors"
              style={{
                background: active ? "var(--gold)" : "transparent",
                color: active ? "#0a0908" : "rgba(176,170,152,0.6)",
                border: `1px solid ${active ? "var(--gold)" : "rgba(176,170,152,0.15)"}`,
              }}
            >
              {tab.label}
              <span
                className="ml-2"
                style={{ color: active ? "rgba(10,9,8,0.5)" : "rgba(176,170,152,0.35)" }}
              >
                {counts[tab.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Buscador + filtro de categoría */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="buscar por nombre, email, teléfono o mensaje..."
            className="w-full bg-transparent py-2.5 px-3 font-victor text-xs outline-none"
            style={{
              border: "1px solid rgba(176,170,152,0.15)",
              color: "#b0aa98",
            }}
          />
        </div>

        <select
          value={interest}
          onChange={(e) => setParam("interest", e.target.value)}
          className="bg-transparent py-2.5 px-3 font-victor text-xs outline-none cursor-pointer"
          style={{
            border: "1px solid rgba(176,170,152,0.15)",
            color: "#b0aa98",
            background: "#1a1916",
          }}
        >
          {INTEREST_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "#1a1916" }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isPending && (
        <p className="font-victor text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgb(var(--gold-rgb) / 0.5)" }}>
          actualizando...
        </p>
      )}
    </div>
  );
}
