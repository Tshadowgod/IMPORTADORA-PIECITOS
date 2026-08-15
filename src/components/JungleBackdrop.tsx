import Image from "next/image";

/**
 * Selva ilustrada detrás del hero.
 * El degradado oscurece el lado izquierdo para que el título blanco se lea.
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
      <div className="absolute inset-0 bg-linear-to-r from-jungle-900/80 via-jungle-800/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-cream-100 to-transparent" />
    </div>
  );
}
