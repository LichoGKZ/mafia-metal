"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { JewelryItem } from "@/data/collection";
import { useCart, formatARS } from "@/context/CartContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import SizeGuideModal from "@/components/ui/SizeGuideModal";
import ImageCarousel from "@/components/ui/ImageCarousel";
import BagIcon from "@/components/ui/BagIcon";

/* Tokens de texto (contraste mínimo 4.5:1 sobre fondo claro). */
const INK = "#0b0b0b";
const INK_SOFT = "rgba(11,11,11,0.72)";
const LINE = "#0b0b0b";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const itemAmbients: Record<string, { gradient: string }> = {
  "one-love": {
    gradient: "radial-gradient(ellipse at 35% 50%, rgb(var(--gold-rgb) / 0.10) 0%, rgba(139,90,20,0.06) 45%, transparent 70%)",
  },
  "only-trust": {
    gradient: "radial-gradient(ellipse at 35% 50%, rgba(200,200,220,0.10) 0%, rgba(120,120,140,0.06) 40%, transparent 70%)",
  },
  "tag-mafia": {
    gradient: "radial-gradient(ellipse at 35% 50%, rgba(180,145,30,0.09) 0%, rgba(80,60,5,0.06) 42%, transparent 68%)",
  },
};

/* ── Foto del producto (carrusel si hay varias, o placeholder si no hay) ── */
function ProductImage({
  item,
  className,
  carousel = false,
}: {
  item: JewelryItem;
  className?: string;
  carousel?: boolean;
}) {
  if (!item.image) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className ?? ""}`}
        style={{ background: "linear-gradient(135deg, #f0ede2, #e6e1d1)" }}
      >
        <p
          className="font-victor text-[10px] tracking-[0.3em] text-center px-4"
          style={{ color: "rgba(23,21,15,0.65)" }}
        >
          FOTO PRÓXIMAMENTE
        </p>
      </div>
    );
  }

  if (carousel && item.images && item.images.length > 1) {
    return (
      <ImageCarousel
        images={item.images}
        alt={item.name}
        aspect="h-full w-full"
        className={className}
      />
    );
  }

  // Las fotos van como PNG recortado (sin fondo): object-contain + sombra
  // proyectada siguiendo la silueta de la pieza (drop-shadow, no box-shadow).
  return (
    <Image
      src={item.image}
      alt={item.name}
      fill
      className={`object-contain p-6 drop-shadow-[0_14px_16px_rgba(0,0,0,0.3)] ${className ?? ""}`}
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
        style={{ boxShadow: "inset 0 0 0 1px rgb(var(--gold-rgb) / 0.25)" }}
      />

      {/* ── Hover ambient background — themed per item ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: itemAmbients[item.id]?.gradient ?? "none" }}
      />

      {/* ── Foto del producto ── */}
      <div className="w-full md:w-1/2 relative z-[1]">
        <div className="relative overflow-hidden">
          <div
            className="h-64 md:h-80 relative"
            style={{ background: "linear-gradient(135deg, #f0ede2, #e6e1d1)" }}
          >
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
                      : "rgb(var(--gold-rgb) / 0.9)",
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
          style={{ background: "rgba(23,21,15,0.55)" }}
        />
      </div>

      {/* ── Text info ── */}
      <div
        className={`w-full md:w-1/2 px-6 md:px-10 py-6 relative z-[1] ${
          isEven ? "text-left" : "text-right md:text-right"
        }`}
      >
        <div
          className="font-victor mb-2"
          style={{
            fontSize: "2.75rem",
            color: "#17150f",
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div
          className="font-victor font-bold text-lg md:text-xl tracking-[0.08em] mb-1"
          style={{ color: "#17150f" }}
        >
          {item.name}
        </div>

        {/* Solo material | stock | año — sin descripción ni precio, tal
            como pidió la clienta (que solo se vea el nombre del producto
            y este dato corto). El detalle completo sigue disponible al
            hacer click, en el modal. */}
        <p
          className="font-victor text-[11px] tracking-[0.25em]"
          style={{ color: INK_SOFT }}
        >
          {item.subtitle?.toLowerCase() || item.material?.toLowerCase()} &nbsp;|&nbsp; en
          stock &nbsp;|&nbsp; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

/* ── Item Modal ──
   Contraste: antes los textos usaban rgba(23,21,15,x) (tinta oscura) sobre
   un fondo #1a1916 (también oscuro) → ilegible. Ahora la ficha es papel
   claro con tinta oscura (como el mockup) y todos los textos usan los
   tokens de abajo (mínimo 4.5:1 de contraste). */
function ItemModal({
  item,
  onClose,
}: {
  item: JewelryItem;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [material, setMaterial] = useState(item.material);

  const needsSize = !!item.sizes && item.sizes.length > 0;
  const sizeMissing = needsSize && !size;
  const hasSizeCm = !!item.sizeCm;

  useScrollLock(true);

  // Escape cierra la ficha (la guía de talles captura su propio Escape).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !guideOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, guideOpen]);

  const pickSize = (v: string) => {
    setSize(v);
    setSizeError(false);
  };

  const handleAddToOrder = () => {
    if (sizeMissing) {
      setSizeError(true); // feedback visual en vez de agregar sin talle
      return;
    }
    addItem({ ...item, material }, 1, needsSize ? size : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const priceLabel =
    item.priceARS > 0 ? formatARS(item.priceARS) : item.price;

  // Variantes de material: hoy una por pieza; si más adelante hay
  // más (ej. "Plata" / "Alpaca") alcanza con sumarlas acá.
  const materialOptions = [item.material].filter(Boolean);

  return (
    <motion.div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "rgba(10,9,8,0.7)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* data-lenis-prevent + overscroll-contain: la ficha scrollea sola y
          no arrastra la página de atrás. */}
      <motion.div
        data-lenis-prevent
        className="relative w-full max-w-4xl overflow-y-auto overscroll-contain"
        style={{
          background: "#fff",
          color: INK,
          border: `2px solid ${LINE}`,
          maxHeight: "90vh",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        initial={{ scale: 0.94, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center text-sm bg-white hover:bg-black hover:text-white transition-colors"
          style={{ color: INK, border: `1px solid ${LINE}` }}
          data-cursor-hover
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Foto del producto */}
          <div
            className="relative border-b-2 md:border-b-0 md:border-r-2"
            style={{
              borderColor: LINE,
              background: "linear-gradient(135deg, #f0ede2, #e6e1d1)",
              minHeight: 360,
            }}
          >
            <ProductImage item={item} carousel />
          </div>

          {/* Detalles — jerarquía:
              1) Título  2) Material | Tipo de pieza  3) Talle / Tamaño en cm
              4) Descripción  (5) Imágenes de referencia, abajo) */}
          <div className="flex flex-col">
            {/* Título: marca/nombre en negrita + precio */}
            <div
              className="px-6 pt-6 pb-4 pr-14 border-b-2"
              style={{ borderColor: LINE }}
            >
              <h2
                className="font-victor font-bold text-2xl md:text-3xl tracking-[0.04em] uppercase"
                style={{ color: INK }}
              >
                {item.name}
              </h2>
              {item.subtitle && (
                <p className="mt-1 text-sm" style={{ color: INK_SOFT }}>
                  {item.subtitle}
                </p>
              )}
              <p className="mt-3 text-base" style={{ color: INK }}>
                {priceLabel}
              </p>
            </div>

            {/* Material | Tipo de pieza */}
            <div
              className="grid grid-cols-[1.4fr_1fr] border-b-2"
              style={{ borderColor: LINE }}
            >
              <div className="p-4 border-r-2" style={{ borderColor: LINE }}>
                <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: INK_SOFT }}>
                  Material
                </p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Material">
                  {materialOptions.map((m) => {
                    const on = material === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setMaterial(m)}
                        className="px-3 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-black hover:text-white"
                        style={{
                          border: `1.5px solid ${LINE}`,
                          background: on ? INK : "#fff",
                          color: on ? "#fff" : INK,
                        }}
                        data-cursor-hover
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4">
                <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: INK_SOFT }}>
                  Tipo de pieza
                </p>
                <p className="text-sm uppercase" style={{ color: INK }}>
                  {item.pieceType ?? "—"}
                </p>
              </div>
            </div>

            {/* Talle (con ayuda) / Tamaño en cm */}
            <div
              className={`grid border-b-2 ${hasSizeCm ? "grid-cols-[1.4fr_1fr]" : "grid-cols-1"}`}
              style={{ borderColor: LINE }}
            >
              <div
                className={`p-4 ${hasSizeCm ? "border-r-2" : ""}`}
                style={{ borderColor: LINE }}
              >
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="talle-select"
                    className="text-[11px] tracking-[0.2em] uppercase"
                    style={{ color: INK_SOFT }}
                  >
                    Talle
                  </label>
                  {needsSize && (
                    <button
                      type="button"
                      onClick={() => setGuideOpen(true)}
                      aria-label="Abrir guía de talles"
                      aria-haspopup="dialog"
                      title="Guía de talles"
                      className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold hover:bg-black hover:text-white transition-colors"
                      style={{ border: `1.5px solid ${LINE}`, color: INK }}
                      data-cursor-hover
                    >
                      ?
                    </button>
                  )}
                </div>

                {needsSize ? (
                  <motion.div
                    key={sizeError ? "err" : "ok"}
                    animate={sizeError ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <select
                      id="talle-select"
                      value={size}
                      onChange={(e) => pickSize(e.target.value)}
                      aria-invalid={sizeError}
                      className="w-full px-2 py-1.5 text-xs outline-none cursor-pointer"
                      style={{
                        // Estado inicial gris neutro → negro al elegir
                        background: size ? "#fff" : "#e4e4e1",
                        color: size ? INK : "#4a4a46",
                        border: size
                          ? `1.5px solid ${LINE}`
                          : `1.5px dashed ${sizeError ? "#b00020" : "#6b6b66"}`,
                      }}
                    >
                      <option value="">Elegir talle</option>
                      {item.sizes!.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ) : (
                  <p className="text-sm" style={{ color: INK }}>
                    Talle único
                  </p>
                )}
              </div>

              {hasSizeCm && (
                <div className="p-4">
                  <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: INK_SOFT }}>
                    Tamaño
                  </p>
                  <p className="text-sm" style={{ color: INK }}>
                    {item.sizeCm} cm
                  </p>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="p-6 flex-1">
              <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: INK_SOFT }}>
                Descripción
              </p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: INK_SOFT }}>
                {item.description}
              </p>

              {sizeError && (
                <p role="alert" className="text-xs mb-3" style={{ color: "#b00020" }}>
                  Elegí un talle para agregar al carrito.{" "}
                  <button
                    type="button"
                    onClick={() => setGuideOpen(true)}
                    className="underline"
                  >
                    Ver guía de talles
                  </button>
                </p>
              )}

              {/* Aviso de plazo de entrega */}
              <p
                role="note"
                className="mb-4 px-4 py-3 text-sm font-bold bg-gold"
                style={{ color: INK, border: `2px solid ${LINE}` }}
              >
                *Tu pedido estará disponible dentro de 14 días hábiles
              </p>

              {/* Botón: bolsa. Sin talle queda en gris y avisa al tocarlo. */}
              <button
                onClick={handleAddToOrder}
                aria-disabled={sizeMissing}
                aria-label={added ? "Agregado al carrito" : "Agregar al carrito"}
                className="w-full py-3 flex items-center justify-center gap-3 text-xs tracking-[0.3em] uppercase transition-colors"
                style={{
                  background: sizeMissing ? "#c9c9c5" : INK,
                  color: sizeMissing ? "#3d3d3a" : "#fff",
                  cursor: sizeMissing ? "not-allowed" : "pointer",
                }}
                data-cursor-hover
              >
                <BagIcon className="w-5 h-5" />
                {added ? "Agregado ✓" : sizeMissing ? "Elegí tu talle" : "Agregar"}
              </button>
            </div>
          </div>
        </div>

        {/* ── As worn by (lifestyle) ── */}
        {item.lifestyleImages && item.lifestyleImages.length > 0 && (
          <div className="border-t-2 px-6 py-6" style={{ borderColor: LINE }}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] tracking-[0.3em] uppercase" style={{ color: INK_SOFT }}>
                Imágenes de referencia
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(11,11,11,0.25)" }} />
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {item.lifestyleImages.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden group"
                  style={{ border: `1px solid ${LINE}` }}
                >
                  <Image
                    src={src}
                    alt={`${item.name} — imagen de referencia ${i + 1}`}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    sizes="150px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {guideOpen && (
          <SizeGuideModal
            onClose={() => setGuideOpen(false)}
            selected={size}
            onPick={(v) => {
              pickSize(v);
              setGuideOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Collection section ── */
export default function Collection({ items }: { items: JewelryItem[] }) {
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
      className="relative street-tint py-24 md:py-36 overflow-hidden"
      id="collection"
    >
      {/* ── Subtle crosshatch corner marks (like reference screenshots) ── */}
      <div
        className="absolute top-8 left-8 w-5 h-5 hidden md:block"
        style={{
          borderTop: "1px solid rgba(23,21,15,0.12)",
          borderLeft: "1px solid rgba(23,21,15,0.12)",
        }}
      />
      <div
        className="absolute top-8 right-8 w-5 h-5 hidden md:block"
        style={{
          borderTop: "1px solid rgba(23,21,15,0.12)",
          borderRight: "1px solid rgba(23,21,15,0.12)",
        }}
      />
      <div
        className="absolute bottom-8 left-8 w-5 h-5 hidden md:block"
        style={{
          borderBottom: "1px solid rgba(23,21,15,0.12)",
          borderLeft: "1px solid rgba(23,21,15,0.12)",
        }}
      />
      <div
        className="absolute bottom-8 right-8 w-5 h-5 hidden md:block"
        style={{
          borderBottom: "1px solid rgba(23,21,15,0.12)",
          borderRight: "1px solid rgba(23,21,15,0.12)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6">
        {/* ── Section header ── */}
        <div ref={headingRef} className="mb-20 opacity-0">
          <p className="chapter-label tracking-[0.5em] mb-3">productos</p>
          <div
            className="h-px w-full mb-12"
            style={{ background: "rgba(23,21,15,0.08)" }}
          />
        </div>

        {/* ── Product rows ── */}
        {items.map((item, i) => (
          <ProductRow
            key={item.id}
            item={item}
            index={i}
            onSelect={setSelectedItem}
          />
        ))}

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
