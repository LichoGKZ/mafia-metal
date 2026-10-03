"use client";

import { useState } from "react";

/**
 * Campos de formulario con el estilo "línea inferior" del sitio.
 * Usados por el formulario de Pieza personalizada.
 */

type ChangeEvt = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const LABEL_CLASS =
  "font-victor text-[10px] tracking-[0.3em] uppercase mb-2 block transition-colors duration-200";

function Shell({
  label,
  required,
  focused,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  focused: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className={LABEL_CLASS}
        style={{ color: focused ? "var(--gold-dark)" : "rgba(23,21,15,0.55)" }}
      >
        {label} {required && <span style={{ color: "#8b0000" }}>*</span>}
      </label>
      <div
        style={{
          borderBottom: `1px solid ${
            focused ? "var(--gold)" : "rgba(23,21,15,0.18)"
          }`,
          transition: "border-color 0.2s",
        }}
      >
        {children}
      </div>
      {hint && (
        <p
          className="font-victor text-[10px] mt-1.5"
          style={{ color: "rgba(23,21,15,0.4)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvt) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Shell label={label} required={required} focused={focused} hint={hint}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent py-2.5 font-victor text-xs outline-none"
        style={{ color: "#17150f" }}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "elegí una opción",
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvt) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Shell label={label} required={required} focused={focused}>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className="w-full bg-transparent py-2.5 font-victor text-xs outline-none appearance-none cursor-pointer"
          style={{ color: "#17150f" }}
        >
          <option value="" style={{ background: "#f3f0e7" }}>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ background: "#f3f0e7" }}>
              {o.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-xs"
          style={{ color: "rgba(23,21,15,0.4)" }}
        >
          ▾
        </span>
      </div>
    </Shell>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  rows = 4,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvt) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Shell label={label} required={required} focused={focused}>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full bg-transparent py-2.5 font-victor text-xs outline-none resize-none"
        style={{ color: "#17150f" }}
      />
    </Shell>
  );
}
