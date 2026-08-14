/* Copiar de un toque el texto que el enunciado pide mostrar.
 *
 * Los tests comparan la salida CARACTER POR CARACTER, así que un acento o una
 * mayúscula de diferencia hacen fallar algo que "está bien". La salida ya avisa
 * qué difiere (ver _pista_texto en pyodide-worker.ts), pero lo más cómodo para
 * el alumno es no tener que tipearlo: toca el texto del enunciado y lo pega.
 *
 * Aplica al código EN LÍNEA de los enunciados. Los bloques de código grandes ya
 * traen el botón de copiar de Starlight, así que esos se saltean.
 *
 * Vanilla JS servido desde /public (se inyecta en <head> desde astro.config).
 */
(function () {
  // Dentro de un ejercicio, y solo en la consigna: no queremos convertir en
  // botón el código de la barra de símbolos ni el del editor.
  var SEL = [
    '.ejercicio__consigna code',
    '.quiz__pregunta code',
    '.encontrar__consigna code',
    '.ordenar .ejercicio__consigna code',
  ].join(', ');

  function esInterno(el) {
    // Los bloques ya tienen su propio botón de copiar; el editor no se toca.
    return el.closest('pre') || el.closest('.cm-editor') || el.closest('.expressive-code');
  }

  function avisar(el) {
    el.classList.add('is-copiado');
    setTimeout(function () {
      el.classList.remove('is-copiado');
    }, 1400);
  }

  function copiar(el) {
    var texto = el.textContent;
    if (!texto) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () {
        avisar(el);
      }, function () {
        seleccionar(el);
      });
    } else {
      seleccionar(el);
    }
  }

  // Plan B (sin permiso de portapapeles): al menos se lo dejamos seleccionado
  // para que copie con Ctrl+C sin tener que arrastrar el mouse con precisión.
  function seleccionar(el) {
    try {
      var rango = document.createRange();
      rango.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(rango);
    } catch (e) {
      /* nada: el alumno lo copia a mano */
    }
  }

  function marcar() {
    var nodos = document.querySelectorAll(SEL);
    Array.prototype.forEach.call(nodos, function (el) {
      if (el.dataset.copiable || esInterno(el)) return;
      el.dataset.copiable = '1';
      el.title = 'Clic para copiar';
    });
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-copiable]') : null;
    if (!el) return;
    // Si venía arrastrando para seleccionar, respetamos su selección.
    var sel = window.getSelection();
    if (sel && String(sel).length > 0 && !el.contains(sel.anchorNode)) return;
    copiar(el);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', marcar);
  } else {
    marcar();
  }
  document.addEventListener('astro:page-load', marcar);
})();
