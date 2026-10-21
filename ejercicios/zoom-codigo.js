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

  function cambiar(paso, boton) {
    // El tamaño cambia en TODOS los editores de la página, también en los que
    // están más arriba. Como cada uno crece o se achica, lo que estabas mirando
    // se corre solo: medido, 100px al agrandar y 181px al achicar dos veces.
    //
    // Por eso se anota dónde estaba el botón que se tocó, y después de aplicar
    // se corrige el scroll la misma distancia. Resultado: el editor en el que
    // estás trabajando no se mueve de la pantalla, y el resto se acomoda
    // alrededor.
    var antes = boton ? boton.getBoundingClientRect().top : null;
    indice = Math.min(Math.max(Math.max(indice, minimo()) + paso, minimo()), PASOS.length - 1);
    try { localStorage.setItem(CLAVE, String(indice)); } catch (e) { /* ídem */ }
    aplicar();
    if (antes !== null) {
      // Leer el rect fuerza a que el navegador ya haya recalculado el layout.
      var despues = boton.getBoundingClientRect().top;
      if (despues !== antes) window.scrollBy(0, despues - antes);
    }
  }

  function boton(signo, texto, ayuda) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'zoom-codigo__btn';
    b.dataset.zoom = signo;
    b.textContent = texto;
    b.title = ayuda;
    b.setAttribute('aria-label', ayuda);
    b.addEventListener('click', function () { cambiar(signo === 'mas' ? 1 : -1, b); });
    return b;
  }

  /* ── ⤢ El editor del tamaño del código ─────────────────────────────────
   *
   * Los alumnos usan mucho la barra de scroll de la página, y con el tope de
   * alto del editor (22rem) la rueda del mouse arriba de un editor largo
   * scrollea el CÓDIGO y no la página: parece que la página se trabó.
   *
   * Ajustado (de fábrica): el editor mide lo que mide el código, sin scroll
   * adentro, y la rueda siempre mueve la página. Sin ajustar: como antes, con
   * tope, scroll interno y la manija para estirarlo.
   *
   * Es una clase en <html> y no un estilo por editor: así vale para todos, y
   * para los que se arman después. La regla está en custom.css
   * (html.pc-editor-ajustado), y editor-comun.ts la mira para no pelearse con
   * la manija.
   */
  var CLAVE_AJUSTE = 'pc:editor-ajustado';
  var ajustado = true;
  try { ajustado = localStorage.getItem(CLAVE_AJUSTE) !== 'no'; } catch (e) { /* queda ajustado */ }

  function aplicarAjuste() {
    document.documentElement.classList.toggle('pc-editor-ajustado', ajustado);
    var ayuda = ajustado
      ? 'El editor mide lo que mide el código. Tocá para ponerle tope y scroll adentro'
      : 'El editor tiene tope y scroll adentro. Tocá para que mida lo que mide el código';
    document.querySelectorAll('[data-zoom="ajustar"]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(ajustado));
      b.title = ayuda;
      b.setAttribute('aria-label', ayuda);
    });
  }
  // Ya mismo, antes de que CodeMirror arme los editores: así nacen con el
  // tamaño que van a tener y no pegan un salto al cargar.
  aplicarAjuste();

  function botonAjustar() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'zoom-codigo__btn zoom-codigo__btn--ajustar';
    b.dataset.zoom = 'ajustar';
    b.textContent = '⤢';
    b.addEventListener('click', function () {
      // Mismo truco que el zoom: todos los editores de arriba cambian de alto,
      // así que se corrige el scroll para que este no se escape de la pantalla.
      var antes = b.getBoundingClientRect().top;
      ajustado = !ajustado;
      try { localStorage.setItem(CLAVE_AJUSTE, ajustado ? 'si' : 'no'); } catch (e) { /* ídem */ }
      aplicarAjuste();
      var despues = b.getBoundingClientRect().top;
      if (despues !== antes) window.scrollBy(0, despues - antes);
    });
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
      // El ⤢ va PRIMERO, a la altura del A−: como tercer escalón bajaba hasta
      // el primer renglón del código y en el celular lo tapaba.
      grupo.appendChild(botonAjustar());
      grupo.appendChild(boton('menos', 'A−', 'Achicar el código'));
      grupo.appendChild(boton('mas', 'A+', 'Agrandar el código'));
      caja.appendChild(grupo);
    });
    aplicar();
    aplicarAjuste();
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
