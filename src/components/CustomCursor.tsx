"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("custom-cursor-active");

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      if (dot.style.opacity !== "1") {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        ringX = e.clientX;
        ringY = e.clientY;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      rafId = requestAnimationFrame(animateRing);
    };

    rafId = requestAnimationFrame(animateRing);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const addHover = () => {
      dot.classList.add("hovering");
      ring.classList.add("hovering");
    };

    const removeHover = () => {
      dot.classList.remove("hovering");
      ring.classList.remove("hovering");
    };

    const interactives = document.querySelectorAll(
      "a, button, [data-cursor-hover]"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    const observer = new MutationObserver(() => {
      const updated = document.querySelectorAll(
        "a, button, [data-cursor-hover]"
      );
      updated.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
