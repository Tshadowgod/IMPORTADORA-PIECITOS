import Image from "next/image";

/**
 * Selva ilustrada detrás del hero.
 * La foto da profundidad; el degradado mantiene el texto legible.
 */
export default function JungleBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`overflow-hidden ${className}`}>
      <Image
        src="/brand/jungle-hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-ken-burns object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-cream-100/85 via-cream-50/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-cream-100/70 to-transparent" />
    </div>
  );
}
