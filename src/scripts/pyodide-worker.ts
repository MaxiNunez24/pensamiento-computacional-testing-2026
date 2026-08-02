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

def _run_user(code, tests="", archivo="", datos=""):
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

            def _correr(**variables):
                _ns = {}
                if datos:
                    exec(compile(datos, "los_datos", "exec"), _ns)
                _ns.update(variables)   # lo que pide el test pisa al valor regalado
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
`;

type RunUserFn = (code: string, tests: string, archivo: string, datos: string) => string;

let runUser: RunUserFn | null = null;

async function init(): Promise<void> {
  const mod = await import(/* @vite-ignore */ `${PYODIDE_URL}pyodide.mjs`);
  const py = await mod.loadPyodide({ indexURL: PYODIDE_URL });
  py.runPython(RUNNER);
  // Guardamos UNA referencia a la función (un solo PyProxy, sin fugas por corrida).
  runUser = py.globals.get('_run_user') as RunUserFn;
  postMessage({ type: 'ready' });
}

const initPromise = init().catch((e) => {
  postMessage({ type: 'init-error', error: String(e) });
});

self.onmessage = async (
  ev: MessageEvent<{ id: number; code: string; tests: string; archivo?: string; datos?: string }>,
) => {
  const { id, code, tests, archivo, datos } = ev.data;
  await initPromise;
  if (!runUser) return; // ya se reportó init-error
  let raw: string;
  try {
    raw = runUser(code, tests, archivo || '', datos || '');
  } catch (e) {
    raw = JSON.stringify({ ok: false, out: '', err: String(e) });
  }
  postMessage({ type: 'result', id, raw });
};
