"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useCart } from "@/context/CartContext";

// Debe coincidir con la clave usada en Loader.tsx / Hero.tsx.
const SESSION_KEY = "mm_loader_seen";
const FIRST_VISIT_DELAY = 1.9;
const RETURN_VISIT_DELAY = 0.1;

const navItems = [
  { number: "01", label: "INICIO", href: "#home" },
  { number: "02", label: "PRODUCTOS", href: "#collection" },
  { number: "03", label: "PIEZA PERSONALIZADA", href: "#customs" },
  { number: "04", label: "EL TALLER", href: "#forge" },
  { number: "05", label: "GALERÍA", href: "#gallery" },
  { number: "06", label: "CONTACTO", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { itemCount, openCart } = useCart();
  const [navDelay, setNavDelay] = useState(FIRST_VISIT_DELAY);

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setNavDelay(RETURN_VISIT_DELAY);
      }
    } catch {
      /* no-op */
    }
  }, []);

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
      {/* Fixed navbar bar — barra negra sólida, como la referencia que mandó
          la clienta: links directos a la izquierda, logo arriba a la
          derecha, hover pasa a gris (no dorado). */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[9000] flex items-center justify-between px-6 md:px-12 py-5 transition-colors duration-500"
        style={{
          background: scrolled ? "rgba(11,11,11,0.92)" : "rgba(11,11,11,0.75)",
          backdropFilter: "blur(6px)",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: navDelay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Links — traducidos al español para mantener consistencia con
            el resto del copy del sitio (antes decían Products/Pictures/About). */}
        <div className="flex items-center gap-6 md:gap-10">
          <button
            onClick={() => handleNavClick("#collection")}
            className="font-victor text-xs md:text-sm tracking-[0.15em] uppercase text-[#e8e6e0] hover:text-[#8a8a85] transition-colors"
            data-cursor-hover
          >
            Products
          </button>
          <button
            onClick={() => handleNavClick("#gallery")}
            className="font-victor text-xs md:text-sm tracking-[0.15em] uppercase text-[#e8e6e0] hover:text-[#8a8a85] transition-colors"
            data-cursor-hover
          >
            Pictures
          </button>
          <button
            onClick={() => handleNavClick("#contact")}
            className="font-victor text-xs md:text-sm tracking-[0.15em] uppercase text-[#e8e6e0] hover:text-[#8a8a85] transition-colors"
            data-cursor-hover
          >
            About
          </button>
        </div>

        <div className="flex items-center gap-5">
          {/* Cart button — no está en la referencia, se mantiene chico para no perder la función */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 font-victor text-[11px] tracking-[0.2em] text-[#e8e6e0] hover:text-[#8a8a85] transition-colors"
            aria-label="Abrir carrito"
            data-cursor-hover
          >
            ◆
            {itemCount > 0 && (
              <span
                className="flex items-center justify-center w-4 h-4 rounded-full font-victor text-[9px]"
                style={{ background: "var(--gold)", color: "#0a0908" }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* Logo — arriba a la derecha, como en la captura */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label="Abrir menú de navegación"
          >
            <Image
              src="/images/brand/logo-mafia-gold.svg"
              alt="Mafia Metal"
              width={26}
              height={26}
              className="opacity-90 w-[26px] h-[26px]"
            />
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
              <span className="flex items-center gap-2.5 font-victor font-black text-sm tracking-[0.35em] text-gold">
                <Image
                  src="/images/brand/logo-mafia-gold.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="opacity-90 w-[20px] h-[20px]"
                />
                MAFIA<span className="text-silver mx-1">·</span>METAL
              </span>
              <button
                onClick={() => setOpen(false)}
                className="font-victor text-sm tracking-[0.3em] text-silver hover:text-gold transition-colors flex items-center gap-3"
              >
                CERRAR
                <span className="text-crimson">✕</span>
              </button>
            </div>

            {/* Dossier content */}
            <div className="relative z-10 flex-1 flex flex-col md:flex-row">
              {/* Left: nav links */}
              <div className="flex-1 flex flex-col justify-center px-8 md:px-20 py-8 border-r border-white/5">
                {/* Encabezado */}
                <div className="mb-10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-px flex-1 bg-gold/20" />
                    <span className="classified-stamp text-xs">MAFIA METAL</span>
                    <div className="h-px flex-1 bg-gold/20" />
                  </div>
                  <p className="font-victor text-xs tracking-[0.4em] text-silver/40 mt-4">
                    JOYERÍA HECHA A MANO — MAR DEL PLATA
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
                        <span className="font-victor text-sm text-gold/50 group-hover:text-gold transition-colors w-8">
                          {item.number}
                        </span>
                        <span className="font-victor text-3xl md:text-5xl font-bold text-silver/80 group-hover:text-gold transition-colors tracking-wider">
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