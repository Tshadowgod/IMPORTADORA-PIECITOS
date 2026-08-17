import type { Metadata } from "next";
import Link from "next/link";
import { haySesionAdmin } from "@/lib/admin-auth";
import CerrarSesion from "./CerrarSesion";

export const metadata: Metadata = {
  title: "Panel",
  // El panel no tiene por qué aparecer en Google.
  robots: { index: false, follow: false },
};

/**
 * Armazón del panel. No usa la cabecera ni el footer de la tienda a propósito:
 * acá no hay nada que comprar.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dentro = await haySesionAdmin();

  return (
    <div className="min-h-dvh bg-cream-100">
      <header className="border-b-2 border-jungle-800/10 bg-jungle-700 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <span aria-hidden className="text-2xl">
            🦖
          </span>
          <div className="mr-auto">
            <p className="font-display text-lg font-bold leading-none">Panel de pedidos</p>
            <p className="text-xs font-semibold text-white/70">Importadora Piecitos</p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold transition hover:bg-white/25"
          >
            Ver la tienda
          </Link>
          {dentro && <CerrarSesion />}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
