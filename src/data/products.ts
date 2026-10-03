import { createClient } from "@/lib/supabase/server";
import { RING_SIZES, type JewelryItem } from "@/data/collection";

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
  /** Columna opcional `sizes text[]`. Si no existe, se infiere por nombre. */
  sizes?: string[] | null;
  sort_order: number;
}

/** Piezas que llevan talle. Si en Supabase agregás la columna `sizes`
 *  (text[]), manda esa; si no, se infiere por nombre/subtítulo. */
function resolveSizes(row: ProductRow): string[] | undefined {
  if (row.sizes) return row.sizes.length > 0 ? row.sizes : undefined;
  const text = `${row.name} ${row.subtitle ?? ""}`.toLowerCase();
  return /anillo|ring|only trust|one love/.test(text) ? RING_SIZES : undefined;
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
    sizes: resolveSizes(row),
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
