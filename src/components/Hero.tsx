"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import JungleBackdrop from "./JungleBackdrop";

interface Slide {
  titulo: string[];
  lineaDestacada: number;
  subtitulo: string;
  cta: { label: string; href: string };
  cartel: string[];
  image: string;
  imageAlt: string;
}

const SLIDES: Slide[] = [
  {
    titulo: ["PISADAS GIGANTES,", "AVENTURAS", "SIN LÍMITES"],
    lineaDestacada: 1,
    subtitulo: "Tenis en forma de dinosaurio para pequeños exploradores.",
    cta: { label: "VER COLECCIÓN", href: "/productos?categoria=todos" },
    cartel: ["¡LUCES", "QUE DEJAN", "HUELLA!"],
    image: "/productos/dino-rex-verde.webp",
    imageAlt: "Tenis Dino Rex Verde",
  },
  {
    titulo: ["LA MANADA", "CRECE", "CONTIGO"],
    lineaDestacada: 1,
    subtitulo: "Tallas de la 17 a la 33, para bebés y exploradores de 0 a 12 años.",
    cta: { label: "VER TALLAS", href: "/productos" },
    cartel: ["¡TODAS", "LAS", "TALLAS!"],
    image: "/productos/bebe-huevito-amarillo.webp",
    imageAlt: "Tenis Bebé Huevito Amarillo",
  },
  {
    titulo: ["COMBOS DINO,", "LLEVA MÁS", "PAGA MENOS"],
    lineaDestacada: 1,
    subtitulo: "Arma tu combo de dos pares y ahorra en cada aventura.",
    cta: { label: "VER COMBOS", href: "/productos?categoria=colecciones" },
    cartel: ["¡2 PARES", "AL MEJOR", "PRECIO!"],
    image: "/brand/combo-dinos.webp",
    imageAlt: "Combo de tenis dinosaurio",
  },
  {
    titulo: ["ENVÍO GRATIS,", "DESDE", "BS. 150"],
    lineaDestacada: 1,
    subtitulo: "Recibe tu pedido en casa sin costo adicional en todo el país.",
    cta: { label: "COMPRAR AHORA", href: "/productos?categoria=ofertas" },
    cartel: ["¡ENVÍO", "SIN", "COSTO!"],
    image: "/productos/raptor-naranja.webp",
    imageAlt: "Tenis Raptor Naranja",
  },
];

const ACCESOS = [
  { image: "/productos/dino-rex-verde.webp", label: ["NUEVO"], href: "/productos?categoria=todos" },
  { image: "/productos/triceratops-azul.webp", label: ["MÁS", "VENDIDOS"], href: "/productos?categoria=ninos" },
  { image: "/productos/pteroluz-violeta.webp", label: ["PERSONAJES"], href: "/productos?categoria=colecciones" },
];

const INTERVALO = 6500;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVALO);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Promociones destacadas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative overflow-hidden border-b-4 border-jungle-800/25"
    >
      <JungleBackdrop className="absolute inset-0 h-full w-full" />

      <div className="relative mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-16">
        <div key={index} className="animate-fade-up max-w-xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-jungle-700/20 bg-white/80 px-3 py-1 text-xs font-extrabold tracking-wide text-jungle-800 shadow-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-lava-500" />
            Calzados infantiles · Bolivia
          </p>
          <h1 className="font-display text-4xl leading-[1.02] sm:text-5xl lg:text-[3.4rem]">
            {slide.titulo.map((linea, i) => (
              <span
                key={linea}
                className="block"
                style={{
                  color: i === slide.lineaDestacada ? "#e2571e" : "#1e3714",
                  WebkitTextStroke: "3px #ffffff",
                  paintOrder: "stroke fill",
                  textShadow: "0 4px 0 rgba(0,0,0,0.16)",
                }}
              >
                {linea}
              </span>
            ))}
          </h1>

          <p className="mt-4 max-w-md rounded-xl border border-white/60 bg-white/80 px-3.5 py-2.5 font-body text-base font-bold text-jungle-900 shadow-sm backdrop-blur-sm sm:text-lg">
            {slide.subtitulo}
          </p>

          <Link
            href={slide.cta.href}
            className="btn-3d btn-3d-press mt-6 inline-flex items-center gap-3 rounded-full border-2 border-jungle-800/50 bg-jungle-600 px-7 py-3.5 font-display text-lg font-bold tracking-wide text-white transition hover:brightness-110"
          >
            {slide.cta.label}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div key={`img-${index}`} className="animate-fade-up relative flex items-center justify-center">
          <div className="absolute h-56 w-56 rounded-full bg-white/35 blur-2xl sm:h-72 sm:w-72 lg:h-80 lg:w-80" />
          <div className="animate-float-soft relative h-56 w-56 sm:h-72 sm:w-72 lg:h-[22rem] lg:w-[22rem]">
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 352px"
              className="object-contain drop-shadow-[0_28px_28px_rgba(30,55,20,0.35)]"
            />
          </div>

          <div
            className="btn-3d absolute -right-1 bottom-4 hidden -rotate-6 flex-col items-center rounded-lg border-4 border-wood-500 px-4 py-3 text-center sm:flex lg:right-8"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, #c68c47 0px, #c68c47 8px, #b57d3c 8px, #b57d3c 16px)",
            }}
          >
            {slide.cartel.map((linea) => (
              <span
                key={linea}
                className="font-display text-base font-bold leading-tight text-white sm:text-xl"
                style={{ textShadow: "0 2px 2px rgba(0,0,0,0.45)" }}
              >
                {linea}
              </span>
            ))}
          </div>
        </div>

        <ul className="absolute right-3 top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
          {ACCESOS.map((acceso) => (
            <li key={acceso.label.join(" ")}>
              <Link
                href={acceso.href}
                className="btn-3d btn-3d-press flex h-[5.25rem] w-[5.25rem] flex-col items-center justify-center rounded-full border-2 border-stone-warm-400 bg-cream-50/95 text-center transition hover:brightness-105"
              >
                <span className="relative mb-0.5 h-9 w-9">
                  <Image
                    src={acceso.image}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </span>
                {acceso.label.map((l) => (
                  <span
                    key={l}
                    className="font-display text-[0.58rem] font-bold leading-tight text-jungle-800"
                  >
                    {l}
                  </span>
                ))}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Promoción anterior"
          className="btn-3d absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-white/70 bg-white/85 text-xl font-bold text-jungle-800 backdrop-blur-sm transition hover:bg-white lg:grid"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Promoción siguiente"
          className="btn-3d absolute right-28 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-white/70 bg-white/85 text-xl font-bold text-jungle-800 backdrop-blur-sm transition hover:bg-white xl:grid"
        >
          ›
        </button>
      </div>

      <div className="relative flex justify-center gap-2 pb-5">
        {SLIDES.map((s, i) => (
          <button
            key={s.titulo.join()}
            type="button"
            onClick={() => go(i)}
            aria-label={`Ir a la promoción ${i + 1} de ${SLIDES.length}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-2.5 rounded-full border-2 border-white/80 transition-all ${
              i === index ? "w-8 bg-jungle-600" : "w-2.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
