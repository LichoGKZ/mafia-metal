"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/admin/actions";

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`¿Borrar "${name}" definitivamente?`)) return;
    startTransition(() => deleteProduct(id));
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="font-victor text-[10px] tracking-[0.2em] uppercase disabled:opacity-40"
      style={{ color: "rgba(139,0,0,0.8)" }}
    >
      {isPending ? "borrando..." : "borrar"}
    </button>
  );
}
