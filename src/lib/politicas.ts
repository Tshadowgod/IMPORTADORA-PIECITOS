/**
 * Condiciones de venta: los números que aparecen en las páginas de ayuda.
 *
 * Están todos acá para poder cambiarlos en un solo lugar cuando la tienda
 * ajuste una condición, sin tener que buscar el dato repartido en el texto.
 * Las reglas de envío viven en `format.ts`, junto al cálculo.
 */

export const POLITICAS = {
  /** Días desde la entrega para pedir un cambio de talla o modelo. */
  diasCambio: 7,
  /** Días de garantía por falla de fábrica (pegado, suela, cierre). */
  diasGarantia: 30,
  /** Plazo de entrega dentro de Santa Cruz. */
  entregaLocal: "24 a 48 horas",
  /** Plazo de entrega al interior del país. */
  entregaInterior: "2 a 4 días hábiles",
  /** Pares mínimos para precio por mayor. */
  mayoristaDesde: 6,
} as const;

/** Última revisión de los términos, para mostrarla al pie de esa página. */
export const ACTUALIZACION_TERMINOS = "17 de agosto de 2026";
