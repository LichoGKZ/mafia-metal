"use client";

import Image from "next/image";
import type React from "react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Galería "pared de forense" — fotos prendidas con un poco de desorden
 * intencional (rotación + offset por foto, tamaños mezclados), todo
 * contenido dentro de UN marco ornamentado que engloba el conjunto
 * (CSS border-image, no <img> por foto).
 *
 * Determinístico: usamos el índice como semilla en vez de Math.random()
 * para que el layout no cambie entre server render y client render
 * (evita el warning de hydration de Next).
 */

/** Marco ornamentado general que envuelve todo el collage. Poné `false` para quitarlo. */
const SHOW_COLLAGE_FRAME = true;

// pseudo-random estable [0,1) a partir de un entero — mismo patrón que
// usan en GraffitiBackground.tsx
function rand(n: number) {
  return Math.abs(Math.sin(n * 12.9898)) % 1;
}

// tamaños que se van alternando para romper la grilla (algunas fotos
// más grandes / "hero", la mayoría chicas, alguna angosta vertical)
const SIZE_CYCLE = [
  "w-[46%] sm:w-[30%] aspect-[4/5]", // grande
  "w-[30%] sm:w-[19%] aspect-square", // chica
  "w-[36%] sm:w-[22%] aspect-[3/4]", // media
  "w-[30%] sm:w-[19%] aspect-[4/5]", // chica alta
  "w-[36%] sm:w-[24%] aspect-[5/4]", // media apaisada
];

export default function FramedGallery({
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

  // layout por foto: rotación, desplazamiento vertical y tamaño,
  // todo calculado una sola vez y estable entre renders.
  // Redondeamos a pocos decimales para que el número que renderiza el
  // servidor sea idéntico, carácter a carácter, al que aplica Framer
  // Motion en el cliente (si no, valores como 2.242831895819997 vs
  // 2.24283 no matchean y React tira el warning de hydration).
  const round = (n: number, decimals = 2) => {
    const f = 10 ** decimals;
    return Math.round(n * f) / f;
  };

  const layout = useMemo(
    () =>
      images.map((_, i) => {
        const r1 = rand(i + 1);
        const r2 = rand(i + 47);
        const r3 = rand(i + 91);
        return {
          rotate: round((r1 - 0.5) * 9), // entre -4.5 y 4.5 grados — CSS puro, Framer no la toca
          liftPx: Math.round((r2 - 0.5) * 34), // entre -17 y 17px, desprolijo verticalmente
          size: SIZE_CYCLE[i % SIZE_CYCLE.length],
          // todas las fotos llevan cinta washi; solo varía un poco la inclinación
          tapeRotate: round((r3 - 0.5) * 16), // entre -8° y 8°
        };
      }),
    [images]
  );

  return (
    <>
      <div
        className={`relative mx-auto max-w-6xl ${className}`}
        style={SHOW_COLLAGE_FRAME ? {
          // el marco: una sola imagen que envuelve todo el bloque de fotos.
          // ajustá border-image-slice / -width al tamaño real del PNG si
          // hace falta afinar el grosor de las esquinas.
          borderStyle: "solid",
          borderWidth: "clamp(34px, 6vw, 78px)",
          borderImageSource: "url('/images/brand/marco-ornamentado.png')",
          borderImageSlice: "130 fill",
          borderImageWidth: "clamp(34px, 6vw, 78px)",
          borderImageOutset: "0",
          borderImageRepeat: "stretch",
        } : undefined}
      >
        {/* fondo detrás de las fotos, dentro del marco */}
        {SHOW_COLLAGE_FRAME && (
          <div
            className="absolute inset-0 -z-10"
            style={{ background: "#eae5d6" }}
          />
        )}

        <div className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-10 py-8 sm:py-10 px-2 sm:px-4">
          {images.map((src, i) => {
            const l = layout[i];
            return (
              // Wrapper estático: la inclinación vive acá, como variable
              // CSS pura. Framer Motion nunca la toca, así que no hay
              // segunda fuente reformateando el número → sin mismatch de
              // hydration. El "enderezado" al hover también es CSS puro.
              <div
                key={src}
                className={`relative ${l.size} group tilt-card transition-transform duration-300 ease-out`}
                style={
                  {
                    "--tilt": `${l.rotate}deg`,
                    transform: "rotate(var(--tilt))",
                  } as React.CSSProperties
                }
              >
                <motion.button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  data-cursor-hover
                  initial={{ opacity: 0, y: 24 + l.liftPx }}
                  whileInView={{ opacity: 1, y: l.liftPx }}
                  viewport={{ once: true, margin: "-60px" }}
                  whileHover={{ scale: 1.06, zIndex: 30 }}
                  transition={{ duration: 0.6, delay: (i % 8) * 0.05 }}
                  className="relative block w-full h-full"
                  suppressHydrationWarning
                >
                  {/* foto directa, sin marco/borde blanco extra */}
                  <div className="relative w-full h-full overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
                    <Image
                      src={src}
                      alt={`${alt} ${i + 1}`}
                      fill
                      className="object-cover grayscale-[0.15] contrast-[1.05] transition-all duration-500 group-hover:grayscale-0"
                      sizes="(max-width: 768px) 45vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/10 transition-colors duration-300" />
                  </div>

                  {/* cinta washi en TODAS las fotos (incluida la fila inferior) */}
                  <span
                    aria-hidden
                    className="absolute -top-2.5 left-1/2 z-[3] w-10 h-4 sm:w-12 sm:h-5 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgb(var(--gold-rgb) / 0.85), rgb(var(--gold-dark-rgb) / 0.75))",
                      transform: `translateX(-50%) rotate(${l.tapeRotate}deg)`,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.35)",
                      opacity: 0.85,
                    }}
                  />

                  {/* lupa on hover */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-victor text-[10px] tracking-[0.3em] text-gold bg-obsidian/70 px-3 py-1">
                      VER
                    </span>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .tilt-card:hover {
          --tilt: 0deg;
        }
      `}</style>

      {/* Lightbox */}
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
              style={{ border: "1px solid rgba(23,21,15,0.15)" }}
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