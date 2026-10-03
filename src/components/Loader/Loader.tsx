"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

// Clave usada para saber si ya se mostró el loader completo en esta
// sesión de navegación. Ver nota UX más abajo.
const SESSION_KEY = "mm_loader_seen";

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // UX: el loader de marca (con progreso, textos, etc.) tiene sentido la
  // primera vez que alguien entra al sitio, pero repetirlo en cada
  // navegación/recarga dentro de la misma sesión es fricción pura frente
  // al catálogo. Con sessionStorage lo mostramos una sola vez por sesión;
  // las veces siguientes se salta con una transición mínima.
  useLayoutEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // sessionStorage puede fallar (modo privado, SSR, etc.) — en ese
      // caso simplemente mostramos el loader completo como antes.
    }

    if (alreadySeen) {
      setVisible(false);
      return;
    }

    const tl = gsap.timeline();

    // Duración recortada (antes 2.2s + 1.2s = 3.4s) para que la primera
    // acción útil de la página (el CTA del Hero) aparezca antes.
    tl.to(
      {},
      {
        duration: 1.4,
        onUpdate: function () {
          setProgress(Math.round(this.progress() * 100));
        },
      }
    ).then(() => {
      gsap.to(loaderRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
          setVisible(false);
          // Recién acá marcamos la sesión como "ya vio el loader": si lo
          // hiciéramos al empezar, el Hero (que lee esta misma clave en
          // su propio useLayoutEffect) podría leerla ya en "1" durante la
          // primera visita y saltarse su propia espera por error.
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            /* no-op */
          }
        },
      });
    });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div
          ref={loaderRef}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-obsidian overflow-hidden"
        >
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-5 noise-texture" />

          {/* Top & bottom gold lines */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-gold-gradient"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gold-gradient"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />

          {/* Logo — el wordmark está centrado exacto en el viewport (vertical y
              horizontal). El isotipo y la leyenda "Mar del Plata" se anclan por
              encima con posición absoluta, así no desplazan el centro. */}
          <motion.div
            className="relative text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 flex flex-col items-center">
              <Image
                src="/images/brand/logo-mafia-gold.svg"
                alt=""
                width={56}
                height={56}
                className="mb-5 opacity-90"
              />
              <span
                className="font-victor font-bold text-[11px] md:text-xs uppercase whitespace-nowrap"
                style={{
                  letterSpacing: "0.5em",
                  paddingLeft: "0.5em", // compensa el espacio final del tracking
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Mar del Plata
              </span>
            </div>

            {/* Mismo cuerpo, peso y tracking en ambas líneas (5 letras c/u en
                monoespaciada → ancho idéntico). Amarillo + blanco sólidos para
                el máximo contraste sobre obsidiana. */}
            <h1
              className="font-victor font-bold leading-[1.05] text-[clamp(2.75rem,11vw,5.5rem)]"
              style={{ letterSpacing: "0.35em", paddingLeft: "0.35em" }}
            >
              <span
                className="block"
                style={{
                  color: "var(--gold)",
                  textShadow: "0 0 24px rgb(var(--gold-rgb) / 0.35)",
                }}
              >
                MAFIA
              </span>
              <span className="block" style={{ color: "#ffffff" }}>
                METAL
              </span>
            </h1>
          </motion.div>

          {/* Progress bar — anclada abajo para no empujar el logo del centro */}
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-64 md:w-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between mb-2">
              <span
                className="font-victor font-bold text-xs tracking-[0.3em]"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                CARGANDO
              </span>
              <span className="font-victor font-bold text-gold text-lg">{progress}%</span>
            </div>
            <div className="h-px bg-white/15 w-full relative overflow-hidden">
              <div
                ref={barRef}
                className="absolute top-0 left-0 h-full bg-gold transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>

          {/* Bottom classified text */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.8 }}
          >
            <span className="font-victor text-xs tracking-[0.5em] text-white/70 whitespace-nowrap" style={{ paddingLeft: "0.5em" }}>
              HECHO A MANO EN ARGENTINA
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}