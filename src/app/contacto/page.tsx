import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp o llámanos. Importadora Piecitos, Bolivia.",
};

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
          href="tel:+5917000000"
          className="btn-3d btn-3d-press flex items-center gap-3 rounded-2xl border-2 border-stone-warm-300 bg-white p-5 transition hover:brightness-105"
        >
          <span aria-hidden className="text-3xl">
            📞
          </span>
          <span>
            <span className="block font-display text-lg font-bold text-jungle-800">
              Llámanos
            </span>
            <span className="text-sm font-semibold text-jungle-900/70">+591 7XX XXX XX</span>
          </span>
        </a>
      </div>

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
