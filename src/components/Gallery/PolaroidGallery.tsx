"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";

/**
 * Galería estilo Polaroid.
 *
 * - Cada marco se ajusta a la proporción real de SU foto: no hay `aspect-*`
 *   ni alturas fijas, la imagen define el alto (width 100% / height auto).
 *   Resultado: ni recortes ni marcos más largos que la foto.
 * - Mosaico por columnas CSS: los marcos de distinta altura encajan sin
 *   dejar huecos.
 * - Vista previa reducida; la foto se abre en grande (lightbox) solo al
 *   hacer clic. Esc cierra, ← → navegan.
 */

// Inclinación fija por posición (determinista → sin errores de hidratación).
const TILTS = [-2.2, 1.6, -1, 2.4, -1.8, 1.2];

interface Props {
  photos: string[];
  /** id de la sección (el menú apunta a #gallery). */
  id?: string;
  /** Texto de la etiqueta de la sección. */
  title?: string;
  alt?: string;
  className?: string;
}

export default function PolaroidGallery({
  photos,
  id = "gallery",
  title = "galería",
  alt = "Foto de la galería de Mafia Metal",
  className = "bg-obsidian",
}: Props) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (dir: 1 | -1) =>
      setActive((i) =>
        i === null ? i : (i + dir + photos.length) % photos.length
      ),
    [photos.length]
  );

  return (
    <section id={id} className={`relative py-24 md:py-32 px-4 md:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <p className="font-victor text-xs tracking-[0.5em] uppercase text-[#e8e6e0] mb-12">
          {title}
        </p>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ampliar foto ${i + 1} de ${photos.length}`}
              aria-haspopup="dialog"
              style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as React.CSSProperties}
              className="block w-full mb-4 md:mb-6 break-inside-avoid bg-white p-1.5 pb-6 md:p-2 md:pb-8 shadow-[0_8px_20px_rgba(0,0,0,0.45)] [transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)_scale(1.03)] focus-visible:[transform:rotate(0deg)_scale(1.03)] transition-transform duration-300 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffec00]"
              data-cursor-hover
            >
              {/* height:auto → el marco toma exactamente la proporción de la foto */}
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                width={0}
                height={0}
                sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                style={{ width: "100%", height: "auto", display: "block" }}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <Lightbox
            key="lightbox"
            src={photos[active]}
            index={active}
            total={photos.length}
            alt={`${alt} ${active + 1}`}
            onClose={close}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Lightbox ── */
function Lightbox({
  src,
  index,
  total,
  alt,
  onClose,
  onPrev,
  onNext,
}: {
  src: string;
  index: number;
  total: number;
  alt: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  if (typeof document === "undefined") return null;

  const navBtn =
    "absolute top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-xl bg-white text-[#0b0b0b] border border-black hover:bg-[#ffec00] transition-colors";

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9700] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada"
    >
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* El marco vuelve a hugging la foto: max-width/max-height + auto
          conservan la proporción original sea vertical u horizontal. */}
      <motion.figure
        key={src}
        className="relative bg-white p-2 pb-10 md:p-3 md:pb-12 shadow-2xl"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        <Image
          src={src}
          alt={alt}
          width={0}
          height={0}
          sizes="92vw"
          priority
          style={{
            width: "auto",
            height: "auto",
            maxWidth: "min(88vw, 960px)",
            maxHeight: "76vh",
            display: "block",
          }}
        />
        <figcaption className="absolute bottom-2 md:bottom-3 left-0 right-0 text-center text-xs text-[#17150f]">
          {index + 1} / {total}
        </figcaption>
      </motion.figure>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-lg bg-white text-[#0b0b0b] border border-black hover:bg-[#ffec00] transition-colors"
        data-cursor-hover
      >
        ✕
      </button>
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={onPrev}
            aria-label="Foto anterior"
            className={`${navBtn} left-3 md:left-6`}
            data-cursor-hover
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Foto siguiente"
            className={`${navBtn} right-3 md:right-6`}
            data-cursor-hover
          >
            ›
          </button>
        </>
      )}
    </motion.div>,
    document.body
  );
}
