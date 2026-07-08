/* Contador de "clases restantes" del cronograma.
 * Se calcula en el navegador según la fecha real de HOY, así se decrementa solo
 * cada vez que pasa un miércoles o un viernes (los días de clase). No cuenta la
 * clase del día actual (se asume ya dada).
 *
 * Para mantener: agregá los feriados / días sin clase que caigan en miércoles o
 * viernes a la lista FERIADOS (formato "AAAA-MM-DD"). El receso ya está contemplado.
 */
(function () {
  var FIN = '2026-12-18'; // última clase del año
  var RECESO_DESDE = '2026-07-22'; // receso invernal (inclusive)
  var RECESO_HASTA = '2026-08-01';
  var FERIADOS = [
    '2026-07-10', // feriado (viernes)
    // agregá acá otros feriados que caigan en miércoles o viernes...
  ];

  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function parse(s) {
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function ymd(d) {
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }

  function calcular() {
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var fin = parse(FIN);
    var rd = parse(RECESO_DESDE);
    var rh = parse(RECESO_HASTA);
    var count = 0;
    var proxima = null;
    var d = new Date(hoy);
    d.setDate(d.getDate() + 1); // desde mañana: la clase de hoy no cuenta
    while (d <= fin) {
      var dow = d.getDay(); // 3 = miércoles, 5 = viernes
      if (dow === 3 || dow === 5) {
        var enReceso = d >= rd && d <= rh;
        var esFeriado = FERIADOS.indexOf(ymd(d)) !== -1;
        if (!enReceso && !esFeriado) {
          count++;
          if (!proxima) proxima = new Date(d);
        }
      }
      d.setDate(d.getDate() + 1);
    }
    return { count: count, proxima: proxima };
  }

  function render() {
    var el = document.getElementById('clases-restantes');
    if (!el) return;
    var r = calcular();
    if (r.count === 0) {
      el.innerHTML =
        '<div class="clases-restantes"><span class="cr-num">🎓</span>' +
        '<div class="cr-txt"><strong>¡Curso terminado!</strong><br>' +
        '<small>No quedan clases en el calendario.</small></div></div>';
      return;
    }
    var p = r.proxima;
    var prox = p ? DIAS[p.getDay()] + ' ' + p.getDate() + '/' + (p.getMonth() + 1) : '—';
    el.innerHTML =
      '<div class="clases-restantes"><span class="cr-num">' +
      r.count +
      '</span><div class="cr-txt"><strong>clases restantes</strong> en el año 🗓️<br>' +
      '<small>Próxima clase: <strong>' +
      prox +
      '</strong> · se actualiza solo cada miércoles y viernes</small></div></div>';
  }

  if (document.readyState !== 'loading') render();
  else document.addEventListener('DOMContentLoaded', render);
})();
