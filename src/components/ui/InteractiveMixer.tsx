"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * InteractiveMixer
 * ─────────────────
 * Overlay 100% INVISIBLE sobre la foto del Hero: no dibuja nada en
 * producción (ni círculos, ni líneas, ni anillos). Define zonas
 * interactivas invisibles sobre los knobs, el crossfader y el platter
 * reales de la foto. La señal de "esto se puede tocar" la da el cursor
 * personalizado que ya tenés (CustomCursor.tsx, vía [data-cursor-hover]).
 *
 * SONIDO LIGADO AL SCROLL:
 *  - visibilityFactor va de 1 (el DJ ocupa toda la pantalla) a 0 (el Hero
 *    ya se scrolleó completamente fuera de vista).
 *  - Todo el audio (loop de ambiente + sonidos de interacción) se
 *    multiplica por ese factor, así que se va apagando suavemente a
 *    medida que bajás, y vuelve a subir de volumen si volvés a subir.
 *  - Es continuo (no es "on/off" al cruzar un punto): se siente como un
 *    fade real de mezcladora, no como un mute abrupto.
 *
 * CÓMO CALIBRAR LAS POSICIONES DE LOS HOTSPOTS:
 *  1. Apretá "C" (con el mouse sobre la ventana) para ver la grilla de
 *     calibración con % y los hotspots resaltados en modo debug.
 *  2. Comparalo contra /images/hero-dj.jpg y ajustá xPct/yPct/sizePct de
 *     KNOBS / CROSSFADER / PLATTER más abajo.
 *  3. Apretá "C" de nuevo: en producción no se ve nada de esto.
 */

// ── Configuración de hotspots (AJUSTAR ESTOS VALORES) ───────────────────────

const KNOBS = [
  { id: "k1", xPct: 9, yPct: 55, sizePct: 3.2 },
  { id: "k2", xPct: 16, yPct: 55, sizePct: 3.2 },
  { id: "k3", xPct: 23, yPct: 55, sizePct: 3.2 },
  { id: "k4", xPct: 9, yPct: 63, sizePct: 3.6 },
  { id: "k5", xPct: 17, yPct: 63, sizePct: 3.6 },
  { id: "k6", xPct: 25, yPct: 63, sizePct: 3.6 },
  { id: "k7", xPct: 33, yPct: 63, sizePct: 3.6 },
];

const CROSSFADER = { xPct: 8, yPct: 74, widthPct: 30, heightPct: 3 };

const PLATTER = { xPct: 52, yPct: 88, sizePct: 34 };

const AMBIENT_BASE_VOLUME = 0.14;
const MIN_AUDIBLE_FACTOR = 0.05; // por debajo de esto, no se disparan sonidos de interacción

// ── Estado global de visibilidad (0 = DJ no visible, 1 = DJ a pantalla completa) ─

let visibilityFactor = 1;

// ── Audio: utilidades base (todo sintetizado, sin assets) ───────────────────

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

function getAudioCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function getNoiseBuffer(ctx: AudioContext) {
  if (!noiseBuffer) {
    const len = ctx.sampleRate * 2;
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

// Tick corto para los knobs (como un detente/click, casi imperceptible)
function playKnobTick(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 700 + Math.random() * 500;
  const peak = 0.045 * visibilityFactor;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

// Scratch continuo para el platter — se actualiza en cada frame de drag
function makeScratchVoice(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  filter.type = "lowpass";
  filter.Q.value = 6;
  gain.gain.value = 0;
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start();
  return { osc, filter, gain };
}

// Whoosh de ruido filtrado para el crossfader
function makeNoiseVoice(ctx: AudioContext) {
  const src = ctx.createBufferSource();
  src.buffer = getNoiseBuffer(ctx);
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start();
  return { src, filter, gain };
}

// ── Audio: loop de ambiente de club (música de fondo sintetizada) ──────────

let ambientTimer: ReturnType<typeof setInterval> | null = null;
let ambientMasterGain: GainNode | null = null;
let ambientStep = 0;
let ambientEnabled = false; // refleja el toggle de sonido del usuario

function scheduleKick(ctx: AudioContext, master: GainNode, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(140, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
  osc.connect(gain).connect(master);
  osc.start(time);
  osc.stop(time + 0.25);
}

function scheduleHat(ctx: AudioContext, master: GainNode, time: number) {
  const src = ctx.createBufferSource();
  src.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 7000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  src.connect(filter).connect(gain).connect(master);
  src.start(time);
  src.stop(time + 0.06);
}

function startAmbientLoop(ctx: AudioContext) {
  ambientEnabled = true;
  if (ambientTimer) return; // ya está sonando
  ambientMasterGain = ctx.createGain();
  ambientMasterGain.gain.value = 0;
  // Lowpass general para que suene "amortiguado", como música de fondo
  // detrás de una puerta, no como un efecto de UI.
  const masterFilter = ctx.createBiquadFilter();
  masterFilter.type = "lowpass";
  masterFilter.frequency.value = 900;
  ambientMasterGain.connect(masterFilter).connect(ctx.destination);

  ambientMasterGain.gain.setTargetAtTime(
    AMBIENT_BASE_VOLUME * visibilityFactor,
    ctx.currentTime,
    1.2
  );

  const stepDur = 0.25; // corchea a 120bpm
  ambientStep = 0;

  ambientTimer = setInterval(() => {
    // Si el DJ ya no se ve nada, no seguimos generando golpes (silencio real,
    // no solo ganancia en 0) — ahorra CPU cuando el usuario está lejos del Hero.
    if (visibilityFactor <= 0.001 || !ambientEnabled) return;
    const t = ctx.currentTime + 0.02;
    if (ambientStep % 4 === 0) scheduleKick(ctx, ambientMasterGain!, t);
    scheduleHat(ctx, ambientMasterGain!, t);
    ambientStep++;
  }, stepDur * 1000);
}

function stopAmbientLoop(ctx: AudioContext) {
  ambientEnabled = false;
  if (ambientMasterGain) {
    ambientMasterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
  }
  if (ambientTimer) {
    clearInterval(ambientTimer);
    ambientTimer = null;
  }
}

// Aplica el factor de visibilidad actual al volumen del loop de ambiente.
function applyVisibilityToAmbient(ctx: AudioContext) {
  if (ambientMasterGain && ambientEnabled) {
    ambientMasterGain.gain.setTargetAtTime(
      AMBIENT_BASE_VOLUME * visibilityFactor,
      ctx.currentTime,
      0.15
    );
  }
}

// ── Componente ───────────────────────────────────────────────────────────────

export default function InteractiveMixer() {
  const [soundOn, setSoundOn] = useState(false);
  const [calibrate, setCalibrate] = useState(false);
  const soundOnRef = useRef(soundOn);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    soundOnRef.current = soundOn;
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (soundOn) startAmbientLoop(ctx);
    else stopAmbientLoop(ctx);
  }, [soundOn]);

  // Fade continuo atado al scroll: 1 = DJ a pantalla completa, 0 = fuera de vista
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf: number;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // rect.top es 0 cuando el Hero está al tope de la pantalla, y se vuelve
      // negativo a medida que se scrollea hacia arriba y desaparece.
      const raw = 1 + Math.min(0, rect.top) / vh;
      visibilityFactor = Math.max(0, Math.min(1, raw));

      const ctx = audioCtx; // no crear el contexto solo por scrollear
      if (ctx) applyVisibilityToAmbient(ctx);

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c") setCalibrate((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-[15]"
      style={{ pointerEvents: "none" }}
    >
      {KNOBS.map((k) => (
        <Knob key={k.id} {...k} soundOnRef={soundOnRef} debug={calibrate} />
      ))}

      <Crossfader {...CROSSFADER} soundOnRef={soundOnRef} debug={calibrate} />

      <Platter {...PLATTER} soundOnRef={soundOnRef} debug={calibrate} />

      {/* Único elemento visible: el toggle de sonido */}
      <button
        onClick={() => setSoundOn((v) => !v)}
        className="absolute top-[70px] right-6 md:top-[76px] md:right-8 font-victor text-[10px] tracking-[0.3em] px-3 py-1.5 transition-colors"
        style={{
          pointerEvents: "auto",
          background: "rgba(10,9,8,0.55)",
          border: "1px solid rgba(212,175,55,0.3)",
          color: soundOn ? "#d4af37" : "rgba(176,170,152,0.4)",
        }}
        data-cursor-hover
        aria-label="Activar o silenciar sonido"
      >
        {soundOn ? "♪ SONIDO" : "✕ SILENCIO"}
      </button>

      {calibrate && <CalibrationGrid />}
    </div>
  );
}

// ── Knob individual — invisible, solo tacto + sonido ────────────────────────

function Knob({
  xPct,
  yPct,
  sizePct,
  soundOnRef,
  debug,
}: {
  xPct: number;
  yPct: number;
  sizePct: number;
  soundOnRef: React.RefObject<boolean>;
  debug: boolean;
}) {
  const angleRef = useRef(0);
  const lastTickAngle = useRef(0);
  const dragging = useRef(false);
  const lastY = useRef(0);

  const applyAngle = useCallback(
    (deg: number) => {
      const clamped = Math.max(-135, Math.min(135, deg));
      angleRef.current = clamped;
      if (
        Math.abs(clamped - lastTickAngle.current) > 12 &&
        soundOnRef.current &&
        visibilityFactor > MIN_AUDIBLE_FACTOR
      ) {
        const ctx = getAudioCtx();
        if (ctx) {
          startAmbientLoop(ctx); // por si el usuario interactúa antes de tocar el botón
          playKnobTick(ctx);
        }
        lastTickAngle.current = clamped;
      }
    },
    [soundOnRef]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    getAudioCtx();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dy = lastY.current - e.clientY;
    lastY.current = e.clientY;
    applyAngle(angleRef.current + dy * 1.4);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="absolute rounded-full cursor-grab active:cursor-grabbing"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: `${sizePct}%`,
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
        touchAction: "none",
        outline: debug ? "1px dashed rgba(0,255,150,0.6)" : "none",
        background: debug ? "rgba(0,255,150,0.08)" : "transparent",
      }}
      data-cursor-hover
    />
  );
}

// ── Crossfader — invisible ───────────────────────────────────────────────────

function Crossfader({
  xPct,
  yPct,
  widthPct,
  heightPct,
  soundOnRef,
  debug,
}: {
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  soundOnRef: React.RefObject<boolean>;
  debug: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0.5);
  const voiceRef = useRef<ReturnType<typeof makeNoiseVoice> | null>(null);
  const lastX = useRef(0);
  const dragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const ctx = getAudioCtx();
    if (ctx) {
      startAmbientLoop(ctx);
      if (soundOnRef.current) voiceRef.current = makeNoiseVoice(ctx);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    posRef.current = Math.max(0, Math.min(1, posRef.current + dx / rect.width));

    const speed = Math.min(1, Math.abs(dx) / 20);
    const v = voiceRef.current;
    if (v && soundOnRef.current && visibilityFactor > MIN_AUDIBLE_FACTOR) {
      const ctx = getAudioCtx();
      if (ctx) {
        v.gain.gain.setTargetAtTime(
          speed * 0.16 * visibilityFactor,
          ctx.currentTime,
          0.02
        );
        v.filter.frequency.setTargetAtTime(
          400 + posRef.current * 3000,
          ctx.currentTime,
          0.02
        );
      }
    }
  };

  const stopVoice = () => {
    dragging.current = false;
    const v = voiceRef.current;
    if (v) {
      const ctx = getAudioCtx();
      if (ctx) v.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      setTimeout(() => {
        try {
          v.src.stop();
        } catch {}
      }, 300);
      voiceRef.current = null;
    }
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopVoice}
      className="absolute"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: `${widthPct}%`,
        height: `${heightPct}%`,
        pointerEvents: "auto",
        touchAction: "none",
        cursor: "ew-resize",
        outline: debug ? "1px dashed rgba(0,255,150,0.6)" : "none",
        background: debug ? "rgba(0,255,150,0.08)" : "transparent",
      }}
      data-cursor-hover
    />
  );
}

// ── Platter — invisible, jog wheel real ─────────────────────────────────────

function Platter({
  xPct,
  yPct,
  sizePct,
  soundOnRef,
  debug,
}: {
  xPct: number;
  yPct: number;
  sizePct: number;
  soundOnRef: React.RefObject<boolean>;
  debug: boolean;
}) {
  const dragging = useRef(false);
  const lastAngle = useRef(0);
  const centerRef = useRef({ x: 0, y: 0 });
  const containerElRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<ReturnType<typeof makeScratchVoice> | null>(null);

  const angleFromEvent = (clientX: number, clientY: number) => {
    const { x, y } = centerRef.current;
    return (Math.atan2(clientY - y, clientX - x) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const rect = containerElRef.current!.getBoundingClientRect();
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    dragging.current = true;
    lastAngle.current = angleFromEvent(e.clientX, e.clientY);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const ctx = getAudioCtx();
    if (ctx) {
      startAmbientLoop(ctx);
      if (soundOnRef.current) voiceRef.current = makeScratchVoice(ctx);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const a = angleFromEvent(e.clientX, e.clientY);
    let delta = a - lastAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    lastAngle.current = a;

    const v = voiceRef.current;
    if (v && soundOnRef.current && visibilityFactor > MIN_AUDIBLE_FACTOR) {
      const ctx = getAudioCtx();
      if (ctx) {
        const speed = Math.min(1, Math.abs(delta) / 6);
        const dir = delta >= 0 ? 1 : -1;
        v.osc.frequency.setTargetAtTime(80 + speed * 260 * dir, ctx.currentTime, 0.01);
        v.filter.frequency.setTargetAtTime(300 + speed * 2200, ctx.currentTime, 0.01);
        v.gain.gain.setTargetAtTime(
          Math.min(0.12, speed * 0.16) * visibilityFactor,
          ctx.currentTime,
          0.01
        );
      }
    }
  };

  const onPointerUp = () => {
    dragging.current = false;
    const v = voiceRef.current;
    if (v) {
      const ctx = getAudioCtx();
      if (ctx) {
        v.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
        setTimeout(() => {
          try {
            v.osc.stop();
          } catch {}
        }, 300);
      }
      voiceRef.current = null;
    }
  };

  return (
    <div
      ref={containerElRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="absolute rounded-full"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: `${sizePct}%`,
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
        cursor: "grab",
        touchAction: "none",
        outline: debug ? "1px dashed rgba(0,255,150,0.6)" : "none",
        background: debug ? "rgba(0,255,150,0.06)" : "transparent",
      }}
      data-cursor-hover
    />
  );
}

// ── Grilla de calibración (solo con "C") ────────────────────────────────────

function CalibrationGrid() {
  const lines = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      {lines.map((p) => (
        <div key={`v-${p}`}>
          <div
            className="absolute top-0 bottom-0"
            style={{ left: `${p}%`, width: "1px", background: "rgba(255,0,150,0.25)" }}
          />
          <div
            className="absolute left-0 right-0"
            style={{ top: `${p}%`, height: "1px", background: "rgba(255,0,150,0.25)" }}
          />
          <span
            className="absolute font-victor text-[9px]"
            style={{ left: `${p}%`, top: 2, color: "rgba(255,0,150,0.7)" }}
          >
            {p}
          </span>
          <span
            className="absolute font-victor text-[9px]"
            style={{ top: `${p}%`, left: 2, color: "rgba(255,0,150,0.7)" }}
          >
            {p}
          </span>
        </div>
      ))}
      <div className="absolute top-2 right-2 font-victor text-[10px] tracking-[0.2em] text-crimson">
        MODO CALIBRACIÓN — presioná "C" para salir
      </div>
      <div className="absolute bottom-2 right-2 font-victor text-[10px] tracking-[0.2em] text-gold/70">
        visibilityFactor: {visibilityFactor.toFixed(2)}
      </div>
    </div>
  );
}