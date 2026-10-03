"use client";

import { useState, useTransition } from "react";
import {
  deleteMessage,
  updateMessageStatus,
  type MessageStatus,
} from "@/app/admin/mensajes/actions";

const INTEREST_LABELS: Record<string, string> = {
  rings: "anillos",
  chains: "cadenas y collares",
  bracelets: "pulseras",
  custom: "pieza a medida",
  wholesale: "mayorista",
  other: "otro",
};

const STATUS_META: Record<MessageStatus, { label: string; color: string }> = {
  nuevo: { label: "nuevo", color: "var(--gold)" },
  leido: { label: "leído", color: "#6b9bd1" },
  respondido: { label: "respondido", color: "#4caf6d" },
  archivado: { label: "archivado", color: "rgba(176,170,152,0.4)" },
};

export interface ContactMessageRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  message: string | null;
  status: MessageStatus;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageCard({ msg }: { msg: ContactMessageRow }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [localStatus, setLocalStatus] = useState<MessageStatus>(msg.status);

  const meta = STATUS_META[localStatus];
  const whatsappPhone = msg.phone?.replace(/[^\d]/g, "");

  const handleStatusChange = (status: MessageStatus) => {
    setLocalStatus(status);
    startTransition(() => updateMessageStatus(msg.id, status));
  };

  const handleOpen = () => {
    if (!expanded && localStatus === "nuevo") {
      handleStatusChange("leido");
    }
    setExpanded((v) => !v);
  };

  const handleDelete = () => {
    if (!confirm(`¿Borrar la consulta de "${msg.name}" definitivamente?`)) return;
    startTransition(() => deleteMessage(msg.id));
  };

  return (
    <div
      className="transition-opacity"
      style={{
        border: `1px solid ${localStatus === "nuevo" ? "rgb(var(--gold-rgb) / 0.3)" : "rgba(176,170,152,0.1)"}`,
        opacity: isPending ? 0.5 : 1,
      }}
    >
      <button
        onClick={handleOpen}
        className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      >
        {/* estado (punto) */}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 hidden sm:block"
          style={{ background: meta.color }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-victor text-sm" style={{ color: "#b0aa98" }}>
              {msg.name}
            </p>
            {msg.interest && (
              <span
                className="font-victor text-[9px] tracking-[0.2em] uppercase px-2 py-0.5"
                style={{ border: "1px solid rgba(176,170,152,0.2)", color: "rgba(176,170,152,0.6)" }}
              >
                {INTEREST_LABELS[msg.interest] || msg.interest}
              </span>
            )}
          </div>
          <p
            className="font-victor text-[10px] tracking-wider mt-1 truncate"
            style={{ color: "rgba(176,170,152,0.4)" }}
          >
            {msg.email} {msg.phone ? `· ${msg.phone}` : ""}
          </p>
          {!expanded && msg.message && (
            <p
              className="font-victor text-[11px] mt-1.5 truncate"
              style={{ color: "rgba(176,170,152,0.55)" }}
            >
              {msg.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <span
            className="font-victor text-[9px] tracking-[0.25em] uppercase"
            style={{ color: meta.color }}
          >
            {meta.label}
          </span>
          <span className="font-victor text-[9px]" style={{ color: "rgba(176,170,152,0.3)" }}>
            {formatDate(msg.created_at)}
          </span>
          <span
            className="font-victor text-xs"
            style={{ color: "rgba(176,170,152,0.3)", transform: expanded ? "rotate(180deg)" : "none" }}
          >
            ▾
          </span>
        </div>
      </button>

      {expanded && (
        <div
          className="px-4 pb-5 pt-1 space-y-4"
          style={{ borderTop: "1px solid rgba(176,170,152,0.08)" }}
        >
          {msg.message && (
            <p
              className="font-victor text-xs leading-relaxed whitespace-pre-wrap pt-4"
              style={{ color: "rgba(176,170,152,0.75)" }}
            >
              {msg.message}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={`mailto:${msg.email}?subject=${encodeURIComponent(
                "Re: tu consulta en Mafia Metal"
              )}`}
              className="px-4 py-2 font-victor text-[10px] tracking-[0.25em] uppercase"
              style={{ background: "var(--gold)", color: "#0a0908" }}
            >
              responder por email
            </a>

            {whatsappPhone && (
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 font-victor text-[10px] tracking-[0.25em] uppercase"
                style={{ border: "1px solid rgba(76,175,109,0.5)", color: "#4caf6d" }}
              >
                whatsapp
              </a>
            )}

            <div className="flex-1" />

            <select
              value={localStatus}
              onChange={(e) => handleStatusChange(e.target.value as MessageStatus)}
              className="bg-transparent py-2 px-3 font-victor text-[10px] tracking-[0.15em] uppercase outline-none cursor-pointer"
              style={{ border: "1px solid rgba(176,170,152,0.2)", color: "#b0aa98", background: "#1a1916" }}
            >
              <option value="nuevo" style={{ background: "#1a1916" }}>nuevo</option>
              <option value="leido" style={{ background: "#1a1916" }}>leído</option>
              <option value="respondido" style={{ background: "#1a1916" }}>respondido</option>
              <option value="archivado" style={{ background: "#1a1916" }}>archivado</option>
            </select>

            <button
              onClick={handleDelete}
              className="font-victor text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(139,0,0,0.8)" }}
            >
              borrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
