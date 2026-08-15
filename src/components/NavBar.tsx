"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { CategoryDTO } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  /** Coincide con ?categoria= para marcar el activo */
  category?: string;
}

function buildItems(categories: CategoryDTO[]): NavItem[] {
  const fromDb = categories
    .filter((c) => c.inNav)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map<NavItem>((c) => ({
      href: `/productos?categoria=${c.slug}`,
      label: c.name,
      icon: c.icon,
      category: c.slug,
    }));

  return [
    { href: "/", label: "INICIO", icon: "🏠" },
    ...fromDb,
    { href: "/contacto", label: "CONTACTO", icon: "🐾" },
  ];
}

function NavLinks({ categories }: { categories: CategoryDTO[] }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const activeCategory = params.get("categoria");
  const items = buildItems(categories);

  const isActive = (item: NavItem) => {
    if (item.category) return pathname === "/productos" && activeCategory === item.category;
    return pathname === item.href;
  };

  return (
    <ul className="no-scrollbar mx-auto flex max-w-[1400px] items-stretch gap-1 overflow-x-auto px-2 sm:gap-2 sm:px-4">
      {items.map((item) => {
        const active = isActive(item);
        return (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2 rounded-t-xl px-3 py-2.5 font-display text-sm font-bold tracking-wide transition sm:px-5 sm:py-3 sm:text-base ${
                active
                  ? "bg-sun-400 text-jungle-900 shadow-[inset_0_2px_0_rgba(255,255,255,0.5)]"
                  : "text-white/95 hover:bg-white/15"
              }`}
            >
              <span aria-hidden className="text-lg leading-none">
                {item.icon}
              </span>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function NavBar({ categories }: { categories: CategoryDTO[] }) {
  return (
    <nav
      aria-label="Categorías principales"
      className="jungle-bar sticky top-0 z-30 border-y-2 border-jungle-800/40"
    >
      <Suspense fallback={<div className="h-12" />}>
        <NavLinks categories={categories} />
      </Suspense>
    </nav>
  );
}
