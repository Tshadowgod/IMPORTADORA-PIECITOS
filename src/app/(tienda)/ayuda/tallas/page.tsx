import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guía de tallas",
  description:
    "Tabla de tallas 17 a 33 con el largo del pie en centímetros, la edad aproximada y cómo medir el pie del niño en casa.",
};

/**
 * Tabla de referencia: número europeo, largo del pie en centímetros y edad
 * aproximada.
 *
 * Los centímetros siguen el escalado europeo (unos 0,67 cm por número) y son
 * el largo del PIE, no el de la plantilla: al calzado se le deja después la
 * holgura. Las edades son orientativas y varían bastante entre niños; el dato
 * que manda siempre es la medida.
 */
const TALLAS: [talla: number, cm: number, edad: string][] = [
  [17, 10.5, "0 – 6 meses"],
  [18, 11.0, "6 – 9 meses"],
  [19, 11.7, "9 – 12 meses"],
  [20, 12.3, "12 – 18 meses"],
  [21, 13.0, "18 – 24 meses"],
  [22, 13.6, "2 años"],
  [23, 14.3, "2 – 3 años"],
  [24, 15.0, "3 años"],
  [25, 15.6, "3 – 4 años"],
  [26, 16.3, "4 años"],
  [27, 17.0, "4 – 5 años"],
  [28, 17.6, "5 años"],
  [29, 18.3, "5 – 6 años"],
  [30, 18.9, "6 – 7 años"],
  [31, 19.6, "7 años"],
  [32, 20.3, "7 – 8 años"],
  [33, 20.9, "8 – 9 años"],
];

const PASOS = [
  "Pon una hoja en el piso, contra la pared, y que el niño se pare encima con el talón pegado a la pared.",
  "Marca con un lápiz dónde termina el dedo más largo (no siempre es el dedo gordo).",
  "Mide con una regla desde el borde de la hoja hasta la marca: esos son los centímetros de su pie.",
  "Mide los dos pies y usa el más grande. Mejor al final del día, cuando el pie está un poco más hinchado.",
];

export default function TallasPage() {
  return (
    <>
      <h1 className="mt-6 font-display text-3xl font-bold text-jungle-800">
        Guía de tallas
      </h1>
      <p className="mt-2 font-semibold text-jungle-900/75">
        Manejamos de la talla <strong>17 a la 33</strong>. Mide el pie una vez y
        aciertas la talla siempre: es la forma más segura de comprar por internet.
      </p>

      <div className="mt-6 rounded-2xl border-2 border-sun-500/40 bg-sun-300 p-5">
        <p className="font-display text-lg font-bold text-jungle-900">
          🦖 Las dos reglas de oro
        </p>
        <ul className="mt-2 space-y-1 font-semibold text-jungle-900/85">
          <li>
            Deja entre <strong>0,5 y 1 cm</strong> de holgura sobre la medida del pie:
            el zapato justo se le queda chico en dos meses.
          </li>
          <li>
            Si la medida cae entre dos tallas, <strong>elige la más grande</strong>.
          </li>
        </ul>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-jungle-800">
          Tabla de tallas
        </h2>
        <p className="mt-1 text-sm font-semibold text-jungle-900/70">
          Los centímetros son el largo del pie, no del zapato. La edad es solo una
          referencia: dos niños de la misma edad pueden usar tallas distintas.
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border-2 border-stone-warm-300 bg-white">
          <table className="w-full text-left">
            <caption className="sr-only">
              Talla, largo del pie en centímetros y edad aproximada
            </caption>
            <thead className="bg-cream-100">
              <tr className="font-display text-sm text-jungle-800">
                <th scope="col" className="px-4 py-3">
                  Talla
                </th>
                <th scope="col" className="px-4 py-3">
                  Largo del pie
                </th>
                <th scope="col" className="px-4 py-3">
                  Edad aproximada
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-warm-200 text-sm font-semibold">
              {TALLAS.map(([talla, cm, edad]) => (
                <tr key={talla}>
                  <th
                    scope="row"
                    className="px-4 py-2.5 font-display text-base font-bold text-jungle-800"
                  >
                    {talla}
                  </th>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {cm.toLocaleString("es-BO", { minimumFractionDigits: 1 })} cm
                  </td>
                  <td className="px-4 py-2.5 text-jungle-900/75">{edad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
          <Link href="/productos?categoria=bebes" className="text-lava-500 hover:text-lava-600">
            Bebés: tallas 17 – 22 →
          </Link>
          <Link href="/productos?categoria=ninos" className="text-lava-500 hover:text-lava-600">
            Niños y niñas: tallas 22 – 33 →
          </Link>
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-jungle-800">
          Cómo medir el pie en casa
        </h2>
        <ol className="mt-3 space-y-3">
          {PASOS.map((paso, i) => (
            <li
              key={paso}
              className="flex gap-3 rounded-2xl border-2 border-stone-warm-300 bg-white p-4"
            >
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-jungle-600 font-display font-bold text-white"
              >
                {i + 1}
              </span>
              <p className="font-semibold leading-relaxed text-jungle-900/80">{paso}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-jungle-800">
          Otras dudas de talla
        </h2>
        <dl className="mt-3 space-y-3 font-semibold text-jungle-900/80">
          <div>
            <dt className="font-display font-bold text-jungle-800">
              ¿Compro una talla más para que le dure?
            </dt>
            <dd>
              Una talla más está bien; dos, no. Un zapato muy grande hace que el niño
              arrastre el pie y se tropiece.
            </dd>
          </div>
          <div>
            <dt className="font-display font-bold text-jungle-800">
              ¿Cada cuánto conviene medir?
            </dt>
            <dd>
              Hasta los 3 años, cada 2 o 3 meses; después, cada 4 meses. Crecen más
              rápido de lo que parece.
            </dd>
          </div>
          <div>
            <dt className="font-display font-bold text-jungle-800">
              ¿Cómo sé que ya le quedó chico?
            </dt>
            <dd>
              Si el dedo más largo toca la punta, si le quedan marcas rojas o si se
              saca los zapatos todo el tiempo, ya toca subir de talla.
            </dd>
          </div>
        </dl>
      </section>
    </>
  );
}
