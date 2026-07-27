"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collectionItems, JewelryItem } from "@/data/collection";
import { useCart } from "@/context/CartContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const itemAmbients: Record<string, { gradient: string }> = {
  "one-love": {
    gradient: "radial-gradient(ellipse at 35% 50%, rgba(212,175,55,0.10) 0%, rgba(139,90,20,0.06) 45%, transparent 70%)",
  },
  "only-trust": {
    gradient: "radial-gradient(ellipse at 35% 50%, rgba(200,200,220,0.10) 0%, rgba(120,120,140,0.06) 40%, transparent 70%)",
  },
  "tag-mafia": {
    gradient: "radial-gradient(ellipse at 35% 50%, rgba(180,145,30,0.09) 0%, rgba(80,60,5,0.06) 42%, transparent 68%)",
  },
};

/* ── Foto del producto (o placeholder si todavía no la subieron) ── */
function ProductImage({ item, className }: { item: JewelryItem; className?: string }) {
  if (!item.image) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className ?? ""}`}
        style={{ background: "linear-gradient(135deg, #1e1d1a, #141310)" }}
      >
        <p
          className="font-victor text-[10px] tracking-[0.3em] text-center px-4"
          style={{ color: "rgba(176,170,152,0.3)" }}
        >
          FOTO PRÓXIMAMENTE
        </p>
      </div>
    );
  }
  return (
    <Image
      src={item.image}
      alt={item.name}
      fill
      className={`object-cover ${className ?? ""}`}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}

/* ── Single product row (alternates left/right like reference) ── */
function ProductRow({
  item,
  index,
  onSelect,
}: {
  item: JewelryItem;
  index: number;
  onSelect: (item: JewelryItem) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!rowRef.current) return;
    const el = rowRef.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === el) t.kill();
      });
    };
  }, []);

  return (
    <div
      ref={rowRef}
      className="group relative flex flex-col md:flex-row items-center gap-0 mb-20 opacity-0 cursor-pointer"
      style={{ flexDirection: isEven ? "row" : "row-reverse" }}
      onClick={() => onSelect(item)}
      data-cursor-hover
    >
      {/* ── Hover border — wraps the entire row ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.25)" }}
      />

      {/* ── Hover ambient background — themed per item ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: itemAmbients[item.id]?.gradient ?? "none" }}
      />

      {/* ── Foto del producto ── */}
      <div className="w-full md:w-1/2 relative z-[1]">
        <div className="relative overflow-hidden">
          <div className="h-64 md:h-80 relative">
            <ProductImage item={item} />
          </div>
          {/* Badge */}
          {item.badge && (
            <div className="absolute top-3 left-3 z-20">
              <span
                className="font-victor text-[9px] tracking-[0.3em] px-2 py-1"
                style={{
                  background:
                    item.badge === "LIMITED"
                      ? "rgba(139,0,0,0.9)"
                      : "rgba(212,175,55,0.9)",
                  color: item.badge === "LIMITED" ? "#fff" : "#0a0908",
                }}
              >
                {item.badge}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Connector line ── */}
      <div
        className={`hidden md:flex items-center flex-shrink-0 z-[1] ${
          isEven ? "flex-row" : "flex-row-reverse"
        }`}
        style={{ width: "80px" }}
      >
        <div
          className="flex-1 h-px transition-colors duration-500"
          style={{ background: "rgba(176,170,152,0.15)" }}
        />
      </div>

      {/* ── Text info ── */}
      <div
        className={`w-full md:w-1/2 px-6 md:px-10 py-6 relative z-[1] ${
          isEven ? "text-left" : "text-right md:text-right"
        }`}
      >
        <div
          className="font-victor mb-4"
          style={{
            fontSize: "3rem",
            color: "rgba(176,170,152,0.06)",
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div
          className="font-victor text-sm tracking-[0.2em] mb-1"
          style={{ color: "#d4af37" }}
        >
          [ {item.name} ]
        </div>

        <p
          className="font-victor text-[10px] tracking-[0.25em] mb-4"
          style={{ color: "rgba(176,170,152,0.35)" }}
        >
          {item.subtitle?.toLowerCase() || item.material?.toLowerCase()} &nbsp;|&nbsp; in
          stock &nbsp;|&nbsp; {new Date().getFullYear()}
        </p>

        <p
          className="font-victor text-xs leading-relaxed mb-6 max-w-xs"
          style={{ color: "rgba(176,170,152,0.45)" }}
        >
          {item.description}
        </p>

        <div className="flex items-center gap-6" style={{ justifyContent: isEven ? "flex-start" : "flex-end" }}>
          <span
            className="font-victor text-base tracking-widest"
            style={{ color: "#d4af37" }}
          >
            {item.price}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(item); }}
            className="font-victor text-[10px] tracking-[0.3em] px-5 py-2 transition-all hover:border-gold/60"
            style={{
              border: "1px solid rgba(176,170,152,0.15)",
              color: "rgba(176,170,152,0.6)",
            }}
            data-cursor-hover
          >
            view →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Item Modal ── */
function ItemModal({
  item,
  onClose,
}: {
  item: JewelryItem;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToOrder = () => {
    addItem(item, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(10,9,8,0.92)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        className="relative w-full max-w-4xl overflow-hidden"
        style={{
          background: "#1a1916",
          border: "1px solid rgba(212,175,55,0.15)",
        }}
        initial={{ scale: 0.94, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        {/* Corner marks */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/40 z-10" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/40 z-10" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold/40 z-10" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/40 z-10" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center font-victor text-xs"
          style={{ color: "rgba(176,170,152,0.5)", border: "1px solid rgba(176,170,152,0.1)" }}
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Foto del producto */}
          <div
            className="relative border-b md:border-b-0 md:border-r"
            style={{
              borderColor: "rgba(212,175,55,0.08)",
              background: "linear-gradient(135deg, #1e1d1a, #141310)",
              minHeight: 360,
            }}
          >
            <ProductImage item={item} />
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <p className="chapter-label text-[10px] mb-3">{item.material}</p>
              <h2
                className="font-victor font-bold text-xl mb-1 tracking-wide"
                style={{ color: "#d4af37" }}
              >
                [ {item.name} ]
              </h2>
              <p
                className="font-victor text-[10px] tracking-[0.3em] mb-6"
                style={{ color: "rgba(176,170,152,0.35)" }}
              >
                {item.subtitle}
              </p>

              <div className="gold-divider mb-6" />

              <p
                className="font-victor text-xs leading-relaxed mb-8"
                style={{ color: "rgba(176,170,152,0.5)" }}
              >
                {item.description}
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { label: "MATERIAL", value: item.material },
                  { label: "PRICE", value: item.price },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between pb-3"
                    style={{ borderBottom: "1px solid rgba(176,170,152,0.06)" }}
                  >
                    <span className="chapter-label text-[10px]">{label}</span>
                    <span
                      className="font-victor text-xs tracking-widest"
                      style={{ color: "#d4af37" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToOrder}
                className="w-full py-3 font-victor text-xs tracking-[0.35em] transition-colors metal-shine"
                style={{
                  background: "#d4af37",
                  color: "#0a0908",
                }}
                data-cursor-hover
              >
                {added ? "added ✓" : "ADD TO ORDER"}
              </button>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 300);
                }}
                className="w-full py-3 font-victor text-xs tracking-[0.35em] transition-all"
                style={{
                  border: "1px solid rgba(212,175,55,0.25)",
                  color: "#d4af37",
                }}
                data-cursor-hover
              >
                INQUIRE NOW
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Collection section ── */
export default function Collection() {
  const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      className="relative py-24 md:py-36 overflow-hidden"
      id="collection"
    >
      {/* ── Subtle crosshatch corner marks (like reference screenshots) ── */}
      <div
        className="absolute top-8 left-8 w-5 h-5 hidden md:block"
        style={{
          borderTop: "1px solid rgba(176,170,152,0.12)",
          borderLeft: "1px solid rgba(176,170,152,0.12)",
        }}
      />
      <div
        className="absolute top-8 right-8 w-5 h-5 hidden md:block"
        style={{
          borderTop: "1px solid rgba(176,170,152,0.12)",
          borderRight: "1px solid rgba(176,170,152,0.12)",
        }}
      />
      <div
        className="absolute bottom-8 left-8 w-5 h-5 hidden md:block"
        style={{
          borderBottom: "1px solid rgba(176,170,152,0.12)",
          borderLeft: "1px solid rgba(176,170,152,0.12)",
        }}
      />
      <div
        className="absolute bottom-8 right-8 w-5 h-5 hidden md:block"
        style={{
          borderBottom: "1px solid rgba(176,170,152,0.12)",
          borderRight: "1px solid rgba(176,170,152,0.12)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6">
        {/* ── Section header ── */}
        <div ref={headingRef} className="mb-20 opacity-0">
          <p className="chapter-label tracking-[0.5em] mb-3">products</p>
          <div
            className="h-px w-full mb-12"
            style={{ background: "rgba(176,170,152,0.08)" }}
          />
        </div>

        {/* ── Product rows ── */}
        {collectionItems.map((item, i) => (
          <ProductRow
            key={item.id}
            item={item}
            index={i}
            onSelect={setSelectedItem}
          />
        ))}

        {/* ── Bottom CTA ── */}
        <motion.div
          className="mt-8 pt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ borderTop: "1px solid rgba(176,170,152,0.06)" }}
        >
          <p
            className="font-victor text-[10px] tracking-[0.5em] mb-5"
            style={{ color: "rgba(176,170,152,0.25)" }}
          >
            private commissions available
          </p>
          <button
            className="font-victor text-xs tracking-[0.3em] px-10 py-3 transition-all"
            style={{
              border: "1px solid rgba(212,175,55,0.2)",
              color: "rgba(212,175,55,0.7)",
            }}
            data-cursor-hover
          >
            request custom piece
          </button>
        </motion.div>
      </div>

      {/* ── Item Modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
