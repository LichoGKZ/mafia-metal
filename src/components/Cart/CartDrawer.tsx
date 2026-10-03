"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart, formatARS } from "@/context/CartContext";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, updateQty, removeItem, subtotalARS } =
    useCart();
  const router = useRouter();

  const handleContinueShopping = () => {
    closeCart();
  };

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9800]"
            style={{ background: "rgba(10,9,8,0.75)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full z-[9900] w-full max-w-md flex flex-col"
            style={{
              background: "#1a1916",
              borderLeft: "1px solid rgb(var(--gold-rgb) / 0.15)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(176,170,152,0.08)" }}
            >
              <span
                className="font-victor text-xs tracking-[0.35em] uppercase"
                style={{ color: "var(--gold)" }}
              >
                tu pedido ({lines.length})
              </span>
              <button
                onClick={closeCart}
                className="font-victor text-xs"
                style={{ color: "rgba(176,170,152,0.5)" }}
                aria-label="Close cart"
              >
                ✕ cerrar
              </button>
            </div>

            {/* Lines */}
            <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
              {lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <p
                    className="font-victor text-xs tracking-[0.2em]"
                    style={{ color: "rgba(176,170,152,0.35)" }}
                  >
                    tu pedido está vacío.
                  </p>
                  <button
                    onClick={handleContinueShopping}
                    className="px-6 py-2.5 font-victor text-[10px] tracking-[0.3em]"
                    style={{
                      border: "1px solid rgb(var(--gold-rgb) / 0.25)",
                      color: "var(--gold)",
                    }}
                    data-cursor-hover
                  >
                    seguir comprando
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {lines.map((line) => (
                    <li
                      key={line.key}
                      className="flex items-start justify-between gap-4 pb-6"
                      style={{ borderBottom: "1px solid rgba(176,170,152,0.06)" }}
                    >
                      <div className="flex-1">
                        <p
                          className="font-victor text-sm tracking-wide mb-1"
                          style={{ color: "#b0aa98" }}
                        >
                          {line.name}
                        </p>
                        <p
                          className="font-victor text-[10px] tracking-[0.2em] uppercase mb-3"
                          style={{ color: "rgba(176,170,152,0.35)" }}
                        >
                          {line.material}
                          {line.size ? ` · talle ${line.size}` : ""}
                        </p>

                        {/* Qty stepper */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQty(line.key, line.qty - 1)}
                            className="w-6 h-6 flex items-center justify-center font-victor text-xs"
                            style={{ border: "1px solid rgba(176,170,152,0.15)", color: "#b0aa98" }}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="font-victor text-xs w-4 text-center" style={{ color: "#b0aa98" }}>
                            {line.qty}
                          </span>
                          <button
                            onClick={() => updateQty(line.key, line.qty + 1)}
                            className="w-6 h-6 flex items-center justify-center font-victor text-xs"
                            style={{ border: "1px solid rgba(176,170,152,0.15)", color: "#b0aa98" }}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(line.key)}
                            className="font-victor text-[10px] tracking-[0.2em] ml-2"
                            style={{ color: "rgba(139,0,0,0.7)" }}
                          >
                            quitar
                          </button>
                        </div>
                      </div>

                      <span
                        className="font-victor text-sm tracking-widest whitespace-nowrap"
                        style={{ color: "var(--gold)" }}
                      >
                        {formatARS(line.priceARS * line.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer: subtotal + actions */}
            {lines.length > 0 && (
              <div
                className="px-6 py-6 space-y-4"
                style={{ borderTop: "1px solid rgba(176,170,152,0.08)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-victor text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(176,170,152,0.4)" }}
                  >
                    subtotal
                  </span>
                  <span
                    className="font-victor text-base tracking-widest"
                    style={{ color: "var(--gold)" }}
                  >
                    {formatARS(subtotalARS)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 font-victor text-xs tracking-[0.35em] metal-shine"
                  style={{ background: "var(--gold)", color: "#0a0908" }}
                  data-cursor-hover
                >
                  ir a pagar
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full py-3 font-victor text-xs tracking-[0.35em]"
                  style={{ border: "1px solid rgba(176,170,152,0.15)", color: "rgba(176,170,152,0.6)" }}
                  data-cursor-hover
                >
                  seguir comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
