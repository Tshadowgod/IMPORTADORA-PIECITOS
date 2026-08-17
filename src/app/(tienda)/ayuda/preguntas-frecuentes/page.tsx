import type { Metadata } from "next";
import Link from "next/link";
import { COSTO_ENVIO, ENVIO_GRATIS_DESDE, formatBs } from "@/lib/format";
import { POLITICAS } from "@/lib/politicas";
import { DIRECCION_CORTA, HORARIOS, TELEFONO, UBICACION } from "@/lib/tienda";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Cómo comprar, cuánto cuesta el envío, en cuánto llega tu pedido, cambios de talla y compras por mayor en Importadora Piecitos.",
};

/**
 * Las respuestas son texto plano (con un enlace opcional al final) para poder
 * reutilizarlas tal cual en el JSON-LD de `FAQPage`, que es lo que Google
 * muestra desplegado en los resultados de búsqueda.
 */
interface Pregunta {
  pregunta: string;
  respuesta: string;
  enlace?: { href: string; label: string };
}

/**
 * El horario en una frase: "lunes a viernes de 09:00 a 19:00 y sábados de
 * 09:00 a 14:00". Los días cerrados no se mencionan y el guion de la tabla
 * pasa a "a", que es como se lee corrido.
 */
function horarioEnPalabras(): string {
  return HORARIOS.filter(([, horas]) => horas !== "Cerrado")
    .map(([dias, horas]) => `${dias.toLowerCase()} de ${horas.replace("–", "a")}`)
    .join(" y ");
}

const PREGUNTAS: Pregunta[] = [
  {
    pregunta: "¿Cómo hago un pedido?",
    respuesta:
      "Elige el modelo, marca la talla y agrégalo al carrito. En el carrito solo pedimos tu nombre, teléfono, ciudad y una nota con la referencia de entrega. Al confirmar te damos un código (por ejemplo PIE-AB12CD) y se abre WhatsApp con el pedido ya escrito, para que nos lo envíes y coordinemos el pago y la entrega.",
    enlace: { href: "/productos", label: "Ver el catálogo" },
  },
  {
    pregunta: "¿Necesito crear una cuenta?",
    respuesta:
      "No. Se compra sin registrarse: basta tu nombre y un teléfono donde podamos escribirte.",
  },
  {
    pregunta: "¿Cómo pago?",
    respuesta:
      "El pago se acuerda por WhatsApp cuando confirmamos el pedido: QR, transferencia bancaria, tarjeta o efectivo si pasas por la tienda. No pedimos datos de tarjeta por la web ni por chat.",
  },
  {
    pregunta: "¿Cuánto cuesta el envío?",
    respuesta: `El envío es gratis en pedidos de ${formatBs(
      ENVIO_GRATIS_DESDE,
    )} o más. Por debajo de ese monto cuesta ${formatBs(
      COSTO_ENVIO,
    )}, y lo ves sumado en el carrito antes de confirmar.`,
  },
  {
    pregunta: "¿En cuánto tiempo llega?",
    respuesta: `Dentro de ${UBICACION.ciudad}, entre ${POLITICAS.entregaLocal} después de confirmar el pago. Al interior del país, ${POLITICAS.entregaInterior} según la empresa de transporte.`,
  },
  {
    pregunta: "¿Qué talla le compro?",
    respuesta:
      "Lo más seguro es medir el pie del niño con una hoja y comparar los centímetros con nuestra tabla; si queda entre dos números, siempre el más grande. Manejamos de la talla 17 a la 33.",
    enlace: { href: "/ayuda/tallas", label: "Ver la guía de tallas" },
  },
  {
    pregunta: "¿Y si no le queda la talla?",
    respuesta: `Se cambia. Tienes ${POLITICAS.diasCambio} días desde que recibes el pedido para pedir el cambio de talla o de modelo, con el par sin usar y en su caja.`,
    enlace: { href: "/ayuda/cambios", label: "Ver la política de cambios" },
  },
  {
    pregunta: "¿Los tenis tienen garantía?",
    respuesta: `Sí: ${POLITICAS.diasGarantia} días por fallas de fábrica, como que se despegue la suela o falle un cierre. El desgaste normal del uso diario no entra en la garantía.`,
  },
  {
    pregunta: "¿Venden por mayor?",
    respuesta: `Sí, desde ${POLITICAS.mayoristaDesde} pares hay precio por mayor. Escríbenos con los modelos y las tallas que necesitas y te pasamos la cotización.`,
    enlace: { href: "/contacto", label: "Escribirnos" },
  },
  {
    pregunta: "¿Tienen tienda física?",
    respuesta: `Sí: ${UBICACION.nombre}, ${DIRECCION_CORTA}. Atendemos ${horarioEnPalabras()}. También puedes llamarnos al ${TELEFONO}.`,
    enlace: { href: "/contacto", label: "Ver el mapa y cómo llegar" },
  },
];

const FICHA_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PREGUNTAS.map((p) => ({
    "@type": "Question",
    name: p.pregunta,
    acceptedAnswer: { "@type": "Answer", text: p.respuesta },
  })),
};

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FICHA_FAQ) }}
      />
      <h1 className="mt-6 font-display text-3xl font-bold text-jungle-800">
        Preguntas frecuentes
      </h1>
      <p className="mt-2 font-semibold text-jungle-900/75">
        Lo que más nos preguntan por WhatsApp, resumido acá.
      </p>

      <div className="mt-6 space-y-3">
        {PREGUNTAS.map((p, i) => (
          <details
            key={p.pregunta}
            // La primera abierta, para que la página no se vea vacía de entrada.
            open={i === 0}
            className="group rounded-2xl border-2 border-stone-warm-300 bg-white px-5 py-4"
          >
            <summary className="flex cursor-pointer items-center gap-3 font-display text-lg font-bold text-jungle-800 marker:content-none [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-jungle-600 text-sm font-bold text-white transition group-open:rotate-45"
              >
                +
              </span>
              {p.pregunta}
            </summary>
            <p className="mt-3 font-semibold leading-relaxed text-jungle-900/80">
              {p.respuesta}
            </p>
            {p.enlace && (
              <Link
                href={p.enlace.href}
                className="mt-3 inline-block font-display font-bold text-lava-500 underline decoration-2 underline-offset-2 hover:text-lava-600"
              >
                {p.enlace.label} →
              </Link>
            )}
          </details>
        ))}
      </div>
    </>
  );
}
