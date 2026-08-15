// Probador libre: editor de Python sin consigna, con tests que escribe el alumno.
//
// Es el mismo motor que los ejercicios (Pyodide en el worker), pero al revés:
// acá los `assert` no vienen dados, los escribe él. Cuando lleguemos a testing
// esa caja pasa a ser lo importante de la página.

import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
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

interface Guardado {
  codigo?: string;
  tests?: string;
  entradas?: string;
}

function clave(nombre: string): string {
  return `pcp:probador:${location.pathname}::${nombre}`;
}

function leerGuardado(nombre: string): Guardado {
  try {
    return JSON.parse(localStorage.getItem(clave(nombre)) || '{}') as Guardado;
  } catch {
    return {};
  }
}

function initProbador(el: HTMLElement): void {
  const nombre = el.dataset.probador || 'probador';
  const starter = b64decode(el.dataset.starter || '');
  const testsIniciales = b64decode(el.dataset.testsInicial || '');
  const entradasIniciales = b64decode(el.dataset.entradasInicial || '');

  const editorEl = el.querySelector<HTMLElement>('[data-editor]');
  const editorTestsEl = el.querySelector<HTMLElement>('[data-editor-tests]');
  const cajaTests = el.querySelector<HTMLDetailsElement>('[data-caja-tests]');
  const cajaEntradas = el.querySelector<HTMLTextAreaElement>('[data-entradas-input]');
  const salida = el.querySelector<HTMLElement>('[data-salida]');
  const avisoGuardado = el.querySelector<HTMLElement>('[data-guardado]');
  const btnRun = el.querySelector<HTMLButtonElement>('[data-run]');
  const btnVerify = el.querySelector<HTMLButtonElement>('[data-verify]');
  const btnReset = el.querySelector<HTMLButtonElement>('[data-reset]');
  if (!editorEl || !editorTestsEl || !salida) return;

  const guardado = leerGuardado(nombre);
  if (cajaEntradas) cajaEntradas.value = guardado.entradas ?? entradasIniciales;

  let temporizador: ReturnType<typeof setTimeout> | undefined;
  function autoguardar(): void {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      try {
        localStorage.setItem(
          clave(nombre),
          JSON.stringify({
            codigo: vista.state.doc.toString(),
            tests: vistaTests.state.doc.toString(),
            entradas: cajaEntradas ? cajaEntradas.value : '',
          } satisfies Guardado),
        );
        if (avisoGuardado) {
          const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
          avisoGuardado.textContent = `💾 Guardado ${hora}`;
        }
      } catch {
        /* modo privado: se pierde al cerrar, pero el probador igual sirve */
      }
    }, 500);
  }

  const alEditar = EditorView.updateListener.of((u) => {
    if (u.docChanged) autoguardar();
  });
  const extensiones = [basicSetup, python(), oneDark, editorTheme, keymap.of([indentWithTab]), alEditar];

  const vista = new EditorView({
    doc: guardado.codigo ?? starter,
    extensions: extensiones,
    parent: editorEl,
  });
  const vistaTests = new EditorView({
    doc: guardado.tests ?? testsIniciales,
    extensions: extensiones,
    parent: editorTestsEl,
  });
  medirCuandoSeaVisible(vista);
  medirCuandoSeaVisible(vistaTests);
  (el as unknown as { __cmView: EditorView; __cmTests: EditorView }).__cmView = vista;
  (el as unknown as { __cmView: EditorView; __cmTests: EditorView }).__cmTests = vistaTests;

  // Si ya tenía tests escritos, la caja arranca abierta: si no, parece que se
  // perdieron.
  if (cajaTests && (guardado.tests || testsIniciales)) cajaTests.open = true;

  cajaEntradas?.addEventListener('input', autoguardar);

  const leerEntradas = (): string[] => {
    const txt = cajaEntradas ? cajaEntradas.value : '';
    return txt === '' ? [] : txt.replace(/\n$/, '').split('\n');
  };

  const mostrar = (texto: string, estado: '' | 'is-ok' | 'is-error' | 'is-loading') => {
    salida.hidden = false;
    salida.textContent = texto;
    salida.className = 'ejercicio__salida' + (estado ? ' ' + estado : '');
  };

  const correr = async (conTests: boolean) => {
    const tests = vistaTests.state.doc.toString().trim();
    if (conTests && !tests) {
      cajaTests?.setAttribute('open', '');
      mostrar(
        '🧪 Todavía no escribiste ningún test.\n\n' +
          'Abrí "Mis tests" y escribí algo como:\n' +
          '    assert salida.strip() == "Hola"\n\n' +
          'Un test es una afirmación sobre tu código: si es falsa, salta.',
        'is-error',
      );
      return;
    }
    [btnRun, btnVerify, btnReset].forEach((b) => b && (b.disabled = true));
    mostrar(
      pythonReady()
        ? conTests
          ? '⏳ Corriendo tus tests…'
          : '⏳ Ejecutando…'
        : '⏳ Cargando Python (la primera vez tarda unos segundos)…',
      'is-loading',
    );
    try {
      const res = await runPython(vista.state.doc.toString(), conTests ? tests : '', '', '', leerEntradas());
      const out = res.out.trimEnd();
      if (!conTests) {
        if (res.ok) mostrar(out || '(el código corrió, pero no imprimió nada)', '');
        else mostrar((out ? out + '\n\n' : '') + res.err, 'is-error');
      } else if (res.ok) {
        mostrar((out ? out + '\n\n' : '') + '✅ Pasaron todos tus tests.', 'is-ok');
      } else {
        mostrar((out ? out + '\n\n' : '') + '❌ Un test no pasó:\n\n' + res.err, 'is-error');
      }
    } catch (e) {
      if (e instanceof TimeoutError) {
        mostrar(
          `⏱️ Tardó más de ${RUN_TIMEOUT_MS / 1000} segundos y lo detuvimos.\n\n` +
            '¿Habrá quedado un bucle infinito? El intérprete se reinicia solo.',
          'is-error',
        );
      } else {
        mostrar('⚠️ Error cargando el intérprete de Python:\n' + String(e), 'is-error');
      }
    } finally {
      [btnRun, btnVerify, btnReset].forEach((b) => b && (b.disabled = false));
    }
  };

  btnRun?.addEventListener('click', () => correr(false));
  btnVerify?.addEventListener('click', () => correr(true));
  btnReset?.addEventListener('click', () => {
    if (!window.confirm('¿Borrar lo que escribiste y volver a empezar?')) return;
    vista.dispatch({ changes: { from: 0, to: vista.state.doc.length, insert: starter } });
    vistaTests.dispatch({ changes: { from: 0, to: vistaTests.state.doc.length, insert: testsIniciales } });
    if (cajaEntradas) cajaEntradas.value = entradasIniciales;
    salida.hidden = true;
    autoguardar();
  });

  editorEl.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      correr(true);
    }
  });

  conectarEnvio(el, () => vista.state.doc.toString(), leerEntradas);
  conectarTeclas(el, vista);
  conectarToggleTeclas(el);

  const precargar = () => {
    avisarDescargaUnaVez(el);
    void ensureWorker().catch(() => {});
  };
  editorEl.addEventListener('focusin', precargar, { once: true });
  editorEl.addEventListener('pointerdown', precargar, { once: true });
}

function boot(): void {
  aplicarPreferenciaTeclas();
  document.querySelectorAll<HTMLElement>('.probador').forEach((el) => {
    if (el.dataset.init) return;
    el.dataset.init = '1';
    initProbador(el);
  });
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
document.addEventListener('astro:page-load', boot);
