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

/** Teléfono de la tienda. Pendiente: sigue siendo un marcador. */
export const TELEFONO = "+591 7XX XXX XX";
