import Image from "next/image";

export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="text-center">
        <span className="relative mx-auto block h-24 w-24">
          <Image
            src="/brand/mascot-rex.webp"
            alt=""
            fill
            sizes="96px"
            className="animate-float-soft object-contain mix-blend-multiply"
          />
        </span>
        <p className="mt-3 font-display font-bold text-jungle-800">Cargando la manada…</p>
      </div>
    </div>
  );
}
