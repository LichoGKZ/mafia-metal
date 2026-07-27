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
}

export const collectionItems: JewelryItem[] = [
  {
    id: "omerta-ring",
    name: "OMERTÀ RING",
    subtitle: "The Code of Silence",
    price: "$2,400",
    priceARS: 3120000, // placeholder: $2400 USD x 1300 (actualizar con precio real en ARS)
    material: "18K Gold",
    description:
      "Forged from 18K Italian gold. Engraved with the ancient oath of silence. Worn by those who understand that power needs no words.",
    chapter: "I",
    badge: "BESTSELLER",
    color: "gold",
  },
  {
    id: "il-capo-chain",
    name: "IL CAPO CHAIN",
    subtitle: "The Boss Never Waits",
    price: "$3,800",
    priceARS: 4940000, // placeholder: $3800 USD x 1300 (actualizar con precio real en ARS)
    material: "925 Silver",
    description:
      "Heavy-gauge sterling silver. Each link hand-hammered in our forge. The weight reminds you who you are.",
    chapter: "II",
    color: "silver",
  },
  {
    id: "vendetta-cross",
    name: "VENDETTA CROSS",
    subtitle: "Debts Are Always Paid",
    price: "$1,900",
    priceARS: 2470000, // placeholder: $1900 USD x 1300 (actualizar con precio real en ARS)
    material: "Black Gold",
    description:
      "Black rhodium over 14K gold. For those who keep their promises — no matter the cost.",
    chapter: "III",
    badge: "LIMITED",
    color: "mixed",
  },
  {
    id: "cosa-nostra-signet",
    name: "COSA NOSTRA SIGNET",
    subtitle: "Our Thing",
    price: "$5,200",
    priceARS: 6760000, // placeholder: $5200 USD x 1300 (actualizar con precio real en ARS)
    material: "22K Gold",
    description:
      "The signet ring is the mark of authority. 22K gold, custom-engraved crest. One ring, one family.",
    chapter: "IV",
    color: "gold",
  },
  {
    id: "brooklyn-bracelet",
    name: "BROOKLYN BRACELET",
    subtitle: "Old School Steel",
    price: "$1,600",
    priceARS: 2080000, // placeholder: $1600 USD x 1300 (actualizar con precio real en ARS)
    material: "Surgical Steel",
    description:
      "Brushed surgical steel with gold accents. Born in the Bronx. Built to last forever.",
    chapter: "V",
    color: "silver",
  },
  {
    id: "consigliere-pendant",
    name: "CONSIGLIERE",
    subtitle: "The Advisor",
    price: "$2,100",
    priceARS: 2730000, // placeholder: $2100 USD x 1300 (actualizar con precio real en ARS)
    material: "Mixed Metals",
    description:
      "Gold and silver fused in our forge. The Consigliere serves two worlds — so does this pendant.",
    chapter: "VI",
    badge: "NEW",
    color: "mixed",
  },
];

export const vaultItems: VaultItem[] = [
  {
    id: "vault-ring",
    name: "OMERTÀ SIGNET",
    tagline: "The mark of the initiated",
    material: "18K Yellow Gold",
    weight: "42g",
    purity: "750/1000",
    edition: "Limited to 99 pieces",
    modelColor: "#D4AF37",
  },
  {
    id: "vault-chain",
    name: "IRON CODE CHAIN",
    tagline: "Links that bind, links that liberate",
    material: "925 Sterling Silver",
    weight: "185g",
    purity: "925/1000",
    edition: "Open edition",
    modelColor: "#C0C0C0",
  },
  {
    id: "vault-cross",
    name: "VENDETTA CROSS",
    tagline: "Faith and vengeance, forged as one",
    material: "14K Black Gold",
    weight: "28g",
    purity: "585/1000",
    edition: "Limited to 33 pieces",
    modelColor: "#2a2a2a",
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
