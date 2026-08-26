import Loader from "@/components/Loader/Loader";
import Navbar from "@/components/Navbar/Navbar";
import CustomCursor from "@/components/CustomCursor";
import VintagePaperBackground from "@/components/GraffitiBackground";
import { getPublishedProducts } from "@/data/products";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const products = await getPublishedProducts();

  return (
    <>
      <div className="vignette" />
      <CustomCursor />
      <Loader />
      <Navbar />
      <div className="page-bg-wrap">
        <VintagePaperBackground />
        <main className="relative">
          <HomeClient products={products} />
        </main>
      </div>
    </>
  );
}
