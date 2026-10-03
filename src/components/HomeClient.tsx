"use client";

import { useLenis } from "@/hooks/useLenis";
import Hero from "@/components/Hero/Hero";
import Collection from "@/components/Collection/Collection";
import CustomPiece from "@/components/Customs/CustomPiece";
import Story from "@/components/Story/Story";
import Gallery from "@/components/Gallery/Gallery";
import Contact from "@/components/Contact/Contact";
import type { JewelryItem } from "@/data/collection";

/**
 * Orden de secciones (no alterar sin avisar al equipo de diseño):
 * Hero → Productos → Pieza personalizada → El Taller → Galería → Contacto
 */
export default function HomeClient({ products }: { products: JewelryItem[] }) {
  useLenis();

  return (
    <>
      <section id="home">
        <Hero />
      </section>
      <section id="collection">
        <Collection items={products} />
      </section>
      <section id="customs">
        <CustomPiece />
      </section>
      <section id="forge">
        <Story />
      </section>
      <section id="gallery">
        <Gallery />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </>
  );
}
