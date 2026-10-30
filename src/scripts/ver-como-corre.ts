// "Ver cómo corre": el código del alumno, paso a paso, con el motor de
// animaciones (github.com/MaxiNunez24/motor-animaciones).
//
// Corre en el mismo Python del ejercicio (el worker de python-runner.ts), con
// el trazador del motor: qué línea corrió, cuánto valía cada variable, la pila
// de llamadas y lo que se mostró. Y desdeTraza lo arma como escena, con la
// lupa sobre el código y una explicación de cada paso.
//
// El motor se descarga recién al tocar el botón: una clase con veinte
// ejercicios no carga nada de esto hasta que alguien lo pide.

import { trazarPython, TimeoutError, pythonReady } from './python-runner';
import { b64decode } from './editor-comun';

type Motor = typeof import('motor-animaciones');
let motor: Promise<Motor> | null = null;
const cargarMotor = () => (motor ??= import('motor-animaciones'));

// La consola del motor no parte las líneas, y una etiqueta de HTML se sale del
// cuadro. Se parten acá, como en una terminal: a lo ancho que entra.
const partirSalida = (salida?: string) => salida?.replace(/[^\n]{44}(?=[^\n])/g, '$&\n');

interface Contexto {
  getCode: () => string;
  leerEntradas: () => string[];
  tests: string;
  datos: string;
  archivos: Record<string, string>;
  archivo: string;
}

export function conectarTraza(el: HTMLElement, ctx: Contexto): void {
  const boton = el.querySelector<HTMLButtonElement>('[data-traza]');
  const panel = el.querySelector<HTMLElement>('[data-traza-panel]');
  if (!boton || !panel) return;
  const estado = panel.querySelector<HTMLElement>('[data-traza-estado]')!;
  const escena = panel.querySelector<HTMLElement & { escena: unknown; reproducir: () => void; pausar: () => void }>(
    '[data-traza-motor]',
  )!;
  const cajaLlamada = panel.querySelector<HTMLElement>('[data-traza-llamada-caja]')!;
  const llamada = panel.querySelector<HTMLTextAreaElement>('[data-traza-llamada]')!;

  // null: todavía no se eligió, que la sugiera el worker a partir de los tests.
  // Con la prop `llamada` del ejercicio, arranca con esa.
  let elegida: string | null = el.dataset.llamada !== undefined ? b64decode(el.dataset.llamada) : null;

  const avisar = (texto: string) => {
    estado.textContent = texto;
    estado.hidden = !texto;
  };
  const ajustarAlto = () => {
    llamada.rows = Math.min(6, Math.max(1, llamada.value.split('\n').length));
  };

  const ver = async () => {
    panel.hidden = false;
    boton.disabled = true;
    avisar(pythonReady() ? '⏳ Preparando la animación…' : '⏳ Cargando Python (la primera vez tarda unos segundos)…');
    try {
      const m = await cargarMotor();
      const res = await trazarPython({
        code: ctx.getCode(),
        tests: ctx.tests,
        trazador: m.TRAZADOR_PY,
        llamada: elegida,
        datos: ctx.datos,
        entradas: ctx.leerEntradas(),
        archivos: ctx.archivos,
      });
      // Sin llamada (el código todavía no define nada que los tests usen), la
      // próxima vez se vuelve a sugerir.
      elegida = res.llamada || null;
      llamada.value = res.llamada;
      ajustarAlto();
      // La caja aparece si hay una llamada, o si el programa solo define
      // cosas (para que el alumno sepa que puede escribir una).
      cajaLlamada.hidden = !res.llamada && !/^(def|class)\s/m.test(ctx.getCode());

      const pasos = res.traza.traza as { excepcion?: { tipo: string; mensaje: string } }[];
      // El trazador corta a los 400 pasos y lo atribuye a un bucle infinito.
      // Acá puede ser un programa largo que termina bien: se dice las dos cosas.
      for (const paso of pasos) {
        if (paso.excepcion?.tipo === 'Corte') {
          paso.excepcion = {
            tipo: 'Hasta acá',
            mensaje: 'son muchos pasos para mirarlos. Si tu programa no termina nunca, ¿hay un bucle infinito?',
          };
        }
      }
      // El código entero arriba, la línea que corre grande abajo, y la escena del
      // alto de lo que muestra (las dos cosas, del motor desde la v0.12.0).
      escena.escena = m.desdeTraza({
        ...res.traza,
        traza: res.traza.traza.map((paso) => ({ ...paso, salida: partirSalida(paso.salida) })),
        explicar: true,
        lineaGrande: true,
        alto: 'auto',
        ritmo: 1.2,
        archivo: ctx.archivo || 'tu_programa.py',
      });
      avisar('');
      escena.reproducir();
    } catch (e) {
      avisar(
        e instanceof TimeoutError
          ? '⏱️ Tardó demasiado y lo detuvimos. ¿Habrá un bucle infinito? Revisá la condición de tu while.'
          : '⚠️ No se pudo armar la animación: ' + String(e instanceof Error ? e.message : e),
      );
    } finally {
      boton.disabled = false;
    }
  };

  boton.addEventListener('click', () => void ver());
  panel.querySelector('[data-traza-otra]')?.addEventListener('click', () => {
    elegida = llamada.value;
    void ver();
  });
  llamada.addEventListener('input', ajustarAlto);
  panel.querySelector('[data-traza-cerrar]')?.addEventListener('click', () => {
    escena.pausar?.();
    panel.hidden = true;
  });
}
