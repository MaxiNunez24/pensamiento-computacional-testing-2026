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
  // Aire abajo del código, para que el cartel de sugerencias caiga sobre espacio
  // vacío y no sobre el párrafo siguiente cuando se escribe en la última línea.
  '.cm-content': { paddingBottom: '7rem' },
  /* El tope de alto del cartel de sugerencias, atado al alto de la PANTALLA.
     CodeMirror da vuelta el cartel —y lo pone encima de la consigna— cuando no
     entra entre el cursor y el borde de la ventana. El `max-height: 10em` que
     trae de fábrica está en `em`, así que dando clase con el zoom al 150% el
     cartel crece igual que la letra y deja de entrar siempre.
     Con `vh` nunca pasa de un cuarto de la pantalla, tenga la letra el tamaño
     que tenga; y en el peor caso, si igual se da vuelta, tapa mucho menos. */
  '.cm-tooltip-autocomplete > ul': { maxHeight: 'min(10em, 25vh)' },
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

// Preferencia de mostrar la barra de símbolos. Se guarda como una clase en
// <html> para que el CSS la aplique a TODOS los ejercicios de la página de una,
// sin recorrerlos uno por uno.
//
// Son TRES estados y no dos, porque el default depende de la pantalla: en
// celular la barra viene encendida (es donde hace falta) y en escritorio
// apagada. Si guardáramos solo un booleano, "no elegí nada" y "la apagué"
// serían lo mismo y no se podría apagar en celular.
//   '1'  → mostrarla siempre
//   '0'  → ocultarla siempre
//   null → como venga por defecto según el tamaño de pantalla
const LS_TECLAS = 'pc_teclas_escritorio';

function preferenciaTeclas(): '1' | '0' | null {
  try {
    const v = localStorage.getItem(LS_TECLAS);
    return v === '1' || v === '0' ? v : null;
  } catch {
    return null;
  }
}

// Si la barra se está mostrando (o se mostraría, en un ejercicio que todavía no
// llegó a la fase de escribir). Lo leemos del CSS en vez de recalcular el
// breakpoint a mano: así la regla vive en un solo lugar.
function teclasSeVen(): boolean {
  const barra = document.querySelector<HTMLElement>('[data-teclas]');
  return !!barra && getComputedStyle(barra).display !== 'none';
}

export function aplicarPreferenciaTeclas(): void {
  const pref = preferenciaTeclas();
  const raiz = document.documentElement.classList;
  raiz.toggle('pc-teclas', pref === '1');
  raiz.toggle('pc-teclas-off', pref === '0');
  // El aria-pressed refleja lo que realmente se ve, no la preferencia guardada:
  // con null, en celular se ve y en escritorio no.
  const visible = teclasSeVen();
  document
    .querySelectorAll<HTMLButtonElement>('[data-toggle-teclas]')
    .forEach((b) => b.setAttribute('aria-pressed', String(visible)));
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

    // Se togglea contra lo que se VE, no contra lo guardado: si nunca eligió
    // nada y está en el celular, el primer toque tiene que apagarla.
    const mostrar = !teclasSeVen();
    try {
      localStorage.setItem(LS_TECLAS, mostrar ? '1' : '0');
    } catch {
      /* sin persistencia: vale para esta sesión igual */
    }
    aplicarPreferenciaTeclas();

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
//
// `vista` puede ser un EditorView o una función que lo devuelva (o null). Lo
// segundo es para EncontrarElError, donde según el ejercicio se arregla en un
// editor CodeMirror o en un <input> de una sola línea, y eso se decide recién
// cuando el alumno ya ubicó el error. Si no hay editor, escribimos en el último
// campo de texto que estuvo enfocado.
const INDENTACION = '    '; // 4 espacios, como manda Python

export function conectarTeclas(
  el: HTMLElement,
  vista: EditorView | (() => EditorView | null),
): void {
  const barra = el.querySelector<HTMLElement>('[data-teclas]');
  if (!barra) return;
  const dameVista = typeof vista === 'function' ? vista : () => vista;

  // Guardamos el último campo enfocado porque para cuando llega el click, el
  // foco puede haberse ido: el alumno toca el símbolo, no el campo.
  let ultimoCampo: HTMLInputElement | HTMLTextAreaElement | null = null;
  el.addEventListener('focusin', (e) => {
    const t = e.target;
    if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) ultimoCampo = t;
  });

  // Tres intentos para saber dónde escribir, de más preciso a más tolerante. El
  // último existe porque 'focusin' no siempre llega (si la ventana no tiene el
  // foco del sistema, focus() no lo dispara), y quedarse sin hacer nada por eso
  // sería peor que escribir en el único campo que hay.
  const campoDondeEscribir = (): HTMLInputElement | HTMLTextAreaElement | null => {
    const activo = document.activeElement;
    if (
      (activo instanceof HTMLInputElement || activo instanceof HTMLTextAreaElement) &&
      el.contains(activo)
    ) {
      return activo;
    }
    if (ultimoCampo && el.contains(ultimoCampo)) return ultimoCampo;
    const campos = el.querySelectorAll<HTMLInputElement>('input[type="text"], textarea');
    return campos.length === 1 ? campos[0] : null;
  };

  // Clave: sin este preventDefault el botón toma el foco, el editor lo pierde y
  // el teclado del celular se cierra en cada símbolo.
  barra.addEventListener('pointerdown', (e) => e.preventDefault());

  barra.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!btn) return;
    const indent = btn.dataset.indent;
    const texto = btn.dataset.ins;

    const escribirEnCampo = (campo: HTMLInputElement | HTMLTextAreaElement) => {
      // Un campo deshabilitado o de solo lectura no se toca: es lo que pasa con
      // un parcial ya entregado.
      if (campo.disabled || campo.readOnly) return;
      if (indent) {
        if (campo instanceof HTMLTextAreaElement) {
          // Varias líneas (la caja de Entradas): el ⇥ es un tabulador y va
          // donde está el cursor.
          const desde = campo.selectionStart ?? campo.value.length;
          if (indent === 'mas') campo.setRangeText(INDENTACION, desde, desde, 'end');
          else campo.value = campo.value.replace(new RegExp(' {1,' + INDENTACION.length + '}$'), '');
        } else {
          // Una sola línea (la línea a corregir): acá ⇥ significa "indentá esta
          // línea", así que va al principio sin importar dónde esté el cursor.
          if (indent === 'mas') campo.value = INDENTACION + campo.value;
          else campo.value = campo.value.replace(new RegExp('^ {1,' + INDENTACION.length + '}'), '');
        }
      } else if (texto != null) {
        const desde = campo.selectionStart ?? campo.value.length;
        const hasta = campo.selectionEnd ?? desde;
        campo.setRangeText(texto, desde, hasta, 'end');
      }
      campo.focus();
      // Que quien escuche 'input' se entere del cambio hecho por código.
      campo.dispatchEvent(new Event('input', { bubbles: true }));
    };

    // Manda dónde está escribiendo el alumno. Si tiene el cursor en un campo de
    // texto —la caja de Entradas, o la línea a corregir— el símbolo va ahí;
    // si no, al editor de código. Sin esto, en un ejercicio con input() la barra
    // escribía siempre en el editor aunque el alumno estuviera cargando datos.
    const activo = document.activeElement;
    if (
      (activo instanceof HTMLInputElement || activo instanceof HTMLTextAreaElement) &&
      el.contains(activo)
    ) {
      escribirEnCampo(activo);
      return;
    }

    const view = dameVista();
    if (view) {
      // Mismo motivo: si el editor quedó de solo lectura (parcial entregado),
      // la barra tampoco puede escribir. El CSS lo esconde, pero el candado de
      // verdad tiene que estar acá — estos botones escriben por código y
      // EditorState.readOnly solo frena el tecleo del alumno.
      if (view.state.readOnly) return;
      if (indent) {
        (indent === 'mas' ? indentMore : indentLess)(view);
      } else if (texto != null) {
        const { from, to } = view.state.selection.main;
        view.dispatch({
          changes: { from, to, insert: texto },
          selection: { anchor: from + texto.length },
          scrollIntoView: true,
        });
      }
      view.focus();
      return;
    }

    // Sin editor y sin foco: el respaldo (último campo usado, o el único que hay).
    const campo = campoDondeEscribir();
    if (campo) escribirEnCampo(campo);
  });
}

// ---------- Enviar el código al profe ----------

// mailto: (100% estático, sin terceros) + publicación en Discord vía Worker.
// `getCode` se pasa como función porque el código cambia entre clics.
//
// `getEntradas` es para los ejercicios con input(): sin saber QUÉ tecleó el
// alumno, su código no se puede reproducir del otro lado. Y como la caja de
// entradas es editable, lo que probó él puede no ser lo que trae el ejercicio.
export function conectarEnvio(
  el: HTMLElement,
  getCode: () => string,
  getEntradas?: () => string[],
): void {
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
    // Link al EJERCICIO, no a la clase entera. Antes se mandaba `location.href`
    // pelado y del otro lado había que buscar cuál de los 19 ejercicios era.
    // Los id ahora salen del título (ver scripts/id-ejercicio.ts), así que la
    // dirección sigue sirviendo después del próximo deploy.
    const enlace = el.id ? `${location.href.split('#')[0]}#${el.id}` : location.href;
    const entradas = (getEntradas ? getEntradas() : []).filter((e) => e !== '');
    const cuerpo =
      `¡Hola profe! Te mando mi intento. 🙂\n\n` +
      `Lección: ${document.title}\n` +
      `${enlace}\n` +
      `Ejercicio: ${titulo}\n` +
      `Alumno/a: ${nombre}\n\n` +
      (consulta ? `--- mi consulta ---\n${consulta}\n\n` : '') +
      (entradas.length ? `--- lo que tecleé (entradas) ---\n${entradas.join('\n')}\n\n` : '') +
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
            entradas,
            ejercicio: titulo,
            leccion: document.title,
            url: enlace,
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

/* ═══════════════════════════════════════════════════════════════════════════
   AUTOCOMPLETADO
   ═══════════════════════════════════════════════════════════════════════════

   Dos problemas que reportaron los alumnos, los dos del mismo lugar:

   1. El cartelito de sugerencias TAPABA lo que estaban escribiendo. Pasaba al
      escribir en la última línea: CodeMirror pone el cartel abajo del cursor y,
      si no le entra adentro del editor, lo da vuelta y lo pone ARRIBA — justo
      encima del renglón que estás tecleando. La solución no es mover el cartel:
      es dejarle lugar abajo (ver `padding-bottom` en el theme).

   2. Las variables que el ejercicio ya define (`precio`, `cantidad`, `frase`…)
      NO aparecían entre las sugerencias. Y es lógico: no están escritas en el
      editor, se inyectan por afuera antes de correr el código. CodeMirror
      sugiere lo que ve, y no las veía.

   Lo segundo importa más de lo que parece: el alumno mira el editor vacío y no
   se acuerda de cómo se llamaba la variable. Ahora se la ofrece el editor.
*/
import { autocompletion, completeFromList, type Completion } from '@codemirror/autocomplete';
import { localCompletionSource } from '@codemirror/lang-python';

/** Saca los nombres que define un bloque de `datos`: `precio = 1500` → precio. */
export function variablesDe(datos: string): string[] {
  const nombres = new Set<string>();
  for (const linea of (datos || '').split('\n')) {
    // Solo asignaciones al principio de la línea (sin indentar): las de adentro
    // de un if o un for son detalles internos, no datos del ejercicio.
    const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*=(?!=)/.exec(linea);
    if (m) nombres.add(m[1]);
  }
  return [...nombres];
}

// Lo mínimo de Python que usan en el curso. No es la biblioteca entera a
// propósito: una lista de 300 sugerencias es ruido, no ayuda.
const BASICOS: Completion[] = [
  { label: 'print', type: 'function', detail: 'mostrar en pantalla' },
  { label: 'input', type: 'function', detail: 'pedir un dato' },
  { label: 'len', type: 'function', detail: 'cuántos elementos' },
  { label: 'int', type: 'function', detail: 'a número entero' },
  { label: 'float', type: 'function', detail: 'a número con coma' },
  { label: 'str', type: 'function', detail: 'a texto' },
  { label: 'range', type: 'function', detail: 'secuencia de números' },
  { label: 'sum', type: 'function', detail: 'sumar una lista' },
  { label: 'min', type: 'function', detail: 'el más chico' },
  { label: 'max', type: 'function', detail: 'el más grande' },
  { label: 'sorted', type: 'function', detail: 'ordenar sin modificar' },
  { label: 'abs', type: 'function', detail: 'valor absoluto' },
  { label: 'round', type: 'function', detail: 'redondear' },
  { label: 'type', type: 'function', detail: 'de qué tipo es' },
];

/* Las palabras del lenguaje. Están acá porque al reemplazar la fuente del
   paquete de Python se fueron junto con los builtins que molestaban, y estas sí
   sirven. Solo las del curso: nada de `lambda`, `yield`, `global` ni `assert`
   —esa última la escribimos nosotros en los tests, no ellos—. */
const PALABRAS: Completion[] = [
  { label: 'def', type: 'keyword', detail: 'definir una función' },
  { label: 'return', type: 'keyword', detail: 'devolver un valor' },
  { label: 'if', type: 'keyword', detail: 'si se cumple…' },
  { label: 'elif', type: 'keyword', detail: 'si no, y además…' },
  { label: 'else', type: 'keyword', detail: 'si no…' },
  { label: 'for', type: 'keyword', detail: 'repetir por cada uno' },
  { label: 'while', type: 'keyword', detail: 'repetir mientras…' },
  { label: 'in', type: 'keyword', detail: '¿está adentro?' },
  { label: 'not', type: 'keyword', detail: 'lo contrario' },
  { label: 'and', type: 'keyword', detail: 'las dos cosas' },
  { label: 'or', type: 'keyword', detail: 'una o la otra' },
  { label: 'break', type: 'keyword', detail: 'cortar el bucle' },
  { label: 'continue', type: 'keyword', detail: 'saltar a la vuelta siguiente' },
  { label: 'True', type: 'keyword', detail: 'verdadero' },
  { label: 'False', type: 'keyword', detail: 'falso' },
  { label: 'None', type: 'keyword', detail: 'ningún valor' },
  { label: 'import', type: 'keyword', detail: 'traer un módulo' },
  { label: 'from', type: 'keyword', detail: 'traer algo de un módulo' },
  { label: 'class', type: 'keyword', detail: 'definir una clase' },
  { label: 'self', type: 'keyword', detail: 'el objeto que se está usando' },
];

/**
 * Extensiones de autocompletado para un editor de ejercicio.
 * `datos` es el bloque de variables que el ejercicio inyecta (puede ir vacío).
 */
export function autocompletado(datos = '') {
  const delEjercicio: Completion[] = variablesDe(datos).map((nombre) => ({
    label: nombre,
    type: 'variable',
    detail: 'ya tiene valor en este ejercicio',
    // boost la pone primera: es lo que el alumno está buscando.
    boost: 99,
  }));

  return [
    autocompletion({
      /* `override` reemplaza TODAS las fuentes, y eso es lo importante acá.
         Sin él, el paquete de Python suma los builtins enteros: `eval`,
         `globals`, `locals`, `callable`, `ValueError`… Tres problemas a la vez:
         son ruido para quien recién empieza, `eval` es lo último que uno quiere
         sugerirle a nadie, y sobre todo hacen un cartel de ocho renglones que
         tapa la consigna.

         Quedan dos fuentes: la lista curada del curso, y los nombres que el
         alumno definió en su propio código (esa sí la queremos: completar la
         función que acaba de escribir). */
      override: [completeFromList([...delEjercicio, ...BASICOS, ...PALABRAS]), localCompletionSource],
      // Sin esto, el cartel se cierra al tocar afuera y en el celular eso pasa
      // con cualquier scroll.
      closeOnBlur: true,
      // Seis y no ocho: el cartel tiene que caber DEBAJO del cursor, porque si
      // no CodeMirror lo da vuelta y lo pone encima de lo que se está leyendo.
      maxRenderedOptions: 6,
    }),
  ];
}
