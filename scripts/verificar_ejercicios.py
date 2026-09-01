#!/usr/bin/env python3
"""Verifica que ningún ejercicio le muestre al alumno un error NUESTRO.

Existe por un caso concreto. Un alumno escribió bien las dos líneas que pedía el
ejercicio pero le faltó el `print` del final, y en vez de decírselo la
plataforma le mostró esto:

    En los tests, línea 1:  r = correr().rstrip().splitlines()[-1]
    IndexError: list index out of range

Un error de código nuestro, en un archivo que él no puede abrir, justo en el
momento en que menos herramientas tiene para saber de quién es la culpa. Al
auditarlo, pasaba en 41 de los 178 ejercicios.

Qué hace este script: corre **todos** los ejercicios con el editor prácticamente
vacío —como lo tiene el alumno el primer minuto— y comprueba que lo que sale sea
un mensaje que se pueda accionar y no una excepción de Python cruda.

Uso:
    python3 scripts/verificar_ejercicios.py
    python3 scripts/verificar_ejercicios.py --verbose    (muestra qué vería el alumno)

Sale con código 1 si encuentra un ejercicio roto.

⚠️ Ojo: la función `traducir()` de acá abajo es un ESPEJO del manejo de errores
de `src/scripts/pyodide-worker.ts`. Si allá se cambia cómo se le explica un
error al alumno, hay que cambiarlo acá también — si no, este script empieza a
mentir. Es el precio de poder revisar 178 ejercicios sin abrir un navegador.
"""
import io
import os
import re
import sys
import tempfile
import traceback

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLASES = os.path.join(RAIZ, 'src', 'content', 'docs', 'clases')

# Los tres componentes que corren código del alumno contra tests.
COMPONENTES = r'<(EjercicioPython|EncontrarElError|CompletarCodigo)\b(.*?)\n>'


def desescapar(literal: str) -> str:
    """Deshace el escapado de un template literal de JS, en UNA pasada.

    Tiene que ser una sola pasada de izquierda a derecha, como hace JS. Con
    `replace()` encadenados, un `\\\\n` (dos barras y una ene, que en el .mdx
    representa el `\\n` literal de un string de Python) se convierte primero en
    barra + salto de línea, que es otra cosa. Los ejercicios de archivos y json
    están llenos de esos.
    """
    fuera = []
    i = 0
    while i < len(literal):
        if literal[i] == '\\' and i + 1 < len(literal):
            siguiente = literal[i + 1]
            fuera.append({'n': '\n', 't': '\t', 'r': '\r'}.get(siguiente, siguiente))
            i += 2
        else:
            fuera.append(literal[i])
            i += 1
    return ''.join(fuera)


def ejercicios_de(ruta: str):
    """Saca (titulo, datos, starter, tests) de cada ejercicio de un .mdx."""
    fuente = io.open(ruta, encoding='utf-8').read()
    for bloque in re.finditer(COMPONENTES, fuente, re.S):
        cuerpo = bloque.group(2)
        titulo = re.search(r'titulo="([^"]*)"', cuerpo)
        if not titulo:
            continue
        props = {}
        for nombre in ('datos', 'starter', 'tests', 'codigo', 'plantilla'):
            encontrado = re.search(nombre + r'=\{`(.*?)`\}', cuerpo, re.S)
            props[nombre] = desescapar(encontrado.group(1)) if encontrado else ''
        # EncontrarElError trae el código ya escrito y CompletarCodigo la
        # plantilla con huecos: en esos el alumno no arranca de cero.
        arranque = props['starter'] or props['codigo'] or props['plantilla']
        yield titulo.group(1), props['datos'], arranque, props['tests']


def como_arranca(starter: str) -> str:
    """El editor en el primer minuto: los comentarios del starter y nada más."""
    return '\n'.join(l for l in starter.split('\n') if l.strip().startswith('#'))


def correr(datos: str, codigo: str, tests: str) -> str:
    """Reproduce lo que hace el worker de Pyodide. Devuelve lo que se imprimió."""
    salida = io.StringIO()
    espacio = {}
    viejo = sys.stdout
    sys.stdout = salida
    # El worker registra el código en linecache para que el traceback traiga la
    # línea de texto. Sin esto, `marco.line` viene vacío y este script no puede
    # distinguir un IndexError que habla de la salida de uno que no.
    import linecache
    linecache.cache['tu_codigo'] = (len(codigo), None, codigo.splitlines(keepends=True), 'tu_codigo')
    linecache.cache['los_tests'] = (len(tests), None, tests.splitlines(keepends=True), 'los_tests')
    try:
        if datos:
            exec(compile(datos, 'los_datos', 'exec'), espacio)
        exec(compile(codigo, 'tu_codigo', 'exec'), espacio)
        espacio['salida'] = salida.getvalue()

        def _correr(entradas=None, **variables):
            propio = {}
            if datos:
                exec(compile(datos, 'los_datos', 'exec'), propio)
            propio.update(variables)
            buffer = io.StringIO()
            anterior = sys.stdout
            sys.stdout = buffer
            try:
                exec(compile(codigo, 'tu_codigo', 'exec'), propio)
            finally:
                sys.stdout = anterior
            return buffer.getvalue()

        espacio['correr'] = _correr
        exec(compile(tests, 'los_tests', 'exec'), espacio)
    finally:
        sys.stdout = viejo
    return salida.getvalue()


def traducir(error: BaseException, tests: str) -> tuple:
    """Qué ve el alumno. Espejo de pyodide-worker.ts (ver el aviso de arriba).

    Devuelve (esta_bien, mensaje).
    """
    rastro = traceback.extract_tb(error.__traceback__)
    en_el_test = any(m.filename == 'los_tests' for m in rastro)
    # Un test que usa correr(), salida o splitlines corrige mirando lo que el
    # alumno imprime. Uno que no, es de escribir una función y nadie espera un
    # print.
    mira_la_salida = 'correr(' in tests or 'salida' in tests or 'splitlines' in tests

    if isinstance(error, AssertionError):
        texto = str(error)
        return bool(texto), texto or '(un assert SIN MENSAJE: el alumno no sabe qué falló)'

    if isinstance(error, NameError):
        # "no definiste la función" es información útil y el motor la explica.
        return True, str(error)

    if isinstance(error, ModuleNotFoundError):
        # El motor tiene un mensaje propio para esto.
        return True, str(error)

    if isinstance(error, IndexError):
        if en_el_test and mira_la_salida:
            return True, 'Tu programa todavía no muestra nada en pantalla…'
        return False, f'IndexError que el motor no sabe explicar: {error}'

    if isinstance(error, SyntaxError):
        if error.filename not in ('tu_codigo', 'los_tests', 'los_datos'):
            # ast.literal_eval("") sobre una salida vacía.
            return True, 'Tu programa todavía no muestra nada en pantalla…'
        return False, f'Error de sintaxis en {error.filename}: {error.msg}'

    return False, f'{type(error).__name__}: {error}'


def main() -> int:
    verboso = '--verbose' in sys.argv
    trabajo = tempfile.mkdtemp(prefix='verificar_ejercicios_')

    revisados = 0
    rotos = []
    avisos = []
    for archivo in sorted(os.listdir(CLASES)):
        if not archivo.endswith('.mdx'):
            continue
        clase = archivo[:-4]
        for titulo, datos, starter, tests in ejercicios_de(os.path.join(CLASES, archivo)):
            if not tests:
                continue
            revisados += 1
            os.chdir(trabajo)   # los de archivos/json escriben en el disco
            try:
                correr(datos, como_arranca(starter), tests)
                # Pasó con el editor prácticamente vacío. Casi siempre es un
                # test que no exige nada — pero hay un caso legítimo: el primer
                # ejercicio de bienvenida, donde el starter ya trae el código y
                # lo único que se pide es apretar Ejecutar. Por eso es AVISO y
                # no ERROR: como en verificar_render.py, la heurística que puede
                # dar falsos positivos no frena el deploy.
                avisos.append((clase, titulo, 'pasa con el editor vacío: ¿el test exige algo?'))
                continue
            except BaseException as error:      # noqa: BLE001 — es justo lo que queremos ver
                esta_bien, mensaje = traducir(error, tests)
            finally:
                os.chdir(RAIZ)
            if not esta_bien:
                rotos.append((clase, titulo, mensaje))
            elif verboso:
                print(f'  · {clase} / {titulo}\n      {mensaje.splitlines()[0][:90]}')

    print(f'Ejercicios revisados: {revisados}')
    for clase, titulo, mensaje in avisos:
        print(f'  AVISO  {clase} / {titulo}: {mensaje}')
    if not rotos:
        print('Todos le explican al alumno qué le falta, en vez de mostrarle un error nuestro. ✅')
        return 0

    print()
    print(f'ERROR — {len(rotos)} ejercicio(s) le muestran al alumno un error que no es suyo:')
    for clase, titulo, mensaje in rotos:
        print(f'  ✗ {clase} / {titulo}')
        print(f'      {mensaje}')
    print()
    print('Arreglalo en el ejercicio (mejor mensaje en el assert) o en el motor')
    print('(src/scripts/pyodide-worker.ts), según si es un caso puntual o general.')
    return 1


if __name__ == '__main__':
    sys.exit(main())
