import "server-only";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { demoCategories, demoProducts } from "./catalog";
import type { Accent, CategoryDTO, ProductDTO } from "./types";

/**
 * Capa de acceso a datos. Cada función consulta Neon cuando hay conexión y
 * cae al catálogo de demostración cuando no la hay, para que la web nunca
 * se rompa por falta de `DATABASE_URL`.
 */

type ProductRow = typeof products.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;

function toCategoryDTO(row: CategoryRow): CategoryDTO {
  const demo = demoCategories.find((c) => c.slug === row.slug);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    icon: row.icon ?? "🦖",
    image: demo?.image,
    accent: (row.accent as Accent) ?? "green",
    inNav: row.inNav,
    sortOrder: row.sortOrder,
  };
}

function toProductDTO(row: ProductRow, categorySlug: string | null): ProductDTO {
  const demo = demoProducts.find((p) => p.slug === row.slug);
  const images = row.images?.length ? row.images : (demo?.images ?? []);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    compareAtPrice: row.compareAtPrice === null ? null : Number(row.compareAtPrice),
    categorySlug,
    sizes: row.sizes ?? [],
    images,
    emoji: row.emoji,
    color: row.color,
    stock: row.stock,
    isNew: row.isNew,
    isFeatured: row.isFeatured,
  };
}

/** SELECT de producto + slug de su categoría, reutilizado por varias consultas. */
function productQuery() {
  return db!
    .select({ product: products, categorySlug: categories.slug })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));
}

export async function getCategories(): Promise<CategoryDTO[]> {
  if (!db) return demoCategories;
  try {
    const rows = await db.select().from(categories).orderBy(categories.sortOrder);
    return rows.length ? rows.map(toCategoryDTO) : demoCategories;
  } catch (error) {
    console.error("[data] getCategories falló, usando catálogo demo:", error);
    return demoCategories;
  }
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDTO[]> {
  if (!db) return demoProducts.filter((p) => p.isFeatured).slice(0, limit);
  try {
    const rows = await productQuery()
      .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
      .orderBy(desc(products.createdAt))
      .limit(limit);
    return rows.length
      ? rows.map((r) => toProductDTO(r.product, r.categorySlug))
      : demoProducts.filter((p) => p.isFeatured).slice(0, limit);
  } catch (error) {
    console.error("[data] getFeaturedProducts falló, usando catálogo demo:", error);
    return demoProducts.filter((p) => p.isFeatured).slice(0, limit);
  }
}

export async function getProducts(opts: {
  category?: string;
  search?: string;
  limit?: number;
} = {}): Promise<ProductDTO[]> {
  // El tope por defecto cubre el catálogo entero (133 modelos del PDF de la
  // importadora): la página de productos no tiene paginado, así que un tope
  // más bajo escondería modelos sin avisar.
  const { category, search, limit = 200 } = opts;

  const filterDemo = () =>
    demoProducts
      .filter((p) => !category || category === "todos" || p.categorySlug === category)
      .filter((p) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          (p.color ?? "").toLowerCase().includes(q)
        );
      })
      .slice(0, limit);

  if (!db) return filterDemo();

  try {
    const conditions = [eq(products.isActive, true)];
    if (category && category !== "todos") {
      conditions.push(eq(categories.slug, category));
    }
    if (search) {
      const like = `%${search}%`;
      conditions.push(
        or(
          ilike(products.name, like),
          ilike(products.description, like),
          ilike(products.color, like),
        )!,
      );
    }

    const rows = await productQuery()
      .where(and(...conditions))
      .orderBy(desc(products.isFeatured), desc(products.createdAt))
      .limit(limit);

    return rows.map((r) => toProductDTO(r.product, r.categorySlug));
  } catch (error) {
    console.error("[data] getProducts falló, usando catálogo demo:", error);
    return filterDemo();
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const fromDemo = () => demoProducts.find((p) => p.slug === slug) ?? null;
  if (!db) return fromDemo();
  try {
    const rows = await productQuery().where(eq(products.slug, slug)).limit(1);
    if (!rows.length) return fromDemo();
    return toProductDTO(rows[0].product, rows[0].categorySlug);
  } catch (error) {
    console.error("[data] getProductBySlug falló, usando catálogo demo:", error);
    return fromDemo();
  }
}

/** Productos usados para calcular totales de un pedido, por id. */
export async function getProductsByIds(ids: number[]): Promise<ProductDTO[]> {
  if (!ids.length) return [];
  if (!db) return demoProducts.filter((p) => ids.includes(p.id));
  try {
    const rows = await productQuery().where(
      sql`${products.id} = ANY(${sql.raw(`ARRAY[${ids.map(Number).join(",")}]::int[]`)})`,
    );
    return rows.map((r) => toProductDTO(r.product, r.categorySlug));
  } catch (error) {
    console.error("[data] getProductsByIds falló, usando catálogo demo:", error);
    return demoProducts.filter((p) => ids.includes(p.id));
  }
}
