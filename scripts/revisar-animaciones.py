"""Revisa las animaciones del curso: que nada se rompa sin que nadie lo note.

    python scripts/revisar-animaciones.py

1. Cada <Animacion escena="x"> de una clase tiene su escena: src/animaciones/x.js.
2. Cada traza está al día con su programa: se vuelve a trazar y se compara. Si
   alguien cambió el .py y no corrió scripts/trazar-animaciones.py, las
   preguntas (que van por número de paso) quedarían en otro lado.
"""
import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'node_modules' / 'motor-animaciones' / 'src' / 'pedagogico'))
from trazador import _motor_trazar  # noqa: E402

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
ANIMACIONES = RAIZ / 'src' / 'animaciones'
problemas = []

usadas = 0
for pagina in sorted((RAIZ / 'src' / 'content' / 'docs').rglob('*.mdx')):
    for escena in re.findall(r'<Animacion\b[^>]*\bescena="([^"]+)"', pagina.read_text(encoding='utf-8')):
        usadas += 1
        if not (ANIMACIONES / f'{escena}.js').exists():
            problemas.append(f'{pagina.relative_to(RAIZ)}: la escena "{escena}" no existe (src/animaciones/{escena}.js)')

programas = sorted((ANIMACIONES / 'programas').glob('*.py'))
for programa in programas:
    guardada = ANIMACIONES / 'trazas' / f'{programa.stem}.json'
    if not guardada.exists():
        problemas.append(f'{programa.name}: no tiene traza (python scripts/trazar-animaciones.py {programa.stem})')
        continue
    nueva = json.loads(_motor_trazar(programa.read_text(encoding='utf-8'), 400, []))
    if nueva != json.loads(guardada.read_text(encoding='utf-8')):
        problemas.append(f'{programa.name}: la traza está vieja (python scripts/trazar-animaciones.py {programa.stem}), '
                         'y revisá los números de paso de su escena')

print(f'Animaciones en las clases: {usadas}. Programas trazados: {len(programas)}.')
for p in problemas:
    print('  ❌', p)
print('✅ Todo en orden.' if not problemas else f'{len(problemas)} problema(s).')
sys.exit(1 if problemas else 0)
