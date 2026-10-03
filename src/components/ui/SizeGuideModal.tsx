"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";

const ROWS = [
  ["13", "16,8", "53"], ["14", "17,2", "54"], ["15", "17,5", "55"],
  ["16", "17,8", "56"], ["17", "18,1", "57"], ["18", "18,4", "58"],
  ["19", "18,8", "59"], ["20", "19,1", "60"], ["21", "19,4", "61"],
  ["22", "19,7", "62"], ["23", "20,0", "63"], ["24", "20,3", "64"],
  ["25", "20,6", "65"], ["26", "21,0", "66"], ["27", "21,3", "67"],
  ["28", "21,6", "68"], ["29", "22,0", "69"], ["30", "22,3", "70"],
  ["31", "22,6", "71"], ["32", "22,9", "72"], ["33", "23,2", "73"],
  ["34", "23,5", "74"], ["35", "23,9", "75"],
];

/**
 * Guía de talles: modal centrado, fondo oscurecido + blur, scroll propio.
 * Se monta en un portal sobre <body> para no heredar transforms de la ficha.
 */
export default function SizeGuideModal({
  onClose,
  selected,
  onPick,
}: {
  onClose: () => void;
  selected?: string;
  onPick?: (size: string) => void;
}) {
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9600] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Guía de talles"
    >
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(10,9,8,0.7)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
        onClick={onClose}
      />

      {/* data-lenis-prevent: Lenis no captura la rueda → scroll propio */}
      <motion.div
        data-lenis-prevent
        className="relative w-full max-w-xl bg-white text-[#0b0b0b] overflow-y-auto overscroll-contain"
        style={{ maxHeight: "90vh", border: "2px solid #0b0b0b" }}
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar guía de talles"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-sm border border-black hover:bg-black hover:text-white transition-colors"
          data-cursor-hover
        >
          ✕
        </button>

        <h2 className="px-6 pt-6 pb-4 text-2xl border-b-2 border-black">
          Talle de anillo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 border-b-2 border-black text-[12px] leading-relaxed">
          <div className="p-5 sm:border-r-2 border-black">
            <p className="mb-2 font-bold">Opción 1º</p>
            <p>
              Apoyá un anillo que te quede bien en una regla y medí el diámetro
              interior en mm (de borde interno a borde interno).
            </p>
          </div>
          <div className="p-5 border-t-2 sm:border-t-0 border-black">
            <p className="mb-2 font-bold">Opción 2º</p>
            <p>
              Envolvé tu dedo con una tira de papel, marcá la unión y medí la
              longitud de circunferencia en mm.
            </p>
          </div>
        </div>

        <table className="w-full text-center text-sm">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-3 font-normal">Talle</th>
              <th className="py-3 font-normal border-x-2 border-black">
                Diámetro interno
              </th>
              <th className="py-3 font-normal">Long. circunferencia</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([talle, diam, circ]) => {
              const active = selected === talle;
              return (
                <tr
                  key={talle}
                  onClick={onPick ? () => onPick(talle) : undefined}
                  className={`${onPick ? "cursor-pointer" : ""} ${
                    active ? "bg-black text-white" : "hover:bg-black/5"
                  }`}
                  data-cursor-hover={onPick ? true : undefined}
                >
                  <td className="py-2">{talle}</td>
                  <td className="py-2">{diam} mm</td>
                  <td className="py-2">{circ} mm</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {onPick && (
          <p className="px-6 py-4 text-[11px] text-black/75 border-t-2 border-black">
            Tocá una fila para elegir ese talle.
          </p>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
}
