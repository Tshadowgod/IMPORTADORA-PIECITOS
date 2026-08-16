import RedesSociales from "./RedesSociales";

/**
 * Franja de redes sociales entre el carrusel y las categorías.
 *
 * Va en el respiro que queda debajo del hero: es lo primero que se ve al
 * bajar, y ahí es donde tiene sentido pedir el seguimiento, antes de que el
 * visitante se meta en el catálogo.
 */

export default function RedesBanda() {
  return (
    <section
      aria-label="Redes sociales de la tienda"
      className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6"
    >
      <div className="flex flex-col items-center gap-3 border-b border-stone-warm-200 pb-8 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-lava-500">
            Síguenos
          </p>
          {/* El emoji va al principio: al final se quedaba solo en su propia
              línea cuando el texto se parte en el celular. */}
          <p className="text-balance font-display text-lg font-bold text-jungle-800 sm:text-xl">
            🦖 Modelos nuevos y ofertas, primero por acá
          </p>
        </div>
        <RedesSociales variante="banda" />
      </div>
    </section>
  );
}
