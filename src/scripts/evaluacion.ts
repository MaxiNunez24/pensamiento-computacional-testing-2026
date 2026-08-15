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
//
// SOBRE EL GUARDADO (lo más importante de este archivo): un parcial que se
// pierde no se puede rehacer. Por eso:
//   1. Se autoguarda cada respuesta mientras el alumno escribe, no al entregar.
//   2. Al entregar, lo PRIMERO que pasa es guardar; recién después se manda. Si
//      falla la red, se cierra el navegador o se recarga la página, el parcial
//      ya está a salvo.
//   3. Después de entregado queda visible pero de solo lectura, también al
//      volver a abrir la página.

import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Compartment, EditorState } from '@codemirror/state';
import { runPython, ensureWorker, TimeoutError, RUN_TIMEOUT_MS } from './python-runner';
import { medirCuandoSeaVisible } from './medir-editor';
import {
  editorTheme,
  aplicarPreferenciaTeclas,
  conectarTeclas,
  conectarToggleTeclas,
} from './editor-comun';

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

// ---------- Guardado ----------
// Con el prefijo 'pcp:' de progreso.ts, así el parcial también viaja cuando el
// alumno usa "Sincronizar progreso".

interface Guardado {
  respuestas?: Record<string, string>;
  /** Fecha ISO de la entrega. Si está, el parcial queda de solo lectura. */
  entregado?: string;
  nombre?: string;
  resumen?: { acertadas: number; posibles: number };
  /** El parcial ya armado, para poder volver a descargarlo cuando sea. */
  texto?: string;
}

function clave(titulo: string): string {
  return `pcp:eval:${location.pathname}::${titulo}`;
}

function leerGuardado(titulo: string): Guardado {
  try {
    return JSON.parse(localStorage.getItem(clave(titulo)) || '{}') as Guardado;
  } catch {
    return {};
  }
}

function escribirGuardado(titulo: string, g: Guardado): boolean {
  try {
    localStorage.setItem(clave(titulo), JSON.stringify(g));
    return true;
  } catch {
    return false; // modo privado o disco lleno: hay que avisarle
  }
}

function descargarTexto(nombreArchivo: string, contenido: string): void {
  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function comoArchivo(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function escapar(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------- Un parcial ----------

function initEvaluacion(el: HTMLElement): void {
  const titulo = el.dataset.titulo || 'Evaluación';
  const claveCorrecta: number[] = JSON.parse(b64decode(el.dataset.clave || '[]'));
  const puntos: number[] = JSON.parse(b64decode(el.dataset.puntos || '[]'));
  const mostrar = el.dataset.mostrar === '1';
  const items = Array.from(el.querySelectorAll<HTMLElement>('.evaluacion__item'));
  const btnEntregar = el.querySelector<HTMLButtonElement>('[data-entregar]');
  const estado = el.querySelector<HTMLElement>('[data-estado]');
  const avisoGuardado = el.querySelector<HTMLElement>('[data-guardado]');
  const cajaDescargas = el.querySelector<HTMLElement>('[data-descargas]');
  const btnTxt = el.querySelector<HTMLButtonElement>('[data-bajar-txt]');
  const btnPdf = el.querySelector<HTMLButtonElement>('[data-bajar-pdf]');
  const editores = new Map<number, EditorView>();
  // Un compartment por editor: es la pieza de CodeMirror que permite cambiar una
  // extensión (acá, "solo lectura") sin recrear el editor.
  const bloqueos = new Map<number, Compartment>();

  const guardado = leerGuardado(titulo);
  let entregado = Boolean(guardado.entregado);

  // --- Editores de los ítems de código ---
  items.forEach((item) => {
    const i = Number(item.dataset.item);
    const cajaEditor = item.querySelector<HTMLElement>('[data-editor]');
    if (!cajaEditor) return;
    const starter = b64decode(cajaEditor.dataset.starter || '');
    const previo = guardado.respuestas?.[String(i)];
    const bloqueo = new Compartment();
    bloqueos.set(i, bloqueo);
    const view = new EditorView({
      doc: previo != null ? previo : starter,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        editorTheme,
        keymap.of([indentWithTab]),
        bloqueo.of([]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) autoguardar();
        }),
      ],
      parent: cajaEditor,
    });
    medirCuandoSeaVisible(view);
    editores.set(i, view);
    // Handle accesible desde el DOM, igual que en EjercicioPython: sirve para
    // verificar el guardado y el bloqueo sin tener que tipear a mano.
    (el as unknown as { __cmViews: Map<number, EditorView> }).__cmViews = editores;

    // La barra de símbolos de ESTE ítem: se le pasa el <li>, así cada barra
    // escribe en su propio editor y no en el del ítem de al lado.
    conectarTeclas(item, view);
    conectarToggleTeclas(item);

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

  // --- Restaurar lo que había escrito ---
  items.forEach((item) => {
    const i = String(item.dataset.item);
    const valor = guardado.respuestas?.[i];
    if (valor == null) return;
    if (item.dataset.tipo === 'multiple') {
      const radio = item.querySelector<HTMLInputElement>(`input[type=radio][value="${valor}"]`);
      if (radio) radio.checked = true;
    } else if (item.dataset.tipo === 'abierta') {
      const ta = item.querySelector<HTMLTextAreaElement>('[data-respuesta]');
      if (ta) ta.value = valor;
    }
  });

  el.addEventListener('pointerdown', () => void ensureWorker().catch(() => {}), { once: true });

  // --- Autoguardado ---

  function respuestasActuales(): Record<string, string> {
    const r: Record<string, string> = {};
    items.forEach((item) => {
      const i = String(item.dataset.item);
      const tipo = item.dataset.tipo;
      if (tipo === 'multiple') {
        const c = item.querySelector<HTMLInputElement>('input[type=radio]:checked');
        if (c) r[i] = c.value;
      } else if (tipo === 'abierta') {
        const ta = item.querySelector<HTMLTextAreaElement>('[data-respuesta]');
        if (ta && ta.value) r[i] = ta.value;
      } else {
        const v = editores.get(Number(i));
        if (v) r[i] = v.state.doc.toString();
      }
    });
    return r;
  }

  let temporizador: ReturnType<typeof setTimeout> | undefined;
  function autoguardar(): void {
    if (entregado) return; // ya entregado: no se pisa nada
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      const g = leerGuardado(titulo);
      g.respuestas = respuestasActuales();
      const ok = escribirGuardado(titulo, g);
      if (!avisoGuardado) return;
      if (ok) {
        const hora = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        avisoGuardado.textContent = `💾 Guardado ${hora} — si se cierra la página, tus respuestas siguen acá.`;
        avisoGuardado.className = 'evaluacion__guardado';
      } else {
        avisoGuardado.textContent =
          '⚠️ No se puede guardar en este navegador (¿ventana privada?). NO recargues la página.';
        avisoGuardado.className = 'evaluacion__guardado is-error';
      }
    }, 400);
  }

  el.addEventListener('input', autoguardar);
  el.addEventListener('change', autoguardar);

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
        const bien = idx === claveCorrecta[i];
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

  type Datos = ReturnType<typeof recolectar>;

  function armarTexto(nombre: string, datos: Datos, cuando: Date): string {
    const lineas = [
      `PARCIAL: ${titulo}`,
      `ALUMNO/A: ${nombre}`,
      `ENTREGADO: ${cuando.toLocaleString('es-AR')}`,
      `OPCIÓN MÚLTIPLE (corrección automática): ${datos.acertadas} / ${datos.posibles}`,
      `PÁGINA: ${location.href}`,
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

  function nombreArchivo(nombre: string): string {
    return `parcial-${comoArchivo(nombre)}-${comoArchivo(titulo)}.txt`;
  }

  // --- Imprimir / guardar como PDF ---
  // Sin librerías: se arma una hoja limpia, se la cuelga del <body> y se llama a
  // window.print(). El "Guardar como PDF" del navegador hace el resto, y de paso
  // el alumno puede imprimirlo en papel si el profe se lo pide.
  function imprimir(): void {
    const g = leerGuardado(titulo);
    const texto = g.texto;
    if (!texto) return;
    const hoja = document.createElement('div');
    hoja.className = 'eval-print';
    hoja.innerHTML = `<h1>${escapar(titulo)}</h1><pre>${escapar(texto)}</pre>`;
    document.body.appendChild(hoja);
    document.body.classList.add('pc-imprimiendo');
    const limpiar = () => {
      document.body.classList.remove('pc-imprimiendo');
      hoja.remove();
      window.removeEventListener('afterprint', limpiar);
    };
    window.addEventListener('afterprint', limpiar);
    window.print();
    // Safari en iOS no siempre dispara afterprint: red de contención.
    setTimeout(limpiar, 60000);
  }

  // --- Bloquear después de entregar ---
  function bloquear(): void {
    entregado = true;
    el.classList.add('evaluacion--entregado');
    el.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach((c) => {
      c.disabled = true;
    });
    el.querySelectorAll<HTMLButtonElement>('[data-run]').forEach((b) => {
      b.disabled = true;
    });
    // Los símbolos también: readOnly frena el tecleo, pero estos botones
    // escriben por código y se saltearían el candado.
    el.querySelectorAll<HTMLElement>('[data-teclas], [data-toggle-teclas]').forEach((b) => {
      b.hidden = true;
    });
    editores.forEach((v, i) => {
      const c = bloqueos.get(i);
      if (c) {
        // readOnly frena los cambios; editable saca el cursor y el foco, así no
        // parece editable. Sobrevive a la recarga porque se aplica al cargar.
        v.dispatch({
          effects: c.reconfigure([EditorState.readOnly.of(true), EditorView.editable.of(false)]),
        });
      }
      v.dom.classList.add('is-bloqueado');
    });
    if (btnEntregar) btnEntregar.hidden = true;
    if (cajaDescargas) cajaDescargas.hidden = false;
  }

  // --- Estado al abrir la página ---
  if (entregado) {
    bloquear();
    const cuando = new Date(guardado.entregado as string).toLocaleString('es-AR');
    if (estado) {
      estado.textContent = `🔒 Entregado el ${cuando}. Tus respuestas quedaron guardadas y ya no se pueden cambiar.`;
      estado.className = 'evaluacion__nota is-ok';
    }
    if (avisoGuardado) avisoGuardado.textContent = '';
  } else if (guardado.respuestas && Object.keys(guardado.respuestas).length && avisoGuardado) {
    avisoGuardado.textContent = '💾 Recuperamos lo que habías escrito antes.';
    avisoGuardado.className = 'evaluacion__guardado';
  }

  btnTxt?.addEventListener('click', () => {
    const g = leerGuardado(titulo);
    if (g.texto) descargarTexto(nombreArchivo(g.nombre || 'alumno'), g.texto);
  });
  btnPdf?.addEventListener('click', imprimir);

  // --- Entregar ---
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
    if (!window.confirm('Una vez entregado no vas a poder cambiar tus respuestas.\n\n¿Entregar?')) return;

    const nombre = nombreAlumno();
    if (!nombre) return;

    const cuando = new Date();
    const datos = recolectar();
    const texto = armarTexto(nombre, datos, cuando);

    // 1) GUARDAR. Va primero, antes de cualquier cosa que pueda fallar: si se
    //    cae la red o el alumno recarga, el parcial ya está.
    const g = leerGuardado(titulo);
    g.respuestas = respuestasActuales();
    g.entregado = cuando.toISOString();
    g.nombre = nombre;
    g.resumen = { acertadas: datos.acertadas, posibles: datos.posibles };
    g.texto = texto;
    const seGuardo = escribirGuardado(titulo, g);

    // 2) Una copia en el disco del alumno, todavía dentro del clic (si lo
    //    hiciéramos después de un await, el navegador bloquearía la descarga).
    descargarTexto(nombreArchivo(nombre), texto);

    bloquear();
    if (estado) {
      estado.textContent = '⏳ Entregando…';
      estado.className = 'evaluacion__nota';
    }
    if (avisoGuardado) avisoGuardado.textContent = '';

    // 3) Recién ahora, mandarlo.
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
            // Como ARCHIVO ADJUNTO y no como texto del mensaje: un parcial entero
            // no entra en los 2000 caracteres de un mensaje de Discord, y lo que
            // sobraba se perdía justo al final.
            adjunto: { nombre: nombreArchivo(nombre), contenido: texto },
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
        const guardadoTxt = seGuardo
          ? 'Tu parcial quedó guardado en esta página y te bajamos una copia.'
          : '⚠️ Este navegador no deja guardar: quedate con el archivo que se descargó.';
        estado.textContent = aDiscord
          ? `✅ Parcial entregado. Le llegó al profe. ${guardadoTxt}`
          : `⚠️ No se pudo enviar automáticamente. ${guardadoTxt} Mandale el archivo al profe AHORA (o avisale).`;
        estado.className = 'evaluacion__nota ' + (aDiscord ? 'is-ok' : 'is-error');
      }
      if (mostrar) {
        const detalle = datos.respuestas
          .filter((r) => r.tipo === 'multiple')
          .map((r) => `${r.n}. ${r.correcta ? '✓' : '✗'}`)
          .join('   ');
        if (estado) estado.textContent += `\n\nOpción múltiple: ${datos.acertadas}/${datos.posibles}   ${detalle}`;
      }
    })();
  });
}

function boot(): void {
  aplicarPreferenciaTeclas();
  document.querySelectorAll<HTMLElement>('.evaluacion').forEach((el) => {
    if (el.dataset.init) return;
    el.dataset.init = '1';
    initEvaluacion(el);
  });
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
document.addEventListener('astro:page-load', boot);
