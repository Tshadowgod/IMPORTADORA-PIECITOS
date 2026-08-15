import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { getProductsByIds } from "@/lib/data";
import { calcularEnvio } from "@/lib/format";

export const dynamic = "force-dynamic";

const orderSchema = z.object({
  customerName: z.string().min(3, "Ingresa el nombre completo"),
  customerPhone: z.string().min(7, "Ingresa un teléfono válido"),
  customerEmail: z.string().email("Correo inválido").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        size: z.number().int().positive(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "El carrito está vacío"),
});

/**
 * POST /api/orders — crea un pedido.
 *
 * Los precios NUNCA se toman del cliente: se releen de la base a partir del
 * productId, así el total no se puede manipular desde el navegador.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos incompletos", detalles: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const payload = parsed.data;

  const ids = [...new Set(payload.items.map((i) => i.productId))];
  const catalog = await getProductsByIds(ids);
  const byId = new Map(catalog.map((p) => [p.id, p]));

  const faltantes = ids.filter((id) => !byId.has(id));
  if (faltantes.length) {
    return NextResponse.json(
      { error: `Estos productos ya no están disponibles: ${faltantes.join(", ")}` },
      { status: 400 },
    );
  }

  const lines = payload.items.map((item) => {
    const product = byId.get(item.productId)!;
    return {
      productId: product.id,
      productName: product.name,
      size: item.size,
      quantity: item.quantity,
      unitPrice: product.price,
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const shipping = calcularEnvio(subtotal);
  const total = subtotal + shipping;
  const code = `PIE-${Date.now().toString(36).toUpperCase()}`;

  // Sin base de datos configurada devolvemos el resumen calculado, para que el
  // checkout se pueda probar en local antes de conectar Neon.
  if (!db) {
    return NextResponse.json(
      { code, subtotal, shipping, total, items: lines, persisted: false },
      { status: 201 },
    );
  }

  try {
    const [order] = await db
      .insert(orders)
      .values({
        code,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerEmail: payload.customerEmail || null,
        address: payload.address ?? null,
        city: payload.city ?? null,
        notes: payload.notes ?? null,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
      })
      .returning();

    await db.insert(orderItems).values(
      lines.map((l) => ({
        orderId: order.id,
        productId: l.productId,
        productName: l.productName,
        size: l.size,
        quantity: l.quantity,
        unitPrice: l.unitPrice.toFixed(2),
      })),
    );

    return NextResponse.json(
      { code: order.code, subtotal, shipping, total, items: lines, persisted: true },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/orders]", error);
    return NextResponse.json({ error: "No se pudo registrar el pedido" }, { status: 500 });
  }
}
