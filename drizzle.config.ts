import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Next.js lee `.env.local` por su cuenta, pero drizzle-kit no: hay que
// cargarlo a mano (y dejar `.env` como respaldo).
config({ path: [".env.local", ".env"] });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
