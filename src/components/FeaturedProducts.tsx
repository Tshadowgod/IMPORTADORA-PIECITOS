import Link from "next/link";
import ProductCard from "./ProductCard";
import type { ProductDTO } from "@/lib/types";

export default function FeaturedProducts({
  products,
  titulo = "Productos destacados",
  verTodosHref = "/productos",
}: {
  products: ProductDTO[];
  titulo?: string;
  verTodosHref?: string;
}) {
  if (!products.length) return null;

  return (
    <section aria-label={titulo} className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-lava-500">
            La manada
          </p>
          <h2 className="font-display text-2xl font-bold text-jungle-800 sm:text-3xl">
            {titulo}
          </h2>
        </div>
        <Link
          href={verTodosHref}
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-display text-sm font-bold text-jungle-700 ring-1 ring-stone-warm-200 transition hover:ring-jungle-400"
        >
          Ver todos <span aria-hidden>→</span>
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
