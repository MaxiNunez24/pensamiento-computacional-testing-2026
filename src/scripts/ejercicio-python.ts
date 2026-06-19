// Motor de ejercicios interactivos: CodeMirror (editor) + Pyodide (Python real)
// corriendo en un WEB WORKER. Un solo intérprete compartido por toda la página,
// cargado de forma perezosa (se precarga apenas el alumno toca un editor).
//
// El worker protege la página: si el código del alumno se cuelga (bucle
// infinito), el hilo principal detecta el timeout, termina el worker y lo
// recrea, mostrando un mensaje pedagógico en lugar de congelar la pestaña.

import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  estaHecho,
  marcarHecho,
  guardarCodigo,
  leerCodigo,
  borrarCodigo,
  pintarSello,
  actualizarResumen,
} from './progreso';

const RUN_TIMEOUT_MS = 15_000;

// Casilla a la que el alumno manda su código (un solo lugar para cambiarla).
const EMAIL_PROFE = 'maxinunez434@gmail.com';

// Theme propio: fija tipografía e interlineado del editor con alta especificidad,
// para que los estilos de Starlight no desfasen las líneas ni el cursor. El
// line-height va en .cm-content/.cm-gutters (lo que CodeMirror mide por línea).
const editorTheme = EditorView.theme({
  '&': { fontSize: '0.95rem', maxHeight: '22rem' },
  '.cm-scroller': {
    fontFamily: 'var(--__sl-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)',
  },
  // line-height: normal → la caja de línea mide EXACTO lo que mide el texto,
  // así el caret y el fondo de selección llenan la línea justo. Si la inflamos
  // (p. ej. 1.5), la caja queda más alta que el texto y CodeMirror dibuja la
  // selección/el caret pegados abajo → se ven "una línea más abajo".
  // (El verdadero bug del caret al clickear era el margin-top que Starlight le
  // mete a cada .cm-line; eso se neutraliza en custom.css.)
  '.cm-content, .cm-line, .cm-gutters, .cm-gutterElement': {
    lineHeight: 'normal',
  },
});

// Nombre del alumno: se pide una vez y se guarda en el navegador.
function obtenerNombreAlumno(): string | null {
  let nombre = '';
  try {
    nombre = localStorage.getItem('pc_alumno') || '';
  } catch {
    /* localStorage puede no estar disponible */
  }
  if (!nombre) {
    const ingresado = window.prompt(
      '¿Cómo te llamás? (para que el profe sepa de quién es el código)',
    );
    nombre = (ingresado || '').trim();
    if (!nombre) return null; // canceló o lo dejó vacío
    try {
      localStorage.setItem('pc_alumno', nombre);
    } catch {
      /* sin persistencia, pero igual mandamos este envío */
    }
  }
  return nombre;
}

interface RunResult {
  ok: boolean;
  out: string;
  err: string;
}

class TimeoutError extends Error {}

// ---------- Manejo del worker (singleton) ----------

let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let isReady = false;
let nextId = 1;
const pending = new Map<number, { resolve: (raw: string) => void; reject: (e: Error) => void }>();

function resetWorker(reason: Error): void {
  worker?.terminate();
  worker = null;
  readyPromise = null;
  isReady = false;
  pending.forEach((p) => p.reject(reason));
  pending.clear();
}

function ensureWorker(): Promise<void> {
  if (!readyPromise) {
    const w = new Worker(new URL('./pyodide-worker.ts', import.meta.url), { type: 'module' });
    worker = w;
    readyPromise = new Promise<void>((resolve, reject) => {
      w.onmessage = (ev: MessageEvent) => {
        const d = ev.data;
        if (d.type === 'ready') {
          isReady = true;
          resolve();
        } else if (d.type === 'init-error') {
          reject(new Error(d.error));
          resetWorker(new Error(d.error));
        } else if (d.type === 'result') {
          const p = pending.get(d.id);
          if (p) {
            pending.delete(d.id);
            p.resolve(d.raw);
          }
        }
      };
      w.onerror = (e) => reject(new Error(e.message || 'falló el worker de Python'));
    });
  }
  return readyPromise;
}

async function runPython(code: string, tests: string, archivo = ''): Promise<RunResult> {
  await ensureWorker();
  const id = nextId++;
  const raw = await new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      // El código del alumno sigue colgado dentro del worker: lo terminamos
      // y dejamos todo listo para recrear el intérprete en la próxima corrida.
      resetWorker(new TimeoutError());
      reject(new TimeoutError());
    }, RUN_TIMEOUT_MS);
    pending.set(id, {
      resolve: (r) => {
        clearTimeout(timer);
        resolve(r);
      },
      reject: (e) => {
        clearTimeout(timer);
        reject(e);
      },
    });
    worker!.postMessage({ id, code, tests, archivo });
  });
  return JSON.parse(raw) as RunResult;
}

// ---------- Un ejercicio ----------

function b64decode(s: string): string {
  if (!s) return '';
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function initEjercicio(el: HTMLElement): void {
  const starter = b64decode(el.dataset.starter || '');
  const tests = b64decode(el.dataset.tests || '');
  const archivo = el.dataset.archivo || '';
  const titulo = el.dataset.titulo || '';

  const editorEl = el.querySelector<HTMLElement>('[data-editor]');
  const salida = el.querySelector<HTMLElement>('[data-salida]');
  const btnRun = el.querySelector<HTMLButtonElement>('[data-run]');
  const btnVerify = el.querySelector<HTMLButtonElement>('[data-verify]');
  const btnReset = el.querySelector<HTMLButtonElement>('[data-reset]');
  const btnEnviar = el.querySelector<HTMLButtonElement>('[data-enviar]');
  if (!editorEl || !salida) return;

  // Restaurar progreso: el código guardado (si lo hay) y el sello "✓ Resuelto".
  const guardado = leerCodigo(titulo);
  pintarSello(el, estaHecho(titulo));

  // Autoguardado del código (con debounce) cada vez que el alumno edita.
  let guardarTimer: ReturnType<typeof setTimeout> | undefined;
  const autoguardar = EditorView.updateListener.of((u) => {
    if (!u.docChanged) return;
    clearTimeout(guardarTimer);
    guardarTimer = setTimeout(() => guardarCodigo(titulo, view.state.doc.toString()), 600);
  });

  const view = new EditorView({
    doc: guardado != null ? guardado : starter,
    // keymap.of([indentWithTab]) hace que Tab indente en vez de saltar el foco.
    extensions: [basicSetup, python(), oneDark, editorTheme, keymap.of([indentWithTab]), autoguardar],
    parent: editorEl,
  });
  // Handle del editor accesible desde el DOM (útil para tests y para setear
  // el código programáticamente).
  (el as unknown as { __cmView: EditorView }).__cmView = view;

  // Re-medir cuando carga la fuente monoespaciada: si no, CodeMirror midió con
  // la fuente de fallback y el caret queda corrido respecto de la línea.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => view.requestMeasure()).catch(() => {});
  }

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
    show(
      isReady
        ? conTests
          ? '⏳ Ejecutando tests…'
          : '⏳ Ejecutando…'
        : '⏳ Cargando Python (la primera vez tarda unos segundos)…',
      'is-loading',
    );
    try {
      const res = await runPython(getCode(), conTests ? tests : '', archivo);
      const out = res.out.trimEnd();
      if (!conTests) {
        // Botón "Ejecutar": solo muestra lo que imprime el código.
        if (res.ok) show(out || '(el código corrió, pero no imprimió nada)', '');
        else show((out ? out + '\n\n' : '') + res.err, 'is-error');
      } else if (res.ok) {
        show((out ? out + '\n\n' : '') + '✅ ¡Todos los tests pasaron! 🎉', 'is-ok');
        marcarHecho(titulo);
        pintarSello(el, true);
      } else {
        show((out ? out + '\n\n' : '') + '❌ Todavía no pasa:\n\n' + res.err, 'is-error');
      }
    } catch (e) {
      if (e instanceof TimeoutError) {
        show(
          '⏱️ Tu código tardó más de ' +
            RUN_TIMEOUT_MS / 1000 +
            ' segundos y lo detuvimos.\n\n' +
            '¿Habrá quedado un bucle infinito? Revisá la condición de tu while:\n' +
            '¿en algún momento se vuelve falsa?\n\n' +
            'Corregilo y volvé a intentar (el intérprete se reinicia solo).',
          'is-error',
        );
      } else {
        show('⚠️ Error cargando el intérprete de Python:\n' + String(e), 'is-error');
      }
    } finally {
      setBusy(false);
    }
  };

  btnRun?.addEventListener('click', () => correr(false));
  btnVerify?.addEventListener('click', () => correr(true));
  btnReset?.addEventListener('click', () => {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: starter } });
    salida.hidden = true;
    borrarCodigo(titulo); // volver al starter "limpio" también en la próxima visita
  });

  // Atajo: Ctrl/Cmd + Enter = Verificar (estándar en editores de código).
  editorEl.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      correr(true);
    }
  });

  // Enviar el código al profe por email (mailto: 100% estático, sin terceros).
  btnEnviar?.addEventListener('click', () => {
    const nombre = obtenerNombreAlumno();
    if (!nombre) return; // canceló el nombre
    const titulo = el.dataset.titulo || 'Ejercicio';
    const asunto = `${nombre} — ${titulo}`;
    const cuerpo =
      `¡Hola profe! Te mando mi intento. 🙂\n\n` +
      `Lección: ${document.title}\n` +
      `${location.href}\n` +
      `Ejercicio: ${titulo}\n` +
      `Alumno/a: ${nombre}\n\n` +
      `--- mi código ---\n` +
      `${getCode()}\n`;
    const mailto =
      `mailto:${EMAIL_PROFE}` +
      `?subject=${encodeURIComponent(asunto)}` +
      `&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = mailto;
  });

  // Precarga: apenas el alumno toca el editor, arrancamos la descarga de
  // Python en segundo plano para que el primer "Verificar" sea rápido.
  const precargar = () => void ensureWorker().catch(() => {});
  editorEl.addEventListener('focusin', precargar, { once: true });
  editorEl.addEventListener('pointerdown', precargar, { once: true });
}

function boot(): void {
  document.querySelectorAll<HTMLElement>('.ejercicio').forEach((el) => {
    if (el.dataset.init) return;
    el.dataset.init = '1';
    initEjercicio(el);
  });
  actualizarResumen(); // barra de progreso de la clase
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
// Por si en el futuro se activan las view transitions de Starlight.
document.addEventListener('astro:page-load', boot);
