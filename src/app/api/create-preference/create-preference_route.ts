import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

interface IncomingLine {
  id: string;
  name: string;
  priceARS: number;
  qty: number;
}

interface ShippingData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city?: string;
  postalCode?: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      {
        error:
          "Falta configurar MP_ACCESS_TOKEN en las variables de entorno del servidor.",
      },
      { status: 500 }
    );
  }

  let body: { lines: IncomingLine[]; shipping: ShippingData };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { lines, shipping } = body;

  if (!lines || lines.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }
  if (!shipping?.name || !shipping?.email || !shipping?.address) {
    return NextResponse.json(
      { error: "Faltan datos de envío (nombre, email o dirección)." },
      { status: 400 }
    );
  }

  // Validación básica de precios/cantidades para evitar un carrito manipulado
  // desde el cliente con montos arbitrarios.
  for (const line of lines) {
    if (
      typeof line.priceARS !== "number" ||
      line.priceARS <= 0 ||
      typeof line.qty !== "number" ||
      line.qty <= 0
    ) {
      return NextResponse.json(
        { error: `Línea de carrito inválida: ${line.id}` },
        { status: 400 }
      );
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  // Mercado Pago rechaza (o ignora) auto_return si las back_urls no son
  // públicas y https. En localhost esto rompe la creación de la preferencia
  // o el redirect automático. Solo lo activamos si tenemos una URL https real.
  const isPublicHttps = siteUrl.startsWith("https://");

  if (!isPublicHttps) {
    console.warn(
      `[create-preference] NEXT_PUBLIC_SITE_URL/origin ("${siteUrl}") no es https. ` +
        `Mercado Pago no acepta auto_return con back_urls no públicas: se omitirá auto_return. ` +
        `Para probar el flujo completo en local, usá un túnel (ngrok, cloudflared) y seteá ` +
        `NEXT_PUBLIC_SITE_URL con esa URL https, o probá directamente en el dominio de producción/preview.`
    );
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: lines.map((line) => ({
          id: line.id,
          title: line.name,
          quantity: line.qty,
          unit_price: line.priceARS,
          currency_id: "ARS",
        })),
        payer: {
          name: shipping.name,
          email: shipping.email,
          phone: shipping.phone
            ? { number: shipping.phone }
            : undefined,
        },
        shipments: {
          receiver_address: {
            street_name: shipping.address,
            city_name: shipping.city,
            zip_code: shipping.postalCode,
          },
        },
        metadata: {
          notes: shipping.notes || "",
        },
        back_urls: {
          success: `${siteUrl}/checkout/success`,
          failure: `${siteUrl}/checkout/failure`,
          pending: `${siteUrl}/checkout/pending`,
        },
        ...(isPublicHttps ? { auto_return: "approved" as const } : {}),
        statement_descriptor: "MAFIA METAL",
      },
    });

    // Con credenciales de TEST, MP devuelve además sandbox_init_point,
    // que es el que hay que usar para pagar con usuarios de prueba.
    const initPoint =
      (result as unknown as { sandbox_init_point?: string }).sandbox_init_point ||
      result.init_point;

    return NextResponse.json({
      init_point: initPoint,
      preference_id: result.id,
    });
  } catch (err) {
    // Antes esto se tragaba el motivo real del rechazo de Mercado Pago.
    // Lo logueamos completo para poder diagnosticar (permisos, cuenta,
    // formato de datos, etc.) y devolvemos algo más útil al cliente.
    console.error("Mercado Pago preference error:", err);

    const mpMessage =
      typeof err === "object" && err !== null && "message" in err
        ? String((err as { message?: unknown }).message)
        : null;

    return NextResponse.json(
      {
        error:
          mpMessage || "No se pudo crear la preferencia de pago.",
      },
      { status: 502 }
    );
  }
}
