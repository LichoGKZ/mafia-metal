import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MAFIA METAL",
    short_name: "MAFIA METAL",
    description: "Forged in Steel. Built for Legends.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B0B",
    theme_color: "#D4AF37",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
