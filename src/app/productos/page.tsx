import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Todos los tenis de dinosaurio de Importadora Piecitos.",
};

export const revalidate = 120;

interface Props {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}

export default async function ProductosPage({ searchParams }: Props) {
  const { categoria, q } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category: categoria, search: q }),
  ]);

  const actual = categories.find((c) => c.slug === categoria);
  const titulo = q
    ? `Resultados para "${q}"`
    : actual
      ? `${actual.name}${actual.subtitle ? ` · ${actual.subtitle}` : ""}`
      : "TODO EL CATÁLOGO";

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-jungle-800 sm:text-3xl">
          {titulo}
        </h1>
        <div className="paw-divider mt-2 w-36" />
        <p className="mt-1 text-sm font-semibold text-jungle-900/70">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </p>
      </header>

      {/* Filtros por categoría */}
      <nav aria-label="Filtrar por categoría" className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => {
          const activa = categoria === c.slug || (!categoria && c.slug === "todos");
          return (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              aria-current={activa ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-full border-2 py-1 pl-1 pr-4 font-display text-sm font-bold transition ${
                activa
                  ? "border-jungle-700 bg-jungle-600 text-white"
                  : "border-stone-warm-300 bg-white text-jungle-800 hover:border-jungle-500"
              }`}
            >
              {c.image ? (
                <span className="relative h-7 w-7 overflow-hidden rounded-full bg-cream-50">
                  <Image src={c.image} alt="" fill sizes="28px" className="object-cover" />
                </span>
              ) : (
                <span aria-hidden className="ml-2">
                  {c.icon}
                </span>
              )}
              {c.name}
            </Link>
          );
        })}
      </nav>

      {products.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-warm-300 bg-white/70 px-6 py-16 text-center">
          <span className="relative mx-auto block h-28 w-28">
            <Image
              src="/brand/mascot-rex.webp"
              alt=""
              fill
              sizes="112px"
              className="object-contain mix-blend-multiply"
            />
          </span>
          <p className="mt-3 font-display text-lg font-bold text-jungle-800">
            No encontramos nada por aquí
          </p>
          <p className="mt-1 text-sm font-semibold text-jungle-900/70">
            Prueba con otra categoría o cambia los términos de búsqueda.
          </p>
          <Link
            href="/productos"
            className="btn-3d btn-3d-press mt-4 inline-block rounded-full bg-jungle-600 px-6 py-2.5 font-display font-bold text-white"
          >
            VER TODO
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
