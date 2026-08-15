import Image from "next/image";

/** Fondo suave de la foto, acorde al color del modelo. */
const TINT: Record<string, string> = {
  Verde: "from-[#e7f4d4] via-[#dcedca] to-[#c5e3a8]",
  Azul: "from-[#e4f4fb] via-[#cfeaf6] to-[#9fd4ea]",
  Rojo: "from-[#fde8dc] via-[#f8d0b8] to-[#f4a574]",
  Marrón: "from-[#f6edd8] via-[#ead9b4] to-[#d4bc8a]",
  Rosa: "from-[#fde8f0] via-[#f8cddc] to-[#f09bb4]",
  Violeta: "from-[#f0e8fa] via-[#ddcef3] to-[#c4a6e6]",
  Amarillo: "from-[#fff8d6] via-[#ffe99a] to-[#f7d95c]",
  Naranja: "from-[#ffe8d2] via-[#ffd0a3] to-[#f4a05a]",
};

export function productTint(color?: string | null) {
  return TINT[color ?? ""] ?? "from-cream-50 via-cream-100 to-cream-200";
}

/**
 * Foto del producto con fallback al emoji del catálogo.
 * El padre debe tener `position: relative` y un tamaño definido si se usa `fill`.
 */
export default function ProductThumb({
  src,
  alt,
  emoji = "🦖",
  sizes = "200px",
  priority = false,
  className = "",
  imgClassName = "object-contain p-3",
}: {
  src?: string | null;
  alt: string;
  emoji?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  if (src) {
    return (
      <span className={`relative block h-full w-full ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={imgClassName}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={`grid h-full w-full place-items-center select-none text-6xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)] ${className}`}
    >
      {emoji}
    </span>
  );
}
