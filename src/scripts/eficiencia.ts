// Ejercicios de lógica con medición de eficiencia.
//
// Comparte casi todo con ejercicio-python.ts (mismo editor, mismos botones,
// mismo CSS) y agrega el paso que le da sentido: cuando los tests pasan, corre
// la solución con datos cada vez más grandes y cuenta cuántas líneas ejecuta.
//
// La idea pedagógica: "anda" es el piso, no el techo.

import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  estaHecho,
  marcarHecho,
  guardarCodigo,
  leerCodigo,
  borrarCodigo,
  pintarSello,
  actualizarResumen,
  leerEficiencia,
  guardarEficiencia,
} from './progreso';
import {
  runPython,
  medirPython,
  ensureWorker,
  pythonReady,
  TimeoutError,
  RUN_TIMEOUT_MS,
  TOPE_PASOS,
  type Escenario,
  type Medicion,
} from './python-runner';
import { medirCuandoSeaVisible } from './medir-editor';
import {
  editorTheme,
  b64decode,
  avisarDescargaUnaVez,
  aplicarPreferenciaTeclas,
  conectarTeclas,
  conectarToggleTeclas,
  conectarEnvio,
} from './editor-comun';

// ---------- Los niveles ----------

interface Nivel {
  clave: string;
  emoji: string;
  nombre: string;
  mensaje: string;
}

const NIVELES: Record<string, Nivel> = {
  optimo: {
    clave: 'optimo',
    emoji: '🏆',
    nombre: 'Óptimo',
    mensaje: 'Difícil pedir más: no le hacés repetir trabajo a la máquina.',
  },
  bueno: {
    clave: 'bueno',
    emoji: '⚡',
    nombre: 'Eficiente',
    mensaje: 'Muy bien: recorrés los datos lo justo. Hay una variante todavía más barata.',
  },
  mejorable: {
    clave: 'mejorable',
    emoji: '🟡',
    nombre: 'Se puede mejorar',
    mensaje: 'Funciona, pero le estás haciendo repetir trabajo a la máquina. Mirá las pistas.',
  },
  bruta: {
    clave: 'bruta',
    emoji: '🐢',
    nombre: 'Fuerza bruta',
    mensaje:
      'Anda, y eso ya es un logro. Pero probás muchísimas más cosas de las necesarias: ' +
      'con datos de verdad esto no terminaría nunca.',
  },
};

function clasificar(
  pasos: number,
  cortado: boolean,
  optimo: number,
  bueno: number,
  mejorable: number,
): Nivel {
  if (cortado) return NIVELES.bruta; // se pasó del tope: ni sabemos cuánto más
  if (pasos <= optimo) return NIVELES.optimo;
  if (pasos <= bueno) return NIVELES.bueno;
  if (pasos <= mejorable) return NIVELES.mejorable;
  return NIVELES.bruta;
}

const num = (n: number) => n.toLocaleString('es-AR');

// Cómo crece el costo cuando crecen los datos. Es LA pregunta del tema: no
// importa tanto el número de hoy como qué va a pasar con diez veces más datos.
function textoCrecimiento(ms: Medicion[]): string {
  if (ms.length < 2) return '';
  const a = ms[0];
  const z = ms[ms.length - 1];
  if (!a.tamano || !z.tamano || a.tamano === z.tamano || a.pasos === 0) return '';
  const xDatos = z.tamano / a.tamano;
  const xPasos = z.pasos / a.pasos;
  const d = `×${num(Math.round(xDatos))}`;
  const p = `×${num(Math.round(xPasos))}`;

  if (xPasos < 1.5) {
    // Ojo con el texto: si la solución delega en sum()/set()/max(), el recorrido
    // igual existe, solo que en C. Prometer "no depende del tamaño" sería
    // mentira; lo honesto es hablar de las líneas que escribió el alumno.
    return `📏 Los datos se multiplicaron por ${num(Math.round(xDatos))} y tus pasos casi no cambiaron. O encontraste una cuenta directa, o le delegaste el recorrido a Python (que lo hace en C, muchísimo más rápido que un for tuyo). En los dos casos: 👏`;
  }
  if (xPasos < xDatos / 2) {
    return `📏 Datos ${d} → pasos ${p}. Tus pasos crecen MUCHO más lento que los datos: cada vez que llegan más datos, vos casi no trabajás más. Excelente.`;
  }
  if (xPasos <= xDatos * 1.6) {
    return `📏 Datos ${d} → pasos ${p}. Crecen a la par: recorrés los datos una vez. Es lo esperable en la mayoría de los problemas.`;
  }
  return `📏 Datos ${d} → pasos ${p}. Tus pasos crecen MUCHO más rápido que los datos: eso pasa cuando por cada dato volvés a recorrer todos los demás. Con 10 veces más datos vas a tardar 100 veces más.`;
}

// ---------- Un ejercicio ----------

function initEficiencia(el: HTMLElement): void {
  const starter = b64decode(el.dataset.starter || '');
  const tests = b64decode(el.dataset.tests || '');
  const datos = b64decode(el.dataset.datos || '');
  const escenarios = JSON.parse(b64decode(el.dataset.escenarios || '') || '[]') as Escenario[];
  const optimo = Number(el.dataset.optimo || 0);
  const bueno = Number(el.dataset.bueno || 0);
  const mejorable = Number(el.dataset.mejorable || bueno * 10);
  const titulo = el.dataset.titulo || '';

  const editorEl = el.querySelector<HTMLElement>('[data-editor]');
  const salida = el.querySelector<HTMLElement>('[data-salida]');
  const btnRun = el.querySelector<HTMLButtonElement>('[data-run]');
  const btnVerify = el.querySelector<HTMLButtonElement>('[data-verify]');
  const btnReset = el.querySelector<HTMLButtonElement>('[data-reset]');
  const tarjeta = el.querySelector<HTMLElement>('[data-efi]');
  const sello = el.querySelector<HTMLElement>('[data-efi-sello]');
  if (!editorEl || !salida || !tarjeta) return;

  const guardado = leerCodigo(titulo);
  pintarSello(el, estaHecho(titulo));

  // Insignia ganada en visitas anteriores (o traída con "Sincronizar progreso").
  const pintarInsignia = () => {
    const marca = leerEficiencia(titulo);
    if (!sello) return;
    if (!marca) {
      sello.hidden = true;
      return;
    }
    sello.hidden = false;
    sello.textContent = `${marca.emoji} ${NIVELES[marca.nivel]?.nombre || ''}`;
    sello.className = 'efi__sello efi__sello--' + marca.nivel;
    sello.title = `Tu mejor marca: ${num(marca.pasos)} pasos`;
  };
  pintarInsignia();

  let guardarTimer: ReturnType<typeof setTimeout> | undefined;
  const autoguardar = EditorView.updateListener.of((u) => {
    if (!u.docChanged) return;
    clearTimeout(guardarTimer);
    guardarTimer = setTimeout(() => guardarCodigo(titulo, view.state.doc.toString()), 600);
  });

  const view = new EditorView({
    doc: guardado != null ? guardado : starter,
    extensions: [basicSetup, python(), oneDark, editorTheme, keymap.of([indentWithTab]), autoguardar],
    parent: editorEl,
  });
  (el as unknown as { __cmView: EditorView }).__cmView = view;
  medirCuandoSeaVisible(view);

  const getCode = () => view.state.doc.toString();

  const show = (text: string, estado: '' | 'is-ok' | 'is-error' | 'is-loading') => {
    salida.hidden = false;
    salida.textContent = text;
    salida.className = 'ejercicio__salida' + (estado ? ' ' + estado : '');
  };
  const setBusy = (busy: boolean) => {
    [btnRun, btnVerify, btnReset].forEach((b) => b && (b.disabled = busy));
  };

  // ---------- Pintar la tarjeta de eficiencia ----------

  const pintarTarjeta = (ms: Medicion[]): void => {
    const ultima = ms[ms.length - 1];
    const nivel = clasificar(ultima.pasos, ultima.cortado, optimo, bueno, mejorable);

    el.querySelector<HTMLElement>('[data-efi-emoji]')!.textContent = nivel.emoji;
    el.querySelector<HTMLElement>('[data-efi-nivel]')!.textContent = nivel.nombre;
    el.querySelector<HTMLElement>('[data-efi-mensaje]')!.textContent = nivel.mensaje;
    tarjeta.className = 'efi efi--' + nivel.clave;

    // La barra de cada fila es relativa al escenario más caro, para que se vea
    // de un vistazo el salto entre uno y otro.
    const tope = Math.max(...ms.map((m) => m.pasos), 1);
    const filas = el.querySelector<HTMLElement>('[data-efi-filas]')!;
    filas.innerHTML = '';
    ms.forEach((m) => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = m.etiqueta;
      const td = document.createElement('td');
      // La barra y el número van en un div adentro de la celda, no en la celda
      // misma: un <td> con display:flex sale del layout de tabla y deja de
      // alinearse con su <th> (se ve medio renglón corrido).
      const caja = document.createElement('div');
      caja.className = 'efi__medida';
      // La barra va adentro de una "pista" del ancho fijo: así el porcentaje es
      // sobre la pista y las barras quedan comparables entre sí. (Si la barra
      // midiera un % de la celda y encima tuviera un max-width, la más larga se
      // recortaría y las proporciones dejarían de ser ciertas.)
      const pista = document.createElement('span');
      pista.className = 'efi__pista';
      const barra = document.createElement('span');
      barra.className = 'efi__barra';
      barra.style.width = Math.max(2, Math.round((m.pasos / tope) * 100)) + '%';
      pista.appendChild(barra);
      const valor = document.createElement('span');
      valor.className = 'efi__valor';
      valor.textContent = m.cortado ? `más de ${num(TOPE_PASOS)} (lo cortamos)` : num(m.pasos);
      caja.append(pista, valor);
      td.appendChild(caja);
      tr.append(th, td);
      filas.appendChild(tr);
    });

    el.querySelector<HTMLElement>('[data-efi-crecimiento]')!.textContent = textoCrecimiento(ms);

    const cajaRecord = el.querySelector<HTMLElement>('[data-efi-record]')!;
    const previa = leerEficiencia(titulo);
    const mejoro = guardarEficiencia(titulo, {
      pasos: ultima.pasos,
      nivel: nivel.clave,
      emoji: nivel.emoji,
    });
    if (mejoro && previa) {
      cajaRecord.hidden = false;
      cajaRecord.textContent = `🎯 ¡Nueva mejor marca! Antes: ${num(previa.pasos)} pasos. Ahora: ${num(ultima.pasos)}.`;
    } else if (previa && previa.pasos < ultima.pasos) {
      cajaRecord.hidden = false;
      cajaRecord.textContent = `📌 Tu mejor marca sigue siendo ${previa.emoji} ${num(previa.pasos)} pasos. Esta versión hizo ${num(ultima.pasos)}.`;
    } else {
      cajaRecord.hidden = true;
    }
    pintarInsignia();
    tarjeta.hidden = false;
  };

  // ---------- Correr ----------

  const correr = async (conTests: boolean) => {
    setBusy(true);
    show(
      pythonReady()
        ? conTests
          ? '⏳ Verificando…'
          : '⏳ Ejecutando…'
        : '⏳ Cargando Python (la primera vez tarda unos segundos)…',
      'is-loading',
    );
    try {
      const res = await runPython(getCode(), conTests ? tests : '', '', datos, []);
      const out = res.out.trimEnd();

      if (!conTests) {
        if (res.ok) show(out || '(el código corrió, pero no imprimió nada)', '');
        else show((out ? out + '\n\n' : '') + res.err, 'is-error');
        return;
      }
      if (!res.ok) {
        // Sin solución correcta no hay nada que medir: primero que ande.
        tarjeta.hidden = true;
        show((out ? out + '\n\n' : '') + '❌ Todavía no pasa:\n\n' + res.err, 'is-error');
        return;
      }

      marcarHecho(titulo);
      pintarSello(el, true);
      show('✅ Da el resultado correcto.\n\n⏱️ Ahora midiendo cuánto le cuesta…', 'is-loading');

      const med = await medirPython(getCode(), escenarios, datos);
      if (!med.ok || med.escenarios.length === 0) {
        show(
          '✅ ¡Los tests pasaron! 🎉\n\n' +
            '(No pudimos medir la eficiencia: ' +
            (med.err || 'no hubo escenarios') +
            ')',
          'is-ok',
        );
        return;
      }
      show('✅ ¡Los tests pasaron! 🎉 Mirá abajo cuánto le costó.', 'is-ok');
      pintarTarjeta(med.escenarios);
    } catch (e) {
      if (e instanceof TimeoutError) {
        show(
          '⏱️ Tu código tardó más de ' +
            RUN_TIMEOUT_MS / 1000 +
            ' segundos y lo detuvimos.\n\n' +
            'Puede ser un bucle infinito… o una solución tan cara que no llega a terminar\n' +
            'con los datos grandes. Las dos cosas se arreglan pensando de nuevo el recorrido.',
          'is-error',
        );
      } else {
        show('⚠️ Error cargando el intérprete de Python:\n' + String(e), 'is-error');
      }
    } finally {
      setBusy(false);
    }
  };

  btnRun?.addEventListener('click', () => correr(false));
  btnVerify?.addEventListener('click', () => correr(true));
  btnReset?.addEventListener('click', () => {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: starter } });
    salida.hidden = true;
    tarjeta.hidden = true;
    borrarCodigo(titulo);
  });

  editorEl.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      correr(true);
    }
  });

  conectarEnvio(el, getCode);
  conectarTeclas(el, view);
  conectarToggleTeclas(el);

  const precargar = () => {
    avisarDescargaUnaVez(el);
    void ensureWorker().catch(() => {});
  };
  editorEl.addEventListener('focusin', precargar, { once: true });
  editorEl.addEventListener('pointerdown', precargar, { once: true });
}

function boot(): void {
  aplicarPreferenciaTeclas();
  document.querySelectorAll<HTMLElement>('.ejercicio--eficiencia').forEach((el) => {
    if (el.dataset.init) return;
    el.dataset.init = '1';
    initEficiencia(el);
  });
  actualizarResumen();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
document.addEventListener('astro:page-load', boot);
