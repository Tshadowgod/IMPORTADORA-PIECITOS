"use client";

import Link from "next/link";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import type { ProductDTO } from "@/lib/types";

/**
 * Carrusel de productos destacados. Usa scroll nativo con snap (no una librería)
 * para que funcione con teclado, touch y sin JavaScript extra.
 */
export default function FeaturedProducts({
  products,
  titulo = "PRODUCTOS DESTACADOS",
  verTodosHref = "/productos",
}: {
  products: ProductDTO[];
  titulo?: string;
  verTodosHref?: string;
}) {
  const track = useRef<HTMLUListElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <section aria-label={titulo} className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-jungle-800 sm:text-2xl">
            {titulo}
          </h2>
          <div className="paw-divider mt-2 w-40" />
        </div>
        <Link
          href={verTodosHref}
          className="flex items-center gap-1.5 font-display text-sm font-bold text-jungle-700 hover:text-lava-500"
        >
          VER TODOS <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="relative">
        <ul
          ref={track}
          className="no-scrollbar grid auto-cols-[minmax(240px,1fr)] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2 sm:auto-cols-[minmax(260px,1fr)] lg:auto-cols-[calc(25%-0.75rem)] lg:px-12"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products.map((p) => (
            <li key={p.id} style={{ scrollSnapAlign: "start" }}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>

        {/* Flechas */}
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Ver productos anteriores"
          className="btn-3d absolute -left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-jungle-700/40 bg-jungle-600 text-xl font-bold text-white transition hover:brightness-110 lg:grid"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Ver más productos"
          className="btn-3d absolute -right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-jungle-700/40 bg-jungle-600 text-xl font-bold text-white transition hover:brightness-110 lg:grid"
        >
          ›
        </button>
      </div>
    </section>
  );
}
