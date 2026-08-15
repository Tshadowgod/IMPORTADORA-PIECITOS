import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Accede a tu cuenta de Importadora Piecitos.",
};

/**
 * Marcador de la sección de cuenta.
 *
 * La autenticación todavía no está implementada: cuando se decida el proveedor
 * (Auth.js, Clerk, etc.) esta página pasa a ser el formulario de acceso.
 */
export default function CuentaPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <span className="relative mx-auto block h-28 w-28">
        <Image
          src="/brand/mascot-rex.webp"
          alt=""
          fill
          sizes="112px"
          className="object-contain mix-blend-multiply"
        />
      </span>
      <h1 className="mt-4 font-display text-2xl font-bold text-jungle-800">
        Mi cuenta
      </h1>
      <p className="mt-2 font-semibold text-jungle-900/75">
        El acceso a cuentas está en camino. Mientras tanto puedes comprar sin
        registrarte: solo necesitas tu nombre y un teléfono de contacto.
      </p>
      <Link
        href="/productos"
        className="btn-3d btn-3d-press mt-6 inline-block rounded-full bg-jungle-600 px-7 py-3 font-display font-bold text-white"
      >
        IR AL CATÁLOGO
      </Link>
    </div>
  );
}
