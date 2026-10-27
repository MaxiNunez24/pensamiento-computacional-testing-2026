"""Traza los programas de las animaciones: src/animaciones/programas/*.py → src/animaciones/trazas/*.json.

    python scripts/trazar-animaciones.py            (todos)
    python scripts/trazar-animaciones.py catalogo-llamadas

La traza es lo que corrió el programa, paso a paso: qué línea, cuánto valía cada
variable, la pila de llamadas y lo que mostró. La escena (src/animaciones/*.js)
la convierte en animación con desdeTraza(), y le agrega las preguntas.

Usa el trazador del motor de animaciones tal como viene en node_modules: es el
MISMO que corre en el navegador para "Ver cómo corre", así que lo que se ve en
una clase y lo que ve un alumno con su propio código salen igual. Correlo cada
vez que cambie un programa, o cuando se actualice el motor.
"""
import json
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'node_modules' / 'motor-animaciones' / 'src' / 'pedagogico'))
from trazador import _motor_trazar  # noqa: E402

PROGRAMAS = RAIZ / 'src' / 'animaciones' / 'programas'
TRAZAS = RAIZ / 'src' / 'animaciones' / 'trazas'
MAX_PASOS = 400

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
TRAZAS.mkdir(exist_ok=True)
pedidos = sys.argv[1:]
for programa in sorted(PROGRAMAS.glob('*.py')):
    if pedidos and programa.stem not in pedidos:
        continue
    codigo = programa.read_text(encoding='utf-8')
    traza = json.loads(_motor_trazar(codigo, MAX_PASOS, []))
    destino = TRAZAS / f'{programa.stem}.json'
    destino.write_text(json.dumps(traza, ensure_ascii=False, indent=1), encoding='utf-8')
    pasos = traza.get('pasos') or traza.get('traza') or []
    print(f'{programa.stem}: {len(pasos)} pasos → {destino.relative_to(RAIZ)}')
