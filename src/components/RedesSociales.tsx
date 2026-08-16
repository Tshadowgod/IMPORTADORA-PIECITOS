import { REDES, type RedId } from "@/lib/tienda";

/**
 * Fila de enlaces a las redes de la tienda.
 *
 * Los iconos van embebidos como SVG en vez de una fuente de iconos: son tres,
 * y así no cargamos nada extra ni dependemos de un CDN.
 */

const ICONOS: Record<RedId, () => React.ReactElement> = {
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
};

/**
 * `variante`:
 *  - "footer": círculos claros sobre el verde del pie.
 *  - "tarjeta": botones anchos con el nombre de usuario, para /contacto.
 */
export default function RedesSociales({
  variante = "footer",
}: {
  variante?: "footer" | "tarjeta";
}) {
  if (variante === "tarjeta") {
    return (
      <ul className="grid gap-3 sm:grid-cols-3">
        {REDES.map((red) => {
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
      {REDES.map((red) => {
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
