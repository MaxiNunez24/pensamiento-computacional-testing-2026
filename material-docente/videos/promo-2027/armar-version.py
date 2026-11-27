"""Arma el video de promoción con una pista de música, con todos los cortes en sus golpes.

    python armar-version.py glitch-hop              (o standard-02, melodic-dubstep, o todas)
    python armar-version.py glitch-hop --base       (además deja hf/ armado con esa pista)
    python armar-version.py glitch-hop --sin-grabar (usa las escenas del motor ya grabadas)
    python armar-version.py glitch-hop --solo=web   (graba solo esas escenas, separadas por coma)

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
    # tramos: los pedazos de la pista que forman la música del video, en segundos y siempre en frases
    # enteras (cada 32 golpes). El video dura 164 golpes (desde el 26/11, con el cierre estirado para
    # la voz) y la pista se termina antes: el segundo tramo repite una frase del medio en vez de caer
    # en el final (casi en silencio), y así termina en un compás que empalma con el principio (loop
    # de Instagram).
    'glitch-hop': {'archivo': 'glitch-hop-the-mountain.mp3', 'golpe': 0.4615, 'drop': 103.415,
                   'tramos': [(99.725, 147.725), (118.195, 145.885)],
                   'credito': 'Glitch Hop, de The_Mountain (Pixabay)'},
    # En esta pista el detector de golpes se pierde después del drop (el tema tiene un tempo fijo), así
    # que los tramos salen de la grilla desde el drop: [drop - 8G, drop + 88G] y [drop + 24G, drop + 76G].
    # El segundo arranca en el mismo lugar de la frase donde cortó el primero (6 compases adentro).
    'standard-02': {'archivo': 'standard-glitch-hop-02.mp3', 'golpe': 0.4245, 'drop': 142.035,
                    'tramos': [(138.639, 179.391), (152.223, 174.297)],
                    'credito': 'Standard Glitch Hop 02, de vjgalaxy (Pixabay)'},
    'melodic-dubstep': {'archivo': 'melodic-dubstep-berrydeep.mp3', 'golpe': 0.415, 'drop': 92.735,
                        'credito': 'Melodic Dubstep, de BerryDeep (Pixabay)'},
}


# La voz de Maxi (voz/, no se sube), en trozos: (archivo, desde, hasta (segundos del archivo), golpe
# del video donde entra, respiro en segundos, opciones). Los cortes salen de los silencios de cada
# archivo (silencedetect) y de dónde dice cada palabra (faster-whisper), y la animación está corrida
# para que lo que se ve caiga con lo que se dice (toma del 27/11, voz más grave):
#   00 "en" y "programar" → EN_MARZO y PROGRAMAR en hf/index.html
#   01 "desde la base" → las cajas de motor/desde-cero.html
#   04 se parte en tres, una por pantalla: pedirle (golpe 40), crear (44), darte cuenta (50)
#   06 "armás páginas" con su rótulo (74) y "las publicás" con el suyo (82)
#   08 "las clases son así" → el giro se acelera (el título entra en el golpe 106.5)
#   10 "el viernes 4" → el cartel del viernes (golpe 134)
# apretar: los silencios de adentro que pasan de 0,3 s quedan en 0,2 s.
VOZ = [
    ('00-Gancho.m4a', 0.45, 3.50, 0, 0.0, {}),
    ('01-Desde cero.m4a', 0.55, 3.85, 8, 0.05, {}),
    ('02-Parte 1.m4a', 0.55, 1.20, 16, 0.0, {}),
    ('02-Parte 1.m4a', 1.42, 2.85, 16, 0.72, {'tempo': 1.06}),
    ('03-IA por dentro.m4a', 0.68, 9.10, 20, 0.47, {}),
    ('04-Usos.m4a', 0.60, 2.20, 40, 0.1, {}),
    ('04-Usos.m4a', 2.78, 5.66, 44, 0.2, {'apretar': True}),
    ('04-Usos.m4a', 6.25, 8.72, 50, 0.2, {}),
    ('05-Parte 2.m4a', 0.65, 1.40, 60, 0.05, {}),
    ('05-Parte 2.m4a', 1.80, 2.40, 60, 0.86, {}),
    ('06-Web.m4a', 0.40, 4.00, 74, -0.15, {}),
    ('06-Web.m4a', 4.60, 6.30, 82, 0.0, {}),
    ('07-Trabajos.m4a', 0.38, 6.40, 88, 0.1, {}),
    ('08-El giro.m4a', 0.15, 5.83, 104, 0.05, {'apretar': True}),
    ('09-El curso.m4a', 0.28, 5.68, 116, 0.05, {'apretar': True}),
    ('10-Inscripción.m4a', 0.36, 7.10, 128, 0.05, {}),
    ('11-Encuesta.m4a', 0.0, 7.74, 144, 0.05, {}),
]


def poner_voz(nombre):
    """Mezcla la voz sobre el render (ver ../mezcla_voz.py: la voz limpia, la música más baja y todo a
    -14 LUFS). Sale <pista>-voz.mp4."""
    sys.path.insert(0, str(AQUI.parent))
    from mezcla_voz import mezclar
    G = PISTAS[nombre]['golpe']
    clips = [dict(archivo=AQUI / 'voz' / archivo, desde=desde, hasta=hasta, en=golpe * G + respiro, **op)
             for archivo, desde, hasta, golpe, respiro, op in VOZ]
    # El glitch hop es denso: con −3 dB la voz quedaba apenas por encima (27/11). Más abajo, y que se
    # corra un poco más cuando se habla
    mezclar(HF / 'renders' / f'{nombre}.mp4', clips, HF / 'renders' / f'{nombre}-voz.mp4', HF / 'renders' / '_voz',
            musica_db=-7.0, ducking=4)


def npx(*args, cwd):
    subprocess.run(['npx', '-y', 'hyperframes@0.9.69', *args], cwd=cwd, check=True, shell=(sys.platform == 'win32'))


def grabar_motor(nombre, golpe, solo=None):
    servidor = subprocess.Popen([sys.executable, '-m', 'http.server', str(PUERTO), '--bind', '127.0.0.1'],
                                cwd=AQUI / 'motor', stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(1.5)
        for escena in (solo or ESCENAS_MOTOR):
            salida = HF / 'assets' / f'{escena}-{nombre}.mp4'
            subprocess.run(['node', 'herramientas/video.js', '--base', f'http://127.0.0.1:{PUERTO}',
                            '--url', f'{escena}.html?golpe={golpe}', '--ancho', '1080', '--alto', '1920',
                            '--desenfoque', str(DESENFOQUE[escena]), '--obturador', '0.35', '--subtitulos', 'no',
                            '--salida', str(salida)], cwd=MOTOR, check=True)
    finally:
        servidor.terminate()


def golpes_del_video(html):
    return float(re.search(r'id="root"[^>]*data-b1="([\d.]+)"', html).group(1))


def armar_musica(p, golpes, salida):
    """La música del video: los tramos de la pista, uno atrás de otro (sin tramos, de corrido desde
    8 golpes antes del drop)."""
    G = p['golpe']
    tramos = p.get('tramos') or [(p['drop'] - 8 * G, p['drop'] - 8 * G + golpes * G)]
    partes = ''.join(f'[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,'
                     f'afade=t=out:st={b - a - 0.012:.3f}:d=0.012[t{i}];' for i, (a, b) in enumerate(tramos))
    filtro = partes + ''.join(f'[t{i}]' for i in range(len(tramos))) + f'concat=n={len(tramos)}:v=0:a=1[m]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(HF / 'assets' / 'musica' / p['archivo']),
                    '-filter_complex', filtro, '-map', '[m]', '-c:a', 'libmp3lame', '-q:a', '2', str(salida)], check=True)


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
    html, n = re.subn(r'(<audio id="musica" src="assets/)[^"]+(")', r'\g<1>musica.mp3\g<2>', html)
    assert n == 1, 'no encontré el <audio id="musica">'
    html = re.sub(r'data-media-start="[\d.]+"', 'data-media-start="0"', html)
    return html


def armar(nombre, base=False, grabar=True, solo=None):
    p = PISTAS[nombre]
    if grabar:
        grabar_motor(nombre, p['golpe'], solo)

    carpeta = AQUI / 'versiones' / nombre
    if carpeta.exists():
        shutil.rmtree(carpeta)
    (carpeta / 'assets').mkdir(parents=True)
    for archivo in ['hyperframes.json', 'meta.json', 'package.json']:
        shutil.copy(HF / archivo, carpeta / archivo)
    for imagen in list((HF / 'assets').glob('*.png')) + list((HF / 'assets').glob('*.svg')):
        shutil.copy(imagen, carpeta / 'assets' / imagen.name)
    propios = {f'{e}-{nombre}.mp4': f'{e}.mp4' for e in ESCENAS_MOTOR}
    for origen, destino in propios.items():
        shutil.copy(HF / 'assets' / origen, carpeta / 'assets' / destino)
        if base:
            shutil.copy(HF / 'assets' / origen, HF / 'assets' / destino)
    original = (HF / 'index.html').read_text(encoding='utf-8')
    golpes = golpes_del_video(original)
    armar_musica(p, golpes, carpeta / 'assets' / 'musica.mp3')
    if base:
        shutil.copy(carpeta / 'assets' / 'musica.mp3', HF / 'assets' / 'musica.mp3')

    html = poner_tiempos(original, p)
    (carpeta / 'index.html').write_text(html, encoding='utf-8')
    if base:
        (HF / 'index.html').write_text(html, encoding='utf-8')

    npx('lint', cwd=carpeta)
    (HF / 'renders').mkdir(exist_ok=True)
    npx('render', '-o', str(HF / 'renders' / f'{nombre}.mp4'), '--quality', 'looks', cwd=carpeta)
    G = p['golpe']
    print(f'\n{nombre}: {60 / G:.1f} BPM, {golpes:.0f} golpes, {golpes * G:.2f} s')
    if (AQUI / 'voz').exists():
        poner_voz(nombre)


if __name__ == '__main__':
    opciones = [a for a in sys.argv[1:] if a.startswith('--')]
    pedidas = [a for a in sys.argv[1:] if not a.startswith('--')] or ['todas']
    for nombre in (PISTAS if pedidas == ['todas'] else pedidas):
        if '--solo-voz' in opciones:   # vuelve a mezclar la voz sobre el render que ya está
            poner_voz(nombre)
            continue
        solo = next((o.split('=', 1)[1].split(',') for o in opciones if o.startswith('--solo=')), None)
        armar(nombre, base='--base' in opciones, grabar='--sin-grabar' not in opciones, solo=solo)
