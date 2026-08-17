import { formatBs } from "@/lib/format";
import { ESTILO_ESTADO, whatsappCliente } from "@/lib/pedido-estados";
import type { Pedido } from "@/lib/pedidos";
import SelectorEstado from "./SelectorEstado";

/** Fecha y hora en la zona de Bolivia: "17 ago, 14:35". */
function fechaBoliviana(iso: string): string {
  return new Date(iso).toLocaleString("es-BO", {
    timeZone: "America/La_Paz",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PedidoCard({ pedido }: { pedido: Pedido }) {
  const estilo = ESTILO_ESTADO[pedido.estado];
  const wa = whatsappCliente(pedido.customerPhone);

  return (
    <article className="rounded-2xl border-2 border-stone-warm-300 bg-white p-4 sm:p-5">
      <header className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <div className="mr-auto">
          <p className="font-display text-lg font-bold leading-tight text-jungle-800">
            {pedido.customerName}
          </p>
          <p className="text-xs font-bold uppercase tracking-wide text-jungle-900/50">
            {pedido.code} · {fechaBoliviana(pedido.createdAt)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${estilo.clase}`}
        >
          {estilo.emoji} {estilo.etiqueta}
        </span>
      </header>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`tel:${pedido.customerPhone.replace(/\s/g, "")}`}
          className="rounded-full border-2 border-stone-warm-300 px-3 py-1.5 text-sm font-bold text-jungle-800 transition hover:bg-cream-100"
        >
          📞 {pedido.customerPhone}
        </a>
        {wa && (
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-3 py-1.5 text-sm font-bold text-white transition hover:brightness-105"
          >
            💬 Escribir por WhatsApp
          </a>
        )}
        {pedido.city && (
          <span className="rounded-full bg-cream-100 px-3 py-1.5 text-sm font-bold text-jungle-900/80">
            🏙️ {pedido.city}
          </span>
        )}
      </div>

      {(pedido.notes || pedido.address || pedido.customerEmail) && (
        <dl className="mt-3 space-y-1 rounded-xl bg-cream-100 px-3 py-2 text-sm font-semibold text-jungle-900/80">
          {pedido.notes && (
            <div className="flex gap-2">
              <dt className="shrink-0">📝 Notas:</dt>
              <dd>{pedido.notes}</dd>
            </div>
          )}
          {/* Dirección y correo ya no se piden en el checkout, pero los pedidos
              viejos pueden tenerlos guardados. */}
          {pedido.address && (
            <div className="flex gap-2">
              <dt className="shrink-0">🏠 Dirección:</dt>
              <dd>{pedido.address}</dd>
            </div>
          )}
          {pedido.customerEmail && (
            <div className="flex gap-2">
              <dt className="shrink-0">✉️ Correo:</dt>
              <dd>{pedido.customerEmail}</dd>
            </div>
          )}
        </dl>
      )}

      <ul className="mt-4 divide-y divide-stone-warm-200 border-y border-stone-warm-200">
        {pedido.items.map((item) => (
          <li key={item.id} className="flex items-baseline gap-3 py-2 text-sm">
            <span className="font-bold text-jungle-800">{item.quantity}×</span>
            <span className="mr-auto font-semibold">
              {item.productName}
              <span className="text-jungle-900/60"> · talla {item.size}</span>
            </span>
            <span className="shrink-0 font-bold">
              {formatBs(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <dl className="text-sm font-semibold text-jungle-900/70">
          <div className="flex gap-2">
            <dt>Subtotal:</dt>
            <dd>{formatBs(pedido.subtotal)}</dd>
          </div>
          <div className="flex gap-2">
            <dt>Envío:</dt>
            <dd>{pedido.shipping === 0 ? "Gratis" : formatBs(pedido.shipping)}</dd>
          </div>
          <div className="flex gap-2 font-display text-lg font-bold text-jungle-800">
            <dt>Total:</dt>
            <dd>{formatBs(pedido.total)}</dd>
          </div>
        </dl>

        <SelectorEstado id={pedido.id} estado={pedido.estado} />
      </div>
    </article>
  );
}
