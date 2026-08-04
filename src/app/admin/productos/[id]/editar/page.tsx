import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "../../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <main
      className="min-h-screen px-6 py-12 md:px-12"
      style={{ background: "#1a1916", color: "#b0aa98" }}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className="font-victor text-sm tracking-[0.35em] uppercase mb-10"
          style={{ color: "#d4af37" }}
        >
          editar · {product.name}
        </h1>
        <ProductForm
          mode="edit"
          initial={{
            id: product.id,
            name: product.name,
            subtitle: product.subtitle ?? "",
            price: product.price ?? "$—",
            priceARS: product.price_ars ?? 0,
            material: product.material ?? "",
            description: product.description ?? "",
            chapter: product.chapter ?? "",
            badge: product.badge ?? "",
            color: product.color,
            image: product.image ?? "",
            images: product.images ?? [],
            lifestyleImages: product.lifestyle_images ?? [],
            isVisible: product.is_visible,
            sortOrder: product.sort_order ?? 0,
          }}
        />
      </div>
    </main>
  );
}
