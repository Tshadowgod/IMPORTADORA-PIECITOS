import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

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

/**
 * Layout raíz: solo el documento y las fuentes.
 *
 * La cabecera, el footer y el carrito viven en el grupo `(tienda)` para que
 * `/admin` pueda tener su propia pantalla, sin nada de la tienda.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-BO" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
