#!/usr/bin/env python3
"""
Quita el fondo plano de las ilustraciones de Importadora Piecitos.

Método (sin dependencias externas más allá de PIL + numpy):

1. Detecta los colores de fondo muestreando el marco de 1 px de la imagen y
   agrupando los tonos dominantes (algunas piezas tienen dos: la tarjeta crema
   y las esquinas negras).
2. Calcula, por píxel, la distancia al fondo más cercano.
3. Marca como fondo solo lo que sea alcanzable desde el borde de la imagen
   (relleno por conectividad). Así el blanco de una suela o los dientes, que
   quedan encerrados por el contorno del dibujo, no se vuelven transparentes.
4. Aplica una rampa suave entre T_LO y T_HI para conservar el antialias del
   contorno y desvanecer la sombra proyectada.
5. Descontamina el color: en los píxeles semitransparentes deshace la mezcla
   con el fondo, para que no quede un halo crema sobre fondos oscuros.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

# Distancia (0-255, por canal) al color de fondo:
#   por debajo de T_LO  -> fondo puro, transparente
#   por encima de T_HI  -> dibujo, opaco
T_LO = 6
T_HI = 42
# Umbral más permisivo para la sombra proyectada, que es el mismo tono del
# fondo pero más oscuro. Sin esto la sombra queda como una mancha sucia.
T_HI_SOMBRA = 85
# Un píxel más claro que el fondo (suelas y dientes blancos) nunca es fondo:
# el fondo crema es lo más claro de la escena en su propio tono.
MARGEN_CLARO = 6
# Cuánto más oscuro que el fondo hay que ser para contar como sombra.
MARGEN_SOMBRA = 6
# Si tratar la sombra como fondo hace crecer el recorte más que esto (fracción
# de la imagen), se asume fuga hacia el dibujo y se descarta la regla.
FUGA_MAX = 0.03
# Cuánto puede crecer el recorte al subir el umbral antes de asumir que ya
# no gana fondo sino que muerde el dibujo (fracción de la imagen).
PRESUPUESTO_CRECIMIENTO = 0.010
# Margen para un fondo oscuro: su degradado hacia la zona clara es largo.
T_HI_OSCURO = 70

# Tamaño del cubo al agrupar tonos del marco.
CUBO = 8

# Un color del marco se considera "fondo" si ocupa al menos este % del marco.
MIN_BORDE_PCT = 3.0
# Dos colores de fondo distintos deben diferir al menos en esto. Ha de ser
# bajo: en varias fichas el marco exterior es blanco y la tarjeta crema, y
# entre ambos solo hay 30 niveles de diferencia.
SEP_COLORES = 22
# Un marco de tarjeta es una franja fina. Si la regla marcase más que esta
# fracción de la imagen, es que se escapó hacia el dibujo y se descarta.
MARCO_MAX = 0.10


def colores_de_fondo(a: np.ndarray) -> np.ndarray:
    """
    Tonos dominantes del marco de 1 px, como array (n, 3).

    Los colores se agrupan en cubos antes de contarlos: un marco blanco real
    llega repartido en decenas de tonos casi idénticos (253,253,253 /
    255,253,254 …) y, contados por separado, ninguno alcanzaría el mínimo.
    """
    marco = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]).reshape(-1, 3)
    cubos = (marco // CUBO) * CUBO
    vals, counts = np.unique(cubos, axis=0, return_counts=True)

    centros: list[np.ndarray] = []
    for i in np.argsort(-counts):
        if counts[i] / len(marco) * 100 < MIN_BORDE_PCT:
            break
        # Color representativo: la media real de los píxeles de ese cubo.
        c = marco[(cubos == vals[i]).all(axis=1)].mean(axis=0).round().astype(np.int16)
        if all(np.abs(c - k).max() >= SEP_COLORES for k in centros):
            centros.append(c)
        if len(centros) == 3:
            break
    if not centros:
        centros = [marco.mean(axis=0).round().astype(np.int16)]
    return np.array(centros)


def _dilatar(m: np.ndarray) -> np.ndarray:
    out = m.copy()
    out[1:] |= m[:-1]
    out[:-1] |= m[1:]
    out[:, 1:] |= m[:, :-1]
    out[:, :-1] |= m[:, 1:]
    return out


def _erosionar(m: np.ndarray, veces: int) -> np.ndarray:
    for _ in range(veces):
        m = ~_dilatar(~m)
    return m


def difundir(semilla: np.ndarray, posible: np.ndarray) -> np.ndarray:
    """Expande la semilla por 4-vecinos mientras siga habiendo fondo."""
    alc = semilla & posible
    while True:
        anterior = alc.sum()
        alc = _dilatar(alc) & posible
        if alc.sum() == anterior:
            return alc


def region_de_fondo(posible: np.ndarray, puro: np.ndarray) -> np.ndarray:
    """
    Fondo = lo alcanzable desde el borde de la imagen, más las bolsas de fondo
    que la sombra de contacto deja encerradas bajo el dibujo (por ejemplo entre
    los pies del personaje). Solo se admiten bolsas de color idéntico al fondo
    y con cuerpo suficiente para sobrevivir una erosión, de modo que un píxel
    suelto dentro del dibujo no abra un agujero.
    """
    borde = np.zeros_like(posible)
    borde[0], borde[-1], borde[:, 0], borde[:, -1] = True, True, True, True

    alc = difundir(borde, posible)
    encerradas = _erosionar(puro, 3) & ~alc
    if encerradas.any():
        alc = difundir(alc | encerradas, posible)
    return alc


def marco_de_tarjeta(alc: np.ndarray, fondo_exterior: np.ndarray) -> np.ndarray:
    """
    Marca el filo de la tarjeta en las fichas que traen el dibujo montado sobre
    una tarjeta redondeada (fondo oscuro fuera, crema dentro).

    Quitados ambos fondos, ese filo queda como un aro opaco aislado: no toca el
    borde de la imagen, porque el fondo oscuro ya es transparente. La clave es
    que el aro es lo único opaco que roza ese fondo exterior; el dibujo solo
    roza la tarjeta crema. Así que se siembra desde el fondo exterior y se
    difunde por lo opaco, que no puede cruzar la tarjeta ya transparente.
    """
    opaco = ~alc
    return difundir(_dilatar(fondo_exterior) & opaco, opaco)


def elegir_techo(
    d: np.ndarray, mas_claro: np.ndarray, cercano: np.ndarray, fondos: np.ndarray
) -> np.ndarray:
    """
    Calibra el umbral y lo devuelve como mapa por píxel.

    El fondo es plano, así que casi todo él cae por debajo del umbral mínimo;
    subir el umbral a partir de ahí ya no gana fondo, solo empieza a morder el
    dibujo cuando este comparte tono con el fondo (las suelas crema, por
    ejemplo). Se toma el umbral más alto cuyo crecimiento acumulado siga dentro
    del presupuesto, lo que conserva un borde suave sin comerse el dibujo.

    El umbral se calibra por color de fondo, no por imagen: en las fichas de
    categoría conviven una tarjeta crema, que exige mano estrecha porque las
    suelas son casi de su tono, y unas esquinas negras cuyo degradado hacia la
    tarjeta necesita mucho más margen. Un único valor no sirve para ambos.
    """
    # Un fondo oscuro no compite con un dibujo claro: margen amplio y fijo.
    fijos = np.array(
        [T_HI_OSCURO if f.max() < 60 else -1.0 for f in fondos], dtype=np.float32
    )
    if (fijos > 0).all():
        return fijos[cercano]

    def area(t: float) -> float:
        techo = np.where(fijos < 0, t, fijos)[cercano]
        return region_de_fondo((d < techo) & ~mas_claro, d < T_LO).mean()

    escala = [10, 14, 18, 22, 26, 30, 34, 38, T_HI]
    base = area(escala[0])
    elegido = escala[0]
    for t in escala[1:]:
        if area(t) - base > PRESUPUESTO_CRECIMIENTO:
            break
        elegido = t
    return np.where(fijos < 0, elegido, fijos)[cercano]


def quitar_fondo(origen: Path, destino: Path) -> dict:
    im = Image.open(origen).convert("RGB")
    a = np.asarray(im).astype(np.int16)

    fondos = colores_de_fondo(a)
    # Distancia al fondo más cercano (métrica de canal máximo: sensible al tono)
    dists = [np.abs(a - f.reshape(1, 1, 3)).max(axis=2) for f in fondos]
    d = np.min(dists, axis=0).astype(np.float32)
    fondo_cercano = fondos[np.argmin(dists, axis=0)].astype(np.float32)

    # Nada más claro que el fondo puede ser fondo (suelas y dientes blancos).
    # Solo aplica frente a un fondo claro: contra uno negro todo es más claro,
    # y la guarda impediría recortar nada.
    es_claro = np.array([f.max() >= 60 for f in fondos])
    mas_claro = (a >= fondo_cercano + MARGEN_CLARO).any(axis=2) & es_claro[
        np.argmin(dists, axis=0)
    ]

    # La sombra proyectada es el fondo, claramente más oscuro y con el mismo
    # tono: todos los canales bastante por debajo y en proporción pareja. El
    # margen de 6 evita tragarse los realces pálidos de un dibujo color crema.
    ratio = a.astype(np.float32) / np.maximum(fondo_cercano, 1.0)
    es_sombra = (a <= fondo_cercano - MARGEN_SOMBRA).all(axis=2) & (
        ratio.max(axis=2) - ratio.min(axis=2) < 0.14
    )

    cercano = np.argmin(dists, axis=0)
    t_hi = elegir_techo(d, mas_claro, cercano, fondos)
    base = (d < t_hi) & ~mas_claro
    alc = region_de_fondo(base, d < T_LO)

    # Con la sombra incluida el relleno llega más lejos. Si se dispara, es que
    # el dibujo es del mismo tono que el fondo y la regla filtró: se descarta.
    techo = np.where(es_sombra, T_HI_SOMBRA, t_hi).astype(np.float32)
    con_sombra = (d < techo) & ~mas_claro
    alc_sombra = region_de_fondo(con_sombra, d < T_LO)
    if alc_sombra.mean() - alc.mean() < FUGA_MAX:
        alc = alc_sombra
    else:
        techo = t_hi.astype(np.float32)

    marco = np.zeros_like(alc)
    if len(fondos) > 1:
        # El fondo exterior es aquel al que se parecen las cuatro esquinas.
        esquinas = [cercano[0, 0], cercano[0, -1], cercano[-1, 0], cercano[-1, -1]]
        idx = max(set(esquinas), key=esquinas.count)
        marco = marco_de_tarjeta(alc, alc & (cercano == idx))
        if marco.mean() > MARCO_MAX:
            marco = np.zeros_like(alc)
        alc |= marco

    rampa = np.clip((d - T_LO) / (techo - T_LO), 0.0, 1.0)
    alpha = np.where(alc, rampa, 1.0).astype(np.float32)
    # El filo de la tarjeta es opaco y de color propio: la rampa no lo borra,
    # hay que anularlo a mano.
    alpha[marco] = 0.0

    # Descontaminación: deshace la mezcla con el fondo en los bordes suaves.
    rgb = a.astype(np.float32)
    parcial = (alpha > 0.05) & (alpha < 0.95)
    if parcial.any():
        aa = alpha[parcial][:, None]
        rgb[parcial] = np.clip(
            (rgb[parcial] - (1 - aa) * fondo_cercano[parcial]) / aa, 0, 255
        )

    salida = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    destino.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(salida, "RGBA").save(destino, "WEBP", quality=92, method=6)

    return {
        "techo": sorted({int(v) for v in np.unique(t_hi)}),
        "fondos": [tuple(int(x) for x in f) for f in fondos],
        "transparente_pct": float((alpha < 0.5).mean() * 100),
        "kb": destino.stat().st_size / 1024,
    }


if __name__ == "__main__":
    for ruta in sys.argv[1:]:
        origen = Path(ruta)
        destino = Path(sys.argv[0]).parent / "preview" / origen.name
        info = quitar_fondo(origen, destino)
        print(
            f"{origen.name:32s} fondos={info['fondos']} "
            f"transparente={info['transparente_pct']:5.1f}%  {info['kb']:6.1f} KB"
        )
