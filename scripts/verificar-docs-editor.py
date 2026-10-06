#!/usr/bin/env python3
"""Corre los ejemplos del panel de documentación del editor.

    python scripts/verificar-docs-editor.py

Por qué existe
--------------
El panel que aparece al lado del cartel de sugerencias le muestra al alumno un
ejemplo con su resultado:

    "  Ana  ".strip() → "Ana"

Un ejemplo equivocado ahí es peor que no tener panel: el alumno lo copia, le da
otra cosa, y no tiene forma de saber quién se equivocó. Así que no se revisan
leyéndolos: se corren.

La convención en `src/scripts/editor-comun.ts` (campo `ejemplo` de DOCS)
---------------------------------------------------------------------
- Una línea SIN flecha se ejecuta (es la preparación).
- Una línea `EXPRESION → VALOR` comprueba que `EXPRESION` valga `VALOR`.

Sale con código 1 si algún ejemplo miente.
"""
import pathlib
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

FUENTE = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'scripts' / 'editor-comun.ts'

# nombre: { ... ejemplo: '...' }  — las comillas simples de JS, con sus escapes.
ENTRADA = re.compile(
    r"^  (\w+):\s*\{.*?ejemplo:\s*'((?:[^'\\]|\\.)*)'",
    re.S | re.M,
)


def destildar(crudo):
    """Lo que escribió TypeScript, como lo lee Python."""
    return crudo.replace('\\n', '\n').replace("\\'", "'").replace('\\\\', '\\')


def revisar(nombre, ejemplo):
    """Devuelve la lista de problemas de UN método."""
    problemas = []
    entorno = {}
    for linea in ejemplo.split('\n'):
        linea = linea.strip()
        if not linea:
            continue
        if '→' not in linea:
            try:
                exec(linea, entorno)
            except Exception as e:                       # noqa: BLE001
                problemas.append(f'no corre `{linea}`: {type(e).__name__}: {e}')
            continue

        izquierda, derecha = (p.strip() for p in linea.split('→', 1))
        try:
            dio = eval(izquierda, entorno)               # noqa: S307
        except Exception as e:                           # noqa: BLE001
            problemas.append(f'no corre `{izquierda}`: {type(e).__name__}: {e}')
            continue
        try:
            esperado = eval(derecha, entorno)            # noqa: S307
        except Exception as e:                           # noqa: BLE001
            problemas.append(f'el resultado `{derecha}` no es Python válido: {e}')
            continue
        if dio != esperado:
            problemas.append(f'`{izquierda}` dice {derecha} y da {dio!r}')
    return problemas


texto = FUENTE.read_text(encoding='utf-8')
# Solo el bloque DOCS, para no agarrar otros objetos del archivo.
inicio = texto.index('const DOCS')
bloque = texto[inicio:texto.index('\n};', inicio)]

encontrados = ENTRADA.findall(bloque)
if not encontrados:
    print('⚠️  No encontré ningún ejemplo. ¿Cambió la forma de DOCS?')
    sys.exit(1)

fallados = []
for nombre, crudo in encontrados:
    problemas = revisar(nombre, destildar(crudo))
    for p in problemas:
        fallados.append((nombre, p))

print(f'Métodos con panel: {len(encontrados)}')
for nombre, _ in encontrados:
    pass

if fallados:
    print(f'\n❌ {len(fallados)} ejemplo(s) no dicen la verdad:\n')
    for nombre, problema in fallados:
        print(f'   {nombre:12} {problema}')
    sys.exit(1)

print('✅ Todos los ejemplos del panel dan lo que prometen.')
