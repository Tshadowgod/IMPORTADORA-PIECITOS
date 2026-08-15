import { ENVIO_GRATIS_DESDE } from "@/lib/format";

const BENEFICIOS = [
  {
    icon: "🐾",
    titulo: ["ENVÍO GRATIS"],
    texto: "En compras mayores a",
    destacado: `Bs. ${ENVIO_GRATIS_DESDE}`,
  },
  {
    icon: "🛡️",
    titulo: ["CALIDAD", "GARANTIZADA"],
    texto: "Materiales resistentes y seguros para cada aventura.",
  },
  {
    icon: "🔄",
    titulo: ["CAMBIOS", "FÁCILES"],
    texto: "Tienes 7 días para cambiar tu pedido.",
  },
  {
    icon: "🔒",
    titulo: ["PAGOS", "SEGUROS"],
    texto: "Compra con total confianza.",
  },
];

export default function BenefitsBar() {
  return (
    <section aria-label="Beneficios de comprar en Piecitos" className="px-4 py-6 sm:px-6">
      <ul className="jungle-bar mx-auto grid max-w-[1400px] gap-5 rounded-3xl border-2 border-jungle-800/40 px-5 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {BENEFICIOS.map((b) => (
          <li key={b.titulo.join(" ")} className="flex items-start gap-3">
            <span
              aria-hidden
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20 text-2xl ring-2 ring-white/30 shadow-[inset_0_2px_0_rgba(255,255,255,0.25)]"
            >
              {b.icon}
            </span>
            <div>
              <h3 className="font-display text-base font-bold leading-tight text-sun-300 sm:text-lg">
                {b.titulo.map((t) => (
                  <span key={t} className="block">
                    {t}
                  </span>
                ))}
              </h3>
              <p className="mt-0.5 text-sm font-semibold text-white/90">
                {b.texto}
                {b.destacado && (
                  <span className="ml-1 font-display text-lg font-bold text-white">
                    {b.destacado}
                  </span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
