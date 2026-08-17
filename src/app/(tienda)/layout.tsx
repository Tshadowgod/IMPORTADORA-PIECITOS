import TiendaShell from "@/components/TiendaShell";

/**
 * Layout de la tienda pública.
 *
 * El grupo `(tienda)` no cambia ninguna URL: `(tienda)/carrito` sigue siendo
 * `/carrito`. Solo sirve para que `/admin` quede fuera de este layout.
 */
export default function TiendaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <TiendaShell>{children}</TiendaShell>;
}
