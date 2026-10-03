import type { CartLine } from "@/context/CartContext";

/** Número de WhatsApp de la tienda, formato internacional sin "+". */
export const WHATSAPP_NUMBER = "5492235783081";

const ars = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

/** Arma el mensaje del pedido (formato WhatsApp: *negrita*). */
export function buildOrderMessage(lines: CartLine[]): string {
  const hasUnpriced = lines.some((l) => !(l.priceARS > 0));
  const total = lines.reduce((sum, l) => sum + l.priceARS * l.qty, 0);

  const items = lines.map((l, i) => {
    const details = [
      l.color ? `Color: ${l.color}` : null,
      l.size ? `Talle: ${l.size}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    const price =
      l.priceARS > 0
        ? `${l.qty} × ${ars(l.priceARS)} = ${ars(l.priceARS * l.qty)}`
        : `${l.qty} u. · precio a confirmar`;

    return [`${i + 1}. *${l.name}*`, details && `   ${details}`, `   ${price}`]
      .filter(Boolean)
      .join("\n");
  });

  const totalLine =
    total === 0
      ? "*Total:* a confirmar"
      : hasUnpriced
        ? `*Total parcial:* ${ars(total)} (+ ítems a confirmar)`
        : `*Total:* ${ars(total)}`;

  return [
    "¡Hola!, quiero consultar por:",
    "",
    items.join("\n\n"),
    "",
    totalLine,
    "",
    "Quedo atento/a para coordinar pago y envío. ¡Gracias!",
  ].join("\n");
}

export function whatsappOrderUrl(lines: CartLine[]): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildOrderMessage(lines)
  )}`;
}
