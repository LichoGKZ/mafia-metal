"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useCart } from "@/context/CartContext";

const navItems = [
  { number: "01", label: "HOME", href: "#home" },
  { number: "02", label: "THE VAULT", href: "#vault" },
  { number: "03", label: "THE FORGE", href: "#forge" },
  { number: "04", label: "COLLECTION", href: "#collection" },
  { number: "05", label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <>
      {/* Fixed navbar bar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[9000] flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-500 ${
          scrolled ? "glass-dark" : "bg-transparent"
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNavClick("#home")}
          className="font-cinzel font-black text-sm tracking-[0.35em] text-gold hover:text-gold-light transition-colors"
        >
          MAFIA<span className="text-silver mx-1">·</span>METAL
        </button>

        <div className="flex items-center gap-6">
          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 font-bebas text-sm tracking-[0.3em] text-silver hover:text-gold transition-colors group"
            aria-label="Open cart"
            data-cursor-hover
          >
            <span className="text-gold opacity-70 group-hover:opacity-100 transition-opacity">
              ◆
            </span>
            <span className="hidden sm:inline">DOSSIER</span>
            {itemCount > 0 && (
              <span
                className="flex items-center justify-center w-4 h-4 rounded-full font-victor text-[9px]"
                style={{ background: "#d4af37", color: "#0a0908" }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* CASE FILE button */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative flex items-center gap-3 font-bebas text-sm tracking-[0.3em] text-silver hover:text-gold transition-colors group"
            aria-label="Open navigation"
          >
            <span className="text-gold opacity-60 group-hover:opacity-100 transition-opacity">
              ▶
            </span>
            CASE FILE
            <div className="absolute -bottom-1 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </div>
      </motion.nav>

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-[9500] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background panels */}
            <motion.div
              className="absolute inset-0 bg-obsidian"
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="absolute inset-0 opacity-[0.03] noise-texture"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
            />

            {/* Gold top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gold-gradient" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gold-gradient" />

            {/* Close button */}
            <div className="relative z-10 flex justify-between items-center px-6 md:px-12 py-5">
              <span className="font-cinzel font-black text-sm tracking-[0.35em] text-gold">
                MAFIA<span className="text-silver mx-1">·</span>METAL
              </span>
              <button
                onClick={() => setOpen(false)}
                className="font-bebas text-sm tracking-[0.3em] text-silver hover:text-gold transition-colors flex items-center gap-3"
              >
                CLOSE
                <span className="text-crimson">✕</span>
              </button>
            </div>

            {/* Dossier content */}
            <div className="relative z-10 flex-1 flex flex-col md:flex-row">
              {/* Left: nav links */}
              <div className="flex-1 flex flex-col justify-center px-8 md:px-20 py-8 border-r border-white/5">
                {/* Classified header */}
                <div className="mb-10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-px flex-1 bg-gold/20" />
                    <span className="classified-stamp text-xs">CLASSIFIED</span>
                    <div className="h-px flex-1 bg-gold/20" />
                  </div>
                  <p className="font-bebas text-xs tracking-[0.4em] text-silver/40 mt-4">
                    MAFIA METAL INTERNAL DOSSIER — FILE NO. 001
                  </p>
                </div>

                {/* Nav items */}
                <nav className="space-y-2">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.number}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                    >
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className="group flex items-center gap-6 w-full py-4 border-b border-white/5 hover:border-gold/30 transition-colors"
                        data-cursor-hover
                      >
                        <span className="font-bebas text-sm text-gold/50 group-hover:text-gold transition-colors w-8">
                          {item.number}
                        </span>
                        <span className="font-cinzel text-3xl md:text-5xl font-bold text-silver/80 group-hover:text-gold transition-colors tracking-wider">
                          {item.label}
                        </span>
                        <span className="ml-auto text-gold/30 group-hover:text-gold transition-colors transform group-hover:translate-x-2 duration-300">
                          →
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Right: dossier details */}
              <motion.div
                className="w-full md:w-80 px-8 md:px-12 py-8 flex flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >


    
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
