import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Conexión a Neon PostgreSQL sobre HTTP (serverless-friendly: no mantiene
 * sockets abiertos, así que funciona en las funciones edge/lambda de Vercel).
 *
 * Si `DATABASE_URL` no está configurada, `db` queda en `null` y la capa de
 * datos (src/lib/data.ts) cae automáticamente al catálogo de demostración.
 * Eso permite levantar `npm run dev` sin haber creado la base todavía.
 */

const connectionString = process.env.DATABASE_URL;

export const isDbConfigured =
  typeof connectionString === "string" &&
  connectionString.length > 0 &&
  !connectionString.includes("USUARIO:PASSWORD");

export const db = isDbConfigured
  ? drizzle(neon(connectionString!), { schema })
  : null;

export { schema };
