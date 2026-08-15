import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().email("Correo inválido") });

/** POST /api/subscribe — alta en la lista de novedades ("Únete a la manada"). */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  if (!db) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    await db
      .insert(subscribers)
      .values({ email: parsed.data.email.toLowerCase() })
      .onConflictDoNothing({ target: subscribers.email });
    return NextResponse.json({ ok: true, persisted: true });
  } catch (error) {
    console.error("[api/subscribe]", error);
    return NextResponse.json({ error: "No se pudo registrar el correo" }, { status: 500 });
  }
}
