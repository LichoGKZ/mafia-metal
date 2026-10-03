"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { JewelryItem } from "@/data/collection";

export interface CartLine {
  /** Clave única de la línea: id del producto + talle (mismo producto con
   *  distinto talle = líneas distintas). */
  key: string;
  id: string;
  /** Talle elegido (solo productos que lo requieren, ej. anillos). */
  size?: string;
  name: string;
  price: string; // display price, e.g. "$2,400"
  priceARS: number; // numeric price used for totals / Mercado Pago
  material: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  itemCount: number;
  subtotalARS: number;
  addItem: (item: JewelryItem, qty?: number, size?: string) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mafia-metal-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage once, on mount (client only)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // Migración: carritos guardados antes de existir `key`/`size`.
        const parsed = JSON.parse(raw) as CartLine[];
        setLines(parsed.map((l) => ({ ...l, key: l.key ?? l.id })));
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change, but skip the very first render before hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage full / disabled — non-fatal
    }
  }, [lines, hydrated]);

  const addItem = (item: JewelryItem, qty = 1, size?: string) => {
    const key = size ? `${item.id}::${size}` : item.id;
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) =>
          l.key === key ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [
        ...prev,
        {
          key,
          id: item.id,
          size,
          name: item.name,
          price: item.price,
          priceARS: item.priceARS,
          material: item.material,
          qty,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  };

  const updateQty = (key: string, qty: number) => {
    if (qty <= 0) {
      removeItem(key);
      return;
    }
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty } : l)));
  };

  const clearCart = () => setLines([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines]
  );
  const subtotalARS = useMemo(
    () => lines.reduce((sum, l) => sum + l.priceARS * l.qty, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{
        lines,
        isOpen,
        itemCount,
        subtotalARS,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
