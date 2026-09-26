"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { galleryPhotos } from "@/data/collection";
import FramedGallery from "@/components/ui/FramedGallery";
import PhotoTeaser from "@/components/ui/PhotoTeaser";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Gallery() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section
      id="gallery"
      className="relative street-tint py-24 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.02] noise-texture" />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gold/10" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gold/10" />

      <div className="max-w-6xl mx-auto px-6">
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          <h2 className="font-victor font-black text-[clamp(2.5rem,7vw,5.5rem)] text-gold-gradient mt-4 leading-none">
            GALERÍA
          </h2>
          <div className="gold-divider max-w-sm mx-auto mt-6" />
        </div>

        <PhotoTeaser image={galleryPhotos[0]} targetId="gallery-wall" />

        <div id="gallery-wall">
          <FramedGallery images={galleryPhotos} alt="Mafia Metal en la calle" />
        </div>
      </div>
    </section>
  );
}