// "Completar el código": el alumno llena los huecos (<input>), se ensambla el
// código completo (segmentos.join(valores)) y se corre contra los tests con el
// intérprete compartido de Python.

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

function b64decode(s: string): string {
  if (!s) return '';
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function initCompletar(el: HTMLElement): void {
  const titulo = el.dataset.titulo || '';
  const tests = b64decode(el.dataset.tests || '');
  const segmentos = JSON.parse(b64decode(el.dataset.segmentos || '[]')) as string[];

  const huecos = [...el.querySelectorAll<HTMLInputElement>('.completar__hueco')];
  const salida = el.querySelector<HTMLElement>('[data-cc-salida]');
  const btnRun = el.querySelector<HTMLButtonElement>('[data-cc-run]');
  const btnVerify = el.querySelector<HTMLButtonElement>('[data-cc-verify]');
  const btnReset = el.querySelector<HTMLButtonElement>('[data-cc-reset]');
  if (!salida) return;

  pintarSello(el, estaHecho(titulo));

  // Restaurar lo escrito (guardamos los valores como JSON).
  const guardado = leerCodigo(titulo);
  if (guardado) {
    try {
      const vals = JSON.parse(guardado) as string[];
      huecos.forEach((h, i) => {
        if (typeof vals[i] === 'string') h.value = vals[i];
      });
    } catch {
      /* dato viejo/corrupto: lo ignoramos */
    }
  }

  // Ensamblar el código completo a partir de los huecos.
  const ensamblar = () =>
    segmentos.map((seg, i) => seg + (i < huecos.length ? huecos[i].value : '')).join('');

  let guardarTimer: ReturnType<typeof setTimeout> | undefined;
  const autoguardar = () => {
    clearTimeout(guardarTimer);
    guardarTimer = setTimeout(
      () => guardarCodigo(titulo, JSON.stringify(huecos.map((h) => h.value))),
      600,
    );
  };

  const show = (text: string, estado: '' | 'is-ok' | 'is-error' | 'is-loading') => {
    salida.hidden = false;
    salida.textContent = text;
    salida.className = 'ejercicio__salida' + (estado ? ' ' + estado : '');
  };
  const setBusy = (busy: boolean) => {
    [btnRun, btnVerify, btnReset].forEach((b) => b && (b.disabled = busy));
  };

  const correr = async (conTests: boolean) => {
    if (huecos.some((h) => h.value.trim() === '')) {
      show('✏️ Te falta completar algún hueco antes de verificar.', 'is-error');
      return;
    }
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
      const res = await runPython(ensamblar(), conTests ? tests : '');
      const out = res.out.trimEnd();
      if (!conTests) {
        if (res.ok) show(out || '(el código corrió, pero no imprimió nada)', '');
        else show((out ? out + '\n\n' : '') + res.err, 'is-error');
      } else if (res.ok) {
        show((out ? out + '\n\n' : '') + '✅ ¡Completaste bien el código! 🎉', 'is-ok');
        marcarHecho(titulo);
        pintarSello(el, true);
      } else {
        show((out ? out + '\n\n' : '') + '❌ Todavía no:\n\n' + res.err, 'is-error');
      }
    } catch (e) {
      if (e instanceof TimeoutError) {
        show(
          '⏱️ El código tardó más de ' +
            RUN_TIMEOUT_MS / 1000 +
            ' segundos y lo detuvimos. Revisá lo que completaste y volvé a intentar.',
          'is-error',
        );
      } else {
        show('⚠️ Error cargando el intérprete de Python:\n' + String(e), 'is-error');
      }
    } finally {
      setBusy(false);
    }
  };

  huecos.forEach((h) => {
    h.addEventListener('input', autoguardar);
    h.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        correr(true);
      }
    });
  });

  btnRun?.addEventListener('click', () => correr(false));
  btnVerify?.addEventListener('click', () => correr(true));
  btnReset?.addEventListener('click', () => {
    huecos.forEach((h) => (h.value = ''));
    salida.hidden = true;
    borrarCodigo(titulo);
  });

  // Precarga del intérprete apenas el alumno toca un hueco.
  const precargar = () => void ensureWorker().catch(() => {});
  huecos.forEach((h) => {
    h.addEventListener('focus', precargar, { once: true });
  });
}

function boot(): void {
  document.querySelectorAll<HTMLElement>('.completar').forEach((el) => {
    if (el.dataset.initCc) return;
    el.dataset.initCc = '1';
    initCompletar(el);
  });
  actualizarResumen();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
document.addEventListener('astro:page-load', boot);
