import Link from "next/link";
import { linkWhatsApp } from "@/lib/tienda";

const SECCIONES = [
  { href: "/ayuda/preguntas-frecuentes", label: "Preguntas frecuentes", emoji: "❓" },
  { href: "/ayuda/cambios", label: "Cambios", emoji: "🔄" },
  { href: "/ayuda/tallas", label: "Guía de tallas", emoji: "📏" },
  { href: "/ayuda/terminos", label: "Términos", emoji: "📄" },
];

/**
 * Marco de las páginas de ayuda (las cuatro del footer).
 *
 * La navegación entre secciones se repite en las cuatro, así que vive acá.
 * No marca la sección activa: para eso habría que volver esto un componente
 * de cliente y no vale la pena por un resaltado.
 */
export default function AyudaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <nav aria-label="Secciones de ayuda" className="flex flex-wrap gap-2">
        {SECCIONES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-full border-2 border-stone-warm-300 bg-white px-4 py-2 text-sm font-bold text-jungle-800 transition hover:bg-cream-100"
          >
            <span aria-hidden>{s.emoji}</span> {s.label}
          </Link>
        ))}
      </nav>

      {children}

      <section className="mt-10 rounded-2xl border-2 border-jungle-700/40 bg-jungle-600 p-5 text-white">
        <h2 className="font-display text-lg font-bold">¿Te quedó una duda?</h2>
        <p className="mt-1 text-sm font-semibold text-white/90">
          Escríbenos por WhatsApp y te respondemos en minutos, en horario de atención.
        </p>
        <a
          href={linkWhatsApp("¡Hola! 👋 Tengo una consulta sobre los tenis 🦖")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-3d btn-3d-press mt-4 inline-block rounded-full bg-[#25D366] px-6 py-3 font-display font-bold text-white transition hover:brightness-105"
        >
          💬 ESCRIBIR POR WHATSAPP
        </a>
      </section>
    </div>
  );
}
