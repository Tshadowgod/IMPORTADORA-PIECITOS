"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "./CartProvider";

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
      className="flex w-full max-w-xl items-stretch overflow-hidden rounded-full border border-jungle-800/10 bg-white shadow-[0_2px_12px_rgba(30,55,20,0.08)]"
    >
      <span aria-hidden className="grid place-items-center pl-4 text-jungle-600">
        <SearchIcon />
      </span>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar tenis, tallas, modelos…"
        aria-label="Buscar productos"
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-jungle-900 outline-none placeholder:text-jungle-900/40 sm:text-base"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="m-1 grid w-10 shrink-0 place-items-center rounded-full bg-jungle-600 text-white transition hover:bg-jungle-500 sm:w-11"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

export default function Header() {
  const { count, openCart } = useCart();

  return (
    <header className="relative z-40 border-b border-jungle-800/8 bg-cream-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-2.5 sm:gap-5 sm:px-6">
        <Logo />

        <div className="order-3 w-full sm:order-none sm:flex-1">
          <Suspense fallback={<div className="h-11" />}>
            <SearchBox />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/cuenta"
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-jungle-800 transition hover:bg-white md:flex"
          >
            <UserIcon />
            <span className="leading-tight">
              <span className="block font-display text-[0.7rem] tracking-wide text-jungle-800/55">
                CUENTA
              </span>
              Iniciar sesión
            </span>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="relative grid h-12 w-12 place-items-center rounded-full bg-jungle-600 text-white shadow-[0_4px_14px_rgba(63,119,36,0.35)] transition hover:bg-jungle-500"
            aria-label={`Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`}
          >
            <CartIcon />
            {/* Un globo rojo con un "0" es ruido: solo aparece si hay algo. */}
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-lava-500 px-1 text-[0.65rem] font-extrabold ring-2 ring-cream-50">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.2-3 3.6-4.5 7-4.5s5.8 1.5 7 4.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 7h15l-1.5 9h-12z" />
      <path d="M6 7 5 4H2" />
      <circle cx="9" cy="20" r="1.3" fill="currentColor" />
      <circle cx="18" cy="20" r="1.3" fill="currentColor" />
    </svg>
  );
}
