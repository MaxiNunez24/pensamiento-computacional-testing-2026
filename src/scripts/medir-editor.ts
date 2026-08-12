import type { EditorView } from '@codemirror/view';

/**
 * Hace que CodeMirror mida el alto de línea cuando el editor está VISIBLE.
 *
 * El problema: CodeMirror solo puede medir la geometría real si el editor está
 * en pantalla. En una clase con 7 ejercicios, casi todos nacen fuera del
 * viewport, la medición no se puede hacer y el editor se queda con el valor por
 * defecto de CodeMirror: 14px, cuando la línea real mide ~18.4px.
 *
 * Ese número equivocado se usa para TODO el mapa de alturas, así que:
 *   - el alto de cada número del margen se escribe inline en 14px y el desfase
 *     con su línea se acumula (a las 10 líneas, casi 50px);
 *   - `posAtCoords` devuelve la línea equivocada: clickeás en la 6 y el cursor
 *     te cae en la 8.
 *
 * Medir al cargar la fuente (`document.fonts.ready`) no alcanza: para entonces
 * el editor sigue fuera de pantalla. Por eso también medimos en cuanto entra en
 * viewport, que es justo antes de que el alumno pueda tocarlo.
 */
export function medirCuandoSeaVisible(view: EditorView): void {
  let fuentesListas = !document.fonts || document.fonts.status === 'loaded';

  // Si la tipografía monoespaciada llega después, lo medido con la de respaldo
  // queda corrido: volvemos a medir cuando esté lista.
  document.fonts?.ready
    .then(() => {
      fuentesListas = true;
      view.requestMeasure();
    })
    .catch(() => {});

  if (typeof IntersectionObserver !== 'function') {
    view.requestMeasure();
    return;
  }

  const io = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    view.requestMeasure();
    // Con una medición buena alcanza; si las fuentes todavía no estaban listas
    // seguimos observando, porque esa medición pudo salir con la de respaldo.
    if (fuentesListas) io.disconnect();
  });
  io.observe(view.dom);
}
