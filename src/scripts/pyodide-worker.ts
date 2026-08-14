// Web Worker que corre Pyodide fuera del hilo principal.
//
// ¿Por qué un worker? Si un alumno escribe un bucle infinito (¡y va a pasar!),
// el código se cuelga ACÁ adentro y la página sigue viva. El hilo principal
// detecta el timeout, termina este worker y lo recrea. Sin worker, un
// `while True:` congelaría toda la pestaña sin posibilidad de recuperarla.

const PYODIDE_VERSION = 'v0.29.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

// Ejecuta el código del alumno y, opcionalmente, los tests, capturando stdout.
// Devuelve JSON {ok, out, err} con errores traducidos a mensajes amigables.
const RUNNER = `
import sys, io, traceback, json, linecache, importlib, os, ast, unicodedata

# La carpeta actual en sys.path: así un ejercicio puede importar el módulo
# (archivo .py) que escribió otro ejercicio antes. Es lo que permite "tener
# clases en distintos archivos".
if "." not in sys.path:
    sys.path.insert(0, ".")


# ---------------------------------------------------------------------------
# Comparaciones que EXPLICAN por qué no coinciden
#
# El caso que más frena a los alumnos: el print tiene que salir textual, y
# 'Ana tiene 30 anos' vs 'Ana tiene 30 años' se ven casi iguales. Mirar dos
# strings caracter por caracter para encontrar una tilde es un ejercicio de
# paciencia, no de programación.
#
# Cada 'assert a == b' de los tests se reescribe (más abajo, con ast) para que
# al fallar diga QUÉ difiere: los acentos, las mayúsculas, un espacio de más, o
# en qué caracter exacto se separan.
# ---------------------------------------------------------------------------

def _sin_tildes(s):
    return "".join(
        c for c in unicodedata.normalize("NFD", s)
        if unicodedata.category(c) != "Mn"
    )

def _pista_texto(a, b):
    """La diferencia entre dos strings, en criollo. '' si no hay nada útil."""
    # El más frecuente de todos y el que peor se explica solo: no salió nada.
    if a == "":
        return "👉 Tu programa no mostró nada. ¿Le falta el print(), o el print quedó adentro de un if que no se cumple?"
    sa, sb = _sin_tildes(a), _sin_tildes(b)
    if sa == sb:
        return "👉 Es el mismo texto salvo por los ACENTOS y la ñ. Lo más cómodo: copiá el texto del enunciado y pegalo."
    if a.lower() == b.lower():
        return "👉 Es el mismo texto pero cambian las MAYÚSCULAS y minúsculas."
    if sa.lower() == sb.lower():
        return "👉 Es el mismo texto salvo por los ACENTOS y las MAYÚSCULAS."
    if a.strip() == b.strip():
        return "👉 El texto está bien: sobra (o falta) un espacio o un salto de línea al principio o al final."
    if a.split() == b.split():
        return "👉 Las palabras están bien: lo que no coincide son los ESPACIOS del medio."

    # Uno está adentro del otro: sobra o falta un pedazo. Va ANTES de buscar la
    # primera diferencia, porque si sobra algo al principio ese cálculo dice
    # "difieren en el caracter 1" y no ayuda a nadie.
    def _bordes(entero, parte):
        i = entero.index(parte)
        antes, despues = entero[:i], entero[i + len(parte):]
        trozos = []
        if antes:
            trozos.append("al principio " + repr(antes))
        if despues:
            trozos.append("al final " + repr(despues))
        return " y ".join(trozos)

    if b and b in a:
        donde = _bordes(a, b)
        if donde:
            return "👉 Lo que hay que mostrar está adentro de tu texto, pero te SOBRA " + donde + "."
    if a and a in b:
        donde = _bordes(b, a)
        if donde:
            return "👉 Lo que escribiste está bien pero INCOMPLETO: te falta " + donde + "."

    # Dónde se separan, que es lo primero que uno mira.
    n = min(len(a), len(b))
    i = 0
    while i < n and a[i] == b[i]:
        i += 1
    if i == n and len(a) != len(b):
        if len(a) > len(b):
            return "👉 Empieza igual, pero al final te SOBRA: " + repr(a[n:])
        return "👉 Empieza igual, pero al final te FALTA: " + repr(b[n:])
    if i > 0:
        return ("👉 Coinciden hasta " + repr(a[:i]) + ". La primera diferencia está en el caracter "
                + str(i + 1) + ": vos pusiste " + repr(a[i]) + " y va " + repr(b[i]) + ".")
    return "👉 No se parecen desde el arranque. Volvé a leer el enunciado: ¿estás mostrando lo que pide?"

def _explicar(obtenido, esperado, texto):
    lineas = []
    if texto:
        lineas.append(str(texto))
    ro, resp = repr(obtenido), repr(esperado)
    # Si el mensaje del ejercicio ya muestra el valor, no lo repetimos.
    faltan = []
    if not texto or ro not in texto:
        faltan.append("Vos diste:   " + ro)
    if not texto or resp not in texto:
        faltan.append("Se esperaba: " + resp)
    if faltan:
        if lineas:
            lineas.append("")
        lineas.extend(faltan)
    if isinstance(obtenido, str) and isinstance(esperado, str):
        pista = _pista_texto(obtenido, esperado)
        if pista:
            lineas.append("")
            lineas.append(pista)
    return "\\n".join(lineas) or "Ese caso no dio el resultado esperado."

def _igual(obtenido, esperado, msg=None):
    if obtenido == esperado:
        return
    texto = None
    if msg is not None:
        # El mensaje llega como lambda y se evalúa SOLO acá: varios tests hacen
        # correr(...) adentro de su f-string, y evaluarlo siempre significaría
        # ejecutar el código del alumno de nuevo en cada assert que pasa.
        try:
            texto = msg()
        except Exception:
            texto = None
    raise AssertionError(_explicar(obtenido, esperado, texto))

class _ReescribirAsserts(ast.NodeTransformer):
    """assert a == b, msg   ->   _igual(a, b, lambda: msg)

    Solo el == simple. Todo lo demás (assert not x, a != b, comparaciones
    encadenadas) queda intacto y sigue funcionando como siempre.
    """

    def visit_Assert(self, nodo):
        prueba = nodo.test
        if not isinstance(prueba, ast.Compare):
            return nodo
        if len(prueba.ops) != 1 or not isinstance(prueba.ops[0], ast.Eq):
            return nodo
        if nodo.msg is None:
            mensaje = ast.Constant(value=None)
        else:
            mensaje = ast.Lambda(
                args=ast.arguments(
                    posonlyargs=[], args=[], vararg=None,
                    kwonlyargs=[], kw_defaults=[], kwarg=None, defaults=[],
                ),
                body=nodo.msg,
            )
        llamada = ast.Call(
            func=ast.Name(id="_igual", ctx=ast.Load()),
            args=[prueba.left, prueba.comparators[0], mensaje],
            keywords=[],
        )
        return ast.copy_location(ast.Expr(value=llamada), nodo)

def _compilar_tests(tests):
    # Los números de línea se preservan, así el traceback sigue apuntando a la
    # línea real del test que escribió el profe.
    arbol = _ReescribirAsserts().visit(ast.parse(tests, "los_tests", "exec"))
    ast.fix_missing_locations(arbol)
    return compile(arbol, "los_tests", "exec")

def _mk_input(cola):
    """Devuelve un input() que consume respuestas ya cargadas.

    Pyodide corre en un Web Worker y no puede frenarse a esperar que el alumno
    teclee (haría falta SharedArrayBuffer, que necesita cabeceras que GitHub
    Pages no deja poner). Así que las respuestas vienen de antemano y este
    input() las va sacando de la cola.

    El detalle que hace que se sienta real: imprime el prompt SEGUIDO del valor,
    que es exactamente lo que se ve en una terminal cuando alguien escribe y
    aprieta Enter.
    """
    def _input(prompt=""):
        if not cola:
            raise EOFError(
                "Tu programa pidió más datos de los que hay cargados en 'Entradas'. "
                "Agregá una línea más ahí abajo, o revisá si te quedó un input() de más."
            )
        valor = cola.pop(0)
        print(str(prompt) + valor)
        return valor
    return _input

def _run_user(code, tests="", archivo="", datos="", entradas_json=""):
    # Registramos el código en linecache para que el traceback pueda mostrar
    # la línea EXACTA que falló (sin esto, al venir de un string, queda en blanco).
    linecache.cache["tu_codigo"] = (len(code), None, code.splitlines(keepends=True), "tu_codigo")
    linecache.cache["los_tests"] = (len(tests), None, tests.splitlines(keepends=True), "los_tests")

    propios = {"tu_codigo", "los_tests"}
    mod_name = ""
    if archivo:
        # Este ejercicio "es" un archivo .py: lo guardamos en el disco virtual
        # para que otros ejercicios puedan importarlo.
        with open(archivo, "w", encoding="utf-8") as fh:
            fh.write(code)
        linecache.cache[archivo] = (len(code), None, code.splitlines(keepends=True), archivo)
        propios.add(archivo)
        mod_name = archivo[:-3] if archivo.endswith(".py") else archivo
        sys.modules.pop(mod_name, None)   # que un re-run tome la versión nueva
        importlib.invalidate_caches()

    _entradas = json.loads(entradas_json) if entradas_json else []

    buf = io.StringIO()
    old = sys.stdout
    sys.stdout = buf
    ns = {}
    ok = True
    err = ""
    try:
        # 'datos' son las variables que el ejercicio le REGALA al alumno (por
        # ejemplo, una edad ya cargada). Se ejecutan antes que su código, así el
        # botón Ejecutar funciona sin que él tenga que definirlas.
        if datos:
            exec(compile(datos, "los_datos", "exec"), ns)
        ns["input"] = _mk_input(list(_entradas))
        if archivo:
            importlib.import_module(mod_name)   # valida que el archivo del alumno cargue bien
        else:
            exec(compile(code, "tu_codigo", "exec"), ns)
        if tests:
            # --- Modo "programa" (sin funciones) -------------------------------
            # Hasta que el curso llegue a Funciones, los ejercicios no pueden
            # pedir 'def'. Para poder verificarlos igual, los tests reciben:
            #
            #   salida            -> lo que el programa imprimió (string)
            #   correr(**vars)    -> vuelve a correr el código del alumno con
            #                        otras variables ya definidas, y devuelve
            #                        lo que imprimió esta vez
            #
            # Con 'correr' un mismo programa se puede probar con varias entradas
            # sin que el alumno tenga que escribir una función.
            ns["salida"] = buf.getvalue()

            def _correr(entradas=None, **variables):
                _ns = {}
                if datos:
                    exec(compile(datos, "los_datos", "exec"), _ns)
                _ns.update(variables)   # lo que pide el test pisa al valor regalado
                # 'entradas' es lo que el alumno "tecleará" en esta corrida.
                _ns["input"] = _mk_input(list(_entradas if entradas is None else entradas))
                _buf = io.StringIO()
                _old = sys.stdout
                sys.stdout = _buf
                try:
                    exec(compile(code, "tu_codigo", "exec"), _ns)
                finally:
                    sys.stdout = _old
                return _buf.getvalue()

            ns["correr"] = _correr
            ns["_igual"] = _igual
            exec(_compilar_tests(tests), ns)
    except SyntaxError as e:
        ok = False
        donde = "los tests" if e.filename == "los_tests" else "tu código"
        err = f"Error de sintaxis en {donde}, línea {e.lineno}: {e.msg}"
    except ModuleNotFoundError as e:
        ok = False
        err = (f"No encontré el módulo '{e.name}'.\\n"
               f"¿Ejecutaste primero el ejercicio donde se define ({e.name}.py)? "
               f"Hacelo y volvé a intentar.")
    except Exception as e:
        ok = False
        tb = traceback.extract_tb(sys.exc_info()[2])
        partes = []
        for f in tb:
            if f.filename in propios:
                donde = "los tests" if f.filename == "los_tests" else "tu código"
                linea = (f.line or "").strip()
                if linea:
                    partes.append(f"En {donde}, línea {f.lineno}:  {linea}")
                else:
                    partes.append(f"En {donde}, línea {f.lineno}")
        msg = str(e)
        if isinstance(e, AssertionError):
            partes.append(msg if msg else "Ese caso no dio el resultado esperado.")
        else:
            tipo = type(e).__name__
            partes.append(f"{tipo}: {msg}" if msg else tipo)
        err = "\\n".join(partes)
    finally:
        sys.stdout = old
    return json.dumps({"ok": ok, "out": buf.getvalue(), "err": err})


class _TopeDePasos(Exception):
    """El código del alumno superó el máximo de pasos que estamos dispuestos a contar."""


def _medir(code, datos, escenarios_json, tope):
    """Cuenta cuántas LÍNEAS de código ejecuta la solución del alumno.

    Ese número es la métrica de eficiencia del curso. Es honesto y, sobre todo,
    ENTENDIBLE: no hace falta hablar de notación O-grande para que se vea que
    una solución hace 30 pasos y otra 500.000 con los mismos datos.

    Cómo: sys.settrace con un tracer que solo se engancha a los frames cuyo
    archivo es "tu_codigo". Así no contamos ni el armado del escenario ni las
    entrañas de Python.

    Efecto de borde buscado: sum(), max(), sorted() y compañía están escritos en
    C, así que valen UN paso. Es exactamente la lección que queremos dar —
    apoyarse en las herramientas del lenguaje sale más barato que reescribirlas.

    El tope corta los bucles desbocados: trazar es lento y sin él una solución
    de fuerza bruta se comería el timeout entero.
    """
    linecache.cache["tu_codigo"] = (len(code), None, code.splitlines(keepends=True), "tu_codigo")
    escenarios = json.loads(escenarios_json)
    resultados = []
    err = ""
    buf = io.StringIO()
    old = sys.stdout
    sys.stdout = buf
    try:
        for esc in escenarios:
            ns = {}
            if datos:
                exec(compile(datos, "los_datos", "exec"), ns)
            # Las definiciones se ejecutan ANTES de empezar a contar: lo que se
            # mide es resolver el problema, no declarar la función.
            exec(compile(code, "tu_codigo", "exec"), ns)

            cuenta = [0]

            def _local(frame, event, arg, _c=cuenta, _t=tope):
                if event == "line":
                    _c[0] += 1
                    if _c[0] > _t:
                        raise _TopeDePasos()
                return _local

            def _global(frame, event, arg):
                if frame.f_code.co_filename == "tu_codigo":
                    return _local
                return None

            cortado = False
            sys.settrace(_global)
            try:
                exec(compile(esc["codigo"], "el_escenario", "exec"), ns)
            except _TopeDePasos:
                cortado = True
            finally:
                sys.settrace(None)

            resultados.append({
                "etiqueta": esc.get("etiqueta", ""),
                "tamano": esc.get("tamano", 0),
                "pasos": cuenta[0],
                "cortado": cortado,
            })
    except Exception as e:
        tipo = type(e).__name__
        msg = str(e)
        err = f"{tipo}: {msg}" if msg else tipo
    finally:
        sys.settrace(None)
        sys.stdout = old
    return json.dumps({"ok": err == "", "err": err, "escenarios": resultados})
`;

type RunUserFn = (
  code: string,
  tests: string,
  archivo: string,
  datos: string,
  entradasJson: string,
) => string;

type MedirFn = (code: string, datos: string, escenariosJson: string, tope: number) => string;

let runUser: RunUserFn | null = null;
let medir: MedirFn | null = null;

async function init(): Promise<void> {
  const mod = await import(/* @vite-ignore */ `${PYODIDE_URL}pyodide.mjs`);
  const py = await mod.loadPyodide({ indexURL: PYODIDE_URL });
  py.runPython(RUNNER);
  // Guardamos UNA referencia a cada función (un solo PyProxy, sin fugas por corrida).
  runUser = py.globals.get('_run_user') as RunUserFn;
  medir = py.globals.get('_medir') as MedirFn;
  postMessage({ type: 'ready' });
}

const initPromise = init().catch((e) => {
  postMessage({ type: 'init-error', error: String(e) });
});

self.onmessage = async (
  ev: MessageEvent<{
    id: number;
    code: string;
    tests: string;
    archivo?: string;
    datos?: string;
    entradas?: string[];
    /** 'medir' cuenta pasos en vez de correr tests (ejercicios de eficiencia). */
    modo?: 'correr' | 'medir';
    escenarios?: unknown[];
    tope?: number;
  }>,
) => {
  const { id, code, tests, archivo, datos, entradas, modo, escenarios, tope } = ev.data;
  await initPromise;
  if (!runUser || !medir) return; // ya se reportó init-error
  let raw: string;
  try {
    raw =
      modo === 'medir'
        ? medir(code, datos || '', JSON.stringify(escenarios || []), tope || 200_000)
        : runUser(code, tests, archivo || '', datos || '', JSON.stringify(entradas || []));
  } catch (e) {
    raw = JSON.stringify({ ok: false, out: '', err: String(e) });
  }
  postMessage({ type: 'result', id, raw });
};
