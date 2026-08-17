import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Acceso al panel de administración: una sola contraseña, guardada en la
 * variable de entorno `ADMIN_PASSWORD` del servidor.
 *
 * No hay tabla de usuarios porque no hace falta: al panel entra la dueña de la
 * tienda y nadie más. La contraseña nunca sale del servidor; lo que viaja al
 * navegador es una cookie httpOnly con un token firmado (`vencimiento.firma`),
 * así que no se puede fabricar sin conocer la contraseña. Cambiar
 * `ADMIN_PASSWORD` invalida al instante todas las sesiones abiertas.
 */

export const COOKIE_SESION = "piecitos_admin";

/** 12 horas: cubre una jornada de trabajo sin dejar la sesión abierta para siempre. */
export const DURACION_SESION = 60 * 60 * 12;

/** La contraseña configurada, o null si el panel todavía no está habilitado. */
function claveServidor(): string | null {
  const clave = process.env.ADMIN_PASSWORD;
  return clave && clave.length >= 8 ? clave : null;
}

/** El panel solo funciona si hay una contraseña de al menos 8 caracteres. */
export function adminConfigurado(): boolean {
  return claveServidor() !== null;
}

function firmar(vencimiento: number, clave: string): string {
  return createHmac("sha256", clave).update(`v1.${vencimiento}`).digest("hex");
}

/** Comparación en tiempo constante, para no filtrar la clave carácter a carácter. */
function iguales(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function passwordCorrecta(intento: string): boolean {
  const clave = claveServidor();
  return clave !== null && iguales(intento, clave);
}

export function crearToken(): string {
  const clave = claveServidor();
  if (!clave) throw new Error("ADMIN_PASSWORD no está configurada");
  const vencimiento = Math.floor(Date.now() / 1000) + DURACION_SESION;
  return `${vencimiento}.${firmar(vencimiento, clave)}`;
}

function tokenValido(token: string | undefined): boolean {
  const clave = claveServidor();
  if (!clave || !token) return false;

  const [crudo, firma] = token.split(".");
  const vencimiento = Number(crudo);
  if (!Number.isSafeInteger(vencimiento) || !firma) return false;
  if (vencimiento * 1000 <= Date.now()) return false;

  return iguales(firma, firmar(vencimiento, clave));
}

/** ¿La petición actual trae una sesión de administración vigente? */
export async function haySesionAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return tokenValido(cookieStore.get(COOKIE_SESION)?.value);
}
