import { formatBs } from "./format";

/**
 * Arma el mensaje de WhatsApp que el cliente le manda a la tienda al
 * confirmar el pedido.
 *
 * WhatsApp entiende `*texto*` como negrita, así que el resumen llega ya
 * formateado. Los emojis van al inicio de cada línea para que el pedido se
 * lea de un vistazo en el celular, sin tener que leer todo el bloque.
 */

export type LineaPedido = {
  productName: string;
  size: number;
  quantity: number;
  unitPrice: number;
};

export type DatosPedido = {
  code: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  notas: string;
  items: LineaPedido[];
  subtotal: number;
  shipping: number;
  total: number;
};

export function mensajePedidoWhatsApp(p: DatosPedido): string {
  const lineas = [
    "🦖 *NUEVO PEDIDO — IMPORTADORA PIECITOS*",
    `🧾 Código: *${p.code}*`,
    "",
    "👤 *Mis datos*",
    `🙋 Nombre: ${p.nombre}`,
    `📱 Teléfono: ${p.telefono}`,
  ];

  if (p.ciudad.trim()) lineas.push(`🏙️ Ciudad: ${p.ciudad.trim()}`);
  if (p.notas.trim()) lineas.push(`📝 Notas: ${p.notas.trim()}`);

  lineas.push("", "🛒 *Mi pedido*");
  for (const item of p.items) {
    lineas.push(
      `👟 ${item.quantity}× ${item.productName} — talla ${item.size} — ${formatBs(
        item.unitPrice * item.quantity,
      )}`,
    );
  }

  lineas.push(
    "",
    `🧮 Subtotal: ${formatBs(p.subtotal)}`,
    `🚚 Envío: ${p.shipping === 0 ? "¡Gratis! 🎉" : formatBs(p.shipping)}`,
    `💰 *TOTAL: ${formatBs(p.total)}*`,
    "",
    "✅ ¡Quiero confirmar este pedido, por favor! 🐾",
  );

  return lineas.join("\n");
}
