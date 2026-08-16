"use client";

import { useCart } from "./CartProvider";

/**
 * Carrito flotante, fijo justo encima del botón de WhatsApp.
 *
 * La cabecera se pierde al bajar por el catálogo, así que el carrito queda
 * siempre a mano en la esquina. La posición está atada a la del botón de
 * WhatsApp, con 0.75rem de aire entre los dos:
 *
 *   celular:    1rem    + 3rem   + 0.75rem = 4.75rem
 *   escritorio: 1.25rem + 3.5rem + 0.75rem = 5.5rem
 *
 * Si se mueve o cambia de tamaño uno, hay que rehacer la cuenta del otro.
 */

export default function FloatingCart() {
  const { count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`}
      className="fixed bottom-[4.75rem] right-4 z-40 grid h-12 w-12 place-items-center sm:bottom-[5.5rem] sm:right-5 sm:h-14 sm:w-14 rounded-full bg-jungle-600 text-white shadow-[0_8px_24px_rgba(63,119,36,0.45)] transition hover:scale-105 hover:bg-jungle-500"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 7h15l-1.5 9h-12z" />
        <path d="M6 7 5 4H2" />
        <circle cx="9" cy="20" r="1.3" fill="currentColor" />
        <circle cx="18" cy="20" r="1.3" fill="currentColor" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-lava-500 px-1 text-xs font-extrabold ring-2 ring-cream-50">
          {count}
        </span>
      )}
    </button>
  );
}
