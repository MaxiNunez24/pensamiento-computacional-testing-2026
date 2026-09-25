/* Cliente del tablero y del foro de soluciones.
 *
 * Vanilla JS servido desde /public, igual que sync-progreso.js. Habla con el
 * Worker de worker/tablero.js.
 *
 * Se expone en `window.PC_TABLERO` para que las páginas del sitio lo usen sin
 * volver a escribir el fetch en cada una.
 */
(function () {
  var WORKER = 'https://sparkling-dust-2f2d.maxinunez434.workers.dev';
  var CLAVE = 'cfp401';

  // Identificador al azar de ESTE navegador. No es un nombre ni tiene relación
  // con nadie: sirve para dos cosas y nada más — que volver a publicar
  // reemplace tu solución en vez de duplicarla, y que no puedas votar diez
  // veces. Nunca sale del navegador salvo con estos dos usos.
  var LS_ID = 'pc_tablero_id';
  function miId() {
    var id = '';
    try {
      id = localStorage.getItem(LS_ID) || '';
    } catch (e) {}
    if (!id) {
      id = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
      try {
        localStorage.setItem(LS_ID, id);
      } catch (e) {}
    }
    return id;
  }

  async function pedir(ruta, opciones) {
    var r = await fetch(WORKER + ruta, opciones);
    var datos = await r.json().catch(function () { return {}; });
    if (!r.ok) {
      var e = new Error(datos.error || ('HTTP ' + r.status));
      e.status = r.status;
      e.datos = datos;
      throw e;
    }
    return datos;
  }

  var enviar = function (ruta, cuerpo) {
    cuerpo.clave = CLAVE;
    return pedir(ruta, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
  };

  window.PC_TABLERO = {
    miId: miId,

    // ---- tablero ----
    traerTablero: function () {
      return pedir('/tablero');
    },
    guardarTablero: function (tareas, version) {
      return enviar('/tablero', { tareas: tareas, version: version });
    },

    // ---- soluciones ----
    traerSoluciones: function (ejercicio) {
      return pedir('/soluciones?ejercicio=' + encodeURIComponent(ejercicio));
    },
    publicar: function (ejercicio, codigo) {
      return enviar('/soluciones?ejercicio=' + encodeURIComponent(ejercicio), {
        codigo: codigo,
        autor: miId(),
      });
    },
    votar: function (ejercicio, solucion) {
      return enviar('/voto?ejercicio=' + encodeURIComponent(ejercicio), {
        solucion: solucion,
        votante: miId(),
      });
    },
    elegir: function (ejercicio, solucion) {
      return enviar('/elegir?ejercicio=' + encodeURIComponent(ejercicio), { solucion: solucion });
    },
  };
})();
