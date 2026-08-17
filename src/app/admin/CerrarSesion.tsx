"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function CerrarSesion() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);
  const [, iniciarTransicion] = useTransition();

  return (
    <button
      type="button"
      disabled={saliendo}
      onClick={async () => {
        setSaliendo(true);
        await fetch("/api/admin/session", { method: "DELETE" });
        iniciarTransicion(() => {
          router.replace("/admin/login");
          // La lista de pedidos está cacheada del lado del cliente: sin esto
          // se vería un instante al volver a entrar.
          router.refresh();
        });
      }}
      className="rounded-full bg-sun-400 px-4 py-2 text-sm font-bold text-jungle-900 transition hover:bg-sun-300 disabled:opacity-60"
    >
      {saliendo ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
