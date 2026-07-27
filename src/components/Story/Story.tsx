"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { storyMilestones } from "@/data/collection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function MilestoneCard({
  year,
  title,
  body,
  index,
}: {
  year: string;
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
      {
        opacity: 0,
        x: index % 2 === 0 ? -60 : 60,
        y: 20,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
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
    <div
      ref={cardRef}
      className={`flex gap-6 md:gap-12 items-start ${
        index % 2 === 0 ? "flex-row" : "flex-row-reverse text-right"
      }`}
    >
      {/* Year column */}
      <div className="flex-shrink-0 w-20 md:w-32">
        <span className="font-bebas text-4xl md:text-6xl text-gold/20 leading-none">
          {year}
        </span>
      </div>

      {/* Timeline dot */}
      <div className="relative flex-shrink-0 mt-3">
        <div className="w-3 h-3 rounded-full bg-gold shadow-gold" />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-full bg-gold/20" />
      </div>

      {/* Content */}
      <div className={`flex-1 pb-16 ${index % 2 === 0 ? "" : "text-right"}`}>
        <span className="chapter-label text-[10px] tracking-[0.5em]">
          {year}
        </span>
        <h3 className="font-cinzel font-bold text-xl md:text-2xl text-gold mt-2 mb-4">
          {title}
        </h3>
        <p className="font-inter text-silver/50 text-sm leading-relaxed max-w-md">
          {body}
        </p>
      </div>
    </div>
  );
}

function ParallaxImage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !imgRef.current) return;

    gsap.to(imgRef.current, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative overflow-hidden h-64 md:h-96 mb-24">
      <div
        ref={imgRef}
        className="absolute inset-0 scale-110 bg-gradient-to-br from-void via-obsidian to-void flex items-center justify-center"
      >
        {/* Decorative forge visualization */}
        <div className="text-center">
          <div className="font-bebas text-[8rem] md:text-[14rem] text-gold/[0.04] leading-none select-none">
            1923
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="gold-divider w-32 mb-4" />
              <p className="font-cinzel text-gold/60 text-sm tracking-[0.4em]">
                THE FORGE OF LEGENDS
              </p>
              <div className="gold-divider w-32 mt-4" />
            </div>
          </div>
        </div>
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
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
      className="relative bg-obsidian py-24 md:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.02] noise-texture" />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gold/10" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gold/10" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Chapter header */}
        <div ref={headingRef} className="text-center mb-24 opacity-0">
          <span className="chapter-label tracking-[0.6em]">
            CHAPTER III — THE FORGE
          </span>
          <h2 className="font-cinzel font-black text-[clamp(2.5rem,7vw,5.5rem)] text-gold-gradient mt-4 leading-none">
            THE FORGE
          </h2>
          <div className="gold-divider max-w-sm mx-auto mt-6" />
          <p className="font-inter text-silver/40 text-sm mt-6 tracking-wider max-w-lg mx-auto leading-relaxed">
            Every dynasty has an origin. Every empire, a first fire.
            This is ours.
          </p>
        </div>

        {/* Parallax image */}
        <ParallaxImage />

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-[5.5rem] md:left-[9.5rem] top-0 bottom-0 w-px bg-gold/10" />

          {storyMilestones.map((milestone, i) => (
            <MilestoneCard key={milestone.year} {...milestone} index={i} />
          ))}
        </div>

        {/* Bottom quote */}
        <motion.div
          className="mt-24 text-center border border-gold/10 p-12 relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Corner ornaments */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold/40" />

          <div className="text-gold/30 text-4xl mb-4 font-cinzel">"</div>
          <blockquote className="font-cinzel text-xl md:text-2xl text-silver/70 leading-relaxed max-w-2xl mx-auto">
            We do not make jewelry. We make statements.
            And statements, in our world, are permanent.
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gold/30" />
            <span className="chapter-label text-[10px]">
              FOUNDER, MAFIA METAL
            </span>
            <div className="h-px w-12 bg-gold/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
