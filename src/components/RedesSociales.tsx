import { linkWhatsApp, REDES, type RedId } from "@/lib/tienda";

/**
 * Fila de enlaces a los canales de la tienda.
 *
 * Los iconos van embebidos como SVG en vez de una fuente de iconos: son cuatro,
 * y así no cargamos nada extra ni dependemos de un CDN.
 */

type CanalId = RedId | "whatsapp";

/**
 * WhatsApp no está en `REDES` a propósito: esa lista alimenta el `sameAs` del
 * JSON-LD, que espera perfiles de redes sociales, no un enlace de chat. Acá se
 * suma como un canal más cuando quien usa el componente lo pide.
 *
 * En la píldora va el nombre de la tienda y no el número: así la fila se lee
 * pareja con las otras tres y el número igual queda a un toque, en el enlace.
 */
const CANAL_WHATSAPP = {
  id: "whatsapp" as const,
  nombre: "WhatsApp",
  usuario: "imp_piecitos",
  href: linkWhatsApp("¡Hola! 👋 Quiero información sobre los tenis 🦖"),
};

const ICONOS: Record<CanalId, () => React.ReactElement> = {
  instagram: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 2h-3v13.2a2.6 2.6 0 1 1-2.1-2.55v-3.05a5.65 5.65 0 1 0 5.1 5.62V9.06A6.6 6.6 0 0 0 20.5 10.4V7.35A3.9 3.9 0 0 1 16.5 3.5z" />
    </svg>
  ),
  facebook: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.63A22 22 0 0 0 14.28 3.5c-2.4 0-4.03 1.46-4.03 4.15V9.9H7.5V13h2.75v8z" />
    </svg>
  ),
  whatsapp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {/* Globo de chat con la cola, y dentro el auricular del logo. */}
      <path d="M12 2.6a9.4 9.4 0 0 0-8 14.32L2.7 21.4l4.6-1.24A9.4 9.4 0 1 0 12 2.6m0 1.9a7.5 7.5 0 0 1 0 15 7.4 7.4 0 0 1-3.8-1.04l-.35-.2-2.2.6.6-2.14-.2-.36A7.5 7.5 0 0 1 12 4.5" />
      <path d="M9.3 7.9c-.2-.45-.4-.4-.6-.4h-.5c-.2 0-.5.07-.75.35-.26.28-.97.95-.97 2.3 0 1.37.99 2.68 1.13 2.87.14.19 1.94 3.2 4.84 4.34 2.4.95 2.89.76 3.42.71.53-.05 1.69-.67 1.93-1.35.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.54-.33-.28-.14-1.67-.83-1.93-.92-.26-.09-.45-.14-.64.14-.19.28-.72.91-.89 1.1-.16.19-.32.21-.6.07-.28-.14-1.16-.44-2.2-1.41-.81-.76-1.36-1.7-1.52-1.98-.16-.28-.02-.43.12-.57l.42-.49c.14-.17.19-.29.28-.48.1-.19.05-.36-.02-.5-.07-.15-.6-1.57-.84-2.15" />
    </svg>
  ),
};

/**
 * Color de cada red, para cuando el icono se muestra a todo color y no en el
 * verde de la marca. Instagram no tiene un color plano: lleva su degradado.
 */
const COLORES: Record<CanalId, string> = {
  instagram: "bg-[linear-gradient(45deg,#f9ce34,#ee2a7b_45%,#6228d7)]",
  tiktok: "bg-[#010101]",
  facebook: "bg-[#1877f2]",
  whatsapp: "bg-[#25D366]",
};

/**
 * `variante`:
 *  - "footer": círculos claros sobre el verde del pie.
 *  - "tarjeta": botones anchos con el nombre de usuario, para /contacto.
 *  - "banda": fila de píldoras a color, para la franja del inicio.
 *
 * `conWhatsApp` agrega WhatsApp al principio de la fila. Va primero porque es
 * el canal por el que se cierra la venta, no uno más para seguir.
 */
export default function RedesSociales({
  variante = "footer",
  conWhatsApp = false,
}: {
  variante?: "footer" | "tarjeta" | "banda";
  conWhatsApp?: boolean;
}) {
  const canales = conWhatsApp ? [CANAL_WHATSAPP, ...REDES] : [...REDES];

  if (variante === "banda") {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {canales.map((red) => {
          const Icono = ICONOS[red.id];
          return (
            <li key={red.id}>
              <a
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-full bg-white py-2 pl-2 pr-4 shadow-[0_8px_24px_rgba(90,74,48,0.08)] ring-1 ring-stone-warm-200/70 transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(90,74,48,0.14)] hover:ring-jungle-400/40"
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white ${COLORES[red.id]}`}
                >
                  <Icono />
                </span>
                <span className="text-sm font-bold text-jungle-800">{red.usuario}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  if (variante === "tarjeta") {
    return (
      <ul className="grid gap-3 sm:grid-cols-3">
        {canales.map((red) => {
          const Icono = ICONOS[red.id];
          return (
            <li key={red.id}>
              <a
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-3d-press flex items-center gap-3 rounded-2xl border-2 border-stone-warm-300 bg-white p-4 transition hover:brightness-105"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-jungle-600 text-white">
                  <Icono />
                </span>
                <span className="min-w-0">
                  <span className="block font-display font-bold text-jungle-800">
                    {red.nombre}
                  </span>
                  <span className="block truncate text-sm font-semibold text-jungle-900/70">
                    {red.usuario}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {canales.map((red) => {
        const Icono = ICONOS[red.id];
        return (
          <li key={red.id}>
            <a
              href={red.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${red.nombre} — ${red.usuario}`}
              title={`${red.nombre} ${red.usuario}`}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/12 text-white transition hover:bg-sun-300 hover:text-jungle-800"
            >
              <Icono />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
