/* El autocompletado de HTML, CSS y JavaScript: lo mismo que el de Python
   (editor-comun.ts), para los ejercicios web.
   ---------------------------------------------------------------------
   Lo que traían los paquetes de CodeMirror, medido el 28/10:
     - HTML: 113 etiquetas y 83 atributos, en inglés y sin explicar nada.
     - CSS: los nombres de las propiedades no salían, y los valores eran 561
       palabras, las mismas para cualquier propiedad (`display: ` ofrecía
       `activecaption`).
     - JS: las palabras clave y las variables propias, y NADA después de un
       punto: ni `document.querySelector` ni `.textContent`.

   Mismo criterio que en Python: lo que se usa en las clases web (contado en
   los .mdx, sin lo de los tests), con una descripción corta en castellano, y
   para lo más usado el panel › con la firma, qué hace y un ejemplo.

   HTML se arma ENVOLVIENDO la fuente del paquete: ella ya sabe si se está
   escribiendo una etiqueta, un atributo, un valor o un cierre (`</`); acá se
   filtra a lo del curso y se le agrega la explicación. CSS y JS tienen fuentes
   propias.

   Los ejemplos de JS que no tocan la página (listas, textos, Math, JSON) son
   JavaScript de verdad: `scripts/verificar-docs-editor.py` los corre con Node
   y comprueba cada `→`, como los de Python. */

import {
  autocompletion, completeFromList, ifNotIn,
  type Completion, type CompletionContext, type CompletionResult, type CompletionSource,
} from '@codemirror/autocomplete';
import { htmlCompletionSource } from '@codemirror/lang-html';
import { localCompletionSource } from '@codemirror/lang-javascript';
import { panelDe, flechaDoc, type Doc } from './editor-comun';

type Lang = 'html' | 'css' | 'js';

/** Una opción con su descripción corta y, si tiene, su panel. */
function opcion(label: string, type: string, detail: string, doc?: Doc, extra: Partial<Completion> = {}): Completion {
  return { label, type, detail, ...(doc ? { info: panelDe(doc) } : {}), ...extra };
}

// ================================ HTML ================================

const DOCS_HTML: Record<string, Doc> = {
  a: {
    firma: '<a href="destino">texto</a>',
    que: 'Un link: al tocar el texto, se va a lo que diga href. Con target="_blank" se abre en otra pestaña.',
    ejemplo: '<a href="https://wa.me/5492215550000">Consultar</a>',
  },
  img: {
    firma: '<img src="foto.jpg" alt="qué se ve">',
    que: 'Una imagen. No tiene cierre. El alt describe la foto: lo lee quien no la puede ver, y aparece si no carga.',
    ejemplo: '<img src="taza.jpg" alt="Taza de cerámica blanca">',
  },
  input: {
    firma: '<input type="text" id="nombre">',
    que: 'Un lugar para escribir. El type dice qué: text, number, email, password, checkbox… No tiene cierre.',
    ejemplo: '<label for="edad">Edad</label>\n<input type="number" id="edad" min="0">',
  },
  button: {
    firma: '<button type="button">texto</button>',
    que: 'Un botón. Adentro de un form, sin type="button", al tocarlo envía el formulario y la página se recarga.',
    ejemplo: '<button type="button" id="tirar">Tirar la moneda</button>',
  },
  label: {
    firma: '<label for="id-del-input">texto</label>',
    que: 'El nombre de un campo. Con for igual al id del input, tocar el texto pone el cursor en el campo.',
    ejemplo: '<label for="mail">Tu mail</label>\n<input type="email" id="mail">',
  },
  form: {
    firma: '<form> … </form>',
    que: 'Agrupa campos para enviarlos juntos. Al enviarse recarga la página: en JS se frena con evento.preventDefault().',
    ejemplo: '<form id="contacto">\n  <input type="text" required>\n  <button>Enviar</button>\n</form>',
  },
  ul: {
    firma: '<ul> <li>…</li> </ul>',
    que: 'Una lista con viñetas. Cada elemento va en su <li>. Con números en vez de viñetas: <ol>.',
    ejemplo: '<ul>\n  <li>Mate</li>\n  <li>Taza</li>\n</ul>',
  },
  article: {
    firma: '<article> … </article>',
    que: 'Algo que tiene sentido solo, aunque lo saques de la página: una tarjeta de producto, una noticia.',
    ejemplo: '<article class="tarjeta">\n  <h2>Taza</h2>\n  <p class="precio">$4500</p>\n</article>',
  },
  div: {
    firma: '<div> … </div>',
    que: 'Una caja sin significado, para agrupar y darle estilo. Si lo que agrupás tiene nombre (un encabezado, una tarjeta), mejor la etiqueta de ese nombre.',
    ejemplo: '<div class="grilla"> … </div>',
  },
  span: {
    firma: '<span> … </span>',
    que: 'Como div, pero adentro de un renglón: para darle estilo a una parte de un texto.',
    ejemplo: '<p>Precio: <span class="precio">$4500</span></p>',
  },
  meta: {
    firma: '<meta name="viewport" content="…">',
    que: 'Datos de la página que no se ven. El de viewport es el que hace que en el celular no se vea achicada.',
    ejemplo: '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">',
  },
  link: {
    firma: '<link rel="stylesheet" href="estilos.css">',
    que: 'Trae un archivo de CSS. Va en el <head>.',
    ejemplo: '<link rel="stylesheet" href="estilos.css">',
  },
  script: {
    firma: '<script src="app.js"></script>',
    que: 'Trae JavaScript. Al final del <body>: así, cuando corre, la página ya está armada.',
    ejemplo: '<script src="moneda.js"></script>',
  },
  main: {
    firma: '<main> … </main>',
    que: 'Lo principal de la página, lo que no se repite en todas: una sola vez por página.',
    ejemplo: '<main>\n  <h1>Mi catálogo</h1>\n</main>',
  },
};

const ETIQUETAS: Record<string, string> = {
  html: 'la página entera', head: 'lo que no se ve: título, estilos', body: 'lo que se ve',
  meta: 'datos de la página', title: 'el nombre en la pestaña', link: 'traer un CSS',
  script: 'traer JavaScript', style: 'CSS adentro de la página',
  main: 'lo principal', header: 'el encabezado', footer: 'el pie', nav: 'los links del menú',
  section: 'una parte, con su título', article: 'algo que se entiende solo: una tarjeta',
  h1: 'el título principal', h2: 'un subtítulo', h3: 'un subtítulo más chico',
  p: 'un párrafo', a: 'un link', img: 'una imagen', strong: 'importante (negrita)',
  em: 'énfasis (cursiva)', small: 'letra chica', br: 'salto de renglón', code: 'código',
  span: 'una parte de un texto', div: 'una caja para agrupar',
  ul: 'lista con viñetas', ol: 'lista numerada', li: 'un elemento de la lista',
  form: 'un formulario', label: 'el nombre de un campo', input: 'un campo para escribir',
  button: 'un botón', select: 'una lista para elegir', option: 'una opción del select',
  textarea: 'un campo de varios renglones', table: 'una tabla', thead: 'el encabezado de la tabla',
  tbody: 'el cuerpo de la tabla', tr: 'una fila', th: 'una celda de título', td: 'una celda',
};

const DOCS_ATRIBUTOS: Record<string, Doc> = {
  class: {
    firma: 'class="nombre otro"',
    que: 'Uno o varios nombres (separados por espacios) para darle estilo desde el CSS con .nombre. Se puede repetir en muchos elementos.',
    ejemplo: '<p class="precio destacado">$4500</p>',
  },
  id: {
    firma: 'id="nombre"',
    que: 'Un nombre ÚNICO en toda la página: para encontrarlo desde JS (#nombre) o para el for de un label.',
    ejemplo: '<button id="tirar">Tirar</button>',
  },
  href: {
    firma: 'href="destino"',
    que: 'Adónde lleva un link: otra página, un archivo, wa.me/… para WhatsApp, o #id para bajar a una parte.',
    ejemplo: '<a href="#contacto">Contacto</a>',
  },
  src: {
    firma: 'src="archivo"',
    que: 'El archivo de una imagen o de un script.',
    ejemplo: '<img src="img/taza.jpg" alt="Taza">',
  },
  alt: {
    firma: 'alt="qué se ve"',
    que: 'Describe la imagen para quien no la ve (y si no carga). No "foto": qué hay en la foto.',
    ejemplo: '<img src="mate.jpg" alt="Mate de calabaza con bombilla">',
  },
  for: {
    firma: 'for="id-del-input"',
    que: 'En un label: el id del campo al que nombra. Así, tocar el texto pone el cursor en el campo.',
    ejemplo: '<label for="edad">Edad</label>\n<input id="edad">',
  },
  type: {
    firma: 'type="…"',
    que: 'En un input, qué se escribe (text, number, email, checkbox…). En un button, button para que no envíe el formulario.',
    ejemplo: '<input type="email">\n<button type="button">Ver</button>',
  },
  target: {
    firma: 'target="_blank"',
    que: 'En un link, que se abra en otra pestaña.',
    ejemplo: '<a href="https://wa.me/549221…" target="_blank">WhatsApp</a>',
  },
};

const ATRIBUTOS: Record<string, string> = {
  class: 'nombre para el CSS', id: 'nombre único', href: 'adónde lleva el link', src: 'el archivo',
  alt: 'qué se ve en la imagen', type: 'de qué tipo', placeholder: 'texto de ayuda gris',
  value: 'el valor', name: 'el nombre al enviar', for: 'el id del campo que nombra',
  required: 'obligatorio', lang: 'el idioma', charset: 'los caracteres (utf-8)',
  content: 'el contenido de un meta', rel: 'qué es el archivo (stylesheet)',
  target: '_blank: otra pestaña', min: 'el mínimo', max: 'el máximo',
  checked: 'marcado', disabled: 'desactivado', title: 'cartelito al pasar el mouse',
  width: 'ancho', height: 'alto', action: 'adónde se envía', method: 'cómo se envía',
};

/** La fuente del paquete, filtrada a lo del curso y en castellano. */
async function fuenteHtml(context: CompletionContext): Promise<CompletionResult | null> {
  const r = await htmlCompletionSource(context);
  if (!r) return r;
  // El cierre (`</`) se deja como viene: ofrece la etiqueta que está abierta.
  if (context.state.sliceDoc(r.from - 2, r.from) === '</') return r;
  const opciones: Completion[] = [];
  for (const o of r.options) {
    if (o.type === 'type') {
      if (ETIQUETAS[o.label]) opciones.push({ ...o, detail: ETIQUETAS[o.label], ...(DOCS_HTML[o.label] ? { info: panelDe(DOCS_HTML[o.label]) } : {}) });
    } else if (o.type === 'property') {
      if (ATRIBUTOS[o.label]) opciones.push({ ...o, detail: ATRIBUTOS[o.label], ...(DOCS_ATRIBUTOS[o.label] ? { info: panelDe(DOCS_ATRIBUTOS[o.label]) } : {}) });
    } else {
      opciones.push(o); // los valores de un atributo (type="email", target="_blank")
    }
  }
  return opciones.length ? { ...r, options: opciones } : null;
}

// ================================ CSS ================================

const DOCS_CSS: Record<string, Doc> = {
  padding: {
    firma: 'padding: arriba derecha abajo izquierda;',
    que: 'El aire de ADENTRO, entre el borde y el contenido. Con un valor, igual en los cuatro lados; con dos, arriba-abajo y los costados.',
    ejemplo: 'padding: 16px;\npadding: 8px 16px;',
  },
  margin: {
    firma: 'margin: arriba derecha abajo izquierda;',
    que: 'El aire de AFUERA, entre esta caja y las de al lado. margin: 0 auto centra una caja con ancho.',
    ejemplo: 'margin: 0 auto;\nmargin-top: 24px;',
  },
  display: {
    firma: 'display: flex | grid | block | none;',
    que: 'Cómo acomoda lo de adentro: flex en fila (o columna), grid en grilla, none lo esconde.',
    ejemplo: 'display: grid;\ngrid-template-columns: 1fr 1fr;',
  },
  'grid-template-columns': {
    firma: 'grid-template-columns: columnas;',
    que: 'Las columnas de la grilla. fr es una parte de lo que sobra; repeat(auto-fill, minmax(200px, 1fr)) arma las que entren.',
    ejemplo: 'grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));',
  },
  gap: {
    firma: 'gap: espacio;',
    que: 'El espacio ENTRE los elementos de un flex o un grid (no en los bordes de afuera).',
    ejemplo: 'gap: 16px;',
  },
  'justify-content': {
    firma: 'justify-content: center | space-between | …;',
    que: 'En flex: cómo se reparten a lo largo de la fila. center los junta en el medio; space-between los separa al máximo.',
    ejemplo: 'display: flex;\njustify-content: space-between;',
  },
  'align-items': {
    firma: 'align-items: center | start | end;',
    que: 'En flex: dónde quedan a lo alto de la fila. center los centra verticalmente.',
    ejemplo: 'display: flex;\nalign-items: center;',
  },
  color: {
    firma: 'color: color;',
    que: 'El color del TEXTO. El del fondo es background.',
    ejemplo: 'color: #1d3557;\ncolor: rebeccapurple;',
  },
  background: {
    firma: 'background: color | imagen;',
    que: 'El fondo: un color, un degradé o una imagen.',
    ejemplo: 'background: #fff8e7;\nbackground: linear-gradient(#fff, #eee);',
  },
  'border-radius': {
    firma: 'border-radius: radio;',
    que: 'Redondea las esquinas. 50% en algo cuadrado lo hace un círculo.',
    ejemplo: 'border-radius: 12px;\nborder-radius: 50%;',
  },
  border: {
    firma: 'border: grosor estilo color;',
    que: 'El borde, en una línea: cuánto, cómo (solid, dashed) y de qué color.',
    ejemplo: 'border: 2px solid #ddd;',
  },
  'font-size': {
    firma: 'font-size: tamaño;',
    que: 'El tamaño de la letra. rem es relativo al tamaño normal del navegador: 1.5rem es una vez y media.',
    ejemplo: 'font-size: 1.5rem;',
  },
  'max-width': {
    firma: 'max-width: ancho;',
    que: 'Hasta dónde puede crecer a lo ancho. En una pantalla chica se achica; en una grande no se estira de más.',
    ejemplo: 'max-width: 900px;\nmargin: 0 auto;',
  },
  transform: {
    firma: 'transform: rotate() | scale() | translate();',
    que: 'Gira, agranda o mueve el elemento sin correr a los demás. Es lo que se anima en la moneda.',
    ejemplo: 'transform: rotateY(180deg);\ntransform: scale(1.1);',
  },
  transition: {
    firma: 'transition: propiedad duración;',
    que: 'Que un cambio (por ejemplo, en :hover) pase de a poco y no de golpe.',
    ejemplo: 'transition: transform 0.3s;',
  },
  animation: {
    firma: 'animation: nombre duración;',
    que: 'Corre una animación de @keyframes. Con forwards se queda como termina.',
    ejemplo: 'animation: sale-cara 1.2s forwards;',
  },
  position: {
    firma: 'position: relative | absolute | fixed | sticky;',
    que: 'absolute lo saca del lugar y lo ubica con top/left respecto del padre que tenga position: relative.',
    ejemplo: 'position: absolute;\ntop: 8px;\nright: 8px;',
  },
};

const PROPIEDADES: Record<string, string> = {
  color: 'color del texto', background: 'el fondo', 'background-color': 'color de fondo',
  padding: 'aire de adentro', margin: 'aire de afuera', border: 'el borde', 'border-radius': 'esquinas redondeadas',
  display: 'cómo acomoda lo de adentro', gap: 'espacio entre elementos',
  'grid-template-columns': 'las columnas de la grilla', 'grid-template-rows': 'las filas de la grilla',
  'grid-column': 'en qué columnas va', 'grid-row': 'en qué filas va',
  'flex-direction': 'fila o columna', 'flex-wrap': 'que bajen de renglón',
  'justify-content': 'repartir a lo largo', 'align-items': 'ubicar a lo alto', 'place-items': 'centrar en el grid',
  'font-family': 'la tipografía', 'font-size': 'tamaño de letra', 'font-weight': 'grosor (negrita)',
  'line-height': 'alto del renglón', 'text-align': 'alinear el texto', 'text-decoration': 'subrayado',
  width: 'ancho', 'max-width': 'ancho máximo', height: 'alto', 'aspect-ratio': 'proporción ancho/alto',
  'box-sizing': 'el ancho incluye el borde', position: 'cómo se ubica', top: 'distancia desde arriba',
  right: 'distancia desde la derecha', bottom: 'distancia desde abajo', left: 'distancia desde la izquierda',
  transform: 'girar, agrandar, mover', transition: 'cambiar de a poco', animation: 'una animación',
  overflow: 'qué hace con lo que no entra', 'box-shadow': 'sombra', cursor: 'el puntero del mouse',
  'object-fit': 'cómo llena la imagen su caja', 'list-style': 'las viñetas', opacity: 'transparencia',
  'z-index': 'qué queda encima',
};

const VALORES: Record<string, string[]> = {
  display: ['flex', 'grid', 'block', 'inline-block', 'none'],
  position: ['relative', 'absolute', 'fixed', 'sticky'],
  'text-align': ['left', 'center', 'right'],
  'flex-direction': ['row', 'column'],
  'flex-wrap': ['wrap', 'nowrap'],
  'justify-content': ['center', 'space-between', 'space-around', 'start', 'end'],
  'align-items': ['center', 'start', 'end', 'stretch'],
  'place-items': ['center'],
  'font-weight': ['bold', 'normal', '700', '400'],
  'text-decoration': ['none', 'underline'],
  'box-sizing': ['border-box'],
  overflow: ['hidden', 'auto', 'scroll'],
  cursor: ['pointer', 'default'],
  'object-fit': ['cover', 'contain'],
  'list-style': ['none'],
  'font-family': ['system-ui, sans-serif', 'Georgia, serif', 'monospace'],
};

const PSEUDO: Completion[] = [
  opcion('hover', 'keyword', 'con el mouse encima'),
  opcion('focus', 'keyword', 'con el cursor adentro'),
  opcion('first-child', 'keyword', 'el primero'),
  opcion('last-child', 'keyword', 'el último'),
  opcion('nth-child()', 'keyword', 'el que está en tal lugar', undefined, { apply: 'nth-child(' }),
  opcion('not()', 'keyword', 'todos menos…', undefined, { apply: 'not(' }),
];

/** ¿El cursor está adentro de las llaves de una regla? */
function enUnaRegla(context: CompletionContext) {
  const antes = context.state.sliceDoc(0, context.pos).replace(/\/\*[\s\S]*?\*\//g, '');
  let profundidad = 0;
  for (const c of antes) {
    if (c === '{') profundidad++;
    else if (c === '}') profundidad = Math.max(0, profundidad - 1);
  }
  // Adentro de @keyframes hay dos niveles: el de las propiedades es el de adentro.
  return profundidad > 0 && !/@keyframes[^{]*\{[^{}]*$/.test(antes);
}

const OPCIONES_PROPIEDADES: Completion[] = Object.entries(PROPIEDADES).map(([nombre, detalle]) =>
  // Al elegirla, ya escribe los dos puntos: lo que siempre viene después.
  opcion(nombre, 'property', detalle, DOCS_CSS[nombre], { apply: nombre + ': ' }));

const OPCIONES_ETIQUETAS: Completion[] = Object.entries(ETIQUETAS).map(([nombre, detalle]) => opcion(nombre, 'type', detalle));

function fuenteCss(context: CompletionContext): CompletionResult | null {
  if (enUnaRegla(context)) {
    // El valor de una propiedad: `display: fl`
    const valor = context.matchBefore(/([a-z-]+)\s*:\s*[\w-]*$/);
    if (valor) {
      const propiedad = /^([a-z-]+)/.exec(valor.text)![1];
      const posibles = VALORES[propiedad];
      if (!posibles) return null;
      const palabra = context.matchBefore(/[\w-]*$/)!;
      return { from: palabra.from, options: posibles.map((v) => opcion(v, 'constant', '')), validFor: /^[\w-]*$/ };
    }
    // El nombre de una propiedad, al principio de la declaración.
    const nombre = context.matchBefore(/(^|[{;\s])[a-z-]*$/);
    if (!nombre) return null;
    const palabra = context.matchBefore(/[a-z-]*$/)!;
    if (palabra.from === palabra.to && !context.explicit) return null;
    return { from: palabra.from, options: OPCIONES_PROPIEDADES, validFor: /^[a-z-]*$/ };
  }
  // Afuera de las llaves, el selector: `article:ho` o `art`.
  const pseudo = context.matchBefore(/:[a-z-]*$/);
  if (pseudo) return { from: pseudo.from + 1, options: PSEUDO, validFor: /^[a-z-]*$/ };
  const palabra = context.matchBefore(/(^|[\s,>+~])[a-z][a-z0-9]*$/);
  if (!palabra) return null;
  const desde = context.matchBefore(/[a-z][a-z0-9]*$/)!;
  return { from: desde.from, options: OPCIONES_ETIQUETAS, validFor: /^[a-z0-9]*$/ };
}

// ============================== JavaScript ==============================

/* Los ejemplos que no tocan la página se corren con Node (ver arriba): las
   líneas sin flecha se ejecutan, y `EXPRESION → VALOR` se comprueba. */
const DOCS_JS: Record<string, Doc> = {
  log: {
    firma: 'console.log(valor)',
    que: 'Muestra el valor en la consola. Es el print de JavaScript: para mirar qué vale algo mientras programás.',
    ejemplo: 'console.log("Hola", 2 + 3)',
  },
  querySelector: {
    firma: 'document.querySelector("selector")',
    que: 'Busca en la página el PRIMER elemento que cumple el selector de CSS: "#id", ".clase", "button". Si no hay ninguno, null.',
    ejemplo: 'const boton = document.querySelector("#tirar")',
  },
  querySelectorAll: {
    firma: 'document.querySelectorAll("selector")',
    que: 'Todos los que cumplen el selector. Se recorren con for…of o con forEach.',
    ejemplo: 'for (const tarjeta of document.querySelectorAll(".tarjeta")) {\n  tarjeta.classList.add("visto")\n}',
  },
  addEventListener: {
    firma: 'elemento.addEventListener("evento", funcion)',
    que: 'Que la función corra cuando pase algo: "click", "input", "submit", "keydown"… La función recibe el evento.',
    ejemplo: 'boton.addEventListener("click", () => {\n  resultado.textContent = "¡Cara!"\n})',
  },
  textContent: {
    firma: 'elemento.textContent',
    que: 'El texto de adentro. Asignándole, lo cambia (como texto: si tiene < y >, no se vuelven etiquetas).',
    ejemplo: 'titulo.textContent = "Mi catálogo"',
  },
  classList: {
    firma: 'elemento.classList.add | remove | toggle("clase")',
    que: 'Las clases del elemento. Ponerle o sacarle una clase es la forma de cambiarle el estilo desde JS: el estilo queda en el CSS.',
    ejemplo: 'moneda.classList.toggle("girando")',
  },
  toggle: {
    firma: 'elemento.classList.toggle("clase")',
    que: 'Si la tiene, se la saca; si no la tiene, se la pone. Devuelve true si quedó puesta.',
    ejemplo: 'panel.classList.toggle("abierto")',
  },
  value: {
    firma: 'campo.value',
    que: 'Lo que escribió la persona en un input, SIEMPRE como texto. Para hacer cuentas: Number(campo.value).',
    ejemplo: 'const edad = Number(campoEdad.value)',
  },
  preventDefault: {
    firma: 'evento.preventDefault()',
    que: 'Frena lo que el navegador iba a hacer solo: en un submit, enviar el formulario y recargar la página.',
    ejemplo: 'form.addEventListener("submit", (evento) => {\n  evento.preventDefault()\n})',
  },
  random: {
    firma: 'Math.random()',
    que: 'Un número al azar entre 0 y 1 (el 1 nunca sale). Para una probabilidad: Math.random() < 0.3 es true 3 de cada 10 veces.',
    ejemplo: 'const salioCara = Math.random() < 0.5',
  },
  floor: {
    firma: 'Math.floor(numero)',
    que: 'Redondea para abajo: le saca los decimales. Con Math.random arma un entero al azar.',
    ejemplo: 'Math.floor(4.8) → 4\nMath.floor(Math.random() * 6) + 1 <= 6 → true',
  },
  round: {
    firma: 'Math.round(numero)',
    que: 'Redondea al entero más cercano.',
    ejemplo: 'Math.round(4.5) → 5\nMath.round(4.4) → 4',
  },
  push: {
    firma: 'lista.push(elemento)',
    que: 'Agrega al final, como append en Python. Cambia la lista que ya tenías.',
    ejemplo: 'const colores = ["azul"]\ncolores.push("rojo")\ncolores → ["azul", "rojo"]',
  },
  length: {
    firma: 'lista.length',
    que: 'Cuántos elementos tiene (o cuántas letras un texto). Es una propiedad: va sin paréntesis, no como len() en Python.',
    ejemplo: '["a", "b", "c"].length → 3\n"Hola".length → 4',
  },
  map: {
    firma: 'lista.map(x => …)',
    que: 'Una lista NUEVA con lo que devuelve la función para cada elemento. Como [f(x) for x in lista] en Python.',
    ejemplo: '[1, 2, 3].map(n => n * 2) → [2, 4, 6]',
  },
  filter: {
    firma: 'lista.filter(x => condición)',
    que: 'Una lista NUEVA con los que cumplen la condición. Como [x for x in lista if …] en Python.',
    ejemplo: '[4, 9, 6, 2].filter(n => n >= 6) → [9, 6]',
  },
  forEach: {
    firma: 'lista.forEach(x => …)',
    que: 'Corre la función con cada elemento. No devuelve nada: es para hacer algo, no para armar otra lista.',
    // Ojo: NO arrancar una línea con [ después de otra sin punto y coma. JS
    // las junta (`[]["ana", "beto"]`) y da undefined: lo encontró el verificador.
    ejemplo: 'const amigos = ["ana", "beto"]\nconst nombres = []\namigos.forEach(n => nombres.push(n.toUpperCase()))\nnombres → ["ANA", "BETO"]',
  },
  includes: {
    firma: 'lista.includes(valor)',
    que: '¿Está adentro? Como in en Python. Sirve en listas y en textos.',
    ejemplo: '["P", "T"].includes("T") → true\n"Ensenada".includes("sena") → true',
  },
  join: {
    firma: 'lista.join(separador)',
    que: 'Une la lista en un texto, con el separador entre cada uno. Al revés que en Python: acá va lista.join(…).',
    ejemplo: '["Taza", "Mate"].join(", ") → "Taza, Mate"',
  },
  split: {
    firma: 'texto.split(separador)',
    que: 'Parte el texto cada vez que encuentra el separador y devuelve una lista.',
    ejemplo: '"30111222,P".split(",") → ["30111222", "P"]',
  },
  trim: {
    firma: 'texto.trim()',
    que: 'El texto sin los espacios de los bordes, como strip() en Python. Lo primero que se le hace a lo que escribió alguien.',
    ejemplo: '"  Ana  ".trim() → "Ana"',
  },
  toUpperCase: {
    firma: 'texto.toUpperCase()',
    que: 'Todo en MAYÚSCULAS. Para minúsculas: toLowerCase().',
    ejemplo: '"perez".toUpperCase() → "PEREZ"',
  },
  toFixed: {
    firma: 'numero.toFixed(decimales)',
    que: 'El número como texto, con esa cantidad de decimales. Para mostrar precios y porcentajes.',
    ejemplo: '(2 / 3 * 100).toFixed(1) → "66.7"',
  },
  stringify: {
    firma: 'JSON.stringify(valor)',
    que: 'Pasa una lista u objeto a texto JSON, para guardarlo (en localStorage, por ejemplo).',
    ejemplo: 'JSON.stringify({ nombre: "Ana", nota: 8 }) → "{\\"nombre\\":\\"Ana\\",\\"nota\\":8}"',
  },
  parse: {
    firma: 'JSON.parse(texto)',
    que: 'Al revés que stringify: del texto JSON vuelve a la lista u objeto.',
    ejemplo: 'JSON.parse("[1, 2]") → [1, 2]',
  },
  getItem: {
    firma: 'localStorage.getItem("clave")',
    que: 'Lo que se guardó con esa clave en este navegador (siempre texto), o null si no hay nada.',
    ejemplo: 'const guardado = localStorage.getItem("puntos")',
  },
  setItem: {
    firma: 'localStorage.setItem("clave", texto)',
    que: 'Guarda un texto en este navegador: sigue ahí aunque se cierre la página. Una lista, con JSON.stringify.',
    ejemplo: 'localStorage.setItem("puntos", "3")',
  },
};

const PALABRAS_JS: Completion[] = [
  opcion('const', 'keyword', 'una variable que no cambia'),
  opcion('let', 'keyword', 'una variable que va a cambiar'),
  opcion('function', 'keyword', 'definir una función'),
  opcion('return', 'keyword', 'devolver un valor'),
  opcion('if', 'keyword', 'si se cumple…'),
  opcion('else', 'keyword', 'si no…'),
  opcion('for', 'keyword', 'repetir'),
  opcion('of', 'keyword', 'for (const x of lista): por cada uno'),
  opcion('while', 'keyword', 'repetir mientras…'),
  opcion('break', 'keyword', 'cortar el bucle'),
  opcion('true', 'keyword', 'verdadero'),
  opcion('false', 'keyword', 'falso'),
  opcion('null', 'keyword', 'ningún valor'),
  opcion('new', 'keyword', 'crear un objeto: new Date()'),
];

const GLOBALES_JS: Completion[] = [
  opcion('console', 'namespace', 'la consola: console.log'),
  opcion('document', 'namespace', 'la página: document.querySelector'),
  opcion('Math', 'namespace', 'cuentas: Math.random, Math.floor'),
  opcion('JSON', 'namespace', 'pasar a texto y volver'),
  opcion('localStorage', 'namespace', 'guardar en el navegador'),
  opcion('Number', 'function', 'a número'),
  opcion('String', 'function', 'a texto'),
  opcion('setTimeout', 'function', 'correr algo dentro de un rato'),
  opcion('setInterval', 'function', 'correr algo cada tanto'),
  opcion('clearInterval', 'function', 'frenar un setInterval'),
];

/** Lo que va después de `algo.`, según qué sea `algo`. */
const MIEMBROS: Record<string, [string, string, string][]> = {
  console: [['log', 'method', 'mostrar en la consola']],
  document: [
    ['querySelector', 'method', 'el primero que cumple el selector'],
    ['querySelectorAll', 'method', 'todos los que cumplen el selector'],
    ['getElementById', 'method', 'el del id'],
    ['createElement', 'method', 'crear un elemento nuevo'],
    ['addEventListener', 'method', 'escuchar un evento'],
    ['body', 'property', 'el <body>'],
    ['title', 'property', 'el título de la pestaña'],
  ],
  Math: [
    ['random', 'method', 'al azar entre 0 y 1'],
    ['floor', 'method', 'redondear para abajo'],
    ['round', 'method', 'redondear'],
    ['ceil', 'method', 'redondear para arriba'],
    ['max', 'method', 'el más grande'],
    ['min', 'method', 'el más chico'],
    ['abs', 'method', 'valor absoluto'],
    ['PI', 'constant', '3.14159…'],
  ],
  JSON: [
    ['stringify', 'method', 'a texto JSON'],
    ['parse', 'method', 'de texto JSON'],
  ],
  localStorage: [
    ['getItem', 'method', 'leer lo guardado'],
    ['setItem', 'method', 'guardar'],
    ['removeItem', 'method', 'borrar'],
  ],
  classList: [
    ['add', 'method', 'ponerle la clase'],
    ['remove', 'method', 'sacarle la clase'],
    ['toggle', 'method', 'ponerla o sacarla'],
    ['contains', 'method', '¿la tiene?'],
  ],
  style: [
    ['color', 'property', 'color del texto'],
    ['backgroundColor', 'property', 'color de fondo'],
    ['display', 'property', 'none la esconde'],
    ['transform', 'property', 'girar, agrandar, mover'],
  ],
  // Cualquier otra cosa: no se sabe si es un elemento, una lista o un texto, así
  // que van todos (como los métodos de Python). Con dos letras, el filtro deja uno o dos.
  '': [
    // De la página
    ['textContent', 'property', 'el texto de adentro'],
    ['innerHTML', 'property', 'el HTML de adentro'],
    ['value', 'property', 'lo que escribieron en el campo'],
    ['classList', 'property', 'las clases: add, remove, toggle'],
    ['style', 'property', 'el estilo, desde JS'],
    ['dataset', 'property', 'los data-… del elemento'],
    ['addEventListener', 'method', 'escuchar un evento'],
    ['querySelector', 'method', 'buscar adentro de este'],
    ['append', 'method', 'agregar adentro, al final'],
    ['remove', 'method', 'sacarlo de la página'],
    ['setAttribute', 'method', 'poner un atributo'],
    ['getAttribute', 'method', 'leer un atributo'],
    ['closest', 'method', 'el de afuera que cumple el selector'],
    ['focus', 'method', 'poner el cursor ahí'],
    ['disabled', 'property', 'desactivado'],
    ['hidden', 'property', 'escondido'],
    ['checked', 'property', 'tildado'],
    // De un evento
    ['preventDefault', 'method', 'frenar lo que iba a hacer el navegador'],
    ['target', 'property', 'el elemento del evento'],
    ['key', 'property', 'la tecla que apretaron'],
    // Listas
    ['length', 'property', 'cuántos'],
    ['push', 'method', 'agregar al final'],
    ['pop', 'method', 'sacar el último'],
    ['map', 'method', 'una lista nueva, transformada'],
    ['filter', 'method', 'una lista nueva, con los que cumplen'],
    ['forEach', 'method', 'hacer algo con cada uno'],
    ['find', 'method', 'el primero que cumple'],
    ['includes', 'method', '¿está adentro?'],
    ['indexOf', 'method', 'en qué posición está'],
    ['join', 'method', 'unir en un texto'],
    ['slice', 'method', 'un pedazo'],
    ['sort', 'method', 'ordenar'],
    ['some', 'method', '¿alguno cumple?'],
    ['every', 'method', '¿todos cumplen?'],
    // Textos y números
    ['split', 'method', 'partir en una lista'],
    ['trim', 'method', 'sacar espacios de los bordes'],
    ['toUpperCase', 'method', 'todo en MAYÚSCULAS'],
    ['toLowerCase', 'method', 'todo en minúsculas'],
    ['replace', 'method', 'cambiar una parte'],
    ['startsWith', 'method', '¿empieza con…?'],
    ['endsWith', 'method', '¿termina con…?'],
    ['padStart', 'method', 'rellenar adelante'],
    ['toFixed', 'method', 'con tantos decimales'],
  ],
};

const OPCIONES_MIEMBROS: Record<string, Completion[]> = Object.fromEntries(
  Object.entries(MIEMBROS).map(([objeto, miembros]) => [
    objeto,
    miembros.map(([label, type, detail]) => opcion(label, type, detail, DOCS_JS[label])),
  ]),
);

// Adentro de un texto o un comentario no se sugiere nada.
const NO_COMPLETAR_JS = ['String', 'TemplateString', 'LineComment', 'BlockComment'];

function miembrosJs(context: CompletionContext): CompletionResult | null {
  const trozo = context.matchBefore(/([A-Za-z_$][\w$]*)?\.[A-Za-z_$]*$/);
  if (!trozo) return null;
  // `3.14` también tiene un punto y no es un miembro.
  const anterior = context.state.sliceDoc(Math.max(0, trozo.from - 1), trozo.from);
  if (/[0-9]/.test(anterior)) return null;
  const objeto = /^([A-Za-z_$][\w$]*)?\./.exec(trozo.text)?.[1] ?? '';
  const punto = trozo.from + trozo.text.indexOf('.');
  return {
    from: punto + 1,
    options: OPCIONES_MIEMBROS[objeto] ?? OPCIONES_MIEMBROS[''],
    validFor: /^[\w$]*$/,
  };
}

const sueltasJs = completeFromList([...GLOBALES_JS, ...PALABRAS_JS]);
const fuenteSueltasJs: CompletionSource = (context) =>
  (context.matchBefore(/\.[\w$]*$/) ? null : sueltasJs(context));

// =============================== Todo junto ===============================

const FUENTES: Record<Lang, CompletionSource[]> = {
  html: [fuenteHtml],
  css: [ifNotIn(['Comment', 'String'], fuenteCss)],
  js: [
    ifNotIn(NO_COMPLETAR_JS, miembrosJs),
    ifNotIn(NO_COMPLETAR_JS, fuenteSueltasJs),
    // Las variables y funciones que escribió el alumno (trae sus propias guardas).
    localCompletionSource,
  ],
};

/** El autocompletado de un editor web, como el de Python: ver editor-comun.ts. */
export function autocompletadoWeb(lang: Lang) {
  return [
    autocompletion({
      override: FUENTES[lang],
      closeOnBlur: true,
      maxRenderedOptions: 6,
      addToOptions: [{ render: flechaDoc, position: 90 }],
    }),
  ];
}
