"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollReveal<T extends HTMLElement>(
  options: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    trigger?: string;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    markers?: boolean;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const {
      from = { opacity: 0, y: 60 },
      to = { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      start = "top 85%",
      end = "bottom 20%",
      scrub = false,
      markers = false,
    } = options;

    const tween = gsap.fromTo(el, from, {
      ...to,
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
        markers,
        toggleActions: scrub ? undefined : "play none none reverse",
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}
