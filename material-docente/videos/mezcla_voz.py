"""La mezcla de la voz de Maxi sobre un video ya renderizado (la usan promo-2027 y tutorial-encuesta).

    from mezcla_voz import mezclar
    mezclar(render, [(Path('voz/00.m4a'), 0.25), (Path('voz/04.m4a'), 12.0, -3), ...], salida, temporal)

Cada clip es (archivo, segundo del video donde empieza a hablar) y, si hace falta, unos dB de más o de
menos para esa frase sola (ej. una que salió "agresiva"). Antes, cada frase se lleva a la misma
sonoridad, así ninguna sobresale. Para acomodar la voz a la animación, un clip también puede ser un
dict con un trozo del archivo: {archivo, en, desde, hasta, apretar (achica los silencios de adentro),
tempo (atempo, sin pasar de 1,06 para que no se note), db}.

La voz (27/11, después de probar dos extremos):
- 26/11 con reductor de ruido fuerte: "en una caja", sin graves;
- 26/11 con sala estéreo y realce de agudos: les sonó "a publicidad de tecnología";
- 27/11 sin nada de eso: a Maxi le sonó rara, seca.
Queda en el medio: sin reductor de ruido (las grabaciones vienen limpias), cuerpo en los graves, menos
"caja", un poco de presencia, un de-esser suave, compresión suave y una sala corta en estéreo, baja.
No lleva autotune: en la voz hablada no afina nada, solo la vuelve robótica.

La música baja `musica_db` y, mientras se habla, el sidechain la baja `ducking` veces más (ratio).
Los niveles van con ganancias fijas medidas en dos pasadas, no con loudnorm dinámico, que subía y
bajaba la música entre frase y frase. Todo termina a −14 LUFS, lo que pide Instagram.
"""
import re
import subprocess
from pathlib import Path

CADENA_VOZ = ','.join([
    'highpass=f=75',
    'equalizer=f=150:t=q:w=1.0:g=2',          # cuerpo
    'equalizer=f=400:t=q:w=1.2:g=-2',         # menos "caja"
    'equalizer=f=3500:t=q:w=1.2:g=1',         # presencia, apenas
    'highshelf=f=9000:g=-1',
    'deesser=i=0.3:m=0.5:f=0.5',              # las eses
    'acompressor=threshold=-22dB:ratio=2:attack=15:release=150:knee=6',
])
# La sala: dos ecos cortos distintos a cada lado (así suena estéreo) y bien por debajo de la voz
SALA_IZQ = 'aecho=0.8:0.8:19|37|61|89:0.3|0.22|0.15|0.08'
SALA_DER = 'aecho=0.8:0.8:23|43|71|101:0.3|0.22|0.15|0.08'
SALA_NIVEL = 0.11
FRASE_LUFS = -21.0   # cada frase se lleva a esto antes de mezclarlas


def medir_lufs(archivo):
    """La sonoridad integrada (LUFS) de un audio, con el ebur128 de ffmpeg."""
    salida = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(archivo), '-af', 'ebur128', '-f', 'null', '-'],
                            capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', salida)[-1])


def duracion(archivo):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                                 str(archivo)], capture_output=True, text=True, check=True).stdout)


def region_hablada(archivo):
    """Desde y hasta dónde se habla en un archivo (segundos). Los sonidos sueltos de menos de 0,25 s
    en las puntas (el clic de cortar la grabación, una respiración) no cuentan."""
    total = duracion(archivo)
    salida = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(archivo), '-af', 'silencedetect=n=-38dB:d=0.2',
                             '-f', 'null', '-'], capture_output=True, text=True).stderr
    inicios = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', salida)]
    fines = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', salida)]
    # los tramos con sonido son los huecos entre silencios
    cortes = sorted([(max(0, i), 'i') for i in inicios] + [(f, 'f') for f in fines])
    sonido, desde = [], 0.0
    for t, tipo in cortes:
        if tipo == 'i':
            if t - desde > 0.01:
                sonido.append((desde, t))
        else:
            desde = t
    if not inicios or (fines and max(fines) > max(inicios)):
        sonido.append((desde, total))
    while len(sonido) > 1 and sonido[0][1] - sonido[0][0] < 0.25:
        sonido.pop(0)
    while len(sonido) > 1 and sonido[-1][1] - sonido[-1][0] < 0.25:
        sonido.pop()
    return (sonido[0][0], sonido[-1][1]) if sonido else (0.0, total)


def hablado(archivo):
    """Cuánto dura lo que se dice en un archivo, sin los silencios ni los ruidos de las puntas."""
    desde, hasta = region_hablada(archivo)
    return hasta - desde


def mezclar(render, clips, salida, temporal, musica_db=-3.0, ducking=3, voz_lufs=-16.0):
    temporal.mkdir(parents=True, exist_ok=True)
    dura = duracion(render)

    # 1 · La voz sola: cada frase a la misma sonoridad, en su lugar, y procesada
    entradas, filtros, sonoridad = [], [], {}
    for i, clip in enumerate(clips):
        if isinstance(clip, dict):
            c = clip
        else:
            archivo, segundo, extra = (*clip, 0)[:3]
            ini, fin = region_hablada(archivo)
            c = {'archivo': archivo, 'en': segundo, 'db': extra, 'desde': max(0, ini - 0.08), 'hasta': fin + 0.12}
        archivo = Path(c['archivo'])
        if archivo not in sonoridad:
            sonoridad[archivo] = medir_lufs(archivo)
        ganancia = FRASE_LUFS - sonoridad[archivo] + c.get('db', 0)
        entradas += ['-i', str(archivo)]
        pasos = ['aformat=sample_rates=48000:channel_layouts=mono']
        if 'desde' in c:
            # un trozo del archivo, con fundidos cortitos para que el corte no haga "clic"
            largo = c['hasta'] - c['desde']
            pasos += [f"atrim=start={c['desde']}:end={c['hasta']}", 'asetpts=PTS-STARTPTS',
                      'afade=t=in:d=0.03', f'afade=t=out:st={largo - 0.05:.3f}:d=0.05']
        else:
            pasos.append('silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.08')
        if c.get('apretar'):
            pasos.append('silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-38dB:stop_silence=0.2')
        if c.get('tempo'):
            pasos.append(f"atempo={c['tempo']}")
        pasos += [f'volume={ganancia:.2f}dB', f"adelay={round(c['en'] * 1000)}:all=1"]
        filtros.append(f'[{i}:a]' + ','.join(pasos) + f'[v{i}]')
    n = len(clips)
    filtros.append(''.join(f'[v{i}]' for i in range(n)) +
                   f'amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={dura:.3f},{CADENA_VOZ}[a]')
    seca = temporal / 'voz.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *entradas, '-filter_complex', ';'.join(filtros),
                    '-map', '[a]', '-c:a', 'pcm_s24le', str(seca)], check=True)
    voz_db = voz_lufs - medir_lufs(seca)

    # 2 · La mezcla: la voz al centro con la sala a los costados, y la música que se corre al hablar
    filtro = (f'[1:a]volume={voz_db:.2f}dB,asplit=4[vc][vl][vr][k];'
              f'[vl]{SALA_IZQ},highpass=f=250,lowpass=f=7000,volume={SALA_NIVEL}[sl];'
              f'[vr]{SALA_DER},highpass=f=250,lowpass=f=7000,volume={SALA_NIVEL}[sr];'
              '[sl][sr]join=inputs=2:channel_layout=stereo[sala];'
              '[vc]aformat=channel_layouts=stereo[centro];'
              '[centro][sala]amix=inputs=2:normalize=0[voz];'
              '[k]aformat=channel_layouts=stereo[llave];'
              f'[0:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={musica_db}dB[fondo];'
              f'[fondo][llave]sidechaincompress=threshold=0.04:ratio={ducking}:attack=30:release=400:knee=4[bajo];'
              '[bajo][voz]amix=inputs=2:normalize=0:duration=first[a]')
    mezcla = temporal / 'mezcla.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(render), '-i', str(seca), '-filter_complex', filtro,
                    '-map', '[a]', '-c:a', 'pcm_s24le', str(mezcla)], check=True)
    total_db = -14 - medir_lufs(mezcla)

    # 3 · A −14 LUFS con una sola ganancia, y un limitador para los picos
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(render), '-i', str(mezcla),
                    '-filter_complex', f'[1:a]volume={total_db:.2f}dB,alimiter=limit=0.84:attack=3:release=60:level=false[a]',
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
                    '-ar', '48000', str(salida)], check=True)
    print(f'con voz: {salida} (voz {voz_db:+.1f} dB, total {total_db:+.1f} dB)')
    return voz_db, total_db
