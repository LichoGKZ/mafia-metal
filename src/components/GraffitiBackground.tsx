import React, { memo, useMemo } from "react";

export interface BackgroundProps {
  opacity?: number;
  seed?: number;
  className?: string;
}

const VintagePaperBackground = memo<BackgroundProps>(
  ({ opacity = 1, seed, className }) => {
    const id = useMemo(
      () => `paper-${seed ?? Math.floor(Math.random() * 100000)}`,
      [seed]
    );

    return (
      <svg
        className={className}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1,
          opacity,
        }}
      >
        <defs>
          {/* Fine Grain */}
          <filter id={`${id}-grain`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.2"
              numOctaves="2"
              seed={seed ?? 3}
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              {/* Grano sutil pero visible sobre fondo oscuro */}
              <feFuncA type="table" tableValues="0 0.05" />
            </feComponentTransfer>
          </filter>

          {/* Fibers */}
          <filter id={`${id}-fibers`}>
            <feTurbulence
              type="turbulence"
              baseFrequency="0.015 0.35"
              numOctaves="2"
              seed={(seed ?? 3) + 10}
            />
            <feGaussianBlur stdDeviation="0.35" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.03" />
            </feComponentTransfer>
          </filter>

          {/* Stains / manchas de sombra, no de suciedad clara */}
          <filter id={`${id}-stains`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="4"
              seed={(seed ?? 3) + 20}
            />
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix
              type="matrix"
              values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 .25 0"
            />
          </filter>

          {/* Viñeta hacia negro en los bordes, no hacia blanco */}
          <radialGradient id={`${id}-vignette`}>
            <stop offset="55%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity=".35" />
          </radialGradient>

          {/* Leve resplandor dorado ambiental, muy sutil, centrado */}
          <radialGradient id={`${id}-goldglow`} cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity=".05" />
            <stop offset="60%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base: fondo oscuro (obsidian/paper), NO papel claro */}
        <rect width="100%" height="100%" fill="#0b0b0b" />
        <rect width="100%" height="100%" fill="#1a1916" opacity="0.9" />

        {/* Resplandor dorado ambiental */}
        <rect width="100%" height="100%" fill={`url(#${id}-goldglow)`} />

        {/* Variación tonal oscura */}
        <rect
          width="100%"
          height="100%"
          filter={`url(#${id}-stains)`}
          fill="#000"
          opacity=".25"
        />

        {/* Film Grain (grano claro sobre oscuro, sutil) */}
        <rect
          width="100%"
          height="100%"
          filter={`url(#${id}-grain)`}
          fill="#fff"
        />

        {/* Fibers */}
        <rect
          width="100%"
          height="100%"
          filter={`url(#${id}-fibers)`}
          fill="#fff"
        />

        {/* Viñeta hacia los bordes */}
        <rect width="100%" height="100%" fill={`url(#${id}-vignette)`} />

        {/* Polvo aleatorio, ahora claro (dorado tenue) sobre fondo oscuro */}
        {useMemo(() => {
          const dots = [];
          const rand = (n: number) =>
            Math.abs(Math.sin((seed ?? 5) * n * 12.9898)) % 1;

          for (let i = 0; i < 120; i++) {
            dots.push(
              <circle
                key={i}
                cx={rand(i + 1) * 100}
                cy={rand(i + 30) * 100}
                r={0.02 + rand(i + 60) * 0.12}
                fill="#d4af37"
                opacity={0.015 + rand(i + 90) * 0.05}
              />
            );
          }

          return dots;
        }, [seed])}

        {/* Marcas sutiles */}
        <g opacity=".04">
          <circle
            cx="72"
            cy="38"
            r="8"
            fill="none"
            stroke="#d4af37"
            strokeWidth=".3"
            strokeDasharray="1 2"
          />
          <circle
            cx="22"
            cy="73"
            r="10"
            fill="none"
            stroke="#d4af37"
            strokeWidth=".25"
            strokeDasharray=".8 2.2"
          />
        </g>

        {/* Rayones finos */}
        <g stroke="#d4af37" opacity=".05">
          <line x1="10" y1="18" x2="42" y2="15" strokeWidth=".08" />
          <line x1="63" y1="76" x2="95" y2="72" strokeWidth=".08" />
          <line x1="48" y1="8" x2="53" y2="32" strokeWidth=".05" />
        </g>
      </svg>
    );
  }
);

VintagePaperBackground.displayName = "VintagePaperBackground";

export default VintagePaperBackground;