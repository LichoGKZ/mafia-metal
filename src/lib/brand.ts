/**
 * ─────────────────────────────────────────────────────────────
 *  PALETA DE MARCA — ÚNICA FUENTE DE VERDAD DEL AMARILLO/DORADO
 * ─────────────────────────────────────────────────────────────
 *  Para cambiar el amarillo de todo el sitio, editá SOLO los tres
 *  valores RGB de acá abajo. Se propaga automáticamente a:
 *    · CSS      → variables --gold / --gold-light / --gold-dark (+ versiones -rgb)
 *    · Tailwind → bg-gold, text-gold, border-gold/20, etc.
 *    · Three.js → GOLD_HEX (escena 3D y viewer)
 *    · Manifest → theme_color de la PWA
 *
 *  Valores actuales = colores originales del sitio (sin cambios visuales).
 */
export type RGB = readonly [number, number, number];

export const GOLD_RGB: RGB = [212, 175, 55]; // #D4AF37
export const GOLD_LIGHT_RGB: RGB = [240, 208, 96]; // #F0D060
export const GOLD_DARK_RGB: RGB = [166, 124, 0]; // #A67C00

const toHex = ([r, g, b]: RGB) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

export const GOLD_HEX = toHex(GOLD_RGB);
export const GOLD_LIGHT_HEX = toHex(GOLD_LIGHT_RGB);
export const GOLD_DARK_HEX = toHex(GOLD_DARK_RGB);

/** Variables CSS que se inyectan en <html> desde app/layout.tsx. */
export const brandCssVars = {
  "--gold-rgb": GOLD_RGB.join(" "),
  "--gold-light-rgb": GOLD_LIGHT_RGB.join(" "),
  "--gold-dark-rgb": GOLD_DARK_RGB.join(" "),
} as Record<string, string>;
