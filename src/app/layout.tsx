import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getCategories } from "@/lib/data";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Importadora Piecitos · Calzados infantiles de dinosaurios",
    template: "%s · Importadora Piecitos",
  },
  description:
    "Tenis en forma de dinosaurio para pequeños exploradores. Luces que dejan huella, materiales resistentes y envío gratis en compras mayores a Bs. 150.",
  keywords: [
    "calzado infantil",
    "tenis de dinosaurio",
    "zapatos para niños",
    "Bolivia",
    "Importadora Piecitos",
  ],
  openGraph: {
    title: "Importadora Piecitos · Calzados infantiles",
    description: "Pisadas gigantes, aventuras sin límites.",
    type: "website",
    locale: "es_BO",
    images: [{ url: "/brand/jungle-hero.webp", width: 1536, height: 1024 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#3f7724",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();

  return (
    <html lang="es-BO" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="min-h-dvh antialiased">
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
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
