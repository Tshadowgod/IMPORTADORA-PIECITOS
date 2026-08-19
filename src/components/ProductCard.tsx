"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import ProductThumb, { productTint } from "./ProductThumb";
import { formatBs, PRECIO_A_CONSULTAR, sinPrecio } from "@/lib/format";
import { linkWhatsApp } from "@/lib/tienda";
import type { ProductDTO } from "@/lib/types";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const { add } = useCart();
  const [size, setSize] = useState<number | null>(product.sizes[0] ?? null);
  const agotado = product.stock <= 0;
  const aConsultar = sinPrecio(product.price);

  const enOferta =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;
  const descuento = enOferta
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0;

  const visibles = product.sizes.slice(0, 6);
  const extra = product.sizes.length - visibles.length;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(90,74,48,0.08)] ring-1 ring-stone-warm-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(90,74,48,0.14)]">
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="rounded-full bg-jungle-600 px-2.5 py-0.5 font-display text-[0.65rem] font-bold tracking-wide text-white">
            NUEVO
          </span>
        )}
        {enOferta && (
          <span className="rounded-full bg-lava-500 px-2.5 py-0.5 font-display text-[0.65rem] font-bold tracking-wide text-white">
            -{descuento}%
          </span>
        )}
      </div>

      <Link
        href={`/productos/${product.slug}`}
        className={`img-shine relative flex aspect-square items-center justify-center overflow-hidden bg-linear-to-b ${productTint(product.color)}`}
      >
        <ProductThumb
          src={product.images[0]}
          alt={product.name}
          emoji={product.emoji}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
          imgClassName="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
        {agotado && (
          <span className="absolute inset-x-0 bottom-0 bg-jungle-900/80 py-1.5 text-center font-display text-sm font-bold text-white">
            AGOTADO
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.color && (
          <p className="text-[0.65rem] font-extrabold uppercase tracking-wider text-jungle-700/50">
            {product.color}
          </p>
        )}
        <h3 className="-mt-1 font-display text-sm font-bold leading-tight text-jungle-900 sm:text-base">
          <Link href={`/productos/${product.slug}`} className="hover:text-jungle-600">
            {product.name}
          </Link>
        </h3>

        {aConsultar ? (
          <p className="font-display text-base font-bold text-jungle-700">
            {PRECIO_A_CONSULTAR}
          </p>
        ) : (
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
        )}

        {product.sizes.length > 0 && (
          <fieldset>
            <legend className="sr-only">Tallas</legend>
            <div className="flex flex-wrap gap-1">
              {visibles.map((t) => {
                const activa = t === size;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSize(t)}
                    aria-pressed={activa}
                    aria-label={`Talla ${t}`}
                    className={`min-w-7 rounded-md px-1.5 py-0.5 text-[0.7rem] font-bold transition ${
                      activa
                        ? "bg-jungle-600 text-white"
                        : "bg-cream-100 text-jungle-900 hover:bg-cream-200"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
              {extra > 0 && (
                <Link
                  href={`/productos/${product.slug}`}
                  className="min-w-7 rounded-md bg-cream-100 px-1.5 py-0.5 text-[0.7rem] font-bold text-jungle-700 hover:bg-cream-200"
                >
                  +{extra}
                </Link>
              )}
            </div>
          </fieldset>
        )}

        {aConsultar ? (
          <a
            href={linkWhatsApp(
              `Hola, quiero saber el precio del modelo ${product.name}${
                size !== null ? ` en talla ${size}` : ""
              }.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-jungle-600 py-2.5 font-display text-sm font-bold text-white transition hover:bg-jungle-500"
          >
            Consultar precio
          </a>
        ) : (
          <button
            type="button"
            disabled={agotado || size === null}
            onClick={() => size !== null && add(product, size)}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-jungle-600 py-2.5 font-display text-sm font-bold text-white transition hover:bg-jungle-500 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {agotado ? "Sin stock" : "Agregar al carrito"}
          </button>
        )}
      </div>
    </article>
  );
}
