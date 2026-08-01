// Diagrama de clases de lienzo libre: mover clases (pointer), dibujar flechas
// (elegir tipo → clic origen → clic destino) y validar por estructura.

import { estaHecho, marcarHecho, pintarSello, actualizarResumen } from './progreso';

interface Relacion {
  de: string;
  a: string;
  tipo: string;
}

function b64decode(s: string): string {
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const SVGNS = 'http://www.w3.org/2000/svg';

function initLibre(el: HTMLElement): void {
  const titulo = el.dataset.titulo || '';
  const sol = JSON.parse(b64decode(el.dataset.solucion || '')) as { relaciones: Relacion[] };
  pintarSello(el, estaHecho(titulo));

  const board = el.querySelector<HTMLElement>('[data-board]');
  const svg = el.querySelector<SVGSVGElement>('.diagrama__svg');
  const capaBorr = el.querySelector<HTMLElement>('[data-borradores]');
  const salida = el.querySelector<HTMLElement>('[data-dl-salida]');
  const ayuda = el.querySelector<HTMLElement>('[data-ayuda]');
  if (!board || !svg || !capaBorr) return;

  const clases = el.querySelectorAll<HTMLElement>('.dl-clase');
  const relaciones: Relacion[] = [];

  let tipoActivo = '';
  let origen = ''; // clase de origen mientras se conecta

  // ---- geometría ----
  const centro = (node: HTMLElement, br: DOMRect) => {
    const r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2 - br.left, y: r.top + r.height / 2 - br.top, w: r.width, h: r.height };
  };
  const bordeHacia = (box: { x: number; y: number; w: number; h: number }, fx: number, fy: number) => {
    const dx = fx - box.x;
    const dy = fy - box.y;
    if (dx === 0 && dy === 0) return { x: box.x, y: box.y };
    const sx = dx !== 0 ? box.w / 2 / Math.abs(dx) : Infinity;
    const sy = dy !== 0 ? box.h / 2 / Math.abs(dy) : Infinity;
    const s = Math.min(sx, sy);
    return { x: box.x + dx * s, y: box.y + dy * s };
  };
  const claseNodo = (nombre: string) =>
    el.querySelector<HTMLElement>(`.dl-clase[data-clase="${nombre}"]`);

  const redraw = () => {
    const br = board.getBoundingClientRect();
    if (br.width < 5) return;
    svg.setAttribute('viewBox', `0 0 ${br.width} ${br.height}`);
    // limpiar líneas y botones de borrar (los recreamos)
    svg.querySelectorAll('line').forEach((l) => l.remove());
    capaBorr.innerHTML = '';
    relaciones.forEach((rel, i) => {
      const nde = claseNodo(rel.de);
      const na = claseNodo(rel.a);
      if (!nde || !na) return;
      const cde = centro(nde, br);
      const ca = centro(na, br);
      const p1 = bordeHacia(cde, ca.x, ca.y);
      const p2 = bordeHacia(ca, cde.x, cde.y);
      const line = document.createElementNS(SVGNS, 'line');
      line.setAttribute('x1', String(p1.x));
      line.setAttribute('y1', String(p1.y));
      line.setAttribute('x2', String(p2.x));
      line.setAttribute('y2', String(p2.y));
      line.setAttribute('marker-end', `url(#${el.id}-${rel.tipo})`);
      svg.appendChild(line);
      // botón ✕ para borrar, en el medio
      const bx = document.createElement('button');
      bx.type = 'button';
      bx.className = 'dl-borrar';
      bx.textContent = '✕';
      bx.title = 'Borrar esta flecha';
      bx.style.left = `${(p1.x + p2.x) / 2}px`;
      bx.style.top = `${(p1.y + p2.y) / 2}px`;
      bx.addEventListener('click', () => {
        relaciones.splice(i, 1);
        redraw();
      });
      capaBorr.appendChild(bx);
    });
  };

  // ---- conectar (elegir tipo → origen → destino) ----
  const limpiarConexion = () => {
    tipoActivo = '';
    origen = '';
    el.querySelectorAll('.dl-tipo').forEach((c) => c.classList.remove('is-sel'));
    clases.forEach((c) => c.classList.remove('dl-origen'));
    if (ayuda) ayuda.classList.remove('dl-ayuda-activa');
  };

  el.querySelectorAll<HTMLElement>('.dl-tipo').forEach((chip) => {
    chip.addEventListener('click', () => {
      const era = chip.classList.contains('is-sel');
      limpiarConexion();
      if (!era) {
        chip.classList.add('is-sel');
        tipoActivo = chip.dataset.tipo || '';
        if (ayuda) ayuda.classList.add('dl-ayuda-activa');
      }
    });
  });

  const clickClase = (nombre: string, node: HTMLElement) => {
    if (!tipoActivo) return; // sin tipo activo, el click no conecta (se usa para arrastrar)
    if (!origen) {
      origen = nombre;
      node.classList.add('dl-origen');
      return;
    }
    if (origen === nombre) {
      // clic en el mismo: cancelar selección de origen
      origen = '';
      node.classList.remove('dl-origen');
      return;
    }
    // crear relación origen → destino (si no existe igual)
    const existe = relaciones.some((r) => r.de === origen && r.a === nombre && r.tipo === tipoActivo);
    if (!existe) relaciones.push({ de: origen, a: nombre, tipo: tipoActivo });
    limpiarConexion();
    redraw();
  };

  // ---- arrastrar clases (pointer) + distinguir de click ----
  clases.forEach((node) => {
    let dragging = false;
    let movido = false;
    let startX = 0;
    let startY = 0;
    let offX = 0;
    let offY = 0;

    node.addEventListener('pointerdown', (e) => {
      dragging = true;
      movido = false;
      startX = e.clientX;
      startY = e.clientY;
      const br = board.getBoundingClientRect();
      const r = node.getBoundingClientRect();
      offX = e.clientX - (r.left + r.width / 2);
      offY = e.clientY - (r.top + r.height / 2);
      try {
        node.setPointerCapture(e.pointerId);
      } catch {
        /* puntero sintético / no capturable: seguimos igual */
      }
      node.classList.add('dl-arrastrando');
    });
    node.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      if (Math.abs(e.clientX - startX) > 4 || Math.abs(e.clientY - startY) > 4) movido = true;
      if (!movido) return;
      const br = board.getBoundingClientRect();
      let x = ((e.clientX - offX - br.left) / br.width) * 100;
      let y = ((e.clientY - offY - br.top) / br.height) * 100;
      x = Math.max(4, Math.min(96, x));
      y = Math.max(6, Math.min(94, y));
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
      redraw();
    });
    node.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      node.classList.remove('dl-arrastrando');
      try {
        node.releasePointerCapture(e.pointerId);
      } catch {
        /* nada */
      }
      if (!movido) clickClase(node.dataset.clase || '', node); // fue un click → conectar
    });
  });

  // ---- verificar ----
  const mostrar = (texto: string, estado: 'is-ok' | 'is-error') => {
    if (!salida) return;
    salida.hidden = false;
    salida.textContent = texto;
    salida.className = 'ejercicio__salida ' + estado;
  };
  const clave = (r: Relacion) => `${r.de}>${r.a}:${r.tipo}`;

  el.querySelector<HTMLButtonElement>('[data-dl-verificar]')?.addEventListener('click', () => {
    const esperado = new Set(sol.relaciones.map(clave));
    const hecho = new Set(relaciones.map(clave));
    const faltan = [...esperado].filter((k) => !hecho.has(k)).length;
    const sobran = [...hecho].filter((k) => !esperado.has(k)).length;
    if (faltan === 0 && sobran === 0) {
      mostrar('✅ ¡Perfecto! El diagrama tiene todas las relaciones correctas. 🎉', 'is-ok');
      marcarHecho(titulo);
      pintarSello(el, true);
    } else {
      const partes: string[] = [];
      if (faltan) partes.push(`faltan ${faltan} relación(es)`);
      if (sobran) partes.push(`sobran ${sobran}`);
      mostrar(`Todavía no: ${partes.join(' y ')}. Revisá los tipos y las direcciones de las flechas.`, 'is-error');
    }
  });

  el.querySelector<HTMLButtonElement>('[data-dl-reset]')?.addEventListener('click', () => {
    relaciones.length = 0;
    limpiarConexion();
    redraw();
    if (salida) salida.hidden = true;
  });

  // dibujo inicial + redibujo responsive
  redraw();
  if ('ResizeObserver' in window) new ResizeObserver(() => redraw()).observe(board);
  window.addEventListener('resize', redraw);
  setTimeout(redraw, 300);
}

function bootLibre(): void {
  document.querySelectorAll<HTMLElement>('.diagrama').forEach((el) => {
    if (!el.querySelector('[data-board]') || el.dataset.initLibre) return;
    el.dataset.initLibre = '1';
    initLibre(el);
  });
  actualizarResumen();
}

if (document.readyState !== 'loading') bootLibre();
else document.addEventListener('DOMContentLoaded', bootLibre);
document.addEventListener('astro:page-load', bootLibre);
