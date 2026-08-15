import Link from "next/link";
import Image from "next/image";

const ATENCION = [
  { label: "Preguntas frecuentes", href: "/ayuda/preguntas-frecuentes" },
  { label: "Políticas de cambio", href: "/ayuda/cambios" },
  { label: "Términos y condiciones", href: "/ayuda/terminos" },
  { label: "Guía de tallas", href: "/ayuda/tallas" },
];

/** `corto` es lo que se ve en la etiqueta; `label` va al title y al lector de pantalla. */
const PAGOS = [
  { label: "Visa", corto: "VISA", icon: "💳" },
  { label: "Mastercard", corto: "MC", icon: "💳" },
  { label: "QR simple", corto: "QR", icon: "🔲" },
  { label: "Transferencia bancaria", corto: "BANCO", icon: "🏦" },
];

const TELEFONO = "+591 7XX XXX XX";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "59170000000";

  return (
    <footer className="dirt-band relative mt-8 border-t-4 border-stone-warm-500/70 pt-10">
      {/* Huellas decorativas sobre la tierra */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-2 flex justify-around opacity-25">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="text-2xl">
            🐾
          </span>
        ))}
      </div>

      <div className="relative mx-auto grid max-w-[1400px] gap-8 px-6 pb-8 sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <h2 className="font-display text-sm font-bold tracking-wide text-jungle-900">
            ATENCIÓN AL CLIENTE
          </h2>
          <ul className="mt-3 space-y-1.5">
            {ATENCION.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-semibold text-jungle-900/85 underline-offset-4 hover:text-white hover:underline"
                >
                  • {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-sm font-bold tracking-wide text-jungle-900">
            CONTÁCTANOS
          </h2>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-jungle-900/85">
            <li className="flex items-center gap-2">
              <span aria-hidden>📞</span>
              <a href={`tel:${TELEFONO.replace(/\s/g, "")}`} className="hover:text-white">
                {TELEFONO}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>💬</span>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp {TELEFONO}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>📍</span>
              Santa Cruz de la Sierra, Bolivia
            </li>
          </ul>
        </section>

        <section className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-10 right-4 hidden h-24 w-24 lg:block"
          >
            <Image
              src="/brand/mascot-rex.webp"
              alt=""
              fill
              sizes="96px"
              className="object-contain mix-blend-multiply"
            />
          </span>
          <h2 className="font-display text-sm font-bold tracking-wide text-jungle-900">
            LA TIENDA
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm font-semibold text-jungle-900/85">
            <li>
              <Link href="/productos" className="hover:text-white">
                • Catálogo completo
              </Link>
            </li>
            <li>
              <Link href="/productos?categoria=ofertas" className="hover:text-white">
                • Ofertas imperdibles
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-white">
                • Ventas al por mayor
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-sm font-bold tracking-wide text-jungle-900">
            MEDIOS DE PAGO
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {PAGOS.map((p) => (
              <li
                key={p.label}
                title={p.label}
                className="flex h-10 min-w-14 items-center justify-center gap-1 rounded-md border border-stone-warm-500/40 bg-white px-2 text-xs font-bold text-jungle-900"
              >
                <span aria-hidden>{p.icon}</span>
                <span className="sr-only">{p.label}</span>
                <span aria-hidden>{p.corto}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-stone-warm-500/50 bg-stone-warm-500/40 py-3">
        <p className="mx-auto max-w-[1400px] px-6 text-center text-xs font-semibold text-jungle-900/80">
          © {new Date().getFullYear()} Importadora Piecitos — Calzados infantiles. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}
