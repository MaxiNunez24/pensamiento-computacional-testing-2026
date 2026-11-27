"""Arma el tutorial de la encuesta: graba, une los cuadros, renderiza y le pone la voz.

    python armar.py                 (graba de nuevo la encuesta publicada, renderiza y mezcla la voz)
    python armar.py --sin-grabar    (usa la grabación que ya está)
    python armar.py --sin-voz       (sin la voz: cada paso a su ritmo, como la primera versión)
    python armar.py --solo-voz      (vuelve a mezclar la voz sobre el render que ya está)

1. Con la voz (voz/00.m4a … 10.m4a, una por frase de guiones/tutorial-encuesta.md), mide cuánto dura
   cada frase y escribe minimos.json: cada paso de la grabación dura por lo menos su frase.
2. grabar.mjs completa la encuesta sola y guarda los cuadros y los pasos (grabacion/).
3. armar-clip.py une los cuadros en grabacion/pantalla.mp4.
4. Acá: copia el clip a hf/assets, pone en hf/index.html cuánto dura cada parte y cuándo empieza cada
   paso, y renderiza a hf/renders/tutorial-encuesta.mp4 (HyperFrames 0.9.69).
5. Mezcla la voz (../mezcla_voz.py) → hf/renders/tutorial-encuesta-voz.mp4.

La música (la misma pista del video de promoción, de Pixabay) y la voz no se suben.
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
HF = AQUI / 'hf'
VOZ = AQUI / 'voz'
sys.path.insert(0, str(AQUI.parent))
from mezcla_voz import hablado, mezclar   # noqa: E402

# Qué frase va con qué paso de la grabación (00 es la entrada y 10 la salida: no son de la grabación)
FRASES = {'01': 'abrir', '02': 'dias', '03': 'horario', '04': 'flechas', '05': 'agregar', '06': 'otro',
          '07': 'avisar', '08': 'enviar', '09': 'gracias'}
RESPIRO = 0.2   # cuánto después de que arranca un paso empieza a hablar
# Cuánto espera el toque principal de un paso, según lo que dura su frase: que caiga cuando la voz
# dice "tocá…" (en la barra, después de "cada clase dura tres horas y veinte")
ANTES = {'horario': lambda d: d * 0.45, 'agregar': lambda d: d - 1.6, 'enviar': lambda d: d - 1.9}
# Frases que salieron más fuertes o más suaves que el resto, en dB (27/11: "Con las flechas", agresiva)
AJUSTE = {'04': -3.0}

solo_voz = '--solo-voz' in sys.argv
con_voz = VOZ.exists() and '--sin-voz' not in sys.argv


def npx(*args):
    subprocess.run(['npx', '-y', 'hyperframes@0.9.69', *args], cwd=HF, check=True, shell=(sys.platform == 'win32'))


def poner(html, patron, valor):
    html, n = re.subn(patron, valor, html)
    assert n == 1, f'no encontré {patron}'
    return html


dura = {f.stem: hablado(f) for f in sorted(VOZ.glob('*.m4a'))} if con_voz else {}
INICIO = max(3.0, 0.3 + dura.get('00', 0) + 0.4)    # cuándo aparece la encuesta (después de la entrada)
SALIDA = max(4.8, 0.3 + dura.get('10', 0) + 1.5)    # cuánto dura la salida con el QR

if not solo_voz:
    minimos = {}
    for num, paso in FRASES.items():
        if num in dura:
            minimos[paso] = {'min': round(max(RESPIRO + dura[num] + 0.45, 2.6 if paso == 'gracias' else 0), 2)}
            if paso in ANTES:
                minimos[paso]['antes'] = round(max(0, ANTES[paso](dura[num])), 2)
    (AQUI / 'minimos.json').write_text(json.dumps(minimos, indent=2))
    if '--sin-grabar' not in sys.argv:
        subprocess.run(['node', 'grabar.mjs'], cwd=AQUI, check=True)
        subprocess.run([sys.executable, 'armar-clip.py'], cwd=AQUI, check=True)

clip = AQUI / 'grabacion' / 'pantalla.mp4'
video = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(clip)],
                             capture_output=True, text=True, check=True).stdout)
pasos = {p['id']: p['t'] for p in json.loads((AQUI / 'grabacion' / 'pasos.json').read_text())}
fin = INICIO + video - 0.1
total = fin + SALIDA
render = HF / 'renders' / 'tutorial-encuesta.mp4'

if not solo_voz:
    shutil.copy(clip, HF / 'assets' / 'pantalla.mp4')
    html = (HF / 'index.html').read_text(encoding='utf-8')
    html = poner(html, r'const INICIO = [\d.]+;', f'const INICIO = {INICIO:.3f};')
    html = poner(html, r'const VIDEO = [\d.]+;', f'const VIDEO = {video:.3f};')
    html = poner(html, r'const PASOS = \{[^}]*\};', f'const PASOS = {json.dumps(pasos)};')
    html = poner(html, r'(id="root"[^>]*data-duration=")[\d.]+', rf'\g<1>{total:.3f}')
    html = poner(html, r'(id="e1"[^>]*data-duration=")[\d.]+', rf'\g<1>{INICIO + 0.2:.3f}')
    html = poner(html, r'(id="v-pantalla"[^>]*data-start=")[\d.]+(" data-duration=")[\d.]+', rf'\g<1>{INICIO:.3f}\g<2>{video:.3f}')
    html = poner(html, r'(id="e3"[^>]*data-start=")[\d.]+(" data-duration=")[\d.]+', rf'\g<1>{fin:.3f}\g<2>{SALIDA:.3f}')
    html = poner(html, r'(id="musica"[^>]*data-duration=")[\d.]+', rf'\g<1>{total:.3f}')
    (HF / 'index.html').write_text(html, encoding='utf-8')

    npx('lint')
    (HF / 'renders').mkdir(exist_ok=True)
    npx('render', '-o', str(render), '--quality', 'looks')
    print(f'\ntutorial: {total:.1f} s')

if con_voz:
    clips = [(VOZ / '00.m4a', 0.3)] if '00' in dura else []
    clips += [(VOZ / f'{num}.m4a', INICIO + pasos[paso] + RESPIRO, AJUSTE.get(num, 0))
              for num, paso in FRASES.items() if num in dura]
    if '10' in dura:
        clips.append((VOZ / '10.m4a', fin + 0.3))
    mezclar(render, clips, HF / 'renders' / 'tutorial-encuesta-voz.mp4', HF / 'renders' / '_voz')
