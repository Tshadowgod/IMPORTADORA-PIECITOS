"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatBs } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

/** Selector de talla + cantidad de la ficha de producto. */
export default function AddToCartPanel({ product }: { product: ProductDTO }) {
  const { add } = useCart();
  const [size, setSize] = useState<number | null>(product.sizes[0] ?? null);
  const [qty, setQty] = useState(1);
  const agotado = product.stock <= 0;

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 font-display text-sm font-bold text-jungle-900">
          Elige la talla
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((t) => {
            const activa = t === size;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSize(t)}
                aria-pressed={activa}
                className={`h-10 w-11 rounded-lg border-2 font-display text-sm font-bold transition ${
                  activa
                    ? "border-jungle-700 bg-jungle-600 text-white"
                    : "border-stone-warm-300 bg-white text-jungle-900 hover:border-jungle-500"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-lg border-2 border-stone-warm-300 bg-white">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Reducir cantidad"
            className="px-3 py-2 font-bold text-jungle-800 hover:bg-cream-200"
          >
            −
          </button>
          <span className="min-w-10 text-center font-display font-bold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            aria-label="Aumentar cantidad"
            className="px-3 py-2 font-bold text-jungle-800 hover:bg-cream-200"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={agotado || size === null}
          onClick={() => size !== null && add(product, size, qty)}
          className="btn-3d btn-3d-press flex flex-1 items-center justify-center gap-2 rounded-full bg-jungle-600 px-6 py-3 font-display text-base font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span aria-hidden>🛒</span>
          {agotado ? "SIN STOCK" : `AGREGAR · ${formatBs(product.price * qty)}`}
        </button>
      </div>

      <p className="text-sm font-semibold text-jungle-900/70">
        {agotado
          ? "Este modelo se agotó. Escríbenos por WhatsApp para avisarte cuando vuelva."
          : `Quedan ${product.stock} pares disponibles.`}
      </p>
    </div>
  );
}
