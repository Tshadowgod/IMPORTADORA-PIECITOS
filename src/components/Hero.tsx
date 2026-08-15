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
  cartel: string;
  image: string;
  imageAlt: string;
}

const SLIDES: Slide[] = [
  {
    titulo: ["PISADAS GIGANTES,", "AVENTURAS", "SIN LÍMITES"],
    lineaDestacada: 1,
    subtitulo: "Tenis en forma de dinosaurio para pequeños exploradores.",
    cta: { label: "Ver colección", href: "/productos?categoria=todos" },
    cartel: "Luces LED",
    image: "/productos/dino-rex-verde.webp",
    imageAlt: "Tenis Dino Rex Verde",
  },
  {
    titulo: ["LA MANADA", "CRECE", "CONTIGO"],
    lineaDestacada: 1,
    subtitulo: "Tallas de la 17 a la 33, para bebés y exploradores de 0 a 12 años.",
    cta: { label: "Ver tallas", href: "/productos" },
    cartel: "Tallas 17–33",
    image: "/productos/bebe-huevito-amarillo.webp",
    imageAlt: "Tenis Bebé Huevito Amarillo",
  },
  {
    titulo: ["COMBOS DINO,", "LLEVA MÁS", "PAGA MENOS"],
    lineaDestacada: 1,
    subtitulo: "Arma tu combo de dos pares y ahorra en cada aventura.",
    cta: { label: "Ver combos", href: "/productos?categoria=colecciones" },
    cartel: "2× mejor precio",
    image: "/brand/combo-dinos.webp",
    imageAlt: "Combo de tenis dinosaurio",
  },
  {
    titulo: ["ENVÍO GRATIS,", "DESDE", "BS. 150"],
    lineaDestacada: 1,
    subtitulo: "Recibe tu pedido en casa sin costo adicional en todo el país.",
    cta: { label: "Comprar ahora", href: "/productos?categoria=ofertas" },
    cartel: "Envío gratis",
    image: "/productos/raptor-naranja.webp",
    imageAlt: "Tenis Raptor Naranja",
  },
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
      className="relative overflow-hidden"
    >
      <JungleBackdrop className="absolute inset-0 h-full w-full" />

      <div className="relative mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-20">
        <div key={index} className="animate-fade-up max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold tracking-wide text-white ring-1 ring-white/25 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-sun-400" />
            Calzados infantiles · Bolivia
          </p>
          <h1 className="font-display text-4xl leading-[1.05] text-white sm:text-5xl lg:text-[3.35rem]">
            {slide.titulo.map((linea, i) => (
              <span
                key={linea}
                className="block drop-shadow-[0_3px_12px_rgba(0,0,0,0.35)]"
                style={{ color: i === slide.lineaDestacada ? "#f7d95c" : "#ffffff" }}
              >
                {linea}
              </span>
            ))}
          </h1>

          <p className="mt-4 max-w-md text-base font-semibold text-white/90 sm:text-lg">
            {slide.subtitulo}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={slide.cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-sun-400 px-7 py-3 font-display text-base font-bold text-jungle-900 shadow-[0_8px_20px_rgba(240,193,28,0.35)] transition hover:bg-sun-300"
            >
              {slide.cta.label}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/productos?categoria=ofertas"
              className="inline-flex items-center rounded-full bg-white/15 px-5 py-3 font-display text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur-sm transition hover:bg-white/25"
            >
              Ver ofertas
            </Link>
          </div>
        </div>

        <div key={`img-${index}`} className="animate-fade-up relative flex items-center justify-center">
          <div className="absolute h-52 w-52 rounded-full bg-cream-50/80 blur-0 sm:h-72 sm:w-72 lg:h-80 lg:w-80" />
          <div className="absolute h-52 w-52 rounded-full bg-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:h-72 sm:w-72 lg:h-80 lg:w-80" />
          <div className="animate-float-soft relative h-56 w-56 sm:h-72 sm:w-72 lg:h-[22rem] lg:w-[22rem]">
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 352px"
              className="object-contain drop-shadow-[0_24px_28px_rgba(30,55,20,0.35)]"
            />
          </div>
          <span className="absolute bottom-2 right-2 rounded-full bg-lava-500 px-3 py-1 font-display text-xs font-bold text-white shadow-md sm:bottom-6 sm:right-10 sm:text-sm">
            {slide.cartel}
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-center gap-3 pb-6">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Promoción anterior"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-lg font-bold text-jungle-800 backdrop-blur-sm transition hover:bg-white"
        >
          ‹
        </button>
        {SLIDES.map((s, i) => (
          <button
            key={s.titulo.join()}
            type="button"
            onClick={() => go(i)}
            aria-label={`Ir a la promoción ${i + 1} de ${SLIDES.length}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-7 bg-sun-400" : "w-2 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Promoción siguiente"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-lg font-bold text-jungle-800 backdrop-blur-sm transition hover:bg-white"
        >
          ›
        </button>
      </div>
    </section>
  );
}
