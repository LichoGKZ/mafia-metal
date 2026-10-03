import type { Metadata } from "next";
import { Victor_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/Cart/CartDrawer";
import { brandCssVars } from "@/lib/brand";

// NOTA UX/Performance: se sacaron Cinzel, Bebas Neue e Inter porque
// globals.css fuerza `* { font-family: var(--font-victor-mono) }` en todo
// el sitio — esas tres familias se descargaban pero no se usaban en
// ningún componente, agregando peso muerto a la carga inicial.
const victorMono = Victor_Mono({
  subsets: ["latin"],
  variable: "--font-victor-mono",
  display: "swap",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mafiametal.com"),
  title: {
    default: "Mafia Metal",
    template: "%s | MAFIA METAL",
  },
  description:
    "Joyería artesanal en plata y oro hecha a mano en Mar del Plata. Piezas exclusivas y colecciones limitadas de Mafia Metal.",
  keywords: [
    "joyería",
    "mafia metal",
    "joyería en plata",
    "joyería en oro",
    "colecciones exclusivas",
    "joyería artesanal",
    "Mar del Plata",
    "metales premium",
  ],
  authors: [{ name: "MAFIA METAL" }],
  creator: "MAFIA METAL",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://mafiametal.com",
    title: "Mafia Metal",
    description:
      "Joyería artesanal en plata y oro hecha a mano en Mar del Plata. Piezas exclusivas y colecciones limitadas.",
    siteName: "MAFIA METAL",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MAFIA METAL — Joyería artesanal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mafia Metal",
    description:
      "Joyería artesanal en plata y oro hecha a mano en Mar del Plata.",
    images: ["/og-image.jpg"],
    creator: "@mafiametal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={victorMono.variable}
      style={brandCssVars as React.CSSProperties}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
