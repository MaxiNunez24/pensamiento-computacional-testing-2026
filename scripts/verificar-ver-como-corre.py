#!/usr/bin/env python3
"""Verifica "Ver cómo corre" en todos los ejercicios de Python, sin navegador.

Para cada <EjercicioPython> (salvo los que tienen `sinTraza`), hace lo mismo que
el botón: arma el programa con lo que el alumno tiene en el editor el primer
minuto (el starter), le agrega la llamada que se sugiere a partir de los tests,
y lo traza con el trazador del motor de animaciones. Después, Node arma la
escena con desdeTraza, en la columna de la clase y en pantalla completa.

El Python que arma el programa NO está copiado acá: se lee de la constante
TRAZAR de src/scripts/pyodide-worker.ts, el mismo texto que corre el worker.

Es error NUESTRO (sale con código 1):
- que el trazador o el armado del programa se caigan;
- que la llamada sugerida no sea Python válido;
- que desdeTraza no pueda armar la escena.

Es AVISO (no frena):
- que no se sugiera ninguna llamada aunque los tests llamen a algo que el
  starter define (el alumno vería solo los `def`);
- que el programa se corte a los 400 pasos.

Que el programa del starter termine en un error del alumno (un `pass` que
devuelve None, un input de más) está bien: es lo mismo que vería al Ejecutar.

Uso:
    python scripts/verificar-ver-como-corre.py
    python scripts/verificar-ver-como-corre.py --verbose
"""
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
RAIZ = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / 'scripts'))
from verificar_ejercicios import desescapar, con_constantes  # noqa: E402

MOTOR = RAIZ / 'node_modules' / 'motor-animaciones'
sys.path.insert(0, str(MOTOR / 'src' / 'pedagogico'))
import trazador  # noqa: E402

# El mismo Python que corre el worker (ver la constante TRAZAR).
worker = (RAIZ / 'src' / 'scripts' / 'pyodide-worker.ts').read_text(encoding='utf-8')
TRAZAR = re.search(r'const TRAZAR = `(.*?)`;', worker, re.S).group(1)
espacio = dict(vars(trazador))
exec(TRAZAR, espacio)
sugerir_llamada = espacio['_sugerir_llamada']
ver_como_corre = espacio['_ver_como_corre']

CARPETAS = [RAIZ / 'src' / 'content' / 'docs' / c for c in ('clases', 'web', 'preparando-expo')]


def prop_texto(cuerpo, nombre, constantes):
    """Un prop string: {`...`} (con ${CONST}), "..." o {CONST}."""
    m = re.search(nombre + r'=\{`(.*?)`\}', cuerpo, re.S)
    if m:
        return con_constantes(m.group(1), constantes)
    m = re.search(nombre + r'="([^"]*)"', cuerpo)
    if m:
        return m.group(1)
    m = re.search(nombre + r'=\{(\w+)\}', cuerpo)
    if m and isinstance(constantes.get(m.group(1)), str):
        return constantes[m.group(1)]
    return None


def objeto_archivos(texto, constantes):
    """{ 'alumno.py': ALUMNO_PY, 'otro.py': `...` } → dict."""
    archivos = {}
    for nombre, literal, constante in re.findall(r"'([\w.]+)':\s*(?:`(.*?)`|(\w+))", texto, re.S):
        archivos[nombre] = desescapar(literal) if not constante else constantes.get(constante, '')
    return archivos


def ejercicios():
    for carpeta in CARPETAS:
        for pagina in sorted(carpeta.glob('*.mdx')):
            fuente = pagina.read_text(encoding='utf-8')
            constantes = {n: desescapar(v) for n, v in re.findall(r'export const (\w+) = `(.*?)`;', fuente, re.S)}
            objetos = {n: v for n, v in re.findall(r'export const (\w+) = (\{.*?\n\});', fuente, re.S)}
            for bloque in re.finditer(r'<EjercicioPython\b(.*?)\n\s*>', fuente, re.S):
                cuerpo = bloque.group(1)
                titulo = re.search(r'titulo="([^"]*)"', cuerpo)
                if not titulo or re.search(r'\bsinTraza\b', cuerpo):
                    continue
                archivos = {}
                m = re.search(r'archivos=\{\{(.*?)\}\}', cuerpo, re.S)
                if m:
                    archivos = objeto_archivos(m.group(1), constantes)
                else:
                    m = re.search(r'archivos=\{(\w+)\}', cuerpo)
                    if m and m.group(1) in objetos:
                        archivos = objeto_archivos(objetos[m.group(1)], constantes)
                yield {
                    'clase': f'{pagina.parent.name}/{pagina.stem}',
                    'titulo': titulo.group(1),
                    'starter': prop_texto(cuerpo, 'starter', constantes) or '',
                    'tests': prop_texto(cuerpo, 'tests', constantes) or '',
                    'datos': prop_texto(cuerpo, 'datos', constantes) or '',
                    'entradas': prop_texto(cuerpo, 'entradas', constantes) or '',
                    'llamada': prop_texto(cuerpo, 'llamada', constantes),
                    'archivo': prop_texto(cuerpo, 'archivo', constantes) or '',
                    'archivos': archivos,
                }


def definidos(codigo):
    return set(re.findall(r'^(?:def|class)\s+(\w+)', codigo, re.M))


def ya_las_usa(codigo, nombres):
    """¿El programa ya llama a sus funciones afuera de los def? (un "para probar" al final)"""
    sueltas = [l for l in codigo.split('\n') if l and not l[0].isspace() and not re.match(r'(def|class|#|@)', l)]
    return any(re.search(r'\b' + n + r'\s*\(', l) for l in sueltas for n in nombres)


def main():
    verboso = '--verbose' in sys.argv
    trabajo = pathlib.Path(tempfile.mkdtemp(prefix='ver_como_corre_'))
    # Como el worker: los módulos del proyecto se importan desde la carpeta actual.
    sys.path.insert(0, '.')
    rotos, avisos, escenas = [], [], []
    finales = {}
    total = 0
    for ej in ejercicios():
        total += 1
        nombre = f"{ej['clase']} / {ej['titulo']}"
        os.chdir(trabajo)
        for archivo, contenido in ej['archivos'].items():
            (trabajo / archivo).write_text(contenido, encoding='utf-8')
        # Los módulos del proyecto se vuelven a leer en cada ejercicio, como en el worker.
        for modulo in [n[:-3] for n in ej['archivos']] + ([ej['archivo'][:-3]] if ej['archivo'] else []):
            sys.modules.pop(modulo, None)
        entradas = ej['entradas'].rstrip('\n').split('\n') if ej['entradas'] else []
        try:
            sugerida = ej['llamada'] if ej['llamada'] is not None else sugerir_llamada(ej['starter'], ej['tests'])
            if sugerida:
                compile(sugerida, 'llamada', 'exec')
            res = json.loads(ver_como_corre(ej['starter'], ej['tests'], ej['datos'], sugerida, False,
                                            json.dumps(entradas), 400))
        except Exception as e:  # noqa: BLE001
            rotos.append((nombre, f'{type(e).__name__}: {e}'))
            continue
        finally:
            os.chdir(RAIZ)
        # Un ejercicio que guarda un módulo (archivo="x.py") lo deja para los siguientes.
        if ej['archivo']:
            (trabajo / ej['archivo']).write_text(ej['starter'], encoding='utf-8')
        pasos = res['traza']['traza']
        final = pasos[-1].get('excepcion')
        finales[final['tipo'] if final else 'termina bien'] = finales.get(final['tipo'] if final else 'termina bien', 0) + 1
        usados = {n for n in definidos(ej['starter']) if re.search(r'\b' + n + r'\s*\(', ej['tests'])}
        if not sugerida and usados and not ya_las_usa(ej['starter'], definidos(ej['starter'])):
            avisos.append((nombre, f"no se sugiere llamada, y los tests usan {', '.join(sorted(usados))}"))
        if final and final['tipo'] == 'Corte':
            avisos.append((nombre, 'se corta a los 400 pasos'))
        if verboso:
            print(f"  · {nombre}: {len(pasos)} pasos, {final['tipo'] if final else 'ok'}"
                  + (f" | {sugerida.splitlines()[0]}" if sugerida else ''))
        escenas.append({'nombre': nombre, **res['traza']})
    shutil.rmtree(trabajo, ignore_errors=True)

    # Que desdeTraza pueda armar cada escena, en la columna y en pantalla completa.
    lote = pathlib.Path(tempfile.mkdtemp(prefix='ver_como_corre_js_'))
    (lote / 'escenas.json').write_text(json.dumps(escenas, ensure_ascii=False), encoding='utf-8')
    traza_js = (MOTOR / 'src' / 'pedagogico' / 'traza.js').as_uri()
    (lote / 'armar.mjs').write_text(f'''
import {{ desdeTraza }} from '{traza_js}';
import fs from 'node:fs';
const escenas = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const malas = [];
for (const {{ nombre, ...traza }} of escenas) {{
    try {{
        const armar = desdeTraza({{ ...traza, explicar: true, lineaGrande: true, alto: 'auto', ritmo: 1.2, archivo: 'tu_programa.py' }});
        for (const d of [{{ nombre: 'media', ancho: 650 }}, {{ nombre: 'ancha', ancho: 1600 }}, {{ nombre: 'angosta', ancho: 380 }}]) {{
            const e = armar(d);
            if (!e.linea.length) throw new Error('escena vacía en ' + d.nombre);
        }}
    }} catch (err) {{
        malas.push([nombre, String(err && err.stack || err).split('\\n').slice(0, 2).join(' | ')]);
    }}
}}
console.log(JSON.stringify(malas));
''', encoding='utf-8')
    salida = subprocess.run(['node', str(lote / 'armar.mjs'), str(lote / 'escenas.json')],
                            capture_output=True, text=True, encoding='utf-8')
    shutil.rmtree(lote, ignore_errors=True)
    if salida.returncode != 0:
        rotos.append(('(node)', salida.stderr.strip()[:500]))
    else:
        rotos += [(n, 'desdeTraza: ' + e) for n, e in json.loads(salida.stdout)]

    print(f'Ejercicios con "Ver cómo corre": {total}.')
    print('Cómo termina el programa del starter: ' + ', '.join(f'{k} {v}' for k, v in sorted(finales.items(), key=lambda x: -x[1])))
    for nombre, texto in avisos:
        print(f'  AVISO  {nombre}: {texto}')
    if not rotos:
        print('✅ Todos se pueden mirar correr.')
        return 0
    print(f'\nERROR: {len(rotos)} ejercicio(s) con un problema nuestro:')
    for nombre, texto in rotos:
        print(f'  ✗ {nombre}\n      {texto}')
    return 1


if __name__ == '__main__':
    sys.exit(main())
