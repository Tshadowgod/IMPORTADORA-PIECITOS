import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

// El seed se ejecuta con tsx, fuera de Next.js, así que `.env.local` no se
// carga solo.
config({ path: [".env.local", ".env"] });

import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { demoCategories, demoProducts } from "../lib/catalog";

/**
 * Puebla Neon con el catálogo inicial.
 *
 *   npm run db:push   # crea las tablas
 *   npm run db:seed   # inserta categorías y productos
 *
 * Es idempotente: vuelve a ejecutarse sin duplicar filas (onConflictDoUpdate
 * sobre el slug).
 */

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url || url.includes("USUARIO:PASSWORD")) {
    console.error(
      "\n✖ Falta DATABASE_URL en .env.local.\n" +
        "  Crea un proyecto en https://console.neon.tech y pega ahí la cadena de conexión.\n",
    );
    process.exit(1);
  }

  const db = drizzle(neon(url), { schema });

  console.log("→ Insertando categorías…");
  for (const c of demoCategories) {
    await db
      .insert(schema.categories)
      .values({
        slug: c.slug,
        name: c.name,
        subtitle: c.subtitle,
        icon: c.icon,
        accent: c.accent,
        inNav: c.inNav,
        sortOrder: c.sortOrder,
      })
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: {
          name: c.name,
          subtitle: c.subtitle,
          icon: c.icon,
          accent: c.accent,
          inNav: c.inNav,
          sortOrder: c.sortOrder,
        },
      });
  }

  const catRows = await db.select().from(schema.categories);
  const catIdBySlug = new Map(catRows.map((c) => [c.slug, c.id]));

  console.log("→ Insertando productos…");
  for (const p of demoProducts) {
    await db
      .insert(schema.products)
      .values({
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: String(p.price),
        compareAtPrice: p.compareAtPrice === null ? null : String(p.compareAtPrice),
        categoryId: p.categorySlug ? (catIdBySlug.get(p.categorySlug) ?? null) : null,
        sizes: p.sizes,
        images: p.images,
        emoji: p.emoji,
        color: p.color,
        stock: p.stock,
        isNew: p.isNew,
        isFeatured: p.isFeatured,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: schema.products.slug,
        set: {
          name: p.name,
          description: p.description,
          price: String(p.price),
          compareAtPrice: p.compareAtPrice === null ? null : String(p.compareAtPrice),
          categoryId: p.categorySlug ? (catIdBySlug.get(p.categorySlug) ?? null) : null,
          sizes: p.sizes,
          images: p.images,
          emoji: p.emoji,
          color: p.color,
          stock: p.stock,
          isNew: p.isNew,
          isFeatured: p.isFeatured,
          updatedAt: new Date(),
        },
      });
  }

  console.log(
    `\n✔ Listo: ${demoCategories.length} categorías y ${demoProducts.length} productos en Neon.\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
