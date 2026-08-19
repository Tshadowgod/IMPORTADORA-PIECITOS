import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartPanel from "@/components/AddToCartPanel";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProductThumb, { productTint } from "@/components/ProductThumb";
import { getProductBySlug, getProducts } from "@/lib/data";
import { formatBs, PRECIO_A_CONSULTAR, sinPrecio } from "@/lib/format";

export const revalidate = 120;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0], width: 900, height: 900 }] }
      : undefined,
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relacionados = (
    await getProducts({ category: product.categorySlug ?? undefined, limit: 8 })
  ).filter((p) => p.id !== product.id);

  const enOferta =
    product.compareAtPrice !== null && product.compareAtPrice > product.price;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <nav aria-label="Migas de pan" className="mb-5 text-sm font-semibold text-jungle-900/70">
        <Link href="/" className="hover:text-jungle-600">
          Inicio
        </Link>
        <span aria-hidden className="mx-1.5">
          ›
        </span>
        <Link href="/productos" className="hover:text-jungle-600">
          Catálogo
        </Link>
        <span aria-hidden className="mx-1.5">
          ›
        </span>
        <span className="text-jungle-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div
          className={`img-shine relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-linear-to-b shadow-[0_16px_40px_rgba(90,74,48,0.12)] ${productTint(product.color)}`}
        >
          {product.isNew && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-jungle-600 px-3 py-1 font-display text-xs font-bold text-white">
              NUEVO
            </span>
          )}
          <ProductThumb
            src={product.images[0]}
            alt={product.name}
            emoji={product.emoji}
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
            imgClassName="object-contain p-8"
          />
        </div>

        {/* Información */}
        <div>
          <h1 className="font-display text-3xl font-bold text-jungle-900 sm:text-4xl">
            {product.name}
          </h1>

          {sinPrecio(product.price) ? (
            <p className="mt-3 font-display text-2xl font-bold text-jungle-700">
              {PRECIO_A_CONSULTAR}
            </p>
          ) : (
            <p className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-lava-600">
                {formatBs(product.price)}
              </span>
              {enOferta && (
                <span className="text-lg font-semibold text-stone-warm-500 line-through">
                  {formatBs(product.compareAtPrice!)}
                </span>
              )}
            </p>
          )}

          {product.description && (
            <p className="mt-4 text-base font-semibold leading-relaxed text-jungle-900/80">
              {product.description}
            </p>
          )}

          {product.color && (
            <p className="mt-3 text-sm font-bold text-jungle-900/70">
              Color: <span className="text-jungle-900">{product.color}</span>
            </p>
          )}

          <hr className="my-6 border-stone-warm-300" />

          <AddToCartPanel product={product} />

          <ul className="mt-6 grid gap-2 rounded-2xl bg-white p-4 text-sm font-semibold text-jungle-900/80 ring-1 ring-stone-warm-200/80 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <span aria-hidden>🐾</span> Envío gratis desde Bs. 150
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>🔄</span> 7 días para cambios
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>🛡️</span> Materiales resistentes
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden>🔒</span> Pago seguro
            </li>
          </ul>
        </div>
      </div>

      {relacionados.length > 0 && (
        <FeaturedProducts
          products={relacionados}
          titulo="TAMBIÉN TE PUEDE GUSTAR"
          verTodosHref={`/productos?categoria=${product.categorySlug ?? "todos"}`}
        />
      )}
    </div>
  );
}
