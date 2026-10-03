"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Marco rectangular (horizontal) con "photo" a la izquierda, "galery" a la derecha y
 * "( click )" debajo — tal cual el mockup que mandó la clienta (imagen +
 * video de Illustrator). Al hacer click baja hasta la sección #gallery.
 *
 * Reusa el mismo grabado ornamentado (marco-ornamentado.png) que ya usa
 * FramedGallery, con la foto adentro, sin recorte circular ni proporción cuadrada.
 */
export default function PhotoTeaser({
  image,
  targetId = "gallery",
}: {
  image: string;
  targetId?: string;
}) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center justify-center gap-6 md:gap-16 py-10">
      <span
        className="font-victor text-xs md:text-sm tracking-[0.2em] hidden sm:block"
        style={{ color: "rgba(23,21,15,0.55)" }}
      >
        photo
      </span>

      <motion.button
        type="button"
        onClick={handleClick}
        data-cursor-hover
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-4 group"
        aria-label="Ver galería"
      >
        {/* Marco rectangular horizontal: respeta la proporción real del
            grabado (605×386) y de la foto, sin forzar un cuadrado. */}
        <div className="relative w-[min(86vw,560px)] aspect-[605/386]">
          {/* foto dentro de la ventana del marco (queda por debajo del grabado) */}
          <div className="absolute inset-x-[7.5%] inset-y-[8.5%] overflow-hidden rounded-[3%/5%]">
            <Image
              src={image}
              alt="Mafia Metal"
              fill
              className="object-cover grayscale-[0.1] transition-all duration-500 group-hover:grayscale-0"
              sizes="(max-width: 640px) 86vw, 560px"
            />
          </div>
          {/* grabado ornamentado por encima, mismo asset que el resto del sitio */}
          <Image
            src="/images/brand/marco-ornamentado.png"
            alt=""
            fill
            aria-hidden
            className="pointer-events-none select-none object-fill opacity-90"
            sizes="(max-width: 640px) 86vw, 560px"
          />
        </div>

        <span
          className="font-victor text-[11px] tracking-[0.3em] group-hover:text-gold transition-colors"
          style={{ color: "rgba(23,21,15,0.4)" }}
        >
          ( click )
        </span>
      </motion.button>

      <span
        className="font-victor text-xs md:text-sm tracking-[0.2em] hidden sm:block"
        style={{ color: "rgba(23,21,15,0.55)" }}
      >
        galery
      </span>
    </div>
  );
}
