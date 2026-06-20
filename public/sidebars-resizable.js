/* Sidebars redimensionables del curso.
 *
 * Cada alumno ajusta a gusto el ancho del nav izquierdo y del índice derecho
 * arrastrando una manija sobre su borde interno. Doble clic = ocultar/mostrar.
 * Flechas ←/→ (con la manija enfocada) = ajuste fino. Se recuerda por navegador.
 *
 * Vanilla JS servido desde /public (se inyecta en <head> desde astro.config).
 * Mueve dos variables CSS: --pc-left-w (la sigue --sl-sidebar-width) y
 * --pc-right-w (la sigue .right-sidebar-container). No toca el DOM de Starlight
 * salvo agregar las dos manijas al <body>.
 */
(function () {
  var root = document.documentElement;
  var LS = 'pc:sidebars';
  var MIN_L = 150,
    MAX_L = 520;
  var MIN_R = 150,
    MAX_R = 460;

  function px(v) {
    return v + 'px';
  }
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }
  function load() {
    try {
      return JSON.parse(localStorage.getItem(LS) || '{}') || {};
    } catch (e) {
      return {};
    }
  }
  function save() {
    try {
      localStorage.setItem(LS, JSON.stringify(state));
    } catch (e) {
      /* modo privado: sin persistencia, pero la sesión funciona igual */
    }
  }

  var state = load();

  // Aplicar lo guardado lo antes posible (evita "salto" visual).
  if (typeof state.left === 'number') root.style.setProperty('--pc-left-w', px(state.left));
  if (typeof state.right === 'number') root.style.setProperty('--pc-right-w', px(state.right));

  function paneEl() {
    return document.querySelector('.sidebar-pane');
  }
  function rightEl() {
    return document.querySelector('.right-sidebar-container');
  }
  function curLeft() {
    var p = paneEl();
    return p ? Math.round(p.getBoundingClientRect().width) : 256;
  }
  function curRight() {
    var r = rightEl();
    return r ? Math.round(r.getBoundingClientRect().width) : 352;
  }
  function setLeft(w) {
    root.style.setProperty('--pc-left-w', px(w));
  }
  function setRight(w) {
    root.style.setProperty('--pc-right-w', px(w));
  }

  function mkHandle(side) {
    var h = document.createElement('div');
    h.className = 'pc-resizer pc-resizer--' + side;
    h.setAttribute('role', 'separator');
    h.setAttribute('aria-orientation', 'vertical');
    h.tabIndex = 0;
    h.title = 'Arrastrá para ajustar el ancho · doble clic para ocultar/mostrar';
    document.body.appendChild(h);
    return h;
  }
  var hL = mkHandle('left');
  var hR = mkHandle('right');

  function headerBottom() {
    var hd = document.querySelector('header.header') || document.querySelector('.header');
    return hd ? Math.max(0, hd.getBoundingClientRect().bottom) : 0;
  }

  // Posiciona cada manija sobre el borde interno de su sidebar.
  function sync() {
    var top = headerBottom();
    var h = window.innerHeight - top;
    var p = paneEl();
    if (p) {
      var pr = p.getBoundingClientRect();
      hL.style.top = px(top);
      hL.style.height = px(h);
      hL.style.left = px(pr.right - 5);
    }
    var r = rightEl();
    if (r) {
      var rr = r.getBoundingClientRect();
      hR.style.top = px(top);
      hR.style.height = px(h);
      hR.style.left = px(rr.left - 5);
      hR.style.display = ''; // que mande la media query
    } else {
      // páginas sin índice derecho (ej. la home): no mostramos esa manija.
      hR.style.display = 'none';
    }
  }

  function startDrag(side, ev) {
    ev.preventDefault();
    var handle = side === 'left' ? hL : hR;
    handle.classList.add('is-drag');
    document.body.classList.add('pc-resizing');
    // Anclamos el borde "fijo" del sidebar al iniciar el arrastre.
    var anchor =
      side === 'left'
        ? paneEl().getBoundingClientRect().left
        : rightEl().getBoundingClientRect().right;

    function move(e) {
      if (side === 'left') setLeft(clamp(e.clientX - anchor, MIN_L, MAX_L));
      else setRight(clamp(anchor - e.clientX, MIN_R, MAX_R));
      sync();
    }
    function up() {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      handle.classList.remove('is-drag');
      document.body.classList.remove('pc-resizing');
      state.left = curLeft();
      state.right = curRight();
      save();
      sync();
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  // Doble clic: ocultar (ancho 0) o restaurar el último ancho.
  function toggle(side) {
    if (side === 'left') {
      if (curLeft() > 8) {
        state.leftPrev = curLeft();
        setLeft(0);
        state.left = 0;
      } else {
        var p = state.leftPrev || 256;
        setLeft(p);
        state.left = p;
      }
    } else {
      if (curRight() > 8) {
        state.rightPrev = curRight();
        setRight(0);
        state.right = 0;
      } else {
        var r = state.rightPrev || 352;
        setRight(r);
        state.right = r;
      }
    }
    save();
    sync();
  }

  // Teclado: ←/→ ajustan; Shift = paso grande.
  function key(side, e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    var step = (e.shiftKey ? 32 : 12) * (e.key === 'ArrowRight' ? 1 : -1);
    if (side === 'left') {
      state.left = clamp(curLeft() + step, MIN_L, MAX_L);
      setLeft(state.left);
    } else {
      // la manija derecha está en el borde IZQUIERDO del sidebar: → lo achica
      state.right = clamp(curRight() - step, MIN_R, MAX_R);
      setRight(state.right);
    }
    save();
    sync();
  }

  hL.addEventListener('pointerdown', function (e) {
    startDrag('left', e);
  });
  hR.addEventListener('pointerdown', function (e) {
    startDrag('right', e);
  });
  hL.addEventListener('dblclick', function () {
    toggle('left');
  });
  hR.addEventListener('dblclick', function () {
    toggle('right');
  });
  hL.addEventListener('keydown', function (e) {
    key('left', e);
  });
  hR.addEventListener('keydown', function (e) {
    key('right', e);
  });

  window.addEventListener('resize', sync);
  window.addEventListener('scroll', sync, { passive: true });
  if (document.readyState !== 'loading') sync();
  else document.addEventListener('DOMContentLoaded', sync);
  // Re-sincronizar tras asentarse el layout (fuentes, etc.).
  setTimeout(sync, 200);
  setTimeout(sync, 700);
})();
