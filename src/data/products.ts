import { createClient } from "@/lib/supabase/server";
import type { JewelryItem } from "@/data/collection";

interface ProductRow {
  id: string;
  name: string;
  subtitle: string | null;
  price: string | null;
  price_ars: number;
  material: string | null;
  description: string | null;
  chapter: string | null;
  badge: string | null;
  color: "gold" | "silver" | "mixed";
  image: string | null;
  images: string[] | null;
  lifestyle_images: string[] | null;
  sort_order: number;
}

function rowToItem(row: ProductRow): JewelryItem {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle ?? "",
    price: row.price ?? "$—",
    priceARS: row.price_ars ?? 0,
    material: row.material ?? "",
    description: row.description ?? "",
    chapter: row.chapter ?? "",
    badge: row.badge ?? undefined,
    color: row.color,
    image: row.image ?? "",
    images: row.images && row.images.length > 0 ? row.images : undefined,
    lifestyleImages:
      row.lifestyle_images && row.lifestyle_images.length > 0
        ? row.lifestyle_images
        : undefined,
  };
}

/** Trae todos los productos visibles, para el sitio público. */
export async function getPublishedProducts(): Promise<JewelryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error trayendo productos:", error.message);
    return [];
  }

  return (data as ProductRow[]).map(rowToItem);
}
