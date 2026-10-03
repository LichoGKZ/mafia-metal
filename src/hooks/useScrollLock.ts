"use client";

import { useEffect } from "react";
import { getLenis } from "@/hooks/useLenis";

// Contador compartido: si hay 2 modales abiertos (ficha + guía de talles)
// el scroll de la página solo se libera cuando se cierra el último.
let locks = 0;

/** Bloquea el scroll de la página (body + Lenis) mientras `active` sea true. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    return () => {
      locks -= 1;
      if (locks <= 0) {
        locks = 0;
        document.body.style.overflow = "";
        getLenis()?.start();
      }
    };
  }, [active]);
}
