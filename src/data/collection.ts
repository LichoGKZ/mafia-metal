export interface JewelryItem {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  /** Numeric price in ARS, used for cart totals and the Mercado Pago preference.
   *  TODO: reemplazar por los precios reales en pesos argentinos. */
  priceARS: number;
  material: string;
  description: string;
  chapter: string;
  badge?: string;
  color: "gold" | "silver" | "mixed";
  /** Ruta de la foto real del producto dentro de /public. Vacío = falta subir la foto. */
  image: string;
  /** Set de fotos de estudio del producto (para el carrusel). Si está vacío, se usa `image`. */
  images?: string[];
  /** Fotos "as worn by" — el producto en la calle / en artistas / en vivo. */
  lifestyleImages?: string[];
}

export interface VaultItem {
  id: string;
  name: string;
  tagline: string;
  material: string;
  weight: string;
  purity: string;
  edition: string;
  modelColor: string;
  image: string;
}

export const collectionItems: JewelryItem[] = [
  {
    id: "one-love",
    name: "ONE LOVE",
    subtitle: "Ultimo lanzamiento.",
    price: "$—",
    priceARS: 0, // TODO: cargar precio real
    material: "Plata",
    description:
      "El concepto One Love es una expresión que trasciende géneros. Sus raíces están profundamente ligadas a la cultura reggae como un llamado a la unidad. Fue el hip hop de los 90 —y fundamentalmente el clásico One Love de Nas— lo que la consolidó como un símbolo de lealtad y hermandad en el entorno urbano.",
    chapter: "I",
    badge: "BESTSELLER",
    color: "silver",
    image: "/images/products/one-love-01.jpg",
    images: [
      "/images/products/one-love-01.jpg",
      "/images/products/one-love-02.jpg",
      "/images/products/one-love-03.jpg",
      "/images/products/one-love-04.jpg",
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
    material: "Plata maciza",
    description:
      "Pulsera de eslabones diseñada y modelada desde cero, pieza maciza y pesada, donde la estética industrial se logra a través de un trabajo preciso de textura y acabado en cada eslabón. Cada eslabón lleva el sello de Mafia Metal en la cara posterior. El cierre presenta la frase 'Only trust your mafia'.",
    chapter: "II",
    color: "silver",
    image: "/images/products/only-trust.jpg",
  },
  {
    id: "tag-mafia",
    name: "TAG MAFIA",
    subtitle: "El graffiti llevado al metal",
    price: "$—",
    priceARS: 0, // TODO: cargar precio real
    material: "Plata",
    description:
      "El Tag de Mafia Metal traslada la estética del graffiti al metal. Diseñado y modelado desde cero, este colgante captura el trazo original en una pieza maciza, pensada para mantener la identidad del diseño intacta tras el proceso de fundición.",
    chapter: "III",
    badge: "NEW",
    color: "silver",
    image: "", // TODO: subir foto (fondo amarillo)
  },
];

export const vaultItems: VaultItem[] = [
  {
    id: "vault-one-love",
    name: "ONE LOVE",
    tagline: "Ultimo lanzamiento",
    material: "Plata",
    weight: "—",
    purity: "—",
    edition: "—",
    modelColor: "#C0C0C0",
    image: "/images/products/one-love-02.jpg",
  },
  {
    id: "vault-only-trust",
    name: "ONLY TRUST",
    tagline: "Only trust your mafia",
    material: "Plata maciza",
    weight: "—",
    purity: "—",
    edition: "—",
    modelColor: "#C0C0C0",
    image: "/images/products/only-trust.jpg",
  },
  {
    id: "vault-tag-mafia",
    name: "TAG MAFIA",
    tagline: "El graffiti llevado al metal",
    material: "Plata",
    weight: "—",
    purity: "—",
    edition: "—",
    modelColor: "#C0C0C0",
    image: "",
  },
];

export const craftSteps = [
  {
    title: "DISEÑO",
    body: "Explicacion diseño Lorem ipsum dolor sit amet.",
  },
  {
    title: "MODELADO",
    body: "Explicacion modelado Lorem ipsum dolor sit amet.",
  },
  {
    title: "FUNDICIÓN",
    body: "Explicacion fundicion Lorem ipsum dolor sit amet.",
  },
  {
    title: "TERMINACIÓN",
    body: "Explicacion terminacion Lorem ipsum dolor sit amet.",
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

