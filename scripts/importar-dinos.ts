import { config } from "dotenv";

// Se ejecuta con tsx, fuera de Next.js: `.env.local` no se carga solo.
config({ path: [".env.local", ".env"] });

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray, sql } from "drizzle-orm";
import * as schema from "../src/db/schema";

/**
 * Sube a Neon el catálogo de dinosaurios sacado del PDF de la importadora.
 *
 *   npx tsx scripts/importar-dinos.ts
 *
 * Es idempotente: se puede volver a correr sin duplicar nada (hace upsert
 * por `slug`). Los datos están en `catalogo-dinos.json`, junto a este
 * archivo, y las fotos ya recortadas en `public/productos/dino/`.
 *
 * PRECIOS: el PDF no los trae, así que todos entran en 0 y la tienda los
 * muestra como "Precio a consultar" (botón de WhatsApp en vez de carrito).
 * Cuando la importadora los defina, se ponen acá abajo y se vuelve a correr
 * el script; ahí las fichas pasan solas a mostrar el precio y el carrito.
 */

/** Precio en Bs. de cada sección. 0 = todavía sin precio. */
const PRECIOS: Record<string, number> = {
  "primeros-pasos": 0,
  "dino-clasico": 0,
  "dino-luces": 0,
  "dino-3d-led": 0,
  "dientes-3d-led": 0,
  "rex-urbano": 0,
  "colegial": 0,
};

/** Con `false` los productos quedan cargados pero sin aparecer en la tienda. */
const PUBLICAR = true;

/** Los que salen en "LOS MÁS RUGIENTES" de la portada: uno por sección. */
const DESTACADOS = new Set([
  "primeros-pasos-azul-plateado",
  "primeros-pasos-plateado-rosa",
  "primeros-pasos-oro",
  "dino-clasico-cafe",
  "dino-luces-azul-rojo-blanco",
  "dino-3d-led-verde",
  "dientes-3d-led-dorado",
  "colegial-blanco",
]);

/** Los 8 productos inventados con los que se armó la tienda. */
const DEMOS = [
  "dino-rex-verde",
  "triceratops-azul",
  "t-rex-rojo",
  "stego-marron",
  "dino-rosa-brillante",
  "pteroluz-violeta",
  "bebe-huevito-amarillo",
  "raptor-naranja",
];
const BORRAR_DEMOS = true;

type Modelo = {
  slug: string;
  nombre: string;
  seccion: string;
  descripcion: string;
  color: string;
  tallas: number[];
  categoria: string;
  imagenes: string[];
  stock: number;
};

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url || url.includes("USUARIO:PASSWORD")) {
    console.error("\n✖ Falta DATABASE_URL en .env.local.\n");
    process.exit(1);
  }
  const db = drizzle(neon(url), { schema });

  const modelos: Modelo[] = JSON.parse(
    readFileSync(join(import.meta.dirname ?? __dirname, "catalogo-dinos.json"), "utf8"),
  );

  const categorias = await db.select().from(schema.categories);
  const idPorSlug = new Map(categorias.map((c) => [c.slug, c.id]));

  let publicados = 0;
  for (const m of modelos) {
    // Sin precio igual se publican: la ficha invita a consultarlo por WhatsApp.
    const precio = PRECIOS[m.seccion] ?? 0;
    const activo = PUBLICAR;
    if (activo) publicados++;
    const valores = {
      name: m.nombre,
      description: m.descripcion,
      price: precio.toFixed(2),
      categoryId: idPorSlug.get(m.categoria) ?? null,
      sizes: m.tallas,
      images: m.imagenes,
      color: m.color,
      stock: m.stock,
      isActive: activo,
      isFeatured: DESTACADOS.has(m.slug),
      updatedAt: new Date(),
    };
    await db
      .insert(schema.products)
      .values({ slug: m.slug, ...valores })
      .onConflictDoUpdate({ target: schema.products.slug, set: valores });
  }
  console.log(`→ ${modelos.length} modelos cargados (${publicados} visibles en la tienda)`);

  if (BORRAR_DEMOS) {
    const fuera = await db
      .delete(schema.products)
      .where(inArray(schema.products.slug, DEMOS))
      .returning({ slug: schema.products.slug });
    console.log(`→ ${fuera.length} productos de demostración borrados`);
  }

  const [{ total, visibles }] = await db
    .select({
      total: sql<number>`count(*)::int`,
      visibles: sql<number>`count(*) filter (where ${schema.products.isActive})::int`,
    })
    .from(schema.products);
  console.log(`✔ La base queda con ${total} productos, ${visibles} visibles`);
}

main();
