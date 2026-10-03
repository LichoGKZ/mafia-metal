export interface JewelryItem {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  /** Numeric price in ARS, used for the order total in the cart / WhatsApp message.
   *  TODO: reemplazar por los precios reales en pesos argentinos. */
  priceARS: number;
  /** Tipo de pieza: "Anillo", "Pulsera", "Colgante"… */
  pieceType?: string;
  /** Tamaño en cm (solo el número o medidas, sin la unidad: "4 x 2,5"). La ficha agrega " cm". */
  sizeCm?: string;
  description: string;
  /** Color / acabado, texto libre (ej: "Plata", "Oro"). */
  color: string;
  /** Talles disponibles. Si existe, el cliente DEBE elegir uno para comprar. */
  sizes?: string[];
  /** Ruta de la foto real del producto dentro de /public. Usar PNG recortado (sin fondo). Vacío = falta subir la foto. */
  image: string;
  /** Set de fotos de estudio del producto (para el carrusel). Si está vacío, se usa `image`. */
  images?: string[];
  /** Fotos "as worn by" — el producto en la calle / en artistas / en vivo. */
  lifestyleImages?: string[];
}

/** Talles de anillo (Argentina) — coinciden con la guía de talles. */
export const RING_SIZES = Array.from({ length: 23 }, (_, i) => String(13 + i));

export const collectionItems: JewelryItem[] = [
  {
    id: "one-love",
    name: "ONE LOVE",
    subtitle: "Ultimo lanzamiento.",
    price: "$—",
    priceARS: 0, // TODO: cargar precio real
    pieceType: "Anillo", // TODO: confirmar (se asume anillo porque lleva talle)
    // sizeCm: "", // TODO: cargar medida real en cm
    description:
      "El concepto One Love es una expresión que trasciende géneros. Sus raíces están profundamente ligadas a la cultura reggae como un llamado a la unidad. Fue el hip hop de los 90 —y fundamentalmente el clásico One Love de Nas— lo que la consolidó como un símbolo de lealtad y hermandad en el entorno urbano.",
    color: "Plata",
    image: "/images/products/one-love-01.png",
    images: [
      "/images/products/one-love-01.png",
      "/images/products/one-love-02.png",
    ],
    lifestyleImages: [
      "/images/lifestyle/one-love-01.jpg",
      "/images/lifestyle/one-love-02.jpg",
      "/images/lifestyle/one-love-03.jpg",
      "/images/lifestyle/one-love-04.jpg",
      "/images/lifestyle/one-love-05.jpg",
      "/images/lifestyle/one-love-06.jpg",
    ],
  },
  {
    id: "only-trust",
    name: "ONLY TRUST",
    subtitle: "Only trust your mafia",
    price: "$—",
    priceARS: 0, // TODO: cargar precio real
    pieceType: "Pulsera",
    // sizeCm: "", // TODO: largo de la pulsera en cm
    description:
      "Pulsera de eslabones diseñada y modelada desde cero, pieza maciza y pesada, donde la estética industrial se logra a través de un trabajo preciso de textura y acabado en cada eslabón. Cada eslabón lleva el sello de Mafia Metal en la cara posterior. El cierre presenta la frase 'Only trust your mafia'.",
    color: "Plata",
    image: "/images/products/only-trust-01.png",
    images: [
      "/images/products/only-trust-01.png",
      "/images/products/only-trust-02.png",
    ],
  },
  {
    id: "tag-mafia",
    name: "TAG MAFIA",
    subtitle: "El graffiti llevado al metal",
    price: "$—",
    priceARS: 0, // TODO: cargar precio real
    pieceType: "Colgante",
    // sizeCm: "", // TODO: alto del colgante en cm
    description:
      "El Tag de Mafia Metal traslada la estética del graffiti al metal. Diseñado y modelado desde cero, este colgante captura el trazo original en una pieza maciza, pensada para mantener la identidad del diseño intacta tras el proceso de fundición.",
    color: "Plata",
    image: "/images/products/tag-mafia-01.png",
    images: [
      "/images/products/tag-mafia-01.png",
      "/images/products/tag-mafia-02.png",
      "/images/products/tag-mafia-03.png",
    ],
  },
];

export const galleryPhotos: string[] = [
  "/images/gallery/gallery-01.jpg",
  "/images/gallery/gallery-02.jpg",
  "/images/gallery/gallery-03.jpg",
  "/images/gallery/gallery-04.jpg",
  "/images/gallery/gallery-05.jpg",
  "/images/gallery/gallery-06.jpg",
  "/images/gallery/gallery-07.jpg",
  "/images/gallery/gallery-08.jpg",
  "/images/gallery/gallery-09.jpg",
  "/images/gallery/gallery-10.jpg",
  "/images/gallery/gallery-11.jpg",
  "/images/gallery/gallery-12.jpg",
  "/images/gallery/gallery-13.jpg",
  "/images/gallery/gallery-14.jpg",
  "/images/gallery/gallery-15.jpg",
  "/images/gallery/gallery-16.jpg",
  "/images/gallery/gallery-17.jpg",
  "/images/gallery/gallery-18.jpg",
  "/images/gallery/gallery-19.jpg",
  "/images/gallery/gallery-20.jpg",
  "/images/gallery/gallery-21.jpg",
  "/images/gallery/gallery-22.jpg",
  "/images/gallery/gallery-23.jpg",
  "/images/gallery/gallery-24.jpg",
];

export const customPhotos: string[] = [
  "/images/custom/custom-01.jpg",
  "/images/custom/custom-02.jpg",
  "/images/custom/custom-03.jpg",
  "/images/custom/custom-04.jpg",
  "/images/custom/custom-05.jpg",
  "/images/custom/custom-06.jpg",
  "/images/custom/custom-07.jpg",
  "/images/custom/custom-08.jpg",
  "/images/custom/custom-09.jpg",
  "/images/custom/custom-10.jpg",
  "/images/custom/custom-11.jpg",
  "/images/custom/custom-12.jpg",
  "/images/custom/custom-13.jpg",
  "/images/custom/custom-14.jpg",
  "/images/custom/custom-15.jpg",
  "/images/custom/custom-16.jpg",
  "/images/custom/custom-17.jpg",
  "/images/custom/custom-18.jpg",
  "/images/custom/custom-19.jpg",
  "/images/custom/custom-20.jpg",
  "/images/custom/custom-21.jpg",
  "/images/custom/custom-22.jpg",
  "/images/custom/custom-23.jpg",
  "/images/custom/custom-24.jpg",
  "/images/custom/custom-25.jpg",
  "/images/custom/custom-26.jpg",
  "/images/custom/custom-27.jpg",
  "/images/custom/custom-28.jpg",
  "/images/custom/custom-29.jpg",
];

export const processPhotos: string[] = [
  "/images/process/process-01.jpg",
  "/images/process/process-02.jpg",
  "/images/process/process-03.jpg",
  "/images/process/process-04.jpg",
  "/images/process/process-05.jpg",
  "/images/process/process-06.jpg",
  "/images/process/process-07.jpg",
  "/images/process/process-08.jpg",
  "/images/process/process-09.jpg",
  "/images/process/process-10.jpg",
  "/images/process/process-11.jpg",
];

