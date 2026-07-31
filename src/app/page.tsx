"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import Loader from "@/components/Loader/Loader";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Story from "@/components/Story/Story";
import Collection from "@/components/Collection/Collection";
import Gallery from "@/components/Gallery/Gallery";
import Contact from "@/components/Contact/Contact";
import CustomCursor from "@/components/CustomCursor";
import { useLenis } from "@/hooks/useLenis";
import { FilmGrain } from "@/components/FilmGrain";
import { GraffitiBackground } from "@/components/GraffitiBackground";

const Vault = dynamic(() => import("@/components/Vault/Vault"), {
  ssr: false,
});

export default function Home() {
  useLenis();

  return (
    <>
      <FilmGrain />
      <div className="vignette" />
      <CustomCursor />
      <Loader />
      <Navbar />
      <div className="page-bg-wrap">
        <GraffitiBackground />
        <main className="relative">
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
            <Collection />
          </section>
          <section id="gallery">
            <Gallery />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </main>
      </div>
    </>
  );
}
