// Motor de ejercicios interactivos: CodeMirror (editor) + Pyodide (Python real)
// vía el runner compartido (un solo intérprete en un Web Worker para toda la
// página, precargado apenas el alumno toca un editor).

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
import { runPython, ensureWorker, pythonReady, TimeoutError, RUN_TIMEOUT_MS } from './python-runner';
import { medirCuandoSeaVisible } from './medir-editor';
import {
  editorTheme,
  b64decode,
  avisarDescargaUnaVez,
  aplicarPreferenciaTeclas,
  conectarTeclas,
  conectarToggleTeclas,
  conectarEnvio,
} from './editor-comun';

// ---------- Un ejercicio ----------

function initEjercicio(el: HTMLElement): void {
  const starter = b64decode(el.dataset.starter || '');
  const tests = b64decode(el.dataset.tests || '');
  const archivo = el.dataset.archivo || '';
  const datos = b64decode(el.dataset.datos || '');
  const cajaEntradas = el.querySelector<HTMLTextAreaElement>('[data-entradas-input]');
  // Las entradas se leen en cada corrida: si el alumno las edita, la próxima
  // ejecución ya usa las nuevas.
  const leerEntradas = (): string[] => {
    const txt = cajaEntradas ? cajaEntradas.value : b64decode(el.dataset.entradas || '');
    return txt === '' ? [] : txt.replace(/\n$/, '').split('\n');
  };
  const titulo = el.dataset.titulo || '';

  const editorEl = el.querySelector<HTMLElement>('[data-editor]');
  const salida = el.querySelector<HTMLElement>('[data-salida]');
  const btnRun = el.querySelector<HTMLButtonElement>('[data-run]');
  const btnVerify = el.querySelector<HTMLButtonElement>('[data-verify]');
  const btnReset = el.querySelector<HTMLButtonElement>('[data-reset]');
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

  // Medir al cargar la fuente Y al entrar en pantalla: medir solo al cargar la
  // fuente no alcanza porque los ejercicios de más abajo todavía no son
  // visibles y CodeMirror no puede medir. Ver medir-editor.ts.
  medirCuandoSeaVisible(view);

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
      pythonReady()
        ? conTests
          ? '⏳ Ejecutando tests…'
          : '⏳ Ejecutando…'
        : '⏳ Cargando Python (la primera vez tarda unos segundos)…',
      'is-loading',
    );
    try {
      const res = await runPython(getCode(), conTests ? tests : '', archivo, datos, leerEntradas());
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

  conectarEnvio(el, getCode, leerEntradas);

  // Barra de símbolos: siempre en pantallas angostas, opcional en escritorio.
  conectarTeclas(el, view);
  conectarToggleTeclas(el);

  // Precarga: apenas el alumno toca el editor, arrancamos la descarga de
  // Python en segundo plano para que el primer "Verificar" sea rápido. Es el
  // momento exacto en que corresponde avisar del peso de la descarga.
  const precargar = () => {
    avisarDescargaUnaVez(el);
    void ensureWorker().catch(() => {});
  };
  editorEl.addEventListener('focusin', precargar, { once: true });
  editorEl.addEventListener('pointerdown', precargar, { once: true });
}

function boot(): void {
  // Antes de inicializar: dejar la barra como la eligió el alumno la última vez.
  aplicarPreferenciaTeclas();
  // Los de eficiencia también son .ejercicio (heredan todo el CSS), pero los
  // maneja su propio script: acá los salteamos para no inicializarlos dos veces.
  document.querySelectorAll<HTMLElement>('.ejercicio:not(.ejercicio--eficiencia)').forEach((el) => {
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
