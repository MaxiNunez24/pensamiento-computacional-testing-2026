// "Encontrar el error": dos fases. Primero el alumno SEÑALA la línea del bug;
// recién si acierta se habilita la edición, y solo en esas líneas.
//
// El orden importa: con un editor libre desde el principio, el alumno tantea
// hasta que los tests pasan sin haber leído el código, que es justo lo que este
// ejercicio quiere entrenar.

import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { estaHecho, marcarHecho, pintarSello, actualizarResumen } from './progreso';
import { runPython, ensureWorker, TimeoutError, RUN_TIMEOUT_MS } from './python-runner';
import { medirCuandoSeaVisible } from './medir-editor';
import {
  editorTheme,
  aplicarPreferenciaTeclas,
  conectarTeclas,
  conectarToggleTeclas,
  autocompletado,
} from './editor-comun';

function b64decode(s: string): string {
  if (!s) return '';
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function initEncontrar(el: HTMLElement): void {
  const errores: number[] = JSON.parse(b64decode(el.dataset.errores || '[]'));
  const explicacion = b64decode(el.dataset.explicacion || '');
  const tests = b64decode(el.dataset.tests || '');
  const modoArreglo = el.dataset.arreglo === 'completo' ? 'completo' : 'linea';
  const codigo = b64decode(el.dataset.codigo || '');
  const titulo = el.dataset.titulo || '';

  const lineasOriginales = codigo.replace(/\n$/, '').split('\n');
  const esperadas = new Set(errores);
  const salida = el.querySelector<HTMLElement>('[data-salida]');
  const ayuda = el.querySelector<HTMLElement>('[data-fase-texto]');
  const btnConfirmar = el.querySelector<HTMLButtonElement>('[data-confirmar]');
  const btnSinError = el.querySelector<HTMLButtonElement>('[data-sin-error]');
  const btnReiniciar = el.querySelector<HTMLButtonElement>('[data-reiniciar]');
  const botonesLinea = Array.from(el.querySelectorAll<HTMLButtonElement>('.encontrar__linea'));
  const cajaEditor = el.querySelector<HTMLElement>('[data-editor-completo]');
  const cajaTeclas = el.querySelector<HTMLElement>('[data-caja-teclas]');
  let editor: EditorView | null = null;
  if (!salida) return;

  pintarSello(el, estaHecho(titulo));

  const marcadas = new Set<number>();
  let fase: 'marcar' | 'arreglar' | 'listo' = 'marcar';

  const mostrar = (texto: string, clase: 'is-ok' | 'is-error' | 'is-loading' | '') => {
    salida.hidden = false;
    salida.className = 'ejercicio__salida' + (clase ? ' ' + clase : '');
    salida.textContent = texto;
  };

  // ---------- Fase 1: marcar ----------

  botonesLinea.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (fase !== 'marcar') return;
      const n = Number(btn.dataset.linea);
      if (marcadas.has(n)) marcadas.delete(n);
      else marcadas.add(n);
      btn.classList.toggle('is-marcada', marcadas.has(n));
      btn.setAttribute('aria-pressed', String(marcadas.has(n)));
    });
  });

  function pintarCorreccion(): void {
    botonesLinea.forEach((btn) => {
      const n = Number(btn.dataset.linea);
      btn.classList.remove('is-marcada');
      if (esperadas.has(n) && marcadas.has(n)) btn.classList.add('is-acierto');
      else if (esperadas.has(n)) btn.classList.add('is-faltante');
      else if (marcadas.has(n)) btn.classList.add('is-fallo');
    });
  }

  function limpiarPintado(): void {
    botonesLinea.forEach((btn) => {
      btn.classList.remove('is-marcada', 'is-acierto', 'is-fallo', 'is-faltante');
      btn.setAttribute('aria-pressed', 'false');
    });
  }

  // Convierte cada línea acertada en un campo editable, con el texto con bug
  // adentro. Solo esas: el resto del programa queda como estaba.
  // Modo 'completo': se abre un editor con TODO el código. Es para los bugs que
  // no se arreglan cambiando la línea sino moviéndola o reacomodando el bloque.
  // La fase de señalar ya pasó, así que no se puede tantear sin haber leído.
  function habilitarArregloCompleto(): void {
    fase = 'arreglar';
    if (cajaTeclas) cajaTeclas.hidden = false;
    if (ayuda) ayuda.textContent = '✏️ Ahora arreglalo. Podés reacomodar el código como haga falta.';
    const lista = el.querySelector<HTMLElement>('[data-lineas]');
    if (lista) lista.hidden = true;
    if (cajaEditor) {
      cajaEditor.hidden = false;
      editor = new EditorView({
        doc: codigo.replace(/\n$/, ''),
        extensions: [basicSetup, ...autocompletado(''), python(), oneDark, editorTheme, keymap.of([indentWithTab])],
        parent: cajaEditor,
      });
      medirCuandoSeaVisible(editor);
      editor.focus();
    }
    if (btnConfirmar) btnConfirmar.textContent = '✓ Verificar el arreglo';
    if (btnSinError) btnSinError.hidden = true;
  }

  function habilitarArreglo(): void {
    if (modoArreglo === 'completo') return habilitarArregloCompleto();
    fase = 'arreglar';
    if (cajaTeclas) cajaTeclas.hidden = false;
    if (ayuda) ayuda.textContent = '✏️ Ahora arreglá esa línea (las demás quedan como están).';
    botonesLinea.forEach((btn) => {
      const n = Number(btn.dataset.linea);
      if (!esperadas.has(n)) return;
      const texto = btn.querySelector<HTMLElement>('.encontrar__texto');
      if (!texto) return;
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'encontrar__input';
      input.value = lineasOriginales[n - 1];
      input.setAttribute('aria-label', `Línea ${n}, corregila`);
      // El click en la línea ya no debe togglear: ahora se escribe adentro.
      input.addEventListener('click', (e) => e.stopPropagation());
      texto.replaceWith(input);
    });
    if (btnConfirmar) btnConfirmar.textContent = '✓ Verificar el arreglo';
    if (btnSinError) btnSinError.hidden = true;
  }

  function codigoArreglado(): string {
    if (editor) return editor.state.doc.toString();
    const lineas = [...lineasOriginales];
    el.querySelectorAll<HTMLInputElement>('.encontrar__input').forEach((input) => {
      const btn = input.closest<HTMLButtonElement>('.encontrar__linea');
      if (!btn) return;
      lineas[Number(btn.dataset.linea) - 1] = input.value;
    });
    return lineas.join('\n');
  }

  function terminar(): void {
    fase = 'listo';
    marcarHecho(titulo);
    pintarSello(el, true);
    actualizarResumen();
    if (btnConfirmar) btnConfirmar.disabled = true;
  }

  // ---------- Verificación ----------

  async function verificarArreglo(): Promise<void> {
    if (!tests) {
      mostrar('✅ ¡Bien ahí! ' + explicacion, 'is-ok');
      terminar();
      return;
    }
    mostrar('⏳ Probando tu arreglo…', 'is-loading');
    if (btnConfirmar) btnConfirmar.disabled = true;
    try {
      const res = await runPython(codigoArreglado(), tests);
      if (res.ok) {
        mostrar('✅ ¡Arreglado! ' + explicacion, 'is-ok');
        terminar();
      } else {
        mostrar('❌ Todavía no:\n' + res.err, 'is-error');
        if (btnConfirmar) btnConfirmar.disabled = false;
      }
    } catch (e) {
      const msg =
        e instanceof TimeoutError
          ? `⏱️ Tu código tardó más de ${RUN_TIMEOUT_MS / 1000} segundos. ¿Habrá quedado un bucle infinito?`
          : '❌ ' + String(e);
      mostrar(msg, 'is-error');
      if (btnConfirmar) btnConfirmar.disabled = false;
    }
  }

  function confirmarUbicacion(sinError: boolean): void {
    if (fase !== 'marcar') return;
    if (sinError) marcadas.clear();

    if (!sinError && marcadas.size === 0) {
      mostrar('Todavía no marcaste ninguna línea. Tocá la que te parezca, o usá "No hay ningún error".', 'is-error');
      return;
    }

    const acertadas = [...marcadas].filter((n) => esperadas.has(n));
    const demas = [...marcadas].filter((n) => !esperadas.has(n));
    const faltantes = [...esperadas].filter((n) => !marcadas.has(n));

    // Caso "no hay error" y efectivamente no hay.
    if (esperadas.size === 0 && marcadas.size === 0) {
      mostrar('✅ Exacto: este código está bien. ' + explicacion, 'is-ok');
      terminar();
      return;
    }

    if (demas.length === 0 && faltantes.length === 0) {
      pintarCorreccion();
      const cuantos = acertadas.length === 1 ? 'la línea' : `las ${acertadas.length} líneas`;
      mostrar(`✅ Encontraste ${cuantos} del problema.\n${explicacion}`, 'is-ok');
      // Solo pasamos a la fase de arreglo si hay tests que lo verifiquen. Hay
      // bugs que NO se arreglan editando esa línea (p. ej. una inicialización
      // que hay que mover fuera del bucle): en esos, el ejercicio es ubicarlo y
      // entender por qué, y abrir un campo editable sería una trampa.
      if (tests) habilitarArreglo();
      else terminar();
      return;
    }

    // Falló: contamos qué pasó, sin revelar dónde estaba.
    const partes: string[] = [];
    if (esperadas.size === 0) {
      partes.push('En realidad este código no tiene ningún error: fijate de nuevo qué hace paso a paso.');
    } else {
      if (demas.length) partes.push(`${demas.length === 1 ? 'Esa línea' : 'Esas líneas'} está bien.`);
      if (faltantes.length && acertadas.length) partes.push('Encontraste una parte, pero falta al menos otra.');
      else if (faltantes.length) partes.push(`El problema está en otro lado (hay ${esperadas.size} línea(s) con error).`);
    }
    mostrar('❌ ' + partes.join(' ') + '\nProbá de nuevo.', 'is-error');
    limpiarPintado();
    marcadas.clear();
  }

  btnConfirmar?.addEventListener('click', () => {
    if (fase === 'marcar') confirmarUbicacion(false);
    else if (fase === 'arreglar') void verificarArreglo();
  });
  btnSinError?.addEventListener('click', () => confirmarUbicacion(true));

  btnReiniciar?.addEventListener('click', () => {
    // Volver a fase 1: deshacer los inputs y dejar el código como vino. La barra
    // de símbolos se esconde con ellos: en la fase de señalar no hay dónde
    // escribir.
    if (cajaTeclas) cajaTeclas.hidden = true;
    el.querySelectorAll<HTMLInputElement>('.encontrar__input').forEach((input) => {
      const btn = input.closest<HTMLButtonElement>('.encontrar__linea');
      const n = btn ? Number(btn.dataset.linea) : 0;
      const code = document.createElement('code');
      code.className = 'encontrar__texto';
      code.textContent = lineasOriginales[n - 1] || ' ';
      input.replaceWith(code);
    });
    if (editor) {
      editor.destroy();
      editor = null;
    }
    if (cajaEditor) {
      cajaEditor.hidden = true;
      cajaEditor.innerHTML = '';
    }
    const lista = el.querySelector<HTMLElement>('[data-lineas]');
    if (lista) lista.hidden = false;
    marcadas.clear();
    limpiarPintado();
    fase = 'marcar';
    salida.hidden = true;
    if (ayuda) ayuda.textContent = '👆 Tocá la línea (o las líneas) donde creés que está el error.';
    if (btnConfirmar) {
      btnConfirmar.textContent = '✓ Confirmar';
      btnConfirmar.disabled = false;
    }
    if (btnSinError) btnSinError.hidden = false;
  });

  // La barra de símbolos: getter y no una vista fija, porque en el modo 'linea'
  // nunca hay editor (se escribe en <input>) y en 'completo' recién existe
  // después de que el alumno ubica el error.
  conectarTeclas(el, () => editor);
  conectarToggleTeclas(el);

  // Precarga de Python solo si el ejercicio va a necesitarlo para el arreglo.
  if (tests) {
    el.addEventListener('pointerdown', () => void ensureWorker().catch(() => {}), { once: true });
  }
}

function boot(): void {
  aplicarPreferenciaTeclas();
  document.querySelectorAll<HTMLElement>('.encontrar').forEach((el) => {
    if (el.dataset.init) return;
    el.dataset.init = '1';
    initEncontrar(el);
  });
  actualizarResumen();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
document.addEventListener('astro:page-load', boot);
