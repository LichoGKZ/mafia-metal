"use client";

import Image from "next/image";

/**
 * Filmstrip horizontal de auto-scroll infinito (marquee) para mostrar
 * muchas fotos del mismo tema de forma cinematográfica (ej. "el proceso").
 */
export default function AutoFilmstrip({
  images,
  alt,
  reverse = false,
  speed = 55,
  grayscale = true,
}: {
  images: string[];
  alt: string;
  reverse?: boolean;
  speed?: number;
  grayscale?: boolean;
}) {
  const doubled = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-obsidian to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-obsidian to-transparent pointer-events-none" />

      <div
        className="flex gap-4 w-max"
        style={{
          animation: `mm-marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative flex-shrink-0 w-56 h-72 md:w-72 md:h-96 overflow-hidden"
            style={{ border: "1px solid rgba(212,175,55,0.1)" }}
          >
            <Image
              src={src}
              alt={`${alt} ${(i % images.length) + 1}`}
              fill
              className={`object-cover transition-all duration-700 ${
                grayscale ? "grayscale hover:grayscale-0" : ""
              }`}
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes mm-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
