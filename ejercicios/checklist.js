/* Listas de tareas que se pueden tildar de verdad.
 *
 * Markdown escribe `- [ ] tarea` y GFM lo renderiza como un checkbox
 * DESHABILITADO: es una casilla de solo lectura, decorativa. Para un apunte
 * está bien, pero la lista de "antes de que entre nadie" existe justamente
 * para ir tildándola mientras se prepara la sala.
 *
 * Esto las habilita y guarda lo tildado en el navegador, por página. Cerrar y
 * volver no borra el progreso — que es lo que uno espera de una lista así.
 *
 * Se guarda por TEXTO de la tarea y no por posición: si mañana se agrega un
 * ítem en el medio, lo tildado sigue correspondiendo a lo mismo.
 */
(function () {
  var LS = 'pc:checklist:' + location.pathname;

  function leer() {
    try {
      return JSON.parse(localStorage.getItem(LS) || '{}');
    } catch (e) {
      return {};
    }
  }

  function guardar(estado) {
    try {
      localStorage.setItem(LS, JSON.stringify(estado));
    } catch (e) {
      /* sin localStorage se pierde al cerrar, y no hay nada que hacer */
    }
  }

  function arrancar() {
    var cajas = document.querySelectorAll(
      '.sl-markdown-content li > input[type="checkbox"]'
    );
    if (!cajas.length) return;

    var estado = leer();

    Array.prototype.forEach.call(cajas, function (caja) {
      var li = caja.closest('li');
      if (!li) return;
      var clave = (li.textContent || '').trim().slice(0, 120);

      caja.disabled = false;
      caja.style.cursor = 'pointer';
      if (estado[clave]) {
        caja.checked = true;
        li.classList.add('es-hecho');
      }

      caja.addEventListener('change', function () {
        estado[clave] = caja.checked;
        if (!caja.checked) delete estado[clave];
        guardar(estado);
        li.classList.toggle('es-hecho', caja.checked);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }
})();
