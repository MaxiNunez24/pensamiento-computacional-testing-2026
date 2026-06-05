// Motor de ejercicios interactivos: CodeMirror (editor) + Pyodide (Python real
// en el navegador). Un solo Pyodide compartido por toda la página, cargado de
// forma perezosa la primera vez que el alumno ejecuta algo.

import { EditorView, basicSetup } from 'codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

const PYODIDE_VERSION = 'v0.29.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

let pyodidePromise: Promise<any> | null = null;

// Helper Python que ejecuta el código del alumno y, opcionalmente, los tests.
// Devuelve un JSON con { ok, out, err } para evitar conversiones raras JS<->Py.
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

async function getPyodide(): Promise<any> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const mod = await import(/* @vite-ignore */ `${PYODIDE_URL}pyodide.mjs`);
      const py = await mod.loadPyodide({ indexURL: PYODIDE_URL });
      py.runPython(RUNNER);
      return py;
    })();
  }
  return pyodidePromise;
}

function b64decode(s: string): string {
  if (!s) return '';
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

interface RunResult {
  ok: boolean;
  out: string;
  err: string;
}

function initEjercicio(el: HTMLElement): void {
  const starter = b64decode(el.dataset.starter || '');
  const tests = b64decode(el.dataset.tests || '');

  const editorEl = el.querySelector<HTMLElement>('[data-editor]');
  const salida = el.querySelector<HTMLElement>('[data-salida]');
  const btnRun = el.querySelector<HTMLButtonElement>('[data-run]');
  const btnVerify = el.querySelector<HTMLButtonElement>('[data-verify]');
  const btnReset = el.querySelector<HTMLButtonElement>('[data-reset]');
  if (!editorEl || !salida) return;

  const view = new EditorView({
    doc: starter,
    extensions: [basicSetup, python(), oneDark],
    parent: editorEl,
  });
  // Handle del editor accesible desde el DOM (útil para tests y para setear
  // el código programáticamente).
  (el as unknown as { __cmView: EditorView }).__cmView = view;

  const getCode = () => view.state.doc.toString();

  const show = (text: string, estado: '' | 'is-ok' | 'is-error' | 'is-loading') => {
    salida.hidden = false;
    salida.textContent = text;
    salida.className = 'ejercicio__salida' + (estado ? ' ' + estado : '');
  };

  const setBusy = (busy: boolean) => {
    [btnRun, btnVerify, btnReset].forEach((b) => b && (b.disabled = busy));
  };

  const correr = async (conTests: boolean) => {
    setBusy(true);
    show(conTests ? '⏳ Ejecutando tests…' : '⏳ Cargando Python…', 'is-loading');
    try {
      const py = await getPyodide();
      const raw: string = py.globals.get('_run_user')(getCode(), conTests ? tests : '');
      const res: RunResult = JSON.parse(raw);
      const out = res.out.trimEnd();
      if (!conTests) {
        // Botón "Ejecutar": solo muestra lo que imprime el código.
        if (res.ok) show(out || '(el código corrió, pero no imprimió nada)', '');
        else show((out ? out + '\n\n' : '') + res.err, 'is-error');
      } else if (res.ok) {
        show((out ? out + '\n\n' : '') + '✅ ¡Todos los tests pasaron! 🎉', 'is-ok');
      } else {
        show((out ? out + '\n\n' : '') + '❌ Todavía no pasa:\n\n' + res.err, 'is-error');
      }
    } catch (e) {
      show('⚠️ Error cargando el intérprete de Python:\n' + String(e), 'is-error');
    } finally {
      setBusy(false);
    }
  };

  btnRun?.addEventListener('click', () => correr(false));
  btnVerify?.addEventListener('click', () => correr(true));
  btnReset?.addEventListener('click', () => {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: starter } });
    salida.hidden = true;
  });
}

function boot(): void {
  document.querySelectorAll<HTMLElement>('.ejercicio').forEach((el) => {
    if (el.dataset.init) return;
    el.dataset.init = '1';
    initEjercicio(el);
  });
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
// Por si en el futuro se activan las view transitions de Starlight.
document.addEventListener('astro:page-load', boot);
