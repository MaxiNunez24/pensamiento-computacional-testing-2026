// Motor de los ejercicios de HTML / CSS / JavaScript (<EjercicioWeb>).
//
// Un editor por lenguaje (con pestañas), y abajo la página del alumno en un
// <iframe> que se rearma sola mientras escribe. Los tests son JavaScript y corren
// ADENTRO de esa página: ahí está el DOM que hay que revisar.
//
// El iframe es `sandbox="allow-scripts"` SIN `allow-same-origin`: el JS del
// alumno corre, pero en un origen aparte, sin acceso a la plataforma ni a su
// localStorage (donde está el progreso). La contracara es que desde acá no se
// puede leer su DOM: todo va y viene por postMessage.

import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  estaHecho, marcarHecho, guardarCodigo, leerCodigo, borrarCodigo, pintarSello, actualizarResumen,
} from './progreso';
import { medirCuandoSeaVisible } from './medir-editor';
import {
  editorTheme, b64decode, aplicarPreferenciaTeclas, conectarTeclas, conectarToggleTeclas, conectarEnvio,
} from './editor-comun';

type Lang = 'html' | 'css' | 'js';
const LENGUAJE = { html: () => html(), css: () => css(), js: () => javascript() };
const NOMBRE: Record<Lang, string> = { html: 'HTML', css: 'CSS', js: 'JavaScript' };

/* Lo que se mete en la página del alumno, antes que todo lo suyo: avisa los
   errores, informa el alto (para que el marco crezca con la página) y corre
   los tests cuando se los mandan.

   Los tests reciben ayudas que devuelven null si no encuentran el elemento, en
   vez de romper: así un test escrito como `assert(texto("h2"), "Falta el h2")`
   le explica al alumno qué falta, y no le muestra un TypeError nuestro. */
const RUNTIME = `<script>
(function () {
  var enviar = function (m) { parent.postMessage(Object.assign({ pcWeb: true }, m), '*'); };
  window.addEventListener('error', function (e) {
    enviar({ tipo: 'error', mensaje: e.message, linea: e.lineno });
  });
  var avisarAlto = function () { enviar({ tipo: 'alto', alto: document.documentElement.scrollHeight }); };
  window.addEventListener('load', avisarAlto);
  if (window.ResizeObserver) new ResizeObserver(avisarAlto).observe(document.documentElement);

  function Falla(m) { this.message = m; }
  window.addEventListener('message', function (ev) {
    var d = ev.data;
    if (!d || d.pcWebTests !== true) return;
    var $ = function (s) { return document.querySelector(s); };
    var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
    var texto = function (s) { var e = $(s); return e ? e.textContent.replace(/\\s+/g, ' ').trim() : null; };
    var estilo = function (s, p) { var e = $(s); return e ? getComputedStyle(e).getPropertyValue(p).trim() : null; };
    var atributo = function (s, a) { var e = $(s); return e ? e.getAttribute(a) : null; };
    var esperar = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var assert = function (c, m) { if (!c) throw new Falla(m || 'algo no dio lo esperado'); };
    var click = function (s) { var e = $(s); assert(e, 'No encontré ' + s + ' para hacerle clic'); e.click(); };
    var escribir = function (s, v) {
      var e = $(s); assert(e, 'No encontré ' + s + ' para escribir');
      e.value = v; e.dispatchEvent(new Event('input', { bubbles: true }));
    };
    var correr;
    try {
      correr = new Function('assert', '$', '$$', 'texto', 'estilo', 'atributo', 'click', 'escribir', 'esperar',
        'return (async function () {\\n' + d.tests + '\\n})();');
    } catch (e) { enviar({ tipo: 'tests', ok: false, nuestro: true, mensaje: 'El test tiene un error: ' + e.message }); return; }
    correr(assert, $, $$, texto, estilo, atributo, click, escribir, esperar).then(
      function () { enviar({ tipo: 'tests', ok: true }); },
      function (e) {
        if (e instanceof Falla) enviar({ tipo: 'tests', ok: false, mensaje: e.message });
        else enviar({ tipo: 'tests', ok: false, nuestro: true, mensaje: String(e && e.message || e) });
      });
  });
  enviar({ tipo: 'lista' });
})();
<\/script>`;

/* Un `</script>` adentro del JS del alumno (en un string, por ejemplo) cerraría
   nuestra etiqueta antes de tiempo. Así no lo cierra, y el navegador lo lee igual. */
const sinCierre = (s: string) => s.replace(/<\/script/gi, '<\\/script');

/** Arma la página completa: lo nuestro + los estilos + lo del alumno + su JS. */
function armarPagina(codigo: Partial<Record<Lang, string>>, cssBase: string): { doc: string; lineaJs: number } {
  const cabeza = RUNTIME + `<style>${cssBase}</style><style>${codigo.css ?? ''}</style>`;
  const marcaJs = '<script>\n';
  const pie = codigo.js ? marcaJs + sinCierre(codigo.js) + '\n<\/script>' : '';
  let cuerpo = codigo.html ?? '';
  let doc: string;
  // Si el alumno escribió la página entera (<html>, <head>, <body>), lo nuestro
  // va adentro de su <head> y su JS antes de su </body>. Si escribió solo un
  // pedazo, lo envolvemos nosotros.
  if (/<html[\s>]|<body[\s>]|<head[\s>]/i.test(cuerpo)) {
    if (/<head[^>]*>/i.test(cuerpo)) cuerpo = cuerpo.replace(/<head[^>]*>/i, (m) => m + cabeza);
    else if (/<html[^>]*>/i.test(cuerpo)) cuerpo = cuerpo.replace(/<html[^>]*>/i, (m) => m + cabeza);
    else cuerpo = cabeza + cuerpo;
    doc = /<\/body>/i.test(cuerpo) ? cuerpo.replace(/<\/body>/i, pie + '</body>') : cuerpo + pie;
  } else {
    // Sin <meta name="viewport">: adentro de un marco no hace falta, el ancho
    // es el del marco. OJO al probar con la emulación de celular de Chrome: a
    // los marcos con sandbox (corren en otro proceso) les impone el ancho del
    // TELÉFONO, y la vista se ve cortada a la derecha. Medido el 8/10: es la
    // emulación; sin ella, adentro de un marco de 300px la página mide 300.
    doc = `<!doctype html><html lang="es"><head><meta charset="utf-8">${cabeza}</head>` +
      `<body>${cuerpo}${pie}</body></html>`;
  }
  // En qué línea de la página arranca el JS del alumno: los errores del
  // navegador vienen con la línea de la PÁGINA, y al alumno le sirve la de SU código.
  const inicio = codigo.js ? doc.indexOf(marcaJs + sinCierre(codigo.js)) : -1;
  const lineaJs = inicio >= 0 ? doc.slice(0, inicio + marcaJs.length).split('\n').length : 0;
  return { doc, lineaJs };
}

function initEjercicio(el: HTMLElement): void {
  const titulo = el.dataset.titulo || '';
  const tests = b64decode(el.dataset.tests || '');
  const cssBase = b64decode(el.dataset.cssBase || '');
  const starters = JSON.parse(b64decode(el.dataset.starters || '') || '{}') as Partial<Record<Lang, string>>;
  const langs = Object.keys(starters) as Lang[];

  const editorEl = el.querySelector<HTMLElement>('[data-editor]');
  const marco = el.querySelector<HTMLIFrameElement>('[data-vista]');
  const salida = el.querySelector<HTMLElement>('[data-salida]');
  const btnVerify = el.querySelector<HTMLButtonElement>('[data-verify]');
  const btnReset = el.querySelector<HTMLButtonElement>('[data-reset]');
  if (!editorEl || !marco || !salida || langs.length === 0) return;

  // Lo guardado es un JSON con lo de cada pestaña. Si no se puede leer (o es de
  // una versión vieja del ejercicio con otras pestañas), arranca de cero.
  let guardado: Partial<Record<Lang, string>> = {};
  try { guardado = JSON.parse(leerCodigo(titulo) || '{}'); } catch { guardado = {}; }
  pintarSello(el, estaHecho(titulo));

  const vistas = {} as Record<Lang, EditorView>;
  let activa: Lang = langs[0];
  let timer: ReturnType<typeof setTimeout> | undefined;

  const codigo = (): Partial<Record<Lang, string>> =>
    Object.fromEntries(langs.map((l) => [l, vistas[l].state.doc.toString()]));

  const show = (text: string, estado: '' | 'is-ok' | 'is-error' | 'is-loading') => {
    salida.hidden = false;
    salida.textContent = text;
    salida.className = 'ejercicio__salida' + (estado ? ' ' + estado : '');
  };

  /* La vista. Cada vez que se rearma, el iframe arranca de cero (su JS también),
     así lo que ve el alumno es siempre lo que escribió, sin restos de antes. */
  let lineaJs = 0;
  let alListo: (() => void) | null = null;
  const refrescar = () => {
    const armado = armarPagina(codigo(), cssBase);
    lineaJs = armado.lineaJs;
    marco.srcdoc = armado.doc;
  };

  for (const lang of langs) {
    const v = new EditorView({
      doc: guardado[lang] ?? starters[lang] ?? '',
      extensions: [
        basicSetup, LENGUAJE[lang](), oneDark, editorTheme, keymap.of([indentWithTab]),
        EditorView.updateListener.of((u) => {
          if (!u.docChanged) return;
          clearTimeout(timer);
          timer = setTimeout(() => {
            guardarCodigo(titulo, JSON.stringify(codigo()));
            // Un error viejo de JS ya no corresponde: se vuelve a ver si sigue.
            if (salida.classList.contains('is-error') && !salida.dataset.deTests) salida.hidden = true;
            refrescar();
          }, 450);
        }),
      ],
      parent: editorEl,
    });
    v.dom.dataset.lang = lang;
    v.dom.setAttribute('aria-label', `Código ${NOMBRE[lang]}`);
    if (lang !== activa) v.dom.hidden = true;
    vistas[lang] = v;
    medirCuandoSeaVisible(v);
  }

  // Pestañas
  const pestanas = el.querySelectorAll<HTMLButtonElement>('[data-pestana]');
  pestanas.forEach((b) => b.addEventListener('click', () => {
    activa = b.dataset.pestana as Lang;
    pestanas.forEach((o) => o.setAttribute('aria-selected', String(o === b)));
    for (const l of langs) vistas[l].dom.hidden = l !== activa;
    vistas[activa].requestMeasure();
    vistas[activa].focus();
  }));

  /* Los mensajes que vienen de la página del alumno. Se filtra por
     `ev.source`: con varios ejercicios en la misma clase, cada uno escucha
     solo a SU marco. */
  window.addEventListener('message', (ev) => {
    if (ev.source !== marco.contentWindow) return;
    const d = ev.data as { pcWeb?: boolean; tipo?: string; [k: string]: unknown };
    if (!d || d.pcWeb !== true) return;
    if (d.tipo === 'alto') {
      // El marco crece con la página, con un tope: una página larga scrollea adentro.
      marco.style.height = Math.min(Math.max(Number(d.alto) + 4, 120), 640) + 'px';
    } else if (d.tipo === 'lista') {
      alListo?.();
    } else if (d.tipo === 'error') {
      const linea = Number(d.linea) - lineaJs + 1;
      delete salida.dataset.deTests; // es un error de su JS, no un resultado de Verificar
      show(`⚠️ Error en tu JavaScript${linea > 0 ? ` (línea ${linea})` : ''}:\n${d.mensaje}`, 'is-error');
    } else if (d.tipo === 'tests') {
      terminarTests?.(d as { ok: boolean; mensaje?: string; nuestro?: boolean });
    }
  });

  let terminarTests: ((r: { ok: boolean; mensaje?: string; nuestro?: boolean }) => void) | null = null;

  const verificar = () => {
    if (btnVerify) btnVerify.disabled = true;
    show('⏳ Revisando tu página…', 'is-loading');
    salida.dataset.deTests = '1';
    let corte: ReturnType<typeof setTimeout>;
    const fin = () => { clearTimeout(corte); terminarTests = null; alListo = null; if (btnVerify) btnVerify.disabled = false; };
    terminarTests = (r) => {
      fin();
      if (r.ok) {
        show('✅ ¡Todos los tests pasaron! 🎉', 'is-ok');
        marcarHecho(titulo);
        pintarSello(el, true);
      } else if (r.nuestro) {
        show('❌ Todavía no pasa:\n\nAlgo de tu página hizo fallar la revisión: ' + r.mensaje +
          '\n\nSi no te das cuenta qué es, mandáselo a tu profe con 💬.', 'is-error');
      } else {
        show('❌ Todavía no pasa:\n\n' + r.mensaje, 'is-error');
      }
    };
    // Una página recién armada, para que los tests vean el estado inicial y no
    // lo que quedó de los clics de prueba del alumno.
    alListo = () => { marco.contentWindow?.postMessage({ pcWebTests: true, tests }, '*'); };
    corte = setTimeout(() => {
      fin();
      show('⏱️ Tu página tardó demasiado en responder.\n\n¿Quedó un bucle que no termina en tu JavaScript?', 'is-error');
    }, 6000);
    refrescar();
  };

  btnVerify?.addEventListener('click', verificar);
  editorEl.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); verificar(); }
  });
  btnReset?.addEventListener('click', () => {
    for (const l of langs) {
      const v = vistas[l];
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: starters[l] ?? '' } });
    }
    salida.hidden = true;
    borrarCodigo(titulo);
    refrescar();
  });

  // Para el envío al profe: todo junto, con un rótulo por lenguaje.
  const todoJunto = () => {
    const c = codigo();
    return langs.map((l) => `===== ${NOMBRE[l]} =====\n${c[l] ?? ''}`).join('\n\n');
  };
  conectarEnvio(el, todoJunto);
  conectarTeclas(el, () => vistas[activa]);
  conectarToggleTeclas(el);

  refrescar();
}

function boot(): void {
  aplicarPreferenciaTeclas();
  document.querySelectorAll<HTMLElement>('.ejercicio--web').forEach((el) => {
    if (el.dataset.init) return;
    el.dataset.init = '1';
    initEjercicio(el);
  });
  actualizarResumen();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);
document.addEventListener('astro:page-load', boot);
