/** Formatea un monto en bolivianos: 190 → "Bs. 190" · 189.5 → "Bs. 189,50" */
export function formatBs(amount: number): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return `Bs. ${amount.toLocaleString("es-BO", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Envío gratis a partir de este monto (ver banner de beneficios). */
export const ENVIO_GRATIS_DESDE = 150;
export const COSTO_ENVIO = 15;

export function calcularEnvio(subtotal: number): number {
  return subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
}
