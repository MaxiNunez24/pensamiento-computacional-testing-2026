# -*- coding: utf-8 -*-
"""Transcribe las entrevistas y les mete las marcas en su minuto.

    python transcribir.py preceptoria.webm
    python transcribir.py preceptoria.webm --marcas marcas.txt
    python transcribir.py preceptoria.webm --modelo medium --idioma es

Sale un .md al lado del audio, con el texto por tramos y con cada marca metida
donde corresponde:

    [00:44] ...y ahí tengo que volver a cargar lo mismo en la otra planilla...

    ┌─ 🔖 00:45 · las planillas duplicadas
    └─ 🔖 00:47 · planillas  (Guada)

    [00:48] Claro, porque el sistema del Ministerio no te deja...

POR QUÉ ASÍ Y NO UNA TRANSCRIPCIÓN PELADA
-----------------------------------------
Una entrevista de 30 minutos son unas 5.000 palabras. Nadie las va a leer
enteras el martes a la noche. Las marcas son el índice que ya hicieron ustedes
en vivo: con esto, se busca el 🔖 y se lee el párrafo de alrededor.

Y las marcas de dos personas en el mismo minuto quedan juntas, que es la señal
de que ahí pasó algo importante.

TODO CORRE EN ESTA MÁQUINA
--------------------------
faster-whisper baja el modelo una vez y transcribe local. Los audios son gente
del CFP hablando de su trabajo: no se suben a ningún servicio.

INSTALACIÓN
-----------
    pip install -r requirements.txt

Y nada más: NO hace falta ffmpeg instalado. faster-whisper 1.x decodifica con
PyAV, que trae las librerías de ffmpeg adentro.

⚠️ En esta máquina hay dos Python 3.14 distintos. Usar `python`, no `python3`.
"""

import argparse
import pathlib
import re
import sys

# ─────────────────────────── Las marcas ────────────────────────────────

# "   00:47  planillas" y también "0:47 - planillas" o "1:02:30  algo"
RE_MARCA = re.compile(r'^\s*(?:(\d{1,2}):)?(\d{1,3}):(\d{2})\s*[-—–|.]?\s*(.*)$')
RE_ENCABEZADO = re.compile(r'^\s*──\s*(.+?)\s*(?:\(\d+:\d+\))?\s*$')


def leer_marcas(ruta, seccion=None):
    """Lee el texto que exporta el kit de entrevista.

    `seccion` filtra por entrevista: si el archivo trae las tres juntas, con
    --seccion "Preceptoría" se toman solo esas. Sin encabezados, entra todo.
    """
    texto = pathlib.Path(ruta).read_text(encoding='utf-8')
    lineas = texto.splitlines()
    hay_encabezados = any(RE_ENCABEZADO.match(l) for l in lineas)
    dentro = not hay_encabezados or seccion is None
    marcas = []

    for linea in lineas:
        enc = RE_ENCABEZADO.match(linea)
        if enc:
            dentro = seccion is None or seccion.lower() in enc.group(1).lower()
            continue
        m = RE_MARCA.match(linea)
        if not m or not dentro:
            continue
        hs = int(m.group(1) or 0)
        t = hs * 3600 + int(m.group(2)) * 60 + int(m.group(3))
        txt = (m.group(4) or '').strip()
        if txt == '(sin nombre)':
            txt = ''
        # El export pone el autor entre corchetes al final.
        autor = ''
        de = re.search(r'\[([^\]]+)\]\s*$', txt)
        if de:
            autor = de.group(1)
            txt = txt[: de.start()].strip()
        marcas.append({'t': t, 'texto': txt, 'de': autor})

    marcas.sort(key=lambda x: x['t'])
    return marcas


def reloj(seg):
    seg = int(seg)
    if seg >= 3600:
        return f'{seg // 3600}:{(seg % 3600) // 60:02d}:{seg % 60:02d}'
    return f'{seg // 60:02d}:{seg % 60:02d}'


def entretejer(tramos, marcas):
    """Devuelve las líneas del .md con las marcas metidas en su lugar.

    Una marca va DESPUÉS del tramo en el que cae. Se agrupan las que están a
    menos de 5 segundos: cuando dos personas marcaron el mismo momento, se lee
    de un vistazo que coincidieron.
    """
    salida = []
    pendientes = list(marcas)

    def volcar_hasta(limite):
        grupo = []
        while pendientes and pendientes[0]['t'] < limite:
            m = pendientes.pop(0)
            if grupo and m['t'] - grupo[-1]['t'] > 5:
                salida.extend(_dibujar(grupo))
                grupo = []
            grupo.append(m)
        if grupo:
            salida.extend(_dibujar(grupo))

    # Primero el texto, DESPUÉS las marcas que caen en ese tramo. Al revés se
    # lee la marca antes que la frase que la motivó, que es justo lo contrario
    # de lo que uno quiere al releer.
    for tr in tramos:
        salida.append(f"[{reloj(tr['inicio'])}] {tr['texto'].strip()}")
        volcar_hasta(tr['fin'])
    volcar_hasta(float('inf'))
    return salida


def _dibujar(grupo):
    lineas = ['']
    for i, m in enumerate(grupo):
        rama = '┌─' if i == 0 else '└─' if i == len(grupo) - 1 else '├─'
        if len(grupo) == 1:
            rama = '──'
        quien = f"  ({m['de']})" if m['de'] else ''
        lineas.append(f"{rama} 🔖 {reloj(m['t'])} · {m['texto'] or '(sin nombre)'}{quien}")
    if len(grupo) > 1:
        lineas.append(f"   ↑ {len(grupo)} personas marcaron este momento")
    lineas.append('')
    return lineas


# ─────────────────────────── La transcripción ──────────────────────────

def transcribir(audio, modelo, idioma):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit('Falta faster-whisper.  pip install -r requirements.txt')

    # GPU si la hay. En la máquina del profe hay una RTX 2060 SUPER, que con
    # float16 hace una entrevista de 30 minutos en un par de minutos. Si CUDA
    # no está, se cae a CPU con int8, que anda igual pero tarda ~10x.
    try:
        m = WhisperModel(modelo, device='cuda', compute_type='float16')
        print('  usando GPU (float16)')
    except Exception:
        m = WhisperModel(modelo, device='cpu', compute_type='int8')
        print('  usando CPU (int8) — va a tardar bastante más')

    segmentos, info = m.transcribe(
        str(audio),
        language=idioma,
        vad_filter=True,          # saca los silencios largos
        beam_size=5,
        # Una entrevista tiene ruido de aula, sillas y gente que se pisa.
        # Bajar el umbral evita que corte tramos como si fueran silencio.
        no_speech_threshold=0.5,
    )
    print(f"  duración detectada: {reloj(info.duration)}")

    tramos = []
    for s in segmentos:
        tramos.append({'inicio': s.start, 'fin': s.end, 'texto': s.text})
        print(f'\r  transcribiendo… {reloj(s.end)}', end='', flush=True)
    print()
    return tramos


def main():
    ap = argparse.ArgumentParser(description='Transcribe una entrevista y le mete las marcas.')
    ap.add_argument('audio', help='el archivo de audio (.webm, .mp3, .m4a, .wav…)')
    ap.add_argument('--marcas', help='el .txt exportado desde el kit de entrevista')
    ap.add_argument('--seccion', help='si el .txt trae varias entrevistas: "Preceptoría"')
    ap.add_argument('--modelo', default='large-v3',
                    help='large-v3 (mejor) · medium · small (más rápido). Por defecto large-v3')
    ap.add_argument('--idioma', default='es')
    args = ap.parse_args()

    audio = pathlib.Path(args.audio)
    if not audio.exists():
        sys.exit(f'No existe: {audio}')

    marcas = []
    if args.marcas:
        marcas = leer_marcas(args.marcas, args.seccion)
        print(f'  {len(marcas)} marcas leídas')

    print(f'Transcribiendo {audio.name} con el modelo {args.modelo}…')
    tramos = transcribir(audio, args.modelo, args.idioma)

    cuerpo = entretejer(tramos, marcas)
    destino = audio.with_suffix('.md')
    encabezado = [
        f'# {audio.stem}',
        '',
        f'Transcripción automática ({args.modelo}) con las marcas de la entrevista.',
        '**Revisar antes de citar:** los nombres propios y las palabras del CFP',
        '(SiGeS, matrícula, preceptoría, horas cátedra) son las que peor salen.',
        '',
        '---',
        '',
    ]
    destino.write_text('\n'.join(encabezado + cuerpo) + '\n', encoding='utf-8')
    print(f'\nListo: {destino}')
    if marcas:
        print(f'{len(marcas)} marcas metidas en su minuto. Buscá 🔖 en el archivo.')


if __name__ == '__main__':
    main()
