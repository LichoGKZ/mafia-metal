"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, type PanInfo } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";

/**
 * Galería en ventana emergente (mismo lenguaje visual que la guía de talles
 * y la ficha de producto: panel blanco, borde negro, fondo oscurecido + blur).
 *
 *  - Vista 1: grilla con todas las fotos (scroll propio dentro del modal).
 *  - Vista 2: al tocar una foto se ve grande, con flechas, swipe (mobile) y
 *    teclado ← →. "Volver" regresa a la grilla en la misma posición.
 *  - Esc: cierra la foto; con la grilla visible, cierra el modal.
 */
export default function GalleryModal({
  photos,
  alt,
  onClose,
}: {
  photos: string[];
  alt: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const savedScroll = useRef(0);
  const total = photos.length;

  useScrollLock(true);

  const openAt = (i: number) => {
    savedScroll.current = bodyRef.current?.scrollTop ?? 0;
    setIndex(i);
  };

  const go = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i === null ? i : (i + dir + total) % total)),
    [total]
  );

  // Foco inicial en "cerrar" (accesibilidad con teclado).
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Al volver a la grilla, recupera el scroll donde estaba.
  useEffect(() => {
    if (index === null && bodyRef.current) {
      bodyRef.current.scrollTop = savedScroll.current;
    }
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (index !== null) setIndex(null);
        else onClose();
      } else if (index !== null && e.key === "ArrowLeft") go(-1);
      else if (index !== null && e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [index, onClose, go]);

  if (typeof document === "undefined") return null;

  const viewing = index !== null;

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
      aria-label="Galería de fotos"
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
        className="relative flex flex-col w-full max-w-4xl bg-white text-[#0b0b0b]"
        style={{ maxHeight: "92vh", border: "2px solid #0b0b0b" }}
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b-2 border-black">
          {viewing ? (
            <button
              type="button"
              onClick={() => setIndex(null)}
              className="flex items-center gap-2 text-sm hover:underline underline-offset-4"
              data-cursor-hover
            >
              <span aria-hidden>←</span> Volver a la galería
            </button>
          ) : (
            <h2 className="text-xl md:text-2xl">
              Galería
              <span className="ml-3 text-xs text-black/60">{total} fotos</span>
            </h2>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar galería"
            className="w-8 h-8 shrink-0 flex items-center justify-center text-sm border border-black hover:bg-black hover:text-white transition-colors"
            data-cursor-hover
          >
            ✕
          </button>
        </div>

        {/* Cuerpo (scroll propio: Lenis no lo captura) */}
        <div
          ref={bodyRef}
          data-lenis-prevent
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        >
          {viewing ? (
            <div className="relative bg-[#f4f4f1]">
              <motion.div
                key={index}
                className="relative h-[58vh] md:h-[66vh] cursor-grab active:cursor-grabbing"
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
                  sizes="(max-width: 768px) 92vw, 896px"
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
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 p-3 md:p-5">
              {photos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => openAt(i)}
                  aria-label={`Ver foto ${i + 1} de ${total}`}
                  className="group relative aspect-[4/5] overflow-hidden border border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffec00]"
                  data-cursor-hover
                >
                  <Image
                    src={src}
                    alt={`${alt} ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 220px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
