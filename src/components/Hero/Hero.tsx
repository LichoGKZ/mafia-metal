"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
export default function Hero() {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollIndicatorRef.current) return;
    gsap.to(scrollIndicatorRef.current, {
      opacity: 0,
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.4,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-dj.jpg"
          alt="Mafia Metal DJ"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Grain over photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,...\")",
            opacity: 0.08,
          }}
        />
      </div>

      {/* ── Photo vignette ── */}
      <div
        className="absolute inset-0 z-10 hero-photo-overlay pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(17,16,14,0.15) 0%, rgba(17,16,14,0.05) 40%, rgba(17,16,14,0.7) 100%)",
        }}
      />

      {/* ── Bottom content: "NEW IN / check it out!" style ── */}
      <motion.div
        className="relative z-20 w-full px-6 pb-16 md:pb-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Label */}
        <span
          className="chapter-label tracking-[0.5em] text-[11px]"
          style={{ color: "rgba(212,175,55,0.7)" }}
        >
          NUEVO
        </span>

        {/* CTA pill */}
        <button
          onClick={() =>
            document
              .getElementById("collection")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="group relative px-8 py-3 font-victor text-sm tracking-[0.08em] transition-all overflow-hidden"
          style={{
            background: "rgba(10,9,8,0.85)",
            color: "#b0aa98",
            border: "1px solid rgba(176,170,152,0.15)",
          }}
          data-cursor-hover
        >
          <span className="relative z-10 group-hover:text-gold transition-colors duration-200">
            ¡Ver Ahora!
          </span>
        </button>
      </motion.div>

      {/* ── Top-left: brand text (subtle) ── */}
      <motion.div
        className="absolute top-[52px] left-6 z-20 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.6 }}
      >
        <p
          className="font-victor text-[10px] tracking-[0.5em] uppercase"
          style={{ color: "rgba(176,170,152,0.3)" }}
        >
          Mafia Metal
        </p>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-4 right-6 z-20 hidden md:flex flex-col items-end gap-1"
      >
        <span
          className="font-victor text-[9px] tracking-[0.4em] uppercase"
          style={{ color: "rgba(176,170,152,0.3)" }}
        >
          desplazate
        </span>
      </div>
    </section>
  );
}
