"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, type PanInfo } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";

/**
 * Visor de foto en ventana emergente (mismo lenguaje visual que la guía de
 * talles y la ficha de producto: panel blanco, borde negro, fondo oscurecido
 * + blur). Se abre al tocar una foto de la pared de la galería.
 *
 *  - Flechas ‹ › en pantalla, swipe en mobile y teclado ← →.
 *  - Esc o click afuera cierra.
 */
export default function GalleryModal({
  photos,
  alt,
  startIndex,
  onClose,
}: {
  photos: string[];
  alt: string;
  /** Foto con la que se abre el visor. */
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = photos.length;

  useScrollLock(true);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total),
    [total]
  );

  // Foco inicial en "cerrar" (accesibilidad con teclado).
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose, go]);

  if (typeof document === "undefined") return null;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 500) {
      go(info.offset.x < 0 ? 1 : -1);
    }
  };

  const navBtn =
    "absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center text-xl bg-white text-[#0b0b0b] border-2 border-black hover:bg-[#ffec00] transition-colors";

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9600] flex items-center justify-center p-3 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada"
    >
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(10,9,8,0.75)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
        onClick={onClose}
      />

      <motion.div
        className="relative flex flex-col w-full max-w-3xl bg-white text-[#0b0b0b]"
        style={{ maxHeight: "92vh", border: "2px solid #0b0b0b" }}
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b-2 border-black">
          <h2 className="text-xl md:text-2xl">Galería</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar foto"
            className="w-8 h-8 shrink-0 flex items-center justify-center text-sm border border-black hover:bg-black hover:text-white transition-colors"
            data-cursor-hover
          >
            ✕
          </button>
        </div>

        {/* Foto */}
        <div className="relative bg-[#f4f4f1]">
          <motion.div
            key={index}
            className="relative h-[62vh] md:h-[70vh] cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
          >
            <Image
              src={photos[index]}
              alt={`${alt} ${index + 1}`}
              fill
              draggable={false}
              priority
              className="object-contain select-none pointer-events-none"
              sizes="(max-width: 768px) 92vw, 768px"
            />
          </motion.div>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto anterior"
                className={`${navBtn} left-2 md:left-4`}
                data-cursor-hover
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Foto siguiente"
                className={`${navBtn} right-2 md:right-4`}
                data-cursor-hover
              >
                ›
              </button>
            </>
          )}

          <p className="py-3 text-center text-xs bg-white border-t-2 border-black">
            {index + 1} / {total}
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
