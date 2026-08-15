"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
    <section className="mx-auto grid max-w-[1400px] gap-5 px-4 py-8 sm:px-6 lg:grid-cols-2">
      <article className="relative flex min-h-[220px] items-end overflow-hidden rounded-2xl border-2 border-jungle-800/40 sm:min-h-[260px]">
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
            className="btn-3d btn-3d-press mt-4 inline-block rounded-lg bg-white px-4 py-2 font-display text-sm font-bold text-jungle-800 transition hover:brightness-105"
          >
            VER COMBOS
          </Link>
        </div>
      </article>

      <article className="relative overflow-hidden rounded-2xl border-2 border-jungle-800/40 sm:min-h-[260px]">
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

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <SocialLink href="https://instagram.com" label="Instagram" icon="📷" />
              <SocialLink href="https://facebook.com" label="Facebook" icon="👍" />
              <SocialLink href="https://tiktok.com" label="TikTok" icon="🎵" />
            </div>

            <form onSubmit={suscribir} className="mt-3 flex max-w-sm gap-2">
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
                className="btn-3d btn-3d-press shrink-0 rounded-lg bg-sun-400 px-4 py-2 font-display text-sm font-bold text-jungle-900 transition hover:brightness-105 disabled:opacity-60"
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

function SocialLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-lg shadow-sm transition hover:scale-110"
    >
      <span aria-hidden>{icon}</span>
    </a>
  );
}
