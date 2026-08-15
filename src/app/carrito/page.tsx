"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { ENVIO_GRATIS_DESDE, formatBs } from "@/lib/format";

type Estado = "idle" | "enviando" | "ok" | "error";

export default function CarritoPage() {
  const { lines, updateQuantity, remove, subtotal, shipping, total, clear } = useCart();
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState("");
  const [codigo, setCodigo] = useState("");

  async function enviarPedido(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    setMensaje("");

    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: String(form.get("nombre") ?? ""),
      customerPhone: String(form.get("telefono") ?? ""),
      customerEmail: String(form.get("email") ?? ""),
      address: String(form.get("direccion") ?? ""),
      city: String(form.get("ciudad") ?? ""),
      notes: String(form.get("notas") ?? ""),
      items: lines.map((l) => ({
        productId: l.productId,
        size: l.size,
        quantity: l.quantity,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setEstado("error");
        setMensaje(data.error ?? "No se pudo registrar el pedido.");
        return;
      }
      setCodigo(data.code);
      setEstado("ok");
      clear();
    } catch {
      setEstado("error");
      setMensaje("Hubo un problema de conexión. Inténtalo de nuevo.");
    }
  }

  if (estado === "ok") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="relative mx-auto block h-32 w-32">
          <Image
            src="/brand/mascot-rex.webp"
            alt=""
            fill
            sizes="128px"
            className="object-contain mix-blend-multiply"
          />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-jungle-800">
          ¡Pedido recibido!
        </h1>
        <p className="mt-2 text-base font-semibold text-jungle-900/80">
          Tu código de seguimiento es{" "}
          <strong className="font-display text-lava-600">{codigo}</strong>. Te
          contactaremos por WhatsApp para confirmar la entrega.
        </p>
        <Link
          href="/productos"
          className="btn-3d btn-3d-press mt-6 inline-block rounded-full bg-jungle-600 px-7 py-3 font-display font-bold text-white"
        >
          SEGUIR COMPRANDO
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="relative mx-auto block h-32 w-32">
          <Image
            src="/productos/bebe-huevito-amarillo.webp"
            alt=""
            fill
            sizes="128px"
            className="object-contain"
          />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-jungle-800">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 font-semibold text-jungle-900/70">
          Elige tus tenis favoritos y vuelve por aquí.
        </p>
        <Link
          href="/productos"
          className="btn-3d btn-3d-press mt-6 inline-block rounded-full bg-jungle-600 px-7 py-3 font-display font-bold text-white"
        >
          VER CATÁLOGO
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-bold text-jungle-800 sm:text-3xl">
        <span aria-hidden className="mr-2 text-lava-500">
          🐾
        </span>
        FINALIZAR COMPRA
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Datos del cliente */}
        <form onSubmit={enviarPedido} className="space-y-4">
          <fieldset className="rounded-2xl border-2 border-stone-warm-300 bg-white p-5">
            <legend className="px-2 font-display text-base font-bold text-jungle-800">
              Datos de contacto
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo name="nombre" label="Nombre completo" required autoComplete="name" />
              <Campo
                name="telefono"
                label="Teléfono / WhatsApp"
                required
                type="tel"
                autoComplete="tel"
                placeholder="7XXXXXXX"
              />
              <Campo name="email" label="Correo (opcional)" type="email" autoComplete="email" />
              <Campo name="ciudad" label="Ciudad" autoComplete="address-level2" />
              <div className="sm:col-span-2">
                <Campo name="direccion" label="Dirección de entrega" autoComplete="street-address" />
              </div>
              <div className="sm:col-span-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-jungle-900">
                    Notas para el repartidor
                  </span>
                  <textarea
                    name="notas"
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-lg border-2 border-stone-warm-300 bg-cream-50 px-3 py-2 font-semibold text-jungle-900 outline-none focus:border-jungle-500"
                  />
                </label>
              </div>
            </div>
          </fieldset>

          {estado === "error" && (
            <p role="alert" className="rounded-lg bg-berry-400/20 px-4 py-3 text-sm font-bold text-berry-500">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={estado === "enviando"}
            className="btn-3d btn-3d-press w-full rounded-full bg-jungle-600 py-3.5 font-display text-lg font-bold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {estado === "enviando" ? "ENVIANDO…" : `CONFIRMAR PEDIDO · ${formatBs(total)}`}
          </button>
        </form>

        {/* Resumen */}
        <aside className="h-fit rounded-2xl border-2 border-stone-warm-300 bg-white p-5">
          <h2 className="font-display text-lg font-bold text-jungle-800">Tu pedido</h2>

          <ul className="mt-4 divide-y divide-stone-warm-200">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}`} className="flex gap-3 py-3">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                  {l.image ? (
                    <Image src={l.image} alt="" fill sizes="56px" className="object-contain p-0.5" />
                  ) : (
                    <span aria-hidden className="grid h-full w-full place-items-center text-2xl">
                      {l.emoji}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold text-jungle-900">
                    {l.name}
                  </p>
                  <p className="text-xs font-bold text-jungle-900/60">Talla {l.size}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center rounded-md border border-stone-warm-300 text-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(l.productId, l.size, l.quantity - 1)}
                        aria-label={`Quitar una unidad de ${l.name}`}
                        className="px-2 font-bold"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center font-bold">{l.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(l.productId, l.size, l.quantity + 1)}
                        aria-label={`Agregar una unidad de ${l.name}`}
                        className="px-2 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(l.productId, l.size)}
                      className="text-xs font-bold text-berry-500 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <span className="font-display font-bold text-lava-600">
                  {formatBs(l.price * l.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1 border-t-2 border-stone-warm-300 pt-3 text-sm font-semibold text-jungle-900">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatBs(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Envío</dt>
              <dd>{shipping === 0 ? "Gratis 🎉" : formatBs(shipping)}</dd>
            </div>
            {subtotal < ENVIO_GRATIS_DESDE && (
              <p className="rounded-lg bg-sun-300/50 px-3 py-2 text-xs font-bold">
                Agrega {formatBs(ENVIO_GRATIS_DESDE - subtotal)} más y el envío es gratis.
              </p>
            )}
            <div className="flex justify-between border-t border-stone-warm-300 pt-2 font-display text-xl font-bold">
              <dt>Total</dt>
              <dd className="text-lava-600">{formatBs(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Campo({
  name,
  label,
  ...rest
}: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-jungle-900">{label}</span>
      <input
        name={name}
        {...rest}
        className="w-full rounded-lg border-2 border-stone-warm-300 bg-cream-50 px-3 py-2 font-semibold text-jungle-900 outline-none focus:border-jungle-500"
      />
    </label>
  );
}
