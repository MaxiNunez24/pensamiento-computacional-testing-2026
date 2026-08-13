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
import sys, io, traceback, json, linecache, importlib, os

# La carpeta actual en sys.path: así un ejercicio puede importar el módulo
# (archivo .py) que escribió otro ejercicio antes. Es lo que permite "tener
# clases en distintos archivos".
if "." not in sys.path:
    sys.path.insert(0, ".")

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
            exec(compile(tests, "los_tests", "exec"), ns)
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
