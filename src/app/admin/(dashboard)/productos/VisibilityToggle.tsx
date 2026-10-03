"use client";

import { useTransition } from "react";
import { toggleVisibility } from "@/app/admin/actions";

export default function VisibilityToggle({
  id,
  isVisible,
}: {
  id: string;
  isVisible: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleVisibility(id, !isVisible))}
      disabled={isPending}
      className="font-victor text-[10px] tracking-[0.2em] uppercase disabled:opacity-40"
      style={{ color: isVisible ? "var(--gold)" : "rgba(176,170,152,0.4)" }}
      title={isVisible ? "Visible en el sitio" : "Oculto del sitio"}
    >
      {isVisible ? "visible" : "oculto"}
    </button>
  );
}
