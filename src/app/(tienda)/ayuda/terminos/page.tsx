import type { Metadata } from "next";
import Link from "next/link";
import { COSTO_ENVIO, ENVIO_GRATIS_DESDE, formatBs } from "@/lib/format";
import { ACTUALIZACION_TERMINOS, POLITICAS } from "@/lib/politicas";
import { DIRECCION_CORTA, TELEFONO, UBICACION } from "@/lib/tienda";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones de uso de la tienda, cómo se confirman los pedidos, precios, envíos y tratamiento de los datos de contacto.",
};

export default function TerminosPage() {
  return (
    <>
      <h1 className="mt-6 font-display text-3xl font-bold text-jungle-800">
        Términos y condiciones
      </h1>
      <p className="mt-2 font-semibold text-jungle-900/75">
        Las condiciones con las que trabajamos, en palabras claras. Al hacer un pedido
        en esta tienda estás de acuerdo con lo que sigue.
      </p>

      <div className="mt-6 space-y-6">
        <Bloque titulo="1. Quiénes somos">
          Esta tienda es de <strong>{UBICACION.nombre}</strong> ({DIRECCION_CORTA}),
          dedicada a la venta de calzado infantil. Puedes escribirnos o llamarnos al{" "}
          {TELEFONO}.
        </Bloque>

        <Bloque titulo="2. El pedido es una solicitud">
          Cuando confirmas el carrito registramos tu pedido y te damos un código
          (PIE-…). Ese pedido queda <strong>pendiente</strong> hasta que lo confirmemos
          por WhatsApp: ahí verificamos que haya stock de la talla y acordamos el pago y
          la entrega. Si algo se agotó, te avisamos y puedes cambiarlo por otro modelo o
          anularlo sin costo.
        </Bloque>

        <Bloque titulo="3. Precios y pagos">
          Todos los precios están en bolivianos (Bs.) y pueden cambiar sin aviso, pero
          nunca después de que confirmemos tu pedido: se respeta el precio con el que lo
          hiciste. El pago se acuerda por WhatsApp. <strong>No pedimos datos de tarjeta
          por la web ni por chat</strong>; si alguien te los pide diciendo que es de
          nuestra parte, desconfía y escríbenos al {TELEFONO}.
        </Bloque>

        <Bloque titulo="4. Envíos">
          El envío es gratis en pedidos de {formatBs(ENVIO_GRATIS_DESDE)} o más; por
          debajo de ese monto cuesta {formatBs(COSTO_ENVIO)}. Los plazos son{" "}
          {POLITICAS.entregaLocal} en {UBICACION.ciudad} y {POLITICAS.entregaInterior} al
          interior, contados desde que se confirma el pago. Son plazos estimados: si la
          empresa de transporte se retrasa, te mantenemos avisado.
        </Bloque>

        <Bloque titulo="5. Cambios y garantía">
          Tienes {POLITICAS.diasCambio} días para cambiar talla o modelo y{" "}
          {POLITICAS.diasGarantia} días de garantía por falla de fábrica. Las condiciones
          completas están en la{" "}
          <Link
            href="/ayuda/cambios"
            className="font-bold text-lava-500 underline decoration-2 underline-offset-2 hover:text-lava-600"
          >
            política de cambios
          </Link>
          .
        </Bloque>

        <Bloque titulo="6. Fotos y descripciones">
          Cuidamos que las fotos y las medidas sean fieles, pero los colores pueden verse
          distintos según la pantalla y puede haber pequeñas variaciones entre lotes del
          mismo modelo. Eso no se considera una falla.
        </Bloque>

        <Bloque titulo="7. Tus datos">
          Para entregarte el pedido pedimos solo lo necesario: nombre, teléfono, ciudad y
          la referencia de entrega que escribas en las notas. Usamos esos datos para
          coordinar tu compra y para atenderte si hay un cambio.{" "}
          <strong>No los vendemos ni los compartimos</strong> con terceros, salvo lo
          mínimo que necesita la empresa de transporte para llegar a tu dirección. Si nos
          dejas tu correo en el boletín, es solo para novedades y ofertas, y puedes
          pedirnos que lo demos de baja cuando quieras.
        </Bloque>

        <Bloque titulo="8. Compras por mayor">
          Desde {POLITICAS.mayoristaDesde} pares aplican precios por mayor, que se
          cotizan caso por caso según modelos y tallas disponibles.
        </Bloque>

        <Bloque titulo="9. Contenido del sitio">
          Los textos, el logo y las imágenes de esta tienda son nuestros. Puedes
          compartir los enlaces libremente, pero no usar el material para vender a nombre
          de la tienda.
        </Bloque>

        <Bloque titulo="10. Legislación aplicable">
          Estas condiciones se rigen por las leyes del Estado Plurinacional de Bolivia.
          Cualquier reclamo se atiende primero de forma directa, por WhatsApp o en la
          tienda; lo que no se pueda resolver así queda sujeto a la jurisdicción de{" "}
          {UBICACION.ciudad}.
        </Bloque>
      </div>

      <p className="mt-8 text-sm font-semibold text-jungle-900/60">
        Última actualización: {ACTUALIZACION_TERMINOS}. Si cambiamos algo importante, lo
        publicamos en esta misma página.
      </p>
    </>
  );
}

function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border-2 border-stone-warm-300 bg-white p-5">
      <h2 className="font-display text-lg font-bold text-jungle-800">{titulo}</h2>
      <p className="mt-2 font-semibold leading-relaxed text-jungle-900/80">{children}</p>
    </section>
  );
}
