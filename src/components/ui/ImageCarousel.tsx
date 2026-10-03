"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

/**
 * Carrusel de imágenes reutilizable. Usado para mostrar múltiples fotos
 * de un mismo producto o de una misma tanda temática (drag / flechas / dots).
 */
export default function ImageCarousel({
  images,
  alt,
  aspect = "aspect-square",
  className = "",
  showCounter = true,
}: {
  images: string[];
  alt: string;
  aspect?: string;
  className?: string;
  showCounter?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!images || images.length === 0) return null;

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setIndex((i) => (i + dir + images.length) % images.length);
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  return (
    <div className={`relative ${aspect} overflow-hidden group ${className}`}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          drag={images.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            fill
            className="object-contain p-6 drop-shadow-[0_14px_16px_rgba(0,0,0,0.3)] pointer-events-none select-none"
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          {/* Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-silver/70 hover:text-gold transition-colors opacity-0 group-hover:opacity-100"
            style={{ background: "rgba(10,9,8,0.4)" }}
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-silver/70 hover:text-gold transition-colors opacity-0 group-hover:opacity-100"
            style={{ background: "rgba(10,9,8,0.4)" }}
            aria-label="Siguiente"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  background:
                    i === index ? "var(--gold)" : "rgba(255,255,255,0.3)",
                  transform: i === index ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`Ir a la imagen ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          {showCounter && (
            <div
              className="absolute top-3 right-3 z-20 px-2 py-0.5 font-victor text-[9px] tracking-[0.2em]"
              style={{ background: "rgba(10,9,8,0.5)", color: "rgb(var(--gold-rgb) / 0.9)" }}
            >
              {index + 1} / {images.length}
            </div>
          )}
        </>
      )}
    </div>
  );
}
