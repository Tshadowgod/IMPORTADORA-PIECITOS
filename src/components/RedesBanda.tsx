import RedesSociales from "./RedesSociales";

/**
 * Franja de contacto y redes entre el carrusel y las categorías.
 *
 * Va en el respiro que queda debajo del hero: es lo primero que se ve al
 * bajar, y ahí es donde tiene sentido pedir el seguimiento y dejar el WhatsApp
 * a mano, antes de que el visitante se meta en el catálogo.
 */

export default function RedesBanda() {
  return (
    <section
      aria-label="Contacto y redes de la tienda"
      className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6"
    >
      <div className="flex flex-col items-center gap-3 border-b border-stone-warm-200 pb-8 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-lava-500">
            Escríbenos y síguenos
          </p>
          {/* El emoji va al principio: al final se quedaba solo en su propia
              línea cuando el texto se parte en el celular. */}
          <p className="text-balance font-display text-lg font-bold text-jungle-800 sm:text-xl">
            🦖 Consultas al instante, modelos nuevos y ofertas
          </p>
        </div>
        <RedesSociales variante="banda" conWhatsApp />
      </div>
    </section>
  );
}
