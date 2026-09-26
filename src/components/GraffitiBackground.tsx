import React, { memo } from "react";

export interface BackgroundProps {
  opacity?: number;
  className?: string;
}

/**
 * Fondo de "mural gigante" — la textura real de papel envejecido
 * (paper-grunge-tile.webp) más varias manchas de color grandes,
 * ancladas a distintas alturas de TODA la página (no del viewport),
 * para que a medida que bajás el scroll el fondo vaya cambiando de
 * tono como si fueran distintas paredes de un mismo mural — en vez
 * de un tile que se repite siempre igual.
 *
 * Importante: este layer va en flujo normal (position: absolute
 * dentro de .page-bg-wrap, que mide lo mismo que <main>), NO fixed.
 * Así se desplaza junto con el contenido y cada mancha queda
 * "pegada" a la sección de la página que le corresponde, siempre en
 * el mismo lugar aunque el usuario suba y baje.
 */
const VintagePaperBackground = memo<BackgroundProps>(
  ({ opacity = 1, className }) => {
    return (
      <div
        className={className}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          opacity,
          pointerEvents: "none",
          backgroundColor: "#f3f0e7",
          backgroundImage: [
            // Manchas grandes tipo mural, cada una anclada a una altura
            // distinta de la página completa (no del viewport)
            "radial-gradient(ellipse 70% 40% at 20% 6%,  rgba(212,175,55,0.10) 0%, transparent 65%)", // dorado arriba
            "radial-gradient(ellipse 80% 45% at 80% 22%, rgba(140,90,40,0.08)  0%, transparent 65%)", // óxido
            "radial-gradient(ellipse 75% 40% at 15% 42%, rgba(90,110,90,0.07)  0%, transparent 65%)", // verdoso
            "radial-gradient(ellipse 85% 45% at 75% 58%, rgba(120,110,90,0.08) 0%, transparent 65%)", // gris piedra
            "radial-gradient(ellipse 75% 40% at 25% 76%, rgba(212,175,55,0.09) 0%, transparent 65%)", // dorado
            "radial-gradient(ellipse 90% 45% at 70% 94%, rgba(100,80,60,0.09)  0%, transparent 65%)", // sepia abajo
            // .webp: ~4KB, textura real del diseño aprobado
            "url('/images/texture/paper-grunge-tile.webp')",
          ].join(", "),
          backgroundRepeat:
            "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, repeat",
          backgroundSize:
            "100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 340px 265px",
        }}
      />
    );
  }
);

VintagePaperBackground.displayName = "VintagePaperBackground";

export default VintagePaperBackground;
