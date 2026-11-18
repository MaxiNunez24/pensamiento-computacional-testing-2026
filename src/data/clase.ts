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

const SQLITE = '/pensamiento-computacional-testing-2026/ejercicios/clases/sqlite/';

export const CLASE: Clase = {
    fecha: '2026-11-18',
    dia: 'Miércoles 18/11',
    titulo: 'De vuelta al sistema: repaso de POO y, si llegamos, SQLite',
    leccion: 'clases/de-vuelta-al-sistema/',
    inicio: '13:20',
    antes: [
        { texto: 'Abrir la lección en el proyector', link: 'leccion' },
        { texto: 'Arrancar la grabación (OBS) y chequear que la imagen se mueva', nota: 'El 2/10 se congeló y se perdió la segunda parte.' },
        { texto: '¿Hay internet en el CFP?', nota: 'SQLite corre en la plataforma, pero el primer ejercicio baja la parte de bases de datos (unos segundos, una vez).' },
        { texto: 'Tomar asistencia' },
    ],
    bloques: [
        {
            titulo: '🗓️ De acá al 2/12',
            minutos: 10,
            items: [
                { texto: 'Mostrar la tabla: quedan 4 clases, la última el 2/12', ancla: '️-de-acá-al-2-de-diciembre', nota: 'El 4/12 son las inscripciones 2027. Lo que no entra en clase va de tarea, y cada clase arranca con consultas.' },
                { texto: 'Preguntar quién terminó POO II y el bot (quedaron de tarea)', nota: 'El bot se sigue en casa: no hace falta para lo que viene. POO II se repasa hoy.' },
            ],
        },
        {
            titulo: '🎯 El problema',
            minutos: 5,
            items: [
                { texto: 'El Alumno vive en una sola compu; la preceptora quiere verlo en el navegador', ancla: 'el-problema' },
                { texto: 'Mostrar el camino: repasar los objetos, convertirlos en HTML, y que se guarden (SQLite)', nota: 'La Parte 3 (Flask en la compu) queda de tarea: se retoma el miércoles 25/11.' },
            ],
        },
        {
            titulo: '🧬 Parte 1 · El Alumno y el Curso',
            minutos: 70,
            items: [
                { texto: 'Repasar la tabla: class, self, _marcas, __str__, raise, try', ancla: 'parte-1--el-alumno-y-el-curso' },
                { texto: 'Chequeo: ¿por qué _marcas?', nota: 'Encapsulamiento: la única puerta es marcar(), que controla.' },
                { texto: 'El Alumno completo', ancla: 'ej-el-alumno-completo', fundamental: true, nota: 'Lo nuevo: la marca mala ahora levanta ValueError (en POO II se ignoraba en silencio).' },
                { texto: 'El Curso que guarda a los alumnos', ancla: 'ej-el-curso-que-guarda-a-los-alumnos', fundamental: true, nota: 'Diccionario DNI → Alumno. buscar() devuelve None si no está: que no esté es una respuesta, no un error.' },
                { texto: 'Cargar la planilla sin que se caiga', ancla: 'ej-cargar-la-planilla-sin-que-se-caiga', fundamental: true, nota: 'La clave: el try va ADENTRO del for. Un solo except ValueError ataja el DNI roto y el repetido.' },
            ],
        },
        {
            titulo: '☕ Recreo',
            minutos: 15,
            items: [{ texto: 'Recreo' }],
        },
        {
            titulo: '🛍️ Parte 2 · Del objeto a la página',
            minutos: 30,
            items: [
                { texto: 'Recordar el catálogo: Python arma texto, y ese texto es HTML', ancla: 'parte-2--del-objeto-a-la-página' },
                { texto: 'Un alumno, un renglón', ancla: 'ej-un-alumno-un-renglon', nota: 'El {alumno} del f-string usa el __str__ de la Parte 1. Mostrar la vista que aparece al Ejecutar.' },
                { texto: 'La página del curso', ancla: 'ej-la-pagina-del-curso', fundamental: true, nota: 'Ojo con el curso vacío: va el <p>, no una <ul> vacía.' },
            ],
        },
        {
            titulo: '🗃️ Si llegamos: arrancar SQLite',
            minutos: 60,
            items: [
                { texto: 'El problema: los objetos viven en memoria; al cerrar el programa, se pierde todo', link: `${SQLITE}#el-problema`, nota: 'Y con archivos, dos preceptoras guardando a la vez pierden marcas sin ningún error. SQLite viene con Python: no se instala nada.' },
                { texto: 'Chequeo: ¿por qué una base?', link: `${SQLITE}#ej-chequeo-por-que-una-base` },
                { texto: 'Una tabla es una planilla con reglas · Tu primera tabla', link: `${SQLITE}#una-tabla-es-una-planilla-con-reglas` },
                { texto: 'Agregar un alumno (el signo de pregunta)', link: `${SQLITE}#ej-agregar-un-alumno`, fundamental: true, nota: 'Por qué ? y no un f-string: el dato nunca se mezcla con la orden.' },
                { texto: 'Leer con SELECT · Buscar por DNI', link: `${SQLITE}#ej-buscar-por-dni`, fundamental: true, nota: 'Hasta donde lleguemos: el resto de SQLite sigue el viernes.' },
            ],
        },
        {
            titulo: '📌 Cierre',
            minutos: 10,
            items: [
                { texto: 'Repasar lo de hoy: el Alumno y el Curso, el HTML que sale de los objetos', ancla: 'para-llevar' },
                { texto: 'Tarea: los ⭐ que falten, y POO II y el bot si quedaron' },
                { texto: 'Tarea optativa: la Parte 3 (Flask en la compu)', ancla: 'parte-3--flask-la-página-se-arma-cuando-alguien-la-pide', nota: 'Necesita pip install flask. Se retoma el 25/11, y las dudas se consultan en clase.' },
                { texto: 'Avisar: el viernes 20/11 seguimos con SQLite', nota: 'Confirmar antes si hay clase (el feriado se corre al lunes 23).' },
                { texto: 'Avisar: inscripciones 2027 del 1 al 4/12 (IA generativa y Programador/a Web)', nota: 'Requisitos: 2 fotocopias del DNI y la cooperadora.' },
            ],
        },
    ],
    despues: [
        { texto: 'Mandar el mensaje de WhatsApp con los ⭐ y sus links' },
        { texto: 'Contar cómo salió, para la bitácora' },
    ],
};
