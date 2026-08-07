// Motor de ejercicios interactivos: CodeMirror (editor) + Pyodide (Python real)
// vía el runner compartido (un solo intérprete en un Web Worker para toda la
// página, precargado apenas el alumno toca un editor).

import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab, indentMore, indentLess } from '@codemirror/commands';
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

// Casilla a la que el alumno manda su código (un solo lugar para cambiarla).
const EMAIL_PROFE = 'maxinunez434@gmail.com';

// Worker de Cloudflare que publica la consulta en #Consultas de Discord.
// Vacío = todavía no está montado, y el botón usa el mailto: de siempre.
// Pasos para levantarlo: worker/README.md
const WORKER_CONSULTAS = 'https://crimson-recipe-6ead.maxinunez434.workers.dev/';

// Theme propio: fija tipografía e interlineado del editor con alta especificidad,
// para que los estilos de Starlight no desfasen las líneas ni el cursor. El
// line-height va en .cm-content/.cm-gutters (lo que CodeMirror mide por línea).
const editorTheme = EditorView.theme({
  // 1rem (16px) y no menos: Safari en iOS hace zoom automático al enfocar un
  // campo con tipografía menor a 16px, y la página queda corrida.
  '&': { fontSize: '1rem', maxHeight: '22rem' },
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

// Aviso de descarga de Python: se muestra UNA vez por navegador, la primera vez
// que el alumno toca un editor (que es cuando arranca la bajada). Se marca como
// visto al mostrarlo, no al cerrarlo: si no, vuelve a aparecer en cada recarga.
const LS_AVISO_DATOS = 'pc_aviso_descarga';

function avisarDescargaUnaVez(el: HTMLElement): void {
  try {
    if (localStorage.getItem(LS_AVISO_DATOS)) return;
    localStorage.setItem(LS_AVISO_DATOS, '1');
  } catch {
    return; // sin localStorage no podemos saber si ya lo vio: mejor no molestar
  }
  const aviso = el.querySelector<HTMLElement>('[data-aviso-datos]');
  if (!aviso) return;
  aviso.hidden = false;
  aviso
    .querySelector<HTMLButtonElement>('[data-aviso-cerrar]')
    ?.addEventListener('click', () => { aviso.hidden = true; }, { once: true });
}

// Preferencia de mostrar la barra de símbolos también en escritorio. Se guarda
// como una clase en <html> para que el CSS la aplique a TODOS los ejercicios de
// la página de una, sin recorrerlos uno por uno.
const LS_TECLAS = 'pc_teclas_escritorio';

function teclasActivas(): boolean {
  try {
    return localStorage.getItem(LS_TECLAS) === '1';
  } catch {
    return false;
  }
}

function aplicarPreferenciaTeclas(activas: boolean): void {
  document.documentElement.classList.toggle('pc-teclas', activas);
  document
    .querySelectorAll<HTMLButtonElement>('[data-toggle-teclas]')
    .forEach((b) => b.setAttribute('aria-pressed', String(activas)));
}

function conectarToggleTeclas(el: HTMLElement): void {
  const boton = el.querySelector<HTMLButtonElement>('[data-toggle-teclas]');
  boton?.addEventListener('click', () => {
    // La preferencia vale para TODOS los ejercicios de la página a la vez, así
    // que al togglear aparecen (o desaparecen) tantas barras como ejercicios
    // haya: el documento cambia de alto de golpe y todo lo de abajo se corre.
    // Medimos dónde estaba el botón en pantalla y volvemos a dejarlo ahí, para
    // que visualmente no se mueva nada.
    const antes = boton.getBoundingClientRect().top;

    const activas = !teclasActivas();
    try {
      localStorage.setItem(LS_TECLAS, activas ? '1' : '0');
    } catch {
      /* sin persistencia: vale para esta sesión igual */
    }
    aplicarPreferenciaTeclas(activas);

    // getBoundingClientRect fuerza el recálculo, así que acá ya está el layout
    // nuevo. 'instant' porque un scroll animado acá se ve como otro salto.
    const despues = boton.getBoundingClientRect().top;
    if (despues !== antes) {
      window.scrollBy({ top: despues - antes, behavior: 'instant' as ScrollBehavior });
    }
  });
}

// Barra de símbolos (celular): inserta el caracter donde está el cursor sin
// robarle el foco al editor, para que no se cierre el teclado del teléfono.
function conectarTeclas(el: HTMLElement, view: EditorView): void {
  const barra = el.querySelector<HTMLElement>('[data-teclas]');
  if (!barra) return;

  // Clave: sin este preventDefault el botón toma el foco, el editor lo pierde y
  // el teclado del celular se cierra en cada símbolo.
  barra.addEventListener('pointerdown', (e) => e.preventDefault());

  barra.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!btn) return;
    const indent = btn.dataset.indent;
    if (indent) {
      (indent === 'mas' ? indentMore : indentLess)(view);
    } else if (btn.dataset.ins != null) {
      const texto = btn.dataset.ins;
      const { from, to } = view.state.selection.main;
      view.dispatch({
        changes: { from, to, insert: texto },
        selection: { anchor: from + texto.length },
        scrollIntoView: true,
      });
    }
    view.focus();
  });
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

  // Enviar el código al profe por email (mailto: 100% estático, sin terceros).
  // Guardamos el último mensaje armado para el botón de copiar (plan B cuando
  // la máquina no tiene app de correo y el mailto: no hace nada visible).
  const cajaEnvio = el.querySelector<HTMLElement>('[data-envio]');
  let ultimoMensaje = '';

  btnEnviar?.addEventListener('click', () => {
    const nombre = obtenerNombreAlumno();
    if (!nombre) return; // canceló el nombre
    const titulo = el.dataset.titulo || 'Ejercicio';
    const consulta = (
      window.prompt(
        '¿Querés contarle algo al profe? (podés dejarlo vacío)\n\n' +
          'Por ejemplo: qué no te sale, o qué error te aparece.',
      ) || ''
    ).trim();
    const asunto = `${nombre} — ${titulo}`;
    const cuerpo =
      `¡Hola profe! Te mando mi intento. 🙂\n\n` +
      `Lección: ${document.title}\n` +
      `${location.href}\n` +
      `Ejercicio: ${titulo}\n` +
      `Alumno/a: ${nombre}\n\n` +
      (consulta ? `--- mi consulta ---\n${consulta}\n\n` : '') +
      `--- mi código ---\n` +
      `${getCode()}\n`;
    ultimoMensaje = `Para: ${EMAIL_PROFE}\nAsunto: ${asunto}\n\n${cuerpo}`;

    // Abre el correo en una pestaña aparte, para no sacar al alumno de la
    // lección: si navegáramos en la misma, al volver perdería el scroll y la
    // sensación es la de que "se fue" del ejercicio.
    const porMail = () => {
      const mailto =
        `mailto:${EMAIL_PROFE}` +
        `?subject=${encodeURIComponent(asunto)}` +
        `&body=${encodeURIComponent(cuerpo)}`;
      window.open(mailto, '_blank', 'noopener');
      if (cajaEnvio) cajaEnvio.hidden = false;
    };

    // Se manda por los DOS canales siempre: Discord para que quede registro
    // público (y que a otro alumno con la misma duda le sirva), y el mail para
    // que al profe le entre la notificación sí o sí aunque el Worker esté caído.
    if (!WORKER_CONSULTAS) {
      porMail();
      return;
    }

    // El mail se abre ACÁ, en el mismo tick del click. Los navegadores solo
    // dejan abrir pestañas mientras dura la "activación por gesto del usuario";
    // si esperáramos a que responda el Worker, el window.open caería fuera de
    // esa ventana y el bloqueador de pop-ups se lo comería. Y como ahora abre en
    // una pestaña aparte, la página no navega: el fetch de abajo sigue vivo.
    porMail();

    const original = btnEnviar.textContent;
    btnEnviar.disabled = true;
    btnEnviar.textContent = '⏳ Enviando…';
    void (async () => {
      let aDiscord = false;
      try {
        const r = await fetch(WORKER_CONSULTAS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            consulta,
            codigo: getCode(),
            ejercicio: titulo,
            leccion: document.title,
            url: location.href,
          }),
        });
        // No alcanza con que responda 200: un Worker a medio configurar (el
        // "Hello World!" del template, por ejemplo) también responde 200 y el
        // alumno se quedaría con un "✓ Enviado" que nunca llegó a ningún lado.
        // Exigimos la respuesta que solo da NUESTRO Worker.
        if (!r.ok) throw new Error(String(r.status));
        const respuesta = await r.json().catch(() => null);
        if (!respuesta?.ok) throw new Error('respuesta inesperada');
        aDiscord = true;
      } catch {
        aDiscord = false;
      }

      btnEnviar.textContent = aDiscord
        ? '✓ Publicado en Discord'
        : '⚠️ Discord no respondió — mandalo por mail';
      btnEnviar.disabled = false;
      setTimeout(() => { btnEnviar.textContent = original; }, 6000);
    })();
  });

  const btnCopiar = el.querySelector<HTMLButtonElement>('[data-copiar-envio]');
  btnCopiar?.addEventListener('click', async () => {
    if (!ultimoMensaje) return;
    const original = btnCopiar.textContent;
    try {
      await navigator.clipboard.writeText(ultimoMensaje);
      btnCopiar.textContent = '✓ ¡Copiado! Pegalo en Discord';
    } catch {
      btnCopiar.textContent = '✗ No se pudo copiar — seleccioná el código a mano';
    }
    setTimeout(() => { btnCopiar.textContent = original; }, 4000);
  });

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
  aplicarPreferenciaTeclas(teclasActivas());
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
