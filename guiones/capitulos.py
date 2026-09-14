# -*- coding: utf-8 -*-
"""Saca los capítulos de un video de OBS y los deja listos para YouTube.

    python guiones/capitulos.py video.mp4
    python guiones/capitulos.py video.mp4 guiones/04_funciones/00_repaso_completo.md

Sale la lista que va en la descripción del video:

    0:00 Intro
    0:20 Qué es y por qué
    1:20 Anatomía
    ...

YouTube arma los capítulos solo con eso, siempre que la lista **arranque en
0:00** y tenga al menos tres entradas.

CÓMO GRABAR PARA QUE ESTO FUNCIONE
----------------------------------
En OBS, formato de grabación **MP4 híbrido** (en MKV no existen los marcadores)
y un atajo para *Agregar marcador de capítulo*. Durante la grabación se aprieta
**al empezar cada sección del guion, en orden y desde la segunda** — la primera
la pone OBS sola en 0:00.

El atajo no pide nombre: OBS las llama "Sin nombre 1", "Sin nombre 2"… Por eso,
si además se le pasa el guion, este script les pone el nombre de cada sección
emparejando por orden. Los guiones ya tienen las secciones como encabezados
`##`, así que no hay que escribir nada nuevo.

NO HACE FALTA ffmpeg INSTALADO
------------------------------
Lee el archivo con PyAV, que ya está instalado para transcribir las entrevistas
y trae las librerías de ffmpeg adentro.
"""

import argparse
import pathlib
import re
import sys

try:
    sys.stdout.reconfigure(errors='replace')
except Exception:
    pass


def reloj(segundos):
    """YouTube acepta m:ss y h:mm:ss. Sin ceros de más adelante."""
    s = int(segundos)
    if s >= 3600:
        return f'{s // 3600}:{(s % 3600) // 60:02d}:{s % 60:02d}'
    return f'{s // 60}:{s % 60:02d}'


def leer_capitulos(video):
    """Los marcadores que dejó OBS, en segundos."""
    try:
        import av
    except ImportError:
        sys.exit('Falta PyAV.  pip install av')

    with av.open(str(video)) as c:
        caps = c.chapters()

    marcas = []
    for ch in caps:
        # start viene en unidades de time_base (OBS usa milisegundos).
        tb = ch['time_base']
        marcas.append({
            'segundos': float(ch['start']) * float(tb),
            'titulo': (ch.get('metadata') or {}).get('title', ''),
        })
    marcas.sort(key=lambda m: m['segundos'])
    return marcas


# "## RETURN VS PRINT: LA MÁS IMPORTANTE (~1 minuto 30)"
RE_SECCION = re.compile(r'^##\s+(?!#)(.+?)\s*$')
RE_DURACION = re.compile(r'\s*\(~[^)]*\)\s*$')


# Palabras que están en mayúsculas porque SON así, no porque estén gritando.
# Si aparece una nueva, se agrega acá.
INTACTAS = {
    'RAM', 'POO', 'JSON', 'CSV', 'DNI', 'API', 'HTML', 'CSS', 'SQL', 'IDE',
    'PDF', 'URL', 'OBS', 'CFP', 'SIGES', 'CLI', 'GPU', 'CPU',
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
}

# Los emoji de los encabezados son señales para quien graba, no parte del
# título. Y encima la consola de Windows no sabe escribirlos, así que si se
# colaran se copiarían a YouTube como signos de pregunta.
RE_EMOJI = re.compile('[\U0001F300-\U0001FAFF☀-➿⬀-⯿️‍]')


def _bajar_gritos(titulo):
    """Los encabezados están EN MAYÚSCULAS para leerlos de reojo al grabar.

    En YouTube eso se lee como un grito, así que se baja — pero PALABRA POR
    PALABRA y no de una, porque hay títulos mixtos donde la parte en minúscula
    es código y tiene que quedarse como está:

        "`return` vs `print`: LA MÁS IMPORTANTE"  ->  "return vs print: la más importante"
        "QUÉ ES Y POR QUÉ"                        ->  "Qué es y por qué"

    La mayúscula inicial se pone solo si la primera palabra venía gritada. Si
    empezaba en minúscula era código, y capitalizarlo lo estropea.
    """
    palabras = titulo.split(' ')

    def gritada(p):
        # Las de una sola letra también cuentan: en castellano son la "Y" y la
        # "A", que si no quedan gritando en medio del título. Los números
        # romanos y las siglas se salvan por la lista de arriba.
        letras = [c for c in p if c.isalpha()]
        if not letras or p.strip('`*"()¿?¡!:,.').upper() in INTACTAS:
            return False
        return all(c.isupper() for c in letras)

    primera_gritada = bool(palabras) and gritada(palabras[0])
    bajadas = [p.lower() if gritada(p) else p for p in palabras]
    t = ' '.join(bajadas)
    if primera_gritada and t:
        t = t[:1].upper() + t[1:]
    return t


def leer_secciones(guion):
    """Los títulos `##` del guion, en orden y limpios."""
    titulos = []
    for linea in pathlib.Path(guion).read_text(encoding='utf-8').splitlines():
        m = RE_SECCION.match(linea)
        if not m:
            continue
        t = RE_DURACION.sub('', m.group(1)).replace('`', '')
        t = RE_EMOJI.sub('', t)
        t = re.sub(r'\s{2,}', ' ', t).strip()
        titulos.append(_bajar_gritos(t))
    return titulos


def main():
    ap = argparse.ArgumentParser(
        description='Convierte los marcadores de OBS en capítulos de YouTube.')
    ap.add_argument('video', help='el .mp4 grabado con OBS (formato MP4 híbrido)')
    ap.add_argument('guion', nargs='?',
                    help='el .md del guion, para ponerle nombre a cada marca')
    args = ap.parse_args()

    video = pathlib.Path(args.video)
    if not video.exists():
        sys.exit(f'No existe: {video}')

    marcas = leer_capitulos(video)
    if not marcas:
        sys.exit('Ese video no tiene marcadores.\n'
                 'Se graba en MP4 híbrido y se aprieta el atajo durante la toma;\n'
                 'en MKV los marcadores no existen.')

    titulos = leer_secciones(args.guion) if args.guion else []

    if titulos and len(titulos) != len(marcas):
        # No se emparejan. Se avisa y se usan igual los que haya, porque una
        # lista con algunos nombres puestos sirve más que ninguna.
        # Los avisos van a stderr: así `capitulos.py ... > lista.txt` deja el
        # archivo limpio y las advertencias se siguen viendo en pantalla.
        print(f'OJO: {len(marcas)} marcas y {len(titulos)} secciones en el guion.',
              file=sys.stderr)
        print('     Faltó o sobró algún apretón. Mirá los que quedaron sin nombre.',
              file=sys.stderr)
        print('', file=sys.stderr)

    lineas = []
    for i, m in enumerate(marcas):
        if i < len(titulos):
            nombre = titulos[i]
        elif m['titulo'] and not m['titulo'].lower().startswith('sin nombre'):
            nombre = m['titulo']          # OBS trae uno propio: sirve
        else:
            nombre = '(SIN NOMBRE)'
        lineas.append(f"{reloj(m['segundos'])} {nombre}")

    for l in lineas:
        print(l)

    # Y además en un archivo, que es de donde conviene copiar: la consola de
    # Windows es cp1252 y le come los acentos, así que lo que se ve en pantalla
    # pegado en YouTube saldría con signos raros. El .txt va en UTF-8 y sale bien.
    destino = video.parent / (video.stem + '_capitulos.txt')
    destino.write_text('\n'.join(lineas) + '\n', encoding='utf-8')
    print('', file=sys.stderr)
    print(f'Copiá desde acá, que respeta los acentos: {destino}', file=sys.stderr)

    # Sin emoji a propósito: la consola de Windows los escapa y ensucia el aviso.
    if marcas[0]['segundos'] > 0.5:
        print('', file=sys.stderr)
        print('OJO: la lista NO arranca en 0:00 y YouTube la va a ignorar.',
              file=sys.stderr)
    if len(marcas) < 3:
        print('', file=sys.stderr)
        print('OJO: YouTube pide al menos 3 capitulos.', file=sys.stderr)


if __name__ == '__main__':
    main()
