/* Índice de ejercicios en el sidebar derecho.
 *
 * El índice de Starlight ("En esta página") se arma con los encabezados del
 * markdown, y los títulos de los ejercicios viven DENTRO de un componente: no
 * están en el markdown, así que no aparecen. Resultado: para llegar al
 * ejercicio 5 de una clase hay que scrollear a ojo.
 *
 * Acá se agrega un bloque propio abajo del índice, con el ícono de dificultad
 * (🌱🌿🌶️🌳, el mismo del ejercicio) + el nombre, igual que en el sitio de
 * teoría. Marca con ✓ los que ya resolvió y resalta el que está mirando.
 *
 * Se apoya en que los cinco componentes de ejercicio renderizan
 * <section id="..." data-titulo="...">, así que no hace falta tocarlos.
 *
 * Vanilla JS servido desde /public (se inyecta en <head> desde astro.config).
 */
(function () {
  var SEL_EJ = '.sl-markdown-content section[id][data-titulo]';

  function icono(sec) {
    // Los quiz y los parciales no tienen dificultad: les damos su propio ícono.
    if (sec.classList.contains('quiz')) return '❓';
    if (sec.classList.contains('evaluacion')) return '📝';
    var dif = sec.querySelector('.ejercicio__dif');
    var txt = dif ? dif.textContent.trim() : '';
    return txt || '🧪';
  }

  function estaResuelto(sec) {
    var sello = sec.querySelector('.ej-hecho');
    return !!sello && !sello.hidden;
  }

  function construir() {
    var secciones = [].slice.call(document.querySelectorAll(SEL_EJ));
    if (!secciones.length) return; // páginas sin ejercicios: no molestamos

    // Un bloque por cada índice presente. Son DOS elementos distintos: el de
    // escritorio (<starlight-toc>) y el desplegable del celular
    // (<mobile-starlight-toc>), que además guarda su lista adentro de un
    // .dropdown — si colgáramos el bloque de la raíz, en el celular quedaría
    // suelto abajo del encabezado en vez de adentro del desplegable.
    var tocs = document.querySelectorAll('starlight-toc, mobile-starlight-toc');
    if (!tocs.length) return;

    var enlaces = [];

    Array.prototype.forEach.call(tocs, function (toc) {
      if (toc.querySelector('.idx-ej')) return; // ya construido

      var caja = document.createElement('div');
      caja.className = 'idx-ej';
      var titulo = document.createElement('h2');
      titulo.className = 'idx-ej__titulo';
      titulo.textContent = 'Ejercicios';
      caja.appendChild(titulo);

      var ul = document.createElement('ul');
      ul.className = 'idx-ej__lista';

      secciones.forEach(function (sec) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + sec.id;
        a.className = 'idx-ej__link';
        a.dataset.para = sec.id;

        var ico = document.createElement('span');
        ico.className = 'idx-ej__icono';
        ico.setAttribute('aria-hidden', 'true');
        ico.textContent = icono(sec);

        var nom = document.createElement('span');
        nom.className = 'idx-ej__nombre';
        nom.textContent = sec.dataset.titulo || 'Ejercicio';

        var ok = document.createElement('span');
        ok.className = 'idx-ej__ok';
        ok.textContent = '✓';
        ok.hidden = !estaResuelto(sec);

        a.appendChild(ico);
        a.appendChild(nom);
        a.appendChild(ok);
        li.appendChild(a);
        ul.appendChild(li);
        enlaces.push(a);
      });

      caja.appendChild(ul);
      (toc.querySelector('.dropdown') || toc).appendChild(caja);
    });

    // ---- Resaltar el que se está mirando ----
    // Se calcula con getBoundingClientRect en cada scroll (limitado a 10 veces
    // por segundo) en vez de con IntersectionObserver: son 7 rects, el costo es
    // nada, y así el cálculo es una función pura y verificable en vez de
    // depender de cuándo el navegador decide entregar las intersecciones.
    var ultimoActivo = null;

    function marcarActivo() {
      // Una LÍNEA de lectura, no una franja: el ejercicio activo es el que la
      // cruza. Con una franja, un ejercicio alto sigue tocándola cuando ya
      // estás mirando el siguiente, y el resaltado se queda atrás.
      var linea = window.innerHeight * 0.35;
      var activo = null;
      var i, r;
      for (i = 0; i < secciones.length; i++) {
        r = secciones[i].getBoundingClientRect();
        if (r.top <= linea && r.bottom >= linea) {
          activo = secciones[i].id;
          break;
        }
      }
      if (!activo) {
        // Ninguno la cruza (estamos en un hueco entre ejercicios): vale el
        // último que ya pasó. Si todavía no pasó ninguno, no se resalta nada.
        for (i = 0; i < secciones.length; i++) {
          if (secciones[i].getBoundingClientRect().bottom < linea) activo = secciones[i].id;
        }
      }
      // Solo seguimos al activo cuando CAMBIA: si lo hiciéramos en cada scroll,
      // el alumno no podría recorrer la lista a mano (se la estaríamos moviendo
      // de vuelta todo el tiempo).
      var cambio = activo !== ultimoActivo;
      ultimoActivo = activo;

      enlaces.forEach(function (a) {
        var esActivo = a.dataset.para === activo;
        a.classList.toggle('is-activo', esActivo);
        if (esActivo && cambio) seguirAlActivo(a);
      });
      return activo;
    }

    // El primer ancestro que scrollea de verdad. Hoy es el .sl-container del
    // índice derecho, pero no lo damos por sentado: el .right-sidebar también
    // declara overflow-y y en celular no scrollea ninguno de los dos.
    function contenedorQueScrollea(el) {
      var n = el.parentElement;
      while (n && n !== document.body) {
        var ov = getComputedStyle(n).overflowY;
        if ((ov === 'auto' || ov === 'scroll') && n.scrollHeight > n.clientHeight + 1) return n;
        n = n.parentElement;
      }
      return null;
    }

    // Que el ejercicio resaltado no quede fuera de la vista. Movemos SOLO ese
    // contenedor: nada de scrollIntoView, que también scrollea la página y le
    // sacaría al alumno el ejercicio de adelante de los ojos.
    function seguirAlActivo(a) {
      var caja = contenedorQueScrollea(a);
      if (!caja) return;
      // Con rects en vez de offsetTop: así no depende de cuál sea el ancestro
      // posicionado, que cambia según dónde termine viviendo el índice.
      var r = a.getBoundingClientRect();
      var rc = caja.getBoundingClientRect();
      if (r.top < rc.top) {
        caja.scrollTop -= rc.top - r.top;
      } else if (r.bottom > rc.bottom) {
        caja.scrollTop += r.bottom - rc.bottom;
      }
    }

    var ultimo = 0;
    var pendiente = null;
    function alScrollear() {
      var ahora = Date.now();
      if (ahora - ultimo > 100) {
        ultimo = ahora;
        marcarActivo();
      } else if (!pendiente) {
        // Que el último scroll también cuente, aunque caiga dentro del límite.
        pendiente = setTimeout(function () {
          pendiente = null;
          ultimo = Date.now();
          marcarActivo();
        }, 100);
      }
    }
    window.addEventListener('scroll', alScrollear, { passive: true });
    window.addEventListener('resize', alScrollear);
    marcarActivo();

    // ---- Mantener el ✓ al día cuando resuelve algo ----
    if (typeof MutationObserver === 'function') {
      secciones.forEach(function (sec) {
        var sello = sec.querySelector('.ej-hecho');
        if (!sello) return;
        new MutationObserver(function () {
          enlaces.forEach(function (a) {
            if (a.dataset.para !== sec.id) return;
            var ok = a.querySelector('.idx-ej__ok');
            if (ok) ok.hidden = !estaResuelto(sec);
          });
        }).observe(sello, { attributes: true, attributeFilter: ['hidden'] });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', construir);
  } else {
    construir();
  }
})();
