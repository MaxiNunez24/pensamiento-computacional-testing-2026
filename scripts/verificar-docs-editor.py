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
- Las líneas SIN flecha se ejecutan, todas juntas hasta la próxima flecha (así
  un `with` o un `for` de dos renglones funciona).
- Una línea `EXPRESION → VALOR` comprueba que `EXPRESION` valga `VALOR`.

Cada método corre en una carpeta temporal propia, con lo que el alumno ya tiene
a mano cuando usa esos métodos: un `dia.txt` (dos renglones: `30111222,P` y
`28999888,A`), `sqlite3` importado, y una `con` con la tabla `alumnos`
(dni, nombre) y una sola fila: `30111222`, `Ana`.

Sale con código 1 si algún ejemplo miente. Además avisa (sin fallar) qué
métodos del autocompletado todavía no tienen panel.
"""
import os
import pathlib
import re
import sqlite3
import sys
import tempfile

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

FUENTE = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'scripts' / 'editor-comun.ts'
DIA_TXT = '30111222,P\n28999888,A\n'

# nombre: { ... ejemplo: '...' }  — las comillas simples de JS, con sus escapes.
ENTRADA = re.compile(r"^  (\w+):\s*\{.*?ejemplo:\s*'((?:[^'\\]|\\.)*)'", re.S | re.M)
ETIQUETA = re.compile(r"\{ label: '(\w+)', type: 'method'")


def destildar(crudo):
    """Lo que escribió TypeScript, como lo ve el navegador.

    En UNA pasada: `\\n` es un salto de renglón, y `\\\\n` es una barra y una n
    (lo que se escribe para que el panel MUESTRE un \\n, como en un archivo).
    Reemplazando de a uno, el segundo caso se rompía."""
    return re.sub(r'\\(.)', lambda m: '\n' if m.group(1) == 'n' else m.group(1), crudo)


def ejecutar(bloque, entorno, problemas):
    if bloque:
        codigo = '\n'.join(bloque)
        try:
            exec(codigo, entorno)                         # noqa: S102
        except Exception as e:                           # noqa: BLE001
            problemas.append(f'no corre `{bloque[0]}…`: {type(e).__name__}: {e}')
        bloque.clear()


def revisar(ejemplo):
    """Devuelve la lista de problemas de UN método."""
    problemas = []
    con = sqlite3.connect(':memory:')
    con.execute('CREATE TABLE alumnos (dni TEXT, nombre TEXT)')
    con.execute('INSERT INTO alumnos VALUES (?, ?)', ('30111222', 'Ana'))
    entorno = {'sqlite3': sqlite3, 'con': con}
    pendiente = []
    for linea in ejemplo.split('\n'):
        if not linea.strip():
            continue
        if '→' not in linea:
            pendiente.append(linea)
            continue
        ejecutar(pendiente, entorno, problemas)
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
    ejecutar(pendiente, entorno, problemas)
    return problemas


def en_carpeta_limpia(funcion, *args):
    """Corre `funcion` parado en una carpeta temporal con el dia.txt de prueba."""
    antes = os.getcwd()
    with tempfile.TemporaryDirectory() as carpeta:
        os.chdir(carpeta)
        try:
            pathlib.Path('dia.txt').write_text(DIA_TXT, encoding='utf-8')
            return funcion(*args)
        finally:
            os.chdir(antes)


texto = FUENTE.read_text(encoding='utf-8')
# Solo el bloque DOCS, para no agarrar otros objetos del archivo.
inicio = texto.index('const DOCS')
bloque_docs = texto[inicio:texto.index('\n};', inicio)]

# Un string de JS entre comillas simples no puede tener un salto de renglón de
# verdad adentro: es un error de sintaxis y el build se cae. Pasó: un script
# escribió `\n` y la consola se comió la barra. La regex de abajo lo aceptaba y
# el ejemplo corría bien en Python, así que esto daba verde con el archivo roto.
partidos = [s for s in re.findall(r"'((?:[^'\\]|\\.)*)'", bloque_docs, re.S) if '\n' in s]
if partidos:
    print('❌ Hay strings partidos en dos renglones (en TypeScript es un error de sintaxis):\n')
    for s in partidos:
        print('   ' + s.split('\n')[0][:80] + '  ⏎ …')
    print('\nEl salto adentro del ejemplo se escribe \\n, no con Enter.')
    sys.exit(1)

encontrados = ENTRADA.findall(bloque_docs)
if not encontrados:
    print('⚠️  No encontré ningún ejemplo. ¿Cambió la forma de DOCS?')
    sys.exit(1)

fallados = []
for nombre, crudo in encontrados:
    for problema in en_carpeta_limpia(revisar, destildar(crudo)):
        fallados.append((nombre, problema))

metodos = ETIQUETA.findall(texto)
con_panel = {n for n, _ in encontrados}
sin_panel = [m for m in metodos if m not in con_panel]

print(f'Métodos con panel: {len(con_panel)} de {len(metodos)}')
if sin_panel:
    print(f'   (todavía sin panel: {", ".join(sin_panel)})')

if fallados:
    print(f'\n❌ {len(fallados)} ejemplo(s) no dicen la verdad:\n')
    for nombre, problema in fallados:
        print(f'   {nombre:12} {problema}')
    sys.exit(1)

print('✅ Todos los ejemplos del panel dan lo que prometen.')
