import Link from "next/link";
import { redirect } from "next/navigation";
import { isDbConfigured } from "@/db";
import { haySesionAdmin } from "@/lib/admin-auth";
import { formatBs } from "@/lib/format";
import { ESTADOS, ESTILO_ESTADO, esEstado } from "@/lib/pedido-estados";
import { getPedidos, type Pedido } from "@/lib/pedidos";
import PedidoCard from "./PedidoCard";

export const dynamic = "force-dynamic";

/** "2026-08-17" en hora de Bolivia, para comparar días sin líos de zona. */
function diaBoliviano(fecha: Date): string {
  return fecha.toLocaleDateString("en-CA", { timeZone: "America/La_Paz" });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  if (!(await haySesionAdmin())) redirect("/admin/login");

  const { estado: filtroCrudo } = await searchParams;
  const filtro = esEstado(filtroCrudo) ? filtroCrudo : null;

  const pedidos = await getPedidos();
  const visibles = filtro ? pedidos.filter((p) => p.estado === filtro) : pedidos;

  const hoy = diaBoliviano(new Date());
  const mes = hoy.slice(0, 7);
  const pedidosHoy = pedidos.filter((p) => diaBoliviano(new Date(p.createdAt)) === hoy);
  // Lo cancelado no se cobra, así que no cuenta como venta del mes.
  const ventasDelMes = pedidos
    .filter((p) => p.estado !== "cancelado" && diaBoliviano(new Date(p.createdAt)).startsWith(mes))
    .reduce((suma, p) => suma + p.total, 0);

  const porEstado = (e: Pedido["estado"]) => pedidos.filter((p) => p.estado === e).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-jungle-800">Pedidos</h1>

      {!isDbConfigured && (
        <p className="mt-3 rounded-2xl border-2 border-lava-500/40 bg-white p-4 text-sm font-semibold text-jungle-900/80">
          La base de datos no está conectada en este entorno, así que no hay pedidos que
          mostrar. Configura <code className="font-mono">DATABASE_URL</code> y recarga.
        </p>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Dato titulo="Pedidos hoy" valor={String(pedidosHoy.length)} />
        <Dato titulo="Pendientes" valor={String(porEstado("pendiente"))} destacado />
        <Dato titulo="Ventas del mes" valor={formatBs(ventasDelMes)} />
        <Dato titulo="Total pedidos" valor={String(pedidos.length)} />
      </dl>

      <nav aria-label="Filtrar por estado" className="mt-6 flex flex-wrap gap-2">
        <Pastilla href="/admin" activa={filtro === null}>
          Todos ({pedidos.length})
        </Pastilla>
        {ESTADOS.map((e) => (
          <Pastilla key={e} href={`/admin?estado=${e}`} activa={filtro === e}>
            {ESTILO_ESTADO[e].emoji} {ESTILO_ESTADO[e].etiqueta} ({porEstado(e)})
          </Pastilla>
        ))}
      </nav>

      {visibles.length === 0 ? (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-stone-warm-300 p-8 text-center font-semibold text-jungle-900/60">
          {pedidos.length === 0
            ? "Todavía no hay pedidos. Cuando alguien compre en la tienda, aparecerá acá."
            : "Ningún pedido en este estado."}
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {visibles.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      )}
    </div>
  );
}

function Dato({
  titulo,
  valor,
  destacado = false,
}: {
  titulo: string;
  valor: string;
  destacado?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border-2 p-4 ${
        destacado
          ? "border-sun-500/40 bg-sun-300"
          : "border-stone-warm-300 bg-white"
      }`}
    >
      <dt className="text-xs font-bold uppercase tracking-wide text-jungle-900/60">
        {titulo}
      </dt>
      <dd className="mt-1 font-display text-2xl font-bold text-jungle-800">{valor}</dd>
    </div>
  );
}

function Pastilla({
  href,
  activa,
  children,
}: {
  href: string;
  activa: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={activa ? "page" : undefined}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        activa
          ? "bg-jungle-600 text-white"
          : "border-2 border-stone-warm-300 bg-white text-jungle-800 hover:bg-cream-100"
      }`}
    >
      {children}
    </Link>
  );
}
