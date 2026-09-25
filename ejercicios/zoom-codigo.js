/* Zoom del código: los botones A− / A+ de cada editor.
 *
 * Agrandan SOLO el código (el editor y el cuadro de resultados), no la página
 * entera. Nació para dar clase proyectando —desde el fondo del aula, 16px no se
 * leen— y sirve igual en el celular, para el que quiere ver más líneas de una.
 *
 * Es una preferencia GLOBAL y se recuerda: se toca una vez y queda así en todos
 * los ejercicios de todas las clases, hoy y mañana. Lo mismo que hacen la barra
 * de símbolos y el encabezado plegable.
 *
 * El tamaño vive en la variable CSS --pc-editor-font, que lee el theme de
 * CodeMirror (src/scripts/editor-comun.ts). Como está en rem, además acompaña
 * al zoom del navegador: Ctrl + agranda todo, y estos botones agrandan el
 * código un poco más.
 *
 * Vanilla JS servido desde /public (se inyecta en <head> desde astro.config).
 */
(function () {
  var PASOS = [0.85, 1, 1.15, 1.35, 1.6];
  var NORMAL = 1; // índice del 1rem, el de siempre
  var CLAVE = 'pc:zoom-codigo';

  // En pantallas chicas no se baja de 1rem: Safari en iOS hace zoom solo al
  // enfocar un campo con letra menor a 16px y deja la página corrida.
  function minimo() {
    return window.innerWidth < 768 ? NORMAL : 0;
  }

  var indice = NORMAL;
  try {
    var guardado = parseInt(localStorage.getItem(CLAVE), 10);
    if (!isNaN(guardado)) indice = Math.min(Math.max(guardado, 0), PASOS.length - 1);
  } catch (e) { /* sin localStorage: queda el tamaño de siempre */ }

  function aplicar() {
    var i = Math.max(indice, minimo());
    document.documentElement.style.setProperty('--pc-editor-font', PASOS[i] + 'rem');
    var atope = i >= PASOS.length - 1;
    var alfondo = i <= minimo();
    document.querySelectorAll('[data-zoom="mas"]').forEach(function (b) { b.disabled = atope; });
    document.querySelectorAll('[data-zoom="menos"]').forEach(function (b) { b.disabled = alfondo; });
  }

  function cambiar(paso) {
    indice = Math.min(Math.max(Math.max(indice, minimo()) + paso, minimo()), PASOS.length - 1);
    try { localStorage.setItem(CLAVE, String(indice)); } catch (e) { /* ídem */ }
    aplicar();
  }

  function boton(signo, texto, ayuda) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'zoom-codigo__btn';
    b.dataset.zoom = signo;
    b.textContent = texto;
    b.title = ayuda;
    b.setAttribute('aria-label', ayuda);
    b.addEventListener('click', function () { cambiar(signo === 'mas' ? 1 : -1); });
    return b;
  }

  function poner() {
    // Todos los contenedores de editor de la plataforma. Existen en el HTML
    // desde el principio, así que no hay que esperar a que CodeMirror monte.
    var cajas = document.querySelectorAll(
      '[data-editor], [data-editor-tests], [data-editor-completo], .evaluacion__editor'
    );
    Array.prototype.forEach.call(cajas, function (caja) {
      if (caja.querySelector('.zoom-codigo')) return; // ya puesto
      var grupo = document.createElement('div');
      grupo.className = 'zoom-codigo';
      grupo.appendChild(boton('menos', 'A−', 'Achicar el código'));
      grupo.appendChild(boton('mas', 'A+', 'Agrandar el código'));
      caja.appendChild(grupo);
    });
    aplicar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', poner);
  } else {
    poner();
  }
  // El editor del modo "arreglo completo" aparece recién al tocar un botón, y
  // la evaluación monta los suyos más tarde: revisamos de nuevo por las dudas.
  window.addEventListener('load', poner);
  window.addEventListener('resize', aplicar);
})();
