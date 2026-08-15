"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { ENVIO_GRATIS_DESDE, formatBs } from "@/lib/format";

/** Panel lateral del carrito. Se abre al agregar un producto o desde la cabecera. */
export default function CartDrawer() {
  const { lines, isOpen, closeCart, updateQuantity, remove, subtotal, shipping, total } =
    useCart();

  const faltaParaEnvioGratis = Math.max(0, ENVIO_GRATIS_DESDE - subtotal);

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden
        className={`fixed inset-0 z-50 bg-jungle-900/50 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l-4 border-jungle-700 bg-cream-50 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="jungle-bar flex items-center justify-between px-4 py-3">
          <h2 className="font-display text-lg font-bold text-white">Tu carrito</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-xl font-bold text-white transition hover:bg-white/30"
          >
            ×
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="relative h-28 w-28">
              <Image
                src="/brand/mascot-rex.webp"
                alt=""
                fill
                sizes="112px"
                className="object-contain mix-blend-multiply"
              />
            </span>
            <p className="font-display text-lg font-bold text-jungle-800">
              Tu carrito está vacío
            </p>
            <p className="text-sm font-semibold text-jungle-900/70">
              Aún no hay ningún dino esperando su aventura.
            </p>
            <Link
              href="/productos"
              onClick={closeCart}
              className="btn-3d btn-3d-press mt-2 rounded-full bg-jungle-600 px-6 py-2.5 font-display font-bold text-white"
            >
              VER CATÁLOGO
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {lines.map((l) => (
                <li
                  key={`${l.productId}-${l.size}`}
                  className="flex gap-3 rounded-xl border-2 border-stone-warm-300/70 bg-white p-3"
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                    {l.image ? (
                      <Image
                        src={l.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-contain p-0.5"
                      />
                    ) : (
                      <span aria-hidden className="grid h-full w-full place-items-center text-3xl">
                        {l.emoji}
                      </span>
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-sm font-bold text-jungle-900">
                      {l.name}
                    </h3>
                    <p className="text-xs font-bold text-jungle-900/60">Talla {l.size}</p>
                    <p className="font-display text-base font-bold text-lava-600">
                      {formatBs(l.price * l.quantity)}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border-2 border-stone-warm-300">
                        <button
                          type="button"
                          onClick={() => updateQuantity(l.productId, l.size, l.quantity - 1)}
                          aria-label={`Quitar una unidad de ${l.name} talla ${l.size}`}
                          className="px-2 py-0.5 font-bold text-jungle-800 hover:bg-cream-200"
                        >
                          −
                        </button>
                        <span className="min-w-7 text-center text-sm font-bold">{l.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(l.productId, l.size, l.quantity + 1)}
                          aria-label={`Agregar una unidad de ${l.name} talla ${l.size}`}
                          className="px-2 py-0.5 font-bold text-jungle-800 hover:bg-cream-200"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.productId, l.size)}
                        className="text-xs font-bold text-berry-500 underline-offset-2 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t-2 border-stone-warm-300 bg-cream-100 px-4 py-4">
              {faltaParaEnvioGratis > 0 && (
                <p className="mb-2 rounded-lg bg-sun-300/50 px-3 py-2 text-xs font-bold text-jungle-900">
                  Te faltan {formatBs(faltaParaEnvioGratis)} para el envío gratis
                </p>
              )}
              <dl className="space-y-1 text-sm font-semibold text-jungle-900">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatBs(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Envío</dt>
                  <dd>{shipping === 0 ? "Gratis" : formatBs(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-stone-warm-300 pt-1 font-display text-lg font-bold">
                  <dt>Total</dt>
                  <dd className="text-lava-600">{formatBs(total)}</dd>
                </div>
              </dl>

              <Link
                href="/carrito"
                onClick={closeCart}
                className="btn-3d btn-3d-press mt-3 block rounded-full bg-jungle-600 py-3 text-center font-display text-base font-bold text-white transition hover:brightness-110"
              >
                FINALIZAR COMPRA
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
