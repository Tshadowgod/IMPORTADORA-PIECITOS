import Image from "next/image";

/**
 * Selva ilustrada detrás del hero.
 *
 * El velo oscuro cambia según el ancho porque el hero también cambia:
 *  - En escritorio el texto va en la columna izquierda, así que el degradado
 *    es horizontal y deja limpia la mitad derecha, donde va el tenis.
 *  - En celular el texto ocupa todo el ancho y ese degradado lo dejaba sobre
 *    la parte clara de la ilustración, casi ilegible. Ahí el velo es vertical
 *    y parejo.
 */
export default function JungleBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`overflow-hidden ${className}`}>
      <Image
        src="/brand/jungle-hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-ken-burns object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 bg-jungle-900/45 lg:hidden" />
      <div className="absolute inset-0 bg-linear-to-b from-jungle-900/75 via-jungle-900/35 to-jungle-900/10 lg:hidden" />
      <div className="absolute inset-0 hidden bg-linear-to-r from-jungle-900/80 via-jungle-800/35 to-transparent lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-cream-100 to-transparent" />
    </div>
  );
}
