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
import sys, io, traceback, json

def _run_user(code, tests=""):
    buf = io.StringIO()
    old = sys.stdout
    sys.stdout = buf
    ns = {}
    ok = True
    err = ""
    try:
        exec(compile(code, "tu_codigo", "exec"), ns)
        if tests:
            exec(compile(tests, "los_tests", "exec"), ns)
    except SyntaxError as e:
        ok = False
        donde = "tu código" if e.filename == "tu_codigo" else "los tests"
        err = f"Error de sintaxis en {donde}, línea {e.lineno}: {e.msg}"
    except Exception as e:
        ok = False
        tb = traceback.extract_tb(sys.exc_info()[2])
        partes = []
        for f in tb:
            if f.filename in ("tu_codigo", "los_tests"):
                donde = "tu código" if f.filename == "tu_codigo" else "los tests"
                linea = (f.line or "").strip()
                if linea:
                    partes.append(f"En {donde}, línea {f.lineno}:  {linea}")
                else:
                    partes.append(f"En {donde}, línea {f.lineno}")
        tipo = type(e).__name__
        msg = str(e)
        partes.append(f"{tipo}: {msg}" if msg else tipo)
        err = "\\n".join(partes)
    finally:
        sys.stdout = old
    return json.dumps({"ok": ok, "out": buf.getvalue(), "err": err})
`;

type RunUserFn = (code: string, tests: string) => string;

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

self.onmessage = async (ev: MessageEvent<{ id: number; code: string; tests: string }>) => {
  const { id, code, tests } = ev.data;
  await initPromise;
  if (!runUser) return; // ya se reportó init-error
  let raw: string;
  try {
    raw = runUser(code, tests);
  } catch (e) {
    raw = JSON.stringify({ ok: false, out: '', err: String(e) });
  }
  postMessage({ type: 'result', id, raw });
};
