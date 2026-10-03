"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { customPhotos } from "@/data/collection";
import { createClient } from "@/lib/supabase/client";
import { submitContactMessage } from "@/app/admin/mensajes/actions";
import { WHATSAPP_NUMBER as DEFAULT_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import {
  Field,
  SelectField,
  TextAreaField,
} from "@/components/ui/FormFields";

/* ─────────────────────────  Configuración  ───────────────────────── */

/** Número de WhatsApp en formato internacional sin "+" (ej. 5492235551234).
 *  Se define en .env.local → NEXT_PUBLIC_WHATSAPP_NUMBER. Si falta, el botón
 *  de WhatsApp simplemente no se muestra. */
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER).replace(
  /\D/g,
  ""
);

/** Bucket público de Supabase Storage donde se suben las referencias. */
const STORAGE_BUCKET = "custom-requests";
const MAX_FILES = 5;
const MAX_FILE_MB = 5;

/** Categorías legibles (reemplazan a las pestañas 01/02/03). */
const CATEGORIES = [
  { value: "anillo", label: "Anillos", sizeLabel: "Talle (ej. 18)" },
  { value: "colgante", label: "Colgantes", sizeLabel: "Tamaño en cm (ej. 4 cm)" },
  { value: "pulsera", label: "Pulseras", sizeLabel: "Largo en cm (ej. 19 cm)" },
  { value: "cadena", label: "Cadenas", sizeLabel: "Largo en cm (ej. 55 cm)" },
  { value: "otro", label: "Otro", sizeLabel: "Medida aproximada" },
] as const;

const MATERIALS = [
  { value: "Plata 925", label: "Plata 925" },
  { value: "Plata maciza", label: "Plata maciza" },
  { value: "Oro", label: "Oro" },
  { value: "Bronce", label: "Bronce" },
  { value: "Otro / a definir", label: "Otro / a definir" },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  material: string;
  size: string;
  description: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  material: "",
  size: "",
  description: "",
};

/* ─────────────────────────  Helpers  ───────────────────────── */

function buildSummary(
  categoryLabel: string,
  f: FormState,
  fileUrls: string[],
  fileCount: number
) {
  const lines = [
    "PIEZA PERSONALIZADA",
    `Categoría: ${categoryLabel}`,
    `Material: ${f.material || "—"}`,
    `Talle / Tamaño: ${f.size || "—"}`,
    `Descripción: ${f.description || "—"}`,
  ];
  if (fileUrls.length) {
    lines.push(`Inspiración (${fileUrls.length}):`, ...fileUrls);
  } else if (fileCount) {
    lines.push(
      `Inspiración: ${fileCount} archivo(s) adjunto(s) que no pudieron subirse; el cliente los enviará por WhatsApp.`
    );
  }
  return lines.join("\n");
}

async function uploadReferences(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  const supabase = createClient();
  const batch = Date.now().toString(36);
  const urls: string[] = [];
  for (const [i, file] of files.entries()) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${batch}/${i + 1}.${ext.replace(/[^a-z0-9]/g, "")}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) continue; // best-effort: la solicitud igual se envía
    urls.push(supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl);
  }
  return urls;
}

/* ─────────────────────────  Componente  ───────────────────────── */

export default function CustomPiece() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(
    CATEGORIES[0]
  );
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentSummary, setSentSummary] = useState<string | null>(null);

  // Miniaturas locales de los adjuntos (se liberan al desmontar / cambiar)
  const previews = useMemo(
    () => files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
    [files]
  );
  useEffect(
    () => () => previews.forEach((p) => URL.revokeObjectURL(p.url)),
    [previews]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // permite volver a elegir el mismo archivo
    const valid: File[] = [];
    for (const f of picked) {
      if (!f.type.startsWith("image/")) {
        setFileError("Solo se aceptan imágenes (JPG, PNG, WEBP).");
        continue;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setFileError(`Cada imagen debe pesar menos de ${MAX_FILE_MB} MB.`);
        continue;
      }
      valid.push(f);
    }
    setFiles((prev) => {
      const merged = [...prev, ...valid];
      if (merged.length > MAX_FILES) {
        setFileError(`Máximo ${MAX_FILES} imágenes.`);
      }
      return merged.slice(0, MAX_FILES);
    });
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const urls = await uploadReferences(files);
      const summary = buildSummary(category.label, form, urls, files.length);
      await submitContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interest: "custom",
        message: summary,
      });
      setSentSummary(summary);
    } catch {
      setError(
        "No pudimos enviar tu solicitud. Probá de nuevo en unos segundos."
      );
    } finally {
      setSending(false);
    }
  };

  const whatsappHref = useMemo(() => {
    if (!WHATSAPP_NUMBER) return null;
    const text =
      `Hola Mafia Metal, soy ${form.name || "—"}. Quiero encargar una pieza personalizada.\n\n` +
      (sentSummary ?? buildSummary(category.label, form, [], files.length)) +
      (files.length ? "\n\nTe mando las imágenes de inspiración por este chat." : "");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [form, category, files.length, sentSummary]);

  const reset = () => {
    setForm(EMPTY);
    setFiles([]);
    setSentSummary(null);
    setError(null);
  };

  return (
    <section
      className="relative street-tint overflow-hidden py-20 md:py-32"
    >
      <div className="absolute inset-0 opacity-[0.02] noise-texture" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Encabezado */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <h2 className="font-victor font-bold text-[clamp(2.2rem,6vw,5rem)] text-gold-gradient leading-none">
            Diseña tu propia pieza
          </h2>
          <p
            className="font-victor text-xs md:text-sm mt-5 max-w-xl mx-auto leading-relaxed"
            style={{ color: "rgba(23,21,15,0.6)" }}
          >
            Contanos qué tenés en mente y nosotros hacemos el resto.
          </p>
          <div className="gold-divider max-w-md mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Muestras de trabajos a medida */}
          <motion.div
            className="lg:col-span-2 grid grid-cols-2 gap-3"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {customPhotos.slice(0, 4).map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden border border-gold/20 ${
                  i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"
                } ${i === 1 ? "mt-8" : ""}`}
              >
                <Image
                  src={src}
                  alt={`Pieza personalizada Mafia Metal ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 20vw"
                />
              </div>
            ))}
          </motion.div>

          {/* Formulario */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {sentSummary ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="py-10"
                >
                  <h3 className="font-victor font-bold text-2xl md:text-3xl text-gold-gradient mb-3">
                    Solicitud enviada
                  </h3>
                  <p
                    className="font-victor text-xs leading-relaxed max-w-md"
                    style={{ color: "rgba(23,21,15,0.65)" }}
                  >
                    Recibimos tu pedido. Te escribimos dentro de las próximas 24
                    horas para avanzar con el diseño.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-8">
                    {whatsappHref && (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 font-victor text-xs font-bold tracking-[0.25em] bg-gold text-obsidian hover:bg-gold-light transition-colors metal-shine"
                        data-cursor-hover
                      >
                        Seguir por WhatsApp
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={reset}
                      className="px-8 py-3 font-victor text-xs tracking-[0.25em] border border-ink/20 hover:border-gold transition-colors"
                      data-cursor-hover
                    >
                      Nueva pieza
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-7"
                  exit={{ opacity: 0 }}
                >
                  {/* Categorías */}
                  <div>
                    <p
                      className="font-victor text-[10px] tracking-[0.3em] uppercase mb-3"
                      style={{ color: "rgba(23,21,15,0.55)" }}
                    >
                      ¿Qué tipo de pieza querés?
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Tipo de pieza"
                      className="flex flex-wrap gap-2"
                    >
                      {CATEGORIES.map((c) => {
                        const active = c.value === category.value;
                        return (
                          <button
                            key={c.value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setCategory(c)}
                            className={`px-4 py-2.5 font-victor text-xs tracking-[0.15em] border transition-colors ${
                              active
                                ? "border-gold bg-gold/15 text-ink font-bold"
                                : "border-ink/15 text-ink/60 hover:border-gold/60 hover:text-ink"
                            }`}
                            data-cursor-hover
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <SelectField
                      label="Material"
                      name="material"
                      value={form.material}
                      onChange={handleChange}
                      options={MATERIALS}
                      placeholder="elegí un material"
                      required
                    />
                    <Field
                      label="Talle / Tamaño"
                      name="size"
                      value={form.size}
                      onChange={handleChange}
                      placeholder={category.sizeLabel}
                    />
                  </div>

                  <TextAreaField
                    label="Descripción"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Contanos el diseño: forma, textos, detalles, terminación…"
                    required
                  />

                  {/* Inspiración / adjuntos */}
                  <div>
                    <p
                      className="font-victor text-[10px] tracking-[0.3em] uppercase mb-2"
                      style={{ color: "rgba(23,21,15,0.55)" }}
                    >
                      Inspiración / referencias
                    </p>
                    <label
                      className="flex items-center justify-center gap-3 border border-dashed border-ink/25 hover:border-gold py-5 cursor-pointer transition-colors font-victor text-xs"
                      style={{ color: "rgba(23,21,15,0.7)" }}
                      data-cursor-hover
                    >
                      <span aria-hidden className="text-lg leading-none">
                        +
                      </span>
                      Adjuntar imágenes (hasta {MAX_FILES}, {MAX_FILE_MB} MB c/u)
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFiles}
                        className="sr-only"
                      />
                    </label>
                    {fileError && (
                      <p
                        className="font-victor text-[11px] mt-2"
                        style={{ color: "#8b0000" }}
                      >
                        {fileError}
                      </p>
                    )}
                    {previews.length > 0 && (
                      <ul className="flex flex-wrap gap-3 mt-4">
                        {previews.map((p, i) => (
                          <li
                            key={p.url}
                            className="relative w-20 h-20 border border-gold/30"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.url}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              aria-label={`Quitar ${p.name}`}
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-obsidian text-white text-xs leading-none flex items-center justify-center"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Datos de contacto */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pt-2">
                    <Field
                      label="Nombre"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="tu nombre"
                      required
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                    />
                    <Field
                      label="WhatsApp"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+54 9 223 000 0000"
                    />
                  </div>

                  {error && (
                    <p className="font-victor text-[11px]" style={{ color: "#8b0000" }}>
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 py-4 font-victor font-bold tracking-[0.3em] text-sm text-obsidian bg-gold hover:bg-gold-light transition-colors metal-shine disabled:opacity-50"
                      data-cursor-hover
                    >
                      {sending ? "Enviando…" : "SOLICITAR PIEZA ESPECIAL"}
                    </button>
                    {whatsappHref && (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-4 px-6 text-center font-victor text-xs tracking-[0.2em] border border-ink/25 hover:border-gold transition-colors"
                        data-cursor-hover
                      >
                        o escribinos por WhatsApp
                      </a>
                    )}
                  </div>
                  <p className="font-victor text-[10px]" style={{ color: "rgba(23,21,15,0.4)" }}>
                    * obligatorio
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
