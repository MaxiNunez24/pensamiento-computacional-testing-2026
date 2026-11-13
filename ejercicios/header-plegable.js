/* Esconder el encabezado para dar clase.
 *
 * Para qué: proyectando o compartiendo pantalla en una clase virtual, el
 * encabezado y la barra "En esta página" se comen unos 100px de alto que en
 * una pantalla chica —o con el zoom al 150% para que se lea de atrás— son
 * media consigna. El botón los pliega y los devuelve.
 *
 * Cómo: Starlight calcula TODO el layout a partir de dos variables
 * (--sl-nav-height y --sl-mobile-toc-height). Poniéndolas en cero y ocultando
 * las dos barras, los sidebars y el contenido suben solos. No hace falta tocar
 * ni una posición a mano, y si Starlight cambia su maquetado esto sigue andando.
 *
 * El estado se recuerda por navegador, y se aplica ANTES de pintar con un
 * script inline en el <head> (ver astro.config.mjs) para que no se vea el
 * encabezado aparecer y desaparecer al cargar.
 *
 * Vanilla JS servido desde /public, igual que sidebars-resizable.js.
 */
(function () {
  var LS = 'pc:header';
  var ATRIB = 'pcSinHeader'; // data-pc-sin-header
  var root = document.documentElement;

  function escondido() {
    return ATRIB in root.dataset;
  }

  function guardar(oculto) {
    try {
      localStorage.setItem(LS, oculto ? '0' : '1');
    } catch (e) {
      /* modo privado: la sesión funciona igual, no se recuerda */
    }
  }

  function pintarBoton(btn) {
    var oculto = escondido();
    btn.textContent = oculto ? '▼' : '▲';
    btn.setAttribute('aria-pressed', oculto ? 'true' : 'false');
    // El menú ☰ vive en el encabezado: con el encabezado plegado, en celular
    // este botón es el ÚNICO camino de vuelta. Conviene que lo diga.
    btn.setAttribute(
      'aria-label',
      oculto ? 'Mostrar el encabezado y el menú' : 'Esconder el encabezado para dar clase',
    );
    btn.title = oculto
      ? 'Mostrar el encabezado y el menú  (Shift + P)'
      : 'Esconder el encabezado para ganar pantalla  (Shift + P)';
  }

  function alternar(btn) {
    if (escondido()) delete root.dataset[ATRIB];
    else root.dataset[ATRIB] = '';
    guardar(escondido());
    pintarBoton(btn);
    // Starlight guarda posiciones calculadas al cargar (el índice que resalta
    // la sección visible). Al cambiar el alto del encabezado hay que avisarle.
    try {
      window.dispatchEvent(new Event('resize'));
    } catch (e) {
      /* nada */
    }
  }

  function tecleandoEnAlgo(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    var tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    // Los editores de código (CodeMirror) se comen las teclas: si el alumno
    // está escribiendo Python, un Shift+P es una P y nada más.
    return !!(el.closest && el.closest('.cm-editor'));
  }

  function arrancar() {
    if (document.querySelector('.pc-header-toggle')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pc-header-toggle';
    pintarBoton(btn);
    btn.addEventListener('click', function () {
      alternar(btn);
    });
    document.body.appendChild(btn);

    document.addEventListener('keydown', function (e) {
      if (!e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key !== 'P' && e.key !== 'p') return;
      if (tecleandoEnAlgo(document.activeElement)) return;
      e.preventDefault();
      alternar(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
