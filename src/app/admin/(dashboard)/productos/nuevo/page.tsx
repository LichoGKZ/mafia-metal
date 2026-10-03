import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <main
      className="min-h-screen px-6 py-12 md:px-12"
      style={{ background: "#1a1916", color: "#b0aa98" }}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className="font-victor text-sm tracking-[0.35em] uppercase mb-10"
          style={{ color: "var(--gold)" }}
        >
          nuevo producto
        </h1>
        <ProductForm mode="create" />
      </div>
    </main>
  );
}
