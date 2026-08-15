"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, ProductDTO } from "@/lib/types";
import { calcularEnvio } from "@/lib/format";

const STORAGE_KEY = "piecitos.cart.v1";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (product: ProductDTO, size: number, quantity?: number) => void;
  updateQuantity: (productId: number, size: number, quantity: number) => void;
  remove: (productId: number, size: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Una línea del carrito se identifica por producto + talla. */
const sameLine = (l: CartLine, productId: number, size: number) =>
  l.productId === productId && l.size === size;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Rehidrata desde localStorage una sola vez, ya en el cliente.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // Carrito corrupto o storage bloqueado: se arranca vacío.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Sin espacio o en modo privado: el carrito sigue vivo en memoria.
    }
  }, [lines, hydrated]);

  // Cierra el panel con Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const add = useCallback((product: ProductDTO, size: number, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, product.id, size));
      if (existing) {
        return prev.map((l) =>
          sameLine(l, product.id, size)
            ? { ...l, quantity: Math.min(l.quantity + quantity, 20) }
            : l,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          emoji: product.emoji,
          price: product.price,
          image: product.images[0],
          size,
          quantity,
        },
      ];
    });
    setOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: number, size: number, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => !sameLine(l, productId, size))
        : prev.map((l) =>
            sameLine(l, productId, size) ? { ...l, quantity: Math.min(quantity, 20) } : l,
          ),
    );
  }, []);

  const remove = useCallback((productId: number, size: number) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, productId, size)));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
    const shipping = lines.length ? calcularEnvio(subtotal) : 0;
    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add,
      updateQuantity,
      remove,
      clear: () => setLines([]),
    };
  }, [lines, isOpen, add, updateQuantity, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
