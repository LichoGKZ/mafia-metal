"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {processPhotos } from "@/data/collection";
import AutoFilmstrip from "@/components/ui/AutoFilmstrip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function StepCard({
  title,
  body,
  index,
}: {
  title: string;
  body: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === el) t.kill();
      });
    };
  }, [index]);

  return (
    <div ref={cardRef} className="border border-ink/5 p-8 bg-void/30">
      <span className="chapter-label text-[10px] tracking-[0.4em] text-gold/50">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="font-victor font-bold text-xl md:text-2xl text-gold mt-3 mb-4">
        {title}
      </h3>
      <p className="font-victor text-silver/50 text-sm leading-relaxed">
        {body}
      </p>
    </div>
  );
}

function ProcessFilmstrip() {
  return (
    <div className="relative mb-24">
      <div className="text-center mb-8">
        <p className="chapter-label text-[10px] tracking-[0.5em] mb-3">
          DETRÁS DEL TALLER
        </p>
        <div className="gold-divider w-32 mx-auto" />
      </div>
      <AutoFilmstrip images={processPhotos} alt="Proceso de forja Mafia Metal" speed={60} />
    </div>
  );
}

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative street-tint py-24 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.02] noise-texture" />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gold/10" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gold/10" />

      <div className="max-w-5xl mx-auto px-6">
        <div ref={headingRef} className="text-center mb-24 opacity-0">
          <h2 className="font-victor font-black text-[clamp(2.5rem,7vw,5.5rem)] text-gold-gradient mt-4 leading-none">
            El taller
          </h2>
          <div className="gold-divider max-w-sm mx-auto mt-6" />
          <p className="font-victor text-silver/40 text-sm mt-6 tracking-wider max-w-lg mx-auto leading-relaxed">
            Cada pieza se diseña, se modela y se termina a mano.
          </p>
        </div>

        <ProcessFilmstrip />


        <motion.div
          className="mt-24 text-center border border-gold/10 p-12 relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold/40" />

          <blockquote className="font-victor text-xl md:text-2xl text-silver/70 leading-relaxed max-w-2xl mx-auto">
            Hecho a mano en Argentina.
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gold/30" />
            <span className="chapter-label text-[10px]">
              MAFIA METAL
            </span>
            <div className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}