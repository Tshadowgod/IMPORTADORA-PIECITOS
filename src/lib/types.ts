/** Tipos que viajan del backend al front (serializables, precios como number). */

export type Accent = "green" | "blue" | "pink" | "yellow" | "purple" | "orange";

export interface CategoryDTO {
  id: number;
  slug: string;
  name: string;
  subtitle: string | null;
  icon: string;
  /** Ilustración de la categoría (cuadrada, fondo crema). */
  image?: string;
  accent: Accent;
  inNav: boolean;
  sortOrder: number;
}

export interface ProductDTO {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  categorySlug: string | null;
  sizes: number[];
  images: string[];
  emoji: string;
  color: string | null;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
}

export interface CartLine {
  productId: number;
  slug: string;
  name: string;
  emoji: string;
  price: number;
  size: number;
  quantity: number;
  image?: string;
}

export interface OrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  city?: string;
  notes?: string;
  items: { productId: number; size: number; quantity: number }[];
}
