import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  gsap.defaults({
    ease: "power3.out",
    duration: 0.8,
  });

  ScrollTrigger.defaults({
    markers: false,
  });
}

export { gsap, ScrollTrigger };

export function createParallax(
  element: HTMLElement,
  speed: number = 0.5
): gsap.core.Tween {
  return gsap.to(element, {
    yPercent: -100 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

export function revealText(
  element: HTMLElement | null,
  delay: number = 0
): gsap.core.Timeline {
  const tl = gsap.timeline({ delay });

  if (!element) return tl;

  tl.fromTo(
    element,
    { opacity: 0, y: 40, skewY: 2 },
    { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: "power4.out" }
  );

  return tl;
}

export function staggerReveal(
  elements: NodeListOf<Element> | HTMLElement[],
  options: { delay?: number; stagger?: number; from?: gsap.TweenVars } = {}
): gsap.core.Timeline {
  const { delay = 0, stagger = 0.1, from = { opacity: 0, y: 30 } } = options;

  const tl = gsap.timeline({ delay });
  tl.fromTo(elements, from, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger,
    ease: "power3.out",
  });

  return tl;
}
