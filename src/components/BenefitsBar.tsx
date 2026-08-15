import { ENVIO_GRATIS_DESDE } from "@/lib/format";

const BENEFICIOS = [
  {
    icon: "🚚",
    titulo: "Envío gratis",
    texto: `En compras mayores a Bs. ${ENVIO_GRATIS_DESDE}`,
  },
  {
    icon: "🛡️",
    titulo: "Calidad garantizada",
    texto: "Materiales resistentes y seguros.",
  },
  {
    icon: "🔄",
    titulo: "Cambios fáciles",
    texto: "Tienes 7 días para cambiar tu pedido.",
  },
  {
    icon: "🔒",
    titulo: "Pagos seguros",
    texto: "Compra con total confianza.",
  },
];

export default function BenefitsBar() {
  return (
    <section aria-label="Beneficios de comprar en Piecitos" className="px-4 pb-4 sm:px-6">
      <ul className="mx-auto grid max-w-[1400px] gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFICIOS.map((b) => (
          <li
            key={b.titulo}
            className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 shadow-[0_6px_18px_rgba(90,74,48,0.06)] ring-1 ring-stone-warm-200/70"
          >
            <span
              aria-hidden
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-jungle-50 text-xl ring-1 ring-jungle-200"
            >
              {b.icon}
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-jungle-800">{b.titulo}</h3>
              <p className="mt-0.5 text-sm font-semibold text-jungle-900/65">{b.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
