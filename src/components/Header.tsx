"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "./CartProvider";

/* ------------------------------------------------------------------ */
/*  Buscador                                                           */
/* ------------------------------------------------------------------ */

function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        router.push(q ? `/productos?q=${encodeURIComponent(q)}` : "/productos");
      }}
      className="flex w-full max-w-xl items-stretch overflow-hidden rounded-xl border-2 border-jungle-600/25 bg-white shadow-[0_3px_0_rgba(0,0,0,0.12)]"
    >
      <span aria-hidden className="grid place-items-center pl-3 text-jungle-600">
        <SearchIcon />
      </span>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar tenis, tallas, modelos…"
        aria-label="Buscar productos"
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-jungle-900 outline-none placeholder:text-jungle-900/45 sm:text-base"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="jungle-bar grid w-12 shrink-0 place-items-center text-white transition hover:brightness-110 sm:w-14"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Cabecera                                                           */
/* ------------------------------------------------------------------ */

export default function Header() {
  const { count, openCart } = useCart();

  return (
    <header className="relative z-40 border-b-4 border-jungle-700/20 bg-cream-50/95 backdrop-blur">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-0 hidden h-24 w-24 overflow-hidden xl:block"
      >
        <Image
          src="/brand/mascot-rex.webp"
          alt=""
          fill
          sizes="96px"
          className="object-contain object-left mix-blend-multiply"
        />
      </span>

      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-3 py-3 sm:gap-5 sm:px-6 xl:pl-24">
        <Logo />

        <div className="order-3 w-full sm:order-none sm:flex-1">
          <Suspense fallback={<div className="h-12" />}>
            <SearchBox />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {/* Cartel de madera "MI CUENTA" */}
          <Link
            href="/cuenta"
            className="btn-3d btn-3d-press hidden flex-col items-center rounded-lg border-2 border-wood-500/60 px-4 py-1.5 text-center leading-tight transition hover:brightness-105 md:flex"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, #c68c47 0px, #c68c47 6px, #b97f3c 6px, #b97f3c 12px)",
            }}
          >
            <span className="font-display text-sm font-bold tracking-wide text-jungle-900">
              MI CUENTA
            </span>
            <span className="text-[0.7rem] font-semibold text-jungle-900/75">
              Iniciar sesión
            </span>
          </Link>

          {/* Carrito con forma de piedra */}
          <button
            type="button"
            onClick={openCart}
            className="btn-3d btn-3d-press relative flex flex-col items-center rounded-2xl border-2 border-stone-warm-500/50 bg-stone-warm-300 px-4 py-1.5 transition hover:brightness-105"
            style={{ borderRadius: "38% 62% 55% 45% / 45% 40% 60% 55%" }}
            aria-label={`Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`}
          >
            <span className="font-display text-xs font-bold tracking-wide text-jungle-900">
              CARRITO
            </span>
            <span aria-hidden className="text-xl leading-none">
              🛒
            </span>
            <span
              aria-hidden
              className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-lava-500 text-xs font-extrabold text-white ring-2 ring-white"
            >
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
