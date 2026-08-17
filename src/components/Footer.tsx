import Link from "next/link";
import Logo from "./Logo";
import RedesSociales from "./RedesSociales";
import {
  COMO_LLEGAR,
  DIRECCION_CORTA,
  linkWhatsApp,
  MAPA_EMBED,
  TELEFONO,
  UBICACION,
} from "@/lib/tienda";

const ATENCION = [
  { label: "Preguntas frecuentes", href: "/ayuda/preguntas-frecuentes" },
  { label: "Políticas de cambio", href: "/ayuda/cambios" },
  { label: "Términos y condiciones", href: "/ayuda/terminos" },
  { label: "Guía de tallas", href: "/ayuda/tallas" },
];

const PAGOS = ["Visa", "Mastercard", "QR", "Banco"];

export default function Footer() {
  return (
    <footer className="mt-10 bg-jungle-700 text-white">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <Logo compact />
          <p className="mt-4 max-w-xs text-sm font-semibold leading-relaxed text-white/85">
            Tenis de dinosaurio para pequeños exploradores. Hechos para jugar, correr y dejar
            huella.
          </p>
          <h2 className="mt-6 font-display text-sm font-bold tracking-wide text-sun-300">
            Síguenos
          </h2>
          <div className="mt-3">
            <RedesSociales />
          </div>
        </section>

        <section>
          <h2 className="font-display text-sm font-bold tracking-wide text-sun-300">
            Atención al cliente
          </h2>
          <ul className="mt-3 space-y-2">
            {ATENCION.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-semibold text-white/90 transition hover:text-sun-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-sm font-bold tracking-wide text-sun-300">
            Contáctanos
          </h2>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-white/90">
            <li>
              <a href={`tel:${TELEFONO.replace(/\s/g, "")}`} className="hover:text-sun-300">
                {TELEFONO}
              </a>
            </li>
            <li>
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sun-300"
              >
                WhatsApp {TELEFONO}
              </a>
            </li>
            <li>
              <span className="block">{UBICACION.nombre}</span>
              <span className="block text-white/75">{DIRECCION_CORTA}</span>
            </li>
          </ul>
        </section>

        {/* El mapa se carga en diferido: está al final de cada página y no
            tiene por qué competir con el catálogo.

            En escritorio se sale de la columna y cierra el pie como una franja
            ancha (`order-last` lo manda a la última fila sin mover el orden en
            el celular, donde va pegado a la dirección). Dentro de la columna
            quedaba angosto y alto, y dejaba al resto del pie con un hueco de
            aire debajo. Ahí el botón pasa a ser una píldora sobre el mapa, en la
            esquina superior: abajo están el logo de Google y la atribución, que
            no se pueden tapar. */}
        <div className="-mt-6 overflow-hidden rounded-2xl ring-2 ring-white/20 sm:mt-0 lg:relative lg:order-last lg:col-span-4">
          <iframe
            src={MAPA_EMBED}
            title={`Mapa de ${UBICACION.nombre}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-40 w-full border-0 lg:h-56"
          />
          <a
            href={COMO_LLEGAR}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-sun-400 py-3 font-display text-sm font-bold text-jungle-900 transition hover:bg-sun-300 lg:absolute lg:right-4 lg:top-4 lg:rounded-full lg:px-5 lg:py-2.5 lg:shadow-lg"
          >
            <span aria-hidden>📍</span> CÓMO LLEGAR
          </a>
        </div>

        <section>
          <h2 className="font-display text-sm font-bold tracking-wide text-sun-300">
            Medios de pago
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {PAGOS.map((p) => (
              <li
                key={p}
                className="rounded-md bg-white px-2.5 py-1.5 text-xs font-bold text-jungle-800"
              >
                {p}
              </li>
            ))}
          </ul>
          <h2 className="mt-6 font-display text-sm font-bold tracking-wide text-sun-300">
            La tienda
          </h2>
          <ul className="mt-3 space-y-2 text-sm font-semibold">
            <li>
              <Link href="/productos" className="hover:text-sun-300">
                Catálogo completo
              </Link>
            </li>
            <li>
              <Link href="/productos?categoria=ofertas" className="hover:text-sun-300">
                Ofertas
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-sun-300">
                Ventas al por mayor
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <div className="bg-jungle-800 py-4">
        <p className="mx-auto max-w-[1400px] px-6 text-center text-xs font-semibold text-white/70">
          © {new Date().getFullYear()} Importadora Piecitos — Calzados infantiles. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}
