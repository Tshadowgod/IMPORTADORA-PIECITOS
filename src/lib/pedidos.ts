import "server-only";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { esEstado, type Estado } from "./pedido-estados";

/** Consultas de pedidos para el panel de administración. */

export interface LineaPedido {
  id: number;
  productName: string;
  size: number;
  quantity: number;
  unitPrice: number;
}

export interface Pedido {
  id: number;
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  estado: Estado;
  subtotal: number;
  shipping: number;
  total: number;
  /** ISO, para poder formatearlo donde haga falta. */
  createdAt: string;
  items: LineaPedido[];
}

/** Los montos vienen de `numeric`, que Drizzle entrega como string. */
function aNumero(valor: string | null): number {
  return valor === null ? 0 : Number(valor);
}

/**
 * Últimos pedidos con sus líneas.
 *
 * Son dos consultas y no un JOIN para no repetir los datos del pedido en cada
 * línea; con el volumen de una tienda de barrio la diferencia es irrelevante y
 * el agrupado queda más claro.
 */
export async function getPedidos(limite = 200): Promise<Pedido[]> {
  if (!db) return [];

  const filas = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(limite);

  if (filas.length === 0) return [];

  const lineas = await db
    .select()
    .from(orderItems)
    .where(
      inArray(
        orderItems.orderId,
        filas.map((f) => f.id),
      ),
    );

  const porPedido = new Map<number, LineaPedido[]>();
  for (const l of lineas) {
    const lista = porPedido.get(l.orderId) ?? [];
    lista.push({
      id: l.id,
      productName: l.productName,
      size: l.size,
      quantity: l.quantity,
      unitPrice: aNumero(l.unitPrice),
    });
    porPedido.set(l.orderId, lista);
  }

  return filas.map((f) => ({
    id: f.id,
    code: f.code,
    customerName: f.customerName,
    customerPhone: f.customerPhone,
    customerEmail: f.customerEmail,
    address: f.address,
    city: f.city,
    notes: f.notes,
    // Un estado desconocido en la base no debe romper el panel.
    estado: esEstado(f.status) ? f.status : "pendiente",
    subtotal: aNumero(f.subtotal),
    shipping: aNumero(f.shipping),
    total: aNumero(f.total),
    createdAt: f.createdAt.toISOString(),
    items: porPedido.get(f.id) ?? [],
  }));
}

/** Cambia el estado de un pedido. Devuelve false si ese id no existe. */
export async function cambiarEstadoPedido(id: number, estado: Estado): Promise<boolean> {
  if (!db) return false;
  const filas = await db
    .update(orders)
    .set({ status: estado })
    .where(eq(orders.id, id))
    .returning({ id: orders.id });
  return filas.length > 0;
}
