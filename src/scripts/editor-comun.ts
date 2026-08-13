// Piezas compartidas por los ejercicios con editor de Python.
//
// Vivían adentro de ejercicio-python.ts, pero hay más de un tipo de ejercicio
// con editor (y ahora también los de eficiencia). Duplicarlas traía un problema
// concreto: la barra de símbolos es una preferencia GLOBAL del alumno, y con dos
// copias del estado cada componente se enteraba solo de sus propios botones.

import { EditorView } from 'codemirror';
import { indentMore, indentLess } from '@codemirror/commands';

// Casilla a la que el alumno manda su código (un solo lugar para cambiarla).
export const EMAIL_PROFE = 'maxinunez434@gmail.com';

// Worker de Cloudflare que publica la consulta en #Consultas de Discord.
// Vacío = todavía no está montado, y el botón usa el mailto: de siempre.
// Pasos para levantarlo: worker/README.md
export const WORKER_CONSULTAS = 'https://crimson-recipe-6ead.maxinunez434.workers.dev/';

// Theme propio: fija tipografía e interlineado del editor con alta especificidad,
// para que los estilos de Starlight no desfasen las líneas ni el cursor. El
// line-height va en .cm-content/.cm-gutters (lo que CodeMirror mide por línea).
export const editorTheme = EditorView.theme({
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
  '.cm-content, .cm-line, .cm-gutters, .cm-gutterElement': {
    lineHeight: 'normal',
  },
});

// Los data-* del HTML van en base64 para poder llevar saltos de línea y comillas
// sin pelear con el escapado.
export function b64decode(s: string): string {
  if (!s) return '';
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Nombre del alumno: se pide una vez y se guarda en el navegador.
export function obtenerNombreAlumno(): string | null {
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

export function avisarDescargaUnaVez(el: HTMLElement): void {
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

// ---------- Barra de símbolos ----------

// Preferencia de mostrar la barra de símbolos también en escritorio. Se guarda
// como una clase en <html> para que el CSS la aplique a TODOS los ejercicios de
// la página de una, sin recorrerlos uno por uno.
const LS_TECLAS = 'pc_teclas_escritorio';

export function teclasActivas(): boolean {
  try {
    return localStorage.getItem(LS_TECLAS) === '1';
  } catch {
    return false;
  }
}

export function aplicarPreferenciaTeclas(activas: boolean): void {
  document.documentElement.classList.toggle('pc-teclas', activas);
  document
    .querySelectorAll<HTMLButtonElement>('[data-toggle-teclas]')
    .forEach((b) => b.setAttribute('aria-pressed', String(activas)));
}

export function conectarToggleTeclas(el: HTMLElement): void {
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
export function conectarTeclas(el: HTMLElement, view: EditorView): void {
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

// ---------- Enviar el código al profe ----------

// mailto: (100% estático, sin terceros) + publicación en Discord vía Worker.
// `getCode` se pasa como función porque el código cambia entre clics.
export function conectarEnvio(el: HTMLElement, getCode: () => string): void {
  const btnEnviar = el.querySelector<HTMLButtonElement>('[data-enviar]');
  if (!btnEnviar) return;
  const cajaEnvio = el.querySelector<HTMLElement>('[data-envio]');
  let ultimoMensaje = '';

  btnEnviar.addEventListener('click', () => {
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
}
