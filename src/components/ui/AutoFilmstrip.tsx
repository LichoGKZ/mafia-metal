"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** Tiempo (ms) sin interacción antes de que el auto-avance se reanude. */
const RESUME_DELAY = 1800;
/** Separación entre fotos en px (equivale a `gap-4`). */
const GAP = 16;

/**
 * Filmstrip horizontal infinito, con auto-avance Y control manual.
 *
 * Antes era un marquee de CSS (transform animado) que no respondía al
 * toque ni al mouse. Ahora es un contenedor con scroll horizontal NATIVO:
 *
 *  - Mobile: se desliza con el dedo con la inercia nativa del sistema
 *    (el scroll vertical de la página sigue funcionando normal).
 *  - Desktop: se arrastra con el mouse (con inercia), la rueda horizontal /
 *    trackpad funciona, y hay flechas ‹ ›. El auto-avance se pausa al pasar
 *    el mouse por encima.
 *  - El auto-avance se pausa mientras el usuario interactúa y vuelve solo
 *    tras RESUME_DELAY ms. Respeta `prefers-reduced-motion` y se detiene
 *    cuando el carrusel está fuera de pantalla.
 *  - Loop infinito: la lista se renderiza 3 veces y el scroll se "salta" un
 *    ciclo exacto cuando se acerca a un borde (visualmente imperceptible).
 *
 * `speed` = segundos que tarda en recorrer un ciclo completo (igual que antes).
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = [...images, ...images, ...images];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || images.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let loopW = 0; // ancho de UN ciclo de fotos
    let pos = 0; // posición "real" (float); scrollLeft puede redondearse
    let lastSet = 0; // último scrollLeft escrito por nosotros
    let inView = true;
    let hovering = false; // mouse encima
    let touching = false; // dedo apoyado
    let dragging = false; // arrastre con mouse
    let velocity = 0; // inercia del arrastre (px por frame @60fps)
    let touchedAt = 0;
    let lastMoveAt = 0;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let playing = false;
    let last = performance.now();
    let raf = 0;

    const measure = () => {
      const a = el.children[0] as HTMLElement | undefined;
      const b = el.children[images.length] as HTMLElement | undefined;
      if (!a || !b) return;
      const w = b.offsetLeft - a.offsetLeft;
      if (w <= 0) return;
      const first = loopW === 0;
      loopW = w;
      if (first) {
        // arrancamos en el ciclo del medio para poder ir hacia ambos lados
        el.scrollLeft = loopW;
        pos = lastSet = el.scrollLeft;
      }
    };

    /** Si nos acercamos a un borde, saltamos un ciclo exacto. Devuelve el salto. */
    const wrap = (): number => {
      if (!loopW) return 0;
      const x = el.scrollLeft;
      let shift = 0;
      if (x >= loopW * 2) shift = -loopW;
      else if (x < loopW * 0.5) shift = loopW;
      if (shift) {
        el.scrollLeft = x + shift;
        pos = lastSet = el.scrollLeft;
      }
      return shift;
    };

    const onScroll = () => {
      // Si el scroll no lo escribimos nosotros, lo movió el usuario
      // (dedo, rueda horizontal, flechas, teclado): pausamos el auto-avance.
      if (Math.abs(el.scrollLeft - lastSet) > 2) {
        touchedAt = performance.now();
        pos = el.scrollLeft;
      }
      const shift = wrap();
      if (shift && dragging) startScroll += shift; // mantiene coherente el arrastre
    };

    /* ── Mouse: arrastrar ── */
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      velocity = 0;
      startX = lastX = e.clientX;
      startScroll = el.scrollLeft;
      lastT = e.timeStamp;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
      const dtm = e.timeStamp - lastT;
      if (dtm > 0) {
        const inst = (-(e.clientX - lastX) / dtm) * 16.67;
        velocity = velocity * 0.6 + inst * 0.4;
      }
      lastX = e.clientX;
      lastT = e.timeStamp;
      lastMoveAt = performance.now();
      touchedAt = lastMoveAt;
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.cursor = "grab";
      pos = el.scrollLeft;
      if (performance.now() - lastMoveAt > 80) velocity = 0; // soltó quieto
      touchedAt = performance.now();
    };

    /* ── Hover del mouse (pausa) ── */
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        hovering = false;
        touchedAt = performance.now();
      }
    };

    /* ── Touch (pausa mientras el dedo está apoyado) ── */
    const onTouchStart = () => {
      touching = true;
      velocity = 0;
      touchedAt = performance.now();
    };
    const onTouchEnd = () => {
      touching = false;
      touchedAt = performance.now();
    };

    /* ── Loop de animación ── */
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;

      if (loopW && !dragging) {
        if (Math.abs(velocity) > 0.3) {
          // inercia tras soltar el mouse
          const f = dt * 60;
          pos += velocity * f;
          velocity *= Math.pow(0.94, f);
          if (pos >= loopW * 2) pos -= loopW;
          else if (pos < loopW * 0.5) pos += loopW;
          el.scrollLeft = pos;
          lastSet = pos;
          touchedAt = now;
          playing = false;
        } else {
          velocity = 0;
          const shouldPlay =
            !reduceMotion &&
            inView &&
            !hovering &&
            !touching &&
            !document.hidden &&
            now - touchedAt > RESUME_DELAY;
          if (shouldPlay) {
            if (!playing) pos = el.scrollLeft; // reanuda desde donde quedó
            playing = true;
            pos += (reverse ? -1 : 1) * (loopW / speed) * dt;
            if (pos >= loopW * 2) pos -= loopW;
            else if (pos < loopW * 0.5) pos += loopW;
            el.scrollLeft = pos;
            lastSet = pos;
          } else {
            playing = false;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [images.length, reverse, speed]);

  const nudge = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const step = (card?.offsetWidth ?? 280) + GAP;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  const arrow =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center text-xl text-white bg-black/70 border border-white/25 hover:bg-gold hover:text-black transition-colors";

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-obsidian to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-obsidian to-transparent pointer-events-none" />

      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Fotos anteriores"
        className={`${arrow} left-3`}
        data-cursor-hover
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Fotos siguientes"
        className={`${arrow} right-3`}
        data-cursor-hover
      >
        ›
      </button>

      <div
        ref={scrollerRef}
        role="region"
        aria-label={alt}
        tabIndex={0}
        className="mm-strip flex w-full overflow-x-auto overscroll-x-contain select-none cursor-grab"
        style={{ gap: GAP }}
      >
        {items.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative flex-shrink-0 w-56 h-72 md:w-72 md:h-96 overflow-hidden"
            style={{ border: "1px solid rgb(var(--gold-rgb) / 0.1)" }}
          >
            <Image
              src={src}
              alt={`${alt} ${(i % images.length) + 1}`}
              fill
              draggable={false}
              className={`object-cover transition-all duration-700 pointer-events-none ${
                grayscale ? "grayscale" : ""
              }`}
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      <style jsx>{`
        .mm-strip {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .mm-strip::-webkit-scrollbar {
          display: none;
        }
        /* El color vuelve al pasar el mouse por la foto (desktop) */
        .mm-strip > div:hover :global(img) {
          filter: grayscale(0);
        }
      `}</style>
    </div>
  );
}
