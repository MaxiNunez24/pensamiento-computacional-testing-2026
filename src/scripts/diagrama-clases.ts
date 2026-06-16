// Ejercicio interactivo de diagramas de clases: arrastrar/colocar clases en
// slots y tipos de flecha en conexiones, y verificar contra la solución.
// Soporta drag-and-drop (escritorio) y click-para-colocar (touch/teclado).

interface Solucion {
  claseEnSlot: Record<string, string>;
  flechaEnConexion: Record<string, string>;
}

function b64decode(s: string): string {
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function initDiagrama(el: HTMLElement): void {
  const solucion = JSON.parse(b64decode(el.dataset.solucion || '')) as Solucion;
  const salida = el.querySelector<HTMLElement>('[data-dg-salida]');

  // Ficha seleccionada por click (para el modo touch/teclado).
  let seleccion: { kind: 'clase' | 'flecha'; valor: string; label: string } | null = null;

  const chips = el.querySelectorAll<HTMLElement>('.dg-chip');
  const slots = el.querySelectorAll<HTMLElement>('.dg-slot');
  const conexiones = el.querySelectorAll<HTMLElement>('.dg-conexion');

  // --- Dibujo de las líneas (en px, sin distorsión) + marcador UML por tipo ---
  const SVGNS = 'http://www.w3.org/2000/svg';
  const board = el.querySelector<HTMLElement>('.diagrama__board');
  const svg = el.querySelector<SVGSVGElement>('.diagrama__svg');

  // Centro de un nodo relativo al tablero.
  const centro = (node: HTMLElement, br: DOMRect) => {
    const r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2 - br.left, y: r.top + r.height / 2 - br.top, w: r.width, h: r.height };
  };
  // Punto en el borde de la caja 'box' en dirección a (fromX, fromY): así la
  // flecha toca el borde y no queda tapada por la caja.
  const bordeHacia = (box: { x: number; y: number; w: number; h: number }, fromX: number, fromY: number) => {
    const dx = fromX - box.x;
    const dy = fromY - box.y;
    if (dx === 0 && dy === 0) return { x: box.x, y: box.y };
    const sx = dx !== 0 ? box.w / 2 / Math.abs(dx) : Infinity;
    const sy = dy !== 0 ? box.h / 2 / Math.abs(dy) : Infinity;
    const s = Math.min(sx, sy);
    return { x: box.x + dx * s, y: box.y + dy * s };
  };

  const redraw = () => {
    if (!board || !svg) return;
    const br = board.getBoundingClientRect();
    if (br.width < 5) return; // todavía no hay layout
    svg.setAttribute('viewBox', `0 0 ${br.width} ${br.height}`);
    conexiones.forEach((cz) => {
      const idc = cz.dataset.conexion || '';
      const sep = idc.indexOf('-');
      const de = idc.slice(0, sep);
      const a = idc.slice(sep + 1);
      const sde = el.querySelector<HTMLElement>(`.dg-slot[data-slot="${de}"]`);
      const sa = el.querySelector<HTMLElement>(`.dg-slot[data-slot="${a}"]`);
      if (!sde || !sa) return;
      const cde = centro(sde, br);
      const ca = centro(sa, br);
      const p1 = bordeHacia(cde, ca.x, ca.y); // borde del hijo
      const p2 = bordeHacia(ca, cde.x, cde.y); // borde de la madre (ahí va la flecha)
      let line = svg.querySelector<SVGLineElement>(`line[data-for="${idc}"]`);
      if (!line) {
        line = document.createElementNS(SVGNS, 'line');
        line.setAttribute('data-for', idc);
        svg.appendChild(line);
      }
      line.setAttribute('x1', String(p1.x));
      line.setAttribute('y1', String(p1.y));
      line.setAttribute('x2', String(p2.x));
      line.setAttribute('y2', String(p2.y));
      const tipo = cz.dataset.valor;
      if (tipo) line.setAttribute('marker-end', `url(#${el.id}-${tipo})`);
      else line.removeAttribute('marker-end');
    });
  };

  const chipInfo = (chip: HTMLElement) => {
    if (chip.dataset.clase) return { kind: 'clase' as const, valor: chip.dataset.clase, label: chip.dataset.clase };
    return { kind: 'flecha' as const, valor: chip.dataset.flecha || '', label: chip.dataset.label || '' };
  };

  const limpiarSeleccion = () => {
    chips.forEach((c) => c.classList.remove('is-sel'));
    seleccion = null;
  };

  // Coloca un valor en un target (slot o conexión), si el tipo es compatible.
  const colocar = (target: HTMLElement, kind: 'clase' | 'flecha', valor: string, label: string) => {
    const esSlot = target.classList.contains('dg-slot');
    if ((esSlot && kind !== 'clase') || (!esSlot && kind !== 'flecha')) return false;
    target.dataset.valor = valor;
    target.textContent = label;
    target.classList.add('dg-lleno');
    target.classList.remove('dg-ok', 'dg-mal');
    redraw(); // actualiza la flecha de la línea si fue una conexión
    return true;
  };

  // --- Chips: selección por click + arranque de drag ---
  chips.forEach((chip) => {
    const info = chipInfo(chip);
    chip.addEventListener('click', () => {
      const yaSel = chip.classList.contains('is-sel');
      limpiarSeleccion();
      if (!yaSel) {
        chip.classList.add('is-sel');
        seleccion = info;
      }
    });
    chip.addEventListener('dragstart', (e) => {
      e.dataTransfer?.setData('text/plain', JSON.stringify(info));
    });
  });

  // --- Targets: aceptar drop + click-para-colocar ---
  const cablearTarget = (target: HTMLElement) => {
    target.addEventListener('dragover', (e) => e.preventDefault());
    target.addEventListener('drop', (e) => {
      e.preventDefault();
      const raw = e.dataTransfer?.getData('text/plain');
      if (!raw) return;
      const info = JSON.parse(raw) as { kind: 'clase' | 'flecha'; valor: string; label: string };
      colocar(target, info.kind, info.valor, info.label);
    });
    target.addEventListener('click', () => {
      if (!seleccion) return;
      if (colocar(target, seleccion.kind, seleccion.valor, seleccion.label)) limpiarSeleccion();
    });
  };
  slots.forEach(cablearTarget);
  conexiones.forEach(cablearTarget);

  // --- Verificar ---
  const mostrar = (texto: string, estado: 'is-ok' | 'is-error') => {
    if (!salida) return;
    salida.hidden = false;
    salida.textContent = texto;
    salida.className = 'ejercicio__salida ' + estado;
  };

  el.querySelector<HTMLButtonElement>('[data-dg-verificar]')?.addEventListener('click', () => {
    let ok = 0;
    let total = 0;
    const revisar = (nodos: NodeListOf<HTMLElement>, dataKey: string, esperado: Record<string, string>) => {
      nodos.forEach((n) => {
        total++;
        const clave = n.dataset[dataKey] || '';
        const correcto = (n.dataset.valor || '') === esperado[clave];
        n.classList.toggle('dg-ok', correcto);
        n.classList.toggle('dg-mal', !correcto);
        if (correcto) ok++;
      });
    };
    revisar(slots, 'slot', solucion.claseEnSlot);
    revisar(conexiones, 'conexion', solucion.flechaEnConexion);

    if (ok === total) {
      mostrar('✅ ¡Diagrama correcto! Lo armaste perfecto. 🎉', 'is-ok');
    } else {
      mostrar(
        `Vas ${ok}/${total}. Lo verde está bien; revisá lo marcado en rojo y volvé a intentar.`,
        'is-error',
      );
    }
  });

  // --- Reiniciar ---
  el.querySelector<HTMLButtonElement>('[data-dg-reset]')?.addEventListener('click', () => {
    [...slots, ...conexiones].forEach((t) => {
      delete t.dataset.valor;
      t.classList.remove('dg-lleno', 'dg-ok', 'dg-mal');
      const ph = t.classList.contains('dg-slot') ? 'arrastrá una clase' : 'flecha';
      t.innerHTML = `<span class="dg-ph">${ph}</span>`;
    });
    limpiarSeleccion();
    if (salida) salida.hidden = true;
    redraw(); // saca las flechas de las líneas
  });

  // Dibujo inicial + redibujo ante cambios de tamaño (responsive).
  redraw();
  if (board && 'ResizeObserver' in window) new ResizeObserver(() => redraw()).observe(board);
  window.addEventListener('resize', redraw);
  // Las fuentes/HMR pueden cambiar el layout: redibujar un toque después.
  setTimeout(redraw, 300);
  if (document.fonts?.ready) document.fonts.ready.then(redraw).catch(() => {});
}

function bootDiagramas(): void {
  document.querySelectorAll<HTMLElement>('.diagrama').forEach((el) => {
    if (el.dataset.init) return;
    el.dataset.init = '1';
    initDiagrama(el);
  });
}

if (document.readyState !== 'loading') bootDiagramas();
else document.addEventListener('DOMContentLoaded', bootDiagramas);
document.addEventListener('astro:page-load', bootDiagramas);
