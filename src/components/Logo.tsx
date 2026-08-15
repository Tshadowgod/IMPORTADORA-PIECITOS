import Link from "next/link";
import Image from "next/image";

/**
 * Marca "IMPORTADORA PIECITOS · CALZADOS INFANTILES".
 *
 * Está construida con tipografía y color en lugar de una imagen para que se
 * mantenga nítida en cualquier pantalla. Cuando exista el logo definitivo,
 * basta con reemplazar el bloque interno por un <Image>.
 */

const LETRAS: [string, string][] = [
  ["P", "#2f7fd0"],
  ["I", "#4e9c37"],
  ["E", "#e2571e"],
  ["C", "#f0c11c"],
  ["I", "#2f7fd0"],
  ["T", "#4e9c37"],
  ["O", "#e2571e"],
  ["S", "#d93a5e"],
];

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex shrink-0 flex-col items-center leading-none"
      aria-label="Importadora Piecitos — ir al inicio"
    >
      {/* Huellas de dino sobre el nombre */}
      <span aria-hidden className="relative mb-0.5 block h-7 w-10">
        <Image
          src="/brand/mascot-rex.webp"
          alt=""
          fill
          sizes="40px"
          className="object-contain object-bottom mix-blend-multiply"
        />
      </span>

      <span
        className={`font-display font-semibold tracking-[0.18em] text-jungle-800 ${
          compact ? "text-[0.5rem]" : "text-[0.6rem] sm:text-xs"
        }`}
      >
        IMPORTADORA
      </span>

      <span
        className={`font-display font-bold tracking-tight transition-transform group-hover:scale-105 ${
          compact ? "text-2xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {LETRAS.map(([letra, color], i) => (
          <span
            key={`${letra}-${i}`}
            style={{
              color,
              WebkitTextStroke: "2px #ffffff",
              paintOrder: "stroke fill",
              textShadow: "0 2px 0 rgba(0,0,0,0.18)",
            }}
          >
            {letra}
          </span>
        ))}
      </span>

      <span
        className={`font-display font-semibold tracking-[0.2em] text-jungle-700 ${
          compact ? "text-[0.45rem]" : "text-[0.55rem] sm:text-[0.65rem]"
        }`}
      >
        CALZADOS INFANTILES
      </span>
    </Link>
  );
}
