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

export default function CategoryTiles({ categories }: { categories: CategoryDTO[] }) {
  const items = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section aria-label="Explorar por categoría" className="py-12">
      <div className="mx-auto mb-6 max-w-[1400px] px-4 sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-lava-500">Explora</p>
        <h2 className="font-display text-2xl font-bold text-jungle-800 sm:text-3xl">
          Elige tu manada
        </h2>
        <p className="mt-1 text-sm font-semibold text-jungle-900/60">
          Modelos para cada explorador, de 0 a 12 años.
        </p>
      </div>
      <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-6">
        {items.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/productos?categoria=${cat.slug}`}
              className="group flex h-full flex-col items-center gap-2 rounded-3xl bg-white px-3 py-5 text-center shadow-[0_8px_24px_rgba(90,74,48,0.08)] ring-1 ring-stone-warm-200/70 transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(90,74,48,0.14)] hover:ring-jungle-400/40"
            >
              <span className="relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-2xl bg-cream-100 sm:h-20 sm:w-20">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <span aria-hidden className="grid h-full w-full place-items-center text-4xl">
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
                <span className="text-[0.7rem] font-semibold text-jungle-900/50">
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
