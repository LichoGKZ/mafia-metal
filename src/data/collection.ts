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
    subtitle: "Unidad más allá de los géneros",
    price: "$—",
    priceARS: 0, // TODO: cargar precio real
    material: "Plata",
    description:
      "El concepto One Love es una expresión que trasciende géneros. Sus raíces están profundamente ligadas a la cultura reggae como un llamado a la unidad. Fue el hip hop de los 90 —y fundamentalmente el clásico One Love de Nas— lo que la consolidó como un símbolo de lealtad y hermandad en el entorno urbano.",
    chapter: "I",
    badge: "BESTSELLER",
    color: "silver",
    image: "", // TODO: subir foto (fondo rosa)
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
    tagline: "Unidad más allá de los géneros",
    material: "Plata",
    weight: "—",
    purity: "—",
    edition: "—",
    modelColor: "#C0C0C0",
    image: "",
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

export const storyMilestones = [
  {
    year: "1923",
    title: "THE FORGE IS LIT",
    body: "In a basement workshop on Mulberry Street, Little Italy, the first piece is hammered into existence. No name. No storefront. Just fire, steel, and a vision.",
  },
  {
    year: "1941",
    title: "THE CODE IS WRITTEN",
    body: "The Omertà Collection is born. Rings engraved with the ancient oath. Worn by men whose word was bond and whose silence was gold.",
  },
  {
    year: "1958",
    title: "THE VAULT OPENS",
    body: "A private showroom, by appointment only. No signs. No advertising. The right people always found us. Power recognizes power.",
  },
  {
    year: "2024",
    title: "THE LEGEND CONTINUES",
    body: "MAFIA METAL steps into the modern era. Same obsession with craft. Same ruthless attention to quality. The forge never went cold.",
  },
];
