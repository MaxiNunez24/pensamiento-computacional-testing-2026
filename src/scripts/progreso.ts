// Guardado de progreso del alumno en el navegador (localStorage). 100% estático.
// Clave estable por ejercicio = ruta de la página + título del ejercicio.

const NS = 'pcp';

function base(titulo: string): string {
  return `${location.pathname}::${titulo}`;
}
export function codeKey(titulo: string): string {
  return `${NS}:code:${base(titulo)}`;
}
function doneKey(titulo: string): string {
  return `${NS}:done:${base(titulo)}`;
}

export function estaHecho(titulo: string): boolean {
  try {
    return localStorage.getItem(doneKey(titulo)) === '1';
  } catch {
    return false;
  }
}
export function marcarHecho(titulo: string): void {
  try {
    localStorage.setItem(doneKey(titulo), '1');
  } catch {
    /* sin persistencia (modo privado): seguimos igual */
  }
  actualizarResumen();
}
export function guardarCodigo(titulo: string, code: string): void {
  try {
    localStorage.setItem(codeKey(titulo), code);
  } catch {
    /* nada */
  }
}
export function leerCodigo(titulo: string): string | null {
  try {
    return localStorage.getItem(codeKey(titulo));
  } catch {
    return null;
  }
}
export function borrarCodigo(titulo: string): void {
  try {
    localStorage.removeItem(codeKey(titulo));
  } catch {
    /* nada */
  }
}

// ---------- Insignia de eficiencia ----------
// Los ejercicios de lógica guardan, además del "hecho", la mejor marca lograda.
// Va con el mismo prefijo 'pcp:' que todo lo demás, así viaja en el sincronizado.

export interface MarcaEficiencia {
  pasos: number;
  nivel: string; // 'optimo' | 'bueno' | 'mejorable' | 'bruta'
  emoji: string;
}

export function leerEficiencia(titulo: string): MarcaEficiencia | null {
  try {
    const crudo = localStorage.getItem(`${NS}:efi:${base(titulo)}`);
    return crudo ? (JSON.parse(crudo) as MarcaEficiencia) : null;
  } catch {
    return null;
  }
}

// Solo pisa la marca anterior si esta es MEJOR (menos pasos). Así probar una
// idea peor no borra el récord que ya se había ganado.
export function guardarEficiencia(titulo: string, marca: MarcaEficiencia): boolean {
  const previa = leerEficiencia(titulo);
  if (previa && previa.pasos <= marca.pasos) return false;
  try {
    localStorage.setItem(`${NS}:efi:${base(titulo)}`, JSON.stringify(marca));
  } catch {
    /* nada */
  }
  return true;
}

// Marca/oculta el sello "✓ Resuelto" de un ejercicio.
export function pintarSello(el: HTMLElement, hecho: boolean): void {
  const sello = el.querySelector<HTMLElement>('.ej-hecho');
  if (sello) sello.hidden = !hecho;
  el.classList.toggle('ej-resuelto', hecho);
}

// Borra todo el progreso (código + hechos) de la página actual.
function borrarProgresoPagina(): void {
  try {
    const marca = `:${location.pathname}::`;
    const aBorrar: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS + ':') && k.includes(marca)) aBorrar.push(k);
    }
    aBorrar.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* nada */
  }
}

// Crea/actualiza la barra de progreso arriba del contenido.
export function actualizarResumen(): void {
  // .probador queda afuera: usa el CSS de .ejercicio pero no es algo que se
  // "resuelva", así que contarlo daría un 0/1 permanente.
  const ejercicios = document.querySelectorAll<HTMLElement>(
    '.ejercicio:not(.probador), .diagrama, .quiz, .ordenar',
  );
  if (ejercicios.length === 0) return;
  const total = ejercicios.length;
  let hechos = 0;
  ejercicios.forEach((el) => {
    if (el.dataset.titulo && estaHecho(el.dataset.titulo)) hechos++;
  });

  let banner = document.getElementById('pcp-resumen');
  if (!banner) {
    const cont = document.querySelector('.sl-markdown-content') || document.body;
    banner = document.createElement('div');
    banner.id = 'pcp-resumen';
    banner.className = 'pcp-resumen';
    cont.insertBefore(banner, cont.firstChild);
  }
  const pct = Math.round((hechos / total) * 100);
  const completo = hechos === total;
  banner.innerHTML = `
    <div class="pcp-resumen__txt">
      <span>${completo ? '🎉 ' : '📈 '}Tu progreso: <strong>${hechos}/${total}</strong> ejercicios</span>
      <button type="button" class="pcp-resumen__reset" title="Borra tu código y tus marcas de esta clase">↺ Borrar mi progreso</button>
    </div>
    <div class="pcp-barra"><div class="pcp-barra__fill" style="width:${pct}%"></div></div>`;
  banner
    .querySelector<HTMLButtonElement>('.pcp-resumen__reset')
    ?.addEventListener('click', () => {
      if (confirm('¿Borrar tu código y tus marcas de esta clase? No se puede deshacer.')) {
        borrarProgresoPagina();
        location.reload();
      }
    });
}
