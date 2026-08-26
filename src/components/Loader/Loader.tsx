"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(
      {},
      {
        duration: 2.2,
        onUpdate: function () {
          setProgress(Math.round(this.progress() * 100));
        },
      }
    ).then(() => {
      gsap.to(loaderRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => setVisible(false),
      });
    });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div
          ref={loaderRef}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-obsidian overflow-hidden"
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

          {/* Logo */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Image
              src="/images/brand/logo-mafia-gold.svg"
              alt=""
              width={56}
              height={56}
              className="mx-auto mb-6 opacity-90"
            />
            <div className="chapter-label mb-4 tracking-[0.6em]">
              MAR DEL PLATA
            </div>
            <h1 className="font-victor text-4xl md:text-6xl font-black text-gold-gradient tracking-widest">
              MAFIA
            </h1>
            <h1 className="font-victor text-4xl md:text-6xl font-black text-silver-gradient tracking-[0.5em]">
              METAL
            </h1>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="w-64 md:w-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between mb-2">
              <span className="chapter-label text-xs">CARGANDO</span>
              <span className="font-victor text-gold text-lg">{progress}%</span>
            </div>
            <div className="h-px bg-void w-full relative overflow-hidden">
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
            <span className="font-victor text-xs tracking-[0.5em] text-silver">
              HECHO A MANO EN ARGENTINA
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}