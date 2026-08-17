"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ESTADOS, ESTILO_ESTADO, type Estado } from "@/lib/pedido-estados";

/**
 * Cambia el estado de un pedido.
 *
 * Muestra el valor elegido de inmediato y, si el servidor lo rechaza, vuelve al
 * anterior con el error a la vista: así no queda la duda de si se guardó.
 */
export default function SelectorEstado({ id, estado }: { id: number; estado: Estado }) {
  const router = useRouter();
  const [valor, setValor] = useState<Estado>(estado);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cambiar(nuevo: Estado) {
    const anterior = valor;
    setValor(nuevo);
    setGuardando(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevo }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setValor(anterior);
        setError(data?.error ?? "No se pudo guardar");
      } else {
        // Para que los contadores de arriba se actualicen.
        router.refresh();
      }
    } catch {
      setValor(anterior);
      setError("Sin conexión");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="text-right">
      <label
        htmlFor={`estado-${id}`}
        className="block text-xs font-bold uppercase tracking-wide text-jungle-900/50"
      >
        Estado
      </label>
      <select
        id={`estado-${id}`}
        value={valor}
        disabled={guardando}
        onChange={(e) => cambiar(e.target.value as Estado)}
        className="mt-1 rounded-full border-2 border-stone-warm-300 bg-cream-50 px-3 py-2 font-bold text-jungle-800 outline-none focus:border-jungle-500 disabled:opacity-60"
      >
        {ESTADOS.map((e) => (
          <option key={e} value={e}>
            {ESTILO_ESTADO[e].emoji} {ESTILO_ESTADO[e].etiqueta}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-1 text-xs font-bold text-lava-600">
          {error}
        </p>
      )}
    </div>
  );
}
