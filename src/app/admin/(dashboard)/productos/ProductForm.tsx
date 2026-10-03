"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createProduct, updateProduct, ProductInput } from "@/app/admin/actions";

type FormMode = "create" | "edit";

interface Props {
  mode: FormMode;
  initial?: Partial<ProductInput>;
}

const empty: ProductInput = {
  id: "",
  name: "",
  subtitle: "",
  price: "$—",
  priceARS: 0,
  material: "",
  description: "",
  chapter: "",
  badge: "",
  color: "silver",
  image: "",
  images: [],
  lifestyleImages: [],
  isVisible: true,
  sortOrder: 0,
};

export default function ProductForm({ mode, initial }: Props) {
  const supabase = createClient();
  const [form, setForm] = useState<ProductInput>({ ...empty, ...initial });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${form.id || "temp"}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file);

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      set("image", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error subiendo la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryImages = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "images" | "lifestyleImages"
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      set(field, [...form[field], ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error subiendo imágenes.");
    } finally {
      setUploading(false);
    }
  };

  const removeFromGallery = (field: "images" | "lifestyleImages", url: string) => {
    set(field, form[field].filter((u) => u !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (mode === "create") {
        await createProduct(form);
      } else {
        await updateProduct(form);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando el producto.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {mode === "create" && (
        <Field label="id / slug (opcional, se genera del nombre si lo dejás vacío)">
          <input
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            className="w-full bg-transparent py-2 font-victor text-sm outline-none"
            style={inputStyle}
            placeholder="ej: one-love"
          />
        </Field>
      )}

      <Field label="nombre *">
        <input
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="w-full bg-transparent py-2 font-victor text-sm outline-none"
          style={inputStyle}
        />
      </Field>

      <Field label="subtítulo">
        <input
          value={form.subtitle}
          onChange={(e) => set("subtitle", e.target.value)}
          className="w-full bg-transparent py-2 font-victor text-sm outline-none"
          style={inputStyle}
        />
      </Field>

      <div className="grid grid-cols-2 gap-6">
        <Field label="precio (texto a mostrar)">
          <input
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            className="w-full bg-transparent py-2 font-victor text-sm outline-none"
            style={inputStyle}
          />
        </Field>
        <Field label="precio ARS (numérico, para carrito/MP) *">
          <input
            required
            type="number"
            min={0}
            value={form.priceARS}
            onChange={(e) => set("priceARS", Number(e.target.value))}
            className="w-full bg-transparent py-2 font-victor text-sm outline-none"
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Field label="material">
          <input
            value={form.material}
            onChange={(e) => set("material", e.target.value)}
            className="w-full bg-transparent py-2 font-victor text-sm outline-none"
            style={inputStyle}
          />
        </Field>
        <Field label="color">
          <select
            value={form.color}
            onChange={(e) => set("color", e.target.value as ProductInput["color"])}
            className="w-full bg-transparent py-2 font-victor text-sm outline-none"
            style={inputStyle}
          >
            <option value="gold" style={{ color: "#000" }}>gold</option>
            <option value="silver" style={{ color: "#000" }}>silver</option>
            <option value="mixed" style={{ color: "#000" }}>mixed</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Field label="capítulo (I, II, III...)">
          <input
            value={form.chapter}
            onChange={(e) => set("chapter", e.target.value)}
            className="w-full bg-transparent py-2 font-victor text-sm outline-none"
            style={inputStyle}
          />
        </Field>
        <Field label="badge (NEW, BESTSELLER, vacío = sin badge)">
          <input
            value={form.badge ?? ""}
            onChange={(e) => set("badge", e.target.value)}
            className="w-full bg-transparent py-2 font-victor text-sm outline-none"
            style={inputStyle}
          />
        </Field>
      </div>

      <Field label="descripción">
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className="w-full bg-transparent py-2 font-victor text-sm outline-none resize-none"
          style={inputStyle}
        />
      </Field>

      <Field label="foto principal">
        <input type="file" accept="image/*" onChange={handleMainImage} className="font-victor text-xs" />
        {form.image && (
          <img src={form.image} alt="" className="mt-3 w-32 h-32 object-cover" style={{ border: "1px solid rgb(var(--gold-rgb) / 0.2)" }} />
        )}
      </Field>

      <Field label="fotos de estudio (carrusel, podés subir varias)">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleGalleryImages(e, "images")}
          className="font-victor text-xs"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {form.images.map((url) => (
            <div key={url} className="relative">
              <img src={url} alt="" className="w-20 h-20 object-cover" style={{ border: "1px solid rgb(var(--gold-rgb) / 0.2)" }} />
              <button
                type="button"
                onClick={() => removeFromGallery("images", url)}
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center font-victor text-[10px]"
                style={{ background: "#8b0000", color: "#fff", borderRadius: "50%" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </Field>

      <Field label="fotos 'as worn by' (opcional)">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleGalleryImages(e, "lifestyleImages")}
          className="font-victor text-xs"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {form.lifestyleImages.map((url) => (
            <div key={url} className="relative">
              <img src={url} alt="" className="w-20 h-20 object-cover" style={{ border: "1px solid rgb(var(--gold-rgb) / 0.2)" }} />
              <button
                type="button"
                onClick={() => removeFromGallery("lifestyleImages", url)}
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center font-victor text-[10px]"
                style={{ background: "#8b0000", color: "#fff", borderRadius: "50%" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </Field>

      <label className="flex items-center gap-3 font-victor text-xs">
        <input
          type="checkbox"
          checked={form.isVisible}
          onChange={(e) => set("isVisible", e.target.checked)}
        />
        visible en el sitio
      </label>

      {error && (
        <p className="font-victor text-xs" style={{ color: "#c0392b" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving || uploading}
        className="px-8 py-3 font-victor text-xs tracking-[0.35em] disabled:opacity-50"
        style={{ background: "var(--gold)", color: "#0a0908" }}
      >
        {uploading ? "subiendo imágenes..." : saving ? "guardando..." : "guardar"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="font-victor text-[9px] tracking-[0.3em] uppercase block mb-2"
        style={{ color: "rgba(176,170,152,0.4)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(176,170,152,0.15)",
  color: "#b0aa98",
};
