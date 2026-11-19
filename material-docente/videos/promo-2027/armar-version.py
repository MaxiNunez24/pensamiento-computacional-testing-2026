"""Arma el video de promoción con una pista de música, con todos los cortes en sus golpes.

    python armar-version.py glitch-hop              (o standard-02, melodic-dubstep, o todas)
    python armar-version.py glitch-hop --base       (además deja hf/ armado con esa pista)
    python armar-version.py glitch-hop --sin-grabar (usa las escenas del motor ya grabadas)

Para cada pista:
1. Graba las escenas del motor (motor/*.html) al tempo de la pista (?golpe=...).
2. Copia la composición a versiones/<pista>/, con el golpe G, los tiempos y la música puestos:
   cada elemento con data-b0/data-b1 (golpe de entrada y de salida) recibe su data-start y su
   data-duration.
3. La renderiza a hf/renders/<pista>.mp4.

Los números de cada pista salen de `npx hyperframes beats <pista>.mp3 --json` (los golpes) y de
buscar el drop: el golpe donde la energía salta. El drop cae en el corte 1 (golpe 8 del video).
Necesita FFmpeg en el PATH, Node y el repo del motor en D:/Dev/motor-animaciones (no se toca).
"""
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

AQUI = Path(__file__).resolve().parent
HF = AQUI / 'hf'
MOTOR = Path('D:/Dev/motor-animaciones')
PUERTO = 8123
ESCENAS_MOTOR = ['desde-cero', 'ia-por-dentro', 'web']
# Las escenas con caídas rápidas necesitan más desenfoque de movimiento (si no, quedan "fantasmas")
DESENFOQUE = {'desde-cero': 10, 'ia-por-dentro': 6, 'web': 8}

PISTAS = {
    # golpe: segundos por golpe en ese tramo · drop: segundo de la pista donde entra con todo.
    # En los glitch hop va el ÚLTIMO drop, el más lleno (pedido de Maxi del 19/11). Los primeros
    # eran 59.105 s (The_Mountain) y 67.665 s (vjgalaxy).
    'glitch-hop': {'archivo': 'glitch-hop-the-mountain.mp3', 'golpe': 0.4615, 'drop': 103.415,
                   'credito': 'Glitch Hop, de The_Mountain (Pixabay)'},
    'standard-02': {'archivo': 'standard-glitch-hop-02.mp3', 'golpe': 0.4245, 'drop': 142.035,
                    'credito': 'Standard Glitch Hop 02, de vjgalaxy (Pixabay)'},
    'melodic-dubstep': {'archivo': 'melodic-dubstep-berrydeep.mp3', 'golpe': 0.415, 'drop': 92.735,
                        'credito': 'Melodic Dubstep, de BerryDeep (Pixabay)'},
}


def npx(*args, cwd):
    subprocess.run(['npx', '-y', 'hyperframes@0.9.69', *args], cwd=cwd, check=True, shell=(sys.platform == 'win32'))


def grabar_motor(nombre, golpe):
    servidor = subprocess.Popen([sys.executable, '-m', 'http.server', str(PUERTO), '--bind', '127.0.0.1'],
                                cwd=AQUI / 'motor', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(1.5)
        for escena in ESCENAS_MOTOR:
            salida = HF / 'assets' / f'{escena}-{nombre}.mp4'
            subprocess.run(['node', 'herramientas/video.js', '--base', f'http://127.0.0.1:{PUERTO}',
                            '--url', f'{escena}.html?golpe={golpe}', '--ancho', '1080', '--alto', '1920',
                            '--desenfoque', str(DESENFOQUE[escena]), '--obturador', '0.35', '--subtitulos', 'no',
                            '--salida', str(salida)], cwd=MOTOR, check=True)
    finally:
        servidor.terminate()
    # El último cuadro de la escena web es la "animación" de la lección del giro
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-sseof', '-0.1', '-i', str(HF / 'assets' / f'web-{nombre}.mp4'),
                    '-frames:v', '1', str(HF / 'assets' / f'web-final-{nombre}.png')], check=True)


def poner_tiempos(html, p):
    """Recalcula data-start/data-duration desde data-b0/data-b1, y pone G y la música."""
    G = p['golpe']

    def etiqueta(m):
        tag = m.group(0)
        b0 = re.search(r'data-b0="([\d.]+)"', tag)
        if not b0:
            return tag
        num = lambda attr, defecto: float(re.search(rf'{attr}="(-?[\d.]+)"', tag).group(1)) if f'{attr}="' in tag else defecto
        inicio = num('data-b0', 0) * G + num('data-d0', 0)
        fin = num('data-b1', 0) * G + num('data-d1', 0)
        tag = re.sub(r'data-start="[\d.]+"', f'data-start="{inicio:.3f}"', tag)
        return re.sub(r'data-duration="[\d.]+"', f'data-duration="{fin - inicio:.3f}"', tag)

    html = re.sub(r'<[a-z]+ [^>]*data-b0="[^>]*>', etiqueta, html)
    html, n = re.subn(r'const G = [\d.]+;', f'const G = {G};', html)
    assert n == 1, 'no encontré "const G"'
    html, n = re.subn(r'(<audio id="musica" src="assets/)[^"]+(")', rf'\g<1>{p["archivo"]}\g<2>', html)
    assert n == 1, 'no encontré el <audio id="musica">'
    html = re.sub(r'data-media-start="[\d.]+"', f'data-media-start="{p["drop"] - 8 * G:.3f}"', html)
    return html


def armar(nombre, base=False, grabar=True):
    p = PISTAS[nombre]
    if grabar:
        grabar_motor(nombre, p['golpe'])

    carpeta = AQUI / 'versiones' / nombre
    if carpeta.exists():
        shutil.rmtree(carpeta)
    (carpeta / 'assets').mkdir(parents=True)
    for archivo in ['hyperframes.json', 'meta.json', 'package.json']:
        shutil.copy(HF / archivo, carpeta / archivo)
    for imagen in list((HF / 'assets').glob('*.png')) + list((HF / 'assets').glob('*.svg')):
        if not re.search(r'-(glitch-hop|standard-02|melodic-dubstep)\.png$', imagen.name):
            shutil.copy(imagen, carpeta / 'assets' / imagen.name)
    propios = {f'{e}-{nombre}.mp4': f'{e}.mp4' for e in ESCENAS_MOTOR} | {f'web-final-{nombre}.png': 'web-final.png'}
    for origen, destino in propios.items():
        shutil.copy(HF / 'assets' / origen, carpeta / 'assets' / destino)
        if base:
            shutil.copy(HF / 'assets' / origen, HF / 'assets' / destino)
    shutil.copy(HF / 'assets' / 'musica' / p['archivo'], carpeta / 'assets' / p['archivo'])
    if base:
        shutil.copy(HF / 'assets' / 'musica' / p['archivo'], HF / 'assets' / p['archivo'])

    html = poner_tiempos((HF / 'index.html').read_text(encoding='utf-8'), p)
    (carpeta / 'index.html').write_text(html, encoding='utf-8')
    if base:
        (HF / 'index.html').write_text(html, encoding='utf-8')

    npx('lint', cwd=carpeta)
    (HF / 'renders').mkdir(exist_ok=True)
    npx('render', '-o', str(HF / 'renders' / f'{nombre}.mp4'), '--quality', 'looks', cwd=carpeta)
    G = p['golpe']
    print(f'\n{nombre}: {60 / G:.1f} BPM, {128 * G:.2f} s, la pista desde {p["drop"] - 8 * G:.2f} s')


if __name__ == '__main__':
    opciones = [a for a in sys.argv[1:] if a.startswith('--')]
    pedidas = [a for a in sys.argv[1:] if not a.startswith('--')] or ['todas']
    for nombre in (PISTAS if pedidas == ['todas'] else pedidas):
        armar(nombre, base='--base' in opciones, grabar='--sin-grabar' not in opciones)
