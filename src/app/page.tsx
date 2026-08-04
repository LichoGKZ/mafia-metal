import dynamic from "next/dynamic";
import Loader from "@/components/Loader/Loader";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Story from "@/components/Story/Story";
import Collection from "@/components/Collection/Collection";
import Gallery from "@/components/Gallery/Gallery";
import Contact from "@/components/Contact/Contact";
import CustomCursor from "@/components/CustomCursor";
import VintagePaperBackground from "@/components/GraffitiBackground";
import { getPublishedProducts } from "@/data/products";
import HomeClient from "@/components/HomeClient";

const Vault = dynamic(() => import("@/components/Vault/Vault"), {
  ssr: false,
});

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
          <HomeClient>
            <section id="home">
              <Hero />
            </section>
            <section id="vault">
              <Vault />
            </section>
            <section id="forge">
              <Story />
            </section>
            <section id="collection">
              <Collection items={products} />
            </section>
            <section id="gallery">
              <Gallery />
            </section>
            <section id="contact">
              <Contact />
            </section>
          </HomeClient>
        </main>
      </div>
    </>
  );
}
