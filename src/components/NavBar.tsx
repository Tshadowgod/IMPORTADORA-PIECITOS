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
    <ul className="no-scrollbar mx-auto flex max-w-[1400px] items-center gap-0.5 overflow-x-auto px-2 py-1.5 sm:gap-1 sm:px-4">
      {items.map((item) => {
        const active = isActive(item);
        return (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 font-display text-[0.8rem] font-bold tracking-wide transition sm:px-4 sm:text-sm ${
                active
                  ? "bg-sun-400 text-jungle-900 shadow-sm"
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
      className="jungle-bar sticky top-0 z-30 shadow-[0_4px_16px_rgba(30,55,20,0.18)]"
    >
      <Suspense fallback={<div className="h-12" />}>
        <NavLinks categories={categories} />
      </Suspense>
    </nav>
  );
}
