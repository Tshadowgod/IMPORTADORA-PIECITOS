import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import FloatingCart from "./FloatingCart";
import WhatsAppButton from "./WhatsAppButton";
import { CartProvider } from "./CartProvider";
import { getCategories } from "@/lib/data";
import { REDES, UBICACION } from "@/lib/tienda";

/**
 * Todo lo que envuelve a la tienda pública: cabecera, navegación, footer,
 * carrito y botones flotantes.
 *
 * Está fuera del layout raíz a propósito. El panel de administración
 * (`/admin`) vive en el mismo proyecto pero no debe mostrar nada de esto: no
 * tiene sentido un carrito ni un botón de WhatsApp en la pantalla de pedidos.
 * Lo usan el layout del grupo `(tienda)` y la página 404, que es la única
 * ruta pública que queda colgada de la raíz.
 */

/**
 * Ficha del negocio para buscadores: enlaza la tienda con sus redes (`sameAs`)
 * y con el punto exacto del mapa, que es lo que alimenta el panel lateral de
 * Google y las búsquedas del tipo "zapatos para niños cerca de mí".
 */
const FICHA_NEGOCIO = {
  "@context": "https://schema.org",
  "@type": "ShoeStore",
  name: "Importadora Piecitos",
  alternateName: UBICACION.nombre,
  description: "Calzados infantiles importados en Santa Cruz de la Sierra, Bolivia.",
  image: "/brand/logo.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: UBICACION.calle,
    addressLocality: UBICACION.ciudad,
    addressRegion: "Santa Cruz",
    addressCountry: "BO",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: UBICACION.lat,
    longitude: UBICACION.lng,
  },
  hasMap: UBICACION.mapa,
  currenciesAccepted: "BOB",
  sameAs: REDES.map((r) => r.href),
};

export default async function TiendaShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FICHA_NEGOCIO) }}
      />
      <CartProvider>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-jungle-600 focus:px-4 focus:py-2 focus:font-bold focus:text-white"
        >
          Saltar al contenido
        </a>
        <Header />
        <NavBar categories={categories} />
        <main id="contenido">{children}</main>
        <Footer />
        <CartDrawer />
        <FloatingCart />
        <WhatsAppButton />
      </CartProvider>
    </>
  );
}
