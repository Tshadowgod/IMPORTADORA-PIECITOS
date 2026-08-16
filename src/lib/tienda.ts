/**
 * Datos reales de la tienda: redes, ubicación y contacto.
 *
 * Es la única fuente de verdad. Si cambia un enlace o la dirección se toca
 * acá y se actualiza en el footer, la página de contacto y el JSON-LD.
 */

export const REDES = [
  {
    id: "instagram",
    nombre: "Instagram",
    usuario: "@imp_piecitos",
    href: "https://www.instagram.com/imp_piecitos/",
  },
  {
    id: "tiktok",
    nombre: "TikTok",
    usuario: "@imp.piecitos",
    href: "https://www.tiktok.com/@imp.piecitos",
  },
  {
    id: "facebook",
    nombre: "Facebook",
    usuario: "imp_piecitos",
    href: "https://www.facebook.com/p/imp_piecitos-100087466442070/",
  },
] as const;

export type RedId = (typeof REDES)[number]["id"];

export const UBICACION = {
  /** Nombre tal como figura en Google Maps. */
  nombre: "Importadora Piecitos VISSI",
  calle: "Av. Viedma",
  zona: "Zona Centro",
  ciudad: "Santa Cruz de la Sierra",
  pais: "Bolivia",
  /** Enlace corto que comparte la tienda. */
  mapa: "https://maps.app.goo.gl/VSqrVyKNgLvGCkeA7",
  lat: -17.7889821,
  lng: -63.1710806,
} as const;

/** "Av. Viedma, Zona Centro — Santa Cruz de la Sierra, Bolivia" */
export const DIRECCION_CORTA = `${UBICACION.calle}, ${UBICACION.zona} — ${UBICACION.ciudad}, ${UBICACION.pais}`;

/**
 * Abre la app de mapas con la ruta hacia la tienda desde donde esté el
 * usuario. Funciona igual en Android, iOS y escritorio.
 */
export const COMO_LLEGAR = `https://www.google.com/maps/dir/?api=1&destination=${UBICACION.lat},${UBICACION.lng}`;

/**
 * Mapa incrustable sin API key: el parámetro `output=embed` es público.
 *
 * Va por coordenadas y no por el nombre del negocio: buscar por nombre
 * depende de que Google acierte con el local y podría centrar el mapa en
 * otro lado; las coordenadas salen del propio enlace que comparte la tienda.
 */
export const MAPA_EMBED = `https://www.google.com/maps?q=${UBICACION.lat},${UBICACION.lng}&hl=es&z=17&output=embed`;

/** Teléfono de la tienda, como se muestra en pantalla. */
export const TELEFONO = "+591 69260082";

/**
 * El mismo número en el formato que pide wa.me: sin `+`, sin espacios y con
 * el código de país adelante. La variable de entorno manda, por si algún día
 * la tienda cambia de línea sin querer volver a desplegar el código.
 */
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "59169260082";

/** Enlace a WhatsApp, con un mensaje inicial opcional. */
export function linkWhatsApp(mensaje?: string): string {
  const base = `https://wa.me/${WHATSAPP}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
