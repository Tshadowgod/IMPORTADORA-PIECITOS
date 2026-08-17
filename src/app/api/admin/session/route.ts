import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_SESION,
  DURACION_SESION,
  adminConfigurado,
  crearToken,
  passwordCorrecta,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** POST /api/admin/session — entrar al panel. */
export async function POST(request: Request) {
  if (!adminConfigurado()) {
    return NextResponse.json(
      { error: "El panel no está habilitado: falta ADMIN_PASSWORD en el servidor." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const password =
    body && typeof body === "object" && typeof (body as { password?: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  // Medio segundo de espera en cada intento: suficiente para que probar
  // contraseñas al azar contra este endpoint no valga la pena.
  await new Promise((resolver) => setTimeout(resolver, 500));

  if (!passwordCorrecta(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_SESION, crearToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION_SESION,
  });

  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/session — cerrar sesión. */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_SESION);
  return NextResponse.json({ ok: true });
}
