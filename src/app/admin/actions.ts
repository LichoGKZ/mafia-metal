"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ProductInput {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceARS: number;
  description: string;
  /** Texto libre (ej: "Plata", "Oro", "Negro mate"). */
  color: string;
  image: string;
  images: string[];
  lifestyleImages: string[];
  isVisible: boolean;
  sortOrder: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function listProductsAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createProduct(input: Omit<ProductInput, "id"> & { id?: string }) {
  const supabase = await createClient();
  const id = input.id?.trim() || slugify(input.name);

  const { error } = await supabase.from("products").insert({
    id,
    name: input.name,
    subtitle: input.subtitle,
    price: input.price,
    price_ars: input.priceARS,
    description: input.description,
    color: input.color,
    image: input.image,
    images: input.images,
    lifestyle_images: input.lifestyleImages,
    is_visible: input.isVisible,
    sort_order: input.sortOrder,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function updateProduct(input: ProductInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      subtitle: input.subtitle,
      price: input.price,
      price_ars: input.priceARS,
      description: input.description,
      color: input.color,
      image: input.image,
      images: input.images,
      lifestyle_images: input.lifestyleImages,
      is_visible: input.isVisible,
      sort_order: input.sortOrder,
    })
    .eq("id", input.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/productos");
}

export async function toggleVisibility(id: string, isVisible: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_visible: isVisible })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/productos");
}
