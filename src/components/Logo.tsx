import Link from "next/link";
import Image from "next/image";

/**
 * Marca "IMPORTADORA PIECITOS · CALZADOS INFANTILES".
 *
 * El archivo de `public/brand/logo.webp` es el logo oficial ya recortado
 * (fondo transparente), así que se apoya sobre cualquier fondo del sitio.
 * Las proporciones son las del original: 1222 × 754.
 */

const ANCHO = 1222;
const ALTO = 754;

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center"
      aria-label="Importadora Piecitos, calzados infantiles — ir al inicio"
    >
      <Image
        src="/brand/logo.webp"
        alt="Importadora Piecitos · Calzados infantiles"
        width={ANCHO}
        height={ALTO}
        // El logo es lo primero que se ve: sin `priority` Next lo carga tarde
        // y la cabecera salta.
        priority
        sizes={compact ? "140px" : "200px"}
        className={`w-auto transition-transform group-hover:scale-[1.03] ${
          compact ? "h-11" : "h-[3.35rem] sm:h-16"
        }`}
      />
    </Link>
  );
}
