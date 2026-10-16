// Los links y los formularios adentro de las vistas (EjercicioWeb y la página
// que arma Python en EjercicioPython).
//
// La vista es un <iframe srcdoc>, y una página srcdoc toma como dirección la de
// la página que la contiene. Entonces <a href="#contacto"> no lleva a #contacto
// de la vista: lleva a ".../css-flex-grid/#contacto", y el marco cargaba el
// CURSO ENTERO adentro de la vista (lo vio Maxi, 16/10). Lo mismo un formulario
// que se envía sin action. Acá se decide qué hacer en cambio:
//   - "#algo" que existe: se baja hasta ahí, adentro de la vista;
//   - "#algo" que NO existe: se avisa, que es un error que vale la pena ver;
//   - cualquier otro link: no se sale de la página, y se avisa adónde iba.

/** El aviso para la barra de la vista, o null si no hay nada que decir. */
export function mensajeDeLink(href: string, existe: boolean): string | null {
  if (href === '#' || href === '') return null;
  if (href.startsWith('#')) {
    const id = href.slice(1);
    return existe ? null : `🔗 El link va a "#${id}", pero no hay ningún elemento con id="${id}"`;
  }
  return `🔗 Ese link lleva a ${href}: en la vista previa los links no salen de la página`;
}

/** Muestra un aviso un rato en la barra de la vista, y vuelve a lo que decía.
 *  Sin texto (un link que anduvo bien), saca enseguida el aviso anterior. */
export function avisarEnVista(nota: HTMLElement | null, texto: string | null) {
  if (!nota) return;
  nota.dataset.original ??= nota.textContent ?? '';
  const volver = () => {
    nota.textContent = nota.dataset.original ?? '';
    nota.classList.remove('es-aviso');
  };
  clearTimeout(Number(nota.dataset.timer));
  if (!texto) { volver(); return; }
  nota.textContent = texto;
  nota.classList.add('es-aviso');
  nota.dataset.timer = String(setTimeout(volver, 5000));
}

/** Para una vista sin JavaScript propio (la de Python): se atajan los clics
 *  desde afuera, que se puede porque el marco es del mismo origen. */
export function atajarLinks(doc: Document, avisar: (texto: string | null) => void) {
  doc.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]');
    if (!a) return;
    e.preventDefault();
    const href = (a.getAttribute('href') || '').trim();
    const destino = href.startsWith('#') && href.length > 1 ? doc.getElementById(decodeURIComponent(href.slice(1))) : null;
    if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (href === '#') doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
    avisar(mensajeDeLink(href, !!destino));
  });
}
