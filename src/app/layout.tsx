import type { Metadata } from "next";
import { Cinzel, Bebas_Neue, Inter, Victor_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap", 
  weight: ["400", "600", "700", "900"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

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
    default: "MAFIA METAL — Mar del plata.",
    template: "%s | MAFIA METAL",
  },
  description:
    "MAFIA METAL crafts luxury jewelry forged from the finest metals. Exclusive collections inspired by the golden age of power, prestige, and dark elegance.",
  keywords: [
    "luxury jewelry",
    "mafia metal",
    "gold jewelry",
    "silver jewelry",
    "exclusive collections",
    "handcrafted jewelry",
    "dark luxury",
    "premium metals",
  ],
  authors: [{ name: "MAFIA METAL" }],
  creator: "MAFIA METAL",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mafiametal.com",
    title: "MAFIA METAL — Mar del plata.",
    description:
      "Colecciones & drops.",
    siteName: "MAFIA METAL",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MAFIA METAL — Luxury Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAFIA METAL — Mar del plata.",
    description:
      "Colecciones & drops.",
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
      lang="en"
      className={`${cinzel.variable} ${bebasNeue.variable} ${inter.variable} ${victorMono.variable}`}
    >
      <body
        className="antialiased"
        style={{ background: "#1a1916", color: "#b0aa98" }}
      >
        {children}
      </body>
    </html>
  );
}
