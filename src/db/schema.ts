import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ------------------------------------------------------------------ */
/*  Categorías (Niños, Niñas, Bebés, Colecciones, Ofertas…)            */
/* ------------------------------------------------------------------ */

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    /** Texto pequeño bajo el nombre, p. ej. "3 - 12 AÑOS" */
    subtitle: varchar("subtitle", { length: 80 }),
    /** Emoji o URL de la ilustración del dino */
    icon: varchar("icon", { length: 255 }),
    /** Clase/token de color usado por el front (green, blue, pink, yellow…) */
    accent: varchar("accent", { length: 24 }).default("green").notNull(),
    /** Aparece en la barra de navegación superior */
    inNav: boolean("in_nav").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(t.slug),
  }),
);

/* ------------------------------------------------------------------ */
/*  Productos                                                          */
/* ------------------------------------------------------------------ */

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    description: text("description"),
    /** Bs. — numeric evita los errores de redondeo de float */
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    /** Precio tachado (antes). null = sin descuento */
    compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
    categoryId: integer("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    /** Tallas disponibles: [22, 23, 24 …] */
    sizes: jsonb("sizes").$type<number[]>().default([]).notNull(),
    /** Galería de imágenes */
    images: jsonb("images").$type<string[]>().default([]).notNull(),
    /** Emoji de respaldo mientras no haya foto real */
    emoji: varchar("emoji", { length: 16 }).default("🦖").notNull(),
    color: varchar("color", { length: 40 }),
    stock: integer("stock").default(0).notNull(),
    isNew: boolean("is_new").default(false).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(t.slug),
  }),
);

/* ------------------------------------------------------------------ */
/*  Pedidos                                                            */
/* ------------------------------------------------------------------ */

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  /** Código legible para el cliente: PIE-000123 */
  code: varchar("code", { length: 24 }).notNull(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
  customerEmail: varchar("customer_email", { length: 160 }),
  address: text("address"),
  city: varchar("city", { length: 80 }),
  notes: text("notes"),
  /** pendiente | confirmado | enviado | entregado | cancelado */
  status: varchar("status", { length: 24 }).default("pendiente").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 10, scale: 2 }).default("0").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  /** Se congela el nombre y precio al momento de la compra */
  productName: varchar("product_name", { length: 160 }).notNull(),
  size: integer("size").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

/* ------------------------------------------------------------------ */
/*  Suscriptores (banner "Únete a la manada")                          */
/* ------------------------------------------------------------------ */

export const subscribers = pgTable(
  "subscribers",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 160 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    emailIdx: uniqueIndex("subscribers_email_idx").on(t.email),
  }),
);

/* ------------------------------------------------------------------ */
/*  Relaciones                                                         */
/* ------------------------------------------------------------------ */

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
