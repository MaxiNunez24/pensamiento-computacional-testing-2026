// Piezas compartidas por los ejercicios con editor de Python.
//
// Vivían adentro de ejercicio-python.ts, pero hay más de un tipo de ejercicio
// con editor (y ahora también los de eficiencia). Duplicarlas traía un problema
// concreto: la barra de símbolos es una preferencia GLOBAL del alumno, y con dos
// copias del estado cada componente se enteraba solo de sus propios botones.

import { EditorView } from 'codemirror';
import { tooltips } from '@codemirror/view';
import { indentMore, indentLess } from '@codemirror/commands';
import { indentUnit } from '@codemirror/language';

// Casilla a la que el alumno manda su código (un solo lugar para cambiarla).
export const EMAIL_PROFE = 'maxinunez434@gmail.com';

// Worker de Cloudflare que publica la consulta en #Consultas de Discord.
// Vacío = todavía no está montado, y el botón usa el mailto: de siempre.
// Pasos para levantarlo: worker/README.md
export const WORKER_CONSULTAS = 'https://crimson-recipe-6ead.maxinunez434.workers.dev/';

// Theme propio: fija tipografía e interlineado del editor con alta especificidad,
// para que los estilos de Starlight no desfasen las líneas ni el cursor. El
// line-height va en .cm-content/.cm-gutters (lo que CodeMirror mide por línea).
//
// Va junto con la unidad de indentación, así todos los editores (que ya usan
// editorTheme) la reciben sin tocar cada uno. CodeMirror trae 2 espacios de
// fábrica; Python, VS Code y cualquier linter usan 4, y un alumno que copia de
// acá a VS Code no tiene que encontrarse con otra indentación.
export const editorTheme = [indentUnit.of('    '),
  /* Los carteles (sugerencias y su panel de documentación) se dibujan en <body>
     y no adentro del editor. Starlight le pone `isolation: isolate` a la
     columna del medio (.main-pane): todo lo de adentro queda en una capa que
     pinta DEBAJO de las dos barras laterales, por más z-index que tenga. El
     panel de documentación, que sale al costado, quedaba tapado por ellas
     (lo marcó Maxi, 7/10). CodeMirror le pasa al contenedor las clases de tema
     del editor, así que el theme de acá y el de oneDark los siguen alcanzando. */
  tooltips({ parent: typeof document !== 'undefined' ? document.body : undefined }),
  EditorView.theme({
  // Adentro del editor el cartel heredaba el tamaño del código (y con él los
  // botones A− / A+). En <body> ya no hereda nada: se lo damos explícito.
  '.cm-tooltip': { fontSize: 'var(--pc-editor-font, 1rem)' },
  // El tamaño sale de --pc-editor-font, que manejan los botones A− / A+ de cada
  // editor (public/zoom-codigo.js) y se recuerda para toda la plataforma. Va en
  // rem, así además acompaña al zoom del navegador.
  //
  // El default es 1rem (16px), y en el celular no se baja de ahí: Safari en iOS
  // hace zoom automático al enfocar un campo con tipografía menor a 16px, y la
  // página queda corrida.
  // resize/overflow: la manija nativa de abajo a la derecha, para que el alumno
  // se haga el editor tan alto como necesite. El `max-height` lo deja crecer
  // solo con el código hasta 22rem; cuando agarra la manija se lo sacamos (ver
  // `soltarElTope` más abajo), porque si no el navegador no lo deja pasar de ahí.
  // Todo esto vale con el ⤢ apagado: prendido (que es lo de fábrica), el editor
  // mide lo que mide el código. Ver public/zoom-codigo.js y custom.css.
  '&': {
    fontSize: 'var(--pc-editor-font, 1rem)',
    maxHeight: '22rem',
    minHeight: '5rem',
    resize: 'vertical',
    overflow: 'hidden',
  },
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
  /* El panel de documentación (el `info` de cada método). Va acá y no en el CSS
     por especificidad: la regla de fábrica es `.ͼ1 .cm-tooltip.cm-completionInfo`
     (0,3,0) y le ganaba a la del archivo de estilos, que llegaba a 0,2,0. Desde
     el theme sale con el mismo selector, y CodeMirror pone los themes DESPUÉS
     del tema base justo para esto.
     El ancho no se toca a propósito: lo calcula CodeMirror según el lugar que
     haya, y en una pantalla angosta lo achica solo. Un `max-width` nuestro lo
     único que haría es pelearse con eso. */
  '.cm-tooltip.cm-completionInfo': {
    padding: '0',
    border: '1px solid #3e4451',
    borderRadius: '0.4rem',
    background: '#21252b',
    boxShadow: '0 6px 18px rgb(0 0 0 / 0.35)',
    // Red de seguridad para el celular: el panel más largo, angosto, llegó a
    // 493px y se salía por arriba. Con el tope scrollea para abajo, que con el
    // dedo es natural; y CodeMirror mide el alto ya topado para ubicarlo.
    maxHeight: 'min(20rem, 45vh)',
    overflowY: 'auto',
  },
  /* Cada opción en fila flexible, para que la flecha › quede contra el borde
     derecho aunque el nombre sea corto. La descripción corta es la que cede
     (con sus "…") cuando no entra todo. */
  '.cm-tooltip-autocomplete > ul > li': { display: 'flex', alignItems: 'center' },
  '.cm-completionLabel': { flex: 'none' },
  '.cm-completionDetail': {
    flex: '1 1 auto', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
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
})];

/* El tope de alto manda mientras el editor crece solo; en cuanto el alumno
   agarra la manija, no.

   El `max-height: 22rem` del theme hace dos cosas a la vez: deja que el editor
   crezca con el código y después lo frena. Lo segundo choca con `resize`,
   porque el navegador no deja arrastrar más allá del `max-height`: la manija se
   ve, pero al segundo tirón no pasa nada más.

   Entonces lo sacamos, pero recién cuando lo agarran. Un `pointerdown` en la
   esquina de abajo a la derecha (la manija vive en la caja del elemento, no es
   un hijo) y a ESE editor le ponemos `max-height: none`. De ahí en más el alto
   es el que eligió el alumno: el `height` que escribe el navegador manda, y el
   editor deja de crecer solo. Para volver atrás, lo vuelve a arrastrar.

   Un solo listener para toda la página, en captura, así también alcanza a los
   editores que se crean después (los ejercicios se arman al hacer scroll). */
const ESQUINA = 18; // px de la esquina que agarra la manija

function soltarElTope(evento: PointerEvent) {
  // Con el editor ajustado al código (el ⤢) no hay tope ni manija: nada que soltar.
  if (document.documentElement.classList.contains('pc-editor-ajustado')) return;
  const destino = evento.target as HTMLElement | null;
  const editor = destino?.closest?.('.cm-editor') as HTMLElement | null;
  if (!editor) return;
  const caja = editor.getBoundingClientRect();
  if (evento.clientX <= caja.right - ESQUINA || evento.clientY <= caja.bottom - ESQUINA) return;

  const topeAnterior = editor.style.maxHeight;
  const altoAnterior = caja.height;
  editor.style.maxHeight = 'none';

  // Si lo soltó donde lo agarró, fue un click de paso y no un arrastre: le
  // devolvemos el tope. Si no, un toque en esa esquina dejaría al editor
  // creciendo sin límite con el código, que es justo lo que el tope evita.
  const alSoltar = () => {
    document.removeEventListener('pointerup', alSoltar, true);
    if (Math.abs(editor.getBoundingClientRect().height - altoAnterior) < 1) {
      editor.style.maxHeight = topeAnterior;
    }
  };
  document.addEventListener('pointerup', alSoltar, true);
}

declare global {
  interface Window { __pcEditorEstirable?: boolean }
}

if (typeof document !== 'undefined' && !window.__pcEditorEstirable) {
  window.__pcEditorEstirable = true;
  document.addEventListener('pointerdown', soltarElTope, true);
}

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

// Botón partido: [💬 Enviar a mi profe | ▾].
//
// - El cuerpo publica directo en #Consultas de Discord (vía el Worker).
// - La flecha abre la caja con las otras vías: Gmail, el programa de correo de
//   la compu y copiar el mensaje.
//
// Historia: primero se mandaba por Discord y además se abría el correo, sin
// preguntar (al que usa Discord le aparecía una pestaña que no pidió). Después
// pasó a preguntar siempre "¿por dónde?" y el envío costaba dos clics. Ahora lo
// normal (Discord) es un clic, y lo demás queda a mano en la flecha.
//
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
  const btnOtras = el.querySelector<HTMLButtonElement>('[data-enviar-otras]');
  const cajaEnvio = el.querySelector<HTMLElement>('[data-envio]');
  let ultimoMensaje = '';
  // Para no hacerle escribir la consulta dos veces: si la publicó en Discord y
  // después quiere mandarla también por mail, el segundo prompt ya la trae.
  let ultimaConsulta = '';

  type Envio = {
    nombre: string; titulo: string; consulta: string; asunto: string;
    enlace: string; entradas: string[]; cuerpo: string; codigo: string;
  };

  // Junta todo lo del envío. Devuelve null si canceló el nombre o la consulta.
  //
  // Cancelar la consulta CANCELA el envío. Antes daba lo mismo que dejarla
  // vacía, porque después había que elegir por dónde mandarlo. Ahora el botón
  // publica en Discord apenas se acepta: si "Cancelar" mandara igual, el que se
  // arrepiente terminaría con su código publicado.
  function armarEnvio(dondeVa: string): Envio | null {
    const nombre = obtenerNombreAlumno();
    if (!nombre) return null;
    const respuesta = window.prompt(
      '¿Querés contarle algo al profe? (podés dejarlo vacío)\n\n' +
        'Por ejemplo: qué no te sale, o qué error te aparece.\n\n' +
        dondeVa,
      ultimaConsulta,
    );
    if (respuesta === null) return null;
    const consulta = respuesta.trim();
    ultimaConsulta = consulta;
    const titulo = el.dataset.titulo || 'Ejercicio';
    // Link al EJERCICIO, no a la clase entera. Antes se mandaba `location.href`
    // pelado y del otro lado había que buscar cuál de los 19 ejercicios era.
    // Los id ahora salen del título (ver scripts/id-ejercicio.ts), así que la
    // dirección sigue sirviendo después del próximo deploy.
    const enlace = el.id ? `${location.href.split('#')[0]}#${el.id}` : location.href;
    const entradas = (getEntradas ? getEntradas() : []).filter((e) => e !== '');
    const codigo = getCode();
    const cuerpo =
      `¡Hola profe! Te mando mi intento. 🙂\n\n` +
      `Lección: ${document.title}\n` +
      `${enlace}\n` +
      `Ejercicio: ${titulo}\n` +
      `Alumno/a: ${nombre}\n\n` +
      (consulta ? `--- mi consulta ---\n${consulta}\n\n` : '') +
      (entradas.length ? `--- lo que tecleé (entradas) ---\n${entradas.join('\n')}\n\n` : '') +
      `--- mi código ---\n` +
      `${codigo}\n`;
    const asunto = `${nombre} — ${titulo}`;
    ultimoMensaje = `Para: ${EMAIL_PROFE}\nAsunto: ${asunto}\n\n${cuerpo}`;
    return { nombre, titulo, consulta, asunto, enlace, entradas, cuerpo, codigo };
  }

  function cerrarCaja(): void {
    if (!cajaEnvio) return;
    cajaEnvio.hidden = true;
    delete cajaEnvio.dataset.modo;
    btnOtras?.setAttribute('aria-expanded', 'false');
  }

  const BOTON_CERRAR =
    '<button type="button" class="ejercicio__envio-cerrar" data-cerrar-envio ' +
    'title="Cerrar" aria-label="Cerrar">✕</button>';

  // ── La caja de las otras vías (la flecha ▾) ─────────────────────────
  //
  // Gmail va por link y no por `mailto:`: anda con solo estar logueado en el
  // navegador, que es el caso de las computadoras del CFP, donde `mailto:` no
  // abre nada.
  //
  // Importante: cada vía abre su pestaña en SU PROPIO clic. Los navegadores solo
  // dejan abrir pestañas durante el gesto del usuario, y entre el clic en la
  // flecha y este punto hubo un prompt(). Por eso la caja trae links para tocar
  // y no un window.open() acá.
  function mostrarOtras(e: Envio, aviso = ''): void {
    if (!cajaEnvio) return;
    // El cuerpo recortado para el link: el código puede ser largo y las URL
    // tienen tope. Si no entra, queda el botón de copiar, que no tiene límite.
    const cuerpoCorto = e.cuerpo.length > 1500
      ? e.cuerpo.slice(0, 1500) + '\n\n[…] (cortado: usá 📋 Copiar el mensaje y pegalo acá)'
      : e.cuerpo;
    const gmail =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      `&to=${encodeURIComponent(EMAIL_PROFE)}` +
      `&su=${encodeURIComponent(e.asunto)}` +
      `&body=${encodeURIComponent(cuerpoCorto)}`;
    const mailto =
      `mailto:${EMAIL_PROFE}` +
      `?subject=${encodeURIComponent(e.asunto)}` +
      `&body=${encodeURIComponent(cuerpoCorto)}`;

    cajaEnvio.hidden = false;
    cajaEnvio.dataset.modo = 'otras';
    btnOtras?.setAttribute('aria-expanded', 'true');
    cajaEnvio.innerHTML =
      BOTON_CERRAR +
      '<p class="ejercicio__envio-tit">Otras formas de mandárselo</p>' +
      '<div class="ejercicio__envio-opciones">' +
      `<a class="ejercicio__btn" data-por="gmail" href="${gmail}" target="_blank" rel="noopener">✉️ Gmail</a>` +
      '<button type="button" class="ejercicio__btn" data-copiar-envio>📋 Copiar el mensaje</button>' +
      '</div>' +
      '<p class="ejercicio__envio-nota">' +
      'Por mail le llega al profe solo. Con <strong>💬 Enviar a mi profe</strong> se publica en ' +
      '<strong>#Consultas</strong> de Discord, y le sirve también a otro que tenga la misma duda.<br>' +
      `¿Usás otro correo? <a href="${mailto}">Abrir el programa de correo de esta computadora</a>.` +
      '</p>' +
      `<span class="ejercicio__envio-estado" data-envio-estado role="status">${aviso}</span>`;
    cajaEnvio.scrollIntoView({ block: 'nearest' });
  }

  // ── El cuerpo del botón: Discord directo ────────────────────────────
  async function publicarEnDiscord(e: Envio): Promise<void> {
    if (!cajaEnvio) return;
    cajaEnvio.hidden = false;
    cajaEnvio.dataset.modo = 'estado';
    btnOtras?.setAttribute('aria-expanded', 'false');
    cajaEnvio.innerHTML =
      BOTON_CERRAR +
      '<span class="ejercicio__envio-estado ejercicio__envio-estado--solo" data-envio-estado ' +
      'role="status">⏳ Publicando en Discord…</span>';
    cajaEnvio.scrollIntoView({ block: 'nearest' });
    // Sin esto, el que aprieta dos veces porque "no pasó nada" publica dos veces.
    btnEnviar!.disabled = true;
    try {
      const r = await fetch(WORKER_CONSULTAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: e.nombre,
          consulta: e.consulta,
          codigo: e.codigo,
          entradas: e.entradas,
          ejercicio: e.titulo,
          leccion: document.title,
          url: e.enlace,
        }),
      });
      // No alcanza con que responda 200: un Worker a medio configurar (el
      // "Hello World!" del template, por ejemplo) también responde 200 y el
      // alumno se quedaría con un "✓ Enviado" que nunca llegó a ningún lado.
      // Exigimos la respuesta que solo da NUESTRO Worker.
      if (!r.ok) throw new Error(String(r.status));
      const respuesta = await r.json().catch(() => null);
      if (!respuesta?.ok) throw new Error('respuesta inesperada');
      const estado = cajaEnvio.querySelector<HTMLElement>('[data-envio-estado]');
      if (estado) {
        estado.textContent =
          '✓ Publicado en #Consultas de Discord. Si además lo querés mandar por mail, tocá ▾.';
      }
    } catch {
      // Si Discord falla, las otras vías aparecen solas: el alumno no tiene que
      // adivinar que estaban escondidas en la flecha.
      mostrarOtras(e, '⚠️ Discord no respondió. Mandalo por Gmail o copiá el mensaje.');
    } finally {
      btnEnviar!.disabled = false;
    }
  }

  btnEnviar.addEventListener('click', () => {
    // Sin Worker configurado no hay Discord: el botón hace lo de la flecha.
    if (!WORKER_CONSULTAS) {
      const e = armarEnvio('Después elegís por dónde mandarlo.');
      if (e) mostrarOtras(e);
      return;
    }
    const e = armarEnvio('Al aceptar, se publica en #Consultas de Discord.');
    if (e) void publicarEnDiscord(e);
  });

  btnOtras?.addEventListener('click', () => {
    // La flecha también cierra: es lo que uno espera de un desplegable.
    if (cajaEnvio && !cajaEnvio.hidden && cajaEnvio.dataset.modo === 'otras') {
      cerrarCaja();
      return;
    }
    const e = armarEnvio('Después elegís: Gmail, tu programa de correo o copiar el mensaje.');
    if (e) mostrarOtras(e);
  });

  /* Un solo escuchador para toda la caja, puesto UNA vez. Los botones se
     vuelven a dibujar en cada envío —cambian los links, que llevan el mensaje
     adentro—, así que engancharlos uno por uno sumaría un escuchador nuevo en
     cada clic y el envío se duplicaría. */
  cajaEnvio?.addEventListener('click', (ev) => {
    const boton = (ev.target as HTMLElement)
      .closest<HTMLElement>('[data-por], [data-copiar-envio], [data-cerrar-envio]');
    if (!boton) return;
    // Cerrar: la caja queda ocupando media pantalla hasta que uno se va del
    // ejercicio, y lo normal es mandar la consulta y seguir resolviendo.
    if (boton.hasAttribute('data-cerrar-envio')) {
      cerrarCaja();
      return;
    }
    const estado = cajaEnvio.querySelector<HTMLElement>('[data-envio-estado]');
    if (boton.dataset.por === 'gmail' && estado) estado.textContent = 'Se abrió Gmail en otra pestaña.';
    if (boton.hasAttribute('data-copiar-envio')) {
      void (async () => {
        const original = boton.textContent;
        try {
          await navigator.clipboard.writeText(ultimoMensaje);
          boton.textContent = '✓ ¡Copiado! Pegalo donde quieras';
        } catch {
          boton.textContent = '✗ No se pudo copiar — seleccioná el código a mano';
        }
        setTimeout(() => { boton.textContent = original; }, 4000);
      })();
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   AUTOCOMPLETADO
   ═══════════════════════════════════════════════════════════════════════════

   Dos problemas que reportaron los alumnos, los dos del mismo lugar:

   1. El cartelito de sugerencias TAPABA lo que estaban escribiendo. Pasaba al
      escribir en la última línea: CodeMirror pone el cartel abajo del cursor y,
      si no le entra, lo da vuelta y lo pone ARRIBA, justo encima del renglón
      que estás tecleando. La solución no es mover el cartel: es dejarle lugar
      abajo (ver `padding-bottom` en el theme).
      Ojo con el "si no le entra": el espacio que mira CodeMirror es la VENTANA,
      no el editor (acá no se configura otro). Medido el 7/10 con el editor
      ajustado al código y solo 1,25rem abajo: el cartel cae debajo del renglón,
      sin darse vuelta. Los 7rem lo que hacen es que caiga sobre fondo del
      editor y no sobre los botones de abajo.

   2. Las variables que el ejercicio ya define (`precio`, `cantidad`, `frase`…)
      NO aparecían entre las sugerencias. Y es lógico: no están escritas en el
      editor, se inyectan por afuera antes de correr el código. CodeMirror
      sugiere lo que ve, y no las veía.

   Lo segundo importa más de lo que parece: el alumno mira el editor vacío y no
   se acuerda de cómo se llamaba la variable. Ahora se la ofrece el editor.
*/
import {
  autocompletion, completeFromList, ifNotIn, setSelectedCompletion,
  type Completion, type CompletionContext, type CompletionResult,
} from '@codemirror/autocomplete';
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

/* Los métodos del curso: lo que va DESPUÉS de un punto.
   ----------------------------------------------------
   Hasta ahora no había ninguno, así que `lista.app` no completaba nunca: no es
   que fallara, es que no existía la fuente. Y la del paquete de Python se niega
   a trabajar después de un punto a propósito (su `dontComplete` incluye
   `PropertyName`), porque solo sabe de variables locales.

   La lista salió de contar qué se usa de verdad en las clases. No se separa por
   tipo —no se infiere si la variable es lista o texto— porque el tipo casi nunca
   se puede saber: `alumnos` llega de los `datos`, y un parámetro de función no
   tiene tipo. Con escribir dos letras después del punto el filtro deja una o
   dos, que es lo mismo que daría inferir, sin la mitad de los falsos negativos. */
const METODOS: Completion[] = [
  // Listas
  { label: 'append', type: 'method', detail: 'agregar al final', boost: 60 },
  { label: 'remove', type: 'method', detail: 'sacar por valor' },
  { label: 'pop', type: 'method', detail: 'sacar y devolver' },
  { label: 'insert', type: 'method', detail: 'agregar en una posición' },
  { label: 'sort', type: 'method', detail: 'ordenar la lista misma' },
  { label: 'reverse', type: 'method', detail: 'darla vuelta' },
  { label: 'index', type: 'method', detail: 'en qué posición está' },
  { label: 'count', type: 'method', detail: 'cuántas veces aparece' },
  { label: 'extend', type: 'method', detail: 'pegarle otra lista' },
  { label: 'clear', type: 'method', detail: 'vaciar' },
  // Texto
  { label: 'strip', type: 'method', detail: 'sacar espacios de los bordes', boost: 60 },
  { label: 'lower', type: 'method', detail: 'todo en minúsculas', boost: 55 },
  { label: 'upper', type: 'method', detail: 'todo en MAYÚSCULAS', boost: 55 },
  { label: 'split', type: 'method', detail: 'partir en una lista', boost: 50 },
  { label: 'join', type: 'method', detail: 'unir una lista en un texto' },
  { label: 'replace', type: 'method', detail: 'cambiar una parte por otra' },
  { label: 'startswith', type: 'method', detail: '¿empieza con…?' },
  { label: 'endswith', type: 'method', detail: '¿termina con…?' },
  { label: 'isdigit', type: 'method', detail: '¿son todos números?' },
  { label: 'isalpha', type: 'method', detail: '¿son todas letras?' },
  { label: 'title', type: 'method', detail: 'Cada Palabra En Mayúscula' },
  { label: 'capitalize', type: 'method', detail: 'Solo la primera en mayúscula' },
  { label: 'splitlines', type: 'method', detail: 'partir por renglones' },
  { label: 'rstrip', type: 'method', detail: 'sacar espacios del final' },
  { label: 'lstrip', type: 'method', detail: 'sacar espacios del principio' },
  { label: 'format', type: 'method', detail: 'armar un texto con valores' },
  // Diccionarios
  { label: 'get', type: 'method', detail: 'el valor, o None si no está', boost: 55 },
  { label: 'keys', type: 'method', detail: 'las claves' },
  { label: 'values', type: 'method', detail: 'los valores' },
  { label: 'items', type: 'method', detail: 'clave y valor de a pares', boost: 50 },
  { label: 'update', type: 'method', detail: 'agregar o pisar varios' },
  // Conjuntos
  { label: 'add', type: 'method', detail: 'agregar al conjunto' },
  { label: 'discard', type: 'method', detail: 'sacar, sin romper si no está' },
  { label: 'union', type: 'method', detail: 'los de los dos' },
  { label: 'intersection', type: 'method', detail: 'los que están en los dos' },
  { label: 'issubset', type: 'method', detail: '¿están todos en el otro?' },
  // Archivos
  { label: 'read', type: 'method', detail: 'todo el archivo, como un texto' },
  { label: 'write', type: 'method', detail: 'escribir en el archivo' },
  { label: 'readlines', type: 'method', detail: 'los renglones, como lista' },
  { label: 'close', type: 'method', detail: 'cerrar' },
  // Base de datos
  { label: 'execute', type: 'method', detail: 'correr una consulta SQL' },
  { label: 'fetchone', type: 'method', detail: 'una fila, o None' },
  { label: 'fetchall', type: 'method', detail: 'todas las filas' },
  { label: 'commit', type: 'method', detail: 'confirmar los cambios' },
];

/* La documentación del cartel, al estilo del panel de VS Code.
   -----------------------------------------------------------
   CodeMirror ya lo trae: cada opción acepta un `info`, y lo muestra en un panel
   al costado SOLO de la opción que está seleccionada. Por eso no molesta: el que
   ya sabe lo que busca no lo ve.

   Arrancamos por los que más se usan en el curso, no por los 44. Los demás
   siguen con su renglón de `detail`, y se les va agregando panel a medida que
   aparezcan en clase.

   Los ejemplos son Python de verdad: `scripts/verificar-docs-editor.py` los
   corre y comprueba cada `→`. Si uno miente, el script lo canta.

   Para que los de archivos y base de datos sean cortos, el script les deja
   preparado lo que el alumno ya tendría a mano: un `dia.txt` con dos renglones
   y una `con` con la tabla `alumnos` (dni, nombre) y una fila, Ana. Así el panel
   muestra el método y no tres renglones de preparación. */
type Doc = { firma: string; que: string; ejemplo: string };

const DOCS: Record<string, Doc> = {
  append: {
    firma: 'lista.append(elemento)',
    que: 'Agrega el elemento al final. No devuelve nada: cambia la lista que ya tenías.',
    ejemplo: 'colores = ["azul"]\ncolores.append("rojo")\ncolores → ["azul", "rojo"]',
  },
  pop: {
    firma: 'lista.pop()',
    que: 'Saca el último y te lo devuelve. Con un número adentro, saca el de esa posición.',
    ejemplo: 'notas = [7, 9, 4]\nnotas.pop() → 4\nnotas → [7, 9]',
  },
  sort: {
    firma: 'lista.sort()',
    que: 'Ordena la lista misma y devuelve None. Si la querés ordenada sin tocar la original, usá sorted(lista).',
    ejemplo: 'notas = [7, 4, 9]\nnotas.sort()\nnotas → [4, 7, 9]',
  },
  strip: {
    firma: 'texto.strip()',
    que: 'Devuelve el texto sin los espacios ni los Enter de los bordes. Por dentro no toca nada. Es lo primero que se le hace a lo que llega de input() o de un archivo.',
    ejemplo: '"  Ana  ".strip() → "Ana"',
  },
  lower: {
    firma: 'texto.lower()',
    que: 'Devuelve el texto todo en minúsculas. Sirve para comparar sin que importen las mayúsculas.',
    ejemplo: '"Perez".lower() → "perez"',
  },
  upper: {
    firma: 'texto.upper()',
    que: 'Devuelve el texto todo en MAYÚSCULAS.',
    ejemplo: '"perez".upper() → "PEREZ"',
  },
  split: {
    firma: 'texto.split(separador)',
    que: 'Parte el texto cada vez que encuentra el separador y devuelve una lista. Sin separador, parte por los espacios.',
    ejemplo: '"30111222,P".split(",") → ["30111222", "P"]',
  },
  join: {
    firma: 'separador.join(lista)',
    que: 'Lo contrario de split: une los elementos de una lista en un solo texto. Ojo que se escribe al revés de como se lee: el separador va adelante.',
    ejemplo: '",".join(["30111222", "P"]) → "30111222,P"',
  },
  replace: {
    firma: 'texto.replace(viejo, nuevo)',
    que: 'Devuelve el texto con una parte cambiada por otra, todas las veces que aparezca.',
    ejemplo: '"30.111.222".replace(".", "") → "30111222"',
  },
  isdigit: {
    firma: 'texto.isdigit()',
    que: 'True si el texto son todos números y no está vacío. Es la forma de chequear un DNI antes de convertirlo con int().',
    ejemplo: '"30111222".isdigit() → True\n"30.111".isdigit() → False',
  },
  startswith: {
    firma: 'texto.startswith(principio)',
    que: 'True si el texto empieza con eso.',
    ejemplo: '"2026-10-02".startswith("2026") → True',
  },
  get: {
    firma: 'diccionario.get(clave)',
    que: 'El valor de esa clave. Si la clave no está devuelve None en vez de romper, y esa es toda la diferencia con dia[clave].',
    ejemplo: 'dia = {"30111222": "P"}\ndia.get("30111222") → "P"\ndia.get("99999999") → None',
  },
  items: {
    firma: 'diccionario.items()',
    que: 'La clave y el valor de a pares, para recorrer el diccionario con un for de dos variables: for dni, estado in dia.items().',
    ejemplo: 'dia = {"30111222": "P", "28999888": "A"}\nlist(dia.items()) → [("30111222", "P"), ("28999888", "A")]',
  },
  keys: {
    firma: 'diccionario.keys()',
    que: 'Solo las claves. Para recorrerlas alcanza con for dni in dia, que hace lo mismo y se lee mejor.',
    ejemplo: 'dia = {"30111222": "P", "28999888": "A"}\nlist(dia.keys()) → ["30111222", "28999888"]',
  },

  // ---- Listas -------------------------------------------------------------
  remove: {
    firma: 'lista.remove(valor)',
    que: 'Saca la PRIMERA vez que aparece ese valor. Si no está, da ValueError: preguntá antes con in.',
    ejemplo: 'notas = [7, 9, 7]\nnotas.remove(7)\nnotas → [9, 7]',
  },
  insert: {
    firma: 'lista.insert(posicion, elemento)',
    que: 'Agrega el elemento en esa posición y corre los demás un lugar. Las posiciones arrancan en 0.',
    ejemplo: 'colores = ["azul", "rojo"]\ncolores.insert(1, "verde")\ncolores → ["azul", "verde", "rojo"]',
  },
  reverse: {
    firma: 'lista.reverse()',
    que: 'Da vuelta la lista misma: el último pasa a ser el primero. No la ordena, la invierte. Devuelve None.',
    ejemplo: 'notas = [7, 4, 9]\nnotas.reverse()\nnotas → [9, 4, 7]',
  },
  index: {
    firma: 'lista.index(valor)',
    que: 'En qué posición está la primera vez que aparece. Si no está, ValueError: preguntá antes con in.',
    ejemplo: 'colores = ["azul", "rojo"]\ncolores.index("rojo") → 1',
  },
  count: {
    firma: 'lista.count(valor)',
    que: 'Cuántas veces aparece. Anda igual en listas y en textos.',
    ejemplo: '[7, 9, 7].count(7) → 2\n"banana".count("a") → 3',
  },
  extend: {
    firma: 'lista.extend(otra_lista)',
    que: 'Agrega al final todos los elementos de la otra lista, de a uno. Con append, la otra lista entraría entera como UN solo elemento.',
    ejemplo: 'notas = [7, 9]\nnotas.extend([4, 10])\nnotas → [7, 9, 4, 10]',
  },
  clear: {
    firma: 'lista.clear()',
    que: 'Vacía la lista: la deja en [] pero es la MISMA lista, así que todos los que la apuntaban la ven vacía.',
    ejemplo: 'notas = [7, 9]\nnotas.clear()\nnotas → []',
  },

  // ---- Texto --------------------------------------------------------------
  endswith: {
    firma: 'texto.endswith(final)',
    que: 'True si el texto termina con eso.',
    ejemplo: '"informe.pdf".endswith(".pdf") → True',
  },
  isalpha: {
    firma: 'texto.isalpha()',
    que: 'True si son todas letras y no está vacío. Ojo: el espacio no es una letra.',
    ejemplo: '"Ana".isalpha() → True\n"Ana Paz".isalpha() → False',
  },
  title: {
    firma: 'texto.title()',
    que: 'Devuelve el texto con la primera letra de cada palabra en mayúscula.',
    ejemplo: '"ana paz".title() → "Ana Paz"',
  },
  capitalize: {
    firma: 'texto.capitalize()',
    que: 'Devuelve el texto con SOLO la primera letra en mayúscula y el resto en minúscula.',
    ejemplo: '"ana PAZ".capitalize() → "Ana paz"',
  },
  splitlines: {
    firma: 'texto.splitlines()',
    que: 'Parte el texto en renglones. A diferencia de split("\\n"), no deja un renglón vacío al final cuando el texto termina con un Enter.',
    ejemplo: '"30111222,P\\n28999888,A\\n".splitlines() → ["30111222,P", "28999888,A"]',
  },
  rstrip: {
    firma: 'texto.rstrip()',
    que: 'Como strip, pero solo del final. Es el clásico para sacarle el Enter a un renglón leído de un archivo.',
    ejemplo: '"30111222,P\\n".rstrip() → "30111222,P"',
  },
  lstrip: {
    firma: 'texto.lstrip()',
    que: 'Como strip, pero solo del principio.',
    ejemplo: '"   Ana".lstrip() → "Ana"',
  },
  format: {
    firma: 'texto.format(valores)',
    que: 'Arma un texto cambiando cada {} por un valor, en orden. Hoy casi siempre se usa el f-string, que hace lo mismo y se lee mejor.',
    ejemplo: '"{} tiene {}".format("Ana", 7) → "Ana tiene 7"',
  },

  // ---- Diccionarios -------------------------------------------------------
  values: {
    firma: 'diccionario.values()',
    que: 'Solo los valores, sin las claves.',
    ejemplo: 'dia = {"30111222": "P", "28999888": "A"}\nlist(dia.values()) → ["P", "A"]',
  },
  update: {
    firma: 'diccionario.update(otro)',
    que: 'Agrega o pisa varios de una: las claves que ya estaban cambian de valor, y las nuevas se suman.',
    ejemplo: 'dia = {"30111222": "P"}\ndia.update({"30111222": "T", "28999888": "A"})\ndia → {"30111222": "T", "28999888": "A"}',
  },

  // ---- Conjuntos ----------------------------------------------------------
  add: {
    firma: 'conjunto.add(elemento)',
    que: 'Agrega el elemento. Si ya estaba no pasa nada: un conjunto no repite.',
    ejemplo: 'vistos = {"30111222"}\nvistos.add("28999888")\nvistos.add("30111222")\nlen(vistos) → 2',
  },
  discard: {
    firma: 'conjunto.discard(elemento)',
    que: 'Saca el elemento si está, y si no está no pasa nada. remove, en cambio, da KeyError.',
    ejemplo: 'vistos = {"30111222"}\nvistos.discard("99999999")\nvistos → {"30111222"}',
  },
  union: {
    firma: 'conjunto.union(otro)',
    que: 'Un conjunto nuevo con los que están en cualquiera de los dos.',
    ejemplo: '{"P", "A"}.union({"A", "T"}) → {"P", "A", "T"}',
  },
  intersection: {
    firma: 'conjunto.intersection(otro)',
    que: 'Un conjunto nuevo con los que están en los DOS.',
    ejemplo: '{"P", "A"}.intersection({"A", "T"}) → {"A"}',
  },
  issubset: {
    firma: 'conjunto.issubset(otro)',
    que: 'True si todos los de este conjunto están también en el otro. Sirve para chequear que los estados sean todos válidos.',
    ejemplo: '{"P", "T"}.issubset({"P", "A", "T"}) → True',
  },

  // ---- Archivos (los ejemplos usan un dia.txt con dos renglones) ----------
  read: {
    firma: 'archivo.read()',
    que: 'Todo el archivo, en un solo texto. Los Enter vienen adentro, como \\n.',
    ejemplo: 'archivo = open("dia.txt", encoding="utf-8")\narchivo.read() → "30111222,P\\n28999888,A\\n"',
  },
  readlines: {
    firma: 'archivo.readlines()',
    que: 'Los renglones, como lista. Ojo: cada uno trae su Enter al final; por eso después casi siempre va un strip().',
    ejemplo: 'archivo = open("dia.txt", encoding="utf-8")\narchivo.readlines() → ["30111222,P\\n", "28999888,A\\n"]',
  },
  write: {
    firma: 'archivo.write(texto)',
    que: 'Escribe el texto en el archivo. No agrega el Enter solo: si querés renglón nuevo, va un \\n al final.',
    ejemplo: 'archivo = open("dia.txt", "w", encoding="utf-8")\narchivo.write("30111222,T\\n")\narchivo.close()\nopen("dia.txt", encoding="utf-8").read() → "30111222,T\\n"',
  },
  close: {
    firma: 'archivo.close()',
    que: 'Cierra el archivo. Con with open(...) as archivo no hace falta: se cierra solo al salir del bloque.',
    ejemplo: 'archivo = open("dia.txt", encoding="utf-8")\narchivo.close()\narchivo.closed → True',
  },

  // ---- Base de datos (los ejemplos usan una con con la tabla alumnos) -----
  execute: {
    firma: 'con.execute(sql, valores)',
    que: 'Corre una consulta SQL. Los valores van aparte, en una tupla, con un ? en el SQL por cada uno: nunca pegados al texto.',
    ejemplo: 'con.execute("INSERT INTO alumnos VALUES (?, ?)", ("28999888", "Beto"))',
  },
  fetchone: {
    firma: 'con.execute(sql).fetchone()',
    que: 'La primera fila del resultado, como tupla. Si no hay ninguna, None: por eso antes de usarla va un if fila is None.',
    ejemplo: 'fila = con.execute("SELECT nombre FROM alumnos").fetchone()\nfila → ("Ana",)',
  },
  fetchall: {
    firma: 'con.execute(sql).fetchall()',
    que: 'Todas las filas del resultado: una lista de tuplas. Si no hay ninguna, la lista vacía.',
    ejemplo: 'filas = con.execute("SELECT dni FROM alumnos").fetchall()\nfilas → [("30111222",)]',
  },
  commit: {
    firma: 'con.commit()',
    que: 'Confirma los cambios. Sin commit(), lo que agregaste o cambiaste se pierde cuando termina el programa.',
    ejemplo: 'con.execute("INSERT INTO alumnos VALUES (?, ?)", ("28999888", "Beto"))\ncon.commit()',
  },
};

/** Arma el panel de un método. CodeMirror lo llama cuando lo seleccionan. */
function panelDoc(nombre: string) {
  return (): HTMLElement => {
    const doc = DOCS[nombre];
    const caja = document.createElement('div');
    caja.className = 'pc-doc';

    const firma = document.createElement('code');
    firma.className = 'pc-doc__firma';
    firma.textContent = doc.firma;

    const que = document.createElement('p');
    que.className = 'pc-doc__que';
    que.textContent = doc.que;

    const ejemplo = document.createElement('div');
    ejemplo.className = 'pc-doc__ejemplo';
    for (const linea of doc.ejemplo.split('\n')) {
      const fila = document.createElement('div');
      const [izquierda, derecha] = linea.split('→');
      if (derecha === undefined) {
        fila.textContent = linea;
      } else {
        const flecha = document.createElement('b');
        flecha.className = 'pc-doc__flecha';
        flecha.textContent = '→';
        fila.append(izquierda.trimEnd() + '  ', flecha, '  ' + derecha.trim());
      }
      ejemplo.append(fila);
    }

    caja.append(firma, que, ejemplo);
    return caja;
  };
}

/* Donde NO hay que sugerir nada. El paquete de Python envuelve su lista en un
   `ifNotIn` con estos nodos; nosotros usábamos `completeFromList` pelado y por
   eso la lista se colaba adentro de los strings y de los comentarios: escribir
   `mensaje = "hola def` ofrecía la palabra `def`. */
const NO_COMPLETAR = ['String', 'FormatString', 'Comment'];

/* El panel se engancha solo: alcanza con agregarle una entrada a DOCS y ese
   método lo tiene. Así la lista de arriba no se llena de `info:` repetidos y no
   hay forma de que un método quede con panel a medias. */
for (const metodo of METODOS) {
  if (DOCS[metodo.label]) metodo.info = panelDoc(metodo.label);
}

/* El panel se abre y se cierra con una flecha › a la derecha de cada opción.
   ------------------------------------------------------------------------
   En el celular el panel no tiene lugar al costado y CodeMirror lo pone encima
   o debajo de la lista, y con el teclado abierto termina tapando opciones. Así
   que ahí arranca cerrado. En la compu sale al costado sin tapar nada, y ahí
   arranca abierto. Lo que el alumno elija se recuerda en ese navegador.

   El estado es UNO para toda la página (una clase en <html>), no uno por
   editor: si lo cerraste en un ejercicio, no querés que se te abra en el de
   abajo. Se esconde con `visibility` y no con `display: none` a propósito:
   así CodeMirror lo sigue midiendo y ubicando, y al abrirlo aparece ya en su
   lugar, sin un salto. */
const CLAVE_DOC = 'pc:doc-editor';

function docAbierta() {
  return document.documentElement.classList.contains('pc-doc-abierta');
}

function ponerDocAbierta(abierta: boolean, recordar = true) {
  document.documentElement.classList.toggle('pc-doc-abierta', abierta);
  if (!recordar) return;
  try { localStorage.setItem(CLAVE_DOC, abierta ? 'abierta' : 'cerrada'); } catch { /* sin storage, no se recuerda */ }
}

if (typeof document !== 'undefined') {
  let guardado: string | null = null;
  try { guardado = localStorage.getItem(CLAVE_DOC); } catch { /* idem */ }
  const angosta = window.matchMedia('(max-width: 767px)').matches;
  ponerDocAbierta(guardado ? guardado === 'abierta' : !angosta, false);
}

/** La flecha de una opción. Solo la llevan las que tienen panel. */
function flechaDoc(completion: Completion, _estado: unknown, view: EditorView): Node | null {
  if (!completion.info) return null;
  const flecha = document.createElement('span');
  flecha.className = 'pc-doc-flecha';
  flecha.title = 'Ver u ocultar la explicación';
  // El símbolo va aparte porque es LO QUE GIRA. Si girara la caja entera (que
  // es más ancha que alta y ocupa todo el renglón), a mitad del giro quedaría
  // parada, más alta que el renglón, y a la lista le aparecía un scroll.
  const icono = document.createElement('span');
  icono.className = 'pc-doc-flecha__icono';
  icono.textContent = '›';
  flecha.append(icono);

  /* La lista de CodeMirror escucha `mousedown`, sube desde lo que tocaste
     hasta el <li> y APLICA esa sugerencia. Sin el stopPropagation, tocar la
     flecha escribiría el método en vez de mostrar su explicación. Y sin el
     preventDefault el editor pierde el foco y el cartel se cierra solo. */
  flecha.addEventListener('mousedown', (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
    const opcion = flecha.closest('li');
    if (opcion?.getAttribute('aria-selected') === 'true') {
      ponerDocAbierta(!docAbierta());
      return;
    }
    // Otra opción: se elige esa y se abre SU panel, que es lo que uno espera
    // al tocar la flecha de algo que todavía no está marcado.
    const indice = Number(/-(\d+)$/.exec(opcion?.id ?? '')?.[1]);
    if (!Number.isNaN(indice)) view.dispatch({ effects: setSelectedCompletion(indice) });
    ponerDocAbierta(true);
  });
  return flecha;
}

/** El trozo `.loQueVaDespues` si el cursor está escribiendo después de un punto. */
function despuesDeUnPunto(context: CompletionContext) {
  const trozo = context.matchBefore(/\.[A-Za-z_]*$/);
  if (!trozo) return null;
  // `3.14` también tiene un punto y no es un método: miramos qué hay antes.
  const anterior = context.state.sliceDoc(Math.max(0, trozo.from - 1), trozo.from);
  return /[0-9]/.test(anterior) ? null : trozo;
}

/** Después de un punto: solo métodos. */
function metodosDelPunto(context: CompletionContext): CompletionResult | null {
  const trozo = despuesDeUnPunto(context);
  if (!trozo) return null;
  return {
    // +1 para no pisar el punto: se reemplaza solo lo que viene después.
    from: trozo.from + 1,
    options: METODOS,
    validFor: /^[A-Za-z_]*$/,
  };
}

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

  const listaCurada = completeFromList([...delEjercicio, ...BASICOS, ...PALABRAS]);

  /* Funciones, palabras del lenguaje y variables del ejercicio: todo MENOS
     después de un punto. Sin este corte, `texto.pri` ofrecía `print`, que como
     método de un texto no existe. Ahí mandan los métodos y nadie más. */
  const sueltas = (context: CompletionContext) =>
    (despuesDeUnPunto(context) ? null : listaCurada(context));

  return [
    autocompletion({
      /* `override` reemplaza TODAS las fuentes, y eso es lo importante acá.
         Sin él, el paquete de Python suma los builtins enteros: `eval`,
         `globals`, `locals`, `callable`, `ValueError`… Tres problemas a la vez:
         son ruido para quien recién empieza, `eval` es lo último que uno quiere
         sugerirle a nadie, y sobre todo hacen un cartel de ocho renglones que
         tapa la consigna.

         OJO con lo que el `override` se llevó puesto sin querer: el paquete
         envolvía su lista en un `ifNotIn`, y al reemplazarla perdimos esa
         guarda. De ahí los dos `ifNotIn` de acá abajo.

         Las tres fuentes, y cada una sabe cuándo callarse:
           - `sueltas`     → funciones, palabras y datos del ejercicio; nunca después de un punto
           - `metodosDelPunto` → solo después de un punto
           - `localCompletionSource` → lo que el alumno definió en su código
             (trae su propia guarda, incluido el no completar después del punto) */
      override: [
        ifNotIn(NO_COMPLETAR, sueltas),
        ifNotIn(NO_COMPLETAR, metodosDelPunto),
        localCompletionSource,
      ],
      // Sin esto, el cartel se cierra al tocar afuera y en el celular eso pasa
      // con cualquier scroll.
      closeOnBlur: true,
      // Seis y no ocho: el cartel tiene que caber DEBAJO del cursor, porque si
      // no CodeMirror lo da vuelta y lo pone encima de lo que se está leyendo.
      maxRenderedOptions: 6,
      // La flecha › que abre y cierra el panel. 90 la pone después del nombre
      // (50) y de la descripción corta (80): queda contra el borde derecho.
      addToOptions: [{ render: flechaDoc, position: 90 }],
    }),
  ];
}
