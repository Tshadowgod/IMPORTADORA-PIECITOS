import type { Metadata } from "next";
import Image from "next/image";
import RedesSociales from "@/components/RedesSociales";
import { COMO_LLEGAR, DIRECCION_CORTA, TELEFONO, UBICACION } from "@/lib/tienda";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Escríbenos por WhatsApp, síguenos en redes o visítanos en ${DIRECCION_CORTA}.`,
};

/** Mapa incrustado sin API key: el parámetro `output=embed` es público. */
const MAPA_EMBED = `https://www.google.com/maps?q=${UBICACION.lat},${UBICACION.lng}&hl=es&z=17&output=embed`;

const HORARIOS = [
  ["Lunes a viernes", "09:00 – 19:00"],
  ["Sábados", "09:00 – 14:00"],
  ["Domingos", "Cerrado"],
];

export default function ContactoPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "59170000000";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="relative mb-8 overflow-hidden rounded-3xl border-2 border-jungle-800/30">
        <div className="relative h-40 sm:h-52">
          <Image
            src="/brand/jungle-hero.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover object-[center_40%]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-jungle-900/70 to-jungle-900/10" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h1 className="font-display text-3xl font-bold text-white">CONTÁCTANOS</h1>
          <p className="mt-1 font-semibold text-white/90">
            ¿Dudas con las tallas, un cambio o una compra al por mayor? Estamos para ayudarte.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-3d btn-3d-press flex items-center gap-3 rounded-2xl border-2 border-jungle-700/40 bg-jungle-600 p-5 text-white transition hover:brightness-110"
        >
          <span aria-hidden className="text-3xl">
            💬
          </span>
          <span>
            <span className="block font-display text-lg font-bold">WhatsApp</span>
            <span className="text-sm font-semibold text-white/85">Respuesta en minutos</span>
          </span>
        </a>

        <a
          href={`tel:${TELEFONO.replace(/\s/g, "")}`}
          className="btn-3d btn-3d-press flex items-center gap-3 rounded-2xl border-2 border-stone-warm-300 bg-white p-5 transition hover:brightness-105"
        >
          <span aria-hidden className="text-3xl">
            📞
          </span>
          <span>
            <span className="block font-display text-lg font-bold text-jungle-800">
              Llámanos
            </span>
            <span className="text-sm font-semibold text-jungle-900/70">{TELEFONO}</span>
          </span>
        </a>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-jungle-800">Síguenos en redes</h2>
        <p className="mt-1 text-sm font-semibold text-jungle-900/70">
          Ahí publicamos los modelos nuevos y las ofertas antes que en ningún lado.
        </p>
        <div className="mt-4">
          <RedesSociales variante="tarjeta" />
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border-2 border-stone-warm-300 bg-white">
        <div className="p-5">
          <h2 className="font-display text-lg font-bold text-jungle-800">Visítanos</h2>
          <p className="mt-1 font-bold text-jungle-900">{UBICACION.nombre}</p>
          <p className="text-sm font-semibold text-jungle-900/70">{DIRECCION_CORTA}</p>
          <a
            href={COMO_LLEGAR}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-3d-press mt-4 inline-flex items-center gap-2 rounded-full bg-jungle-600 px-5 py-2.5 font-display font-bold text-white transition hover:brightness-110"
          >
            <span aria-hidden>📍</span> Cómo llegar
          </a>
        </div>
        <iframe
          src={MAPA_EMBED}
          title={`Mapa de ${UBICACION.nombre}`}
          // `lazy` para que el mapa no compita con el resto de la página.
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-72 w-full border-0 border-t-2 border-stone-warm-300"
        />
      </section>

      <section className="mt-8 rounded-2xl border-2 border-stone-warm-300 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-jungle-800">Horarios de atención</h2>
        <dl className="mt-3 divide-y divide-stone-warm-200">
          {HORARIOS.map(([dia, horas]) => (
            <div key={dia} className="flex justify-between py-2 text-sm font-semibold">
              <dt className="text-jungle-900/80">{dia}</dt>
              <dd className="text-jungle-900">{horas}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
