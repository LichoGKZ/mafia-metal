"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { vaultItems } from "@/data/collection";

// Per-item ambient background themes (One Love / Only Trust / Tag Mafia)
const itemAmbients: Record<number, { gradient: string; glow: string; noise: string }> = {
  0: {
    gradient: "radial-gradient(ellipse at 40% 60%, rgba(212,175,55,0.18) 0%, rgba(139,90,20,0.10) 40%, transparent 70%), radial-gradient(ellipse at 70% 30%, rgba(180,120,0,0.08) 0%, transparent 60%)",
    glow: "rgba(212,175,55,0.25)",
    noise: "rgba(212,175,55,0.04)",
  },
  1: {
    gradient: "radial-gradient(ellipse at 50% 50%, rgba(192,192,210,0.14) 0%, rgba(80,80,120,0.08) 45%, transparent 70%), radial-gradient(ellipse at 25% 70%, rgba(150,150,200,0.07) 0%, transparent 60%)",
    glow: "rgba(180,180,220,0.20)",
    noise: "rgba(200,200,255,0.03)",
  },
  2: {
    gradient: "radial-gradient(ellipse at 50% 45%, rgba(180,145,30,0.18) 0%, rgba(80,60,5,0.10) 45%, transparent 70%), radial-gradient(ellipse at 70% 65%, rgba(200,160,30,0.07) 0%, transparent 55%)",
    glow: "rgba(200,160,30,0.22)",
    noise: "rgba(200,160,0,0.04)",
  },
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Vault() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isViewerHovered, setIsViewerHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const doorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Vault door reveal
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Open vault on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 40%",
        onEnter: () => setIsOpen(true),
        onLeaveBack: () => setIsOpen(false),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activeItem = vaultItems[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-obsidian overflow-hidden py-20 md:py-32"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.02] noise-texture" />

      {/* Radial gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-gold/[0.03] via-transparent to-transparent" />

      {/* Chapter header */}
      <div ref={titleRef} className="text-center mb-16 px-6 opacity-0">
        <span className="chapter-label tracking-[0.6em]">
          CHAPTER II — THE VAULT
        </span>
        <h2 className="font-cinzel font-black text-[clamp(2.5rem,7vw,6rem)] text-gold-gradient mt-4 leading-none">
          THE VAULT
        </h2>
        <div className="gold-divider max-w-md mx-auto mt-6" />
        <p className="font-inter text-silver/40 text-sm mt-4 tracking-widest max-w-md mx-auto">
          Pieces reserved for those who know where to look.
          Not advertised. Not displayed. Simply known.
        </p>
      </div>

      {/* Vault door animation */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute inset-x-0 top-1/4 bottom-0 z-30 flex"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex-1 bg-void border-r border-gold/20 flex items-center justify-end pr-8"
              initial={{ x: 0 }}
              animate={{ x: isOpen ? "-100%" : 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="text-right">
                <p className="chapter-label text-[10px] mb-2">SECURITY LEVEL</p>
                <div className="flex gap-1 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gold" />
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              className="flex-1 bg-void border-l border-gold/20 flex items-center pl-8"
              initial={{ x: 0 }}
              animate={{ x: isOpen ? "100%" : 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            >
              <div>
                <p className="chapter-label text-[10px] mb-2">CLEARANCE</p>
                <p className="font-bebas text-crimson text-sm tracking-widest">
                  RESTRICTED
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main vault content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 3D Viewer */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsViewerHovered(true)}
            onMouseLeave={() => setIsViewerHovered(false)}
          >
            {/* Viewer frame */}
            <div className="relative border border-gold/20 overflow-hidden">
              {/* Corner ornaments — brighten on hover */}
              <div
                className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 z-10 transition-colors duration-500"
                style={{ borderColor: isViewerHovered ? itemAmbients[activeIndex]?.glow ?? "rgba(212,175,55,1)" : "rgba(212,175,55,0.6)" }}
              />
              <div
                className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 z-10 transition-colors duration-500"
                style={{ borderColor: isViewerHovered ? itemAmbients[activeIndex]?.glow ?? "rgba(212,175,55,1)" : "rgba(212,175,55,0.6)" }}
              />
              <div
                className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 z-10 transition-colors duration-500"
                style={{ borderColor: isViewerHovered ? itemAmbients[activeIndex]?.glow ?? "rgba(212,175,55,1)" : "rgba(212,175,55,0.6)" }}
              />
              <div
                className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 z-10 transition-colors duration-500"
                style={{ borderColor: isViewerHovered ? itemAmbients[activeIndex]?.glow ?? "rgba(212,175,55,1)" : "rgba(212,175,55,0.6)" }}
              />

              {/* Ambient background — invisible until hover, themed per item */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`ambient-${activeIndex}`}
                  className="absolute inset-0 z-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isViewerHovered ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ background: itemAmbients[activeIndex]?.gradient }}
                />
              </AnimatePresence>

              {/* Subtle noise overlay — also only on hover */}
              <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                animate={{ opacity: isViewerHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px 200px",
                }}
              />

              {/* Foto del producto activo */}
              <div className="relative z-[1] h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    {activeItem.image ? (
                      <Image
                        src={activeItem.image}
                        alt={activeItem.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #1e1d1a, #141310)" }}
                      >
                        <p className="font-bebas text-silver/20 tracking-[0.3em] text-sm">
                          FOTO PRÓXIMAMENTE
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Overlay label */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
                <div>
                  <p className="chapter-label text-[10px]">PIEZA REAL</p>
                  <motion.p
                    className="font-inter text-xs mt-1 transition-colors duration-500"
                    animate={{ color: isViewerHovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}
                  >
                    Mafia Metal
                  </motion.p>
                </div>
                <div className="text-right">
                  <p className="chapter-label text-[10px]">MATERIAL</p>
                  <p className="font-bebas text-gold text-sm tracking-widest mt-1">
                    {activeItem.material}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Item selector */}
            <div className="flex gap-2 mb-10">
              {vaultItems.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(i)}
                  className={`flex-1 py-3 font-bebas text-xs tracking-[0.3em] border transition-all ${
                    activeIndex === i
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-white/10 text-silver/40 hover:border-gold/30 hover:text-silver/60"
                  }`}
                  data-cursor-hover
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>

            {/* Active item details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Name */}
                <h3 className="font-cinzel font-black text-3xl md:text-4xl text-gold-gradient mb-2">
                  {activeItem.name}
                </h3>
                <p className="font-bebas text-silver/50 tracking-[0.4em] text-sm mb-8">
                  {activeItem.tagline}
                </p>

                {/* Divider */}
                <div className="gold-divider mb-8" />

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {[
                    { label: "MATERIAL", value: activeItem.material },
                    { label: "WEIGHT", value: activeItem.weight },
                    { label: "PURITY", value: activeItem.purity },
                    { label: "EDITION", value: activeItem.edition },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="border border-white/5 p-4 bg-void/50"
                    >
                      <p className="chapter-label text-[10px] mb-2">{label}</p>
                      <p className="font-bebas text-silver text-sm tracking-widest">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Classified stamp */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="classified-stamp text-xs">VAULT PIECE</div>
                  <p className="font-inter text-silver/30 text-xs">
                    Available by private appointment only
                  </p>
                </div>

                {/* CTA */}
                <button
                  className="w-full py-4 font-bebas tracking-[0.4em] text-sm text-obsidian bg-gold hover:bg-gold-light transition-colors metal-shine"
                  data-cursor-hover
                >
                  REQUEST PRIVATE VIEWING
                </button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
