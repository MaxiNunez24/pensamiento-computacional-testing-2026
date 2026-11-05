/**
 * La encuesta de los cursos 2027 (/expo/encuesta/): las opciones, con el código que se guarda y lo que
 * se lee. La usan la página de la encuesta y el panel (para contar). El Worker de los catálogos tiene
 * los mismos códigos en ENCUESTA (worker/catalogos.js): si se agrega uno acá, va también allá.
 */

export const CURSOS = [
    { codigo: 'ia', texto: 'Usuaria/o de IA generativa', detalle: 'Usar la IA para escribir, dibujar, estudiar y trabajar' },
    { codigo: 'web', texto: 'Programador/a Web', detalle: 'Hacer páginas y aplicaciones web de cero' },
    { codigo: 'los-dos', texto: 'Los dos', detalle: '' },
] as const;

export const DIAS = [
    { codigo: 'lunes', texto: 'Lunes' },
    { codigo: 'martes', texto: 'Martes' },
    { codigo: 'miercoles', texto: 'Miércoles' },
    { codigo: 'jueves', texto: 'Jueves' },
    { codigo: 'viernes', texto: 'Viernes' },
    { codigo: 'sabado', texto: 'Sábado' },
] as const;

/**
 * Los horarios: cada uno es un bloque de una clase entera (3 h 20 min, como las del CFP), que la
 * persona corre a lo largo del día. Se guarda solo cuándo empieza, en minutos desde las 0:00
 * (13:20 → 800). El Worker valida lo mismo (ENCUESTA en worker/catalogos.js).
 */
export const HORARIO = {
    /** cuánto dura una clase, en minutos */
    duracion: 200,
    /** el día va de las 8 a las 22 */
    desde: 8 * 60,
    hasta: 22 * 60,
    /** se mueve de a 10 minutos */
    paso: 10,
    /** hasta cuántos bloques elige cada persona */
    maximo: 5,
} as const;

/** 800 → "13:20" */
export const hora = (minutos: number) => `${Math.floor(minutos / 60)}:${String(minutos % 60).padStart(2, '0')}`;
/** 800 → "13:20 a 16:40" */
export const franja = (inicio: number) => `${hora(inicio)} a ${hora(inicio + HORARIO.duracion)}`;

/** Una respuesta como la guarda el Worker (claves cortas: van en la metadata de KV, que tiene 1 KB). */
export interface Respuesta {
    /** curso */
    c: string;
    /** días */
    d: string[];
    /** horarios: cuándo empieza cada bloque, en minutos desde las 0:00 */
    h: number[];
    /** fecha, AAAA-MM-DDTHH:MM (UTC) */
    f: string;
    /** nombre, solo con consentimiento */
    n?: string;
    /** WhatsApp, solo con consentimiento */
    w?: string;
    /** comentario */
    k?: string;
}
