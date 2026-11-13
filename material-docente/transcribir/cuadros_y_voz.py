# -*- coding: utf-8 -*-
"""Parte un video de una sola toma en tramos para mirarlo por partes: cuadros y voz.

    python cuadros_y_voz.py recorrido.mp4
    python cuadros_y_voz.py recorrido.mp4 --cada 2 --tramo 30 --salida carpeta/

Pensado para el video del recorrido del stand (12/11/2026): una sola toma de 3 o 4
minutos, yendo y viniendo, con alguien hablando. Mirarlo de corrido no sirve
para corregir: hace falta poder decir "en el 01:40 se ve que la mesa no entra".

Sale, en la carpeta de salida:

    cuadros/01m40s.jpg     un cuadro cada --cada segundos (el más nítido de esa
                           ventana, no el primero: caminando, la mitad sale movida)
    hojas/tramo-04.jpg     una hoja por tramo (--tramo segundos): los cuadros en
                           grilla con su minuto, y abajo lo que se dijo en ese tramo
    voz.json               lo que se dijo, con su minuto (faster-whisper, local)
    tramos.md              el índice: por tramo, su hoja, lo dicho y lugar para notas

TODO QUEDA EN ESTA PC
---------------------
La voz se transcribe con faster-whisper en esta máquina (con la placa si puede).
Por defecto la salida va a contenido-privado/, que no se sube al repo: en un
video del CFP aparece gente.

POR QUÉ DOS PYTHON
------------------
La transcripción corre con el .venv de esta carpeta, que tiene las librerías de
CUDA para la placa (ver PASO-A-PASO.md). Las hojas las arma el Python del
sistema, que tiene Pillow. Este script corre con el del sistema y llama al otro.
"""

import argparse
import json
import pathlib
import subprocess
import sys
import textwrap

try:
    sys.stdout.reconfigure(errors='replace')
    sys.stderr.reconfigure(errors='replace')
except Exception:
    pass

import av
import numpy as np
from PIL import Image, ImageDraw, ImageFont

AQUI = pathlib.Path(__file__).resolve().parent
REPO = AQUI.parent.parent
VENV = AQUI / '.venv' / 'Scripts' / 'python.exe'


def reloj(seg):
    seg = int(seg)
    return f'{seg // 60:02d}:{seg % 60:02d}'


def nombre_cuadro(seg):
    seg = int(seg)
    return f'{seg // 60:02d}m{seg % 60:02d}s.jpg'


def nitidez(gris):
    """Varianza del laplaciano: alta si hay bordes marcados, baja si salió movido."""
    g = gris.astype(np.float32)
    lap = -4 * g[1:-1, 1:-1] + g[:-2, 1:-1] + g[2:, 1:-1] + g[1:-1, :-2] + g[1:-1, 2:]
    return float(lap.var())


# ─────────────────────────── Los cuadros ───────────────────────────────

def sacar_cuadros(video, carpeta, cada, ancho, rotar):
    """Recorre el video entero y guarda, por cada ventana de `cada` segundos, el
    cuadro más nítido. Devuelve [(segundo, ruta, cambio)], donde `cambio` dice
    cuánto se movió la imagen respecto del cuadro anterior (para ver los giros)."""
    carpeta.mkdir(parents=True, exist_ok=True)
    elegidos = []
    with av.open(str(video)) as cont:
        flujo = cont.streams.video[0]
        flujo.thread_type = 'AUTO'
        duracion = float(cont.duration / av.time_base) if cont.duration else 0
        mejor = None  # (nitidez, frame, t) de la ventana actual
        ventana = 0
        anterior = None

        def cerrar(mejor):
            nonlocal anterior
            _, frame, t = mejor
            img = frame.to_image()
            giro = rotar if rotar is not None else -int(getattr(frame, 'rotation', 0) or 0)
            if giro:
                img = img.rotate(giro, expand=True)
            if img.width > ancho:
                img = img.resize((ancho, round(img.height * ancho / img.width)), Image.LANCZOS)
            ruta = carpeta / nombre_cuadro(t)
            img.save(ruta, quality=85)
            chico = np.asarray(img.convert('L').resize((64, 64)), dtype=np.float32)
            cambio = float(np.abs(chico - anterior).mean()) if anterior is not None else 0.0
            anterior = chico
            elegidos.append((t, ruta, cambio))
            print(f'\r  cuadros… {reloj(t)} / {reloj(duracion)}', end='', flush=True)

        for frame in cont.decode(flujo):
            if frame.time is None:
                continue
            t = float(frame.time)
            v = int(t // cada)
            if v != ventana and mejor is not None:
                cerrar(mejor)
                mejor = None
            ventana = v
            gris = frame.reformat(width=240, height=max(2, round(240 * frame.height / frame.width)), format='gray').to_ndarray()
            n = nitidez(gris)
            if mejor is None or n > mejor[0]:
                mejor = (n, frame, t)
        if mejor is not None:
            cerrar(mejor)
    print()
    return elegidos


# ─────────────────────────── La voz ────────────────────────────────────

def transcribir(video, salida, modelo):
    """Corre la transcripción con el .venv (el que tiene CUDA) y guarda voz.json."""
    destino = salida / 'voz.json'
    py = str(VENV) if VENV.exists() else sys.executable
    codigo = (
        'import json, sys; sys.path.insert(0, sys.argv[1]); import transcribir as t; '
        'tramos = t.transcribir(sys.argv[2], sys.argv[3], "es"); '
        'json.dump(tramos, open(sys.argv[4], "w", encoding="utf-8"), ensure_ascii=False, indent=1)'
    )
    subprocess.run([py, '-c', codigo, str(AQUI), str(video), modelo, str(destino)], check=True)
    return json.loads(destino.read_text(encoding='utf-8'))


# ─────────────────────────── Las hojas ─────────────────────────────────

def fuente(tam):
    for nombre in ('segoeui.ttf', 'arial.ttf', 'DejaVuSans.ttf'):
        try:
            return ImageFont.truetype(nombre, tam)
        except OSError:
            pass
    return ImageFont.load_default(size=tam)


def armar_hoja(cuadros, dichos, titulo, ruta, columnas=5, miniatura=360):
    imgs = [Image.open(r) for _, r, _ in cuadros]
    alto_min = max(round(i.height * miniatura / i.width) for i in imgs)
    filas = (len(imgs) + columnas - 1) // columnas
    f_titulo, f_hora, f_texto = fuente(30), fuente(22), fuente(21)

    renglones = []
    for d in dichos:
        for i, r in enumerate(textwrap.wrap(f"[{reloj(d['inicio'])}] {d['texto'].strip()}", 150)):
            renglones.append(r if i == 0 else '        ' + r)
    if not renglones:
        renglones = ['(no se habla en este tramo)']

    margen, sep = 16, 8
    ancho = margen * 2 + columnas * miniatura + (columnas - 1) * sep
    alto = 60 + filas * (alto_min + sep) + 20 + len(renglones) * 28 + margen
    hoja = Image.new('RGB', (ancho, alto), '#15181e')
    dib = ImageDraw.Draw(hoja)
    dib.text((margen, 14), titulo, font=f_titulo, fill='#ffffff')
    for k, ((t, _, cambio), img) in enumerate(zip(cuadros, imgs)):
        x = margen + (k % columnas) * (miniatura + sep)
        y = 60 + (k // columnas) * (alto_min + sep)
        img = img.resize((miniatura, round(img.height * miniatura / img.width)))
        hoja.paste(img, (x, y))
        etiqueta = reloj(t) + ('  ↻' if cambio > 28 else '')  # ↻: la imagen cambió mucho (un giro)
        dib.rectangle([x, y, x + 92, y + 30], fill='#000000')
        dib.text((x + 6, y + 2), etiqueta, font=f_hora, fill='#ffd54f')
    y = 60 + filas * (alto_min + sep) + 12
    for r in renglones:
        dib.text((margen, y), r, font=f_texto, fill='#e6e6e6')
        y += 28
    hoja.save(ruta, quality=88)


def main():
    ap = argparse.ArgumentParser(description='Cuadros y voz de un video, por tramos.')
    ap.add_argument('video')
    ap.add_argument('--salida', help='carpeta de salida (por defecto contenido-privado/videos/<nombre>)')
    ap.add_argument('--cada', type=float, default=2, help='segundos entre cuadros (2)')
    ap.add_argument('--tramo', type=float, default=30, help='segundos por hoja (30)')
    ap.add_argument('--ancho', type=int, default=1280, help='ancho de cada cuadro guardado (1280)')
    ap.add_argument('--rotar', type=int, help='girar los cuadros N grados (si el celu lo dejó acostado)')
    ap.add_argument('--modelo', default='large-v3')
    ap.add_argument('--sin-voz', action='store_true', help='solo los cuadros')
    args = ap.parse_args()

    video = pathlib.Path(args.video).resolve()
    salida = pathlib.Path(args.salida) if args.salida else REPO / 'contenido-privado' / 'videos' / video.stem
    salida.mkdir(parents=True, exist_ok=True)
    print(f'Video: {video.name}\nSalida: {salida}')

    print('1/3 Cuadros')
    cuadros = sacar_cuadros(video, salida / 'cuadros', args.cada, args.ancho, args.rotar)

    dichos = []
    if not args.sin_voz:
        print(f'2/3 Voz ({args.modelo})')
        dichos = transcribir(video, salida, args.modelo)

    print('3/3 Hojas por tramo')
    (salida / 'hojas').mkdir(exist_ok=True)
    fin = cuadros[-1][0] if cuadros else 0
    indice = [f'# {video.name}\n', f'Un cuadro cada {args.cada:g} s, hojas de {args.tramo:g} s. '
              '↻ en un cuadro = la imagen cambió mucho (un giro o un paso grande).\n']
    n = 0
    t0 = 0.0
    while t0 <= fin:
        t1 = t0 + args.tramo
        en_tramo = [c for c in cuadros if t0 <= c[0] < t1]
        dicho = [d for d in dichos if t0 <= d['inicio'] < t1]
        if en_tramo:
            n += 1
            titulo = f'Tramo {n} · {reloj(t0)} a {reloj(min(t1, fin + 1))}'
            hoja = salida / 'hojas' / f'tramo-{n:02d}.jpg'
            armar_hoja(en_tramo, dicho, titulo, hoja)
            indice.append(f'\n## {titulo}\n\n![](hojas/{hoja.name})\n')
            indice += [f"- [{reloj(d['inicio'])}] {d['texto'].strip()}" for d in dicho] or ['- (no se habla)']
            indice.append('\n**Notas:**\n')
        t0 = t1
    (salida / 'tramos.md').write_text('\n'.join(indice), encoding='utf-8')
    print(f'Listo: {n} tramos, {len(cuadros)} cuadros. Índice: {salida / "tramos.md"}')


if __name__ == '__main__':
    main()
