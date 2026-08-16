"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import RedesSociales from "./RedesSociales";

type Estado = "idle" | "enviando" | "ok" | "error";

export default function PromoBanners() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");

  async function suscribir(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("fallo");
      setEstado("ok");
      setEmail("");
    } catch {
      setEstado("error");
    }
  }

  return (
    <section className="mx-auto grid max-w-[1400px] gap-4 px-4 py-8 sm:px-6 lg:grid-cols-2">
      <article className="relative flex min-h-[240px] items-end overflow-hidden rounded-3xl sm:min-h-[280px]">
        <Image
          src="/brand/combo-dinos.webp"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-jungle-900/80 via-jungle-800/55 to-jungle-700/20" />
        <div className="relative z-10 p-5 sm:p-7">
          <h2 className="font-display text-3xl font-bold leading-tight text-sun-300 sm:text-4xl">
            ¡COMBOS
            <br />
            DINO!
          </h2>
          <p className="mt-1 text-sm font-bold text-white/95">Lleva más, paga menos</p>
          <Link
            href="/productos?categoria=colecciones"
            className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 font-display text-sm font-bold text-jungle-800 transition hover:bg-cream-50"
          >
            VER COMBOS
          </Link>
        </div>
      </article>

      <article className="relative overflow-hidden rounded-3xl sm:min-h-[280px]">
        <Image
          src="/brand/manada-social.webp"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#123a52]/88 via-[#1f5f7a]/70 to-[#2f7fd0]/35" />
        <div className="relative z-10 flex h-full items-start gap-4 p-5 sm:p-7">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold leading-tight text-white sm:text-2xl">
              SÍGUENOS Y<br />
              ÚNETE A LA MANADA
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/90">
              Novedades, sorteos y descuentos exclusivos.
            </p>

            {/* Antes había tres emoji apuntando a instagram.com, facebook.com
                y tiktok.com a secas: no llevaban a la tienda. */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RedesSociales />
            </div>

            <form onSubmit={suscribir} className="mt-3 flex max-w-sm flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo"
                aria-label="Correo para recibir novedades"
                className="min-w-0 flex-1 rounded-lg border-2 border-white/40 bg-white/95 px-3 py-2 text-sm font-semibold text-jungle-900 outline-none placeholder:text-jungle-900/45"
              />
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="shrink-0 rounded-full bg-sun-400 px-4 py-2.5 font-display text-sm font-bold text-jungle-900 transition hover:bg-sun-300 disabled:opacity-60"
              >
                {estado === "enviando" ? "…" : "¡SÍGUENOS!"}
              </button>
            </form>

            <p aria-live="polite" className="mt-1.5 min-h-5 text-xs font-bold text-white">
              {estado === "ok" && "¡Listo! Ya eres parte de la manada."}
              {estado === "error" && "No pudimos registrar tu correo, inténtalo de nuevo."}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
