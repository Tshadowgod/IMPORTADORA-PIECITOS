/**
 * Estados por los que pasa un pedido, compartidos por el panel (cliente),
 * la API que los cambia (servidor) y la columna `orders.status`.
 *
 * Este archivo no importa nada del servidor a propósito: lo usa también un
 * componente `"use client"`.
 */

export const ESTADOS = [
  "pendiente",
  "confirmado",
  "enviado",
  "entregado",
  "cancelado",
] as const;

export type Estado = (typeof ESTADOS)[number];

export function esEstado(valor: unknown): valor is Estado {
  return typeof valor === "string" && (ESTADOS as readonly string[]).includes(valor);
}

/** Etiqueta y color de cada estado, para las pastillas del panel. */
export const ESTILO_ESTADO: Record<Estado, { etiqueta: string; clase: string; emoji: string }> = {
  pendiente: {
    etiqueta: "Pendiente",
    emoji: "🕒",
    clase: "bg-sun-300 text-jungle-900",
  },
  confirmado: {
    etiqueta: "Confirmado",
    emoji: "✅",
    clase: "bg-jungle-600 text-white",
  },
  enviado: {
    etiqueta: "Enviado",
    emoji: "🚚",
    clase: "bg-jungle-800 text-white",
  },
  entregado: {
    etiqueta: "Entregado",
    emoji: "🎉",
    clase: "bg-stone-warm-300 text-jungle-900",
  },
  cancelado: {
    etiqueta: "Cancelado",
    emoji: "✖️",
    clase: "bg-lava-500 text-white",
  },
};

/**
 * Convierte el teléfono que escribió el cliente en un número para wa.me.
 *
 * Los clientes escriben "70012345", "+591 700-12345" o "591 70012345"; wa.me
 * necesita solo dígitos con código de país. Los números bolivianos de celular
 * tienen 8 dígitos, así que a esos se les agrega el 591.
 */
export function whatsappCliente(telefono: string): string | null {
  const digitos = telefono.replace(/\D/g, "");
  if (digitos.length === 8) return `591${digitos}`;
  if (digitos.length >= 10 && digitos.length <= 15) return digitos;
  return null;
}
