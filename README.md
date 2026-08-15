# Importadora Piecitos 🦖

Tienda online de calzados infantiles con temática de dinosaurios.

- **Front-end:** Next.js 15 (App Router) + React 19 + Tailwind CSS v4
- **Back-end:** TypeScript sobre Route Handlers de Next.js
- **Base de datos:** Neon PostgreSQL (serverless) con Drizzle ORM
- **Despliegue:** Vercel

---

## 1. Instalación local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre <http://localhost:3000>.

> **La web arranca sin base de datos.** Si `DATABASE_URL` no está configurada,
> la capa de datos usa el catálogo de demostración de `src/lib/catalog.ts` y
> todo se puede navegar igual. Conectar Neon es el paso 2.

### Nota sobre `npm install`

npm bloquea los scripts de instalación de `esbuild` y `sharp`. Para que
`drizzle-kit` y `npm run db:seed` funcionen, apruébalos una vez:

```bash
npm install-scripts approve esbuild
npm install-scripts approve sharp
```

## 2. Conectar Neon PostgreSQL

1. Crea un proyecto en <https://console.neon.tech>.
2. En **Connection Details** copia las dos cadenas y pégalas en `.env.local`:

   ```env
   DATABASE_URL="postgresql://…-pooler.…neon.tech/neondb?sslmode=require"
   DATABASE_URL_UNPOOLED="postgresql://…neon.tech/neondb?sslmode=require"
   ```

   - `DATABASE_URL` (**pooled**) la usa la app en tiempo de ejecución.
   - `DATABASE_URL_UNPOOLED` (**directa**) solo la usa `drizzle-kit` para migrar.

3. Crea las tablas y carga el catálogo inicial:

   ```bash
   npm run db:push   # crea/actualiza el esquema en Neon
   npm run db:seed   # inserta las 6 categorías y los 8 productos
   ```

4. Opcional: `npm run db:studio` abre un explorador visual de la base.

## 3. Desplegar en Vercel

```bash
npm i -g vercel
vercel
```

O conecta el repositorio en <https://vercel.com/new>. En **Settings →
Environment Variables** agrega:

| Variable                | Entornos                          |
| ----------------------- | --------------------------------- |
| `DATABASE_URL`          | Production, Preview, Development   |
| `DATABASE_URL_UNPOOLED` | Production, Preview, Development   |
| `NEXT_PUBLIC_WHATSAPP`  | Production, Preview, Development   |

Si usas la [integración Neon ↔ Vercel](https://vercel.com/integrations/neon),
esas variables se inyectan solas.

No hace falta configuración extra: Next.js detecta el App Router y despliega
las rutas de `/api/*` como funciones serverless.

---

## Estructura

```
src/
├── app/
│   ├── layout.tsx            # Cabecera, nav, footer y provider del carrito
│   ├── page.tsx              # Home (hero, categorías, beneficios, destacados)
│   ├── productos/            # Catálogo con filtros + ficha de producto
│   ├── carrito/              # Checkout
│   ├── contacto/  cuenta/
│   └── api/
│       ├── products/         # GET catálogo y GET producto por slug
│       ├── categories/       # GET categorías
│       ├── orders/           # POST pedido (valida y recalcula precios)
│       └── subscribe/        # POST alta en la lista de novedades
├── components/               # UI (todo el diseño de la maqueta)
├── db/
│   ├── schema.ts             # Tablas Drizzle
│   ├── index.ts              # Conexión Neon (null si no hay DATABASE_URL)
│   └── seed.ts               # Carga inicial idempotente
└── lib/
    ├── data.ts               # Consultas + fallback al catálogo demo
    ├── catalog.ts            # Catálogo de demostración / semilla
    ├── format.ts             # formatBs(), reglas de envío
    └── types.ts              # DTOs compartidos front ↔ back
```

## Modelo de datos

| Tabla         | Para qué sirve                                              |
| ------------- | ----------------------------------------------------------- |
| `categories`  | Niños, Niñas, Bebés, Colecciones, Ofertas…                   |
| `products`    | Precio, tallas (`jsonb`), imágenes, stock, destacado, nuevo  |
| `orders`      | Datos del cliente, estado y totales del pedido               |
| `order_items` | Línea de pedido con nombre y precio congelados en la compra  |
| `subscribers` | Correos del banner "Únete a la manada"                       |

Los precios se guardan como `numeric(10,2)` para evitar errores de redondeo,
y **el backend nunca confía en el precio que envía el navegador**: al crear un
pedido relee cada producto de la base y recalcula subtotal, envío y total.

## Reglas de negocio

Están centralizadas en `src/lib/format.ts`:

```ts
ENVIO_GRATIS_DESDE = 150; // Bs.
COSTO_ENVIO = 15;         // Bs. por debajo de ese monto
```

## Personalización

- **Colores y tipografías:** el bloque `@theme` de `src/app/globals.css`.
- **Logo:** `src/components/Logo.tsx` (hoy es texto; se puede cambiar por un
  `<Image>` cuando exista el archivo definitivo).
- **Ilustraciones:** los dinosaurios son emojis y el fondo del hero es un SVG
  (`src/components/JungleBackdrop.tsx`). Para usar los renders del diseño,
  sube las imágenes a `public/` o a Vercel Blob y rellena el campo `images`
  de cada producto — las tarjetas ya priorizan la foto sobre el emoji.
- **Slides del hero:** el arreglo `SLIDES` en `src/components/Hero.tsx`.

## Scripts

| Comando               | Qué hace                                  |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Servidor de desarrollo                    |
| `npm run build`       | Build de producción                       |
| `npm run start`       | Sirve el build                            |
| `npm run typecheck`   | Verifica tipos sin compilar               |
| `npm run db:push`     | Sincroniza el esquema con Neon            |
| `npm run db:generate` | Genera archivos de migración SQL          |
| `npm run db:seed`     | Carga el catálogo inicial                 |
| `npm run db:studio`   | Explorador visual de la base              |

## Pendiente

- Autenticación de clientes (`/cuenta` es hoy un marcador).
- Pasarela de pago real; el checkout registra el pedido para confirmarlo por
  WhatsApp.
- Panel de administración para cargar productos sin tocar código.
