import type { Metadata } from "next";
import Link from "next/link";
import { POLITICAS } from "@/lib/politicas";
import { DIRECCION_CORTA, TELEFONO, UBICACION } from "@/lib/tienda";

export const metadata: Metadata = {
  title: "Políticas de cambio",
  description: `Cambios de talla o modelo hasta ${POLITICAS.diasCambio} días después de recibir el pedido, y ${POLITICAS.diasGarantia} días de garantía por falla de fábrica.`,
};

const PASOS = [
  {
    titulo: "Escríbenos con tu código",
    texto:
      "Mándanos por WhatsApp el código del pedido (PIE-…) y una foto del par. Con eso ya sabemos qué modelo y talla te enviamos.",
  },
  {
    titulo: "Elegimos la talla o el modelo nuevo",
    texto:
      "Te decimos qué hay disponible. Si el par nuevo cuesta más, pagas la diferencia; si cuesta menos, te devolvemos la diferencia por el mismo medio con el que pagaste.",
  },
  {
    titulo: "Nos das el par anterior",
    texto: `Puedes traerlo a la tienda (${DIRECCION_CORTA}) o coordinamos el recojo junto con la entrega del par nuevo si estás en ${UBICACION.ciudad}.`,
  },
];

export default function CambiosPage() {
  return (
    <>
      <h1 className="mt-6 font-display text-3xl font-bold text-jungle-800">
        Políticas de cambio
      </h1>
      <p className="mt-2 font-semibold text-jungle-900/75">
        Los niños crecen rápido y a veces la talla no acierta. Cambiar es fácil y no
        cuesta nada extra dentro del plazo.
      </p>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-jungle-700/40 bg-jungle-600 p-5 text-white">
          <p className="font-display text-3xl font-bold">{POLITICAS.diasCambio} días</p>
          <p className="mt-1 text-sm font-bold text-white/90">
            para cambiar talla o modelo, contados desde que recibes el pedido.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-sun-500/40 bg-sun-300 p-5">
          <p className="font-display text-3xl font-bold text-jungle-900">
            {POLITICAS.diasGarantia} días
          </p>
          <p className="mt-1 text-sm font-bold text-jungle-900/80">
            de garantía por falla de fábrica: suela despegada, costura abierta, cierre
            que no funciona.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-jungle-800">
          Para que aplique el cambio
        </h2>
        <ul className="mt-3 space-y-2 font-semibold text-jungle-900/80">
          <li className="flex gap-2">
            <span aria-hidden>✅</span> El par tiene que estar sin usar: se puede probar
            en casa, pero no llevar puesto en la calle.
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span> Con su caja y sus etiquetas, en las mismas
            condiciones en que lo recibiste.
          </li>
          <li className="flex gap-2">
            <span aria-hidden>✅</span> Con el código del pedido o el comprobante de
            pago.
          </li>
          <li className="flex gap-2">
            <span aria-hidden>❌</span> No se cambian pares ya usados ni con desgaste de
            uso normal (suela gastada, manchas, raspones).
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-jungle-800">
          Cómo hacer el cambio
        </h2>
        <ol className="mt-3 space-y-3">
          {PASOS.map((paso, i) => (
            <li
              key={paso.titulo}
              className="flex gap-3 rounded-2xl border-2 border-stone-warm-300 bg-white p-4"
            >
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-jungle-600 font-display font-bold text-white"
              >
                {i + 1}
              </span>
              <div>
                <p className="font-display font-bold text-jungle-800">{paso.titulo}</p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-jungle-900/80">
                  {paso.texto}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-jungle-800">
          Devolución del dinero
        </h2>
        <p className="mt-2 font-semibold leading-relaxed text-jungle-900/80">
          Nuestra política es el cambio, no la devolución: si la talla no acierta, te
          damos otra talla u otro modelo. Devolvemos el dinero solo si el par llegó con
          una falla de fábrica y no tenemos repuesto en tu talla. En ese caso se devuelve
          el monto completo, envío incluido, por el mismo medio con el que pagaste.
        </p>
        <p className="mt-3 font-semibold leading-relaxed text-jungle-900/80">
          Los pares en oferta también se cambian por talla, con las mismas condiciones.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border-2 border-stone-warm-300 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-jungle-800">
          Antes de comprar, mide
        </h2>
        <p className="mt-1 text-sm font-semibold text-jungle-900/80">
          La mayoría de los cambios se evitan midiendo el pie una vez. Toma dos minutos.
        </p>
        <Link
          href="/ayuda/tallas"
          className="mt-3 inline-block font-display font-bold text-lava-500 underline decoration-2 underline-offset-2 hover:text-lava-600"
        >
          Ver la guía de tallas →
        </Link>
      </section>

      <p className="mt-6 text-sm font-semibold text-jungle-900/60">
        Para cualquier cambio, escríbenos al {TELEFONO} o pásate por la tienda:{" "}
        {UBICACION.nombre}, {DIRECCION_CORTA}.
      </p>
    </>
  );
}
