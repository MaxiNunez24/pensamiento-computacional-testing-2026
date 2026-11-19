/**
 * La clase de hoy, para el checklist del profe en /clase/ (src/pages/clase.astro).
 *
 * Se reemplaza entero antes de cada clase: la página no cambia, solo estos datos. Lo tildado se
 * guarda en el navegador con la fecha, así una clase nueva arranca sin nada marcado.
 *
 * - `minutos` de cada bloque: la página calcula a qué hora debería arrancar cada uno, desde `inicio`.
 * - `ancla`: el id de la sección o el ejercicio dentro de la lección (los ejercicios son `ej-<título>`).
 * - `nota`: lo que conviene decir o recordar en ese punto, en chiquito debajo.
 */

export interface Item {
    texto: string;
    nota?: string;
    ancla?: string;
    link?: string;
    fundamental?: boolean;
}

export interface Bloque {
    titulo: string;
    minutos: number;
    items: Item[];
}

export interface Clase {
    fecha: string;          // 2026-11-18: la clave con que se guarda lo tildado
    dia: string;            // lo que se muestra
    titulo: string;
    leccion: string;        // ruta de la lección, sin la base (ej. 'clases/de-vuelta-al-sistema/')
    inicio: string;         // hora de arranque, para el horario de cada bloque
    antes: Item[];          // lo que hay que tener listo antes de empezar (sin horario)
    bloques: Bloque[];
    despues: Item[];        // lo que queda para después de la clase
}

const EDITOR_CATALOGO = 'https://cfp401-ensenada.github.io/catalogos/editar/';

export const CLASE: Clase = {
    fecha: '2026-11-20',
    dia: 'Viernes 20/11',
    titulo: 'SQLite: el sistema guarda en una base',
    leccion: 'clases/sqlite/',
    inicio: '13:20',
    antes: [
        { texto: 'Llevar el cable HDMI de 5 metros', nota: 'El miércoles 18/11 quedó en casa y se notó mucho la falta.' },
        { texto: 'Confirmar que hay clase', nota: 'El feriado se corre al lunes 23.' },
        { texto: 'Abrir la lección en el proyector', link: 'leccion' },
        { texto: 'Abrir "Editar mi catálogo" en otra pestaña', link: EDITOR_CATALOGO, nota: 'Para mostrar la actualización de la página al arrancar.' },
        { texto: 'Arrancar la grabación (OBS) y chequear que la imagen se mueva', nota: 'El 2/10 se congeló y se perdió la segunda parte.' },
        { texto: '¿Hay internet en el CFP?', nota: 'El primer ejercicio de SQLite baja la parte de bases de datos (unos segundos, una vez).' },
        { texto: 'Tomar asistencia' },
    ],
    bloques: [
        {
            titulo: '💬 Consultas de la tarea',
            minutos: 10,
            items: [
                { texto: 'Dudas de los ⭐ de "De vuelta al sistema"', nota: 'Y de POO II y el bot, si alguien los siguió en casa.' },
                { texto: '¿Alguien probó Flask en la compu?', nota: 'Optativo: se retoma el miércoles 25/11.' },
            ],
        },
        {
            titulo: '🛍️ Actualizar la página del catálogo',
            minutos: 15,
            items: [
                { texto: 'Por qué: catalogo.js tiene una versión nueva, y cada página de alumno tiene su copia', nota: 'Los catálogos que usan el catalogo.js compartido del CFP se actualizan solos: a esos el editor les dice "No tenés que hacer nada".' },
                { texto: 'Entrar a Editar mi catálogo con su código → Modo desarrollador', link: EDITOR_CATALOGO, nota: 'Ahí dice si la página tiene la versión vieja, y muestra los pasos.' },
                { texto: 'Copiar todo → Abrir catalogo.js en GitHub → hacer clic en el código, Ctrl + A y Ctrl + V', nota: 'GitHub pide entrar con la cuenta de cada uno.' },
                { texto: 'Commit changes… y otra vez Commit changes', nota: 'Esperar un par de minutos y tocar Revisar de nuevo: tiene que decir ✅ la versión nueva.' },
                { texto: 'Si dice "No pude revisar tu página"', nota: 'El link guardado está mal: se corrige desde el Admin con ✏️ Editar (antes, publicar el Worker).' },
            ],
        },
        {
            titulo: '🗃️ Parte 1 · Guardar y leer',
            minutos: 60,
            items: [
                { texto: 'Si el miércoles llegamos a arrancar, repasar rápido y seguir desde donde quedamos', nota: 'Tildar de una lo que ya se vio.' },
                { texto: 'El problema: con archivos, dos preceptoras guardando a la vez pierden marcas', ancla: 'el-problema', nota: 'Sin ningún error: dice que guardó y no guardó. SQLite viene con Python: no se instala nada.' },
                { texto: 'Chequeo: ¿por qué una base?', ancla: 'ej-chequeo-por-que-una-base' },
                { texto: 'Una tabla es una planilla con reglas · Tu primera tabla', ancla: 'una-tabla-es-una-planilla-con-reglas' },
                { texto: 'Agregar un alumno (el signo de pregunta)', ancla: 'ej-agregar-un-alumno', fundamental: true, nota: 'Por qué ? y no un f-string: el dato nunca se mezcla con la orden.' },
                { texto: 'Chequeo: ¿por qué el ?', ancla: 'ej-chequeo-por-que-el' },
                { texto: 'Leer: SELECT · Todos, en orden', ancla: 'leer-select' },
                { texto: 'Buscar por DNI', ancla: 'ej-buscar-por-dni', fundamental: true },
            ],
        },
        {
            titulo: '☕ Recreo',
            minutos: 15,
            items: [{ texto: 'Recreo' }],
        },
        {
            titulo: '🧱 Parte 2 · Que la base cuide los datos',
            minutos: 65,
            items: [
                { texto: 'El alumno que no se repite', ancla: 'ej-el-alumno-que-no-se-repite' },
                { texto: 'Otra forma: que la base diga que no', ancla: 'otra-forma-que-la-base-diga-que-no', nota: 'Conecta con Excepciones: intentar y atajar el error, en vez de buscar antes.' },
                { texto: 'Chequeo: buscar antes, o intentar', ancla: 'ej-chequeo-buscar-antes-o-intentar' },
                { texto: 'Dar de baja, sin borrar', ancla: 'ej-dar-de-baja-sin-borrar', fundamental: true, nota: 'Si se borra, se pierden sus asistencias. Un UPDATE de activo, no un DELETE.' },
                { texto: 'Chequeo: ¿DELETE o UPDATE?', ancla: 'ej-chequeo-delete-o-update' },
                { texto: '¿Cuántos siguen activos?', ancla: 'contar' },
                { texto: 'De la fila al objeto: el repositorio', ancla: 'ej-de-la-fila-al-objeto', fundamental: true, nota: 'El resto del sistema no sabe que hay una base: le pide Alumnos a repositorio.py. Es lo que usa Flask el 25/11.' },
            ],
        },
        {
            titulo: '💻 En tu compu',
            minutos: 25,
            items: [
                { texto: 'Mostrar cómo se ve en VS Code: el archivo .db que aparece', ancla: 'en-tu-compu' },
                { texto: 'La línea que conviene poner el primer día', ancla: 'la-línea-que-conviene-poner-el-primer-día' },
                { texto: 'Chequeo: el commit', ancla: 'ej-chequeo-el-commit', nota: 'Sin commit, lo que se guardó se pierde al cerrar.' },
            ],
        },
        {
            titulo: '📌 Cierre',
            minutos: 10,
            items: [
                { texto: 'Repasar lo de hoy', ancla: 'para-llevar' },
                { texto: 'Tarea: terminar SQLite (los ⭐ que falten)', nota: 'El miércoles arranca con las consultas.' },
                { texto: 'Avisar: el miércoles 25/11, Flask sobre la base', nota: 'La lista sale de SQLite, con un formulario de alta y otro para marcar asistencia.' },
                { texto: 'Avisar: inscripciones 2027 del 1 al 4/12 (IA generativa y Programador/a Web)', nota: 'Requisitos: 2 fotocopias del DNI y la cooperadora, mayores de 16. Que lo pasen a quien le pueda interesar.' },
            ],
        },
    ],
    despues: [
        { texto: 'Mandar el mensaje de WhatsApp con los ⭐ y sus links' },
        { texto: 'Contar cómo salió, para la bitácora' },
    ],
};
