/* Sincronizar el avance entre dispositivos (la compu del CFP y la de casa).
 *
 * El avance de los ejercicios vive en el localStorage del navegador, así que no
 * viaja solo. Acá el alumno lo sube y lo baja con un CÓDIGO propio, contra el
 * Worker de worker/sync-progreso.js.
 *
 * A propósito las dos acciones se llaman `push` y `pull`, con los íconos de
 * VS Code: es el mismo modelo mental que Git, que están aprendiendo en paralelo.
 * Acá lo practican sin instalar nada, y cuando lo vean en VS Code ya les suena.
 *
 * Vanilla JS servido desde /public (se inyecta en <head> desde astro.config).
 * Mientras WORKER_SYNC esté vacío el botón no aparece: no rompe nada, solo no
 * está la función. Ver worker/README.md para los pasos.
 */
(function () {
  var WORKER_SYNC = 'https://sync.maxinunez434.workers.dev'; // ej: 'https://sync.TU-SUBDOMINIO.workers.dev'

  // Permite probar la interfaz sin Worker desplegado (solo en localhost).
  if (!WORKER_SYNC && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    WORKER_SYNC = window.PC_SYNC_URL || '';
  }
  if (!WORKER_SYNC) return;

  // Sin el "https://" adelante, fetch trata la URL como RELATIVA y pega contra
  // el propio sitio (…/ejercicios/clases/sync.tu-worker.dev), que da 404 y hace
  // parecer que el Worker está caído. Se agrega solo para que no dependa de
  // haberlo escrito completo.
  if (!/^https?:\/\//.test(WORKER_SYNC)) WORKER_SYNC = 'https://' + WORKER_SYNC;
  WORKER_SYNC = WORKER_SYNC.replace(/\/+$/, '');

  var PREFIJO = 'pcp:'; // todo lo que guarda progreso.ts
  var LS_CODIGO = 'pc_sync_codigo';
  var LS_NOMBRE = 'pc_alumno';

  // --- Íconos (los de VS Code para push/pull: nube con flecha) ---
  var ICONO_PUSH =
    '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" fill="currentColor">' +
    '<path d="M8 2.5 4.8 5.7l.7.7L7.5 4.4V11h1V4.4l2 1.9.7-.7L8 2.5Z"/>' +
    '<path d="M3.5 12.5h9v1h-9v-1Z"/></svg>';
  var ICONO_PULL =
    '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" fill="currentColor">' +
    '<path d="M8 11.5 11.2 8.3l-.7-.7L8.5 9.6V3h-1v6.6l-2-1.9-.7.7L8 11.5Z"/>' +
    '<path d="M3.5 12.5h9v1h-9v-1Z"/></svg>';

  function leerTodo() {
    var claves = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(PREFIJO) === 0) claves[k] = localStorage.getItem(k);
    }
    return claves;
  }

  function contarEjercicios(claves) {
    var n = 0;
    for (var k in claves) if (k.indexOf(PREFIJO + 'code:') === 0) n++;
    return n;
  }

  function slug(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 20);
  }

  function codigo() {
    var c = '';
    try {
      c = localStorage.getItem(LS_CODIGO) || '';
    } catch (e) {}
    if (c) return c;
    // Se genera una sola vez, con el nombre adelante para que el alumno lo
    // reconozca entre los suyos. El sufijo al azar evita que dos se pisen.
    var azar = Math.random().toString(36).slice(2, 6);
    c = (slug(localStorage.getItem(LS_NOMBRE)) || 'alumno') + '-' + azar;
    try {
      localStorage.setItem(LS_CODIGO, c);
    } catch (e) {}
    return c;
  }

  function guardarCodigo(c) {
    try {
      localStorage.setItem(LS_CODIGO, c);
    } catch (e) {}
  }

  // --- Interfaz ---
  var fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'pc-sync-fab';
  fab.title = 'Sincronizar tu avance con otro dispositivo';
  fab.innerHTML = '<span aria-hidden="true">🔄</span><span>Sincronizar</span>';

  var modal = document.createElement('div');
  modal.className = 'pc-sync-modal';
  modal.hidden = true;
  modal.innerHTML = [
    '<div class="pc-sync-panel" role="dialog" aria-modal="true" aria-labelledby="pc-sync-tit">',
    '  <button type="button" class="pc-sync-cerrar" aria-label="Cerrar">✕</button>',
    '  <h2 id="pc-sync-tit">🔄 Sincronizar progreso</h2>',
    '  <p class="pc-sync-intro">Tu avance se guarda en <strong>este</strong> navegador. Para seguir en otra',
    '     compu, subilo acá y bajalo allá. <em>Es la misma idea de Git que estamos viendo en clase.</em></p>',
    '  <label class="pc-sync-codigo-wrap">',
    '    <span>Tu código (anotalo, es el que va en la otra compu):</span>',
    '    <span class="pc-sync-codigo-row">',
    '      <input type="text" class="pc-sync-codigo" spellcheck="false" autocapitalize="none" />',
    '      <button type="button" class="pc-sync-copiar" title="Copiar">📋</button>',
    '    </span>',
    '  </label>',
    '  <div class="pc-sync-acciones">',
    '    <button type="button" class="pc-sync-btn pc-sync-push" data-accion="push">',
    ICONO_PUSH,
    '      <span class="pc-sync-cmd">git push</span>',
    '      <span class="pc-sync-desc">Subir mi avance</span>',
    '    </button>',
    '    <button type="button" class="pc-sync-btn pc-sync-pull" data-accion="pull">',
    ICONO_PULL,
    '      <span class="pc-sync-cmd">git pull</span>',
    '      <span class="pc-sync-desc">Traer mi avance</span>',
    '    </button>',
    '  </div>',
    '  <p class="pc-sync-estado" role="status" aria-live="polite"></p>',
    '  <p class="pc-sync-nota">Igual que en Git: <code>push</code> sube lo que hiciste acá y',
    '     <code>pull</code> trae lo que subiste antes. Si dudás, hacé <code>push</code> antes de irte.</p>',
    '</div>',
  ].join('\n');

  function estado(msg, tipo) {
    var p = modal.querySelector('.pc-sync-estado');
    p.textContent = msg;
    p.className = 'pc-sync-estado' + (tipo ? ' is-' + tipo : '');
  }

  function abrir() {
    modal.querySelector('.pc-sync-codigo').value = codigo();
    estado('');
    modal.hidden = false;
    modal.querySelector('.pc-sync-codigo').focus();
  }
  function cerrar() {
    modal.hidden = true;
    fab.focus();
  }

  async function push() {
    var c = slug(modal.querySelector('.pc-sync-codigo').value) || codigo();
    guardarCodigo(c);
    var claves = leerTodo();
    var n = contarEjercicios(claves);
    if (!n) {
      estado('Todavía no hay nada para subir: resolvé algún ejercicio primero.', 'error');
      return;
    }
    estado('Subiendo…');
    try {
      var r = await fetch(WORKER_SYNC + '?codigo=' + encodeURIComponent(c), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claves: claves, nombre: localStorage.getItem(LS_NOMBRE) || '' }),
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      estado('✅ Listo: subiste ' + n + ' ejercicio' + (n === 1 ? '' : 's') + '. En la otra compu usá el código ' + c + '.', 'ok');
    } catch (e) {
      estado('No se pudo subir. Fijate que tengas internet y volvé a intentar.', 'error');
    }
  }

  async function pull() {
    var c = slug(modal.querySelector('.pc-sync-codigo').value);
    if (!c) {
      estado('Escribí tu código primero.', 'error');
      return;
    }
    estado('Buscando…');
    try {
      var r = await fetch(WORKER_SYNC + '?codigo=' + encodeURIComponent(c));
      if (r.status === 404) {
        estado('Con ese código no hay nada guardado. ¿Lo escribiste igual que en la otra compu?', 'error');
        return;
      }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      var datos = await r.json();
      var claves = (datos && datos.claves) || {};
      var n = contarEjercicios(claves);
      if (!n) {
        estado('Lo guardado con ese código está vacío.', 'error');
        return;
      }
      // Se confirma porque pisa lo que haya en ESTE navegador con el mismo
      // nombre de ejercicio. Lo que solo esté acá no se toca.
      if (!confirm('Vas a traer ' + n + ' ejercicio(s).\n\nLo que tengas acá con el mismo nombre se reemplaza. ¿Seguimos?')) {
        estado('');
        return;
      }
      guardarCodigo(c);
      for (var k in claves) {
        if (k.indexOf(PREFIJO) === 0) localStorage.setItem(k, claves[k]);
      }
      if (datos.nombre) localStorage.setItem(LS_NOMBRE, datos.nombre);
      estado('✅ Listo: trajiste ' + n + ' ejercicio(s). Recargando…', 'ok');
      setTimeout(function () {
        location.reload();
      }, 900);
    } catch (e) {
      estado('No se pudo traer. Fijate que tengas internet y volvé a intentar.', 'error');
    }
  }

  function iniciar() {
    document.body.appendChild(fab);
    document.body.appendChild(modal);
    fab.addEventListener('click', abrir);
    modal.querySelector('.pc-sync-cerrar').addEventListener('click', cerrar);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) cerrar();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) cerrar();
    });
    modal.querySelector('.pc-sync-copiar').addEventListener('click', function () {
      var input = modal.querySelector('.pc-sync-codigo');
      input.select();
      navigator.clipboard && navigator.clipboard.writeText(input.value);
      estado('Código copiado.', 'ok');
    });
    modal.querySelector('[data-accion="push"]').addEventListener('click', push);
    modal.querySelector('[data-accion="pull"]').addEventListener('click', pull);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
