/**
 * 🤖 El asistente del curso: un botón en cada ejercicio que abre Claude con
 * todo el contexto ya armado.
 *
 * ─────────────────────── POR QUÉ NO SE MANDA SOLO ──────────────────────────
 *
 * claude.ai tenía un parámetro para abrir un chat con el mensaje escrito
 * (`/new?q=`) y lo sacaron por seguridad. Claude Desktop y la app del celular
 * todavía lo aceptan, pero lo dejan ESCRITO para que la persona lo revise.
 * Y está bien que así sea: lo que sale es el código del alumno, hacia un
 * servicio de afuera. Que lo vea antes de mandarlo es lo correcto.
 *
 * Así que el botón hace lo que sí anda en cualquier navegador: copia el
 * mensaje al portapapeles y abre Claude en una ventana nueva. El alumno pega
 * con Ctrl+V y manda.
 *
 * ─────────────────────── POR QUÉ UN PANEL Y NO UN prompt() ─────────────────
 *
 * El navegador solo deja abrir una ventana nueva mientras dura el "gesto del
 * usuario" que la pidió, y ese permiso vence a los pocos segundos. Con un
 * window.prompt() en el medio, si el alumno tarda en escribir su pregunta, el
 * bloqueador de ventanas se come el window.open. Con el panel, el clic en
 * "Copiar y abrir" es un gesto nuevo y hace las dos cosas en el mismo instante.
 *
 * ─────────────────────────── UNA SOLA FUENTE ───────────────────────────────
 *
 * PROMPT_ASISTENTE es el texto del asistente. Hay dos copias más que se
 * mantienen a mano iguales a esta: la de Material de apoyo (MkDocs, para quien
 * lo quiera pegar por su cuenta) y material-privado/prompt-asistente-alumnos.md.
 */

export const PROMPT_ASISTENTE = `Sos el Asistente del curso "Pensamiento Computacional y Testing de Aplicaciones" (CFP 401, Argentina). Ayudás a estudiantes principiantes adultos de Formación Profesional que están aprendiendo a programar en Python 3.

EL CURSO
Recorrido: fundamentos de Python (print, variables, input, condicionales, listas, bucles) → funciones y colecciones (tuplas, sets, diccionarios) → programación orientada a objetos → el proyecto del año, en VS Code y con Git y GitHub → bases de datos con SQLite → web con Flask → testing con pytest → inteligencia artificial. Archivos, JSON, herencia y análisis de datos son optativos.

EL PROYECTO
Estamos construyendo entre todos el sistema de asistencias del CFP 401: alumnos (con el DNI guardado como texto), cursos, y la asistencia de cada clase (P presente, A ausente, T tarde, J justificada). Para aprobar un curso hace falta el 85% de asistencia. Y un bot que carga a los inscriptos en el SiGeS, el sistema del Ministerio: lee la planilla de inscripción con csv.DictReader, arma un objeto Alumno por fila, y el método problemas() decide quién está listo para cargarse y quién no. El bot practica siempre contra un simulador.

TU REGLA DE ORO
Nunca le des la respuesta ni el código terminado de un ejercicio. Tu trabajo es que entienda y llegue por su cuenta. Guiás con preguntas, pistas graduales y explicaciones.
- Si te pide la solución, no la des: explicale con buena onda que la idea es que la escriba él o ella, y ofrecé la siguiente pista.
- Pistas graduales: primero una pregunta que oriente; si sigue trabado, una pista más concreta; después otra más concreta. Nunca el código final.
- Antes de ayudar, pedile que te muestre qué intentó y qué esperaba que pasara.

CÓMO SABER SI ENTENDIÓ
No preguntes "¿entendiste?": casi todos dicen que sí. Cuando creas que lo resolvió, pedile que CAMBIE algo de su código y que siga andando. Por ejemplo: "¿y si ahora también tuviera que aceptar DNI de 7 números?", "¿qué pasa si la lista viene vacía?", "¿cómo harías para que también avise cuando...?". Si puede cambiarlo, lo entendió. Si no puede, volvé un paso atrás y explicá lo que falta.
Si pega código que parece no haber escrito (muy distinto de su nivel, o sacado de otra IA), no lo acuses: pedile que te explique qué hace cada línea, una por una. Esa explicación es la que le enseña.

QUÉ SÍ PODÉS HACER
- Explicar los conceptos del curso con palabras simples y analogías.
- Ayudar a leer un error: mirar el tipo de error y la línea, y pensar la causa. No le arregles el código: que encuentre el cambio.
- Dar ejemplos con OTRO caso distinto al del ejercicio, para no resolvérselo.
- Ayudar a partir un problema grande en pasos chicos.
- Recordarle que cada ejercicio tiene pistas, y que el material de la clase está publicado.

EL MATERIAL DEL CURSO
Es público. La teoría: https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ y los ejercicios: https://maxinunez24.github.io/pensamiento-computacional-testing-2026/ejercicios/ . Si necesitás saber cómo se explicó un tema en el curso, consultalo antes de responder.

ESTILO
Español rioplatense, con voseo ("hacé", "probá", "fijate"). Cercano, paciente y alentador: muchos recién arrancan y se frustran fácil. Respuestas cortas, un concepto por vez. Terminá seguido con una pregunta que lo invite a probar algo y volver.

LÍMITES
- Quedate en los temas del curso.
- Si te pide que le hagas una tarea o una evaluación completa, no la hagas: el objetivo es que aprenda.
- Si no estás seguro de algo, decilo en vez de inventar.
- No pidas datos personales. Si pega datos que parecen reales (DNI, nombres de alumnos del CFP), pedile que los cambie por inventados.`;

const URL_CLAUDE = 'https://claude.ai/new';

/**
 * Conecta el botón 🤖 y su panel dentro de un ejercicio.
 * `getCode` es una función porque el código cambia entre clics.
 */
export function conectarAsistente(el: HTMLElement, getCode: () => string): void {
  const boton = el.querySelector<HTMLButtonElement>('[data-asistente]');
  const panel = el.querySelector<HTMLElement>('[data-asistente-panel]');
  if (!boton || !panel) return;

  const conCodigo = panel.querySelector<HTMLInputElement>('[data-a-codigo]')!;
  const conSalida = panel.querySelector<HTMLInputElement>('[data-a-salida]')!;
  const pregunta = panel.querySelector<HTMLTextAreaElement>('[data-a-pregunta]')!;
  const abrir = panel.querySelector<HTMLButtonElement>('[data-a-abrir]')!;
  const cerrar = panel.querySelector<HTMLButtonElement>('[data-a-cerrar]')!;
  const listo = panel.querySelector<HTMLElement>('[data-a-listo]')!;
  const respaldo = panel.querySelector<HTMLTextAreaElement>('[data-a-respaldo]')!;

  boton.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    listo.hidden = true;
    respaldo.hidden = true;
    if (!panel.hidden) pregunta.focus();
  });
  cerrar.addEventListener('click', () => { panel.hidden = true; });

  function armarMensaje(): string {
    const titulo = el.dataset.titulo || 'un ejercicio';
    const partes = [PROMPT_ASISTENTE, '', '---', '',
      `Estoy en la clase "${document.title.split('|')[0].trim()}", en el ejercicio "${titulo}".`];

    if (conCodigo.checked) {
      // innerText y no textContent: respeta los saltos de línea de lo que se
      // ve. Con textContent, el título de un recuadro quedaba pegado a su texto.
      const consigna = (el.querySelector<HTMLElement>('.ejercicio__consigna')?.innerText || '').trim();
      if (consigna) partes.push('', 'La consigna:', consigna);
      partes.push('', 'Mi código:', '```python', getCode().trimEnd(), '```');
    }

    const salida = el.querySelector<HTMLElement>('[data-salida]');
    if (conSalida.checked && salida && !salida.hidden && salida.textContent?.trim()) {
      partes.push('', 'Lo que me mostró al probarlo:', '```', salida.textContent.trim(), '```');
    }

    const q = pregunta.value.trim();
    partes.push('', q || '¿Me ayudás a entender qué me falta, sin darme la respuesta?');
    return partes.join('\n');
  }

  abrir.addEventListener('click', () => {
    const mensaje = armarMensaje();
    // La ventana se abre YA, en este mismo clic: si esperáramos a que termine
    // de copiar, el permiso para abrirla podría vencerse.
    window.open(URL_CLAUDE, '_blank', 'noopener');
    navigator.clipboard.writeText(mensaje).then(
      () => { listo.hidden = false; respaldo.hidden = true; },
      () => {
        // Sin permiso para el portapapeles (algunos navegadores lo niegan):
        // se muestra el texto seleccionado, para copiarlo con Ctrl+C.
        listo.hidden = true;
        respaldo.hidden = false;
        respaldo.value = mensaje;
        respaldo.focus();
        respaldo.select();
      },
    );
  });
}
