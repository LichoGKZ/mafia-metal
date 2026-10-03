import { MetadataRoute } from "next";
import { GOLD_HEX } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MAFIA METAL",
    short_name: "MAFIA METAL",
    description: "Joyería artesanal en plata y oro.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B0B",
    theme_color: GOLD_HEX,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
