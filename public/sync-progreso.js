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
  var LS_ULTIMA = 'pc_sync_ultima'; // cuándo se guardó por última vez en la nube

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

  /* --- "última sincronización" ---------------------------------------------
   * Sirve para lo mismo que el "guardado hace 2 minutos" de cualquier editor:
   * que el alumno no tenga que confiar en que pasó algo. Y sobre todo, que si
   * un día algo falla, se vea ANTES de perder la clase entera y no después.
   */
  function marcarSincro() {
    try {
      localStorage.setItem(LS_ULTIMA, new Date().toISOString());
    } catch (e) {}
    pintarUltima();
  }

  function textoRelativo(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var min = Math.floor((Date.now() - d.getTime()) / 60000);
    if (min < 1) return 'recién';
    if (min < 60) return 'hace ' + min + ' min';
    var hora = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
    var hoy = new Date();
    var mismoDia = function (a, b) {
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    };
    if (mismoDia(d, hoy)) return 'hoy ' + hora;
    var ayer = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1);
    if (mismoDia(d, ayer)) return 'ayer ' + hora;
    return 'el ' + d.getDate() + '/' + (d.getMonth() + 1) + ' a las ' + hora;
  }

  function pintarUltima() {
    var iso = '';
    try {
      iso = localStorage.getItem(LS_ULTIMA) || '';
    } catch (e) {}
    var rel = iso ? textoRelativo(iso) : '';
    var titulo = rel
      ? 'Última sincronización: ' + rel
      : 'Sincronizar tu avance con otro dispositivo';

    for (var i = 0; i < botones.length; i++) {
      var span = botones[i].querySelector('.pc-sync-ultima');
      if (span) span.textContent = rel;
      botones[i].title = titulo;
      botones[i].classList.toggle('tiene-fecha', !!rel);
    }
    var linea = modal.querySelector('.pc-sync-ultima-linea');
    if (linea) {
      linea.textContent = rel
        ? '☁️ Última vez guardado en la nube: ' + rel + '.'
        : '☁️ Todavía no guardaste nada en la nube desde este navegador.';
      linea.classList.toggle('is-vacia', !rel);
    }
  }

  // --- Interfaz ---
  // El botón va en el encabezado, al lado del selector de tema. Antes flotaba
  // abajo a la derecha y tapaba el último ejercicio de cada clase.
  //
  // Starlight duplica sus propios controles: .right-group para escritorio y
  // .mobile-preferences (adentro del menú) para el celular, y muestra uno u
  // otro por CSS. Hacemos lo mismo, así el botón está siempre a mano sin
  // pelear con su diseño responsive.
  function crearBoton() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pc-sync-btn-header';
    b.title = 'Sincronizar tu avance con otro dispositivo';
    b.innerHTML =
      '<span aria-hidden="true">🔄</span>' +
      '<span class="pc-sync-btn-texto">Sincronizar</span>' +
      '<span class="pc-sync-ultima"></span>';
    b.addEventListener('click', abrir);
    return b;
  }

  var botones = [];

  var modal = document.createElement('div');
  modal.className = 'pc-sync-modal';
  modal.hidden = true;
  modal.innerHTML = [
    // tabindex="-1" para poder enfocar el diálogo sin meterlo en el orden de tabulación.
    '<div class="pc-sync-panel" role="dialog" aria-modal="true" aria-labelledby="pc-sync-tit" tabindex="-1">',
    '  <button type="button" class="pc-sync-cerrar" aria-label="Cerrar">✕</button>',
    '  <h2 id="pc-sync-tit">🔄 Sincronizar progreso</h2>',
    '  <p class="pc-sync-intro">Tu avance se guarda en <strong>este</strong> navegador. Para seguir en otra',
    '     compu, subilo acá y bajalo allá. <em>Es la misma idea de Git que estamos viendo en clase.</em></p>',
    '  <p class="pc-sync-ultima-linea"></p>',
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
    '     <code>pull</code> trae lo que subiste antes. Subir <strong>nunca borra</strong> lo que',
    '     ya tenías guardado: se suma.</p>',
    '  <details class="pc-sync-extra">',
    '    <summary>Copia de seguridad en un archivo</summary>',
    '    <p>Por si algún día se borran los datos del navegador. El archivo es tuyo y no',
    '       depende de internet.</p>',
    '    <div class="pc-sync-extra-btns">',
    '      <button type="button" class="pc-sync-mini" data-accion="descargar">⬇ Descargar copia</button>',
    '      <button type="button" class="pc-sync-mini" data-accion="restaurar">⬆ Restaurar de un archivo</button>',
    '    </div>',
    '    <input type="file" class="pc-sync-archivo" accept="application/json,.json" hidden />',
    '  </details>',
    '</div>',
  ].join('\n');

  function estado(msg, tipo) {
    var p = modal.querySelector('.pc-sync-estado');
    p.textContent = msg;
    p.className = 'pc-sync-estado' + (tipo ? ' is-' + tipo : '');
  }

  function abrir() {
    modal.querySelector('.pc-sync-codigo').value = codigo();
    pintarUltima();
    estado('');
    modal.hidden = false;
    // El foco va al diálogo, NO al campo del código: enfocar un input abre el
    // teclado del celular de entrada, y el código casi nunca se toca (se genera
    // solo y solo se escribe la primera vez en el otro dispositivo).
    modal.querySelector('.pc-sync-panel').focus();
  }
  function cerrar() {
    modal.hidden = true;
    // Devolvemos el foco al botón que se ve (hay uno por breakpoint: el otro
    // está oculto, y enfocar algo invisible deja al teclado sin referencia).
    for (var i = 0; i < botones.length; i++) {
      if (botones[i].offsetParent !== null) {
        botones[i].focus();
        return;
      }
    }
  }

  async function subir(c) {
    var claves = leerTodo();
    var r = await fetch(WORKER_SYNC + '?codigo=' + encodeURIComponent(c), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claves: claves, nombre: localStorage.getItem(LS_NOMBRE) || '' }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    marcarSincro(); // solo si el Worker contestó que sí: la fecha no puede mentir
    return r.json().catch(function () { return {}; });
  }

  // Lee lo que hay guardado en la nube sin tocar nada de acá. Devuelve null si
  // no hay nada o si no se pudo consultar (sin internet): en ese caso no se
  // bloquea la subida, solo se pierde el aviso.
  async function claveEnLaNube(c) {
    try {
      var r = await fetch(WORKER_SYNC + '?codigo=' + encodeURIComponent(c));
      if (!r.ok) return null;
      var d = await r.json();
      return (d && d.claves) || null;
    } catch (e) {
      return null;
    }
  }

  async function push() {
    var c = slug(modal.querySelector('.pc-sync-codigo').value) || codigo();
    guardarCodigo(c);
    var n = contarEjercicios(leerTodo());
    if (!n) {
      estado('Todavía no hay nada para subir: resolvé algún ejercicio primero.', 'error');
      return;
    }

    // Aviso de "estás subiendo menos de lo que tenías".
    //
    // Desde que el Worker fusiona, subir de menos ya no borra nada. Pero el
    // aviso sigue valiendo, y no por los datos: si en este navegador hay 3
    // ejercicios y en la nube 49, lo que pasa es que el alumno está en una
    // compu que no es la suya, o que se le limpió el navegador. Lo que quiere
    // hacer ahí es un pull, no un push.
    estado('Revisando lo que ya tenías guardado…');
    var nube = await claveEnLaNube(c);
    var nNube = nube ? contarEjercicios(nube) : 0;
    if (nNube > n) {
      var msg =
        'Ojo: en este navegador hay ' + n + ' ejercicio(s) y con tu código hay ' + nNube + ' guardados.\n\n' +
        'Subir NO borra nada (se suman los dos lados), pero esto suele significar que estás en otra ' +
        'compu o que se limpió el navegador. En ese caso conviene primero "Traer mi avance".\n\n' +
        '¿Subir igual?';
      if (!confirm(msg)) {
        estado('No se subió nada. Probá con "Traer mi avance" (pull) y fijate si vuelve todo.', 'error');
        return;
      }
    }

    estado('Subiendo…');
    try {
      var res = await subir(c);
      var total = (res && res.total) || n;
      estado('✅ Listo: subiste ' + n + ' ejercicio' + (n === 1 ? '' : 's') +
             '. Con tu código quedan ' + total + ' guardados en total. En la otra compu usá ' + c + '.', 'ok');
    } catch (e) {
      estado('No se pudo subir. Fijate que tengas internet y volvé a intentar.', 'error');
    }
  }

  /* --- Subida automática ---------------------------------------------------
   * El avance vive en el navegador, y un navegador se limpia: basta con
   * "borrar datos de navegación" para que desaparezcan meses de trabajo. Que
   * la copia de la nube dependa de acordarse de apretar un botón es pedir
   * demasiado. Cada vez que se resuelve un ejercicio se sube solo, con unos
   * segundos de espera para no mandar uno por tecla.
   *
   * Es seguro porque el Worker fusiona: subir de más nunca resta.
   * Si falla (sin internet), no se avisa: el botón manual sigue estando.
   */
  var reloj = null;
  var pendiente = false;
  function subirSolo() {
    clearTimeout(reloj);
    pendiente = true;
    reloj = setTimeout(function () {
      pendiente = false;
      if (!contarEjercicios(leerTodo())) return;
      subir(codigo()).catch(function () { /* se reintenta al próximo ejercicio */ });
    }, 4000);
  }

  /* --- Copia en archivo ----------------------------------------------------
   * Independiente del Worker y de internet. Es la única copia que sigue
   * existiendo si un día se cae todo lo demás.
   */
  function descargar() {
    var datos = { claves: leerTodo(), nombre: localStorage.getItem(LS_NOMBRE) || '', fecha: new Date().toISOString() };
    var n = contarEjercicios(datos.claves);
    var hoy = new Date();
    var f = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0') + '-' + String(hoy.getDate()).padStart(2, '0');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(datos)], { type: 'application/json' }));
    a.download = 'mi-progreso-' + (codigo() || 'alumno') + '-' + f + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    estado('Copia descargada: ' + n + ' ejercicio(s). Guardala en un lugar seguro.', 'ok');
  }

  function restaurar(archivo) {
    var lector = new FileReader();
    lector.onload = function () {
      var datos;
      try {
        datos = JSON.parse(String(lector.result));
      } catch (e) {
        estado('Ese archivo no es una copia válida.', 'error');
        return;
      }
      var claves = (datos && datos.claves) || {};
      var n = contarEjercicios(claves);
      if (!n) {
        estado('Ese archivo no tiene ejercicios adentro.', 'error');
        return;
      }
      if (!confirm('Vas a restaurar ' + n + ' ejercicio(s).\n\nLo que tengas acá con el mismo nombre se reemplaza; lo demás se conserva. ¿Seguimos?')) return;
      for (var k in claves) {
        if (k.indexOf(PREFIJO) === 0) localStorage.setItem(k, claves[k]);
      }
      if (datos.nombre) localStorage.setItem(LS_NOMBRE, datos.nombre);
      estado('✅ Restaurados ' + n + ' ejercicio(s). Recargando…', 'ok');
      setTimeout(function () { location.reload(); }, 900);
    };
    lector.readAsText(archivo);
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
      // nombre de ejercicio. El riesgo real es ese: un ejercicio que acá está
      // más avanzado que en la nube (se mejoró y no se subió) queda pisado por
      // la versión vieja. Por eso se cuenta y se dice cuántos son.
      var aca = leerTodo();
      var pisados = 0, soloAca = 0;
      for (var kl in aca) {
        if (kl.indexOf(PREFIJO + 'code:') !== 0) continue;
        if (kl in claves) { if (aca[kl] !== claves[kl]) pisados++; }
        else soloAca++;
      }
      var aviso = 'Vas a traer ' + n + ' ejercicio(s).\n\n';
      if (pisados) {
        aviso += pisados === 1
          ? '⚠️ 1 de ellos lo tenés acá con OTRO contenido y se va a reemplazar por la versión guardada. ' +
            'Si acá lo tenías más avanzado, subí primero (push).\n\n'
          : '⚠️ ' + pisados + ' de ellos los tenés acá con OTRO contenido y se van a reemplazar por la ' +
            'versión guardada. Si acá los tenías más avanzados, subí primero (push).\n\n';
      }
      if (soloAca) {
        aviso += soloAca === 1
          ? 'El que solo está acá no se toca.\n\n'
          : 'Los ' + soloAca + ' que solo están acá no se tocan.\n\n';
      }
      if (!confirm(aviso + '¿Seguimos?')) {
        estado('');
        return;
      }
      guardarCodigo(c);
      for (var k in claves) {
        if (k.indexOf(PREFIJO) === 0) localStorage.setItem(k, claves[k]);
      }
      if (datos.nombre) localStorage.setItem(LS_NOMBRE, datos.nombre);
      marcarSincro();
      estado('✅ Listo: trajiste ' + n + ' ejercicio(s). Recargando…', 'ok');
      setTimeout(function () {
        location.reload();
      }, 900);
    } catch (e) {
      estado('No se pudo traer. Fijate que tengas internet y volvé a intentar.', 'error');
    }
  }

  function iniciar() {
    // En ESCRITORIO va en el encabezado, antes del selector de tema: ahí hay un
    // hueco libre y deja de tapar el último ejercicio.
    var derecha = document.querySelector('.right-group');
    if (derecha) {
      var bh = crearBoton();
      derecha.insertBefore(bh, derecha.querySelector('starlight-theme-select'));
      botones.push(bh);
    }

    // En CELULAR sigue flotando. El otro lugar posible sería .mobile-preferences,
    // pero eso vive adentro del menú hamburguesa: serían dos toques y scroll
    // para algo que se usa al llegar y al irse de cada clase.
    var bf = crearBoton();
    bf.className += ' pc-sync-flotante';
    document.body.appendChild(bf);
    botones.push(bf);

    // Se muestra uno solo: el flotante aparece únicamente cuando el del
    // encabezado NO se ve. Se decide mirando el DOM en vez de repetir el
    // breakpoint de Starlight en una media query nuestra, que quedaría
    // desincronizada el día que ellos lo cambien.
    function ajustarBotones() {
      if (!derecha) return; // sin encabezado donde anclar: siempre el flotante
      bf.style.display = bh.offsetParent !== null ? 'none' : '';
    }
    ajustarBotones();
    window.addEventListener('resize', ajustarBotones);

    document.body.appendChild(modal);
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

    var archivo = modal.querySelector('.pc-sync-archivo');
    modal.querySelector('[data-accion="descargar"]').addEventListener('click', descargar);
    modal.querySelector('[data-accion="restaurar"]').addEventListener('click', function () {
      archivo.click();
    });
    archivo.addEventListener('change', function () {
      if (archivo.files && archivo.files[0]) restaurar(archivo.files[0]);
      archivo.value = ''; // permite volver a elegir el mismo archivo
    });

    // progreso.ts avisa por acá cada vez que se marca un ejercicio resuelto.
    document.addEventListener('pcp:progreso', subirSolo);
    // Y por acá cuando solo se editó código: no se sube en el momento (sería
    // una subida por tecla), pero queda anotado para el envío del cierre.
    document.addEventListener('pcp:cambio', function () { pendiente = true; });

    // "hace 3 min" envejece solo: se repinta cada minuto y al volver a la
    // pestaña, porque si no queda congelado en la hora en que se cargó.
    pintarUltima();
    setInterval(pintarUltima, 60000);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) pintarUltima();
    });
    // Y al cerrar la pestaña, por si el alumno resolvió algo y cerró antes de
    // que venciera la espera. `fetch` no sirve acá: la página se está yendo y
    // el pedido se cancela. sendBeacon lo entrega igual.
    window.addEventListener('pagehide', function () {
      if (!pendiente) return;
      clearTimeout(reloj);
      pendiente = false;
      try {
        // text/plain a propósito: con application/json el navegador exige un
        // preflight, y un beacon no puede hacerlo — el envío se descartaría en
        // silencio. El Worker lee el cuerpo como texto, así que le da igual.
        navigator.sendBeacon &&
          navigator.sendBeacon(
            WORKER_SYNC + '?codigo=' + encodeURIComponent(codigo()),
            new Blob([JSON.stringify({ claves: leerTodo(), nombre: localStorage.getItem(LS_NOMBRE) || '' })],
                     { type: 'text/plain' }),
          );
      } catch (e) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
