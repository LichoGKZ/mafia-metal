"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/** PRNG determinístico (mulberry32) — mismo resultado siempre, sin parpadeo entre renders */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GOLD = "#D4AF37";
const SILVER = "#C0C0C0";
const CRIMSON = "#8B0000";
const RUST = "#6b3a1f";

/** Trazo de tag agresivo: firma rápida con quiebres bruscos, no una curva prolija */
function tagScribble(rand: () => number, x: number, y: number, w: number, color: string) {
  const h = w * (0.35 + rand() * 0.25);
  const jag = () => (rand() - 0.5) * h * 0.9;
  const d = `M${x} ${y + jag()}
    L${x + w * 0.18} ${y - h * 0.4 + jag()}
    L${x + w * 0.32} ${y + h * 0.3 + jag()}
    L${x + w * 0.5} ${y - h * 0.5 + jag()}
    L${x + w * 0.68} ${y + h * 0.15 + jag()}
    L${x + w * 0.84} ${y - h * 0.35 + jag()}
    L${x + w} ${y + jag()}`;
  const strokeW = 7 + rand() * 6;
  return (
    <path
      d={d}
      stroke={color}
      strokeWidth={strokeW}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Splatter de spray: núcleo irregular + gotas dispersas, sin la simetría "sticker" de un círculo perfecto */
function spraySplatter(rand: () => number, cx: number, cy: number, r: number, color: string) {
  const blobs = [];
  const points = 9 + Math.floor(rand() * 4);
  let d = "";
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const rr = r * (0.6 + rand() * 0.55);
    const px = cx + Math.cos(a) * rr;
    const py = cy + Math.sin(a) * rr * 0.85;
    d += i === 0 ? `M${px} ${py}` : `L${px} ${py}`;
  }
  d += "Z";
  blobs.push(<path key="core" d={d} fill={color} />);
  const dots = 4 + Math.floor(rand() * 6);
  for (let i = 0; i < dots; i++) {
    const a = rand() * Math.PI * 2;
    const dist = r * (1.1 + rand() * 1.4);
    blobs.push(
      <circle
        key={i}
        cx={cx + Math.cos(a) * dist}
        cy={cy + Math.sin(a) * dist * 0.8}
        r={1.5 + rand() * 5}
        fill={color}
      />
    );
  }
  return blobs;
}

/** Chorreado bajo un tag/splatter — más irregular que una gota de manual de diseño */
function drip(rand: () => number, x: number, y: number, color: string) {
  const len = 30 + rand() * 90;
  const w = 3 + rand() * 5;
  return (
    <path
      d={`M${x} ${y} q${w} ${len * 0.5} 0 ${len} q-${w * 0.8} ${len * 0.15} -${w * 1.6} 0 q-${w} -${len * 0.6} ${w * 1.6} -${len}`}
      fill={color}
      opacity={0.5 + rand() * 0.3}
    />
  );
}

/** Fragmento de cadena — nod directo al producto (cadenas/colgantes de metal) */
function chainFragment(rand: () => number, x: number, y: number, links: number, color: string) {
  const els = [];
  const linkH = 16;
  for (let i = 0; i < links; i++) {
    const ly = y + i * linkH * 0.72;
    const rot = i % 2 === 0 ? 0 : 90;
    els.push(
      <ellipse
        key={i}
        cx={x}
        cy={ly}
        rx={9}
        ry={13}
        fill="none"
        stroke={color}
        strokeWidth={3.4}
        transform={`rotate(${rot} ${x} ${ly})`}
      />
    );
  }
  return <g opacity={0.4 + rand() * 0.15}>{els}</g>;
}

/** Grieta de pared / hormigón */
function crack(rand: () => number, x: number, y: number, len: number) {
  let d = `M${x} ${y}`;
  let cx = x;
  let cy = y;
  const segs = 5 + Math.floor(rand() * 4);
  for (let i = 0; i < segs; i++) {
    cx += (rand() - 0.3) * (len / segs);
    cy += (len / segs) * (0.6 + rand() * 0.8);
    d += ` L${cx} ${cy}`;
  }
  return <path d={d} stroke="#000" strokeWidth={1.6} fill="none" opacity={0.5} />;
}

/** Remache / bulón sobre chapa */
function bolt(rand: () => number, x: number, y: number) {
  return (
    <g opacity={0.3 + rand() * 0.2}>
      <circle cx={x} cy={y} r={6} fill="none" stroke={SILVER} strokeWidth={1.4} />
      <line x1={x - 3} y1={y} x2={x + 3} y2={y} stroke={SILVER} strokeWidth={1.2} />
      <line x1={x} y1={y - 3} x2={x} y2={y + 3} stroke={SILVER} strokeWidth={1.2} />
    </g>
  );
}

/** Tachado tipo cross-out de graffiti, más grande e imperfecto que una X prolija */
function crossOut(rand: () => number, x: number, y: number, s: number) {
  return (
    <g opacity={0.35 + rand() * 0.15} stroke={CRIMSON} strokeWidth={5 + rand() * 3} strokeLinecap="round">
      <line x1={x} y1={y} x2={x + s} y2={y + s * (0.7 + rand() * 0.3)} />
      <line x1={x + s} y1={y - s * 0.1} x2={x} y2={y + s * (0.8 + rand() * 0.3)} />
    </g>
  );
}

/** Rótulo stencil apenas visible — como pintado con plantilla en un muro */
function stencilWord(rand: () => number, x: number, y: number, word: string, size: number, color: string) {
  const rot = (rand() - 0.5) * 6;
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontFamily="var(--font-victor-mono), monospace"
      fontWeight={700}
      letterSpacing={size * 0.15}
      fill="none"
      stroke={color}
      strokeWidth={1.1}
      opacity={0.14 + rand() * 0.08}
      transform={`rotate(${rot} ${x} ${y})`}
    >
      {word}
    </text>
  );
}

function buildScene(height: number, width: number) {
  const rand = mulberry32(1337);
  const els: ReactNode[] = [];
  // densidad proporcional al alto real de la página: nunca se corta, nunca se repite
  const bandH = 480;
  const bands = Math.max(6, Math.ceil(height / bandH));
  const words = ["MAFIA", "METAL", "EN LA CALLE", "HECHO A MANO", "PLATA 950"];

  for (let b = 0; b < bands; b++) {
    const y0 = b * bandH;
    const seedX = () => 40 + rand() * (width - 80);

    // splatter grande de fondo (alterna dorado / plata / óxido)
    const baseColor = [GOLD, SILVER, RUST][b % 3];
    const sx = seedX();
    const sy = y0 + 60 + rand() * (bandH - 120);
    els.push(
      <g key={`splat-${b}`} opacity={0.22 + rand() * 0.1} filter="url(#rough)">
        {spraySplatter(rand, sx, sy, 70 + rand() * 55, baseColor)}
      </g>
    );
    if (rand() > 0.4) els.push(<g key={`drip-${b}`}>{drip(rand, sx - 10, sy + 40, baseColor)}</g>);

    // tag / firma
    els.push(
      <g key={`tag-${b}`} opacity={0.32 + rand() * 0.12} filter="url(#rough)">
        {tagScribble(rand, seedX() - 90, y0 + 120 + rand() * (bandH - 200), 190 + rand() * 90, b % 2 === 0 ? SILVER : GOLD)}
      </g>
    );

    // cadena cada 2 bandas
    if (b % 2 === 0) {
      els.push(
        <g key={`chain-${b}`}>{chainFragment(rand, seedX(), y0 + 40, 4 + Math.floor(rand() * 3), SILVER)}</g>
      );
    }

    // grieta
    els.push(<g key={`crack-${b}`}>{crack(rand, seedX(), y0 + 10, bandH * 0.5)}</g>);

    // remaches sueltos
    for (let i = 0; i < 2; i++) {
      els.push(<g key={`bolt-${b}-${i}`}>{bolt(rand, seedX(), y0 + rand() * bandH)}</g>);
    }

    // cross-out ocasional
    if (rand() > 0.6) {
      els.push(<g key={`cross-${b}`}>{crossOut(rand, seedX(), y0 + rand() * bandH, 50 + rand() * 40)}</g>);
    }

    // stencil de palabra cada 3 bandas
    if (b % 3 === 1) {
      els.push(
        <g key={`word-${b}`}>
          {stencilWord(
            rand,
            width * 0.5,
            y0 + bandH * 0.5,
            words[Math.floor(rand() * words.length)],
            54 + rand() * 40,
            rand() > 0.5 ? GOLD : SILVER
          )}
        </g>
      );
    }

    // niebla de spray (mist)
    const mist = [];
    const mistCx = seedX();
    const mistCy = y0 + rand() * bandH;
    for (let i = 0; i < 8; i++) {
      mist.push(
        <circle
          key={i}
          cx={mistCx + (rand() - 0.5) * 60}
          cy={mistCy + (rand() - 0.5) * 60}
          r={1.2 + rand() * 2.6}
          fill={b % 2 === 0 ? GOLD : SILVER}
        />
      );
    }
    els.push(
      <g key={`mist-${b}`} opacity={0.28}>
        {mist}
      </g>
    );
  }

  return els;
}

export function GraffitiBackground() {
  const [dims, setDims] = useState<{ h: number; w: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const h = document.documentElement.scrollHeight;
      const w = Math.max(window.innerWidth, 1);
      setDims((prev) =>
        prev && Math.abs(prev.h - h) < 40 && prev.w === w ? prev : { h, w }
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 800); // tras animaciones/carga de imágenes
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  if (!dims) return <div className="graffiti-layer" aria-hidden="true" />;

  const VW = 1200;
  const scale = VW / dims.w;
  const vh = dims.h * scale;

  return (
    <svg
      className="graffiti-layer"
      aria-hidden="true"
      width="100%"
      height={dims.h}
      viewBox={`0 0 ${VW} ${vh}`}
      preserveAspectRatio="none"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        <filter id="rough" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" />
        </filter>
      </defs>
      {buildScene(vh, VW)}
    </svg>
  );
}
