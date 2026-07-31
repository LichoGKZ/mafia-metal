"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Grilla de fotos (mosaico) con lightbox a pantalla completa.
 * Usada para tandas grandes de fotos del mismo tema (gallery, custom, etc).
 */
export default function PhotoLightboxGrid({
  images,
  alt,
  className = "",
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, next, prev]);

  return (
    <>
      <div
        className={`columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:_balance] ${className}`}
      >
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpenIndex(i)}
            data-cursor-hover
            className="relative block w-full mb-3 overflow-hidden group break-inside-avoid"
            style={{ border: "1px solid rgba(212,175,55,0.08)" }}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              width={600}
              height={800}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/20 transition-colors duration-500" />
            <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gold text-xs font-victor">
              +
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[9800] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div
              className="absolute inset-0"
              style={{ background: "rgba(10,9,8,0.95)", backdropFilter: "blur(8px)" }}
            />

            <button
              onClick={close}
              className="absolute top-5 right-5 md:top-8 md:right-8 z-10 w-9 h-9 flex items-center justify-center font-victor text-sm text-silver/60 hover:text-gold transition-colors"
              style={{ border: "1px solid rgba(176,170,152,0.15)" }}
              aria-label="Cerrar"
            >
              ×
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-silver/60 hover:text-gold transition-colors text-2xl"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-silver/60 hover:text-gold transition-colors text-2xl"
              aria-label="Siguiente"
            >
              ›
            </button>

            <motion.div
              key={openIndex}
              className="relative z-[1] max-w-4xl max-h-[85vh] w-full"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh] md:h-[80vh]">
                <Image
                  src={images[openIndex]}
                  alt={`${alt} ${openIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <p className="text-center mt-3 font-victor text-[10px] tracking-[0.3em] text-silver/40">
                {openIndex + 1} / {images.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
