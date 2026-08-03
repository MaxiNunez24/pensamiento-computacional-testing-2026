// Modo evaluación: recolecta todas las respuestas y las entrega de una sola vez.
//
// Diferencias a propósito con el resto de la plataforma:
//   - No hay verificación contra los tests durante el parcial. Sí "Ejecutar",
//     que es lo mismo que tendría el alumno en VS Code.
//   - No hay pistas ni soluciones.
//   - No se marca nada como "resuelto": el progreso acá no significa nada.
//
// La corrección de la opción múltiple se calcula en el cliente y viaja adentro
// de la entrega. No es una nota final: es para ahorrarle al profe la parte
// mecánica. Lo abierto y el código los corrige él.

import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { runPython, ensureWorker, TimeoutError, RUN_TIMEOUT_MS } from './python-runner';

const EMAIL_PROFE = 'maxinunez434@gmail.com';
const WORKER_CONSULTAS = 'https://crimson-recipe-6ead.maxinunez434.workers.dev/';
const LS_ALUMNO = 'pc_alumno';

function b64decode(s: string): string {
  if (!s) return '';
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function nombreAlumno(): string | null {
  let n = '';
  try {
    n = localStorage.getItem(LS_ALUMNO) || '';
  } catch {
    /* sin localStorage */
  }
  if (!n) {
    n = (window.prompt('¿Cómo te llamás? (para identificar tu parcial)') || '').trim();
    if (!n) return null;
    try {
      localStorage.setItem(LS_ALUMNO, n);
    } catch {
      /* igual entregamos */
    }
  }
  return n;
}

function initEvaluacion(el: HTMLElement): void {
  const titulo = el.dataset.titulo || 'Evaluación';
  const clave: number[] = JSON.parse(b64decode(el.dataset.clave || '[]'));
  const puntos: number[] = JSON.parse(b64decode(el.dataset.puntos || '[]'));
  const mostrar = el.dataset.mostrar === '1';
  const items = Array.from(el.querySelectorAll<HTMLElement>('.evaluacion__item'));
  const btnEntregar = el.querySelector<HTMLButtonElement>('[data-entregar]');
  const estado = el.querySelector<HTMLElement>('[data-estado]');
  const editores = new Map<number, EditorView>();
  let entregado = false;

  // --- Editores de los ítems de código ---
  items.forEach((item) => {
    const i = Number(item.dataset.item);
    const cajaEditor = item.querySelector<HTMLElement>('[data-editor]');
    if (!cajaEditor) return;
    const starter = b64decode(cajaEditor.dataset.starter || '');
    const view = new EditorView({
      doc: starter,
      extensions: [basicSetup, python(), oneDark, keymap.of([indentWithTab])],
      parent: cajaEditor,
    });
    editores.set(i, view);

    const salida = item.querySelector<HTMLElement>('[data-salida]');
    const btnRun = item.querySelector<HTMLButtonElement>('[data-run]');
    btnRun?.addEventListener('click', async () => {
      if (!salida || entregado) return;
      salida.hidden = false;
      salida.className = 'ejercicio__salida is-loading';
      salida.textContent = '⏳ Ejecutando…';
      try {
        // Sin tests: el alumno ve lo que imprime su programa, nada más.
        const res = await runPython(view.state.doc.toString(), '');
        salida.className = 'ejercicio__salida';
        salida.textContent = res.out || '(tu programa no imprimió nada)';
        if (!res.ok) {
          salida.className = 'ejercicio__salida is-error';
          salida.textContent = res.err;
        }
      } catch (e) {
        salida.className = 'ejercicio__salida is-error';
        salida.textContent =
          e instanceof TimeoutError
            ? `⏱️ Tardó más de ${RUN_TIMEOUT_MS / 1000} segundos. ¿Habrá quedado un bucle infinito?`
            : String(e);
      }
    });
  });

  el.addEventListener('pointerdown', () => void ensureWorker().catch(() => {}), { once: true });

  // --- Recolección ---
  function recolectar() {
    let acertadas = 0;
    let posibles = 0;
    const respuestas = items.map((item) => {
      const i = Number(item.dataset.item);
      const tipo = item.dataset.tipo;
      const preguntaEl = item.querySelector<HTMLElement>('.evaluacion__pregunta');
      const pregunta = (preguntaEl?.textContent || '').trim();

      if (tipo === 'multiple') {
        const elegida = item.querySelector<HTMLInputElement>('input[type=radio]:checked');
        const idx = elegida ? Number(elegida.value) : -1;
        const texto = elegida?.parentElement?.textContent?.trim() || '(sin responder)';
        const bien = idx === clave[i];
        posibles += puntos[i] ?? 1;
        if (bien) acertadas += puntos[i] ?? 1;
        return { n: i + 1, tipo, pregunta, respuesta: texto, correcta: bien };
      }
      if (tipo === 'abierta') {
        const ta = item.querySelector<HTMLTextAreaElement>('[data-respuesta]');
        return { n: i + 1, tipo, pregunta, respuesta: (ta?.value || '').trim() || '(sin responder)' };
      }
      const view = editores.get(i);
      return { n: i + 1, tipo, pregunta, respuesta: view?.state.doc.toString() || '(sin responder)' };
    });
    return { respuestas, acertadas, posibles };
  }

  function armarTexto(nombre: string, datos: ReturnType<typeof recolectar>): string {
    const lineas = [
      `PARCIAL: ${titulo}`,
      `ALUMNO/A: ${nombre}`,
      `ENTREGADO: ${new Date().toLocaleString('es-AR')}`,
      `OPCIÓN MÚLTIPLE (corrección automática): ${datos.acertadas} / ${datos.posibles}`,
      '',
    ];
    for (const r of datos.respuestas) {
      lineas.push(`--- ${r.n}. ${r.pregunta}`);
      if (r.tipo === 'multiple') {
        lineas.push(`Respondió: ${r.respuesta}  ${r.correcta ? '✓' : '✗'}`);
      } else if (r.tipo === 'codigo') {
        lineas.push('```python', r.respuesta, '```');
      } else {
        lineas.push(r.respuesta);
      }
      lineas.push('');
    }
    return lineas.join('\n');
  }

  btnEntregar?.addEventListener('click', () => {
    if (entregado) return;
    const sinResponder = items.filter((item) => {
      const tipo = item.dataset.tipo;
      if (tipo === 'multiple') return !item.querySelector('input[type=radio]:checked');
      if (tipo === 'abierta') return !item.querySelector<HTMLTextAreaElement>('[data-respuesta]')?.value.trim();
      const view = editores.get(Number(item.dataset.item));
      return !(view?.state.doc.toString() || '').trim();
    });
    if (sinResponder.length) {
      const n = sinResponder.map((i) => Number(i.dataset.item) + 1).join(', ');
      if (!window.confirm(`Te quedaron sin responder: ${n}.\n\n¿Entregar igual?`)) return;
    }

    const nombre = nombreAlumno();
    if (!nombre) return;

    const datos = recolectar();
    const texto = armarTexto(nombre, datos);

    entregado = true;
    btnEntregar.disabled = true;
    if (estado) estado.textContent = '⏳ Entregando…';

    // Igual que en las consultas: se manda por los dos canales. Acá importa más,
    // porque si la entrega se pierde el alumno se queda sin parcial.
    const asunto = `[PARCIAL] ${nombre} — ${titulo}`;
    window.open(
      `mailto:${EMAIL_PROFE}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`,
      '_blank',
      'noopener',
    );

    void (async () => {
      let aDiscord = false;
      try {
        const r = await fetch(WORKER_CONSULTAS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            consulta: `📝 ENTREGA DE PARCIAL — opción múltiple: ${datos.acertadas}/${datos.posibles}`,
            codigo: texto,
            ejercicio: titulo,
            leccion: document.title,
            url: location.href,
          }),
        });
        const j = r.ok ? await r.json().catch(() => null) : null;
        aDiscord = Boolean(j?.ok);
      } catch {
        aDiscord = false;
      }
      if (estado) {
        estado.textContent = aDiscord
          ? '✅ Parcial entregado. Le llegó al profe.'
          : '⚠️ No se pudo enviar automáticamente. Revisá que se haya abierto tu correo, o avisale al profe AHORA.';
        estado.className = 'evaluacion__nota ' + (aDiscord ? 'is-ok' : 'is-error');
      }
      if (mostrar) {
        const detalle = datos.respuestas
          .filter((r) => r.tipo === 'multiple')
          .map((r) => `${r.n}. ${r.correcta ? '✓' : '✗'}`)
          .join('   ');
        if (estado) estado.textContent += `\n\nOpción múltiple: ${datos.acertadas}/${datos.posibles}   ${detalle}`;
      }
      // Bloquear todo después de entregar.
      el.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach((c) => {
        c.disabled = true;
      });
      editores.forEach((v) => v.dom.classList.add('is-bloqueado'));
    })();
  });
}

function boot(): void {
  document.querySelectorAll<HTMLElement>('.evaluacion').forEach((el) => {
    if (el.dataset.init) return;
    el.dataset.init = '1';
    initEvaluacion(el);
  });
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
document.addEventListener('astro:page-load', boot);
