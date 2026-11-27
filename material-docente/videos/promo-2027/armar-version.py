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


# La voz de Maxi (voz/, no se sube): cada frase entra en el golpe donde arranca su escena, más un
# respiro en segundos. A cada archivo se le saca el silencio del principio.
VOZ = [
    ('00-Gancho.m4a', 0, 0.0),    # las frases del gancho entran con la voz (EN_MARZO, PROGRAMAR en hf/index.html)
    ('01-Desde cero.m4a', 8, 0.15),
    ('02-Parte 1.m4a', 16, 0.0),
    ('03-IA por dentro.m4a', 20, 0.2),
    ('04-Usos.m4a', 40, 0.1),
    ('05-Parte 2.m4a', 60, 0.1),
    ('06-Web.m4a', 64, 0.3),
    ('07-Trabajos.m4a', 88, 0.1),
    ('08-El giro.m4a', 104, 0.1),
    ('09-El curso.m4a', 116, 0.1),
    ('10-Inscripción.m4a', 128, 0.1),
    ('11-Encuesta.m4a', 144, 0.1),
]


def medir_lufs(archivo):
    """La sonoridad integrada (LUFS) de un audio, con el ebur128 de ffmpeg."""
    salida = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(archivo), '-af', 'ebur128', '-f', 'null', '-'],
                            capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', salida)[-1])


def poner_voz(nombre, musica_db=-1.0):
    """Mezcla la voz sobre el render y sale <pista>-voz.mp4.

    La voz: sin filtros de ruido (las grabaciones vienen limpias y el reductor la dejaba "en una
    caja"), un poco de cuerpo en los graves y de presencia, compresión suave y una reverb de sala
    corta en estéreo (la voz seca queda en el centro y la sala se abre a los costados).
    La música baja `musica_db` y un poco más mientras se habla (sidechain suave).
    Los niveles van con ganancias fijas medidas en dos pasadas, no con loudnorm dinámico, que
    subía y bajaba la música entre frase y frase. Todo termina a -14 LUFS, lo que pide Instagram."""
    G = PISTAS[nombre]['golpe']
    render = HF / 'renders' / f'{nombre}.mp4'
    temporal = HF / 'renders' / '_voz'
    temporal.mkdir(exist_ok=True)
    # La voz termina antes que el video: se rellena con silencio, si no el compresor corta ahí
    dura = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                                 str(render)], capture_output=True, text=True, check=True).stdout)

    # 1 · La voz sola, en su lugar y procesada (sin la reverb todavía)
    entradas, filtros = [], []
    for i, (archivo, golpe, respiro) in enumerate(VOZ):
        entradas += ['-i', str(AQUI / 'voz' / archivo)]
        ms = round((golpe * G + respiro) * 1000)
        filtros.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=mono,'
                       f'silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.08,'
                       f'adelay={ms}:all=1[v{i}]')
    n = len(VOZ)
    filtros.append(''.join(f'[v{i}]' for i in range(n)) +
                   f'amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={dura:.3f},'
                   'highpass=f=70,'
                   'equalizer=f=140:t=q:w=0.9:g=3,'      # cuerpo
                   'equalizer=f=350:t=q:w=1.2:g=-2,'     # menos "caja"
                   'equalizer=f=3500:t=q:w=1.0:g=2,'     # presencia
                   'acompressor=threshold=-24dB:ratio=2.5:attack=10:release=120:knee=4[a]')
    seca = temporal / 'voz-seca.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *entradas, '-filter_complex', ';'.join(filtros),
                    '-map', '[a]', '-c:a', 'pcm_s24le', str(seca)], check=True)
    voz_db = -16 - medir_lufs(seca)

    # 2 · La mezcla: voz al centro + sala estéreo, y la música que se corre un poco cuando hablás
    sala_izq = 'aecho=0.8:0.85:19|37|61|89|127:0.32|0.25|0.18|0.12|0.07'
    sala_der = 'aecho=0.8:0.85:23|43|71|101|139:0.32|0.25|0.18|0.12|0.07'
    filtro = (f'[1:a]volume={voz_db:.2f}dB,asplit=4[vc][vl][vr][llave];'
              f'[vl]{sala_izq},highpass=f=250,lowpass=f=7000,volume=0.22[sl];'
              f'[vr]{sala_der},highpass=f=250,lowpass=f=7000,volume=0.22[sr];'
              '[sl][sr]join=inputs=2:channel_layout=stereo[sala];'
              '[vc]aformat=channel_layouts=stereo[centro];'
              '[centro][sala]amix=inputs=2:normalize=0[voz];'
              f'[0:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={musica_db}dB[fondo];'
              '[llave]aformat=channel_layouts=stereo[llave2];'
              '[fondo][llave2]sidechaincompress=threshold=0.05:ratio=3:attack=30:release=400:knee=4[bajo];'
              '[bajo][voz]amix=inputs=2:normalize=0:duration=first[a]')
    mezcla = temporal / 'mezcla.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(render), '-i', str(seca), '-filter_complex', filtro,
                    '-map', '[a]', '-c:a', 'pcm_s24le', str(mezcla)], check=True)
    total_db = -14 - medir_lufs(mezcla)

    # 3 · A -14 LUFS con una sola ganancia, y un limitador para los picos
    salida = HF / 'renders' / f'{nombre}-voz.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(render), '-i', str(mezcla),
                    '-filter_complex', f'[1:a]volume={total_db:.2f}dB,alimiter=limit=0.84:attack=3:release=60:level=false[a]',
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
                    '-ar', '48000', str(salida)], check=True)
    print(f'con voz: {salida} (voz {voz_db:+.1f} dB, total {total_db:+.1f} dB)')


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
