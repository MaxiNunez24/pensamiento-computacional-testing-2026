/**
 * "Escribí el test que atrape el bug" (ver components/EscribirTest.astro).
 *
 * La corrección es el corazón del ejercicio. Los asserts del alumno se corren:
 *   · contra la implementación CORRECTA → tienen que pasar
 *   · contra cada implementación ROTA   → tienen que fallar
 *
 * Hacen falta las dos condiciones. Solo con la primera, un test vacío aprueba;
 * solo con la segunda, `assert False` aprueba. Juntas obligan a lo mismo que se
 * le pide a un test de verdad: que distinga el código que anda del que no.
 */
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { estaHecho, marcarHecho, guardarCodigo, leerCodigo, pintarSello } from './progreso';
import { runPython, pythonReady, TimeoutError } from './python-runner';
import { editorTheme, b64decode, aplicarPreferenciaTeclas, conectarTeclas, conectarEnvio } from './editor-comun';

interface Rota {
  pista: string;
  codigo: string;
}

export function conectarEscribirTest(el: HTMLElement): void {
  const titulo = el.dataset.titulo || '';
  const correcta = b64decode(el.dataset.correcta || '');
  const starter = b64decode(el.dataset.starter || '');
  let rotas: Rota[] = [];
  try {
    rotas = JSON.parse(b64decode(el.dataset.rotas || '[]'));
  } catch {
    rotas = [];
  }

  const editorEl = el.querySelector<HTMLElement>('[data-editor]');
  const salida = el.querySelector<HTMLElement>('[data-salida]');
  const marcador = el.querySelector<HTMLElement>('[data-marcador]');
  const btnVerify = el.querySelector<HTMLButtonElement>('[data-verify]');
  const btnReset = el.querySelector<HTMLButtonElement>('[data-reset]');
  if (!editorEl || !salida) return;

  pintarSello(el, estaHecho(titulo));

  let guardarTimer: ReturnType<typeof setTimeout> | undefined;
  const autoguardar = EditorView.updateListener.of((u) => {
    if (!u.docChanged) return;
    clearTimeout(guardarTimer);
    guardarTimer = setTimeout(() => guardarCodigo(titulo, view.state.doc.toString()), 600);
  });

  const guardado = leerCodigo(titulo);
  const view = new EditorView({
    doc: guardado != null ? guardado : starter,
    extensions: [basicSetup, python(), oneDark, editorTheme, keymap.of([indentWithTab]), autoguardar],
    parent: editorEl,
  });
  (el as unknown as { __cmView: EditorView }).__cmView = view;

  const getCode = () => view.state.doc.toString();
  const show = (txt: string, clase: '' | 'is-ok' | 'is-err' | 'is-warn' | 'is-loading') => {
    salida.hidden = false;
    salida.textContent = txt;
    salida.className = 'ejercicio__salida' + (clase ? ' ' + clase : '');
  };

  aplicarPreferenciaTeclas(el);
  conectarTeclas(el, () => view);
  conectarEnvio(el, getCode);

  btnReset?.addEventListener('click', () => {
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: starter } });
    salida.hidden = true;
    if (marcador) marcador.hidden = true;
  });

  btnVerify?.addEventListener('click', async () => {
    const tests = getCode().trim();
    if (!tests) {
      show('Escribí al menos un assert antes de probar.', 'is-warn');
      return;
    }
    if (!/assert/.test(tests)) {
      show('Todavía no hay ningún assert. Un test que no afirma nada no prueba nada.', 'is-warn');
      return;
    }

    [btnVerify, btnReset].forEach((b) => b && (b.disabled = true));
    show(
      pythonReady() ? '⏳ Probando tus tests…' : '⏳ Cargando Python (la primera vez tarda unos segundos)…',
      'is-loading',
    );

    try {
      // 1) Contra la versión que ANDA: los asserts tienen que pasar.
      const buena = await runPython(correcta, tests);

      // 2) Contra cada versión ROTA: tienen que fallar.
      const resultados: { pista: string; atrapado: boolean }[] = [];
      for (const r of rotas) {
        const res = await runPython(r.codigo, tests);
        resultados.push({ pista: r.pista, atrapado: !res.ok });
      }

      const atrapados = resultados.filter((r) => r.atrapado).length;

      if (marcador) {
        marcador.hidden = false;
        // Si los tests fallan con el código bueno, el resto del marcador no
        // significa nada: un test roto "atrapa" todo, incluso lo que anda.
        // Mostrarlo como logro sería mentirle al alumno.
        marcador.innerHTML = buena.ok
          ? `<li class="es-bien">✓ Con el código que <strong>anda bien</strong>, tus tests pasan</li>` +
            resultados
              .map(
                (r) =>
                  `<li class="${r.atrapado ? 'es-bien' : 'es-mal'}">${r.atrapado ? '✓' : '✗'} ` +
                  `${r.atrapado ? 'Atrapaste' : 'Se te escapó'}: ${r.pista}</li>`,
              )
              .join('')
          : `<li class="es-mal">✗ Con el código que <strong>anda bien</strong>, tus tests FALLAN ` +
            `(y no deberían)</li>` +
            `<li class="es-neutro">Hasta que eso no se arregle no tiene sentido contar bugs: ` +
            `un test que afirma algo falso falla contra todo, ande o no ande el código.</li>`;
      }

      if (!buena.ok) {
        // Este caso primero: si el test acusa al código bueno, lo demás no importa.
        show(
          'Tus tests fallan con la versión que SÍ funciona, así que algo de lo que afirmás no es cierto.\n\n' +
            (buena.err || buena.out).trim(),
          'is-err',
        );
      } else if (atrapados === rotas.length) {
        show(
          `✅ Tus tests pasan con el código correcto y atrapan ${atrapados === 1 ? 'el bug' : `los ${atrapados} bugs`}. ` +
            'Eso es exactamente lo que tiene que hacer un test. 🎉',
          'is-ok',
        );
        marcarHecho(titulo);
        pintarSello(el, true);
      } else {
        show(
          `Tus tests pasan con el código correcto ✓, pero se ${rotas.length - atrapados === 1 ? 'escapó 1 bug' : `escaparon ${rotas.length - atrapados} bugs`}. ` +
            'Mirá abajo cuál, y pensá qué caso lo pondría en evidencia.',
          'is-warn',
        );
      }
    } catch (e) {
      show(
        e instanceof TimeoutError
          ? 'Se colgó: alguno de tus tests tarda demasiado. ¿Quedó un bucle sin fin?'
          : 'No se pudo ejecutar: ' + String(e),
        'is-err',
      );
    } finally {
      [btnVerify, btnReset].forEach((b) => b && (b.disabled = false));
    }
  });
}
