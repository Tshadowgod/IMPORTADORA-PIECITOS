import Image from "next/image";
import Link from "next/link";
import type { Accent, CategoryDTO } from "@/lib/types";

const ACCENT_TEXT: Record<Accent, string> = {
  green: "text-jungle-800",
  blue: "text-[#2f7fd0]",
  pink: "text-berry-500",
  yellow: "text-sun-500",
  purple: "text-grape-400",
  orange: "text-lava-500",
};

const ACCENT_RING: Record<Accent, string> = {
  green: "ring-jungle-400/50",
  blue: "ring-[#7ec8e3]/70",
  pink: "ring-berry-400/50",
  yellow: "ring-sun-400/70",
  purple: "ring-grape-400/50",
  orange: "ring-lava-400/50",
};

export default function CategoryTiles({ categories }: { categories: CategoryDTO[] }) {
  const items = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      aria-label="Explorar por categoría"
      className="border-b-2 border-stone-warm-300/60 bg-cream-200/70 py-10"
    >
      <div className="mx-auto mb-5 max-w-[1400px] px-4 sm:px-6">
        <h2 className="font-display text-lg font-bold text-jungle-800 sm:text-xl">
          Elige tu manada
        </h2>
        <p className="text-sm font-semibold text-jungle-900/65">
          Modelos para cada explorador, de 0 a 12 años.
        </p>
      </div>
      <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-6">
        {items.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/productos?categoria=${cat.slug}`}
              className="stone-tile group flex h-full flex-col items-center gap-2 px-3 py-4 text-center transition hover:-translate-y-1 hover:brightness-105"
              style={{ borderRadius: "46% 46% 20% 20% / 26% 26% 12% 12%" }}
            >
              <span
                className={`relative mt-1 grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-cream-50 ring-4 sm:h-[4.75rem] sm:w-[4.75rem] ${
                  ACCENT_RING[cat.accent] ?? ACCENT_RING.green
                }`}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <span aria-hidden className="text-4xl sm:text-5xl">
                    {cat.icon}
                  </span>
                )}
              </span>
              <span
                className={`font-display text-sm font-bold leading-tight sm:text-base ${
                  ACCENT_TEXT[cat.accent] ?? ACCENT_TEXT.green
                }`}
              >
                {cat.name}
              </span>
              {cat.subtitle && (
                <span
                  className={`font-display text-[0.7rem] font-semibold leading-none ${
                    ACCENT_TEXT[cat.accent] ?? ACCENT_TEXT.green
                  }`}
                >
                  {cat.subtitle}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
