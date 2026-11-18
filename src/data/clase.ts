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

export const CLASE: Clase = {
    fecha: '2026-11-18',
    dia: 'Miércoles 18/11',
    titulo: 'De vuelta al sistema: del objeto a la página',
    leccion: 'clases/de-vuelta-al-sistema/',
    inicio: '13:20',
    antes: [
        { texto: 'Abrir la lección en el proyector', link: 'leccion' },
        { texto: 'Arrancar la grabación (OBS) y chequear que la imagen se mueva', nota: 'El 2/10 se congeló y se perdió la segunda parte.' },
        { texto: '¿Hay internet en el CFP?', nota: 'La Parte 3 necesita pip install flask. Si no hay, la Parte 3 va por el proyector.' },
        { texto: 'Flask instalado en la notebook, con modelo.py y app.py listos', nota: 'El plan B si no hay internet, y la demo si alguno se traba.' },
        { texto: 'Tomar asistencia' },
    ],
    bloques: [
        {
            titulo: '🗓️ De acá al 18/12',
            minutos: 10,
            items: [
                { texto: 'Mostrar la tabla de las 10 clases', ancla: '️-de-acá-al-18-de-diciembre', nota: 'La meta es una sola: que el sistema de asistencias ande de verdad, en el navegador y en la red del CFP.' },
                { texto: 'Preguntar quién terminó POO II y el bot (quedaron de tarea)', nota: 'El bot se sigue en casa: no hace falta para lo que viene. POO II se repasa hoy.' },
            ],
        },
        {
            titulo: '🎯 El problema',
            minutos: 5,
            items: [
                { texto: 'El Alumno vive en una sola compu; la preceptora quiere verlo en el navegador', ancla: 'el-problema' },
                { texto: 'Mostrar a dónde llegamos hoy: 127.0.0.1:5000/alumnos', nota: 'Los tres pasos: repasar, convertir a HTML, Flask.' },
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
            titulo: '🌐 Parte 3 · Flask en la compu',
            minutos: 60,
            items: [
                { texto: 'El diagrama: el navegador pide, Flask llama a tu función, la función devuelve el HTML', ancla: 'parte-3--flask-la-página-se-arma-cuando-alguien-la-pide', nota: 'La diferencia con el catálogo: la página se arma CADA VEZ que alguien entra.' },
                { texto: 'Paso 1 · Carpeta, entorno virtual y pip install flask', ancla: 'paso-1--la-carpeta-y-el-entorno-virtual', nota: 'Si PowerShell no deja activar: la flechita al lado del + → Command Prompt (como en el bot).' },
                { texto: 'Paso 2 y 3 · Copiar modelo.py y app.py', ancla: 'paso-2--el-modelo', nota: 'Lo único nuevo es @app.route: "cuando pidan esta dirección, llamá a esta función".' },
                { texto: 'Paso 4 · python app.py y probar las 4 direcciones', ancla: 'paso-4--correrlo', nota: 'Que prueben /alumno/99999999: el 404 sale del if de un_alumno(). Ctrl + C para frenarlo.' },
                { texto: 'Chequeo: ¿quién arma la página?', nota: 'Tu función pagina(). Flask solo atiende la puerta.' },
                { texto: 'Desafíos, si sobra tiempo', nota: 'El 3 (un link por alumno) muestra por qué conviene tener fila() aparte.' },
            ],
        },
        {
            titulo: '📌 Cierre',
            minutos: 10,
            items: [
                { texto: 'Los datos viven en memoria: si cierran app.py, las marcas se pierden', ancla: 'para-llevar', nota: 'Eso lo resuelve SQLite, la clase del viernes.' },
                { texto: 'Tarea: los ⭐ que falten, y POO II y el bot si quedaron' },
                { texto: 'Avisar: el viernes 20/11, SQLite', nota: 'Confirmar antes si hay clase (el feriado se corre al lunes 23).' },
            ],
        },
    ],
    despues: [
        { texto: 'Mandar el mensaje de WhatsApp con los ⭐ y sus links' },
        { texto: 'Contar cómo salió, para la bitácora' },
    ],
};
