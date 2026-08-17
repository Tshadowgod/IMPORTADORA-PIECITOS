import Image from "next/image";
import Link from "next/link";
import TiendaShell from "@/components/TiendaShell";

/**
 * 404 global. Vive en la raíz (Next la usa para cualquier URL que no exista),
 * así que se envuelve a mano en el armazón de la tienda: el layout de
 * `(tienda)` no llega hasta acá.
 */
export default function NotFound() {
  return (
    <TiendaShell>
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <span className="relative mx-auto block h-36 w-36">
          <Image
            src="/brand/mascot-rex.webp"
            alt=""
            fill
            sizes="144px"
            className="object-contain mix-blend-multiply"
          />
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold text-jungle-800">
          404 — Fósil no encontrado
        </h1>
        <p className="mt-2 font-semibold text-jungle-900/75">
          Esta página se extinguió hace millones de años.
        </p>
        <Link
          href="/"
          className="btn-3d btn-3d-press mt-6 inline-block rounded-full bg-jungle-600 px-7 py-3 font-display font-bold text-white"
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </TiendaShell>
  );
}
