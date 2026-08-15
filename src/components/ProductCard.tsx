"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import ProductThumb, { productTint } from "./ProductThumb";
import { formatBs } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const { add } = useCart();
  const [size, setSize] = useState<number | null>(product.sizes[0] ?? null);
  const [fav, setFav] = useState(false);
  const agotado = product.stock <= 0;

  const enOferta =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;
  const descuento = enOferta
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-stone-warm-300/70 bg-white shadow-[0_4px_0_rgba(0,0,0,0.10),0_10px_24px_rgba(90,74,48,0.15)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_0_rgba(0,0,0,0.12),0_18px_32px_rgba(90,74,48,0.22)]">
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="rounded-full bg-jungle-600 px-2.5 py-1 font-display text-[0.65rem] font-bold tracking-wide text-white shadow">
            NUEVO
          </span>
        )}
        {enOferta && (
          <span className="rounded-full bg-lava-500 px-2.5 py-1 font-display text-[0.65rem] font-bold tracking-wide text-white shadow">
            -{descuento}%
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setFav((v) => !v)}
        aria-pressed={fav}
        aria-label={fav ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
        className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-lg shadow-sm transition hover:scale-110"
      >
        <span aria-hidden className={fav ? "text-berry-500" : "text-stone-warm-400"}>
          {fav ? "♥" : "♡"}
        </span>
      </button>

      <Link
        href={`/productos/${product.slug}`}
        className={`img-shine relative flex aspect-4/3 items-center justify-center overflow-hidden bg-linear-to-b ${productTint(product.color)}`}
      >
        <ProductThumb
          src={product.images[0]}
          alt={product.name}
          emoji={product.emoji}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
          imgClassName="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
        />
        {agotado && (
          <span className="absolute inset-x-0 bottom-0 bg-jungle-900/80 py-1.5 text-center font-display text-sm font-bold text-white">
            AGOTADO
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        {product.color && (
          <p className="text-[0.65rem] font-extrabold uppercase tracking-wider text-jungle-700/55">
            {product.color}
          </p>
        )}
        <h3 className="-mt-1 font-display text-sm font-bold leading-tight text-jungle-900 sm:text-base">
          <Link href={`/productos/${product.slug}`} className="hover:text-jungle-600">
            {product.name}
          </Link>
        </h3>

        <p className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold text-lava-600">
            {formatBs(product.price)}
          </span>
          {enOferta && (
            <span className="text-sm font-semibold text-stone-warm-500 line-through">
              {formatBs(product.compareAtPrice!)}
            </span>
          )}
        </p>

        {product.sizes.length > 0 && (
          <fieldset className="mt-auto">
            <legend className="mb-1 text-[0.7rem] font-bold text-jungle-900/70">Tallas:</legend>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((t) => {
                const activa = t === size;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSize(t)}
                    aria-pressed={activa}
                    aria-label={`Talla ${t}`}
                    className={`min-w-7 rounded-md border px-1.5 py-0.5 text-[0.7rem] font-bold transition ${
                      activa
                        ? "border-jungle-700 bg-jungle-600 text-white"
                        : "border-stone-warm-300 bg-cream-100 text-jungle-900 hover:border-jungle-500"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <button
          type="button"
          disabled={agotado || size === null}
          onClick={() => size !== null && add(product, size)}
          className="btn-3d btn-3d-press mt-2 flex items-center justify-center gap-2 self-end rounded-full bg-jungle-600 px-4 py-2 font-display text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span aria-hidden>🛒</span>
          {agotado ? "Sin stock" : "Agregar"}
        </button>
      </div>
    </article>
  );
}
