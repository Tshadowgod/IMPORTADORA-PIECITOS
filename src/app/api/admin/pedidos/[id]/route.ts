import { NextResponse } from "next/server";
import { haySesionAdmin } from "@/lib/admin-auth";
import { esEstado } from "@/lib/pedido-estados";
import { cambiarEstadoPedido } from "@/lib/pedidos";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/pedidos/:id — cambia el estado de un pedido.
 *
 * Es lo único que el panel puede modificar: los montos y los productos quedan
 * congelados como se guardaron al hacer el pedido.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await haySesionAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: crudo } = await params;
  const id = Number(crudo);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const estado = (body as { estado?: unknown } | null)?.estado;
  if (!esEstado(estado)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  try {
    const actualizado = await cambiarEstadoPedido(id, estado);
    if (!actualizado) {
      return NextResponse.json({ error: "Ese pedido no existe" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, estado });
  } catch (error) {
    console.error("[api/admin/pedidos]", error);
    return NextResponse.json({ error: "No se pudo guardar el cambio" }, { status: 500 });
  }
}
