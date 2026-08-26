"use client";

import dynamic from "next/dynamic";
import { useLenis } from "@/hooks/useLenis";
import Hero from "@/components/Hero/Hero";
import Story from "@/components/Story/Story";
import Collection from "@/components/Collection/Collection";
import Gallery from "@/components/Gallery/Gallery";
import Contact from "@/components/Contact/Contact";
import type { JewelryItem } from "@/data/collection";

const Vault = dynamic(() => import("@/components/Vault/Vault"), {
  ssr: false,
});

export default function HomeClient({ products }: { products: JewelryItem[] }) {
  useLenis();

  return (
    <>
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
    </>
  );
}