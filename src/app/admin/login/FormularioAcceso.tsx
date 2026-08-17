"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FormularioAcceso() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo entrar");
        setEnviando(false);
        return;
      }
      // `refresh` para que el layout vuelva a leer la cookie y aparezca el
      // botón de cerrar sesión.
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Sin conexión. Revisa el internet e intenta de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={entrar}
      className="mt-5 rounded-2xl border-2 border-stone-warm-300 bg-white p-5"
    >
      <label
        htmlFor="password"
        className="block font-display text-sm font-bold text-jungle-800"
      >
        Contraseña
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-xl border-2 border-stone-warm-300 bg-cream-50 px-4 py-3 font-semibold outline-none focus:border-jungle-500"
      />

      {error && (
        <p role="alert" className="mt-3 text-sm font-bold text-lava-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando || password.length === 0}
        className="btn-3d btn-3d-press mt-4 w-full rounded-full bg-jungle-600 py-3 font-display font-bold text-white transition disabled:opacity-60"
      >
        {enviando ? "ENTRANDO…" : "ENTRAR"}
      </button>
    </form>
  );
}
